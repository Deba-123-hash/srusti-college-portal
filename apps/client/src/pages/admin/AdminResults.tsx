// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Results & Grading Management Console
// =============================================================================

import React, { useState } from "react";
import { Award, Plus, CheckCircle, Search, FileSpreadsheet, Send, Edit3, Trash2 } from "lucide-react";
import Card, { CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import {
  useAdminCourses,
  useAdminSubjects,
  useAdminStudents,
  useAdminResults,
  useCreateResult,
  usePublishResults,
} from "../../hooks/useAdmin";

export const AdminResults: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [studentId, setStudentId] = useState("");
  const [internalMarks, setInternalMarks] = useState<number>(25);
  const [externalMarks, setExternalMarks] = useState<number>(65);
  const [credits, setCredits] = useState<number>(3);

  const { data: coursesData } = useAdminCourses();
  const { data: subjectsData } = useAdminSubjects({
    courseId: selectedCourseId || undefined,
    semester: selectedSemester || undefined,
  });
  const { data: studentsData } = useAdminStudents({
    courseId: selectedCourseId || undefined,
    semester: selectedSemester || undefined,
    limit: 100,
  });

  const { data: resultsData, isLoading: isLoadingResults } = useAdminResults({
    subjectId: selectedSubjectId || undefined,
    semester: selectedSemester || undefined,
  });

  const createMutation = useCreateResult();
  const publishMutation = usePublishResults();

  const courses = coursesData?.data || [];
  const subjects = subjectsData || [];
  const students = studentsData?.data || [];
  const results = resultsData?.data || [];

  // Helper to calculate grade
  const calculateGrade = (total: number): string => {
    if (total >= 90) return "O";
    if (total >= 80) return "E";
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 40) return "D";
    return "F";
  };

  const handleCreateResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !selectedSubjectId) return;

    const total = Number(internalMarks) + Number(externalMarks);
    const grade = calculateGrade(total);

    createMutation.mutate(
      {
        studentId,
        subjectId: selectedSubjectId,
        semester: selectedSemester,
        internalMarks: Number(internalMarks),
        externalMarks: Number(externalMarks),
        totalMarks: total,
        grade,
        credits: Number(credits),
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setStudentId("");
        },
      }
    );
  };

  const handlePublishCohort = () => {
    if (!selectedCourseId) return;
    publishMutation.mutate({
      courseId: selectedCourseId,
      semester: selectedSemester,
      subjectId: selectedSubjectId || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Examinations &amp; Results</h1>
          <p className="text-xs text-slate-400 mt-1">
            Input internal assessment scores, university external marks, grade sheets, and release publications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePublishCohort}
            disabled={!selectedCourseId || results.length === 0}
            isLoading={publishMutation.isPending}
            className="text-emerald-400 hover:text-emerald-300 border border-emerald-500/30"
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            Publish Results Cohort
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedSubjectId}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Enter Student Marks
          </Button>
        </div>
      </div>

      {/* Cohort Selector Card */}
      <Card variant="glass" className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Academic Programme"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedSubjectId("");
            }}
            options={[
              { value: "", label: "Select programme..." },
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
            label="Subject"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            options={[
              { value: "", label: "All / Select subject..." },
              ...subjects.map((sub) => ({ value: sub.id, label: `${sub.name} (${sub.code})` })),
            ]}
          />
        </div>
      </Card>

      {/* Results List */}
      {!selectedCourseId ? (
        <EmptyState
          icon={<Award className="w-6 h-6" />}
          title="Select Programme"
          description="Please choose an academic programme and semester to inspect or manage student mark sheets."
        />
      ) : isLoadingResults ? (
        <Card variant="glass" className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      ) : results.length === 0 ? (
        <EmptyState
          icon={<FileSpreadsheet className="w-6 h-6" />}
          title="No results recorded"
          description="No examination marks have been logged for this cohort or subject yet. Use the 'Enter Student Marks' action above."
        />
      ) : (
        <Card variant="glass" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Registration No</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 text-center">Internal</th>
                  <th className="py-3 px-4 text-center">External</th>
                  <th className="py-3 px-4 text-center">Total</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-white">{r.student?.user?.name || "Student"}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-300">
                      {r.student?.regNo || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white font-medium">{r.subject?.name}</p>
                      <span className="font-mono text-[10px] text-slate-400">{r.subject?.code}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{r.internalMarks}</td>
                    <td className="py-3 px-4 text-center font-mono">{r.externalMarks}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">
                      {r.totalMarks}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          r.grade === "O"
                            ? "gold"
                            : r.grade === "E" || r.grade === "A"
                            ? "blue"
                            : r.grade === "F"
                            ? "rose"
                            : "slate"
                        }
                        size="sm"
                        className="font-mono font-bold"
                      >
                        {r.grade}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {r.isPublished ? (
                        <Badge variant="emerald" size="sm">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="amber" size="sm">
                          Draft
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Enter Marks Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enter Semester Examination Marks"
        size="md"
      >
        <form onSubmit={handleCreateResult} className="space-y-4">
          <Select
            label="Enrolled Student"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            options={[
              { value: "", label: "Select enrolled student..." },
              ...students.map((st) => ({
                value: st.id,
                label: `${st.user.name} (${st.regNo})`,
              })),
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Internal Assessment (Max 30)"
              type="number"
              min={0}
              max={100}
              value={internalMarks}
              onChange={(e) => setInternalMarks(Number(e.target.value))}
              required
            />
            <Input
              label="External University Exam (Max 70)"
              type="number"
              min={0}
              max={100}
              value={externalMarks}
              onChange={(e) => setExternalMarks(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Subject Credits"
              type="number"
              min={1}
              max={8}
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Calculated Grade
              </label>
              <div className="h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between px-3">
                <span className="text-xs text-slate-400">
                  Total: {Number(internalMarks) + Number(externalMarks)}
                </span>
                <Badge variant="gold" size="sm" className="font-mono font-bold">
                  {calculateGrade(Number(internalMarks) + Number(externalMarks))}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={createMutation.isPending}>
              Save Result
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminResults;
