"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border p-12 text-center"
      >
        <CheckCircle2 className="text-moss" size={32} />
        <p className="font-display text-xl">Message sent</p>
        <p className="text-sm text-stone-600">We'll get back to you within one business day.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Subject</label>
        <input
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Message</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
        />
      </div>
      {status === "error" && <p className="text-sm text-clay">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary">
        {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : "Send message"}
      </button>
    </form>
  );
}
