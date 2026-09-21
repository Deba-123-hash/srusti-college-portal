// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Notifications Center (/student/notifications)
// =============================================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useStudentNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "../../hooks/useStudentNotifications";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import { Bell, CheckCheck, ExternalLink, Clock, Sparkles } from "lucide-react";

export const StudentNotifications: React.FC = () => {
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data, isLoading, isError, refetch } = useStudentNotifications({
    unreadOnly,
  });

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-slate-800" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Failed to Load Notifications"
        message="Unable to retrieve notification dispatches from the campus server."
        onRetry={() => refetch()}
      />
    );
  }

  const notifications = data.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-blue-400" />
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official academic circulars, exam alerts, and administrative dispatches.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            disabled={markAllReadMutation.isPending}
            onClick={() => markAllReadMutation.mutate()}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setUnreadOnly(false)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            !unreadOnly
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setUnreadOnly(true)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            unreadOnly
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <EmptyState
          title="No Notifications Found"
          description={
            unreadOnly
              ? "You have caught up with all your notifications!"
              : "You have no active notification records in the system."
          }
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              variant="glass"
              className={`p-4 border transition-all ${
                notif.isRead
                  ? "border-slate-800/60 bg-slate-900/40 opacity-80"
                  : "border-blue-500/30 bg-slate-900/80 shadow-md shadow-blue-950/20"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      notif.isRead ? "bg-slate-700" : "bg-blue-500 animate-pulse"
                    }`}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {notif.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>

                      {notif.link && (
                        <Link
                          to={notif.link}
                          className="text-blue-400 hover:underline flex items-center gap-1 font-sans"
                        >
                          <span>Open Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {!notif.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[11px] text-slate-400 hover:text-white shrink-0"
                    disabled={markReadMutation.isPending}
                    onClick={() => markReadMutation.mutate(notif.id)}
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;
