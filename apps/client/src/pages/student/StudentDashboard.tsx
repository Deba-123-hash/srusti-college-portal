// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Authenticated Student Dashboard (/student/dashboard)
// =============================================================================

import React from "react";
import { Link } from "react-router-dom";
import { useStudentDashboard } from "../../hooks/useStudentDashboard";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import {
  GraduationCap,
  CalendarCheck,
  Briefcase,
  Calendar,
  Bell,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
} from "lucide-react";

export const StudentDashboard: React.FC = () => {
  const { data, isLoading, isError, refetch } = useStudentDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64 bg-slate-800" />
          <Skeleton className="h-4 w-96 bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl bg-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2 rounded-2xl bg-slate-800" />
          <Skeleton className="h-80 rounded-2xl bg-slate-800" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Failed to Load Student Dashboard"
        message="Unable to retrieve your academic records. Please ensure you are logged in with an authorized student account."
        onRetry={() => refetch()}
      />
    );
  }

  const {
    student,
    attendanceSummary,
    latestResults,
    upcomingEvents,
    placementApplications,
    unreadNotificationCount,
  } = data;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* 1. Student Identity & Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <span>{student.courseName}</span>
            <span>&bull;</span>
            <span>Semester {student.currentSemester}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {getGreeting()}, {student.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Reg. No: <span className="font-mono text-slate-300 font-semibold">{student.regNo}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="blue" size="md" className="px-3 py-1 font-mono">
            CGPA: {student.cgpa.toFixed(2)}
          </Badge>
          <Link to="/student/notifications">
            <Button variant="outline" size="sm" className="relative gap-2">
              <Bell className="w-4 h-4" />
              <span>Notices</span>
              {unreadNotificationCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Academic Indicators (KPI Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance KPI */}
        <Card variant="glass" className="p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{attendanceSummary.percentage}%</span>
            <span className="text-xs text-slate-400">
              ({attendanceSummary.present}/{attendanceSummary.totalClasses} classes)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                attendanceSummary.percentage >= 75 ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${Math.min(attendanceSummary.percentage, 100)}%` }}
            />
          </div>
        </Card>

        {/* CGPA KPI */}
        <Card variant="glass" className="p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Cumulative GPA</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{student.cgpa.toFixed(2)}</span>
            <span className="text-xs text-slate-400">/ 10.0</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>Good Academic Standing</span>
          </div>
        </Card>

        {/* Placement Applications KPI */}
        <Card variant="glass" className="p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Placements</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{placementApplications.length}</span>
            <span className="text-xs text-slate-400">Applications</span>
          </div>
          <div className="text-[11px] text-indigo-400 font-medium mt-2">
            <Link to="/student/placements" className="hover:underline flex items-center gap-1">
              <span>View Active Drives</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>

        {/* Registered Events KPI */}
        <Card variant="glass" className="p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Campus Events</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{upcomingEvents.length}</span>
            <span className="text-xs text-slate-400">Upcoming</span>
          </div>
          <div className="text-[11px] text-purple-400 font-medium mt-2">
            <Link to="/student/events" className="hover:underline flex items-center gap-1">
              <span>Explore Schedule</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. Main Dashboard Sections (2:1 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Examination Results */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass" className="border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <CardTitle className="text-base text-white font-bold flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  Recent Semester Results
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest published grades and academic evaluation
                </p>
              </div>
              <Link to="/student/results">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {latestResults.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    title="No Results Published Yet"
                    description="Your end-semester results will appear here once officially published by the examination cell."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Semester</th>
                        <th className="py-3 px-4">Marks</th>
                        <th className="py-3 px-4">Grade</th>
                        <th className="py-3 px-4 text-right">Credits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {latestResults.map((res) => (
                        <tr key={res.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{res.subject.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {res.subject.code}
                            </div>
                          </td>
                          <td className="py-3 px-4">Sem {res.semester}</td>
                          <td className="py-3 px-4 font-mono font-medium">
                            {res.totalMarks}{" "}
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({res.internalMarks}+{res.externalMarks})
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                res.grade === "O"
                                  ? "gold"
                                  : res.grade === "E" || res.grade === "A"
                                  ? "blue"
                                  : "slate"
                              }
                              size="sm"
                              className="font-mono font-bold"
                            >
                              {res.grade}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-400">
                            {res.credits}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Placement Drives Section */}
          <Card variant="glass" className="border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <CardTitle className="text-base text-white font-bold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  Active Placement Drives &amp; Applications
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track campus recruitment opportunities
                </p>
              </div>
              <Link to="/student/placements">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <span>Explore Drives</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4">
              {placementApplications.length === 0 ? (
                <EmptyState
                  title="No Applications Submitted"
                  description="You have not applied for any placement drives yet. Review available recruitment drives to apply."
                />
              ) : (
                <div className="space-y-3">
                  {placementApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
                          {app.drive.company.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            {app.drive.company.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {app.drive.jobRole} &bull; {app.drive.ctcPackage}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            app.status === "SELECTED"
                              ? "emerald"
                              : app.status === "REJECTED"
                              ? "rose"
                              : "blue"
                          }
                          size="sm"
                          className="font-mono"
                        >
                          {app.status}
                        </Badge>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Attendance Breakdown & Upcoming Events */}
        <div className="space-y-6">
          {/* Attendance Action Card */}
          <Card variant="glass" className="border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800/80">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                Attendance Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Minimum Required:</span>
                <span className="font-semibold text-white">75.0%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Your Attendance:</span>
                <span
                  className={`font-black text-sm ${
                    attendanceSummary.percentage >= 75 ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {attendanceSummary.percentage}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                {attendanceSummary.percentage >= 75
                  ? "You satisfy the institutional 75% attendance threshold for semester examination eligibility."
                  : "Caution: Your attendance is below the 75% threshold. Please attend all upcoming lectures to regularize attendance."}
              </div>

              <Link to="/student/attendance" className="block pt-1">
                <Button variant="outline" size="sm" className="w-full text-xs gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Subject-wise Breakdown</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Events Card */}
          <Card variant="glass" className="border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/80">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Upcoming Events
              </CardTitle>
              <Link to="/student/events" className="text-xs text-blue-400 hover:underline">
                All
              </Link>
            </CardHeader>
            <CardContent className="p-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No scheduled events.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs"
                    >
                      <div className="font-bold text-white">{evt.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{evt.eventDate}</span>
                        <Badge variant="blue" size="sm">
                          {evt.category}
                        </Badge>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 truncate">{evt.venue}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
