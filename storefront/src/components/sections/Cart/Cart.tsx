import { CartItems } from "@/components/organisms"
import { CartSummary } from "@/components/organisms"
import { Cart as CartType } from "@/types/cart"

export const Cart = ({ cart }: { cart: CartType }) => {
  if (!cart || !cart.items?.length) {
    return null
  }

  return (
    <>
      <div className="col-span-12 lg:col-span-6">
        <CartItems cart={cart as any} />
      </div>
      <div className="lg:col-span-2"></div>
      <div className="col-span-12 lg:col-span-4">
        <div className="border rounded-sm p-4 h-fit">
          <CartSummary
            item_total={cart?.item_subtotal || 0}
            shipping_total={cart?.shipping_subtotal || 0}
            total={cart?.total || 0}
            currency_code={cart?.currency_code || ""}
            tax={cart?.tax_total || 0}
            discount_total={cart?.discount_total || 0}
          />
        </div>
      </div>
    </>
  )
}
