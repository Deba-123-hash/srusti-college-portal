// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Announcements & Institutional Circulars Console
// =============================================================================

import React, { useState } from "react";
import { Plus, Search, Megaphone, Trash2, Pin, Calendar, AlertCircle } from "lucide-react";
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
  useAdminAnnouncements,
  useCreateAnnouncement,
  useDeleteAnnouncement,
} from "../../hooks/useAdmin";

export const AdminAnnouncements: React.FC = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteNoticeId, setDeleteNoticeId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [isPinned, setIsPinned] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");

  const { data: noticesData, isLoading } = useAdminAnnouncements({
    search: search || undefined,
    category: categoryFilter || undefined,
  });

  const createMutation = useCreateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    createMutation.mutate(
      {
        title,
        content,
        category,
        isPinned,
        expiresAt: expiresAt || null,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setTitle("");
          setContent("");
          setIsPinned(false);
          setExpiresAt("");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteNoticeId) return;
    deleteMutation.mutate(deleteNoticeId, {
      onSuccess: () => setDeleteNoticeId(null),
    });
  };

  const notices = noticesData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Announcements &amp; Circulars</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish institution-wide notices, examination notifications, holiday advisories, and pinned alerts.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Publish Announcement
        </Button>
      </div>

      {/* Filter Bar */}
      <Card variant="glass" className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder="Search circulars by subject or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: "", label: "All Notice Categories" },
              { value: "General", label: "General Notice" },
              { value: "Academic", label: "Academic / Curriculum" },
              { value: "Examination", label: "Examination & Results" },
              { value: "Placement", label: "Placements & Training" },
              { value: "Holiday", label: "Holidays & Closures" },
            ]}
          />
        </div>
      </Card>

      {/* Notices List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-6 h-6" />}
          title="No circulars posted"
          description="There are currently no announcements matching your filter parameters. Publish an institutional bulletin above."
        />
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <Card
              key={n.id}
              variant="glass"
              className="p-5 hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="blue" size="sm" className="capitalize">
                      {n.category}
                    </Badge>
                    {n.isPinned && (
                      <Badge variant="gold" size="sm" className="flex items-center gap-1 font-bold">
                        <Pin className="w-3 h-3" />
                        PINNED NOTICE
                      </Badge>
                    )}
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(n.createdAt).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{n.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{n.content}</p>

                  {n.expiresAt && (
                    <p className="text-[11px] text-slate-500 pt-1">
                      Expires: {new Date(n.expiresAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setDeleteNoticeId(n.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                  title="Archive Notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Publish Announcement Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Official Circular" size="lg">
        <form onSubmit={handleCreateNotice} className="space-y-4">
          <Input
            label="Circular Title"
            placeholder="e.g. Schedule of End Semester Autonomous Examinations 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Notice Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "General", label: "General Notice" },
                { value: "Academic", label: "Academic / Curriculum" },
                { value: "Examination", label: "Examination & Results" },
                { value: "Placement", label: "Placements & Training" },
                { value: "Holiday", label: "Holidays & Closures" },
              ]}
              required
            />
            <Input
              label="Notice Expiry Date (Optional)"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notice Content &amp; Instructions
            </label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              rows={5}
              placeholder="Draft official institutional memo, guidelines, instructions for students/faculty..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPinned"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPinned" className="text-xs text-slate-300 font-medium">
              Pin to top of student portal bulletins and home page
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={createMutation.isPending}>
              Publish Circular
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteNoticeId}
        onClose={() => setDeleteNoticeId(null)}
        onConfirm={handleDelete}
        title="Archive Circular"
        message="Are you sure you want to remove this institutional notice? It will no longer display on student and public portals."
        confirmLabel="Archive Notice"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminAnnouncements;
