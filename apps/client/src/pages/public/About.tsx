// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// About Institution Page (Phase 7)
// =============================================================================

import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  Target,
  Users,
  Compass,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { COLLEGE_NAME, COLLEGE_ADDRESS } from "@srusti/shared";
import { useDepartments } from "../../hooks/useDepartments";
import Button from "../../components/ui/Button";
import Card, { CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";

export const AboutPage: React.FC = () => {
  const { data: deptData, isLoading: deptLoading } = useDepartments();

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. Page Hero */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-16 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Institutional Legacy &amp; Vision</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
          About <span className="blue-gradient-text">{COLLEGE_NAME}</span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Located at <strong className="text-white">{COLLEGE_ADDRESS}</strong>, Srusti Academy is dedicated to shaping future-ready managers and IT professionals through an integrated blend of rigorous academics and applied problem-solving.
        </p>
      </section>

      {/* 2. Institutional Philosophy: Vision & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card variant="glass" className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Our Institutional Vision</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To be an eminent institution of management and computer education recognized for holistic personal growth, ethical leadership, and impactful technical acumen that contributes meaningfully to industry and society.
            </p>
          </Card>

          <Card variant="glass" className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-md">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Our Core Mission</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To deliver high-caliber educational programs supported by modern infrastructure, experienced faculty, and strong corporate networks, ensuring students possess the technical fluency and strategic vision to excel.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Academic Departments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Organization
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Academic Departments
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Structured departments leading specialized instruction across undergraduate and postgraduate domains.
          </p>
        </div>

        {deptLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : deptData?.data && deptData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deptData.data.map((dept) => (
              <Card key={dept.id} variant="glass" className="p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <Badge variant="blue" size="sm">
                    {dept.code}
                  </Badge>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {dept.description || "Leading academic department offering advanced degree curricula and research opportunities."}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            Departments information is being updated.
          </div>
        )}
      </section>

      {/* 4. Campus Infrastructure & Facilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Campus Environment
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Infrastructure &amp; Learning Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Our campus in Chandaka Industrial Estate is engineered to support contemporary digital learning and corporate engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Advanced Computer Labs</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated computer labs equipped with high-speed networks, development environments, and data modeling workstations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Central Library &amp; E-Resources</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extensive collection of management texts, computer science treatises, national journals, and online academic databases.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h4 className="text-sm font-bold text-white">Auditoriums &amp; Seminar Halls</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Air-conditioned seminar halls featuring audio-visual projection for guest talks, placement pre-talks, and workshops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Next Steps CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 max-w-3xl mx-auto space-y-6">
          <h3 className="text-2xl font-bold text-white">Explore Programs or Inquire with Admissions</h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Find the right program for your career goals, or reach out directly to learn about application timelines and guidelines.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/courses">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse All Courses
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="md">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
