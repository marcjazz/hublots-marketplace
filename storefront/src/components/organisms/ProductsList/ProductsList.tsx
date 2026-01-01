import { ProductCard } from "../ProductCard/ProductCard"
import { HttpTypes } from '@/types/medusa'

export const ProductsList = ({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) => {
  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} api_product={product} />
      ))}
    </>
  )
}
