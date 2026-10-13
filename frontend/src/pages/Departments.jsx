import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { clearAuthStorage } from "../services/auth.js";

const initialForm = {
  name: "",
  description: "",
};

const navigationItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Employees", to: "/employees" },
  { label: "Departments", to: "/departments" },
  { label: "Users", to: "/users" },
];

function getErrorMessage(error) {
  if (!error.response) {
    return "Unable to connect to backend server.";
  }

  return error.response.data?.message || "Unable to complete the request.";
}

export default function Departments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [notice, setNotice] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewDepartment, setViewDepartment] = useState(null);
  const [viewError, setViewError] = useState("");
  const [isViewLoading, setIsViewLoading] = useState(false);

  async function loadDepartments() {
    setLoadStatus("loading");

    try {
      const { data } = await api.get("/api/departments");
      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.value)
          ? data.value
          : Array.isArray(data?.departments)
            ? data.departments
            : [];

      setDepartments(records);
      setLoadStatus("success");
    } catch {
      setLoadStatus("error");
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  function handleLogout() {
    clearAuthStorage();
    navigate("/login", { replace: true });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleAddDepartment(event) {
    event.preventDefault();
    setIsSaving(true);
    setNotice("");

    try {
      await api.post("/api/departments", formData);
      setIsFormOpen(false);
      setFormData(initialForm);
      setNotice("Department added successfully");
      await loadDepartments();
    } catch (error) {
      setNotice(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleViewDepartment(departmentId) {
    setIsViewOpen(true);
    setViewDepartment(null);
    setViewError("");
    setIsViewLoading(true);

    try {
      const { data } = await api.get(`/api/departments/${departmentId}`);
      setViewDepartment(data);
    } catch (error) {
      setViewError(getErrorMessage(error));
    } finally {
      setIsViewLoading(false);
    }
  }

  async function handleDeleteDepartment(departmentId) {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    setDeletingId(departmentId);
    setNotice("");

    try {
      await api.delete(`/api/departments/${departmentId}`);
      setNotice("Department deleted successfully");
      await loadDepartments();
    } catch (error) {
      setNotice(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  }

  function openAddForm() {
    setNotice("");
    setFormData(initialForm);
    setIsFormOpen(true);
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

        <main className="dashboard-content employees-content">
          <div className="departments-heading">
            <div>
              <p className="dashboard-eyebrow">WORKSPACE</p>
              <h2>Departments</h2>
              <p>View and manage your organization departments.</p>
            </div>
            <button className="employees-add-button" onClick={openAddForm} type="button">
              <span aria-hidden="true">+</span>
              Add Department
            </button>
          </div>

          {notice && (
            <p className="employees-notice" role="status" aria-live="polite">
              {notice}
            </p>
          )}

          {isFormOpen && (
            <section className="department-form-panel" aria-labelledby="department-form-title">
              <div className="employee-panel-heading">
                <div>
                  <h3 id="department-form-title">Add Department</h3>
                  <p>Enter the department details below.</p>
                </div>
                <button
                  aria-label="Close add department form"
                  className="employee-close-button"
                  onClick={() => setIsFormOpen(false)}
                  type="button"
                >
                  ×
                </button>
              </div>

              <form className="department-form" onSubmit={handleAddDepartment}>
                <label className="employee-field" htmlFor="department-name">
                  <span>Department Name</span>
                  <input
                    autoComplete="organization"
                    id="department-name"
                    name="name"
                    onChange={handleFormChange}
                    required
                    value={formData.name}
                  />
                </label>

                <label className="employee-field" htmlFor="department-description">
                  <span>Description</span>
                  <textarea
                    id="department-description"
                    name="description"
                    onChange={handleFormChange}
                    required
                    rows="3"
                    value={formData.description}
                  />
                </label>

                <div className="employee-form-actions">
                  <button
                    className="employee-cancel-button"
                    onClick={() => setIsFormOpen(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button className="employees-add-button" disabled={isSaving} type="submit">
                    {isSaving ? "Saving..." : "Save Department"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="department-table-panel" aria-label="Department directory">
            {loadStatus === "loading" && (
              <p className="employee-table-message" role="status" aria-live="polite">
                Loading departments...
              </p>
            )}

            {loadStatus === "error" && (
              <p className="employee-table-message employee-table-error" role="alert">
                Unable to connect to backend server.
              </p>
            )}

            {loadStatus === "success" && departments.length === 0 && (
              <p className="employee-table-message">No departments found.</p>
            )}

            {loadStatus === "success" && departments.length > 0 && (
              <div className="department-table-scroll">
                <table className="department-table">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Department Name</th>
                      <th scope="col">Description</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((department) => (
                      <tr key={department.id}>
                        <td>{department.id}</td>
                        <td className="employee-name-cell">{department.name}</td>
                        <td className="department-description-cell">
                          {department.description || "—"}
                        </td>
                        <td>
                          <div className="employee-row-actions">
                            <button
                              className="employee-view-button"
                              onClick={() => handleViewDepartment(department.id)}
                              type="button"
                            >
                              View
                            </button>
                            <button
                              className="employee-delete-button"
                              disabled={deletingId === department.id}
                              onClick={() => handleDeleteDepartment(department.id)}
                              type="button"
                            >
                              {deletingId === department.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {isViewOpen && (
        <div className="employee-modal-backdrop" onClick={() => setIsViewOpen(false)}>
          <section
            aria-labelledby="department-view-title"
            aria-modal="true"
            className="employee-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="employee-panel-heading">
              <div>
                <p className="dashboard-eyebrow">DEPARTMENT RECORD</p>
                <h3 id="department-view-title">Department details</h3>
              </div>
              <button
                aria-label="Close department details"
                className="employee-close-button"
                onClick={() => setIsViewOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            {isViewLoading && <p className="employee-table-message">Loading department...</p>}
            {viewError && <p className="employee-table-message employee-table-error">{viewError}</p>}
            {viewDepartment && (
              <dl className="employee-details-grid department-details-grid">
                {[
                  ["ID", viewDepartment.id],
                  ["Department Name", viewDepartment.name],
                  ["Description", viewDepartment.description],
                ].map(([label, value]) => (
                  <div className="employee-detail" key={label}>
                    <dt>{label}</dt>
                    <dd>{value || "—"}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        </div>
      )}
    </div>
  );
}