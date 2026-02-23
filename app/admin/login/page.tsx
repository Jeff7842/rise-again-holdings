// app/admin/login/page.tsx
import "@/components/styles/admin-login.css";
import ThemeToggle from "./theme-login";
import Link from "next/link";
import AdminLoginForm from "./login-form";

export const metadata = {
  title: "Admin Login • Rise Again Holdings",
};

export default function AdminLoginPage() {
  return (
    <main className="admin-login">
      <div className="admin-login__bg" aria-hidden="true">
        <div className="admin-login__orb admin-login__orb--one" />
        <div className="admin-login__orb admin-login__orb--two" />
        <div className="admin-login__grid" />
      </div>

      <section className="admin-login__shell">
        <header className="admin-login__topbar">
          <Link className="admin-login__brand" href="/">
            <span className="admin-login__brandMark" aria-hidden="true">R</span>
            <span className="admin-login__brandText">
              <strong>Rise Again</strong>
              <span>Holdings • Admin</span>
            </span>
          </Link>

          <ThemeToggle />
        </header>

        <div className="admin-login__card">
          <div className="admin-login__cardHeader">
            <h1>Welcome back</h1>
            <p>Sign in to manage listings, users, and operations.</p>
          </div>

          <AdminLoginForm />
        </div>

        <footer className="admin-login__footer">
          <span>© {new Date().getFullYear()} Rise Again Holdings</span>
          <span className="admin-login__sep" aria-hidden="true">•</span>
          <Link className="admin-login__link" href="/">Back to site</Link>
        </footer>
      </section>
    </main>
  );
}