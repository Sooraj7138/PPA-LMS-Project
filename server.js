import dotenv from "dotenv";
import express from "express";
import sql from "mssql";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

app.get("/", (req, res) => res.send("Server is up"));

app.get("/api/LesseeFullView", async (req, res) => {
  try {
    const p = await getPool();
    const result = await p.request().query("SELECT * FROM LesseeFullView");
    console.log("RES ",result)
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

app.get("/api/LandData", async (req, res) => {
  try {
    const p = await getPool();
    const result = await p.request().query("SELECT * FROM LandData");
    console.log("RES ",result)
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
