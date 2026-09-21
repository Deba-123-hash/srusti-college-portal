// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Student Roster & Registry Management
// =============================================================================

import React, { useState } from "react";
import { Plus, Search, Users, Trash2, Mail, Phone, GraduationCap } from "lucide-react";
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
  useAdminStudents,
  useCreateStudent,
  useDeleteStudent,
  useAdminCourses,
  useAdminDepartments,
} from "../../hooks/useAdmin";

export const AdminStudents: React.FC = () => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Student@123");
  const [regNo, setRegNo] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [currentSemester, setCurrentSemester] = useState(1);
  const [phone, setPhone] = useState("");
  const [cgpa, setCgpa] = useState(8.0);

  const { data: deptData } = useAdminDepartments();
  const { data: courseData } = useAdminCourses();
  const { data: studentData, isLoading } = useAdminStudents({
    search: search || undefined,
    courseId: courseFilter || undefined,
    semester: semesterFilter ? Number(semesterFilter) : undefined,
  });

  const createMutation = useCreateStudent();
  const deleteMutation = useDeleteStudent();

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !regNo || !departmentId || !courseId) return;

    createMutation.mutate(
      {
        name,
        email,
        password,
        regNo,
        departmentId,
        courseId,
        currentSemester: Number(currentSemester),
        phone: phone || null,
        cgpa: Number(cgpa),
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setName("");
          setEmail("");
          setRegNo("");
          setPhone("");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteStudentId) return;
    deleteMutation.mutate(deleteStudentId, {
      onSuccess: () => setDeleteStudentId(null),
    });
  };

  const departments = deptData || [];
  const courses = courseData?.data || [];
  const students = studentData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Student Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Institutional student roster, enrollment identities, academic semesters, and grade points.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Enroll New Student
        </Button>
      </div>

      {/* Filter Bar */}
      <Card variant="glass" className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search by student name or registration number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            options={[
              { value: "", label: "All Programmes" },
              ...courses.map((c) => ({ value: c.id, label: `${c.name} (${c.code})` })),
            ]}
          />
          <Select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            options={[
              { value: "", label: "All Semesters" },
              ...[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({ value: String(s), label: `Semester ${s}` })),
            ]}
          />
        </div>
      </Card>

      {/* Students Table */}
      {isLoading ? (
        <Card variant="glass" className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      ) : students.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No students located"
          description="No students matched your search criteria or enrolled roster. You can add a new student using the button above."
        />
      ) : (
        <Card variant="glass" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Registration No</th>
                  <th className="py-3 px-4">Programme &amp; Semester</th>
                  <th className="py-3 px-4 text-center">CGPA</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold border border-blue-500/20">
                          {st.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{st.user.name}</p>
                          <p className="text-[11px] text-slate-400">{st.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-300">
                      {st.regNo}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white font-medium">{st.course?.name || "General"}</p>
                      <Badge variant="blue" size="sm" className="mt-1">
                        Sem {st.currentSemester}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                      {st.cgpa ? Number(st.cgpa).toFixed(2) : "0.00"}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {st.phone || "Not recorded"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setDeleteStudentId(st.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Remove Student Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Enroll Student Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Enroll Student Profile" size="lg">
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Debabrata Nayak"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Institutional Email"
              type="email"
              placeholder="e.g. debabrata@srusti.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Enrollment / Reg No"
              placeholder="e.g. SRUSTI-2024-MCA-001"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value.toUpperCase())}
              required
            />
            <Input
              label="Temporary Password"
              placeholder="Default: Student@123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <Select
              label="Programme"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              options={[
                { value: "", label: "Select programme..." },
                ...courses.map((c) => ({ value: c.id, label: `${c.name} (${c.code})` })),
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Semester"
              type="number"
              min={1}
              max={8}
              value={currentSemester}
              onChange={(e) => setCurrentSemester(Number(e.target.value))}
              required
            />
            <Input
              label="Starting CGPA"
              type="number"
              step="0.01"
              min={0}
              max={10}
              value={cgpa}
              onChange={(e) => setCgpa(Number(e.target.value))}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={createMutation.isPending}>
              Enroll Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteStudentId}
        onClose={() => setDeleteStudentId(null)}
        onConfirm={handleDelete}
        title="Remove Student Record"
        message="Are you sure you want to remove this student? All attendance entries, results, and placement applications linked to this profile will be deleted."
        confirmLabel="Remove Student"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminStudents;
