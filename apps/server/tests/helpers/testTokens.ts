import { signAccessToken } from "../../src/lib/jwt";
import { UserRole } from "@srusti/shared";

export const mockUsers = {
  superAdmin: {
    userId: "usr-mock-super-admin",
    email: "superadmin@srusti.ac.in",
    role: "SUPER_ADMIN" as UserRole,
  },
  deptAdmin: {
    userId: "usr-mock-dept-admin",
    email: "deptadmin@srusti.ac.in",
    role: "DEPT_ADMIN" as UserRole,
    departmentId: "dept-mca",
  },
  faculty: {
    userId: "usr-mock-faculty",
    email: "faculty@srusti.ac.in",
    role: "FACULTY" as UserRole,
    departmentId: "dept-mca",
  },
  student: {
    userId: "usr-mock-student",
    email: "student@srusti.ac.in",
    role: "STUDENT" as UserRole,
    departmentId: "dept-mca",
  },
};

export const superAdminToken = signAccessToken(mockUsers.superAdmin);
export const deptAdminToken = signAccessToken(mockUsers.deptAdmin);
export const facultyToken = signAccessToken(mockUsers.faculty);
export const studentToken = signAccessToken(mockUsers.student);
export const expiredToken = signAccessToken(mockUsers.student, "-1s");
export const tamperedToken = `${studentToken.substring(0, studentToken.length - 8)}INVALIDX`;
