import { GalleryCarousel } from '@/components/organisms';
import { HttpTypes } from '@/types/medusa';

export const ProductGallery = ({
  images,
}: {
  images: HttpTypes.StoreProduct['images'];
}) => {
  if (!images || images.length === 0) return null;
   
  return (
    <div>
      <GalleryCarousel images={images} />
    </div>
  );
};
