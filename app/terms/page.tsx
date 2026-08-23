import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="container-fs max-w-2xl py-16">
      <p className="eyebrow">Policies</p>
      <h1 className="mt-2 text-4xl">Terms & Conditions</h1>
      <div className="mt-8 space-y-5 text-stone-700">
        <p>By accessing and using this site, you agree to these terms. If you do not agree, please do not use the site.</p>
        <p>All content on this site, including product designs, photography, and text, is the property of Fieldstone and may not be reproduced without permission.</p>
        <p>Prices and product availability are subject to change without notice. We reserve the right to refuse or cancel any order at our discretion.</p>
        <p>These terms are governed by the laws of the jurisdiction in which Fieldstone is registered, without regard to conflict of law principles.</p>
      </div>
    </div>
  );
}
