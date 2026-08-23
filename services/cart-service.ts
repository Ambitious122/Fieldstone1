import { shopifyFetch } from "@/lib/shopify";
import { CREATE_CART, GET_CART, ADD_CART_LINES, UPDATE_CART_LINES, REMOVE_CART_LINES } from "@/lib/queries/cart";
import type { ShopifyCart } from "@/types/shopify";

type CartLineInput = { merchandiseId: string; quantity: number };

function unwrap<T extends { cart: ShopifyCart; userErrors: { field: string[]; message: string }[] }>(
  data: T
): ShopifyCart {
  if (data.userErrors?.length) {
    throw new Error(data.userErrors.map((e) => e.message).join(", "));
  }
  return data.cart;
}

export async function createCart(lines: CartLineInput[] = []) {
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart; userErrors: any[] } }>(CREATE_CART, { lines });
  return unwrap(data.cartCreate);
}

export async function getCart(cartId: string) {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(GET_CART, { cartId });
  return data.cart;
}

export async function addCartLines(cartId: string, lines: CartLineInput[]) {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart; userErrors: any[] } }>(ADD_CART_LINES, {
    cartId,
    lines,
  });
  return unwrap(data.cartLinesAdd);
}

export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]) {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart; userErrors: any[] } }>(UPDATE_CART_LINES, {
    cartId,
    lines,
  });
  return unwrap(data.cartLinesUpdate);
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart; userErrors: any[] } }>(REMOVE_CART_LINES, {
    cartId,
    lineIds,
  });
  return unwrap(data.cartLinesRemove);
}
