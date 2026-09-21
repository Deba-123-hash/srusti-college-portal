// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Attendance Batch Entry & Logging Console
// =============================================================================

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Save, FileCheck2, Calendar, Users, AlertCircle } from "lucide-react";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import {
  useAdminCourses,
  useAdminStudents,
  useAdminSubjects,
  useBatchCreateAttendance,
} from "../../hooks/useAdmin";

export const AdminAttendance: React.FC = () => {
  const todayStr = new Date().toISOString().split("T")[0];

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(todayStr);

  // Student Attendance Roster State
  const [studentStatusMap, setStudentStatusMap] = useState<
    Record<string, { status: "PRESENT" | "ABSENT" | "LATE"; remarks: string }>
  >({});

  const { data: coursesData } = useAdminCourses();
  const { data: subjectsData } = useAdminSubjects({
    courseId: selectedCourseId || undefined,
    semester: selectedSemester || undefined,
  });

  const { data: studentsData, isLoading: isLoadingStudents } = useAdminStudents({
    courseId: selectedCourseId || undefined,
    semester: selectedSemester || undefined,
    limit: 100,
  });

  const batchMutation = useBatchCreateAttendance();

  const courses = coursesData?.data || [];
  const subjects = subjectsData || [];
  const students = studentsData?.data || [];

  // Initialize student statuses to PRESENT whenever student list changes
  useEffect(() => {
    if (students.length > 0) {
      const initialMap: Record<string, { status: "PRESENT" | "ABSENT" | "LATE"; remarks: string }> = {};
      students.forEach((st) => {
        initialMap[st.id] = { status: "PRESENT", remarks: "" };
      });
      setStudentStatusMap(initialMap);
    } else {
      setStudentStatusMap({});
    }
  }, [students]);

  const handleStatusChange = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE") => {
    setStudentStatusMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setStudentStatusMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const markAll = (status: "PRESENT" | "ABSENT") => {
    setStudentStatusMap((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id] = { ...updated[id], status };
      });
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || students.length === 0) return;

    const records = Object.entries(studentStatusMap).map(([studentId, item]) => ({
      studentId,
      subjectId: selectedSubjectId,
      date: attendanceDate,
      status: item.status,
      remarks: item.remarks || null,
    }));

    batchMutation.mutate({ records });
  };

  // Metrics
  const totalCount = Object.keys(studentStatusMap).length;
  const presentCount = Object.values(studentStatusMap).filter((s) => s.status === "PRESENT").length;
  const absentCount = Object.values(studentStatusMap).filter((s) => s.status === "ABSENT").length;
  const lateCount = Object.values(studentStatusMap).filter((s) => s.status === "LATE").length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Batch Attendance Console</h1>
        <p className="text-xs text-slate-400 mt-1">
          Select course cohort and academic subject to take and synchronize digital daily class attendance.
        </p>
      </div>

      {/* Cohort Selector Card */}
      <Card variant="glass" className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Academic Programme"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedSubjectId("");
            }}
            options={[
              { value: "", label: "Select course..." },
              ...courses.map((c) => ({ value: c.id, label: `${c.name} (${c.code})` })),
            ]}
          />

          <Select
            label="Semester"
            value={String(selectedSemester)}
            onChange={(e) => {
              setSelectedSemester(Number(e.target.value));
              setSelectedSubjectId("");
            }}
            options={[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
              value: String(s),
              label: `Semester ${s}`,
            }))}
          />

          <Select
            label="Curriculum Subject"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            options={[
              { value: "", label: "Select subject..." },
              ...subjects.map((sub) => ({ value: sub.id, label: `${sub.name} (${sub.code})` })),
            ]}
          />

          <Input
            label="Lecture Date"
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>
      </Card>

      {/* Roster & Attendance Controls */}
      {!selectedCourseId || !selectedSubjectId ? (
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          title="Select Course &amp; Subject"
          description="Please choose an academic programme and curriculum subject above to generate the student attendance roster."
        />
      ) : isLoadingStudents ? (
        <Card variant="glass" className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      ) : students.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No students enrolled"
          description="No students were found for this selected course and semester combination."
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Metrics & Batch Toggle Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-4 flex-wrap text-xs">
              <span className="text-slate-300 font-semibold">Cohort Roster: {totalCount} Students</span>
              <div className="flex items-center gap-2">
                <Badge variant="emerald" size="sm">
                  Present: {presentCount}
                </Badge>
                <Badge variant="rose" size="sm">
                  Absent: {absentCount}
                </Badge>
                {lateCount > 0 && (
                  <Badge variant="amber" size="sm">
                    Late: {lateCount}
                  </Badge>
                )}
              </div>
              <span className="text-slate-400 font-mono">Rate: {attendanceRate}%</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => markAll("PRESENT")}
                className="text-xs"
              >
                All Present
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => markAll("ABSENT")}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                All Absent
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={batchMutation.isPending}
                className="flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
              >
                <Save className="w-4 h-4" />
                Submit Attendance
              </Button>
            </div>
          </div>

          {/* Student Attendance Table */}
          <Card variant="glass" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Registration No</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {students.map((st, index) => {
                    const currentStatus = studentStatusMap[st.id]?.status || "PRESENT";
                    return (
                      <tr key={st.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-500">{index + 1}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{st.user.name}</p>
                          <p className="text-[11px] text-slate-400">{st.user.email}</p>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-300">{st.regNo}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, "PRESENT")}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                currentStatus === "PRESENT"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                                  : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              P
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, "ABSENT")}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                currentStatus === "ABSENT"
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm"
                                  : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent"
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              A
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, "LATE")}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                currentStatus === "LATE"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm"
                                  : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent"
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              L
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="Optional note..."
                            value={studentStatusMap[st.id]?.remarks || ""}
                            onChange={(e) => handleRemarkChange(st.id, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};

export default AdminAttendance;
