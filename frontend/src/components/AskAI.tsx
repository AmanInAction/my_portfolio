"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronRight,
  LoaderCircle,
  Send,
  User,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import ReactMarkdown from "react-markdown";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  suggestions?: string[];
  sources?: ChatSource[];
};

type ChatSource = {
  source: string;
  category: string;
  score: number;
  preview: string;
};

type ChatResponse = {
  reply: string;
  sources: ChatSource[];
  suggestions: string[];
};

const STORAGE_KEY = "aman-portfolio-ask-ai";
const SESSION_START_KEY = "aman-portfolio-ask-start";
const MAX_MESSAGES = 12;
const SESSION_TIMEOUT = 10 * 60 * 1000;
const API_BASE_URL = process.env.NEXT_PUBLIC_RAG_API_URL ?? "http://localhost:8000";

const starterQuestions = [
  "What projects has Aman built?",
  "What are Aman's strongest technical skills?",
  "Tell me about Aman's experience.",
];

const initialMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I’m Aman’s AI assistant. Ask me about his background, skills, projects, experience, or education.",
  suggestions: starterQuestions,
};

function isStoredMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<ChatMessage>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    typeof message.id === "string"
  );
}

function createMessageId(role: ChatRole) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `message-${role}-${crypto.randomUUID()}`;
  }

  return `message-${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function removeDuplicateMessages(messages: ChatMessage[]) {
  const seen = new Set<string>();
  return messages.filter((message) => {
    if (seen.has(message.id)) return false;
    seen.add(message.id);
    return true;
  });
}

type ChatMessageViewProps = {
  message: ChatMessage;
  isSending: boolean;
  onSuggestionClick: (suggestion: string) => void;
};

function ChatMessageView({
  message,
  isSending,
  onSuggestionClick,
}: ChatMessageViewProps) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        flexDirection: isUser ? "row-reverse" : "row",
      }}
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          border: "1px solid var(--border-color)",
          borderRadius: "6px",
          color: isUser ? "var(--accent-amber)" : "var(--accent-green)",
          background: "rgba(0, 255, 136, 0.04)",
        }}
      >
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>
      <div
        style={{
          maxWidth: "min(720px, 82%)",
          textAlign: isUser ? "right" : "left",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "12px 15px",
            border: `1px solid ${isUser ? "rgba(255, 184, 0, 0.3)" : "var(--border-color)"}`,
            borderRadius: "7px",
            background: isUser
              ? "rgba(255, 184, 0, 0.06)"
              : "rgba(255,255,255,0.025)",
            color: "var(--text-primary)",
            lineHeight: 1.65,
            fontSize: "14px",
          }}
        >
          {isUser ? (
            <span style={{ whiteSpace: "pre-wrap" }}>{message.content}</span>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                components={{
                  a: (props) => (
                    <a {...props} target="_blank" rel="noreferrer" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {message.sources && message.sources.length > 0 && (
          <p
            style={{
              color: "var(--text-muted)",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "10px",
              marginTop: "8px",
            }}
          >
            grounded in{" "}
            {message.sources
              .slice(0, 2)
              .map((source) => source.category || source.source)
              .join(" · ")}
          </p>
        )}
        {message.suggestions &&
          message.suggestions.length > 0 &&
          !isSending && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              {message.suggestions.slice(0, 3).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSuggestionClick(suggestion)}
                  className="skill-badge"
                  style={{ cursor: "pointer", textAlign: "left" }}
                >
                  {suggestion}
                  <ChevronRight
                    size={12}
                    style={{
                      display: "inline",
                      verticalAlign: "-2px",
                      marginLeft: "5px",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

export default function AskAI() {
  const sectionRef = useRef<HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasLoadedStorageRef = useRef(false);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const validMessages = parsed
              .filter(isStoredMessage)
              .slice(-MAX_MESSAGES);
            const uniqueMessages = removeDuplicateMessages(validMessages);
            if (uniqueMessages.length > 0) setMessages(uniqueMessages);
          }
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        hasLoadedStorageRef.current = true;
      }
    });
  }, []);

  useEffect(() => {
  const now = Date.now();
  const storedStart = localStorage.getItem(SESSION_START_KEY);

  if (!storedStart) {
    localStorage.setItem(SESSION_START_KEY, now.toString());
    return;
  }

  const start = Number(storedStart);

  if (Number.isNaN(start) || now - start >= SESSION_TIMEOUT) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_START_KEY);
    window.location.reload();
    return;
  }

  const interval = window.setInterval(() => {
    const sessionStart = Number(localStorage.getItem(SESSION_START_KEY));

    if (sessionStart && Date.now() - sessionStart >= SESSION_TIMEOUT) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_START_KEY);
      window.location.reload();
    }
  }, 1000);

  return () => {
    window.clearInterval(interval);
  };
}, []);

  useEffect(() => {
    if (!hasLoadedStorageRef.current) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages.slice(-MAX_MESSAGES)),
      );
    } catch {
      // Storage can be unavailable in private browsing; chat still works in memory.
      window.localStorage.removeItem(STORAGE_KEY);
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submitQuestion = async (
    event?: FormEvent<HTMLFormElement>,
    question = input,
  ) => {
    event?.preventDefault();
    const message = question.trim();
    if (!message || isSending) return;

    const userMessage: ChatMessage = {
      id: createMessageId("user"),
      role: "user",
      content: message,
    };
    const history = messages
      .filter((item) => item.id !== "welcome" || messages.length === 1)
      .map(({ role, content }) => ({ role, content }));

    setMessages((current) => [...current, userMessage].slice(-MAX_MESSAGES));
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });

      const payload: unknown = await response.json();
      if (
        !response.ok ||
        !payload ||
        typeof payload !== "object" ||
        !("reply" in payload)
      ) {
        throw new Error("The assistant could not answer right now.");
      }

      const chatResponse = payload as ChatResponse;
      setMessages((current) =>
        [
          ...current,
          {
            id: createMessageId("assistant"),
            role: "assistant" as const,
            content: chatResponse.reply,
            suggestions: chatResponse.suggestions,
            sources: chatResponse.sources,
          },
        ].slice(-MAX_MESSAGES),
      );
    } catch {
      setError(
        "I couldn’t reach the assistant. Please check that the RAG server is running and try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section
      id="ask-ai"
      ref={sectionRef}
      className="grid-bg"
      style={{
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="hero-glow"
        style={{ top: "-220px", right: "-180px", opacity: 0.55 }}
      />
      <div
        style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <p className="section-label" style={{ marginBottom: "12px" }}>
            {"// 04. ask_ai"}
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Ask about{" "}
            <span
              className="text-glow"
              style={{ color: "var(--accent-green)" }}
            >
              Aman
            </span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              margin: "12px auto 0",
              maxWidth: "560px",
              lineHeight: 1.7,
            }}
          >
            Explore his experience, technical skills, education, and projects
            through a grounded AI assistant.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="terminal-window"
        >
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
              ask_aman.exe
            </span>
            <span
              style={{
                marginLeft: "auto",
                color: "var(--accent-green)",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "11px",
              }}
            >
            </span>
          </div>

          <div
            className="terminal-scroll"
            style={{
              minHeight: "280px",
              maxHeight: "460px",
              overflowY: "auto",
              padding: "24px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {messages.map((message) => (
                <ChatMessageView
                  key={message.id}
                  message={message}
                  isSending={isSending}
                  onSuggestionClick={(suggestion) =>
                    void submitQuestion(undefined, suggestion)
                  }
                />
              ))}
              {isSending && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    color: "var(--text-secondary)",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "12px",
                  }}
                >
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                    style={{ color: "var(--accent-green)" }}
                  />
                  searching_aman&apos;s_knowledge_base...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              style={{
                color: "#ff7b72",
                fontSize: "12px",
                padding: "0 24px 16px",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {error}
            </p>
          )}

          <form
            onSubmit={submitQuestion}
            style={{
              display: "flex",
              gap: "10px",
              padding: "16px",
              borderTop: "1px solid var(--border-color)",
              background: "rgba(0,0,0,0.12)",
            }}
          >
            <label
              htmlFor="ask-ai-input"
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              Ask about Aman
            </label>
            <input
              id="ask-ai-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="e.g. What did Aman build with Python?"
              className="terminal-input"
              disabled={isSending}
              maxLength={500}
              autoComplete="off"
            />
            <button
              type="submit"
              aria-label="Send question"
              className="btn-primary"
              disabled={isSending || !input.trim()}
              style={{
                padding: "0 17px",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                opacity: isSending || !input.trim() ? 0.5 : 1,
              }}
            >
              {isSending ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Send size={17} />
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
