"use client";

import { Terminal } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-color)",
        padding: "32px 24px",
        textAlign: "center",
        background: "var(--bg-secondary)",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Terminal size={15} style={{ color: "var(--accent-green)" }} />
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "14px",
              color: "var(--accent-green)",
            }}
          >
            aman.dev
          </span>
        </div>

        {/* Copyright */}
        <p
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "12px",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          © {year} Aman Singh Chauhan
        </p>

        {/* Nav */}
        <div style={{ display: "flex", gap: "20px" }}>
          {["home", "skills", "projects", "contact"].map((link) => (
            <a
              key={link}
              href={`#${link}`}
              className="nav-link"
              style={{ fontSize: "12px" }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
