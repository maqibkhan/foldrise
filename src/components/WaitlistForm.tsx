"use client";

import { useId, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputId = useId();
  const messageId = useId();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setStatus("error");
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border-strong bg-white/5 px-4 text-label-sm"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
          <path
            d="M16.7 5.2 8.7 15.7a.75.75 0 0 1-1.13.07l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.9 3.89 7.48-9.82a.75.75 0 0 1 1.19.92Z"
            fill="currentColor"
          />
        </svg>
        <span className="text-label-sm text-text-strong">
          You&apos;re on the list — we&apos;ll email you at launch.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        name="email"
        inputMode="email"
        autoComplete="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        aria-invalid={status === "error"}
        aria-describedby={status === "error" ? messageId : undefined}
        disabled={status === "loading"}
        className="text-paragraph-sm h-12 w-full rounded-xl border border-border-strong bg-transparent px-3 text-text-strong outline-none transition-colors placeholder:text-text-soft focus:border-white/25 disabled:opacity-60"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="text-label-sm flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-bg-white px-3.5 text-text-darker transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" && (
          <svg aria-hidden="true" className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
          </svg>
        )}
        {status === "loading" ? "Joining..." : "Get early access"}
      </button>

      {status === "error" && (
        <p id={messageId} role="alert" className="text-paragraph-sm text-center text-red-400">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
