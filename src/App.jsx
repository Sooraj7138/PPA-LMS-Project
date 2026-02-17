import { useState, useMemo, useRef } from 'react'
import './style.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [role, setRole] = useState("User");
  const usernameRef = useRef(null);
  const tabRefs = useRef([]);

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

  function handleLoginSubmit(e) {
    e.preventDefault();
    if (role === "Manager") {
      setActivePage("manager-dashboard");
    } else {
      alert(`${role} Login functionality is being developed.`);
    }
  }

  function onLogout() {
    setActivePage("home");
    setRole("User");
  }

  function onLoginClick(e) {
    e.preventDefault();
    closeMobileMenu();
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

  const activeTabClasses = "bg-white border border-slate-200 text-slate-900 shadow-sm";
  const roleDetails = roleConfig[role];
  const isHomePage = activePage === "home";
  const isLoginPage = activePage === "login";
  const isManagerDashboard = activePage === "manager-dashboard";

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
              className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-1 text-sm font-medium md:flex md:w-auto md:flex-row md:items-center md:gap-2`}
            >
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
                  className={`nav-cta-link block rounded-md px-3 py-2 hover:bg-white/20 ${isLoginPage || activePage === "manager-dashboard" ? "nav-cta-link-active" : ""}`.trim()}
                  onClick={activePage === "manager-dashboard" ? (e) => e.preventDefault() : onLoginClick}
                >
                  {activePage === "manager-dashboard" ? "Dashboard" : "Land Login"}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main className={`main-content ${isManagerDashboard ? "main-content-wide" : ""}`.trim()} id="ithhf">
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
                      onClick={() => setRole(item)}
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
                    />
                  </div>
                </div>

                <div className="form-options-row" id="it7ebf">
                  <label className="remember-me-control" id="igmd9w">
                    <input type="checkbox" id="remember" name="remember" className="peer remember-me-input" />
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

                <button type="submit" className="submit-button bg-[#0b1f3b] text-white rounded-lg" id="ivn4o3">
                  Sign in to Portal
                </button>

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
        
        {activePage === "manager-dashboard" && (
          <ManagerDashboard onLogout={onLogout} />
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

function ManagerDashboard({ onLogout }) {
  const [managerPage, setManagerPage] = useState("generate-demand");
  const landTypes = ["Lease", "Market", "License", "ROW", "Open Space", "Building"];
  const [selectedLandType, setSelectedLandType] = useState("Lease");
  const landTypeTitle = `${selectedLandType} Land Data`;
  const [isGenerateDemandModalOpen, setIsGenerateDemandModalOpen] = useState(false);
  const [demandForm, setDemandForm] = useState({
    amount: "",
    dueDate: "",
    description: "",
  });

  const navItems = [
    { id: "generate-demand", label: "Generate Demand Note", icon: "lucide-file-plus" },
    { id: "master-land", label: "Master Land Data", icon: "lucide-map-pin" },
    { id: "user-data", label: "User's Data", icon: "lucide-users" },
    { id: "demand-status", label: "Status of Demand Note", icon: "lucide-check-square" },
    { id: "user-eoi", label: "View User's EOI", icon: "lucide-handshake" },
  ];

  function openGenerateDemandModal() {
    setIsGenerateDemandModalOpen(true);
  }

  function closeGenerateDemandModal() {
    setIsGenerateDemandModalOpen(false);
  }

  function onDemandFormChange(e) {
    const { name, value } = e.target;
    setDemandForm((prev) => ({ ...prev, [name]: value }));
  }

  function submitGenerateDemand() {
    const { amount, dueDate, description } = demandForm;
    if (amount.trim() !== "" && dueDate !== "" && description.trim() !== "") {
      alert("Demand note generated successfully!");
      closeGenerateDemandModal();
      setDemandForm({ amount: "", dueDate: "", description: "" });
      return;
    }
    alert("Please fill all fields.");
  }

  return (
    <div className="manager-dashboard-layout flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 flex-shrink-0">
        <nav className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-sm font-bold text-[#0b1f3b] uppercase tracking-wider">Manager Console</h2>
          </div>
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setManagerPage(item.id)}
                  className={`w-full text-left px-4 py-3.5 text-sm font-medium transition-all flex items-center border-l-4 ${
                    managerPage === item.id
                      ? "bg-[#0b1f3b]/5 text-[#0b1f3b] border-[#0b1f3b]"
                      : "text-slate-600 hover:bg-slate-50 border-transparent"
                  }`}
                >
                  <img
                    src={`https://api.iconify.design/${item.icon}.svg?color=${managerPage === item.id ? "%230b1f3b" : "%234b5563"}`}
                    alt=""
                    className="w-5 h-5 mr-3"
                  />
                  {item.label}
                </button>
              </li>
            ))}
            <li className="border-t border-slate-100 mt-2">
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center border-l-4 border-transparent"
              >
                <img
                  src="https://api.iconify.design/lucide-log-out.svg?color=%23dc2626"
                  alt=""
                  className="w-5 h-5 mr-3"
                />
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content Area */}
      <div className="manager-dashboard-content flex-1 min-w-0">
        {managerPage === "generate-demand" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-2xl font-bold text-[#0b1f3b]">Generate Demand Note</h3>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Land Type</label>
                  <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
                    <option value="">All Types</option>
                    <option value="lease">Lease</option>
                    <option value="market">Market</option>
                    <option value="license">License</option>
                    <option value="row">ROW</option>
                    <option value="openspace">Open Space</option>
                    <option value="building">Building</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Land Name</label>
                  <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
                    <option value="">All Names</option>
                    <option value="plot-a12">Plot A-12</option>
                    <option value="shop-m05">Shop M-05</option>
                    <option value="license-l08">License L-08</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Land Code</label>
                  <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
                    <option value="">All Codes</option>
                    <option value="L001">L001</option>
                    <option value="M002">M002</option>
                    <option value="LC003">LC003</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Allotment Type</label>
                  <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
                    <option value="">--</option>
                    <option value="Upfront">Upfront</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="px-6 py-4">Consumer Name</th>
                      <th className="px-6 py-4">Land Type</th>
                      <th className="px-6 py-4">Land Name</th>
                      <th className="px-6 py-4 text-center">Due Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: "John Doe", type: "Lease", land: "Plot A-12", date: "15/07/2023" },
                      { name: "Jane Smith", type: "Market", land: "Shop M-05", date: "30/06/2023" },
                      { name: "Robert Johnson", type: "License", land: "License L-08", date: "10/07/2023" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0b1f3b]">{row.name}</td>
                        <td className="px-6 py-4 text-slate-600">{row.type}</td>
                        <td className="px-6 py-4 text-slate-600">{row.land}</td>
                        <td className="px-6 py-4 text-center text-slate-500 font-medium">{row.date}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={openGenerateDemandModal}
                            className="inline-flex items-center px-4 py-2 bg-[#0b1f3b] text-white rounded-lg text-xs font-bold hover:bg-[#1f4f82] transition-all active:scale-95 shadow-sm"
                          >
                            <img src="https://api.iconify.design/lucide-file-plus.svg?color=white" alt="" className="w-4 h-4 mr-1.5" />
                            Generate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {managerPage === "master-land" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-bold text-[#0b1f3b]">Master Land Data</h3>
              <button className="inline-flex items-center px-4 py-2.5 bg-[#0b1f3b] text-white rounded-lg text-sm font-bold hover:bg-[#1f4f82] transition-all active:scale-95 shadow-md">
                <img src="https://api.iconify.design/lucide-plus.svg?color=white" alt="" className="w-4 h-4 mr-2" />
                Add New Record
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-48 flex-shrink-0">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 space-y-1">
                  {landTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedLandType(type)}
                      className={`w-full text-left px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${
                        type === selectedLandType ? "bg-[#0b1f3b] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h4 className="text-sm font-bold text-slate-700">{landTypeTitle}</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="bg-white text-slate-500 font-bold text-xs uppercase border-b border-slate-100">
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Area (sq.m)</th>
                          <th className="px-6 py-4">Code</th>
                          <th className="px-6 py-4">Total Rate</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { name: "Plot A-12", area: "500", code: "L001", rate: "₹ 25,000" },
                          { name: "Plot B-07", area: "750", code: "L002", rate: "₹ 35,000" }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-[#0b1f3b]">{row.name}</td>
                            <td className="px-6 py-4 text-slate-600">{row.area}</td>
                            <td className="px-6 py-4 font-mono text-slate-500">{row.code}</td>
                            <td className="px-6 py-4 font-bold text-emerald-600">{row.rate}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                                  <img src="https://api.iconify.design/lucide-edit.svg?color=%23d97706" alt="" className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                  <img src="https://api.iconify.design/lucide-trash-2.svg?color=%23dc2626" alt="" className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {managerPage === "user-data" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-2xl font-bold text-[#0b1f3b]">User's Data</h3>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Land Type</label>
                  <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
                    <option value="">All Types</option>
                    <option value="lease">Lease</option>
                    <option value="market">Market</option>
                    <option value="license">License</option>
                    <option value="row">ROW</option>
                    <option value="openspace">Open Space</option>
                    <option value="building">Building</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Land Name</label>
                  <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
                    <option value="">All Names</option>
                    <option value="plot-a12">Plot A-12</option>
                    <option value="shop-m05">Shop M-05</option>
                    <option value="license-l08">License L-08</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Land Code</label>
                  <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
                    <option value="">All Codes</option>
                    <option value="L001">L001</option>
                    <option value="M002">M002</option>
                    <option value="LC003">LC003</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="px-6 py-4">Consumer Name</th>
                      <th className="px-6 py-4">Address</th>
                      <th className="px-6 py-4">Mobile Number</th>
                      <th className="px-6 py-4">Allotted Land</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: "John Doe", address: "123, Main Street, Paradip", phone: "+91 9876543210", land: "Plot A-12 (Lease)" },
                      { name: "Jane Smith", address: "456, Park Avenue, Paradip", phone: "+91 8765432109", land: "Shop M-05 (Market)" },
                      { name: "Robert Johnson", address: "789, Beach Road, Paradip", phone: "+91 7654321098", land: "License L-08 (License)" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0b1f3b]">{row.name}</td>
                        <td className="px-6 py-4 text-slate-600 text-xs leading-relaxed max-w-[200px]">{row.address}</td>
                        <td className="px-6 py-4 font-medium text-slate-500">{row.phone}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{row.land}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="px-3 py-1.5 text-amber-600 bg-amber-50 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors">Edit</button>
                            <button className="px-3 py-1.5 text-red-600 bg-red-50 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {managerPage === "demand-status" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-2xl font-bold text-[#0b1f3b]">View Status of Demand Note</h3>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="px-6 py-4">Consumer Name</th>
                      <th className="px-6 py-4">Land Type</th>
                      <th className="px-6 py-4">Land Name</th>
                      <th className="px-6 py-4 text-center">Due Date</th>
                      <th className="px-6 py-4 text-center">Status of Demand Note</th>
                      <th className="px-6 py-4 text-right">Status of Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: "John Doe", type: "Lease", land: "Plot A-12", date: "15/07/2023", status: "Approved", payment: "Paid" },
                      { name: "Jane Smith", type: "Market", land: "Shop M-05", date: "30/06/2023", status: "Action Needed", payment: "Not Paid" },
                      { name: "Robert Johnson", type: "License", land: "License L-08", date: "10/07/2023", status: "Approved", payment: "Closed" },
                      { name: "Michael Wilson", type: "Building", land: "Building B-03", date: "25/07/2023", status: "Approved", payment: "Not Paid" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0b1f3b]">{row.name}</td>
                        <td className="px-6 py-4 text-slate-600">{row.type}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{row.land}</td>
                        <td className="px-6 py-4 text-center text-slate-500 font-medium">{row.date}</td>
                        <td className="px-6 py-4 text-center">
                          {row.status === "Action Needed" ? (
                            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-sm">Send for Recheck</button>
                          ) : (
                            <span className="inline-flex px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold ring-1 ring-inset ring-green-600/20">Approved</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                            row.payment === "Paid" ? "bg-emerald-100 text-emerald-700 ring-emerald-600/20" :
                            row.payment === "Not Paid" ? "bg-red-100 text-red-700 ring-red-600/20" :
                            "bg-slate-100 text-slate-700 ring-slate-600/20"
                          }`}>
                            {row.payment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {managerPage === "user-eoi" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-2xl font-bold text-[#0b1f3b]">View User's EOI</h3>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="px-6 py-4">EOI ID</th>
                      <th className="px-6 py-4">Consumer Name</th>
                      <th className="px-6 py-4">Land Type</th>
                      <th className="px-6 py-4">Land Name</th>
                      <th className="px-6 py-4">Applied Date</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { id: "EOI001", name: "John Doe", type: "Lease", land: "Plot A-12", date: "10/05/2023" },
                      { id: "EOI002", name: "Jane Smith", type: "Market", land: "Shop M-05", date: "12/05/2023" },
                      { id: "EOI003", name: "Robert Johnson", type: "License", land: "License L-08", date: "15/05/2023" },
                      { id: "EOI004", name: "Michael Wilson", type: "Building", land: "Building B-03", date: "18/05/2023" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{row.id}</td>
                        <td className="px-6 py-4 font-bold text-[#0b1f3b]">{row.name}</td>
                        <td className="px-6 py-4 text-slate-600">{row.type}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{row.land}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{row.date}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold ring-1 ring-inset ring-blue-600/20">Applied</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {isGenerateDemandModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          onClick={closeGenerateDemandModal}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="generate-demand-modal-title"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h4 id="generate-demand-modal-title" className="text-lg font-bold text-[#0b1f3b]">
                Generate Demand Note
              </h4>
              <button
                type="button"
                onClick={closeGenerateDemandModal}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <img src="https://api.iconify.design/lucide-x.svg?color=%234b5563" alt="" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div className="space-y-1.5">
                <label htmlFor="demand-amount" className="text-sm font-semibold text-slate-700">
                  Amount
                </label>
                <input
                  id="demand-amount"
                  name="amount"
                  type="text"
                  value={demandForm.amount}
                  onChange={onDemandFormChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0b1f3b] focus:outline-none focus:ring-2 focus:ring-[#0b1f3b]/10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="demand-due-date" className="text-sm font-semibold text-slate-700">
                  Due Date
                </label>
                <input
                  id="demand-due-date"
                  name="dueDate"
                  type="date"
                  value={demandForm.dueDate}
                  onChange={onDemandFormChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0b1f3b] focus:outline-none focus:ring-2 focus:ring-[#0b1f3b]/10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="demand-description" className="text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  id="demand-description"
                  name="description"
                  rows="3"
                  value={demandForm.description}
                  onChange={onDemandFormChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0b1f3b] focus:outline-none focus:ring-2 focus:ring-[#0b1f3b]/10"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={closeGenerateDemandModal}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitGenerateDemand}
                className="rounded-lg bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f4f82]"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
