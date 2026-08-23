"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  // Avoid hydration mismatch: the resolved theme is only known client-side.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={`h-10 w-10 rounded-full ${className}`} aria-hidden="true" />;
  }

  const active = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2];

  return (
    <div className={`relative ${className}`}>
      <button
        aria-label={`Theme: ${active.label}. Click to change.`}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-hover"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={resolvedTheme}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex"
          >
            {resolvedTheme === "dark" ? (
              <Moon size={19} strokeWidth={1.5} />
            ) : (
              <Sun size={19} strokeWidth={1.5} />
            )}
          </motion.span>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-12 z-50 w-40 overflow-hidden rounded-2xl border border-border bg-paper p-1.5 shadow-xl"
            >
              {OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isActive = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setTheme(opt.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                      isActive ? "bg-surface font-medium text-ink" : "text-stone-700 hover:bg-surface"
                    }`}
                  >
                    <Icon size={15} strokeWidth={1.5} />
                    {opt.label}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
