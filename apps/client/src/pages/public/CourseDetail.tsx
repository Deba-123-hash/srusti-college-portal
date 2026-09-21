// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Course Detail Page (Phase 7)
// =============================================================================

import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  IndianRupee,
  CheckCircle2,
  FileText,
  Send,
  Building2,
  BookOpen,
} from "lucide-react";
import { useCourseBySlug } from "../../hooks/useCourses";
import Button from "../../components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import Breadcrumbs from "../../components/navigation/Breadcrumbs";

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: course,
    isLoading,
    isError,
    refetch,
  } = useCourseBySlug(slug || "");

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <ErrorState
          title="Program Not Found"
          message={`The course program with slug "${slug}" could not be retrieved from the catalog.`}
          onRetry={refetch}
        />
        <div className="mt-6 text-center">
          <Link to="/courses">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Course Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Courses", path: "/courses" },
          { label: course.name },
        ]}
      />

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="blue" size="md">
            {course.code || course.slug.toUpperCase()}
          </Badge>
          {course.department && (
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {course.department.name}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {course.name}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Main Grid: Specifications & Curriculum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Curriculum */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview & Eligibility */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Program Overview &amp; Eligibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block text-xs uppercase tracking-wider">
                  Admission Eligibility Criteria
                </span>
                <p className="text-white font-medium text-sm sm:text-base">
                  {course.eligibility}
                </p>
              </div>

              <p className="leading-relaxed text-slate-400">
                This academic curriculum is formulated in conformity with affiliated university guidelines and industry council benchmarks, integrating hands-on laboratory workshops, seminar presentations, and capstone project defenses.
              </p>
            </CardContent>
          </Card>

          {/* Subjects / Curriculum Breakdown */}
          {course.subjects && course.subjects.length > 0 && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Course Modules &amp; Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.subjects.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{sub.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{sub.code}</span>
                      </div>
                      <Badge variant="slate" size="sm">
                        Sem {sub.semester}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right 1 Col: Key Highlights Card & Inquire CTA */}
        <div className="space-y-6">
          <Card variant="glass" className="p-6 space-y-6 border-blue-500/20">
            <h3 className="text-base font-bold text-white">Program Highlights</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" /> Duration
                </span>
                <strong className="text-white text-sm">{course.durationYears} Academic Years</strong>
              </div>

              {course.totalFees > 0 && (
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-amber-400" /> Total Fee
                  </span>
                  <strong className="text-amber-400 text-sm font-bold">
                    ₹{course.totalFees.toLocaleString("en-IN")}
                  </strong>
                </div>
              )}

              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" /> Department
                </span>
                <strong className="text-white">{course.department?.code || "Srusti"}</strong>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to={`/admissions?course=${encodeURIComponent(course.name)}`}
                className="w-full block"
              >
                <Button variant="gold" size="md" className="w-full" leftIcon={<Send className="w-4 h-4" />}>
                  Inquire for Admission
                </Button>
              </Link>

              {course.syllabusUrl && (
                <a
                  href={course.syllabusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button variant="outline" size="md" className="w-full" leftIcon={<FileText className="w-4 h-4" />}>
                    Download Syllabus
                  </Button>
                </a>
              )}
            </div>
          </Card>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
            <span className="font-bold text-white block">Admissions Help Desk</span>
            <p>
              Need assistance with entrance examinations or counseling codes? Contact our counselors at{" "}
              <strong className="text-blue-400">+91 674 2744404</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
