"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download, ChevronDown } from "lucide-react";
import { FaXTwitter, FaGithub, FaLinkedin } from "react-icons/fa6";

const TYPING_STRINGS = [
  "Full Stack Developer",
  "MERN Stack Engineer",
  "React & Next.js Builder",
  "Python & FastAPI Dev",
  "Problem Solver",
];

function useTypewriter(strings: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = strings[stringIndex];

    if (!deleting && charIndex < current.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, speed);
    } else if (!deleting && charIndex === current.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setStringIndex((i) => (i + 1) % strings.length);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [charIndex, deleting, stringIndex, strings, speed, pause]);

  return displayed;
}

const socialLinks = [
  {
    id: "github-link",
    icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/amansinghchauhan",
  },
  {
    id: "linkedin-link",
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aman-chauhan-2489b1312/",
  },
];

export default function Hero() {
  const typeText = useTypewriter(TYPING_STRINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <section
      id="home"
      className="grid-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glow blobs */}
      <div
        className="hero-glow"
        style={{ top: "10%", left: "-10%", opacity: 0.7 }}
      />
      <div
        className="hero-glow"
        style={{
          bottom: "5%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}
      >
        {/* Terminal prompt line */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "14px",
            color: "var(--text-muted)",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ color: "var(--accent-green)" }}>❯</span>
          <span>whoami</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{
            fontSize: "clamp(42px, 8vw, 80px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1px",
            marginBottom: "16px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <span style={{ color: "var(--text-primary)" }}>Aman Singh</span>
          <br />
          <span className="text-glow" style={{ color: "var(--accent-green)" }}>
            Chauhan
          </span>
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "clamp(16px, 3vw, 22px)",
            color: "var(--text-secondary)",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span style={{ color: "var(--accent-amber)" }}>&gt; </span>
          <span>{mounted ? typeText : TYPING_STRINGS[0]}</span>
          <span className="cursor-blink" />
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{
            fontSize: "16px",
            lineHeight: 1.8,
            color: "var(--text-secondary)",
            maxWidth: "620px",
            marginBottom: "40px",
          }}
        >
          Hey there! I&apos;m a{" "}
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            Full Stack Developer
          </span>{" "}
          who loves turning ideas into real, scalable products. I work across
          the stack — from crafting pixel-perfect UIs with{" "}
          <span style={{ color: "var(--accent-green)" }}>React & Next.js</span>{" "}
          to architecting robust backends with{" "}
          <span style={{ color: "var(--accent-green)" }}>Node.js</span> and{" "}
          <span style={{ color: "var(--accent-green)" }}>Python</span>. When
          I&apos;m not writing code, I&apos;m probably exploring new tech or
          finding smarter ways to solve old problems. Let&apos;s build something
          awesome. 🚀
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "48px",
            alignItems: "center",
          }}
        >
          <a
            id="view-projects-btn"
            href="#projects"
            className="btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <span>./view-projects</span>
          </a>
          <a
            id="download-resume-btn"
            href="/resume.pdf"
            download
            className="btn-secondary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <Download size={15} />
            <span>resume.pdf</span>
          </a>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          style={{ display: "flex", gap: "16px", alignItems: "center" }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "12px",
              color: "var(--text-muted)",
              letterSpacing: "2px",
            }}
          >
            FIND ME
          </span>
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "var(--border-color)",
            }}
          />
          {socialLinks.map(({ id, icon: Icon, label, href }) => (
            <a
              key={id}
              id={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              style={{
                color: "var(--text-muted)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--accent-green)";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-3px)";
                (e.currentTarget as HTMLAnchorElement).style.filter =
                  "drop-shadow(0 0 6px var(--accent-green))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--text-muted)";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.filter = "none";
              }}
            >
              <Icon size={20} />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#skills"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "var(--text-muted)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          textDecoration: "none",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "11px",
          letterSpacing: "2px",
        }}
      >
        <span>SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={16} style={{ color: "var(--accent-green)" }} />
        </motion.div>
      </motion.a>
    </section>
  );
}
