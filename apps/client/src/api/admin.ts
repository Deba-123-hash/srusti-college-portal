// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Centralized Admin API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse, PaginationMeta } from "@srusti/shared";
import { Course } from "./courses";
import { Department } from "./departments";
import { Event } from "./events";
import { PlacementDrive } from "./placements";

export interface AdminStats {
  studentCount: number;
  facultyCount: number;
  courseCount: number;
  eventCount: number;
  placementDriveCount: number;
  pendingInquiryCount: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentAnnouncements: Array<{
    id: string;
    title: string;
    category: string;
    createdAt: string;
    isPinned: boolean;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    eventDate: string;
    venue: string;
    capacity: number;
  }>;
  recentAuditLogs?: Array<{
    id: string;
    action: string;
    entity: string;
    userId: string;
    createdAt: string;
  }>;
}

export interface AdminStudentItem {
  id: string;
  userId: string;
  regNo: string;
  departmentId: string;
  courseId: string;
  currentSemester: number;
  enrollmentYear: number;
  phone?: string | null;
  cgpa: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  course: {
    id: string;
    name: string;
    code: string | null;
  };
  department: {
    id: string;
    name: string;
    code: string;
  };
}

export interface CreateStudentPayload {
  name: string;
  email: string;
  password?: string;
  regNo: string;
  departmentId: string;
  courseId: string;
  currentSemester: number;
  enrollmentYear?: number;
  phone?: string | null;
  cgpa?: number;
}

export interface UpdateStudentPayload {
  name?: string;
  phone?: string | null;
  currentSemester?: number;
  cgpa?: number;
  departmentId?: string;
  courseId?: string;
}

export interface AdminFacultyItem {
  id: string;
  userId: string;
  departmentId: string;
  designation: string;
  phone?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  department: {
    id: string;
    name: string;
    code: string;
  };
  subjects?: Array<{
    id: string;
    name: string;
    code: string;
    semester: number;
  }>;
}

export interface CreateFacultyPayload {
  name: string;
  email: string;
  password?: string;
  departmentId: string;
  designation: string;
  phone?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  subjectIds?: string[];
}

export interface UpdateFacultyPayload {
  name?: string;
  designation?: string;
  phone?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  departmentId?: string;
  subjectIds?: string[];
}

export interface CreateCoursePayload {
  name: string;
  code: string;
  slug?: string;
  departmentId: string;
  durationYears: number;
  eligibility: string;
  totalFees: number;
  description: string;
  syllabusUrl?: string | null;
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  courseId: string;
  semester: number;
  credits: number;
  facultyId?: string | null;
}

export interface BatchAttendancePayload {
  records: Array<{
    studentId: string;
    subjectId: string;
    date: string;
    status: "PRESENT" | "ABSENT" | "LATE";
    remarks?: string | null;
  }>;
}

export interface CreateResultPayload {
  studentId: string;
  subjectId: string;
  semester: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks?: number;
  grade: string;
  credits?: number;
}

export interface UpdateResultPayload {
  internalMarks?: number;
  externalMarks?: number;
  totalMarks?: number;
  grade?: string;
  credits?: number;
  isPublished?: boolean;
}

