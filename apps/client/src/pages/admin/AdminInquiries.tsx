// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Admissions & Inquiries Management Console
// =============================================================================

import React, { useState } from "react";
import { Mail, Search, CheckCircle2, Phone, Calendar, MessageSquare, Clock } from "lucide-react";
import Card, { CardContent } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import { useAdminInquiries, useUpdateInquiry } from "../../hooks/useAdmin";

export const AdminInquiries: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: inquiriesData, isLoading } = useAdminInquiries({
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const updateMutation = useUpdateInquiry();

  const handleStatusChange = (id: string, status: string) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const inquiries = inquiriesData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Admissions &amp; Lead Inquiries</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review prospective student admission queries, campus visitation requests, and contact dispatches.
        </p>
      </div>

      {/* Filter Bar */}
      <Card variant="glass" className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder="Search prospective candidates by name, email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "All Inquiry Statuses" },
              { value: "NEW", label: "New Leads" },
              { value: "IN_REVIEW", label: "In Review" },
              { value: "CONTACTED", label: "Contacted" },
              { value: "CLOSED", label: "Resolved & Closed" },
            ]}
          />
        </div>
      </Card>

      {/* Inquiries List */}
      {isLoading ? (
        <Card variant="glass" className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={<Mail className="w-6 h-6" />}
          title="No inquiries found"
          description="There are no admissions inquiries matching your search and filter criteria."
        />
      ) : (
        <Card variant="glass" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Programme of Interest</th>
                  <th className="py-3 px-4">Message / Query</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Lead Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-white">{inq.name}</p>
                      <p className="text-[11px] text-slate-400">{inq.email}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {inq.phone}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="blue" size="sm">
                        {inq.courseOfInterest || "General Admission"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-300 line-clamp-2 leading-relaxed text-[11px]">
                        {inq.message}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 font-semibold"
                      >
                        <option value="NEW">New</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminInquiries;
