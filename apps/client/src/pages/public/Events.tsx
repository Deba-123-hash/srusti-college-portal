// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Events Directory Page (Phase 7)
// =============================================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  ChevronRight,
  Filter,
  Sparkles,
} from "lucide-react";
import { useEvents } from "../../hooks/useEvents";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card, { CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";

const EVENT_CATEGORIES = ["ALL", "Technical", "Cultural", "Seminar", "Sports"];

export const EventsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: eventsData,
    isLoading,
    isError,
    refetch,
  } = useEvents({
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
    search: searchQuery.trim() || undefined,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 pb-20">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>Campus Happenings</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Events &amp; Symposiums
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          From competitive hackathons and coding arenas to cultural galas and distinguished faculty seminars.
        </p>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search events by title, keyword, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="shrink-0 self-end sm:self-center"
            >
              Clear Search
            </Button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat === "ALL" ? "All Events" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Event Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Unable to Load Events"
          message="Failed to retrieve event records from the server."
          onRetry={refetch}
        />
      ) : eventsData?.data && eventsData.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsData.data.map((event) => (
            <Card key={event.id} variant="interactive" className="flex flex-col justify-between">
              <CardContent className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="sm">
                    {event.category}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {event.eventDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  {event.capacity > 0 && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>Capacity: {event.capacity} attendees</span>
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="p-6 sm:p-8 pt-0">
                <Link to={`/events/${event.id}`}>
                  <Button variant="secondary" size="sm" className="w-full" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    View Event Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Events Found"
          description="There are currently no events matching your selected category or search filter."
          actionLabel="View All Events"
          onAction={() => {
            setSelectedCategory("ALL");
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
};

export default EventsPage;
