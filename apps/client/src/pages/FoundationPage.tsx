import React, { useState, useEffect } from "react";
import { API_VERSION, COLLEGE_NAME, COLLEGE_ADDRESS } from "@srusti/shared";

interface HealthData {
  success: boolean;
  data: {
    status: string;
  };
  message: string;
}

export const FoundationPage: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/${API_VERSION}/health`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setHealth(data);
        setHealthLoading(false);
      })
      .catch((err) => {
        setHealthError(err.message);
        setHealthLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-6 sm:p-12 font-sans">
      <header className="max-w-4xl mx-auto w-full pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0b2b82] text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Phase 1 Foundation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {COLLEGE_NAME}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          {COLLEGE_ADDRESS}
        </p>
      </header>

      <main className="max-w-4xl mx-auto w-full my-12 space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              College Portal — Architecture Foundation
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Monorepo scaffold, local development infrastructure, and environment configuration established.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-500 block uppercase tracking-wider">
                Frontend Stack
              </span>
              <p className="text-slate-900 font-medium text-sm">
                React 18 + Vite + TypeScript
              </p>
              <p className="text-slate-500">
                Tailwind CSS &amp; React Router v6 configured
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-500 block uppercase tracking-wider">
                Backend Stack
              </span>
              <p className="text-slate-900 font-medium text-sm">
                Node.js + Express + TypeScript
              </p>
              <p className="text-slate-500">
                Helmet, CORS, Winston logger &amp; request parser
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-500 block uppercase tracking-wider">
                Shared Contract
              </span>
              <p className="text-slate-900 font-medium text-sm">
                @srusti/shared (API Version: {API_VERSION})
              </p>
              <p className="text-slate-500">
                Shared constants, types &amp; envelope definitions
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-500 block uppercase tracking-wider">
                Database &amp; Cache
              </span>
              <p className="text-slate-900 font-medium text-sm">
                PostgreSQL 15 + Redis + Node
              </p>
              <p className="text-slate-500">
                Locally hosted service infrastructure
              </p>
            </div>
          </div>

          {/* Live API Health Check Probe */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-700 block">
                Backend API Health Probe (/api/{API_VERSION}/health)
              </span>
              <p className="text-[11px] text-slate-500">
                Verifies end-to-end client-to-server proxy communication.
              </p>
            </div>

            <div className="shrink-0">
              {healthLoading && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-spin" />
                  Checking API...
                </span>
              )}

              {health && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  API Healthy ({health.data.status})
                </span>
              )}

              {healthError && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Server Offline ({healthError})
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full pb-8 border-t border-slate-200 pt-6 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>&copy; {new Date().getFullYear()} {COLLEGE_NAME}. All rights reserved.</span>
        <span className="font-mono">Phase 1 Infrastructure Ready</span>
      </footer>
    </div>
  );
};

export default FoundationPage;
