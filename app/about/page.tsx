import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Fieldstone",
  description: "Why Fieldstone exists, and how we choose the materials we build with.",
};

export default function AboutPage() {
  return (
    <div>
      <div className="relative flex h-[50vh] items-end overflow-hidden bg-ink text-limestone">
        <Image
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2400"
          alt="Fieldstone workshop and material sourcing"
          fill
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="container-fs relative z-10 pb-14">
          <p className="eyebrow text-stone-300">About us</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl md:text-6xl">
            We make things from what the earth already gave us.
          </h1>
        </div>
      </div>

      <div className="container-fs grid grid-cols-1 gap-16 py-20 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl">How we started</h2>
          <p className="mt-4 text-stone-700">
            Fieldstone began with a simple frustration: most "natural material" goods on the market weren't
            natural at all, and no one making them could tell you where the material actually came from. We
            started working directly with quarries, mills, and small foundries willing to answer that question
            honestly — and built a small catalog of goods around what they had to offer.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl">How we choose materials</h2>
          <p className="mt-4 text-stone-700">
            Every material in our catalog is traceable to a named source. We favor suppliers who can show us
            their process, not just their certificates, and we design products around what a material is
            naturally good at rather than forcing it into a shape it wasn't suited for.
          </p>
        </div>
      </div>
    </div>
  );
}
