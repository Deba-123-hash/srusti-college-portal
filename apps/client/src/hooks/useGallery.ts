// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// useGallery Hook
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { galleryApi, GalleryQueryParams } from "../api/gallery";

export const useGallery = (params?: GalleryQueryParams) => {
  return useQuery({
    queryKey: ["gallery", params],
    queryFn: () => galleryApi.getGallery(params),
    staleTime: 5 * 60 * 1000,
  });
};

export default useGallery;
