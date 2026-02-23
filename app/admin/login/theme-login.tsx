// app/admin/login/theme-toggle.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem("theme", theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getPreferredTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const label = useMemo(() => {
    return theme === "dark" ? "Dark" : "Light";
  }, [theme]);

  return (
    <button
      type="button"
      className="admin-login__theme"
      aria-label="Toggle theme"
      onClick={() => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
      }}
    >
      <span className="admin-login__themePill" aria-hidden="true">
        <span
          className={
            "admin-login__themeKnob " +
            (theme === "dark" ? "is-dark" : "is-light")
          }
        />
      </span>
      <span className="admin-login__themeLabel">{label}</span>
    </button>
  );
}