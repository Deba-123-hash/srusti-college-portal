// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Events & Workshop Registrations (/student/events)
// =============================================================================

import React, { useState } from "react";
import {
  useStudentEvents,
  useStudentRegistrations,
  useRegisterForEvent,
  useCancelEventRegistration,
} from "../../hooks/useStudentEvents";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  Ticket,
} from "lucide-react";

export const StudentEvents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ALL" | "REGISTERED">("ALL");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"REGISTER" | "CANCEL" | null>(null);

  const { data: eventsData, isLoading: isEventsLoading, isError: isEventsError, refetch: refetchEvents } =
    useStudentEvents();
  const { data: registrations, isLoading: isRegsLoading, isError: isRegsError, refetch: refetchRegs } =
    useStudentRegistrations();

  const registerMutation = useRegisterForEvent();
  const cancelMutation = useCancelEventRegistration();

  if (isEventsLoading || isRegsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 rounded-2xl bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (isEventsError || isRegsError) {
    return (
      <ErrorState
        title="Unable to Load Campus Events"
        message="An error occurred while fetching campus symposium and workshop schedules."
        onRetry={() => {
          refetchEvents();
          refetchRegs();
        }}
      />
    );
  }

  const events = eventsData?.data || [];
  const registeredEventIds = new Set((registrations || []).map((r) => r.eventId));

  const handleActionConfirm = () => {
    if (!selectedEventId || !confirmAction) return;

    if (confirmAction === "REGISTER") {
      registerMutation.mutate(selectedEventId, {
        onSettled: () => {
          setSelectedEventId(null);
          setConfirmAction(null);
        },
      });
    } else {
      cancelMutation.mutate(selectedEventId, {
        onSettled: () => {
          setSelectedEventId(null);
          setConfirmAction(null);
        },
      });
    }
  };

  const displayedEvents =
    activeTab === "ALL"
      ? events
      : events.filter((e) => registeredEventIds.has(e.id));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Campus Events &amp; Workshops
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Register for technical hackathons, guest seminars, academic conferences, and cultural meets.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "ALL"
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>All Campus Events</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px]">
            {events.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("REGISTERED")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "REGISTERED"
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>My Registrations</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px]">
            {registeredEventIds.size}
          </span>
        </button>
      </div>

      {/* Event Cards Grid */}
      {displayedEvents.length === 0 ? (
        <EmptyState
          title={activeTab === "ALL" ? "No Events Scheduled" : "No Registered Events"}
          description={
            activeTab === "ALL"
              ? "There are currently no public campus events scheduled."
              : "You have not enrolled in any campus events or workshops yet."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((evt) => {
            const isRegistered = registeredEventIds.has(evt.id);

            return (
              <Card
                key={evt.id}
                variant="glass"
                className="border-slate-800 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Category Header */}
                  <div className="p-4 pb-0 flex items-center justify-between">
                    <Badge variant="blue" size="sm" className="font-semibold">
                      {evt.category}
                    </Badge>
                    {isRegistered && (
                      <Badge variant="emerald" size="sm" className="gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Registered</span>
                      </Badge>
                    )}
                  </div>

                  {/* Title & Description */}
                  <CardHeader className="pt-3 pb-2">
                    <CardTitle className="text-base text-white font-bold leading-snug line-clamp-2">
                      {evt.title}
                    </CardTitle>
                    <p className="text-xs text-slate-300 line-clamp-3 mt-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </CardHeader>

                  {/* Logistics */}
                  <CardContent className="space-y-2 text-xs text-slate-400 pt-0 pb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{evt.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Max Capacity: {evt.capacity} students</span>
                    </div>
                  </CardContent>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
                  {isRegistered ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30 gap-1.5"
                      onClick={() => {
                        setSelectedEventId(evt.id);
                        setConfirmAction("CANCEL");
                      }}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Registration</span>
                    </Button>
                  ) : (
                    <Button
                      variant={evt.isRegistrationOpen ? "primary" : "secondary"}
                      size="sm"
                      disabled={!evt.isRegistrationOpen || registerMutation.isPending}
                      className="w-full text-xs font-bold gap-1.5"
                      onClick={() => {
                        setSelectedEventId(evt.id);
                        setConfirmAction("REGISTER");
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {evt.isRegistrationOpen ? "Register for Event" : "Registration Closed"}
                      </span>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!selectedEventId}
        title={
          confirmAction === "REGISTER"
            ? "Confirm Event Registration"
            : "Cancel Event Registration"
        }
        message={
          confirmAction === "REGISTER"
            ? "Would you like to enroll for this campus event? An official ticket will be linked to your student ID."
            : "Are you sure you want to cancel your seat for this event?"
        }
        confirmLabel={confirmAction === "REGISTER" ? "Confirm Registration" : "Cancel Seat"}
        cancelLabel="Go Back"
        variant={confirmAction === "REGISTER" ? "primary" : "danger"}
        isLoading={registerMutation.isPending || cancelMutation.isPending}
        onConfirm={handleActionConfirm}
        onClose={() => {
          setSelectedEventId(null);
          setConfirmAction(null);
        }}
      />
    </div>
  );
};

export default StudentEvents;
