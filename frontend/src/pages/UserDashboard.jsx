import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { clearAuthStorage, getStoredUser } from "../services/auth.js";

const dashboardCards = [
  {
    id: "profile",
    title: "MY PROFILE",
    description: "View your account information.",
    tone: "profile",
  },
  {
    id: "employees",
    title: "EMPLOYEES",
    description: "View all employees.",
    tone: "employees",
  },
  {
    id: "departments",
    title: "DEPARTMENTS",
    description: "View all departments.",
    tone: "departments",
  },
];

function getRecords(data, collectionName) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.value)) {
    return data.value;
  }

  if (Array.isArray(data?.[collectionName])) {
    return data[collectionName];
  }

  return [];
}

function logDirectoryError(endpoint, error) {
  const responseData = error.response?.data;
  const serverMessage =
    typeof responseData === "string"
      ? responseData
      : responseData?.message || responseData?.error;

  console.error(`[UserDashboard] GET ${endpoint} failed`, {
    url: `${api.defaults.baseURL}${endpoint}`,
    message: error.message,
    code: error.code,
    status: error.response?.status,
    statusText: error.response?.statusText,
    serverMessage,
  });
}

export default function UserDashboard() {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState("profile");
  const [records, setRecords] = useState([]);
  const [panelStatus, setPanelStatus] = useState("idle");

  useEffect(() => {
    if (activePanel === "profile") {
      return undefined;
    }

    let isCurrent = true;
    const isEmployeePanel = activePanel === "employees";
    const endpoint = isEmployeePanel ? "/api/employees" : "/api/departments";
    const collectionName = isEmployeePanel ? "employees" : "departments";

    setPanelStatus("loading");
    setRecords([]);

    async function loadRecords() {
      try {
        const { data } = await api.get(endpoint);
        if (isCurrent) {
          setRecords(getRecords(data, collectionName));
          setPanelStatus("success");
        }
      } catch (error) {
        logDirectoryError(endpoint, error);
        if (isCurrent) {
          setPanelStatus("error");
        }
      }
    }

    loadRecords();
    return () => {
      isCurrent = false;
    };
  }, [activePanel]);

  function handleLogout() {
    clearAuthStorage();
    navigate("/login", { replace: true });
  }

  return (
    <div className="user-dashboard">
      <header className="user-dashboard-header">
        <div className="user-dashboard-brand">
          <span className="user-dashboard-mark" aria-hidden="true">EM</span>
          <h1>EMPLOYEE MANAGEMENT SYSTEM</h1>
        </div>
        <div className="user-dashboard-account">
          <span className="user-account-name">{user.name}</span>
          <button className="user-logout-button" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </header>

      <main className="user-dashboard-main">
        <section className="user-welcome">
          <p className="user-dashboard-eyebrow">USER WORKSPACE</p>
          <h2>Welcome, {user.name}</h2>
          <p>You are signed in as a user.</p>
        </section>

        <section className="user-dashboard-cards" aria-label="User dashboard sections">
          {dashboardCards.map((card) => (
            <button
              aria-pressed={activePanel === card.id}
              className={`user-dashboard-card user-card-${card.tone}${
                activePanel === card.id ? " is-selected" : ""
              }`}
              key={card.id}
              onClick={() => setActivePanel(card.id)}
              type="button"
            >
              <span className="user-card-label">{card.title}</span>
              <span className="user-card-description">{card.description}</span>
              <span className="user-card-action">View details <span aria-hidden="true">→</span></span>
            </button>
          ))}
        </section>

        <section className="user-dashboard-panel" aria-live="polite">
          {activePanel === "profile" && (
            <div>
              <div className="user-panel-heading">
                <p className="user-dashboard-eyebrow">ACCOUNT DETAILS</p>
                <h3>My Profile</h3>
              </div>
              <dl className="user-profile-details">
                {[
                  ["Name", user.name],
                  ["Username", user.username],
                  ["Email", user.email || "Not provided"],
                  ["Role", user.role],
                ].map(([label, value]) => (
                  <div className="user-profile-field" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {activePanel === "employees" && (
            <div>
              <div className="user-panel-heading">
                <p className="user-dashboard-eyebrow">DIRECTORY</p>
                <h3>Employees</h3>
              </div>
              {panelStatus === "loading" && (
                <p className="user-panel-message" role="status">Loading employees...</p>
              )}
              {panelStatus === "error" && (
                <p className="user-panel-message user-panel-error" role="alert">
                  Unable to load employees. Please try again.
                </p>
              )}
              {panelStatus === "success" && records.length === 0 && (
                <p className="user-panel-message">No employees found.</p>
              )}
              {panelStatus === "success" && records.length > 0 && (
                <div className="user-readonly-table-scroll">
                  <table className="user-readonly-table">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Designation</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((employee, index) => (
                        <tr key={employee.empid ?? `employee-${index}`}>
                          <td>{employee.empid}</td>
                          <td>{employee.name}</td>
                          <td>{employee.email}</td>
                          <td>{employee.phone}</td>
                          <td>{employee.designation}</td>
                          <td>{employee.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activePanel === "departments" && (
            <div>
              <div className="user-panel-heading">
                <p className="user-dashboard-eyebrow">DIRECTORY</p>
                <h3>Departments</h3>
              </div>
              {panelStatus === "loading" && (
                <p className="user-panel-message" role="status">Loading departments...</p>
              )}
              {panelStatus === "error" && (
                <p className="user-panel-message user-panel-error" role="alert">
                  Unable to load departments. Please try again.
                </p>
              )}
              {panelStatus === "success" && records.length === 0 && (
                <p className="user-panel-message">No departments found.</p>
              )}
              {panelStatus === "success" && records.length > 0 && (
                <div className="user-readonly-table-scroll">
                  <table className="user-readonly-table">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Department Name</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((department, index) => (
                        <tr key={department.id ?? `department-${index}`}>
                          <td>{department.id}</td>
                          <td>{department.name}</td>
                          <td>{department.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}