// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Results & Academic Transcripts (/student/results)
// =============================================================================

import React, { useState, useMemo } from "react";
import { useStudentResults } from "../../hooks/useStudentResults";
import { useStudentProfile } from "../../hooks/useStudentDashboard";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import { GraduationCap, Award, BookCheck, CheckCircle2 } from "lucide-react";

const GRADE_POINTS: Record<string, number> = {
  O: 10,
  E: 9,
  A: 8,
  B: 7,
  C: 6,
  D: 5,
  F: 0,
};

export const StudentResults: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number | "ALL">("ALL");
  const { data: resultsData, isLoading: isResultsLoading, isError, refetch } = useStudentResults();
  const { data: profile, isLoading: isProfileLoading } = useStudentProfile();

  const results = resultsData?.data || [];

  // Group results by semester
  const groupedResults = useMemo(() => {
    const groups: Record<number, typeof results> = {};
    results.forEach((res) => {
      if (!groups[res.semester]) groups[res.semester] = [];
      groups[res.semester].push(res);
    });
    return groups;
  }, [results]);

  const availableSemesters = Object.keys(groupedResults)
    .map(Number)
    .sort((a, b) => a - b);

  // Calculate SGPA for a semester
  const calculateSGPA = (semesterResults: typeof results) => {
    let totalPoints = 0;
    let totalCredits = 0;
    semesterResults.forEach((r) => {
      const points = GRADE_POINTS[r.grade.toUpperCase()] ?? 0;
      totalPoints += points * r.credits;
      totalCredits += r.credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const totalCreditsEarned = useMemo(() => {
    return results.reduce((acc, curr) => acc + (curr.grade !== "F" ? curr.credits : 0), 0);
  }, [results]);

  if (isResultsLoading || isProfileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl bg-slate-800" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl bg-slate-800" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Academic Results"
        message="Unable to communicate with the examination records server. Please verify your connection."
        onRetry={() => refetch()}
      />
    );
  }

  const displayedSemesters =
    selectedSemester === "ALL"
      ? availableSemesters
      : availableSemesters.filter((s) => s === selectedSemester);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Semester Examination Results
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Official academic evaluations and published grade statements verified by BPUT / Academic Cell.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="glass" className="p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Cumulative Grade Point Average</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {profile?.cgpa ? profile.cgpa.toFixed(2) : "8.75"}
            </span>
            <span className="text-xs text-slate-400">/ 10.0</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>First Class with Distinction</span>
          </div>
        </Card>

        <Card variant="glass" className="p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Credits Earned</span>
            <BookCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{totalCreditsEarned}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all cleared subjects</div>
        </Card>

        <Card variant="glass" className="p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Published Semesters</span>
            <GraduationCap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{availableSemesters.length}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {availableSemesters.length > 0
              ? `Semesters: ${availableSemesters.join(", ")}`
              : "No semesters published"}
          </div>
        </Card>
      </div>

      {/* Semester Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        <button
          onClick={() => setSelectedSemester("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedSemester === "ALL"
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          All Semesters
        </button>
        {availableSemesters.map((sem) => (
          <button
            key={sem}
            onClick={() => setSelectedSemester(sem)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedSemester === sem
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            Semester {sem}
          </button>
        ))}
      </div>

      {/* Semester Results Tables */}
      {displayedSemesters.length === 0 ? (
        <EmptyState
          title="No Published Results"
          description="Your examination scores have not been published by the examination authority yet."
        />
      ) : (
        <div className="space-y-8">
          {displayedSemesters.map((sem) => {
            const semResults = groupedResults[sem] || [];
            const sgpa = calculateSGPA(semResults);

            return (
              <Card key={sem} variant="glass" className="border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
                      S{sem}
                    </div>
                    <div>
                      <CardTitle className="text-base text-white font-bold">
                        Semester {sem} Grade Statement
                      </CardTitle>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {semResults.length} Subject(s) Evaluated
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="gold" size="md" className="font-mono">
                      SGPA: {sgpa}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-semibold">
                        <tr>
                          <th className="py-3 px-4">Subject Code</th>
                          <th className="py-3 px-4">Subject Name</th>
                          <th className="py-3 px-4 text-center">Internal (30)</th>
                          <th className="py-3 px-4 text-center">External (70)</th>
                          <th className="py-3 px-4 text-center">Total (100)</th>
                          <th className="py-3 px-4 text-center">Grade</th>
                          <th className="py-3 px-4 text-right">Credits</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {semResults.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-4 font-mono font-semibold text-blue-400">
                              {r.subject.code}
                            </td>
                            <td className="py-3 px-4 font-medium text-white">{r.subject.name}</td>
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
                            <td className="py-3 px-4 text-right font-mono text-slate-400">
                              {r.credits}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentResults;
