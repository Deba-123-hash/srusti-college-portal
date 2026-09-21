// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Media & Campus Gallery Console
// =============================================================================

import React, { useState } from "react";
import { Plus, Image as ImageIcon, Trash2, Search, Tag } from "lucide-react";
import Card, { CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import {
  useAdminGallery,
  useCreateGalleryItem,
  useDeleteGalleryItem,
} from "../../hooks/useAdmin";

export const AdminGallery: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"EVENTS" | "CAMPUS" | "CULTURAL" | "SPORTS">("CAMPUS");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  const { data: galleryData, isLoading } = useAdminGallery({
    category: categoryFilter ? (categoryFilter as any) : undefined,
  });

  const createMutation = useCreateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    createMutation.mutate(
      {
        title,
        category,
        imageUrl,
        caption: caption || undefined,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setTitle("");
          setImageUrl("");
          setCaption("");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteItemId) return;
    deleteMutation.mutate(deleteItemId, {
      onSuccess: () => setDeleteItemId(null),
    });
  };

  const items = galleryData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Campus Gallery Media</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish event retrospectives, campus architecture imagery, sports meets, and student symposiums.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Gallery Media
        </Button>
      </div>

      {/* Filter Bar */}
      <Card variant="glass" className="p-4">
        <div className="flex items-center gap-3">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: "", label: "All Media Categories" },
              { value: "CAMPUS", label: "Campus Life & Infrastructure" },
              { value: "EVENTS", label: "Academic Events & Hackathons" },
              { value: "CULTURAL", label: "Cultural Festivals" },
              { value: "SPORTS", label: "Sports & Athletics" },
            ]}
          />
        </div>
      </Card>

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="w-6 h-6" />}
          title="No images uploaded"
          description="There are no gallery photos matching this category. Upload campus photography using the button above."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card
              key={item.id}
              variant="glass"
              className="overflow-hidden group hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => setDeleteItemId(item.id)}
                    className="p-1.5 bg-slate-950/80 hover:bg-rose-500 text-slate-300 hover:text-white rounded-lg transition-colors backdrop-blur-sm"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="blue" size="sm" className="font-bold">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-1">
                <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                {item.caption && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.caption}</p>
                )}
                <p className="text-[10px] text-slate-500 pt-1 font-mono">
                  {new Date(item.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Media Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Campus Media Photo" size="md">
        <form onSubmit={handleCreateItem} className="space-y-4">
          <Input
            label="Media Title"
            placeholder="e.g. Annual Management Conclave 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Media Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { value: "CAMPUS", label: "Campus Infrastructure" },
                { value: "EVENTS", label: "Academic / Seminars" },
                { value: "CULTURAL", label: "Cultural Fests" },
                { value: "SPORTS", label: "Sports & Athletics" },
              ]}
              required
            />
            <Input
              label="Image URL or Hosted Path"
              placeholder="e.g. /images/gallery/conclave.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Caption / Descriptive Notes
            </label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              rows={2}
              placeholder="Provide photo credits, highlights, dignitaries..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={createMutation.isPending}>
              Save to Gallery
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDelete}
        title="Delete Gallery Photo"
        message="Are you sure you want to permanently remove this image from the institution's public photo gallery?"
        confirmLabel="Delete Photo"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminGallery;
