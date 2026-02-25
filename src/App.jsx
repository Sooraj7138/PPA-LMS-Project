'use client';

import { useState, useMemo, useRef, useEffect } from 'react'
import './style.css'
import ManagerDashboard from './ManagerDashboard'

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const EMPTY_MANAGER_DATA = { lesseeData: [], landData: [], eoiData: [], demandNotes: [] };
const STORAGE_KEYS = {
  activePage: "lms_active_page",
  role: "lms_role",
  authToken: "lms_auth_token",
  authUser: "lms_auth_user",
};

function readStoredRole() {
  if (typeof window === "undefined") return "User";
  return localStorage.getItem(STORAGE_KEYS.role) || "User";
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState(() => {
    if (typeof window === "undefined") return "home";
    return localStorage.getItem(STORAGE_KEYS.activePage) || "home";
  });
  const [role, setRole] = useState(() => readStoredRole());
  const [loginForm, setLoginForm] = useState({ username: "", password: "", rememberMe: false });
  const [loginError, setLoginError] = useState("");
  const [loginPending, setLoginPending] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [authToken, setAuthToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(STORAGE_KEYS.authToken) || sessionStorage.getItem(STORAGE_KEYS.authToken) || "";
  });
  const [authUser, setAuthUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem(STORAGE_KEYS.authUser) || sessionStorage.getItem(STORAGE_KEYS.authUser);
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });
  const usernameRef = useRef(null);
  const tabRefs = useRef([]);
  const [allData, setAllData] = useState({ lesseeData: [], landData: [], eoiData: [], demandNotes: [] });
  const [managerPage, setManagerPage] = useState("generate-demand");
  const managerDataRequestsRef = useRef(new Map());


  useEffect(() => {
    async function hydrateSession() {
      if (!authToken) {
        setSessionReady(true);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        const user = data?.user || null;
        setAuthUser(user);
        if (user?.role) setRole(user.role);
        if (user?.role === "Manager" || user?.role === "Admin") {
          setActivePage("manager-dashboard");
        }
      } catch {
        setAuthToken("");
        setAuthUser(null);
        localStorage.removeItem(STORAGE_KEYS.authToken);
        sessionStorage.removeItem(STORAGE_KEYS.authToken);
        localStorage.removeItem(STORAGE_KEYS.authUser);
        sessionStorage.removeItem(STORAGE_KEYS.authUser);
      } finally {
        setSessionReady(true);
      }
    }
    hydrateSession();
  }, [authToken]);

  useEffect(() => {
    if (!sessionReady) return;
    const canLoadManagerData = Boolean(authToken) && (role === "Manager" || role === "Admin");
    if (!canLoadManagerData) {
      setAllData(EMPTY_MANAGER_DATA);
      managerDataRequestsRef.current.clear();
      return;
    }

    function fetchJson(url) {
      return fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const msg = typeof data?.error === "string" ? data.error : `HTTP ${res.status}`;
          throw new Error(msg);
        }
        return data;
      });
    }

    const requestKey = `${API_BASE}|${authToken}`;
    let requestPromise = managerDataRequestsRef.current.get(requestKey);

    if (!requestPromise) {
      requestPromise = Promise.all([
        fetchJson(`${API_BASE}/api/LesseeFullView`),
        fetchJson(`${API_BASE}/api/LandData`),
        fetchJson(`${API_BASE}/api/EoiTable`),
        fetchJson(`${API_BASE}/api/DemandNotes`),
      ])
        .then(([lessee, land, eoi, demand]) => ({
          lesseeData: Array.isArray(lessee) ? lessee : [],
          landData: Array.isArray(land) ? land : [],
          eoiData: Array.isArray(eoi) ? eoi : [],
          demandNotes: Array.isArray(demand) ? demand : [],
        }))
        .catch((error) => {
          managerDataRequestsRef.current.delete(requestKey);
          throw error;
        });

      managerDataRequestsRef.current.set(requestKey, requestPromise);
    }

    let cancelled = false;
    requestPromise
      .then((payload) => {
        if (!cancelled) setAllData(payload);
      })
      .catch(() => {
        if (!cancelled) setAllData(EMPTY_MANAGER_DATA);
      });

    return () => {
      cancelled = true;
    };
  }, [authToken, role, sessionReady]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activePage, activePage);
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.role, role);
  }, [role]);

  useEffect(() => {
    if (sessionReady && activePage === "manager-dashboard" && !authToken) {
      setActivePage("login");
    }
  }, [activePage, authToken, sessionReady]);
  

  // useEffect(() => {
  //     if (!Array.isArray(lesseeData) || lesseeData.length === 0) return;

  //     lesseeData.forEach((row, index) => {
  //       setNames(lesseeData.map((row)=>row.LesseeName))
  //     });
  //   }, [lesseeData]);

  //   useEffect(() => {
  //     if (!Array.isArray(landData) || landData.length === 0) return;

  //     landData.forEach((row, index) => {
  //       setNames(landData.map((row)=>row.LandName))
  //     });
  //   }, [landData]);
  // useEffect(() => {
  //   if (!Array.isArray(allData) || allData.length === 0) return;

  //   allData.forEach((row, index) => {
  //     setAllData(allData.map((row)=>row.LesseeName))
  //   });
  // }, [allData]);

  const roleConfig = useMemo(
    () => ({
      User: {
        usernameLabel: "Username (User)",
        placeholder: "Enter your User ID",
      },
      Manager: {
        usernameLabel: "Manager ID",
        placeholder: "Enter your Manager ID",
      },
      Admin: {
        usernameLabel: "Administrator ID",
        placeholder: "Enter your Administrator ID",
      },
    }),
    []
  );

  function closeMobileMenu() {
    setMenuOpen(false);
  }

  function onHomeClick(e) {
    e.preventDefault();
    closeMobileMenu();
    setActivePage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoginError("");
    setLoginPending(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginForm.username.trim(),
          password: loginForm.password,
          role,
          rememberMe: loginForm.rememberMe,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      const token = data?.token || "";
      const user = data?.user || null;
      if (!token || !user) throw new Error("Invalid login response");

      setAuthToken(token);
      setAuthUser(user);
      setRole(user.role || role);

      const targetStorage = loginForm.rememberMe ? localStorage : sessionStorage;
      const otherStorage = loginForm.rememberMe ? sessionStorage : localStorage;
      targetStorage.setItem(STORAGE_KEYS.authToken, token);
      targetStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
      otherStorage.removeItem(STORAGE_KEYS.authToken);
      otherStorage.removeItem(STORAGE_KEYS.authUser);

      setLoginForm({ username: "", password: "", rememberMe: loginForm.rememberMe });
      if (user.role === "Manager" || user.role === "Admin") {
        setManagerPage("generate-demand");
        setActivePage("manager-dashboard");
      } else {
        setActivePage("home");
      }
    } catch (err) {
      setLoginError(err.message || "Unable to sign in");
    } finally {
      setLoginPending(false);
    }
  }

  function onLogout() {
    setAuthToken("");
    setAuthUser(null);
    setLoginError("");
    setManagerPage("generate-demand");
    setActivePage("home");
    setRole("User");
    localStorage.removeItem(STORAGE_KEYS.authToken);
    sessionStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.authUser);
    sessionStorage.removeItem(STORAGE_KEYS.authUser);
  }

  function onLoginClick(e) {
    e.preventDefault();
    closeMobileMenu();
    setLoginError("");
    setActivePage("login");
    window.setTimeout(() => {
      if (usernameRef.current) {
        usernameRef.current.focus();
      }
    }, 250);
  }

  function onPlaceholderNavClick(e, message) {
    e.preventDefault();
    closeMobileMenu();
    alert(message);
  }

  function onTabKeyDown(e, idx) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (idx + dir + tabRefs.current.length) % tabRefs.current.length;
    const nextBtn = tabRefs.current[next];
    if (nextBtn) nextBtn.focus();
  }

  function onLoginInputChange(e) {
    const { name, value, type, checked } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const activeTabClasses = "bg-white border border-slate-200 text-slate-900 shadow-sm";
  const roleDetails = roleConfig[role];
  const isAuthenticated = Boolean(authToken && authUser);
  const isHomePage = activePage === "home";
  const isLoginPage = activePage === "login";
  const isManagerDashboard = activePage === "manager-dashboard" && isAuthenticated && (role === "Manager" || role === "Admin");
  const managerNavItems = [
    { id: "generate-demand", label: "Generate Demand Note", icon: "lucide-file-plus" },
    { id: "master-land", label: "Master Land Data", icon: "lucide-map-pin" },
    { id: "user-data", label: "User's Data", icon: "lucide-users" },
    { id: "demand-status", label: "Status of Demand Note", icon: "lucide-check-square" },
    { id: "user-eoi", label: "View User's EOI", icon: "lucide-handshake" },
  ];

  return (
    <div className={`body-container bg-[#f5f7fa] text-[#0b1f3b] text-base leading-relaxed ${isManagerDashboard ? "manager-dashboard-active" : ""}`.trim()}>
      <header className="header-container pb-4" id="i02u8">
        <div className="gov-accent-strip" aria-hidden="true"></div>
        <div className="header-bar" id="imhzx">
          <div className="header-brand-group" id="i2x59">
            <img
              src="https://app.grapesjs.com/api/assets/random-image?query=government%20seal&w=72&h=72"
              alt="Government Seal"
              className="header-brand-logo"
              id="ihe6o"
            />
            <div className="header-brand-text" id="ip0pt">
              <span className="header-agency-name" id="irqny">
                Paradip Port Authority
              </span>
              <span className="header-portal-label" id="i1ppm">
                Land Data Management System
              </span>
            </div>
          </div>
          <div className="hidden md:block" id="idxxz">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/160px-Flag_of_India.svg.png"
              alt="Indian Flag"
              className="h-10 w-auto rounded-sm object-cover ring-1 ring-slate-300"
            />
          </div>
        </div>

        <nav className="primary-nav mt-5 rounded-lg bg-[#0b1f3b] text-white shadow-sm" aria-label="Primary Navigation">
          <div className="flex items-center justify-between px-4 py-2.5">
            <button
              type="button"
              id="nav-toggle"
              className="inline-flex items-center rounded-md border border-white/30 px-3 py-1.5 text-sm md:hidden"
              aria-expanded={menuOpen ? "true" : "false"}
              aria-controls="primary-nav-links"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              Menu
            </button>
            <ul
              id="primary-nav-links"
              className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-1 text-sm font-medium md:flex md:flex-row md:items-center md:gap-2 ${isManagerDashboard ? "md:flex-1" : "md:w-auto"}`}
            >
              {isManagerDashboard ? (
                <>
                  {managerNavItems.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setManagerPage(item.id)}
                        className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          managerPage === item.id ? "bg-white text-[#0b1f3b]" : "text-white hover:bg-white/10"
                        }`}
                      >
                        <img
                          src={`https://api.iconify.design/${item.icon}.svg?color=${managerPage === item.id ? "%230b1f3b" : "white"}`}
                          alt=""
                          className="w-4 h-4 mr-2"
                        />
                        {item.label}
                      </button>
                    </li>
                  ))}
                  <li className="md:ml-auto">
                    <button
                      type="button"
                      onClick={onLogout}
                      className="inline-flex items-center rounded-md px-3 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-500 active:bg-red-700 transition-colors shadow-sm ring-1 ring-red-400/50"
                    >
                      <img
                        src="https://api.iconify.design/lucide-log-out.svg?color=white"
                        alt=""
                        className="w-4 h-4 mr-2"
                      />
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a
                      href="#"
                      id="home-link"
                      className={`nav-link block rounded-md px-3 py-2 hover:bg-white/10 ${isHomePage ? "nav-link-active" : ""}`.trim()}
                      onClick={onHomeClick}
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      id="about-link"
                      className="nav-link block rounded-md px-3 py-2 hover:bg-white/10"
                      onClick={(e) => onPlaceholderNavClick(e, "About page will be implemented soon.")}
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      id="services-link"
                      className="nav-link block rounded-md px-3 py-2 hover:bg-white/10"
                      onClick={(e) => onPlaceholderNavClick(e, "Services page will be implemented soon.")}
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      id="contact-link"
                      className="nav-link block rounded-md px-3 py-2 hover:bg-white/10"
                      onClick={(e) => onPlaceholderNavClick(e, "Contact page will be implemented soon.")}
                    >
                      Contact
                    </a>
                  </li>
                  <li className="md:ml-2">
                    <a
                      href="#"
                      id="login-link"
                      className={`nav-cta-link block rounded-md px-3 py-2 hover:bg-white/20 ${isLoginPage || isManagerDashboard ? "nav-cta-link-active" : ""}`.trim()}
                      onClick={isAuthenticated ? (e) => e.preventDefault() : onLoginClick}
                    >
                      {isAuthenticated ? "Authenticated" : "Land Login"}
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>

      <main className={`main-content ${activePage !== "home" ? "max-w-[72rem]" : "max-w-[90rem]"} ${isManagerDashboard ? "main-content-wide" : ""}`.trim()} id="ithhf">
        {activePage === "home" && (
          <section className="home-page-section" id="home-page">
            <div className="home-showcase-card">
              <div className="home-showcase-header">
                <h2 className="home-showcase-title">Online Land Management Payment System</h2>
                <p className="home-showcase-subtitle">
                  Unified digital platform for lease, market, license, ROW, and open-space land records at Paradip Port Authority.
                </p>
              </div>
              <div className="home-showcase-media">
                <img
                  src="./src/assets/ppt.jpg"
                  alt="Port operations and cargo terminals"
                  className="home-showcase-image"
                />
              </div>
              <div className="home-showcase-footer">
                <span className="home-pill">Land Services</span>
                <span className="home-pill">Demand Notes</span>
                <span className="home-pill">Secure Payments</span>
                <span className="home-pill">EOI Tracking</span>
              </div>
            </div>
          </section>
        )}

        {activePage === "login" && (
          <section className="login-section" id="i9ui5">
          <div className="intro-panel" id="ipsd4">
            <div className="intro-card rounded-xl border border-slate-200" id="ik32b">
              <h1 className="intro-title text-[28px] leading-[1.25] text-[#0b1f3b]" id="i1rcq">
                LMS Portal Login
              </h1>
              <p className="intro-subtitle" id="i27o8">
                Secure access for authorized personnel. Select your role to proceed with authentication.
              </p>
              <div className="intro-stat-strip">
                <div className="intro-stat-item">
                  <span className="intro-stat-value">24x7</span>
                  <span className="intro-stat-label">System Availability</span>
                </div>
                <div className="intro-stat-item">
                  <span className="intro-stat-value">Role-Based</span>
                  <span className="intro-stat-label">Access Control</span>
                </div>
                <div className="intro-stat-item">
                  <span className="intro-stat-value">Audited</span>
                  <span className="intro-stat-label">Activity Logging</span>
                </div>
              </div>
              <div className="benefits-grid" id="i3okh">
                <div className="benefit-item" id="i8mos">
                  <img
                    src="https://api.iconify.design/lucide-lock.svg?color=%230b1f3b"
                    alt=""
                    className="benefit-icon"
                    id="ijksj"
                  />
                  <div className="benefit-content" id="idkkg">
                    <div className="benefit-title" id="ikvxl">
                      Encrypted Sessions
                    </div>
                    <div className="benefit-description" id="in597">
                      All connections are protected with industry standards.
                    </div>
                  </div>
                </div>
                <div className="benefit-item" id="iveyu">
                  <img
                    src="https://api.iconify.design/lucide-shield-check.svg?color=%230b1f3b"
                    alt=""
                    className="benefit-icon"
                    id="iqeek"
                  />
                  <div className="benefit-content" id="ins8d">
                    <div className="benefit-title" id="iatql">
                      Verified Roles
                    </div>
                    <div className="benefit-description" id="i7yvy">
                      Role-based access ensures appropriate permissions.
                    </div>
                  </div>
                </div>
                <div className="benefit-item" id="i6brl">
                  <img
                    src="https://api.iconify.design/lucide-headphones.svg?color=%230b1f3b"
                    alt=""
                    className="benefit-icon"
                    id="inlvh"
                  />
                  <div className="benefit-content" id="iplzr">
                    <div className="benefit-title" id="ilevk">
                      24/7 Support
                    </div>
                    <div className="benefit-description" id="invz3">
                      Assistance available for registered users.
                    </div>
                  </div>
                </div>
              </div>
              <div className="intro-assurance-banner">
                <span className="intro-assurance-title">Operational Assurance:</span>
                <span className="intro-assurance-text">
                  All submissions are time-stamped and processed through verified departmental workflows.
                </span>
              </div>
            </div>
          </div>

          <div className="form-panel" id="ic8qd">
            <div className="form-card rounded-xl border border-slate-200" id="ibk2g">
              <div className="form-header" id="i7gcf">
                <div className="form-header-title-group" id="i1mmk">
                  <img
                    src="https://api.iconify.design/lucide-log-in.svg?color=%230b1f3b"
                    alt=""
                    className="form-header-icon"
                    id="iwexi"
                  />
                  <h2 className="form-title text-[22px] leading-[1.35] text-[#0b1f3b]" id="i2nkg">
                    Sign in
                  </h2>
                </div>
                <span id="selectedRoleBadge" aria-live="polite" className="form-role-badge">
                  Role: {role}
                </span>
              </div>

              <div className="role-selector-block" id="ik0t3">
                <div className="role-selector-label" id="iucpx">
                  Select login type
                </div>
                <div role="tablist" aria-label="Login types" className="role-tabs" id="iqz5m">
                  {["User", "Manager", "Admin"].map((item, idx) => (
                    <button
                      key={item}
                      type="button"
                      role="tab"
                      aria-selected={item === role}
                      id={`tab-${item.toLowerCase()}`}
                      data-role={item}
                      className={`role-tab-button ${item === role ? activeTabClasses : ""}`.trim()}
                      ref={(el) => (tabRefs.current[idx] = el)}
                      onClick={() => {
                        setRole(item);
                        setLoginError("");
                      }}
                      onKeyDown={(e) => onTabKeyDown(e, idx)}
                    >
                      <img
                        src={
                          item === "User"
                            ? "https://api.iconify.design/lucide-user.svg?color=%230b1f3b"
                            : item === "Manager"
                            ? "https://api.iconify.design/lucide-briefcase.svg?color=%234b5563"
                            : "https://api.iconify.design/lucide-shield.svg?color=%234b5563"
                        }
                        alt=""
                        className="role-tab-icon"
                      />{" "}
                      {item}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="role" id="roleInput" value={role} />
              </div>

              <form onSubmit={handleLoginSubmit} className="login-form" id="iq3jf">
                <div className="form-field-group" id="igzd8">
                  <label htmlFor="username" id="usernameLabel" className="form-field-label">
                    {roleDetails.usernameLabel}
                  </label>
                  <div className="form-field-control" id="ienm2">
                    <span className="form-field-icon-wrap" id="ifbtd">
                      <img
                        src="https://api.iconify.design/lucide-user-circle.svg?color=%234b5563"
                        alt=""
                        className="form-field-icon"
                        id="iuq9j"
                      />
                    </span>
                    <input
                      ref={usernameRef}
                      type="text"
                      id="username"
                      name="username"
                      autoComplete="username"
                      required
                      aria-required="true"
                      placeholder={roleDetails.placeholder}
                      className="input-username"
                      value={loginForm.username}
                      onChange={onLoginInputChange}
                    />
                  </div>
                </div>

                <div className="form-field-group" id="i59o7">
                  <div className="password-label-row" id="i4d0x">
                    <label htmlFor="password" id="passwordLabel" className="form-field-label">
                      Password
                    </label>
                    <a href="#" className="forgot-link text-[#2b6cb0] no-underline" id="i80e9">
                      Forgot password?
                    </a>
                  </div>
                  <div className="form-field-control" id="ivt54">
                    <span className="form-field-icon-wrap" id="i98ui">
                      <img
                        src="https://api.iconify.design/lucide-key-round.svg?color=%234b5563"
                        alt=""
                        className="form-field-icon"
                        id="i1bn3"
                      />
                    </span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      aria-required="true"
                      placeholder="Enter your password"
                      className="input-password"
                      value={loginForm.password}
                      onChange={onLoginInputChange}
                    />
                  </div>
                </div>

                <div className="form-options-row" id="it7ebf">
                  <label className="remember-me-control" id="igmd9w">
                    <input
                      type="checkbox"
                      id="remember"
                      name="rememberMe"
                      checked={loginForm.rememberMe}
                      onChange={onLoginInputChange}
                      className="peer remember-me-input"
                    />
                    <span
                      aria-hidden="true"
                      className="peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-checked:bg-blue-700 peer-checked:border-blue-700 custom-checkbox"
                      id="i6wtaf"
                    >
                      <img
                        src="https://api.iconify.design/lucide-check.svg?color=white"
                        alt=""
                        className="peer-checked:opacity-100 custom-checkbox-icon"
                        id="i603rw"
                      />
                    </span>
                    <span className="remember-me-label" id="ix11kj">
                      Remember me on this device
                    </span>
                  </label>
                  <a href="#" className="create-account-link text-[#2b6cb0] no-underline" id="ikscxs">
                    Request access
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loginPending}
                  className="submit-button bg-[#0b1f3b] text-white rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  id="ivn4o3"
                >
                  {loginPending ? "Signing in..." : "Sign in to Portal"}
                </button>

                {loginError && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
                    {loginError}
                  </div>
                )}

                <div className="divider-row" id="i0iuv7">
                  <div className="divider-line" id="i30nrj"></div>
                  <span className="divider-text" id="ihx6ka">
                    or
                  </span>
                  <div className="divider-line" id="ieu1qs"></div>
                </div>

                <div className="security-notice" id="i0sb49">
                  <img
                    src="https://api.iconify.design/lucide-shield-alert.svg?color=%234b5563"
                    alt=""
                    className="security-notice-icon"
                    id="iypfqe"
                  />
                  <span id="iko0rm">Unauthorized access is prohibited. Access is monitored and logged.</span>
                </div>
              </form>
            </div>
          </div>
          </section>
        )}
        
        {isManagerDashboard && (
          <ManagerDashboard allData={allData} managerPage={managerPage} />
        )}
      </main>

      <footer className="footer-container" id="i51w3p">
        <div className="footer-inner" id="iqgnsg">
          <div className="footer-row" id="iwrks5">
            <div className="footer-brand" id="ic6xcl">
              <img
                src="https://app.grapesjs.com/api/assets/random-image?query=capitol%20building&w=28&h=28"
                alt="Capitol"
                loading="lazy"
                className="footer-brand-icon"
                id="ivom0g"
              />
              <span className="footer-brand-text" id="iu8mfi">
               Land Management System &copy; 2026 Paradip Port Authority. All rights reserved.
              </span>
            </div>
            <ul className="footer-links" id="ixpeak">
              <li id="i55rpi">
                <a href="#" className="footer-link text-[#2b6cb0] no-underline" id="ii22q5">
                  Privacy
                </a>
              </li>
              <li id="i0zhbg">
                <a href="#" className="footer-link text-[#2b6cb0] no-underline" id="ihwlxu">
                  Terms
                </a>
              </li>
              <li id="ikdd5g">
                <a href="#" className="footer-link text-[#2b6cb0] no-underline" id="ippx7b">
                  Security
                </a>
              </li>
              <li id="i1vitk">
                <a href="#" className="footer-link text-[#2b6cb0] no-underline" id="i31mri">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

