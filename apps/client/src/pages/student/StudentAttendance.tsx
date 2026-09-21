// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Attendance Dashboard (/student/attendance)
// =============================================================================

import React, { useState } from "react";
import {
  useStudentAttendanceSummary,
  useStudentAttendanceRecords,
} from "../../hooks/useStudentAttendance";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import Select from "../../components/ui/Select";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  ListOrdered,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

export const StudentAttendance: React.FC = () => {
  const [semesterFilter, setSemesterFilter] = useState<number | undefined>(undefined);
  const { data: summary, isLoading: isSummaryLoading, isError: isSummaryError, refetch: refetchSummary } =
    useStudentAttendanceSummary();
  const { data: recordsData, isLoading: isRecordsLoading, isError: isRecordsError, refetch: refetchRecords } =
    useStudentAttendanceRecords({ semester: semesterFilter });

  if (isSummaryLoading || isRecordsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl bg-slate-800" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl bg-slate-800" />
        <Skeleton className="h-96 rounded-2xl bg-slate-800" />
      </div>
    );
  }

  if (isSummaryError || isRecordsError || !summary) {
    return (
      <ErrorState
        title="Unable to Load Attendance Records"
        message="An error occurred while fetching your attendance dataset from the academic registry."
        onRetry={() => {
          refetchSummary();
          refetchRecords();
        }}
      />
    );
  }

  const records = recordsData?.data || [];
  const chartData = summary.subjectWise.map((sub) => ({
    name: sub.subjectCode,
    fullName: sub.subjectName,
    percentage: sub.percentage,
    present: sub.present,
    total: sub.totalClasses,
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Attendance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor your lecture attendance compliance across enrolled academic subjects.
        </p>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Percentage Card */}
        <Card variant="glass" className="p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Overall Attendance</span>
            <CalendarCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${
                summary.attendancePercentage >= 75 ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {summary.attendancePercentage}%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {summary.attendancePercentage >= 75 ? "Eligible for Exams" : "Warning: Below 75% Threshold"}
          </div>
        </Card>

        {/* Classes Held */}
        <Card variant="glass" className="p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Classes Conducted</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{summary.totalClasses}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all registered subjects</div>
        </Card>

        {/* Present Count */}
        <Card variant="glass" className="p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Lectures Attended</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-400">{summary.present}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Present or documented late entries</div>
        </Card>

        {/* Absent Count */}
        <Card variant="glass" className="p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Lectures Missed</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-rose-400">{summary.absent}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Unexcused missed sessions</div>
        </Card>
      </div>

      {/* Visual Analytics Chart */}
      {chartData.length > 0 && (
        <Card variant="glass" className="border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800/80">
            <div>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Subject-wise Attendance Distribution
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparison of your attendance percentage per subject against the 75% compliance threshold.
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#334155" }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={{ stroke: "#334155" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "#f8fafc",
                    }}
                    formatter={(val: any, _name: any, item: any) => [
                      `${val}% (${item.payload.present}/${item.payload.total} classes)`,
                      item.payload.fullName,
                    ]}
                  />
                  <ReferenceLine
                    y={75}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{
                      value: "75% Minimum",
                      position: "insideTopRight",
                      fill: "#f59e0b",
                      fontSize: 10,
                    }}
                  />
                  <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.percentage >= 75 ? "#3b82f6" : "#f59e0b"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject-Wise Summary Table */}
      <Card variant="glass" className="border-slate-800">
        <CardHeader className="pb-4 border-b border-slate-800/80">
          <CardTitle className="text-base text-white font-bold flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-emerald-400" />
            Subject Attendance Ledger
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {summary.subjectWise.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No Attendance Data Available"
                description="No lecture attendance records have been registered for your student account."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Subject Code</th>
                    <th className="py-3 px-4">Subject Title</th>
                    <th className="py-3 px-4 text-center">Conducted</th>
                    <th className="py-3 px-4 text-center">Attended</th>
                    <th className="py-3 px-4 text-center">Missed</th>
                    <th className="py-3 px-4 text-center">Attendance %</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {summary.subjectWise.map((sub) => (
                    <tr key={sub.subjectId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-blue-400">
                        {sub.subjectCode}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">{sub.subjectName}</td>
                      <td className="py-3 px-4 text-center font-mono">{sub.totalClasses}</td>
                      <td className="py-3 px-4 text-center font-mono text-emerald-400">
                        {sub.present}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-rose-400">{sub.absent}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        <span
                          className={sub.percentage >= 75 ? "text-emerald-400" : "text-amber-400"}
                        >
                          {sub.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge
                          variant={sub.percentage >= 75 ? "emerald" : "amber"}
                          size="sm"
                        >
                          {sub.percentage >= 75 ? "Compliant" : "Low Attendance"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Session Date Log */}
      <Card variant="glass" className="border-slate-800">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <CardTitle className="text-sm font-bold text-white">Daily Lecture Log</CardTitle>
            <p className="text-xs text-slate-400">Session-by-session records marked by faculty</p>
          </div>
          <div className="w-48">
            <Select
              options={[
                { value: "", label: "All Semesters" },
                { value: "1", label: "Semester 1" },
                { value: "2", label: "Semester 2" },
                { value: "3", label: "Semester 3" },
              ]}
              value={semesterFilter ? String(semesterFilter) : ""}
              onChange={(e) =>
                setSemesterFilter(e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {records.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No Log Entries Found"
                description="No individual attendance sessions match the selected filter criteria."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Semester</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-300">{rec.date}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{rec.subject.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {rec.subject.code}
                        </div>
                      </td>
                      <td className="py-3 px-4">Sem {rec.subject.semester}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant={
                            rec.status === "PRESENT"
                              ? "emerald"
                              : rec.status === "LATE"
                              ? "amber"
                              : "rose"
                          }
                          size="sm"
                          className="font-mono"
                        >
                          {rec.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 font-normal">
                        {rec.remarks || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendance;
