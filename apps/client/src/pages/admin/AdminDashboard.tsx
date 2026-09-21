// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Dashboard Overview Page
// =============================================================================

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Briefcase,
  Mail,
  ArrowRight,
  PlusCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import { useAdminDashboard } from "../../hooks/useAdmin";
import { useAuthStore } from "../../store/authStore";

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-6 h-6" />}
        title="Dashboard metrics unavailable"
        description="Could not load administrative indicators. Please verify database connectivity."
      />
    );
  }

  const { stats, recentAnnouncements, upcomingEvents, recentAuditLogs } = data;

  const statCards = [
    {
      title: "Enrolled Students",
      value: stats.studentCount,
      icon: GraduationCap,
      color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
      link: "/admin/students",
    },
    {
      title: "Faculty Members",
      value: stats.facultyCount,
      icon: Users,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
      link: "/admin/faculty",
    },
    {
      title: "Active Courses",
      value: stats.courseCount,
      icon: BookOpen,
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
      link: "/admin/courses",
    },
    {
      title: "Campus Drives",
      value: stats.placementDriveCount,
      icon: Briefcase,
      color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
      link: "/admin/placements",
    },
    {
      title: "Active Events",
      value: stats.eventCount,
      icon: Calendar,
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
      link: "/admin/events",
    },
    {
      title: "Pending Inquiries",
      value: stats.pendingInquiryCount,
      icon: Mail,
      color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
      link: "/admin/inquiries",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Administrative Portal</h1>
            <Badge variant="gold" size="sm">
              {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Department Admin"}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Institutional overview, academic rosters, recruitment drives, and governance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/admin/attendance"
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-500/20"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            Mark Attendance
          </Link>
          <Link
            to="/admin/students"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Student
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={c.link} className="block group">
                <Card
                  variant="glass"
                  className="hover:border-slate-700 transition-all duration-300 relative overflow-hidden"
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{c.title}</p>
                      <h3 className="text-3xl font-black text-white mt-1 font-mono tracking-tight group-hover:text-blue-400 transition-colors">
                        {c.value}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 group-hover:text-slate-300 transition-colors">
                        Manage roster <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </p>
                    </div>
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${c.color} border shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Layout: Upcoming Events & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notices */}
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Latest Announcements
              </h3>
              <p className="text-xs text-slate-400">Institutional circulars and bulletins</p>
            </div>
            <Link
              to="/admin/announcements"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {recentAnnouncements.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No announcements published yet.</p>
            ) : (
              recentAnnouncements.map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-white line-clamp-1">{a.title}</h4>
                      {a.isPinned && (
                        <Badge variant="gold" size="sm">
                          PINNED
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <span className="capitalize">{a.category}</span>
                      <span>&bull;</span>
                      <span>{new Date(a.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Campus Events */}
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Scheduled Campus Events
              </h3>
              <p className="text-xs text-slate-400">Upcoming symposiums and cultural programs</p>
            </div>
            <Link
              to="/admin/events"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No upcoming events scheduled.</p>
            ) : (
              upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-white">{ev.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>Venue: {ev.venue}</span>
                      <span>&bull;</span>
                      <span>Cap: {ev.capacity}</span>
                    </p>
                  </div>
                  <Badge variant="blue" size="sm" className="font-mono text-[10px]">
                    {new Date(ev.eventDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Trail (For Super Admin) */}
      {recentAuditLogs && recentAuditLogs.length > 0 && (
        <Card variant="glass">
          <CardHeader className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Recent System Activity &amp; Audit Logs
            </h3>
            <p className="text-xs text-slate-400">Security-logged state mutations and operator activities</p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="divide-y divide-slate-800/60">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Badge variant="slate" size="sm" className="font-mono uppercase">
                      {log.action}
                    </Badge>
                    <span className="text-slate-200 font-medium">{log.entity}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
