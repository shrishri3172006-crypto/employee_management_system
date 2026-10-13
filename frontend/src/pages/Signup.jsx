import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";

const initialForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  useEffect(() => {
    if (!isSuccessful) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1600);

    return () => window.clearTimeout(timeoutId);
  }, [isSuccessful, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!event.currentTarget.elements.email.checkValidity()) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password must match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/api/auth/signup", {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      setIsSuccessful(true);
    } catch (requestError) {
      const responseData = requestError.response?.data;
      const responseMessage =
        typeof responseData === "string"
          ? responseData
          : responseData?.message || responseData?.error || "";
      const isDuplicateUsername =
        requestError.response?.status === 409 ||
        /username.*(already exists|exists|taken)|already exists/i.test(responseMessage);

      setError(
        isDuplicateUsername
          ? "Username already exists"
          : responseMessage || "Unable to create account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card signup-card" aria-labelledby="signup-title">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <p className="eyebrow">EMPLOYEE MANAGEMENT SYSTEM</p>
        <h1 className="brand-title">Create your account</h1>
        <div className="section-heading signup-section-heading">
          <h2 id="signup-title">Sign up</h2>
          <p>Enter your details to create a user account.</p>
        </div>

        <form className="login-form signup-form" noValidate onSubmit={handleSubmit}>
          <label htmlFor="signup-name">Name</label>
          <input
            autoComplete="name"
            id="signup-name"
            name="name"
            onChange={handleChange}
            required
            value={formData.name}
          />

          <label htmlFor="signup-username">Username</label>
          <input
            autoComplete="username"
            id="signup-username"
            name="username"
            onChange={handleChange}
            required
            value={formData.username}
          />

          <label htmlFor="signup-email">Email</label>
          <input
            autoComplete="email"
            id="signup-email"
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={formData.email}
          />

          <label htmlFor="signup-password">Password</label>
          <input
            autoComplete="new-password"
            id="signup-password"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={formData.password}
          />

          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <input
            autoComplete="new-password"
            id="signup-confirm-password"
            name="confirmPassword"
            onChange={handleChange}
            required
            type="password"
            value={formData.confirmPassword}
          />

          <p
            className={isSuccessful ? "signup-success" : "login-error"}
            role={isSuccessful ? "status" : "alert"}
            aria-live="polite"
          >
            {isSuccessful ? "Signup successful" : error}
          </p>

          <button
            className="login-button"
            disabled={isSubmitting || isSuccessful}
            type="submit"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="signup-login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}