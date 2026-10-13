import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { clearAuthStorage, getHomePath, setCurrentUser } from "../services/auth.js";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await api.post("/api/auth/login", { username, password });
      const role = String(data?.role || "").trim().toUpperCase();

      if (!data?.username || !["ADMIN", "USER"].includes(role)) {
        setError("Invalid username or password");
        return;
      }

      clearAuthStorage();
      localStorage.setItem("username", data.username);
      localStorage.setItem("name", data.name || data.username);
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("role", role);
      setCurrentUser({
        username: data.username,
        name: data.name || data.username,
        email: data.email || "",
        role,
      });
      navigate(getHomePath(role), { replace: true });
    } catch {
      setError("Invalid username or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <p className="eyebrow">WORKSPACE ADMINISTRATION</p>
        <h1 className="brand-title">Employee Management System</h1>
        <div className="section-heading">
          <h2 id="login-title">Sign in</h2>
          <p>Sign in with your account.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            autoComplete="username"
            id="username"
            name="username"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter your username"
            required
            value={username}
          />

          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />

          <p className="login-error" role="alert" aria-live="polite">
            {error}
          </p>

          <button className="login-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="signup-login-link">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <p className="security-note">Authorized access only</p>
      </section>
    </main>
  );
}