export interface PublishResultsPayload {
  subjectId?: string;
  semester?: number;
  courseId?: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  category: string;
  eventDate: string;
  time: string;
  venue: string;
  capacity: number;
  bannerUrl?: string | null;
  isRegistrationOpen: boolean;
  isPublished: boolean;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {}

export interface CompanyItem {
  id: string;
  name: string;
  website?: string | null;
  logoUrl?: string | null;
  industry?: string | null;
}

export interface CreatePlacementDrivePayload {
  companyId: string;
  jobRole: string;
  ctcPackage: string;
  eligibleCourses: string;
  minCgpa: number;
  driveDate: string;
  location: string;
  deadline: string;
  description: string;
  isActive?: boolean;
}

export interface AdminPlacementApplication {
  id: string;
  driveId: string;
  studentId: string;
  status: "APPLIED" | "SHORTLISTED" | "INTERVIEW" | "SELECTED" | "REJECTED";
  notes?: string | null;
  appliedAt: string;
  student: {
    id: string;
    regNo: string;
    cgpa: number;
    currentSemester: number;
    user: {
      name: string;
      email: string;
    };
    course: {
      name: string;
    };
  };
  drive: PlacementDrive;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementPayload {
  title: string;
  content: string;
  category?: string;
  isPinned?: boolean;
  expiresAt?: string | null;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "EVENTS" | "CAMPUS" | "CULTURAL" | "SPORTS";
  imageUrl: string;
  caption?: string | null;
  createdAt: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseOfInterest?: string | null;
  message: string;
  type?: string | null;
  source?: string | null;
  status: "NEW" | "IN_REVIEW" | "CONTACTED" | "CLOSED";
  isRead: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const adminApi = {
  // Dashboard
  getDashboard: async (): Promise<AdminDashboardData> => {
    const res = await api.get<ApiResponse<AdminDashboardData>>("/dashboard/admin");
    return res.data.data;
  },

  // Courses
  courses: {
    list: async (params?: { departmentId?: string; search?: string; page?: number; limit?: number }) => {
      const res = await api.get<ApiResponse<Course[]>>("/courses", { params });
      return { data: res.data.data, meta: res.data.meta };
    },
    getById: async (id: string) => {
      const res = await api.get<ApiResponse<Course>>(`/courses/${id}`);
      return res.data.data;
    },
    create: async (data: CreateCoursePayload) => {
      const res = await api.post<ApiResponse<Course>>("/courses", data);
      return res.data.data;
    },
    update: async (id: string, data: UpdateCoursePayload) => {
      const res = await api.patch<ApiResponse<Course>>(`/courses/${id}`, data);
      return res.data.data;
    },
    delete: async (id: string) => {
      const res = await api.delete<ApiResponse<null>>(`/courses/${id}`);
      return res.data.data;
    },
  },

  // Students
  students: {
    list: async (params?: {
      search?: string;
      regNo?: string;
      departmentId?: string;
      courseId?: string;
      semester?: number;
      page?: number;
      limit?: number;
    }) => {
      const res = await api.get<ApiResponse<AdminStudentItem[]>>("/students", { params });
      return { data: res.data.data, meta: res.data.meta };
    },
    getById: async (id: string) => {
      const res = await api.get<ApiResponse<AdminStudentItem>>(`/students/${id}`);
      return res.data.data;
    },
    create: async (data: CreateStudentPayload) => {
      const res = await api.post<ApiResponse<AdminStudentItem>>("/students", data);
      return res.data.data;
    },
    update: async (id: string, data: UpdateStudentPayload) => {
      const res = await api.patch<ApiResponse<AdminStudentItem>>(`/students/${id}`, data);
      return res.data.data;
    },
    delete: async (id: string) => {
      const res = await api.delete<ApiResponse<null>>(`/students/${id}`);
      return res.data.data;
    },
  },

  // Faculty
  faculty: {
    list: async (params?: { departmentId?: string; search?: string; page?: number; limit?: number }) => {
      const res = await api.get<ApiResponse<AdminFacultyItem[]>>("/faculty", { params });
      return { data: res.data.data, meta: res.data.meta };
    },
    getById: async (id: string) => {
      const res = await api.get<ApiResponse<AdminFacultyItem>>(`/faculty/${id}`);
      return res.data.data;
    },
    create: async (data: CreateFacultyPayload) => {
      const res = await api.post<ApiResponse<AdminFacultyItem>>("/faculty", data);
      return res.data.data;
    },
    update: async (id: string, data: UpdateFacultyPayload) => {
      const res = await api.patch<ApiResponse<AdminFacultyItem>>(`/faculty/${id}`, data);
      return res.data.data;
    },
    delete: async (id: string) => {
      const res = await api.delete<ApiResponse<null>>(`/faculty/${id}`);
      return res.data.data;
    },
  },

  // Attendance
  attendance: {
    batchCreate: async (payload: BatchAttendancePayload) => {
      const res = await api.post<ApiResponse<{ count: number }>>("/attendance", payload);
      return res.data.data;
    },
    list: async (params?: {
      studentId?: string;
      subjectId?: string;
      date?: string;
      dateFrom?: string;
      dateTo?: string;
      semester?: number;
      page?: number;
      limit?: number;
    }) => {
      const res = await api.get<ApiResponse<any[]>>("/attendance", { params });
      return { data: res.data.data, meta: res.data.meta };
    },
  },

  // Results
  results: {
    list: async (params?: { studentId?: string; subjectId?: string; semester?: number; isPublished?: boolean; page?: number; limit?: number }) => {
      const res = await api.get<ApiResponse<any[]>>("/results", { params });
      return { data: res.data.data, meta: res.data.meta };
    },
    create: async (data: CreateResultPayload) => {
      const res = await api.post<ApiResponse<any>>("/results", data);
      return res.data.data;
    },
    update: async (id: string, data: UpdateResultPayload) => {
      const res = await api.patch<ApiResponse<any>>(`/results/${id}`, data);
      return res.data.data;
    },
    publish: async (data: PublishResultsPayload) => {
      const res = await api.post<ApiResponse<{ count: number }>>("/results/publish", data);
      return res.data.data;
    },
  },

  // Events
  events: {
    list: async (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
      const res = await api.get<ApiResponse<Event[]>>("/events", { params });
      return { data: res.data.data, meta: res.data.meta };
    },
    getById: async (id: string) => {
      const res = await api.get<ApiResponse<Event>>(`/events/${id}`);
      return res.data.data;
    },
    create: async (data: CreateEventPayload) => {
      const res = await api.post<ApiResponse<Event>>("/events", data);
      return res.data.data;
    },
    update: async (id: string, data: UpdateEventPayload) => {
      const res = await api.patch<ApiResponse<Event>>(`/events/${id}`, data);
      return res.data.data;
    },
    delete: async (id: string) => {
      const res = await api.delete<ApiResponse<null>>(`/events/${id}`);
      return res.data.data;
    },
  },

  // Placements
  placements: {
    listDrives: async (params?: { active?: boolean; page?: number; limit?: number }) => {
      const res = await api.get<ApiResponse<PlacementDrive[]>>("/placements/drives", { params });
      return { data: res.data.data, meta: res.data.meta };
    },
    createDrive: async (data: CreatePlacementDrivePayload) => {
      const res = await api.post<ApiResponse<PlacementDrive>>("/placements/drives", data);
      return res.data.data;
    },
    updateDrive: async (id: string, data: Partial<CreatePlacementDrivePayload>) => {
      const res = await api.patch<ApiResponse<PlacementDrive>>(`/placements/drives/${id}`, data);
      return res.data.data;
    },
    deleteDrive: async (id: string) => {
      const res = await api.delete<ApiResponse<null>>(`/placements/drives/${id}`);
      return res.data.data;
    },
    listApplications: async (params?: { driveId?: string; studentId?: string; status?: string; page?: number; limit?: number }) => {
      const res = await api.get<ApiResponse<AdminPlacementApplication[]>>("/placements/applications", { params });
      return { data: res.data.data, meta: res.data.meta };
    },
    updateApplication: async (id: string, data: { status: string; notes?: string }) => {
      const res = await api.patch<ApiResponse<AdminPlacementApplication>>(`/placements/applications/${id}`, data);
      return res.data.data;
    },
    listCompanies: async () => {
      const res = await api.get<ApiResponse<CompanyItem[]>>("/companies");
      return res.data.data;
    },
    createCompany: async (data: { name: string; website?: string; logoUrl?: string; industry?: string }) => {
      const res = await api.post<ApiResponse<CompanyItem>>("/companies", data);
      return res.data.data;
    },
  },

  // Announcements
  announcements: {
    list: async (params?: { search?: string; category?: string; pinnedOnly?: boolean; page?: number; limit?: number }) => {
      const res = await api.get<ApiResponse<AnnouncementItem[]>>("/announcements", { params });
      return { data: res.data.data, meta: res.data.meta };
    },
    create: async (data: CreateAnnouncementPayload) => {
      const res = await api.post<ApiResponse<AnnouncementItem>>("/announcements", data);
      return res.data.data;
    },
    update: async (id: string, data: Partial<CreateAnnouncementPayload>) => {
      const res = await api.patch<ApiResponse<AnnouncementItem>>(`/announcements/${id}`, data);
      return res.data.data;
    },
    delete: async (id: string) => {
      const res = await api.delete<ApiResponse<null>>(`/announcements/${id}`);
      return res.data.data;
    },
  },

  // Gallery
  gallery: {
    list: async (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
      const res = await api.get<ApiResponse<GalleryItem[]>>("/gallery", { params });
      return { data: res.data.data, meta: res.data.meta };
    },
    create: async (data: { title: string; category: "EVENTS" | "CAMPUS" | "CULTURAL" | "SPORTS"; imageUrl: string; caption?: string }) => {
      const res = await api.post<ApiResponse<GalleryItem>>("/gallery", data);
      return res.data.data;
    },
    delete: async (id: string) => {
      const res = await api.delete<ApiResponse<null>>(`/gallery/${id}`);
      return res.data.data;
    },
  },

  // Inquiries
  inquiries: {
    list: async (params?: { status?: string; isRead?: boolean; search?: string; page?: number; limit?: number }) => {
      const res = await api.get<ApiResponse<InquiryItem[]>>("/inquiries", { params });
      return { data: res.data.data, meta: res.data.meta };
    },
    update: async (id: string, data: { status?: string; isRead?: boolean; notes?: string }) => {
      const res = await api.patch<ApiResponse<InquiryItem>>(`/inquiries/${id}`, data);
      return res.data.data;
    },
  },

  // Lookup helpers
  departments: {
    list: async () => {
      const res = await api.get<ApiResponse<Department[]>>("/departments");
      return res.data.data;
    },
  },
  subjects: {
    list: async (params?: { courseId?: string; semester?: number }) => {
      const res = await api.get<ApiResponse<SubjectItem[]>>("/subjects", { params });
      return res.data.data;
    },
  },
};

export default adminApi;
