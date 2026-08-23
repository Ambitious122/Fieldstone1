"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container-fs flex min-h-[40vh] flex-col items-center justify-center gap-3 py-24 text-center"
    >
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-surface">
        <PackageSearch size={24} className="text-stone-500" />
      </div>
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="max-w-sm text-stone-600 dark:text-stone-400">{description}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-primary mt-4">
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
