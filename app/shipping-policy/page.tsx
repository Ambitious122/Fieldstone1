import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <div className="container-fs max-w-2xl py-16 prose prose-stone">
      <p className="eyebrow">Policies</p>
      <h1 className="mt-2 text-4xl">Shipping Policy</h1>
      <div className="mt-8 space-y-5 text-stone-700">
        <p>Orders are processed and shipped within 2 business days of purchase, Monday through Friday, excluding holidays.</p>
        <p>Domestic orders typically arrive within 5–7 business days after shipment. Expedited shipping options are available at checkout.</p>
        <p>International orders are subject to customs processing and may take longer to arrive. Any customs duties or import taxes are the responsibility of the recipient.</p>
        <p>You will receive a shipping confirmation email with tracking information as soon as your order leaves our facility.</p>
      </div>
    </div>
  );
}
