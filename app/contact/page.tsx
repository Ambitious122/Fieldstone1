import type { Metadata } from "next";
import { ContactForm } from "@/components/home/contact-form";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the Fieldstone team.",
};

export default function ContactPage() {
  return (
    <div className="container-fs grid grid-cols-1 gap-16 py-16 md:grid-cols-2">
      <div>
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-2 text-4xl">Contact us</h1>
        <p className="mt-5 max-w-md text-stone-700">
          Questions about an order, a material, or a custom request — send us a note and we'll reply within one
          business day.
        </p>
        <div className="mt-10 space-y-3 text-sm text-stone-700">
          <p>hello@fieldstone.com</p>
          <p>Mon–Fri, 9am–5pm ET</p>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
