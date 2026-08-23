import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { fetchCustomerOrders } from "@/lib/shopify-customer-auth";

export const metadata: Metadata = { title: "Your account" };

export default async function AccountPage() {
  const token = cookies().get("customer_access_token")?.value;

  if (!token) {
    return (
      <div className="container-fs flex min-h-[50vh] flex-col items-center justify-center gap-5 py-20 text-center">
        <h1 className="font-display text-3xl">Sign in to your account</h1>
        <p className="max-w-sm text-stone-600">
          View your order history, saved addresses, and account details. Sign-in is handled securely by Shopify.
        </p>
        <a href="/api/auth/login" className="btn-primary">
          Sign in
        </a>
      </div>
    );
  }

  let customer = null;
  try {
    const data = await fetchCustomerOrders(token);
    customer = data?.data?.customer ?? null;
  } catch (error) {
    console.error("[account] failed to load customer", error);
  }

  return (
    <div className="container-fs py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-2 text-3xl">
            Welcome{customer?.firstName ? `, ${customer.firstName}` : ""}
          </h1>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="btn-secondary">
            Sign out
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl">Account details</h2>
          <p className="mt-3 text-sm text-stone-600">{customer?.emailAddress?.emailAddress}</p>
        </div>
        <div>
          <h2 className="font-display text-xl">Order history</h2>
          <Link href="/account/orders" className="mt-3 inline-block text-sm underline underline-offset-4">
            View all orders →
          </Link>
        </div>
      </div>
    </div>
  );
}
