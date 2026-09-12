"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { Send, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { FaXTwitter, FaGithub, FaLinkedin } from "react-icons/fa6";

type FormData = {
  name: string;
  email: string;
  message: string;
};

const socialLinks = [
  {
    id: "contact-github",
    icon: FaGithub,
    label: "GitHub",
    handle: "@amansinghchauhan",
    href: "https://github.com/AmanInAction",
    color: "var(--text-primary)",
  },
  {
    id: "contact-linkedin",
    icon: FaLinkedin,
    label: "LinkedIn",
    handle: "Aman Singh Chauhan",
    href: "https://www.linkedin.com/in/aman-chauhan-2489b1312/",
    color: "#0077b5",
  },
  {
    id: "contact-email",
    icon: Mail,
    label: "Email",
    handle: "amanchauhan10a@email.com",
    href: "mailto:amanchauhan10a@email.com",
    color: "var(--accent-amber)",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus("sending");
    // Simulate sending — replace with real API or EmailJS
    
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Form data:", data);
    setStatus("success");
    reset();
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="grid-bg"
      style={{
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow blob */}
      <div
        className="hero-glow"
        style={{ bottom: "-100px", left: "30%", opacity: 0.5 }}
      />

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "64px", textAlign: "center" }}
        >
          <p className="section-label" style={{ marginBottom: "12px" }}>
            // 04. contact
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.2,
            }}
          >
            Let&apos;s{" "}
            <span
              className="text-glow"
              style={{ color: "var(--accent-green)" }}
            >
              Connect
            </span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "12px",
              fontSize: "16px",
              maxWidth: "480px",
              margin: "12px auto 0",
              lineHeight: 1.7,
            }}
          >
            Have a project in mind or just want to say hi? I&apos;m always open
            to interesting conversations and opportunities.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left: Social links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot dot-red" />
                <span className="terminal-dot dot-yellow" />
                <span className="terminal-dot dot-green" />
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginLeft: "8px",
                  }}
                >
                  social_links.json
                </span>
              </div>
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {socialLinks.map(({ id, icon: Icon, label, handle, href, color }) => (
                  <a
                    key={id}
                    id={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      color: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = color;
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-color)";
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.02)";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(0)";
                    }}
                  >
                    <Icon size={20} style={{ color, flexShrink: 0 }} />
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          fontFamily: "JetBrains Mono, monospace",
                          marginTop: "2px",
                        }}
                      >
                        {handle}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot dot-red" />
                <span className="terminal-dot dot-yellow" />
                <span className="terminal-dot dot-green" />
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginLeft: "8px",
                  }}
                >
                  send_message.sh
                </span>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {/* Name */}
                <div>
                  <label
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "12px",
                      color: "var(--accent-green)",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    $ name:
                  </label>
                  <input
                    id="contact-name"
                    className="terminal-input"
                    placeholder="Your name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p style={{ color: "#ff5f57", fontSize: "11px", fontFamily: "JetBrains Mono, monospace", marginTop: "4px" }}>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "12px",
                      color: "var(--accent-green)",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    $ email:
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className="terminal-input"
                    placeholder="your@email.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
                    })}
                  />
                  {errors.email && (
                    <p style={{ color: "#ff5f57", fontSize: "11px", fontFamily: "JetBrains Mono, monospace", marginTop: "4px" }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "12px",
                      color: "var(--accent-green)",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    $ message:
                  </label>
                  <textarea
                    id="contact-message"
                    className="terminal-input"
                    placeholder="What's on your mind?"
                    rows={5}
                    style={{ resize: "vertical" }}
                    {...register("message", { required: "Message is required" })}
                  />
                  {errors.message && (
                    <p style={{ color: "#ff5f57", fontSize: "11px", fontFamily: "JetBrains Mono, monospace", marginTop: "4px" }}>
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  id="contact-submit"
                  type="submit"
                  disabled={status === "sending" || status === "success"}
                  className="btn-primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    opacity: status === "sending" ? 0.7 : 1,
                  }}
                >
                  {status === "sending" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid var(--accent-green)",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                  {status === "success" && <CheckCircle size={14} />}
                  {status === "error" && <AlertCircle size={14} />}
                  {status === "idle" && <Send size={14} />}
                  {status === "idle" && "send message"}
                  {status === "sending" && "sending..."}
                  {status === "success" && "message sent!"}
                  {status === "error" && "try again"}
                </button>

                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "12px",
                      color: "var(--accent-green)",
                      textAlign: "center",
                    }}
                  >
                    ✓ Thanks! I&apos;ll get back to you soon.
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
