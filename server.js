import dotenv from "dotenv";
import express from "express";
import sql from "mssql";
import cors from "cors";
import crypto from "crypto";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_ISSUER = process.env.JWT_ISSUER || "ppa-lms-api";
const ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_TTL || "8h";
const ACCESS_TOKEN_REMEMBER_TTL = process.env.JWT_ACCESS_TTL_REMEMBER || "7d";
const ALLOWED_ROLES = new Set(["User", "Manager", "Admin"]);
const MAX_FAILED_ATTEMPTS = Number(process.env.AUTH_MAX_FAILED_ATTEMPTS || 5);
const BLOCK_WINDOW_MS = Number(process.env.AUTH_BLOCK_WINDOW_MS || 15 * 60 * 1000);
const BLOCK_DURATION_MS = Number(process.env.AUTH_BLOCK_DURATION_MS || 15 * 60 * 1000);

if (!JWT_SECRET) {
  console.warn(
    "Warning: JWT_SECRET is not set. Set JWT_SECRET in .env before using authentication in production."
  );
}

const dbConfig = {
  user: process.env.DB_USER, //lmslog
  password: process.env.DB_PASSWORD, //lmsppap
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
  },
};

let pool;
async function getPool() {
  if (!pool) pool = await sql.connect(dbConfig);
  return pool;
}

const loginAttemptState = new Map();

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function hashPassword(plainPassword, saltHex = crypto.randomBytes(16).toString("hex")) {
  const N = 16384;
  const r = 8;
  const p = 1;
  const keyLen = 64;
  const derived = crypto.scryptSync(plainPassword, Buffer.from(saltHex, "hex"), keyLen, {
    N,
    r,
    p,
    maxmem: 64 * 1024 * 1024,
  });
  return `scrypt$${N}$${r}$${p}$${saltHex}$${derived.toString("hex")}`;
}

function verifyPassword(plainPassword, storedHash) {
  if (!storedHash || typeof storedHash !== "string") return false;
  const [algo, nValue, rValue, pValue, saltHex, hashHex] = storedHash.split("$");
  if (algo !== "scrypt" || !nValue || !rValue || !pValue || !saltHex || !hashHex) return false;

  const N = Number(nValue);
  const r = Number(rValue);
  const p = Number(pValue);
  if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p)) return false;

  const derived = crypto.scryptSync(
    plainPassword,
    Buffer.from(saltHex, "hex"),
    Buffer.from(hashHex, "hex").length,
    {
      N,
      r,
      p,
      maxmem: 64 * 1024 * 1024,
    }
  );

  return crypto.timingSafeEqual(derived, Buffer.from(hashHex, "hex"));
}

function issueAccessToken(user, rememberMe = false) {
  const payload = {
    sub: user.userId,
    username: user.username,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, {
    issuer: JWT_ISSUER,
    expiresIn: rememberMe ? ACCESS_TOKEN_REMEMBER_TTL : ACCESS_TOKEN_TTL,
  });
}

function getAttemptKey(req, usernameNormalized) {
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  return `${usernameNormalized}:${ip}`;
}

function isBlockedAttempt(attempt) {
  return Boolean(attempt?.blockedUntil && attempt.blockedUntil > Date.now());
}

function registerFailedAttempt(key) {
  const now = Date.now();
  const current = loginAttemptState.get(key);
  if (!current || now - current.firstAttemptAt > BLOCK_WINDOW_MS) {
    loginAttemptState.set(key, { count: 1, firstAttemptAt: now, blockedUntil: null });
    return;
  }

  const nextCount = current.count + 1;
  const blockedUntil = nextCount >= MAX_FAILED_ATTEMPTS ? now + BLOCK_DURATION_MS : null;
  loginAttemptState.set(key, { count: nextCount, firstAttemptAt: current.firstAttemptAt, blockedUntil });
}

function clearFailedAttempts(key) {
  loginAttemptState.delete(key);
}

