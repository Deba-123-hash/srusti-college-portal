// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Placements & Corporate Relations Page (Phase 7)
// =============================================================================

import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  GraduationCap,
  Sparkles,
  MapPin,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { usePlacementDrives, useCompanies } from "../../hooks/usePlacements";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";

export const PlacementsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const isStudent = isAuthenticated && user?.role === "STUDENT";

  const {
    data: drivesData,
    isLoading: drivesLoading,
    isError: drivesError,
    refetch: refetchDrives,
  } = usePlacementDrives({ activeOnly: false });

  const {
    data: companiesData,
    isLoading: companiesLoading,
  } = useCompanies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16 pb-20">
      {/* 1. Page Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
          <span>Industry Engagement &amp; Careers</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Training &amp; Placements Cell
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Bridging university talent with corporate demand through structured technical coaching, soft-skills workshops, and on-campus recruitment drives.
        </p>
      </div>

      {/* 2. Placement Training Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="text-base font-bold text-white">Technical Aptitude &amp; Coding</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Targeted training in core data structures, web technologies, database management, and problem-solving benchmarks.
          </p>
        </Card>

        <Card variant="glass" className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="text-base font-bold text-white">Corporate Communication &amp; GD</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rigorous group discussions, mock behavioral interviews, executive presentation coaching, and resume writing seminars.
          </p>
        </Card>

        <Card variant="glass" className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="text-base font-bold text-white">Campus Recruitment Drives</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Coordinated recruitment schedules allowing qualifying scholars to interview with visiting enterprise software and consulting firms.
          </p>
        </Card>
      </section>

      {/* 3. Placement Drives Listing */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Campus Drives
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Recruitment Drives
            </h2>
          </div>
        </div>

        {drivesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-56 w-full" />
            ))}
          </div>
        ) : drivesError ? (
          <ErrorState
            title="Failed to Load Placement Drives"
            message="Could not retrieve placement drive listings from the server."
            onRetry={refetchDrives}
          />
        ) : drivesData?.data && drivesData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drivesData.data.map((drive) => (
              <Card key={drive.id} variant="glass" className="p-6 sm:p-8 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant={drive.isActive ? "emerald" : "slate"} size="sm">
                      {drive.isActive ? "Active Drive" : "Completed / Closed"}
                    </Badge>
                    <h3 className="text-lg font-bold text-white mt-2">
                      {drive.jobRole}
                    </h3>
                    <p className="text-xs font-semibold text-blue-400">
                      {drive.company?.name || "Corporate Partner"}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Compensation
                    </span>
                    <span className="text-sm font-black text-amber-400">
                      {drive.ctcPackage}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {drive.description}
                </p>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Eligible</span>
                    <strong className="text-white text-xs">{drive.eligibleCourses}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Min CGPA</span>
                    <strong className="text-white text-xs">{drive.minCgpa}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Deadline</span>
                    <strong className="text-rose-400 text-xs">{drive.deadline}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Drive Date: <strong className="text-slate-200">{drive.driveDate}</strong>
                  </span>

                  {isStudent ? (
                    <Link to="/student/placements">
                      <Button variant="primary" size="sm">
                        Apply in Portal
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Student Portal Login Required to Apply
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            No active placement drives currently published. Registered students will receive notices when drives open.
          </div>
        )}
      </section>

      {/* 4. Partner Recruiters */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Corporate Alliances
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Recruiting Companies
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprises and consultancy firms engaging with Srusti Academy scholars.
          </p>
        </div>

        {companiesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        ) : companiesData?.data && companiesData.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companiesData.data.map((company) => (
              <Card key={company.id} variant="glass" className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <Badge variant="slate" size="sm">
                    {company.industry}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{company.name}</h4>
                  {company.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {company.description}
                    </p>
                  )}
                </div>

                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition pt-2"
                  >
                    <span>Visit Company Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            Partner listings are maintained dynamically as campus drives conclude.
          </div>
        )}
      </section>
    </div>
  );
};

export default PlacementsPage;
