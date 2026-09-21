// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Course Management Page
// =============================================================================

import React, { useState } from "react";
import { Plus, Search, BookOpen, Trash2, Edit3, DollarSign, Clock, CheckCircle } from "lucide-react";
import Card, { CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import {
  useAdminCourses,
  useCreateCourse,
  useDeleteCourse,
  useAdminDepartments,
} from "../../hooks/useAdmin";

export const AdminCourses: React.FC = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [durationYears, setDurationYears] = useState(2);
  const [eligibility, setEligibility] = useState("");
  const [totalFees, setTotalFees] = useState(150000);
  const [description, setDescription] = useState("");

  const { data: deptData } = useAdminDepartments();
  const { data: coursesData, isLoading } = useAdminCourses({
    search: search || undefined,
    departmentId: departmentFilter || undefined,
  });

  const createMutation = useCreateCourse();
  const deleteMutation = useDeleteCourse();

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !departmentId || !eligibility || !description) return;

    const generatedSlug = (code || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    createMutation.mutate(
      {
        name,
        code,
        slug: generatedSlug,
        departmentId,
        durationYears: Number(durationYears),
        eligibility,
        totalFees: Number(totalFees),
        description,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setName("");
          setCode("");
          setDepartmentId("");
          setDescription("");
          setEligibility("");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteCourseId) return;
    deleteMutation.mutate(deleteCourseId, {
      onSuccess: () => setDeleteCourseId(null),
    });
  };

  const departments = deptData || [];
  const courses = coursesData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Academic Programmes</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure curricula, degree durations, fee brackets, and affiliated academic departments.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Programme
        </Button>
      </div>

      {/* Filter Bar */}
      <Card variant="glass" className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input
            placeholder="Search by programme title or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { value: "", label: "All Departments" },
              ...departments.map((d) => ({ value: d.id, label: `${d.name} (${d.code})` })),
            ]}
          />
        </div>
      </Card>

      {/* Courses List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title="No courses found"
          description="No academic programmes match your current filter query. Create a new degree programme to populate this registry."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card
              key={course.id}
              variant="glass"
              className="flex flex-col justify-between hover:border-slate-700 transition-all duration-300"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="blue" size="sm" className="font-mono">
                      {course.code || "DEGR"}
                    </Badge>
                    <h3 className="text-base font-bold text-white mt-2 leading-snug">{course.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{course.department?.name || "Academic Division"}</p>
                  </div>
                  <button
                    onClick={() => setDeleteCourseId(course.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Course"
                    data-testid={`delete-course-${course.code}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{course.durationYears} Years Duration</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>₹{course.totalFees?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Degree Programme" size="lg">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Programme Name"
              placeholder="e.g. Master of Computer Applications"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Course Code"
              placeholder="e.g. MCA"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Department"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              options={[
                { value: "", label: "Select department..." },
                ...departments.map((d) => ({ value: d.id, label: d.name })),
              ]}
              required
            />
            <Input
              label="Duration (Years)"
              type="number"
              min={1}
              max={6}
              value={durationYears}
              onChange={(e) => setDurationYears(Number(e.target.value))}
              required
            />
            <Input
              label="Total Fees (INR)"
              type="number"
              value={totalFees}
              onChange={(e) => setTotalFees(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Eligibility Criteria"
            placeholder="e.g. Graduate with Mathematics at 10+2 or degree level with min 50%"
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Programme Overview &amp; Curriculum Description
            </label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              rows={3}
              placeholder="Provide curriculum scope, learning objectives, and career tracks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={createMutation.isPending}>
              Create Programme
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteCourseId}
        onClose={() => setDeleteCourseId(null)}
        onConfirm={handleDelete}
        title="Delete Academic Programme"
        message="Are you sure you want to delete this course? Enrolled student associations and subject mappings may be affected."
        confirmLabel="Delete Programme"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminCourses;
