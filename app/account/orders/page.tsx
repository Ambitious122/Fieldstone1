import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchCustomerOrders } from "@/lib/shopify-customer-auth";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Order history" };

export default async function OrderHistoryPage() {
  const token = cookies().get("customer_access_token")?.value;
  if (!token) redirect("/account");

  const data = await fetchCustomerOrders(token);
  const orders = data?.data?.customer?.orders?.nodes ?? [];

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Your past orders will show up here once you make a purchase."
        actionHref="/shop"
        actionLabel="Shop all products"
      />
    );
  }

  return (
    <div className="container-fs py-16">
      <h1 className="mb-8 font-display text-3xl">Order history</h1>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-stone-500">
              <th className="py-3 font-medium">Order</th>
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium">Payment</th>
              <th className="py-3 font-medium">Fulfillment</th>
              <th className="py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-b border-border">
                <td className="py-4 font-medium">{order.name}</td>
                <td className="py-4 text-stone-600">{new Date(order.processedAt).toLocaleDateString()}</td>
                <td className="py-4 text-stone-600">{order.financialStatus}</td>
                <td className="py-4 text-stone-600">{order.fulfillmentStatus}</td>
                <td className="py-4 text-right">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: order.totalPrice.currencyCode }).format(
                    parseFloat(order.totalPrice.amount)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
