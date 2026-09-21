// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Global Institutional Footer Component
// =============================================================================

import React from "react";
import { Link } from "react-router-dom";
import { COLLEGE_NAME, COLLEGE_ADDRESS } from "@srusti/shared";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-auto">
      {/* Top Academic Accent Line */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Branding & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-900/30">
                S
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                SRUSTI ACADEMY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {COLLEGE_NAME} is dedicated to fostering academic excellence, industry readiness, and visionary leadership in Management and Computer Applications.
            </p>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{COLLEGE_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>admissions@srusti.ac.in</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 674 2744404 / 2744405</span>
              </div>
            </div>
          </div>

          {/* Col 3: Academic Programs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Academic Programs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/courses/mca" className="hover:text-white transition-colors">
                  Master of Computer Applications (MCA)
                </Link>
              </li>
              <li>
                <Link to="/courses/mba" className="hover:text-white transition-colors">
                  Master of Business Administration (MBA)
                </Link>
              </li>
              <li>
                <Link to="/courses/bca" className="hover:text-white transition-colors">
                  Bachelor of Computer Applications (BCA)
                </Link>
              </li>
              <li>
                <Link to="/courses/bba" className="hover:text-white transition-colors">
                  Bachelor of Business Administration (BBA)
                </Link>
              </li>
              <li>
                <Link to="/courses/bcom" className="hover:text-white transition-colors">
                  Bachelor of Commerce (B.Com)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Campus
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About the Academy
                </Link>
              </li>
              <li>
                <Link to="/admissions" className="hover:text-white transition-colors">
                  Admissions &amp; Eligibility
                </Link>
              </li>
              <li>
                <Link to="/placements" className="hover:text-white transition-colors">
                  Training &amp; Placements
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Campus Events
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">
                  Campus Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Portals & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Student &amp; Staff
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold transition"
                >
                  <span>Portal Login</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-white transition-colors">
                  Student Portal Shell
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors">
                  Admin Portal Shell
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="hover:text-white transition-colors">
                  Account Recovery
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {COLLEGE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>Bhubaneswar, Odisha, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
