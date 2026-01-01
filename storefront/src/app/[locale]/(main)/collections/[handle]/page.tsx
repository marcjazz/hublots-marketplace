import NotFound from "@/app/not-found"
import { Breadcrumbs } from "@/components/atoms"
import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { ProductListing } from "@/components/sections"
import { getCollectionByHandle } from "@/lib/data/collections"
import { Suspense } from "react"

const SingleCollectionsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string; locale: string }>
  searchParams: Promise<any>
}) => {
  const { handle, locale } = await params

  const collection = await getCollectionByHandle(handle)

  if (!collection) return <NotFound />

  const breadcrumbsItems = [
    {
      path: collection.handle,
      label: collection.title,
    },
  ]

  return (
    <main className="container">
      <div className="hidden md:block mb-2">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      <h1 className="heading-xl uppercase">{collection.title}</h1>

      <Suspense fallback={<ProductListingSkeleton />}>
        <ProductListing
          collection_id={collection.id}
          showSidebar
          searchParams={searchParams}
        />
      </Suspense>
    </main>
  )
}

export default SingleCollectionsPage
