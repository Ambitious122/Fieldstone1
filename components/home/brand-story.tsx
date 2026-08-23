import Image from "next/image";

export function BrandStory() {
  return (
    <section className="container-fs grid grid-cols-1 items-center gap-12 py-24 md:grid-cols-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
        <Image
          src="https://images.unsplash.com/photo-1509909756405-be0199881695?q=80&w=1600"
          alt="Craftsperson shaping raw material by hand in the Fieldstone workshop"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div>
        <p className="eyebrow">Our approach</p>
        <h2 className="mt-3 max-w-md text-3xl md:text-4xl">
          Every material has a source. We make sure ours is one worth telling.
        </h2>
        <p className="mt-5 max-w-md text-stone-700">
          We work directly with quarries, mills, and foundries who can name where a material came from —
          then hand it to makers who know how to let it age well. No composites standing in for the real thing.
        </p>
        <a href="/about" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
          Read our story
        </a>
      </div>
    </section>
  );
}
