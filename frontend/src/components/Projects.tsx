"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { ExternalLink, FolderGit2, Sparkles, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

const projects = [
  {
    id: "wanderlust",
    number: "01",
    name: "Wanderlust",
    tagline: "Full-stack Holiday Rental Platform",
    description:
      "A full-stack holiday rental platform where hosts can list properties with photos, pricing, and amenities, and guests can browse and book stays. Built with user authentication, session management, and complete CRUD operations for property listings.",
    bullets: [
      "User authentication with session management & Passport.js",
      "CRUD operations for property listings with Cloudinary image upload",
      "Scalable RESTful APIs structured with MVC architecture",
    ],
    tech: ["MongoDB", "Express.js", "React", "Node.js", "Cloudinary", "Passport.js"],
    github: "https://github.com/amansinghchauhan",
    live: null,
    status: "completed",
    type: "Full Stack App",
  },
  {
    id: "facelink",
    number: "02",
    name: "Facelink",
    tagline: "Full-stack Video Conferencing Platform",
    description:
      "Browser-based video conferencing application supporting real-time peer-to-peer audio, video streaming, and screen sharing across multiple participants simultaneously.",
    bullets: [
      "WebRTC implementation for direct browser-to-browser media streaming",
      "Dynamic UI controls for microphone, camera toggles, and screen sharing",
      "Integrated real-time messaging and chat alongside video conferencing",
    ],
    tech: ["WebRTC", "JavaScript", "HTML", "CSS", "Socket.io"],
    github: "https://github.com/amansinghchauhan",
    live: null,
    status: "completed",
    type: "Real-time Platform",
  },
  {
    id: "hatchhub",
    number: "03",
    name: "HatchHub",
    tagline: "Full-Stack Networking Platform",
    description: "Professional networking platform with user profiles, posts, likes, comments, and a LinkedIn-style connection system. ",
    bullets: [
      "Implemented real-time one-on-one messaging using Socket.io with full conversation history stored in MongoDB. ",
      "Built a dynamic feed surfacing posts from connections, secured with JWT-based authentication and protected API routes."
    ],
    tech: ["MongoDB", "Express.js", "React", "Node.js", "Socket.io", "JWT"],
    github: "https://github.com/amansinghchauhan",
    live: null,
    status: "completed",
    type: "Full Stack App",
  },
  {
    id: "project-3",
    number: "03",
    name: "Coming Soon",
    tagline: "Next project in progress...",
    description:
      "Something exciting is being built. Stay tuned for another project that pushes the limits of what's possible with modern web technologies and AI integrations.",
    bullets: [
      "Currently in active development",
      "Will feature modern full-stack tech and interactive UI",
      "Architecture and design specifications in progress",
    ],
    tech: ["Next.js", "TypeScript", "TailwindCSS", "AI / LLM"],
    github: null,
    live: null,
    status: "wip",
    type: "Work in Progress",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        padding: "100px 24px",
        background: "var(--bg-secondary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow accent */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "-200px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 255, 136, 0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-150px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 229, 255, 0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section header with controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            <div>
              <p className="section-label" style={{ marginBottom: "12px" }}>
                // 03. projects
              </p>
              <h2
                style={{
                  fontSize: "clamp(28px, 5vw, 44px)",
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.2,
                }}
              >
                Featured{" "}
                <span
                  className="text-glow"
                  style={{ color: "var(--accent-green)" }}
                >
                  Creations
                </span>
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginTop: "12px",
                  fontSize: "16px",
                  maxWidth: "540px",
                  lineHeight: 1.7,
                }}
              >
                A selection of full-stack and real-time systems built from concept to
                deployment. Swipe or use navigation buttons to explore.
              </p>
            </div>

            {/* Desktop Carousel Indicators */}
            {count > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                }}
              >
                <span>
                  <span style={{ color: "var(--accent-green)" }}>
                    {String(current + 1).padStart(2, "0")}
                  </span>{" "}
                  / {String(count).padStart(2, "0")}
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {Array.from({ length: count }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => api?.scrollTo(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      style={{
                        width: current === idx ? "24px" : "8px",
                        height: "8px",
                        borderRadius: "4px",
                        padding: "5px",
                        background:
                          current === idx
                            ? "var(--accent-green)"
                            : "rgba(255,255,255,0.15)",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow:
                          current === idx
                            ? "0 0 8px rgba(0, 255, 136, 0.4)"
                            : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative px-2 sm:px-6"
        >
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-8 md:-ml-12">
              {projects.map((project) => (
                <CarouselItem
                  key={project.id}
                  className="pl-8 md:pl-12 basis-full md:basis-1/2"
                >
                  <div
                    id={`project-${project.id}`}
                    className="card-glow h-full flex flex-col justify-between"
                    style={{
                      padding: "32px",
                      opacity: project.status === "wip" ? 0.75 : 1,
                      position: "relative",
                      borderRadius: "12px",
                      background: "var(--bg-card)",
                      minHeight: "480px",
                    }}
                  >
                    {/* Card Top / Header */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <FolderGit2
                            size={20}
                            style={{ color: "var(--accent-green)" }}
                          />
                          <span
                            style={{
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "13px",
                              color: "var(--accent-green)",
                              letterSpacing: "1px",
                            }}
                          >
                            // {project.number}
                          </span>
                        </div>

                        {/* Status Badge */}
                        {project.status === "completed" ? (
                          <span
                            style={{
                              background: "rgba(0, 255, 136, 0.08)",
                              border: "1px solid rgba(0, 255, 136, 0.25)",
                              color: "var(--accent-green)",
                              fontSize: "11px",
                              fontFamily: "JetBrains Mono, monospace",
                              padding: "3px 10px",
                              borderRadius: "20px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "var(--accent-green)",
                                boxShadow: "0 0 6px var(--accent-green)",
                              }}
                            />
                            COMPLETED
                          </span>
                        ) : (
                          <span
                            style={{
                              background: "rgba(255, 184, 0, 0.1)",
                              border: "1px solid rgba(255, 184, 0, 0.3)",
                              color: "var(--accent-amber)",
                              fontSize: "11px",
                              fontFamily: "JetBrains Mono, monospace",
                              padding: "3px 10px",
                              borderRadius: "20px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "var(--accent-amber)",
                                boxShadow: "0 0 6px var(--accent-amber)",
                              }}
                            />
                            IN PROGRESS
                          </span>
                        )}
                      </div>

                      {/* Project Title */}
                      <h3
                        style={{
                          fontSize: "24px",
                          fontWeight: 700,
                          fontFamily: "Inter, sans-serif",
                          color: "var(--text-primary)",
                          marginBottom: "4px",
                        }}
                      >
                        {project.name}
                      </h3>

                      {/* Project Tagline */}
                      <p
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "13px",
                          color: "var(--accent-green)",
                          marginBottom: "16px",
                        }}
                      >
                        {project.tagline}
                      </p>

                      {/* Project Description */}
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.7,
                          marginBottom: "20px",
                        }}
                      >
                        {project.description}
                      </p>

                      {/* Highlight Bullets */}
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          marginBottom: "24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {project.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                              display: "flex",
                              gap: "10px",
                              alignItems: "flex-start",
                              lineHeight: 1.6,
                            }}
                          >
                            <span
                              style={{
                                color: "var(--accent-green)",
                                fontFamily: "JetBrains Mono, monospace",
                                marginTop: "1px",
                                flexShrink: 0,
                              }}
                            >
                              ▹
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card Bottom: Tech & Links */}
                    <div>
                      {/* Tech Badges */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          marginBottom: "24px",
                        }}
                      >
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            style={{
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "12px",
                              color: "var(--text-muted)",
                              background: "rgba(255, 255, 255, 0.03)",
                              border: "1px solid var(--border-color)",
                              padding: "4px 10px",
                              borderRadius: "4px",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          paddingTop: "16px",
                          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        {project.github ? (
                          <a
                            id={`${project.id}-github`}
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 16px",
                              fontSize: "13px",
                            }}
                          >
                            <FaGithub size={15} />
                            <span>Source Code</span>
                          </a>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "12px",
                              color: "var(--text-muted)",
                            }}
                          >
                            <Sparkles size={14} color="var(--accent-amber)" />
                            Repository private
                          </span>
                        )}

                        {project.live && (
                          <a
                            id={`${project.id}-live`}
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                            style={{
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 16px",
                              fontSize: "13px",
                            }}
                          >
                            <ExternalLink size={14} />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation buttons */}
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-3 lg:-left-5" />
              <CarouselNext className="-right-3 lg:-right-5" />
            </div>
          </Carousel>

          {/* Mobile navigation buttons below */}
          <div
            className="flex sm:hidden justify-center items-center gap-4 mt-6"
          >
            <button
              onClick={() => api?.scrollPrev()}
              disabled={!api?.canScrollPrev()}
              aria-label="Previous project"
              className="btn-secondary"
              style={{
                padding: "8px 16px",
                fontSize: "12px",
                opacity: api?.canScrollPrev() ? 1 : 0.4,
              }}
            >
              ← Prev
            </button>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <button
              onClick={() => api?.scrollNext()}
              disabled={!api?.canScrollNext()}
              aria-label="Next project"
              className="btn-secondary"
              style={{
                padding: "8px 16px",
                fontSize: "12px",
                opacity: api?.canScrollNext() ? 1 : 0.4,
              }}
            >
              Next →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
