"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");
      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return <p className="text-sm text-stone-100">{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-0 border-b border-stone-500 pb-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="w-full bg-transparent text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="whitespace-nowrap text-sm font-medium text-stone-100 underline underline-offset-4 disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Sign up"}
      </button>
      {status === "error" && <p className="mt-2 text-xs text-clay">{message}</p>}
    </form>
  );
}
