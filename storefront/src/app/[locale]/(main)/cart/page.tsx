import { Suspense } from "react"

import { Cart } from "@/components/sections"
import { retrieveCart } from "@/lib/data/cart"
import { cookies } from "next/headers"
import { CartEmpty } from "@/components/organisms"

export default async function CartPage() {
  const cartId = (await cookies()).get("_medusa_cart_id")?.value;

  if (!cartId) {
    return <CartEmpty />;
  }

  const cart = await retrieveCart(cartId);

  if (!cart) {
    return <CartEmpty />;
  }

  return (
    <main className='container grid grid-cols-12'>
      <Suspense fallback={<>Loading...</>}>
        <Cart cart={cart} />
      </Suspense>
    </main>
  );
}
