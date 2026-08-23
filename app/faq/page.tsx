import type { Metadata } from "next";
import { ProductAccordion } from "@/components/product/product-accordion";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  {
    title: "How long does shipping take?",
    content: "Most orders ship within 2 business days and arrive within 5–7 business days domestically.",
  },
  {
    title: "What is your return policy?",
    content: "We accept returns within 30 days of delivery on unused items in original packaging. See our Returns page for the full policy.",
  },
  {
    title: "Do you ship internationally?",
    content: "Yes — international shipping is available at checkout, with rates and timelines calculated by destination.",
  },
  {
    title: "How do I care for natural material products?",
    content: "Each product page includes material-specific care instructions under the Description tab. As a rule, avoid harsh chemical cleaners and excess moisture.",
  },
  {
    title: "Can I track my order?",
    content: "Yes — you'll receive a tracking link by email once your order ships, and it's also visible in your account's Order History.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-fs max-w-3xl py-16">
      <p className="eyebrow">Support</p>
      <h1 className="mt-2 mb-10 text-4xl">Frequently asked questions</h1>
      <ProductAccordion items={FAQS} />
    </div>
  );
}
