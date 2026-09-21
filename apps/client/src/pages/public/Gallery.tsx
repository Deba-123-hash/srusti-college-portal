// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Media Gallery & Lightbox Page (Phase 7)
// =============================================================================

import React, { useState, useEffect } from "react";
import { Image as ImageIcon, ChevronLeft, ChevronRight, X, Filter, Sparkles } from "lucide-react";
import { useGallery } from "../../hooks/useGallery";
import { GalleryItem, GalleryCategory } from "../../api/gallery";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";

const CATEGORIES: Array<"ALL" | GalleryCategory> = [
  "ALL",
  "CAMPUS",
  "EVENTS",
  "CULTURAL",
  "SPORTS",
];

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | GalleryCategory>("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const {
    data: galleryData,
    isLoading,
    isError,
    refetch,
  } = useGallery({
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
  });

  const items = galleryData?.data || [];
  const activeItem: GalleryItem | null =
    lightboxIndex !== null && items[lightboxIndex] ? items[lightboxIndex] : null;

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, items.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 pb-20">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
          <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>Visual Retrospective</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Campus Life in Frames
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Glimpses of academic milestones, cultural festivals, sports days, and the modern campus facilities at Srusti Academy.
        </p>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold transition shrink-0 ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {cat === "ALL" ? "All Moments" : cat}
          </button>
        ))}
      </div>

      {/* 3. Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Unable to Load Gallery"
          message="Could not retrieve gallery photographs from the server."
          onRetry={refetch}
        />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-blue-500/50 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/20"
            >
              <div className="aspect-[4/3] w-full bg-slate-950 relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback visual for missing files
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                <Badge variant="blue" size="sm">
                  {item.category}
                </Badge>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-300 line-clamp-1">{item.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Images in This Category"
          description="There are currently no photographs tagged under the selected category."
          actionLabel="View All Photographs"
          onAction={() => setSelectedCategory("ALL")}
        />
      )}

      {/* 4. Lightbox Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200"
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 transition"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 transition"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 transition"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Image Box */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center">
            <img
              src={activeItem.imageUrl}
              alt={activeItem.title}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-slate-800"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop";
              }}
            />
            <div className="mt-4 text-center space-y-1">
              <h3 className="text-base font-bold text-white">{activeItem.title}</h3>
              {activeItem.caption && (
                <p className="text-xs text-slate-400 max-w-lg mx-auto">{activeItem.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