async function recordAuthEvent({
  userId = null,
  usernameAttempt = null,
  actionType,
  status,
  reason = null,
  ipAddress = null,
  userAgent = null,
}) {
  try {
    const p = await getPool();
    await p
      .request()
      .input("userId", sql.Int, userId)
      .input("usernameAttempt", sql.NVarChar(120), usernameAttempt)
      .input("actionType", sql.NVarChar(30), actionType)
      .input("status", sql.NVarChar(20), status)
      .input("reason", sql.NVarChar(300), reason)
      .input("ipAddress", sql.NVarChar(60), ipAddress)
      .input("userAgent", sql.NVarChar(300), userAgent)
      .query(`
        INSERT INTO dbo.AuthAuditLogs
          (UserID, UsernameAttempt, ActionType, Status, Reason, IPAddress, UserAgent)
        VALUES
          (@userId, @usernameAttempt, @actionType, @status, @reason, @ipAddress, @userAgent)
      `);
  } catch (err) {
    console.error("Auth audit log error:", err.message);
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid authorization token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER });
    req.user = {
      userId: Number(payload.sub),
      username: payload.username,
      role: payload.role,
    };
    next();
  } catch {
    return res.status(401).json({ error: "Token is invalid or expired" });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied for this role" });
    }
    next();
  };
}

app.get("/", (req, res) => res.send("Server is up"));

