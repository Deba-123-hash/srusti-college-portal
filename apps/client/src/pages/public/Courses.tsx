// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Courses Directory Page (Phase 7)
// =============================================================================

import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, BookOpen, Clock, ChevronRight, Filter, IndianRupee } from "lucide-react";
import { useCourses } from "../../hooks/useCourses";
import { useDepartments } from "../../hooks/useDepartments";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card, { CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";

export const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlDept = searchParams.get("dept") || "";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [selectedDept, setSelectedDept] = useState(urlDept);

  // Sync state with URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchInput.trim()) params.search = searchInput.trim();
    if (selectedDept) params.dept = selectedDept;
    setSearchParams(params, { replace: true });
  }, [searchInput, selectedDept, setSearchParams]);

  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
    refetch,
  } = useCourses({
    search: searchInput.trim() || undefined,
    departmentId: selectedDept || undefined,
  });

  const { data: deptData } = useDepartments();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>Academic Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Academic Programmes
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Comprehensive curriculum in Computer Applications, Business Management, and Commerce designed for leadership in the digital era.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by course name, keyword, or degree..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {(searchInput || selectedDept) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput("");
                setSelectedDept("");
              }}
              className="shrink-0 self-end sm:self-center"
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Department Pills */}
        {deptData?.data && deptData.data.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Dept:
            </span>
            <button
              onClick={() => setSelectedDept("")}
              className={`px-3 py-1 rounded-full font-semibold transition shrink-0 ${
                selectedDept === ""
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All Departments
            </button>
            {deptData.data.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-3 py-1 rounded-full font-semibold transition shrink-0 ${
                  selectedDept === dept.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Course List Grid */}
      {coursesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : coursesError ? (
        <ErrorState
          title="Failed to Load Courses"
          message="Could not retrieve academic course records from the server."
          onRetry={refetch}
        />
      ) : coursesData?.data && coursesData.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.data.map((course) => (
            <Card key={course.id} variant="interactive" className="flex flex-col justify-between">
              <CardContent className="p-6 sm:p-8 space-y-4">
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
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {course.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Eligibility:</span>
                    <span className="text-slate-200 font-semibold text-right truncate max-w-[200px]">
                      {course.eligibility}
                    </span>
                  </div>
                  {course.totalFees > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Total Program Fee:</span>
                      <span className="text-amber-400 font-bold flex items-center">
                        <IndianRupee className="w-3 h-3 inline" />
                        {course.totalFees.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="p-6 sm:p-8 pt-0 flex gap-3">
                <Link to={`/courses/${course.slug}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    Program Details
                  </Button>
                </Link>
                <Link to={`/admissions?course=${encodeURIComponent(course.name)}`}>
                  <Button variant="outline" size="sm">
                    Inquire
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Courses Match Your Criteria"
          description="Try broadening your search term or selecting 'All Departments'."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchInput("");
            setSelectedDept("");
          }}
        />
      )}
    </div>
  );
};

export default CoursesPage;
