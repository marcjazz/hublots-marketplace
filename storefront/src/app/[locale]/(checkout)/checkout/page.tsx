import { Heading } from "@medusajs/ui";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { retrieveCart } from "@/lib/data/cart";
import { retrieveCustomer } from "@/lib/data/customer";

export default async function CheckoutPage() {

  const cartId = (await cookies()).get("_medusa_cart_id")?.value;

  if (!cartId) {
    return notFound();
  }

  const cart = await retrieveCart(cartId);

  if (!cart) {
    return notFound();
  }

  // TODO: Uncomment when shipping methods are implemented
  const shippingMethods = await listCartShippingMethods(cart.id, false);
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? '');

  const customer = await retrieveCustomer();

  return (
    <div className="bg-primary text-primary">
      <div className="container flex flex-col md:flex-row gap-5 py-10">
        <div className="md:w-1/2">
          <Suspense fallback={<CheckoutSkeleton />}>
            <Checkout
              cart={cart}
              customer={customer}
              availableShippingMethods={shippingMethods}
              availablePaymentMethods={paymentMethods}
            />
          </Suspense>
        </div>
        <div className="md:w-1/2">
          <Heading>Order Summary</Heading>
        </div>
      </div>
    </div>
  );
}
