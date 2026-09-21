// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Placement Cell Management Console
// =============================================================================

import React, { useState } from "react";
import { Plus, Briefcase, Users, Calendar, DollarSign, Trash2, Building2, CheckCircle2, ChevronRight } from "lucide-react";
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
  useAdminPlacementDrives,
  useCreatePlacementDrive,
  useDeletePlacementDrive,
  useAdminApplications,
  useUpdatePlacementApplication,
  useAdminCompanies,
  useCreateCompany,
} from "../../hooks/useAdmin";

export const AdminPlacements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"DRIVES" | "APPLICATIONS">("DRIVES");
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [deleteDriveId, setDeleteDriveId] = useState<string | null>(null);

  // Drive Form State
  const [companyId, setCompanyId] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [ctcPackage, setCtcPackage] = useState("₹6.5 LPA");
  const [eligibilityCgpa, setEligibilityCgpa] = useState(7.0);
  const [driveDate, setDriveDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [venue, setVenue] = useState("Campus Placement Cell");
  const [description, setDescription] = useState("");

  // Company Form State
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyWebsite, setNewCompanyWebsite] = useState("");
  const [newCompanyIndustry, setNewCompanyIndustry] = useState("Information Technology");

  const { data: drivesData, isLoading: isLoadingDrives } = useAdminPlacementDrives();
  const { data: applicationsData, isLoading: isLoadingApps } = useAdminApplications();
  const { data: companiesData } = useAdminCompanies();

  const createDriveMutation = useCreatePlacementDrive();
  const deleteDriveMutation = useDeletePlacementDrive();
  const updateAppMutation = useUpdatePlacementApplication();
  const createCompanyMutation = useCreateCompany();

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !jobRole || !ctcPackage || !driveDate || !deadline || !description) return;

    createDriveMutation.mutate(
      {
        companyId,
        jobRole,
        ctcPackage,
        eligibleCourses: "MCA, MBA",
        minCgpa: Number(eligibilityCgpa),
        driveDate,
        location: venue,
        deadline,
        description,
      },
      {
        onSuccess: () => {
          setIsDriveModalOpen(false);
          setJobRole("");
          setDescription("");
        },
      }
    );
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName) return;

    createCompanyMutation.mutate(
      {
        name: newCompanyName,
        website: newCompanyWebsite || undefined,
        industry: newCompanyIndustry || undefined,
      },
      {
        onSuccess: (data) => {
          setIsCompanyModalOpen(false);
          setCompanyId(data.id);
          setNewCompanyName("");
        },
      }
    );
  };

  const handleDeleteDrive = () => {
    if (!deleteDriveId) return;
    deleteDriveMutation.mutate(deleteDriveId, {
      onSuccess: () => setDeleteDriveId(null),
    });
  };

  const handleStatusChange = (appId: string, status: string) => {
    updateAppMutation.mutate({ id: appId, data: { status } });
  };

  const drives = drivesData?.data || [];
  const applications = applicationsData?.data || [];
  const companies = companiesData || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Placement Cell Console</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish recruitment drives, review student candidatures, and update interview selection statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCompanyModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4" />
            Add Recruiter
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsDriveModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Drive
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("DRIVES")}
          className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
            activeTab === "DRIVES" ? "text-blue-400 border-b-2 border-blue-500" : "text-slate-400 hover:text-white"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Recruitment Drives ({drives.length})
        </button>
        <button
          onClick={() => setActiveTab("APPLICATIONS")}
          className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
            activeTab === "APPLICATIONS"
              ? "text-blue-400 border-b-2 border-blue-500"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          Student Applications ({applications.length})
        </button>
      </div>

      {/* Drives Tab */}
      {activeTab === "DRIVES" && (
        <>
          {isLoadingDrives ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-2xl" />
              ))}
            </div>
          ) : drives.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="w-6 h-6" />}
              title="No recruitment drives posted"
              description="No placement drives are active currently. Use 'Create Drive' above to post a company recruitment opportunity."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drives.map((d) => (
                <Card
                  key={d.id}
                  variant="glass"
                  className="flex flex-col justify-between hover:border-slate-700 transition-all duration-300"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-base border border-blue-500/20">
                          {d.company?.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white leading-snug">{d.company?.name}</h3>
                          <p className="text-xs text-blue-400 font-medium">{d.jobRole}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteDriveId(d.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Placement Drive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Package</span>
                        <span className="font-mono font-bold text-emerald-400">{d.ctcPackage}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Cutoff</span>
                        <span className="font-mono font-bold text-white">{d.minCgpa} CGPA</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>Drive: {new Date(d.driveDate).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-slate-500">Apply by:</span>
                        <span>{new Date(d.deadline).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Applications Tab */}
      {activeTab === "APPLICATIONS" && (
        <>
          {isLoadingApps ? (
            <Card variant="glass" className="p-6">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            </Card>
          ) : applications.length === 0 ? (
            <EmptyState
              icon={<Users className="w-6 h-6" />}
              title="No applications submitted"
              description="No student applications have been logged for campus recruitment drives yet."
            />
          ) : (
            <Card variant="glass" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Registration No</th>
                      <th className="py-3 px-4 text-center">CGPA</th>
                      <th className="py-3 px-4">Company &amp; Role</th>
                      <th className="py-3 px-4">Applied Date</th>
                      <th className="py-3 px-4 text-right">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{app.student.user.name}</p>
                          <p className="text-[11px] text-slate-400">{app.student.course?.name}</p>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-300">
                          {app.student.regNo}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                          {app.student.cgpa ? Number(app.student.cgpa).toFixed(2) : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-white font-medium">{app.drive.company.name}</p>
                          <span className="text-[11px] text-blue-400">{app.drive.jobRole}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {new Date(app.appliedAt).toLocaleDateString("en-IN", { dateStyle: "short" })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 font-semibold"
                          >
                            <option value="APPLIED">Applied</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="INTERVIEW">Interview</option>
                            <option value="SELECTED">Selected</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Create Drive Modal */}
      <Modal isOpen={isDriveModalOpen} onClose={() => setIsDriveModalOpen(false)} title="Announce Recruitment Drive" size="lg">
        <form onSubmit={handleCreateDrive} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Recruiting Partner"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              options={[
                { value: "", label: "Select recruiting company..." },
                ...companies.map((comp) => ({ value: comp.id, label: comp.name })),
              ]}
              required
            />
            <Input
              label="Designation / Role"
              placeholder="e.g. Associate Software Engineer"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Compensation Package"
              placeholder="e.g. ₹6.5 LPA + Incentives"
              value={ctcPackage}
              onChange={(e) => setCtcPackage(e.target.value)}
              required
            />
            <Input
              label="Eligibility CGPA Cutoff"
              type="number"
              step="0.1"
              min={0}
              max={10}
              value={eligibilityCgpa}
              onChange={(e) => setEligibilityCgpa(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Drive Date"
              type="date"
              value={driveDate}
              onChange={(e) => setDriveDate(e.target.value)}
              required
            />
            <Input
              label="Application Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
            <Input
              label="Venue / Assessment Mode"
              placeholder="e.g. Virtual or Campus Lab 3"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Job Description, Skill Matrix &amp; Rounds
            </label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              rows={3}
              placeholder="Detail eligibility branches, technical requirements, online test and interview rounds..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsDriveModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={createDriveMutation.isPending}>
              Announce Drive
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Recruiter Modal */}
      <Modal isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} title="Register Recruiting Partner" size="md">
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <Input
            label="Corporate Name"
            placeholder="e.g. Tata Consultancy Services"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            required
          />
          <Input
            label="Official Website"
            placeholder="e.g. https://www.tcs.com"
            value={newCompanyWebsite}
            onChange={(e) => setNewCompanyWebsite(e.target.value)}
          />
          <Input
            label="Industry Domain"
            placeholder="e.g. Information Technology"
            value={newCompanyIndustry}
            onChange={(e) => setNewCompanyIndustry(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsCompanyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={createCompanyMutation.isPending}>
              Add Partner
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Drive Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteDriveId}
        onClose={() => setDeleteDriveId(null)}
        onConfirm={handleDeleteDrive}
        title="Delete Recruitment Drive"
        message="Are you sure you want to remove this recruitment drive? Existing student applications will be removed."
        confirmLabel="Delete Drive"
        variant="danger"
        isLoading={deleteDriveMutation.isPending}
      />
    </div>
  );
};

export default AdminPlacements;
