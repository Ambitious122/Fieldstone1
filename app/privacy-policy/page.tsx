import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="container-fs max-w-2xl py-16">
      <p className="eyebrow">Policies</p>
      <h1 className="mt-2 text-4xl">Privacy Policy</h1>
      <div className="mt-8 space-y-5 text-stone-700">
        <p>This policy describes how Fieldstone collects, uses, and protects your personal information when you visit or make a purchase from our site.</p>
        <p>We collect information you provide directly (name, email, shipping address, payment details processed securely through Shopify) and information collected automatically (device, browser, and usage data) to operate and improve the store.</p>
        <p>We do not sell your personal information. We share data only with service providers necessary to fulfill orders (payment processing, shipping, email) and as required by law.</p>
        <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us.</p>
      </div>
    </div>
  );
}
