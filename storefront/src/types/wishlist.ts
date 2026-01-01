import { HttpTypes } from '@/types/medusa'

export type Wishlist = {
  id: string
  products: HttpTypes.StoreProduct[]
}
