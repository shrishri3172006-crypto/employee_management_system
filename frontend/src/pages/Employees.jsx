import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { clearAuthStorage } from "../services/auth.js";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  designation: "",
  salary: "",
  joiningDate: "",
  status: "Active",
};

const employeeFields = [
  ["name", "Name", "text"],
  ["email", "Email", "email"],
  ["phone", "Phone", "tel"],
  ["designation", "Designation", "text"],
  ["salary", "Salary", "number"],
  ["joiningDate", "Joining Date", "date"],
];

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

function formatSalary(salary) {
  const value = Number(salary);
  return Number.isFinite(value) ? value.toLocaleString() : salary || "—";
}

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [notice, setNotice] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [viewError, setViewError] = useState("");
  const [isViewLoading, setIsViewLoading] = useState(false);

  async function loadEmployees() {
    setLoadStatus("loading");

    try {
      const { data } = await api.get("/api/employees");
      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.value)
          ? data.value
          : Array.isArray(data?.employees)
            ? data.employees
            : [];

      setEmployees(records);
      setLoadStatus("success");
    } catch {
      setLoadStatus("error");
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  function handleLogout() {
    clearAuthStorage();
    navigate("/login", { replace: true });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleAddEmployee(event) {
    event.preventDefault();
    setIsSaving(true);
    setNotice("");

    try {
      const employeeData = { ...formData, salary: Number(formData.salary) };
      await api.post("/api/employees", employeeData);
      setIsFormOpen(false);
      setFormData(initialForm);
      setNotice("Employee added successfully");
      await loadEmployees();
    } catch (error) {
      setNotice(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleViewEmployee(employeeId) {
    setIsViewOpen(true);
    setViewEmployee(null);
    setViewError("");
    setIsViewLoading(true);

    try {
      const { data } = await api.get(`/api/employees/${employeeId}`);
      setViewEmployee(data);
    } catch (error) {
      setViewError(getErrorMessage(error));
    } finally {
      setIsViewLoading(false);
    }
  }

  async function handleDeleteEmployee(employeeId) {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    setDeletingId(employeeId);
    setNotice("");

    try {
      await api.delete(`/api/employees/${employeeId}`);
      setNotice("Employee deleted successfully");
      await loadEmployees();
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
          <div className="employees-heading">
            <div>
              <p className="dashboard-eyebrow">WORKSPACE</p>
              <h2>Employees</h2>
              <p>View and manage your employee directory.</p>
            </div>
            <button className="employees-add-button" onClick={openAddForm} type="button">
              <span aria-hidden="true">+</span>
              Add Employee
            </button>
          </div>

          {notice && (
            <p className="employees-notice" role="status" aria-live="polite">
              {notice}
            </p>
          )}

          {isFormOpen && (
            <section className="employee-form-panel" aria-labelledby="employee-form-title">
              <div className="employee-panel-heading">
                <div>
                  <h3 id="employee-form-title">Add Employee</h3>
                  <p>Enter the employee details below.</p>
                </div>
                <button
                  aria-label="Close add employee form"
                  className="employee-close-button"
                  onClick={() => setIsFormOpen(false)}
                  type="button"
                >
                  ×
                </button>
              </div>

              <form className="employee-form" onSubmit={handleAddEmployee}>
                {employeeFields.map(([name, label, type]) => (
                  <label className="employee-field" htmlFor={`employee-${name}`} key={name}>
                    <span>{label}</span>
                    <input
                      id={`employee-${name}`}
                      min={type === "number" ? "0" : undefined}
                      name={name}
                      onChange={handleFormChange}
                      required
                      step={type === "number" ? "any" : undefined}
                      type={type}
                      value={formData[name]}
                    />
                  </label>
                ))}

                <label className="employee-field" htmlFor="employee-gender">
                  <span>Gender</span>
                  <select
                    id="employee-gender"
                    name="gender"
                    onChange={handleFormChange}
                    required
                    value={formData.gender}
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="employee-field" htmlFor="employee-status">
                  <span>Status</span>
                  <select
                    id="employee-status"
                    name="status"
                    onChange={handleFormChange}
                    required
                    value={formData.status}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
                    {isSaving ? "Saving..." : "Save Employee"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="employee-table-panel" aria-label="Employee directory">
            {loadStatus === "loading" && (
              <p className="employee-table-message" role="status" aria-live="polite">
                Loading employees...
              </p>
            )}

            {loadStatus === "error" && (
              <p className="employee-table-message employee-table-error" role="alert">
                Unable to connect to backend server.
              </p>
            )}

            {loadStatus === "success" && employees.length === 0 && (
              <p className="employee-table-message">No employees found.</p>
            )}

            {loadStatus === "success" && employees.length > 0 && (
              <div className="employee-table-scroll">
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Designation</th>
                      <th scope="col">Salary</th>
                      <th scope="col">Joining Date</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.empid}>
                        <td>{employee.empid}</td>
                        <td className="employee-name-cell">{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.phone}</td>
                        <td>{employee.gender}</td>
                        <td>{employee.designation}</td>
                        <td>{formatSalary(employee.salary)}</td>
                        <td>{employee.joiningDate}</td>
                        <td>
                          <span
                            className={`employee-status status-${String(employee.status).toLowerCase()}`}
                          >
                            {employee.status}
                          </span>
                        </td>
                        <td>
                          <div className="employee-row-actions">
                            <button
                              className="employee-view-button"
                              onClick={() => handleViewEmployee(employee.empid)}
                              type="button"
                            >
                              View
                            </button>
                            <button
                              className="employee-delete-button"
                              disabled={deletingId === employee.empid}
                              onClick={() => handleDeleteEmployee(employee.empid)}
                              type="button"
                            >
                              {deletingId === employee.empid ? "Deleting..." : "Delete"}
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
            aria-labelledby="employee-view-title"
            aria-modal="true"
            className="employee-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="employee-panel-heading">
              <div>
                <p className="dashboard-eyebrow">EMPLOYEE RECORD</p>
                <h3 id="employee-view-title">Employee details</h3>
              </div>
              <button
                aria-label="Close employee details"
                className="employee-close-button"
                onClick={() => setIsViewOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            {isViewLoading && <p className="employee-table-message">Loading employee...</p>}
            {viewError && <p className="employee-table-message employee-table-error">{viewError}</p>}
            {viewEmployee && (
              <dl className="employee-details-grid">
                {[
                  ["ID", viewEmployee.empid],
                  ["Name", viewEmployee.name],
                  ["Email", viewEmployee.email],
                  ["Phone", viewEmployee.phone],
                  ["Gender", viewEmployee.gender],
                  ["Designation", viewEmployee.designation],
                  ["Salary", formatSalary(viewEmployee.salary)],
                  ["Joining Date", viewEmployee.joiningDate],
                  ["Status", viewEmployee.status],
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