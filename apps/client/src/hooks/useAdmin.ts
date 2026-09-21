// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Administrative Query & Mutation Hooks (TanStack React Query)
// =============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  CreateCoursePayload,
  UpdateCoursePayload,
  CreateStudentPayload,
  UpdateStudentPayload,
  CreateFacultyPayload,
  UpdateFacultyPayload,
  BatchAttendancePayload,
  CreateResultPayload,
  UpdateResultPayload,
  PublishResultsPayload,
  CreateEventPayload,
  UpdateEventPayload,
  CreatePlacementDrivePayload,
  CreateAnnouncementPayload,
} from "../api/admin";
import { useToast } from "./useToast";
import parseApiError from "../utils/apiError";

export const ADMIN_DASHBOARD_KEY = ["admin", "dashboard"];
export const ADMIN_COURSES_KEY = ["admin", "courses"];
export const ADMIN_STUDENTS_KEY = ["admin", "students"];
export const ADMIN_FACULTY_KEY = ["admin", "faculty"];
export const ADMIN_ATTENDANCE_KEY = ["admin", "attendance"];
export const ADMIN_RESULTS_KEY = ["admin", "results"];
export const ADMIN_EVENTS_KEY = ["admin", "events"];
export const ADMIN_DRIVES_KEY = ["admin", "placements", "drives"];
export const ADMIN_APPLICATIONS_KEY = ["admin", "placements", "applications"];
export const ADMIN_COMPANIES_KEY = ["admin", "companies"];
export const ADMIN_ANNOUNCEMENTS_KEY = ["admin", "announcements"];
export const ADMIN_GALLERY_KEY = ["admin", "gallery"];
export const ADMIN_INQUIRIES_KEY = ["admin", "inquiries"];
export const ADMIN_DEPARTMENTS_KEY = ["departments"];
export const ADMIN_SUBJECTS_KEY = ["subjects"];

// =============================================================================
// 1. Dashboard Hook
// =============================================================================

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEY,
    queryFn: () => adminApi.getDashboard(),
    staleTime: 60 * 1000,
  });
};

// =============================================================================
// 2. Courses Hooks
// =============================================================================

