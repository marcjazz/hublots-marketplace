"use client"
import { CartAddressSection } from "@/components/sections/CartAddressSection/CartAddressSection"
import CartPaymentSection from "@/components/sections/CartPaymentSection/CartPaymentSection"
import CartReview from "@/components/sections/CartReview/CartReview"
import CartShippingMethodsSection from "@/components/sections/CartShippingMethodsSection/CartShippingMethodsSection"
import { HttpTypes } from "@medusajs/types"

const Checkout = ({
  cart,
  customer,
  availableShippingMethods,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  availableShippingMethods: HttpTypes.StoreShippingOption[] | null
  availablePaymentMethods: HttpTypes.StorePaymentProvider[] | null
}) => {
  return (
    <div className="grid grid-cols-1 gap-y-8">
      <CartAddressSection cart={cart} customer={customer} />
      <CartShippingMethodsSection
        cart={cart}
        availableShippingMethods={availableShippingMethods as any}
      />
      <CartPaymentSection
        cart={cart}
        availablePaymentMethods={availablePaymentMethods}
      />
      <CartReview cart={cart} />
    </div>
  )
}

export default Checkout
