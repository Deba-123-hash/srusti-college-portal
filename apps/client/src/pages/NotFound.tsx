// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// 404 Not Found Page
// =============================================================================

import React from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen, Compass } from "lucide-react";
import Button from "../components/ui/Button";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center selection:bg-blue-600 selection:text-white">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 shadow-2xl shadow-blue-950/40">
        <Compass className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
        Error 404 &bull; Page Not Found
      </span>

      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
        Lost in Campus?
      </h1>

      <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
        The destination URL you attempted to reach does not exist or may have been relocated.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button variant="secondary" size="sm" leftIcon={<Home className="w-4 h-4" />}>
            Back Home
          </Button>
        </Link>
        <Link to="/courses">
          <Button variant="primary" size="sm" leftIcon={<BookOpen className="w-4 h-4" />}>
            Browse Courses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
