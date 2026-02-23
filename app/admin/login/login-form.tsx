/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function AdminLoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      setError(null);

      const res = await fetch("/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Invalid credentials");
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-login__form" onSubmit={onSubmit}>
      <label className="admin-login__field">
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          placeholder="admin@riseagain.com"
          required
          disabled={loading}
        />
      </label>

      <label className="admin-login__field">
        <span>Password</span>
        <div className="admin-login__passwordWrap">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••••••"
            required
            disabled={loading}
          />
          <button
            type="button"
            className="admin-login__passwordToggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            disabled={loading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>

      <div className="admin-login__row">
        <label className="admin-login__checkbox">
          <input type="checkbox" name="remember" disabled={loading} />
          <span>Keep me signed in</span>
        </label>

        <a className="admin-login__link" href="#">
          Forgot password?
        </a>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            borderRadius: 14,
            padding: "12px 12px",
            border: "1px solid rgba(209, 32, 39, 0.25)",
            background: "rgba(209, 32, 39, 0.08)",
          }}
        >
          {error}
        </div>
      )}

      <button className="admin-login__button" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
        <span className="admin-login__buttonGlow" aria-hidden="true" />
      </button>

      <div className="admin-login__fineprint">
        <Lock size={16} strokeWidth={2.2} className="admin-login__lock" />
        <span>Secure admin access. All activity is logged.</span>
      </div>
    </form>
  );
}
