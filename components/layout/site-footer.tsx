import Link from "next/link";
import { NewsletterForm } from "@/components/home/newsletter-form";

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/collections/all", label: "Collections" },
      { href: "/wishlist", label: "Wishlist" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/shipping-policy", label: "Shipping" },
      { href: "/return-policy", label: "Returns" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Fieldstone" },
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/terms", label: "Terms & conditions" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-800 bg-stone-900 text-stone-100">
      <div className="container-fs grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">Fieldstone</p>
          <p className="mt-4 max-w-xs text-sm text-stone-400">
            Considered goods from honestly sourced natural materials — built to be used, not just owned.
          </p>
          <div className="mt-6 max-w-sm">
            <NewsletterForm />
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow text-stone-500">{col.title}</p>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-stone-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-stone-700/50 py-6">
        <p className="container-fs text-xs text-stone-500">
          © {new Date().getFullYear()} Fieldstone. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
