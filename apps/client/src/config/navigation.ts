// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Centralized Navigation Configuration & RBAC Route Mapping
// =============================================================================

import { UserRole } from "@srusti/shared";

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  allowedRoles?: UserRole[];
  badge?: string;
}

export const publicNavItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Admissions", path: "/admissions" },
  { label: "Placements", path: "/placements" },
  { label: "Events", path: "/events" },
  { label: "Gallery", path: "/gallery" },
  { label: "Contact", path: "/contact" },
];

export const studentNavItems: NavItem[] = [
  { label: "Dashboard", path: "/student/dashboard", icon: "LayoutDashboard", allowedRoles: ["STUDENT"] },
  { label: "Attendance", path: "/student/attendance", icon: "CalendarCheck", allowedRoles: ["STUDENT"] },
  { label: "Results", path: "/student/results", icon: "GraduationCap", allowedRoles: ["STUDENT"] },
  { label: "Placements", path: "/student/placements", icon: "Briefcase", allowedRoles: ["STUDENT"] },
  { label: "Events", path: "/student/events", icon: "Calendar", allowedRoles: ["STUDENT"] },
  { label: "Notifications", path: "/student/notifications", icon: "Bell", allowedRoles: ["STUDENT"] },
];

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "LayoutDashboard", allowedRoles: ["SUPER_ADMIN", "DEPT_ADMIN"] },
  { label: "Courses", path: "/admin/courses", icon: "BookOpen", allowedRoles: ["SUPER_ADMIN", "DEPT_ADMIN"] },
  { label: "Students", path: "/admin/students", icon: "Users", allowedRoles: ["SUPER_ADMIN", "DEPT_ADMIN"] },
  { label: "Faculty", path: "/admin/faculty", icon: "UserCheck", allowedRoles: ["SUPER_ADMIN"] },
  { label: "Attendance", path: "/admin/attendance", icon: "CalendarCheck", allowedRoles: ["SUPER_ADMIN", "DEPT_ADMIN"] },
  { label: "Results", path: "/admin/results", icon: "GraduationCap", allowedRoles: ["SUPER_ADMIN", "DEPT_ADMIN"] },
  { label: "Events", path: "/admin/events", icon: "Calendar", allowedRoles: ["SUPER_ADMIN", "DEPT_ADMIN"] },
  { label: "Placements", path: "/admin/placements", icon: "Briefcase", allowedRoles: ["SUPER_ADMIN", "DEPT_ADMIN"] },
  { label: "Announcements", path: "/admin/announcements", icon: "Megaphone", allowedRoles: ["SUPER_ADMIN", "DEPT_ADMIN"] },
  { label: "Gallery", path: "/admin/gallery", icon: "Image", allowedRoles: ["SUPER_ADMIN", "DEPT_ADMIN"] },
  { label: "Inquiries", path: "/admin/inquiries", icon: "Mail", allowedRoles: ["SUPER_ADMIN", "DEPT_ADMIN"] },
];

export const facultyNavItems: NavItem[] = [
  { label: "Dashboard", path: "/faculty/dashboard", icon: "LayoutDashboard", allowedRoles: ["FACULTY"] },
  { label: "Attendance", path: "/faculty/attendance", icon: "CalendarCheck", allowedRoles: ["FACULTY"] },
  { label: "Marks Entry", path: "/faculty/results", icon: "GraduationCap", allowedRoles: ["FACULTY"] },
  { label: "Events", path: "/faculty/events", icon: "Calendar", allowedRoles: ["FACULTY"] },
];
