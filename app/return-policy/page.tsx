import type { Metadata } from "next";

export const metadata: Metadata = { title: "Return & Refund Policy" };

export default function ReturnPolicyPage() {
  return (
    <div className="container-fs max-w-2xl py-16">
      <p className="eyebrow">Policies</p>
      <h1 className="mt-2 text-4xl">Return & Refund Policy</h1>
      <div className="mt-8 space-y-5 text-stone-700">
        <p>We accept returns within 30 days of delivery for unused items in their original packaging.</p>
        <p>To start a return, contact us through the Contact page with your order number. We'll provide a return shipping label and instructions.</p>
        <p>Once we receive and inspect your return, refunds are issued to your original payment method within 5–10 business days.</p>
        <p>Final sale items, as marked on the product page, are not eligible for return or refund.</p>
      </div>
    </div>
  );
}
