// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Placements Dashboard (/student/placements)
// =============================================================================

import React, { useState } from "react";
import {
  useAvailableDrives,
  useStudentApplications,
  useApplyToDrive,
} from "../../hooks/useStudentPlacements";
import { useStudentProfile } from "../../hooks/useStudentDashboard";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  Send,
  FileCheck,
} from "lucide-react";

export const StudentPlacements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"DRIVES" | "APPLICATIONS">("DRIVES");
  const [selectedDriveId, setSelectedDriveId] = useState<string | null>(null);

  const { data: drives, isLoading: isDrivesLoading, isError: isDrivesError, refetch: refetchDrives } =
    useAvailableDrives();
  const { data: applications, isLoading: isAppsLoading, isError: isAppsError, refetch: refetchApps } =
    useStudentApplications();
  const { data: profile } = useStudentProfile();
  const applyMutation = useApplyToDrive();

  if (isDrivesLoading || isAppsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (isDrivesError || isAppsError) {
    return (
      <ErrorState
        title="Failed to Load Placement Records"
        message="Unable to communicate with the campus recruitment server."
        onRetry={() => {
          refetchDrives();
          refetchApps();
        }}
      />
    );
  }

  const driveList = drives || [];
  const appList = applications || [];
  const appliedDriveIds = new Set(appList.map((a) => a.driveId));
  const studentCgpa = profile?.cgpa ?? 0;

  const handleApplyConfirm = () => {
    if (selectedDriveId) {
      applyMutation.mutate(selectedDriveId, {
        onSettled: () => setSelectedDriveId(null),
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Training &amp; Placement Cell
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore corporate recruitment opportunities and track your campus interview milestones.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("DRIVES")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "DRIVES"
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Active Placement Drives</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px]">
            {driveList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("APPLICATIONS")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "APPLICATIONS"
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>My Applications</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px]">
            {appList.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Active Placement Drives */}
      {activeTab === "DRIVES" && (
        <div>
          {driveList.length === 0 ? (
            <EmptyState
              title="No Active Placement Drives"
              description="There are currently no active campus recruitment drives open for registration."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {driveList.map((drive) => {
                const isAlreadyApplied = appliedDriveIds.has(drive.id);
                const isEligible = studentCgpa >= (drive.minCgpa || 0);

                return (
                  <Card
                    key={drive.id}
                    variant="glass"
                    className="border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-white text-lg">
                            {drive.company.name.charAt(0)}
                          </div>
                          <div>
                            <CardTitle className="text-base text-white font-bold">
                              {drive.jobRole}
                            </CardTitle>
                            <div className="text-xs text-blue-400 font-semibold flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>{drive.company.name}</span>
                            </div>
                          </div>
                        </div>

                        <Badge variant="gold" size="md" className="font-mono font-bold">
                          {drive.ctcPackage}
                        </Badge>
                      </CardHeader>

                      {/* Card Body */}
                      <CardContent className="p-5 space-y-4">
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {drive.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3 text-[11px] pt-1 border-t border-slate-800/60">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>Drive: {drive.driveDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>Deadline: {drive.deadline}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{drive.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Award className="w-3.5 h-3.5 text-slate-500" />
                            <span>Min CGPA: {drive.minCgpa}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-400 text-[11px]">Eligible Courses:</span>
                          <span className="text-white font-medium text-[11px]">
                            {drive.eligibleCourses}
                          </span>
                        </div>
                      </CardContent>
                    </div>

                    {/* Footer Action */}
                    <div className="p-5 pt-0">
                      {isAlreadyApplied ? (
                        <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Application Submitted</span>
                        </div>
                      ) : (
                        <Button
                          variant={isEligible ? "primary" : "secondary"}
                          size="sm"
                          className="w-full gap-2 text-xs font-bold"
                          disabled={!isEligible || applyMutation.isPending}
                          onClick={() => setSelectedDriveId(drive.id)}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isEligible ? "Apply for this Drive" : "Below Minimum CGPA"}</span>
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Applications */}
      {activeTab === "APPLICATIONS" && (
        <Card variant="glass" className="border-slate-800">
          <CardHeader className="pb-4 border-b border-slate-800/80">
            <CardTitle className="text-base text-white font-bold">
              Submitted Placement Applications
            </CardTitle>
            <p className="text-xs text-slate-400">
              Track the interview pipeline and selection milestones for your campus candidatures.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {appList.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No Applications Found"
                  description="You have not applied for any placement drives yet."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Job Role</th>
                      <th className="py-3 px-4">CTC Package</th>
                      <th className="py-3 px-4">Drive Date</th>
                      <th className="py-3 px-4">Applied At</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {appList.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{app.drive.company.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {app.drive.company.industry}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-200">{app.drive.jobRole}</td>
                        <td className="py-3 px-4 font-mono text-amber-400 font-semibold">
                          {app.drive.ctcPackage}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">{app.drive.driveDate}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              app.status === "SELECTED"
                                ? "emerald"
                                : app.status === "REJECTED"
                                ? "rose"
                                : app.status === "INTERVIEW" || app.status === "SHORTLISTED"
                                ? "gold"
                                : "blue"
                            }
                            size="sm"
                            className="font-mono font-bold"
                          >
                            {app.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-400 font-normal">
                          {app.notes || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog for Drive Application */}
      <ConfirmDialog
        isOpen={!!selectedDriveId}
        title="Confirm Placement Application"
        message="Are you sure you wish to submit your candidature for this recruitment drive? Your academic profile and CGPA will be forwarded to the corporate recruitment cell."
        confirmLabel="Confirm & Submit"
        cancelLabel="Cancel"
        variant="primary"
        isLoading={applyMutation.isPending}
        onConfirm={handleApplyConfirm}
        onClose={() => setSelectedDriveId(null)}
      />
    </div>
  );
};

export default StudentPlacements;
