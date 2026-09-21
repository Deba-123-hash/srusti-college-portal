// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Event Management Console
// =============================================================================

import React, { useState } from "react";
import { Plus, Search, Calendar, Trash2, MapPin, Users, Clock, CheckCircle2, XCircle } from "lucide-react";
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
  useAdminEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "../../hooks/useAdmin";

export const AdminEvents: React.FC = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("ACADEMIC");
  const [eventDate, setEventDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [venue, setVenue] = useState("Main Auditorium");
  const [capacity, setCapacity] = useState(150);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);

  const { data: eventsData, isLoading } = useAdminEvents({
    search: search || undefined,
    category: categoryFilter || undefined,
  });

  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !eventDate || !venue) return;

    createMutation.mutate(
      {
        title,
        description,
        category,
        eventDate,
        time,
        venue,
        capacity: Number(capacity),
        isRegistrationOpen,
        isPublished: true,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setTitle("");
          setDescription("");
          setEventDate("");
        },
      }
    );
  };

  const handleToggleRegistration = (id: string, currentOpen: boolean) => {
    updateMutation.mutate({
      id,
      data: { isRegistrationOpen: !currentOpen },
    });
  };

  const handleDelete = () => {
    if (!deleteEventId) return;
    deleteMutation.mutate(deleteEventId, {
      onSuccess: () => setDeleteEventId(null),
    });
  };

  const events = eventsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Event Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish symposiums, student hackathons, cultural festivals, and manage seat capacities.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule New Event
        </Button>
      </div>

      {/* Filter Bar */}
      <Card variant="glass" className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder="Search by event title or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: "", label: "All Event Categories" },
              { value: "ACADEMIC", label: "Academic & Tech" },
              { value: "CULTURAL", label: "Cultural" },
              { value: "SPORTS", label: "Sports & Athletics" },
              { value: "WORKSHOP", label: "Workshop & Seminar" },
            ]}
          />
        </div>
      </Card>

      {/* Event Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          title="No events found"
          description="No institutional events match your search filters. Click 'Schedule New Event' to post a symposium or fest."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <Card
              key={ev.id}
              variant="glass"
              className="flex flex-col justify-between hover:border-slate-700 transition-all duration-300"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="blue" size="sm" className="capitalize">
                    {ev.category.toLowerCase()}
                  </Badge>
                  <button
                    onClick={() => setDeleteEventId(ev.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Remove Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white leading-snug">{ev.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{new Date(ev.eventDate).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{ev.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Seat Capacity: {ev.capacity}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400">Seat Booking</span>
                  <button
                    onClick={() => handleToggleRegistration(ev.id, ev.isRegistrationOpen)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      ev.isRegistrationOpen
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                        : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {ev.isRegistrationOpen ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Open
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Closed
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule Event Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Campus Event" size="lg">
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input
            label="Event Title"
            placeholder="e.g. Srusti TechFest 2025: National Hackathon"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "ACADEMIC", label: "Academic / Technical" },
                { value: "CULTURAL", label: "Cultural" },
                { value: "SPORTS", label: "Sports & Athletics" },
                { value: "WORKSHOP", label: "Workshop & Industry Seminar" },
              ]}
              required
            />
            <Input
              label="Event Date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Time"
              placeholder="e.g. 10:00 AM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
            <Input
              label="Campus Venue"
              placeholder="e.g. Main Auditorium"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
            <Input
              label="Max Capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Event Details &amp; Guidelines
            </label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              rows={3}
              placeholder="Provide event schedule, eligibility, prize distribution, or registration details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="regOpen"
              checked={isRegistrationOpen}
              onChange={(e) => setIsRegistrationOpen(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="regOpen" className="text-xs text-slate-300 font-medium">
              Accept student registrations immediately
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={createMutation.isPending}>
              Publish Event
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteEventId}
        onClose={() => setDeleteEventId(null)}
        onConfirm={handleDelete}
        title="Cancel Campus Event"
        message="Are you sure you wish to delete this event? Existing student ticket registrations will be voided."
        confirmLabel="Delete Event"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminEvents;
