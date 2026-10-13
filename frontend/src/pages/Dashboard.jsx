import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { clearAuthStorage } from "../services/auth.js";

const dashboardCards = [
  { label: "Total Employees", key: "totalEmployees", tone: "green" },
  { label: "Active Employees", key: "activeEmployees", tone: "blue" },
  { label: "Inactive Employees", key: "inactiveEmployees", tone: "coral" },
  { label: "Total Departments", key: "totalDepartments", tone: "gold" },
  { label: "Total Users", key: "totalUsers", tone: "violet" },
];

const navigationItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Employees", to: "/employees" },
  { label: "Departments", to: "/departments" },
  { label: "Users", to: "/users" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => {
    let isCurrent = true;

    async function loadSummary() {
      try {
        const { data } = await api.get("/api/dashboard/summary");
        if (isCurrent) {
          setSummary(data);
          setLoadState("success");
        }
      } catch {
        if (isCurrent) {
          setLoadState("error");
        }
      }
    }

    loadSummary();
    return () => {
      isCurrent = false;
    };
  }, []);

  function handleLogout() {
    clearAuthStorage();
    navigate("/login", { replace: true });
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark" aria-hidden="true">EM</span>
          <span>Employee Management</span>
        </div>

        <nav className="sidebar-navigation" aria-label="Main navigation">
          <p className="sidebar-caption">WORKSPACE</p>
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `sidebar-link${isActive ? " is-active" : ""}`
              }
              end
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout} type="button">
          Logout
        </button>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Employee Management System</h1>
          <div className="header-account">
            <span className="admin-badge" aria-hidden="true">A</span>
            <span className="admin-label">Admin</span>
            <button className="header-logout" onClick={handleLogout} type="button">
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="dashboard-intro">
            <p className="dashboard-eyebrow">OVERVIEW</p>
            <h2>Organization at a glance</h2>
            <p>Current employee and account totals.</p>
          </div>

          {loadState === "loading" && (
            <p className="dashboard-status" role="status" aria-live="polite">
              Loading dashboard...
            </p>
          )}

          {loadState === "error" && (
            <p className="dashboard-status dashboard-error" role="alert">
              Unable to load dashboard data.
            </p>
          )}

          {loadState === "success" && (
            <section className="dashboard-cards" aria-label="Organization summary">
              {dashboardCards.map((card) => (
                <article className={`summary-card tone-${card.tone}`} key={card.key}>
                  <p>{card.label}</p>
                  <strong>{summary[card.key]}</strong>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}