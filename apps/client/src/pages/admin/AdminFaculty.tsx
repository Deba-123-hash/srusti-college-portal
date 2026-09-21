// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Faculty Directory Management
// =============================================================================

import React, { useState } from "react";
import { Plus, Search, Users, Trash2, Mail, Phone, Briefcase, Award } from "lucide-react";
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
  useAdminFaculty,
  useCreateFaculty,
  useDeleteFaculty,
  useAdminDepartments,
} from "../../hooks/useAdmin";

export const AdminFaculty: React.FC = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteFacultyId, setDeleteFacultyId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Faculty@123");
  const [departmentId, setDepartmentId] = useState("");
  const [designation, setDesignation] = useState("Assistant Professor");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const { data: deptData } = useAdminDepartments();
  const { data: facultyData, isLoading } = useAdminFaculty({
    search: search || undefined,
    departmentId: departmentFilter || undefined,
  });

  const createMutation = useCreateFaculty();
  const deleteMutation = useDeleteFaculty();

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !departmentId || !designation) return;

    createMutation.mutate(
      {
        name,
        email,
        password,
        departmentId,
        designation,
        phone: phone || null,
        bio: bio || null,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setName("");
          setEmail("");
          setPhone("");
          setBio("");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteFacultyId) return;
    deleteMutation.mutate(deleteFacultyId, {
      onSuccess: () => setDeleteFacultyId(null),
    });
  };

  const departments = deptData || [];
  const facultyMembers = facultyData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Faculty Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Academic professors, department chairs, subject instructors, and professional designations.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Register Faculty Member
        </Button>
      </div>

      {/* Filter Bar */}
      <Card variant="glass" className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder="Search by faculty name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { value: "", label: "All Academic Departments" },
              ...departments.map((d) => ({ value: d.id, label: `${d.name} (${d.code})` })),
            ]}
          />
        </div>
      </Card>

      {/* Faculty Cards / Table */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : facultyMembers.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No faculty members found"
          description="No instructors match your current search query. Register a new faculty profile using the action button above."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facultyMembers.map((f) => (
            <Card
              key={f.id}
              variant="glass"
              className="flex flex-col justify-between hover:border-slate-700 transition-all duration-300"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/20">
                      {f.user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{f.user.name}</h3>
                      <p className="text-xs text-blue-400 font-medium flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {f.designation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteFacultyId(f.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Remove Faculty Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <p className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>{f.department?.name || "General"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{f.user.email}</span>
                  </p>
                  {f.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{f.phone}</span>
                    </p>
                  )}
                </div>

                {f.bio && (
                  <p className="text-xs text-slate-400 line-clamp-2 pt-2 border-t border-slate-800/80 italic">
                    "{f.bio}"
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Register Faculty Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Faculty Member" size="lg">
        <form onSubmit={handleCreateFaculty} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Faculty Full Name"
              placeholder="e.g. Dr. Ashok Kumar Rath"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Official Email Address"
              type="email"
              placeholder="e.g. ashok.rath@srusti.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Temporary Password"
              placeholder="Default: Faculty@123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Designation / Academic Role"
              placeholder="e.g. Professor & HOD"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
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
                ...departments.map((d) => ({ value: d.id, label: `${d.name} (${d.code})` })),
              ]}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Academic Biography &amp; Research Focus
            </label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              rows={3}
              placeholder="Provide academic background, doctoral research, publications..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={createMutation.isPending}>
              Register Faculty
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteFacultyId}
        onClose={() => setDeleteFacultyId(null)}
        onConfirm={handleDelete}
        title="Remove Faculty Member"
        message="Are you sure you wish to remove this faculty member? Any assigned subject curriculum responsibilities will be unassigned."
        confirmLabel="Remove Faculty"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminFaculty;