app.post("/api/auth/login", async (req, res) => {
  const username = String(req.body?.username || "").trim();
  const usernameNormalized = normalizeUsername(username);
  const password = String(req.body?.password || "");
  const requestedRole = String(req.body?.role || "").trim();
  const rememberMe = Boolean(req.body?.rememberMe);
  const ipAddress = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null;
  const userAgent = req.headers["user-agent"] || null;

  if (!JWT_SECRET) {
    return res.status(500).json({ error: "Server auth configuration is incomplete" });
  }

  if (!usernameNormalized || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  if (requestedRole && !ALLOWED_ROLES.has(requestedRole)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const attemptKey = getAttemptKey(req, usernameNormalized);
  const attempt = loginAttemptState.get(attemptKey);
  if (isBlockedAttempt(attempt)) {
    return res.status(429).json({ error: "Too many failed attempts. Try again later." });
  }

  try {
    const p = await getPool();
    const result = await p
      .request()
      .input("usernameNormalized", sql.NVarChar(120), usernameNormalized)
      .query(`
        SELECT
          u.UserID,
          u.Username,
          u.DisplayName,
          u.PasswordHash,
          u.IsActive,
          r.RoleName
        FROM dbo.Users u
        INNER JOIN dbo.Roles r ON r.RoleID = u.RoleID
        WHERE u.UsernameNormalized = @usernameNormalized
      `);

    const row = result.recordset[0];
    const badCredResponse = { error: "Invalid username or password" };
    if (!row || !row.IsActive || !verifyPassword(password, row.PasswordHash)) {
      registerFailedAttempt(attemptKey);
      await recordAuthEvent({
        usernameAttempt: usernameNormalized,
        actionType: "LOGIN",
        status: "FAIL",
        reason: "Invalid credentials",
        ipAddress,
        userAgent,
      });
      return res.status(401).json(badCredResponse);
    }

    if (requestedRole && requestedRole !== row.RoleName) {
      registerFailedAttempt(attemptKey);
      await recordAuthEvent({
        userId: row.UserID,
        usernameAttempt: usernameNormalized,
        actionType: "LOGIN",
        status: "FAIL",
        reason: "Role mismatch",
        ipAddress,
        userAgent,
      });
      return res.status(403).json({ error: "Selected role does not match this account" });
    }

    clearFailedAttempts(attemptKey);
    const user = {
      userId: Number(row.UserID),
      username: row.Username,
      displayName: row.DisplayName || row.Username,
      role: row.RoleName,
    };
    await p
      .request()
      .input("userId", sql.Int, user.userId)
      .query("UPDATE dbo.Users SET LastLoginAt = SYSUTCDATETIME(), UpdatedAt = SYSUTCDATETIME() WHERE UserID = @userId");
    const accessToken = issueAccessToken(user, rememberMe);

    await recordAuthEvent({
      userId: row.UserID,
      usernameAttempt: usernameNormalized,
      actionType: "LOGIN",
      status: "SUCCESS",
      reason: null,
      ipAddress,
      userAgent,
    });

    return res.json({
      token: accessToken,
      user: {
        id: user.userId,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Authentication failed" });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const p = await getPool();
    const result = await p
      .request()
      .input("userId", sql.Int, req.user.userId)
      .query(`
        SELECT
          u.UserID,
          u.Username,
          u.DisplayName,
          u.IsActive,
          r.RoleName
        FROM dbo.Users u
        INNER JOIN dbo.Roles r ON r.RoleID = u.RoleID
        WHERE u.UserID = @userId
      `);

    const row = result.recordset[0];
    if (!row || !row.IsActive) {
      return res.status(401).json({ error: "User session is no longer valid" });
    }

    return res.json({
      user: {
        id: Number(row.UserID),
        username: row.Username,
        displayName: row.DisplayName || row.Username,
        role: row.RoleName,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Session check failed" });
  }
});

app.post("/api/auth/change-password", authenticateToken, async (req, res) => {
  const currentPassword = String(req.body?.currentPassword || "");
  const newPassword = String(req.body?.newPassword || "");
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new passwords are required" });
  }
  if (newPassword.length < 12) {
    return res.status(400).json({ error: "New password must be at least 12 characters" });
  }

  try {
    const p = await getPool();
    const userResult = await p
      .request()
      .input("userId", sql.Int, req.user.userId)
      .query("SELECT UserID, PasswordHash, IsActive FROM dbo.Users WHERE UserID = @userId");

    const row = userResult.recordset[0];
    if (!row || !row.IsActive || !verifyPassword(currentPassword, row.PasswordHash)) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const nextHash = hashPassword(newPassword);
    await p
      .request()
      .input("userId", sql.Int, req.user.userId)
      .input("passwordHash", sql.NVarChar(sql.MAX), nextHash)
      .query(`
        UPDATE dbo.Users
        SET PasswordHash = @passwordHash, UpdatedAt = SYSUTCDATETIME()
        WHERE UserID = @userId
      `);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Password update failed" });
  }
});

app.get("/api/LesseeFullView", authenticateToken, authorizeRoles("Manager", "Admin"), async (req, res) => {
  try {
    const p = await getPool();
    const result = await p.request().query("SELECT * FROM LesseeFullView");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

app.get("/api/LandData", authenticateToken, authorizeRoles("Manager", "Admin"), async (req, res) => {
  try {
    const p = await getPool();
    const result = await p.request().query("SELECT * FROM LandData");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

app.get("/api/EoiTable", authenticateToken, authorizeRoles("Manager", "Admin"), async (req, res) => {
  try {
    const p = await getPool();
    const result = await p.request().query("SELECT * FROM EOITable");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

app.get("/api/DemandNotes", authenticateToken, authorizeRoles("Manager", "Admin"), async (req, res) => {
  try {
    const p = await getPool();
    const result = await p.request().query("SELECT * FROM DemandNotes");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

app.get("/api/UserData", authenticateToken, authorizeRoles("Manager", "Admin", "User"), async (req, res) => {
  try {
    const p = await getPool();
    let result;
    if (req.user?.role === "User") {
      // User accounts should see only their own rows.
      result = await p
        .request()
        .input("authUserId", sql.Int, Number(req.user.userId) || null)
        .input("username", sql.NVarChar(120), String(req.user.username || ""))
        .query(`
          SELECT *
          FROM UserData
          WHERE UserID = @authUserId
             OR LOWER(LTRIM(RTRIM(Username))) = LOWER(LTRIM(RTRIM(@username)))
        `);
    } else {
      result = await p.request().query("SELECT * FROM UserData");
    }
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

// app.get("/api/lessee/:id", async (req, res) => {
//   try {
//     const p = await getPool();
//     const result = await p
//       .request()
//       .input("id", sql.Int, Number(req.params.id))
//       .query("SELECT * FROM Lessee WHERE LesseeID = @id");
//     res.json(result.recordset[0] || null);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "DB query failed" });
//   }
// });

app.listen(process.env.PORT || 5000, () => {
  console.log(`API running on port ${process.env.PORT || 5000}`);
});