export const useAdminCourses = (params?: { departmentId?: string; search?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...ADMIN_COURSES_KEY, params],
    queryFn: () => adminApi.courses.list(params),
    staleTime: 30 * 1000,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateCoursePayload) => adminApi.courses.create(payload),
    onSuccess: () => {
      toast.success("Course created successfully.");
      queryClient.invalidateQueries({ queryKey: ADMIN_COURSES_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCoursePayload }) =>
      adminApi.courses.update(id, data),
    onSuccess: () => {
      toast.success("Course updated successfully.");
      queryClient.invalidateQueries({ queryKey: ADMIN_COURSES_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => adminApi.courses.delete(id),
    onSuccess: () => {
      toast.info("Course deleted.");
      queryClient.invalidateQueries({ queryKey: ADMIN_COURSES_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

// =============================================================================
// 3. Students Hooks
// =============================================================================

export const useAdminStudents = (params?: {
  search?: string;
  regNo?: string;
  departmentId?: string;
  courseId?: string;
  semester?: number;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...ADMIN_STUDENTS_KEY, params],
    queryFn: () => adminApi.students.list(params),
    staleTime: 30 * 1000,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateStudentPayload) => adminApi.students.create(payload),
    onSuccess: () => {
      toast.success("Student registered successfully.");
      queryClient.invalidateQueries({ queryKey: ADMIN_STUDENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentPayload }) =>
      adminApi.students.update(id, data),
    onSuccess: () => {
      toast.success("Student record updated successfully.");
      queryClient.invalidateQueries({ queryKey: ADMIN_STUDENTS_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => adminApi.students.delete(id),
    onSuccess: () => {
      toast.info("Student profile removed.");
      queryClient.invalidateQueries({ queryKey: ADMIN_STUDENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

// =============================================================================
// 4. Faculty Hooks
// =============================================================================

export const useAdminFaculty = (params?: { departmentId?: string; search?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...ADMIN_FACULTY_KEY, params],
    queryFn: () => adminApi.faculty.list(params),
    staleTime: 30 * 1000,
  });
};

export const useCreateFaculty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateFacultyPayload) => adminApi.faculty.create(payload),
    onSuccess: () => {
      toast.success("Faculty member registered successfully.");
      queryClient.invalidateQueries({ queryKey: ADMIN_FACULTY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useUpdateFaculty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFacultyPayload }) =>
      adminApi.faculty.update(id, data),
    onSuccess: () => {
      toast.success("Faculty details updated successfully.");
      queryClient.invalidateQueries({ queryKey: ADMIN_FACULTY_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useDeleteFaculty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => adminApi.faculty.delete(id),
    onSuccess: () => {
      toast.info("Faculty member removed.");
      queryClient.invalidateQueries({ queryKey: ADMIN_FACULTY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

// =============================================================================
// 5. Attendance Hooks
// =============================================================================

export const useAdminAttendance = (params?: {
  studentId?: string;
  subjectId?: string;
  date?: string;
  semester?: number;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...ADMIN_ATTENDANCE_KEY, params],
    queryFn: () => adminApi.attendance.list(params),
    staleTime: 15 * 1000,
  });
};

export const useBatchCreateAttendance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: BatchAttendancePayload) => adminApi.attendance.batchCreate(payload),
    onSuccess: (data) => {
      toast.success(`Attendance submitted successfully (${data.count} records).`);
      queryClient.invalidateQueries({ queryKey: ADMIN_ATTENDANCE_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

// =============================================================================
// 6. Results Hooks
// =============================================================================

export const useAdminResults = (params?: {
  studentId?: string;
  subjectId?: string;
  semester?: number;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...ADMIN_RESULTS_KEY, params],
    queryFn: () => adminApi.results.list(params),
    staleTime: 15 * 1000,
  });
};

export const useCreateResult = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateResultPayload) => adminApi.results.create(payload),
    onSuccess: () => {
      toast.success("Semester marks entered successfully.");
      queryClient.invalidateQueries({ queryKey: ADMIN_RESULTS_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useUpdateResult = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResultPayload }) =>
      adminApi.results.update(id, data),
    onSuccess: () => {
      toast.success("Result record updated.");
      queryClient.invalidateQueries({ queryKey: ADMIN_RESULTS_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const usePublishResults = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: PublishResultsPayload) => adminApi.results.publish(payload),
    onSuccess: (data) => {
      toast.success(`Successfully published ${data.count} student result sheets.`);
      queryClient.invalidateQueries({ queryKey: ADMIN_RESULTS_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

// =============================================================================
// 7. Events Hooks
// =============================================================================

export const useAdminEvents = (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...ADMIN_EVENTS_KEY, params],
    queryFn: () => adminApi.events.list(params),
    staleTime: 30 * 1000,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => adminApi.events.create(payload),
    onSuccess: () => {
      toast.success("Campus event published successfully.");
      queryClient.invalidateQueries({ queryKey: ADMIN_EVENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventPayload }) =>
      adminApi.events.update(id, data),
    onSuccess: () => {
      toast.success("Event details updated.");
      queryClient.invalidateQueries({ queryKey: ADMIN_EVENTS_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => adminApi.events.delete(id),
    onSuccess: () => {
      toast.info("Event removed.");
      queryClient.invalidateQueries({ queryKey: ADMIN_EVENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

// =============================================================================
// 8. Placements Hooks
// =============================================================================

export const useAdminPlacementDrives = (params?: { active?: boolean; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...ADMIN_DRIVES_KEY, params],
    queryFn: () => adminApi.placements.listDrives(params),
    staleTime: 30 * 1000,
  });
};

export const useCreatePlacementDrive = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreatePlacementDrivePayload) => adminApi.placements.createDrive(payload),
    onSuccess: () => {
      toast.success("Placement recruitment drive announced.");
      queryClient.invalidateQueries({ queryKey: ADMIN_DRIVES_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useDeletePlacementDrive = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => adminApi.placements.deleteDrive(id),
    onSuccess: () => {
      toast.info("Drive listing removed.");
      queryClient.invalidateQueries({ queryKey: ADMIN_DRIVES_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useAdminApplications = (params?: { driveId?: string; studentId?: string; status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...ADMIN_APPLICATIONS_KEY, params],
    queryFn: () => adminApi.placements.listApplications(params),
    staleTime: 15 * 1000,
  });
};

export const useUpdatePlacementApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; notes?: string } }) =>
      adminApi.placements.updateApplication(id, data),
    onSuccess: () => {
      toast.success("Applicant status updated.");
      queryClient.invalidateQueries({ queryKey: ADMIN_APPLICATIONS_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useAdminCompanies = () => {
  return useQuery({
    queryKey: ADMIN_COMPANIES_KEY,
    queryFn: () => adminApi.placements.listCompanies(),
    staleTime: 60 * 1000,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: { name: string; website?: string; logoUrl?: string; industry?: string }) =>
      adminApi.placements.createCompany(payload),
    onSuccess: () => {
      toast.success("Recruiting partner added.");
      queryClient.invalidateQueries({ queryKey: ADMIN_COMPANIES_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

// =============================================================================
// 9. Announcements Hooks
// =============================================================================

export const useAdminAnnouncements = (params?: { search?: string; category?: string; pinnedOnly?: boolean; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...ADMIN_ANNOUNCEMENTS_KEY, params],
    queryFn: () => adminApi.announcements.list(params),
    staleTime: 30 * 1000,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateAnnouncementPayload) => adminApi.announcements.create(payload),
    onSuccess: () => {
      toast.success("Notice published successfully.");
      queryClient.invalidateQueries({ queryKey: ADMIN_ANNOUNCEMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => adminApi.announcements.delete(id),
    onSuccess: () => {
      toast.info("Notice archived.");
      queryClient.invalidateQueries({ queryKey: ADMIN_ANNOUNCEMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

// =============================================================================
// 10. Gallery Hooks
// =============================================================================

export const useAdminGallery = (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...ADMIN_GALLERY_KEY, params],
    queryFn: () => adminApi.gallery.list(params),
    staleTime: 30 * 1000,
  });
};

export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: { title: string; category: "EVENTS" | "CAMPUS" | "CULTURAL" | "SPORTS"; imageUrl: string; caption?: string }) =>
      adminApi.gallery.create(payload),
    onSuccess: () => {
      toast.success("Gallery photo uploaded successfully.");
      queryClient.invalidateQueries({ queryKey: ADMIN_GALLERY_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => adminApi.gallery.delete(id),
    onSuccess: () => {
      toast.info("Gallery item deleted.");
      queryClient.invalidateQueries({ queryKey: ADMIN_GALLERY_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

// =============================================================================
// 11. Inquiries Hooks
// =============================================================================

export const useAdminInquiries = (params?: { status?: string; isRead?: boolean; search?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...ADMIN_INQUIRIES_KEY, params],
    queryFn: () => adminApi.inquiries.list(params),
    staleTime: 20 * 1000,
  });
};

export const useUpdateInquiry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: string; isRead?: boolean; notes?: string } }) =>
      adminApi.inquiries.update(id, data),
    onSuccess: () => {
      toast.success("Inquiry status updated.");
      queryClient.invalidateQueries({ queryKey: ADMIN_INQUIRIES_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

// =============================================================================
// Lookup Utilities (Departments & Subjects)
// =============================================================================

export const useAdminDepartments = () => {
  return useQuery({
    queryKey: ADMIN_DEPARTMENTS_KEY,
    queryFn: () => adminApi.departments.list(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminSubjects = (params?: { courseId?: string; semester?: number }) => {
  return useQuery({
    queryKey: [...ADMIN_SUBJECTS_KEY, params],
    queryFn: () => adminApi.subjects.list(params),
    enabled: !!params?.courseId || !!params?.semester,
    staleTime: 60 * 1000,
  });
};
