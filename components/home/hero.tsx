"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const wordVariant = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const headline = "Materials, made to last.";

  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink text-limestone">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400"
          alt="Raw stone and natural material textures used across the Fieldstone collection"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        {/* Strata motif echoed in the hero as a quiet geological accent */}
        <div className="absolute bottom-0 left-0 right-0 flex h-2">
          <span className="h-full w-[38%] bg-clay" />
          <span className="h-full w-[24%] bg-moss" />
          <span className="h-full w-[16%] bg-stone-500" />
          <span className="h-full flex-1 bg-stone-900" />
        </div>
      </div>

      <div className="container-fs relative z-10 pb-20 pt-40 md:pb-28">
        <motion.p initial="hidden" animate="show" variants={fadeUp} className="eyebrow text-stone-300">
          Fieldstone — Autumn Collection
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={container}
          className="mt-4 max-w-2xl overflow-hidden font-display text-5xl leading-[1.05] md:text-7xl"
        >
          {headline.split(" ").map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 pr-3 align-top">
              <motion.span variants={wordVariant} className="inline-block">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-md text-stone-300"
        >
          Honestly sourced stone, wood, and metal — shaped into goods built for daily use, not the shelf.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.65 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Link href="/shop" className="btn-primary bg-limestone text-ink hover:bg-clay hover:text-paper">
            Shop now
          </Link>
          <Link
            href="/collections/all"
            className="btn-secondary border-limestone/30 text-limestone hover:border-limestone hover:bg-limestone hover:text-ink"
          >
            Explore collections
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
