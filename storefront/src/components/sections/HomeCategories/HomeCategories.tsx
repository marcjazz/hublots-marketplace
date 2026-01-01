import { Carousel } from "@/components/cells"
import { CategoryCard } from "@/components/organisms"
import { HttpTypes } from "@/types/medusa"
import { listCategories } from "@/lib/data/categories"

export const HomeCategories = async ({
  heading,
  categories: categoriesProp,
}: {
  heading: string
  categories?: HttpTypes.StoreProductCategory[]
}) => {
  const categories = categoriesProp || (await listCategories()).categories

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
