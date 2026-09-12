import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aman Singh Chauhan | Full Stack Developer",
  description:
    "Portfolio of Aman Singh Chauhan — Full Stack Developer specializing in React, Next.js, Node.js, and Python. Building scalable, modern web applications.",
  keywords: [
    "Aman Singh Chauhan",
    "Full Stack Developer",
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "Python",
    "Portfolio",
  ],
  authors: [{ name: "Aman Singh Chauhan" }],
  openGraph: {
    title: "Aman Singh Chauhan | Full Stack Developer",
    description:
      "Full Stack Developer specializing in React, Next.js, Node.js, and Python.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
