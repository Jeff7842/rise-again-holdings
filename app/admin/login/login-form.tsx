/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export default function AdminLoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      // Wire this to NextAuth or your Go endpoint.
      // Example: const res = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({email,password}) })
      // If using NextAuth: await signIn("credentials", { email, password, callbackUrl: "/admin" })

      await new Promise((r) => setTimeout(r, 600)); // demo delay
      throw new Error("Replace demo with real auth call.");
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
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          required
          disabled={loading}
        />
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
        {loading ? "Signing in…" : "Sign in"}
        <span className="admin-login__buttonGlow" aria-hidden="true" />
      </button>

      <div className="admin-login__fineprint">
  <Lock size={16} strokeWidth={2.2} className="admin-login__lock" />
  <span>Secure admin access. All activity is logged.</span>
</div>
    </form>
  );
}