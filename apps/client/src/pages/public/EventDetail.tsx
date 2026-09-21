// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Event Detail Page (Phase 7)
// =============================================================================

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Lock,
  Sparkles,
  Share2,
} from "lucide-react";
import { useEventById, useRegisterEvent } from "../../hooks/useEvents";
import { useAuthStore } from "../../store/authStore";
import { useToast } from "../../hooks/useToast";
import Button from "../../components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import Breadcrumbs from "../../components/navigation/Breadcrumbs";

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const isStudent = isAuthenticated && user?.role === "STUDENT";

  const { data: event, isLoading, isError, refetch } = useEventById(id || "");
  const registerMutation = useRegisterEvent();

  const handleRegister = async () => {
    if (!id) return;
    try {
      await registerMutation.mutateAsync(id);
      toast.success("Registration successful! You are enrolled for this event.");
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || "Failed to register for this event.";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <ErrorState
          title="Event Not Found"
          message={`The event record with ID "${id}" could not be located.`}
          onRetry={refetch}
        />
        <div className="mt-6 text-center">
          <Link to="/events">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Events Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      <Breadcrumbs
        items={[
          { label: "Events", path: "/events" },
          { label: event.title },
        ]}
      />

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="purple" size="md">
            {event.category}
          </Badge>
          <Badge variant={event.isRegistrationOpen ? "emerald" : "slate"} size="md">
            {event.isRegistrationOpen ? "Registration Open" : "Registration Closed"}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {event.title}
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description & Schedule */}
        <div className="lg:col-span-2 space-y-8">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>{event.description}</p>
              <p className="text-slate-400">
                Participation is open in accordance with event capacity and scheduling. All attendees must adhere to academic decorum and present student/faculty identification.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Key Info Card & Registration */}
        <div className="space-y-6">
          <Card variant="glass" className="p-6 space-y-6 border-purple-500/20">
            <h3 className="text-base font-bold text-white">Event Logistics</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
                <Calendar className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Date</span>
                  <strong className="text-white text-sm">{event.eventDate}</strong>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Timing</span>
                  <strong className="text-white text-sm">{event.time}</strong>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Venue</span>
                  <strong className="text-white">{event.venue}</strong>
                </div>
              </div>

              {event.capacity > 0 && (
                <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
                  <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Capacity</span>
                    <strong className="text-white">{event.capacity} Attendees</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Registration Action */}
            <div className="pt-2">
              {event.isUserRegistered ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>You Are Registered</span>
                </div>
              ) : !event.isRegistrationOpen ? (
                <Button variant="secondary" size="md" className="w-full" disabled>
                  Registration Closed
                </Button>
              ) : isStudent ? (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={registerMutation.isPending}
                  onClick={handleRegister}
                >
                  Register as Student
                </Button>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="w-full block">
                    <Button variant="primary" size="md" className="w-full" leftIcon={<Lock className="w-4 h-4" />}>
                      Login to Register
                    </Button>
                  </Link>
                  <p className="text-[11px] text-slate-500 text-center">
                    Student account required for active enrollment.
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Link to="/events" className="block text-center">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
