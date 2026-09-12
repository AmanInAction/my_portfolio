"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

const skillGroups = [
  {
    category: "Frontend",
    icon: "🖥️",
    color: "var(--accent-green)",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    category: "Backend",
    icon: "⚙️",
    color: "var(--accent-amber)",
    skills: ["Node.js", "Express.js", "Python", "Django", "FastAPI", "REST APIs", "MVC"],
  },
  {
    category: "Database",
    icon: "🗄️",
    color: "var(--accent-cyan)",
    skills: ["MongoDB", "Mongoose", "PostgreSQL", "Firebase"],
  },
  {
    category: "Tools & DevOps",
    icon: "🔧",
    color: "#c084fc",
    skills: ["Git", "GitHub", "VS Code", "Postman", "Vercel", "Render", "npm"],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants : Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="skills"
      ref={ref}
      style={{
        padding: "100px 24px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "64px" }}
      >
        <p className="section-label" style={{ marginBottom: "12px" }}>
          // 02. skills
        </p>
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.2,
          }}
        >
          My Tech{" "}
          <span className="text-glow" style={{ color: "var(--accent-green)" }}>
            Arsenal
          </span>
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginTop: "12px",
            fontSize: "16px",
            maxWidth: "520px",
            lineHeight: 1.7,
          }}
        >
          Tools and technologies I use to build production-ready applications
          from idea to deployment.
        </p>
      </motion.div>

      {/* Skill cards grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {skillGroups.map((group) => (
          <motion.div
            key={group.category}
            variants={cardVariants}
            className="terminal-window"
            style={{ padding: "0" }}
          >
            {/* Terminal chrome */}
            <div className="terminal-header">
              <span className="terminal-dot dot-red" />
              <span className="terminal-dot dot-yellow" />
              <span className="terminal-dot dot-green" />
              <span
                style={{
                  marginLeft: "8px",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                {group.icon} {group.category.toLowerCase()}
              </span>
            </div>

            {/* Skills */}
            <div style={{ padding: "20px" }}>
              <motion.div
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {group.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={badgeVariants}
                    className="skill-badge"
                    style={{
                      borderColor: group.color + "33",
                      color: group.color,
                      background: group.color + "0d",
                      cursor: "default",
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: `0 0 10px ${group.color}44`,
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom stat bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{
          marginTop: "48px",
          padding: "24px 32px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "10px",
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {[
          { value: "2+", label: "Years Experience" },
          { value: "10+", label: "Technologies" },
          { value: "5+", label: "Projects Built" },
          { value: "∞", label: "Curiosity" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              className="text-glow"
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--accent-green)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginTop: "4px",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
