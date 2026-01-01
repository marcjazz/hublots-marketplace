import { Carousel } from "@/components/cells"
import { CategoryCard } from "@/components/organisms"
import { HttpTypes } from "@/types/medusa"

export const HomeCategories = async ({
  heading,
  categories,
}: {
  heading: string
  categories: HttpTypes.StoreProductCategory[]
}) => {
  return (
    <section className="bg-primary py-8 w-full">
      <div className="mb-6">
        <h2 className="heading-lg text-primary uppercase">{heading}</h2>
      </div>
      <Carousel
        items={categories?.map((category) => (
          <CategoryCard key={category.id} category={category as any} />
        ))}
      />
    </section>
  )
}
