// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Public Home Page (Phase 7)
// =============================================================================

import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Briefcase,
  Calendar,
  Sparkles,
  ChevronRight,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Megaphone,
} from "lucide-react";
import { COLLEGE_NAME, COLLEGE_ADDRESS } from "@srusti/shared";
import { useCourses } from "../../hooks/useCourses";
import { useEvents } from "../../hooks/useEvents";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import { usePlacementDrives, useCompanies } from "../../hooks/usePlacements";
import Button from "../../components/ui/Button";
import Card, { CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";

export const HomePage: React.FC = () => {
  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
    refetch: refetchCourses,
  } = useCourses({ limit: 4 });

  const {
    data: eventsData,
    isLoading: eventsLoading,
    isError: eventsError,
    refetch: refetchEvents,
  } = useEvents({ limit: 3, upcoming: true });

  const { data: announcementsData, isLoading: announcementsLoading } =
    useAnnouncements({ limit: 4 });

  const { data: drivesData, isLoading: drivesLoading } = usePlacementDrives({
    activeOnly: true,
    limit: 3,
  });

  const { data: companiesData, isLoading: companiesLoading } = useCompanies({
    limit: 6,
  });

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Institution Header Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Premier Center for Higher Education &bull; Bhubaneswar</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Igniting Potential in{" "}
            <span className="blue-gradient-text">Management</span> &amp;{" "}
            <span className="gold-gradient-text">Technology</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Welcome to <strong className="text-white font-semibold">{COLLEGE_NAME}</strong>.
            Fostering rigorous scholarship, industry partnerships, and technology innovation
            at the heart of Odisha's IT and educational hub.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/courses">
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-xl shadow-blue-900/40"
              >
                Explore Programs
              </Button>
            </Link>
            <Link to="/admissions">
              <Button size="lg" variant="gold">
                Admissions 2025
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Campus
              </Button>
            </Link>
          </div>

          {/* Institutional Highlights Ticker */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-white">MCA &bull; MBA</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Postgraduate Programs
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-blue-400">BCA &bull; BBA</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Undergraduate Programs
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">Infocity</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Patia Campus, BBSR
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">Active</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Placement Drives
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Announcements Bar */}
      {announcementsData?.data && announcementsData.data.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-blue-500/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                  Campus Announcements
                </span>
                <span className="text-sm font-bold text-white">
                  {announcementsData.data[0].title}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
              {announcementsData.data[0].content}
            </p>

            <Link
              to="/about"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0"
            >
              <span>View Notice</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* 3. Academic Programs Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Curriculum &bull; Excellence
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Academic Programs
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg">
              Industry-aligned degree courses engineered to cultivate critical thinking, technical mastery, and managerial competence.
            </p>
          </div>
          <Link to="/courses">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Courses
            </Button>
          </Link>
        </div>

        {coursesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : coursesError ? (
          <ErrorState
            title="Unable to load courses"
            message="We could not connect to the academic catalog API. Please try again."
            onRetry={refetchCourses}
          />
        ) : coursesData?.data && coursesData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coursesData.data.map((course) => (
              <Card key={course.id} variant="interactive" className="flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="blue" size="sm">
                      {course.code || course.slug.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {course.durationYears} Years
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
                      {course.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                    <div>
                      <span className="text-slate-500 font-medium">Eligibility: </span>
                      <span className="text-slate-300 font-semibold">{course.eligibility}</span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-6 pt-0">
                  <Link to={`/courses/${course.slug}`}>
                    <Button variant="secondary" size="sm" className="w-full" rightIcon={<ChevronRight className="w-4 h-4" />}>
                      Course Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            No courses are currently available in the catalog.
          </div>
        )}
      </section>

      {/* 4. About Institution Brief */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/30 border border-slate-800 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Institutional Profile
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Academic Rigor &amp; Futuristic Infrastructure
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Located near Infocity in Bhubaneswar, Srusti Academy bridges academic theory with industrial applications. Our campus provides modern computing laboratories, extensive library holdings, and specialized seminar auditoriums designed to equip students for global competitive landscapes.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Experienced faculty with extensive industry and academic credentials</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Comprehensive career guidance and campus recruitment training</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Modern campus with advanced IT infrastructure and seminar facilities</span>
                </li>
              </ul>
              <div>
                <Link to="/about">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Discover Srusti
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <Building2 className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="text-sm font-bold text-white">Urban Campus</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Centrally situated in Patia, near Bhubaneswar's leading IT parks.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <GraduationCap className="w-8 h-8 text-amber-400 mb-3" />
                  <h4 className="text-sm font-bold text-white">Degree Programs</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Autonomous and affiliated university degree curricula.
                  </p>
                </div>
              </div>
              <div className="space-y-4 pt-6 sm:pt-10">
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <Briefcase className="w-8 h-8 text-emerald-400 mb-3" />
                  <h4 className="text-sm font-bold text-white">Recruitment Hub</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Active campus drives with notable regional and national recruiters.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <Calendar className="w-8 h-8 text-indigo-400 mb-3" />
                  <h4 className="text-sm font-bold text-white">Vibrant Life</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Year-round technical symposiums, cultural nights, and sports meets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Placements Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Career Trajectories
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Placements &amp; Corporate Relations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg">
              Active campus recruitment drives connecting graduating scholars with industry recruiters.
            </p>
          </div>
          <Link to="/placements">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Placements
            </Button>
          </Link>
        </div>

        {/* Active Drives */}
        {drivesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 w-full" />
            ))}
          </div>
        ) : drivesData?.data && drivesData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drivesData.data.map((drive) => (
              <Card key={drive.id} variant="glass" className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="emerald" size="sm">
                      Package: {drive.ctcPackage}
                    </Badge>
                    <h3 className="text-base font-bold text-white mt-2">
                      {drive.jobRole}
                    </h3>
                    <p className="text-xs font-semibold text-blue-400">
                      {drive.company?.name || "Recruiting Partner"}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {drive.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Eligible: <strong className="text-slate-200">{drive.eligibleCourses}</strong></span>
                  <span>Drive: <strong className="text-slate-200">{drive.driveDate}</strong></span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            No active placement drives currently published. Explore our placement history for details.
          </div>
        )}

        {/* Recruiting Partner Companies */}
        {companiesData?.data && companiesData.data.length > 0 && (
          <div className="mt-10 p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-4">
              Recruiting Partners
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {companiesData.data.map((company) => (
                <div
                  key={company.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-center text-center hover:border-slate-700 transition"
                >
                  <span className="text-xs font-bold text-slate-200">{company.name}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{company.industry}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 6. Upcoming Events Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Campus Engagement
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Upcoming Events &amp; Workshops
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg">
              Seminars, hackathons, and cultural fests bringing together industry leaders, faculty, and scholars.
            </p>
          </div>
          <Link to="/events">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Events
            </Button>
          </Link>
        </div>

        {eventsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-56 w-full" />
            ))}
          </div>
        ) : eventsError ? (
          <ErrorState
            title="Unable to load events"
            message="Failed to retrieve upcoming campus events."
            onRetry={refetchEvents}
          />
        ) : eventsData?.data && eventsData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventsData.data.map((event) => (
              <Card key={event.id} variant="interactive" className="flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="purple" size="sm">
                      {event.category}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {event.eventDate}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-6 pt-0">
                  <Link to={`/events/${event.id}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      View Event
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            No public events currently scheduled. Check back soon.
          </div>
        )}
      </section>

      {/* 7. Institutional Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-950/80 to-slate-900 border border-blue-500/30 text-center shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Begin Your Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Shape Your Future at Srusti?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Connect with our admissions office to discuss eligibility, entrance pathways, and curriculum structures for the upcoming session.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/admissions">
                <Button size="lg" variant="gold">
                  Submit Admission Inquiry
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Contact Admissions Desk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
