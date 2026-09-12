"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";

const navLinks = [
  { label: "home", href: "#home" },
  { label: "skills", href: "#skills" },
  { label: "projects", href: "#projects" },
  { label: "ask_ai", href: "#ask-ai" },
  { label: "contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ["home", "skills", "projects", "ask-ai", "contact"];
      for (const sec of sections.reverse()) {
        const el = document.getElementById(sec);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(sec);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(8, 11, 10, 0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(0, 255, 136, 0.1)"
            : "1px solid transparent",
          transition: "all 0.4s ease",
        }}
      >
        {/* Logo */}
        <a
          href="#home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <Terminal size={18} style={{ color: "var(--accent-green)" }} />
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--accent-green)",
            }}
          >
            aman<span style={{ color: "var(--text-secondary)" }}>.dev</span>
          </span>
        </a>

        {/* Desktop links */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "center",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link"
              style={{
                color:
                  activeSection === link.label
                    ? "var(--accent-green)"
                    : "var(--text-secondary)",
              }}
            >
              <span style={{ color: "var(--accent-green)", opacity: 0.6 }}>
                ./
              </span>
              {link.label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            download
            className="btn-primary"
            style={{
              padding: "8px 18px",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            resume.pdf
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent-green)",
            cursor: "pointer",
            display: "none",
          }}
          className="show-mobile"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: "64px",
              left: 0,
              right: 0,
              zIndex: 999,
              background: "rgba(8, 11, 10, 0.98)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid var(--border-color)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "16px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <span style={{ color: "var(--accent-green)" }}>~/</span>
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
