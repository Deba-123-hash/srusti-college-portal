// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Database Seed Script (Production & Development Data)
// =============================================================================

import { PrismaClient, UserRole, UserStatus, AttendanceStatus, PlacementStatus, GalleryCategory, InquiryStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with Srusti Academy of Management & Technology data...");

  // 1. Clean existing records in correct relation order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.placementApplication.deleteMany();
  await prisma.placementDrive.deleteMany();
  await prisma.company.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.result.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.course.deleteMany();
  await prisma.department.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data.");

  const defaultPasswordHash = await bcrypt.hash("SecurePass123!", 12);

  // 2. Departments
  const mcaDept = await prisma.department.create({
    data: {
      name: "Department of Computer Applications",
      code: "MCA",
      description: "Center of excellence in advanced computer applications, artificial intelligence, and software engineering.",
    },
  });

  const bcaDept = await prisma.department.create({
    data: {
      name: "Department of Computer Science (UG)",
      code: "BCA",
      description: "Undergraduate computer applications focusing on foundational programming, web tech, and database design.",
    },
  });

  const mbaDept = await prisma.department.create({
    data: {
      name: "Department of Business Administration",
      code: "MBA",
      description: "Comprehensive management education with specializations in Finance, Marketing, and HR.",
    },
  });

  const bbaDept = await prisma.department.create({
    data: {
      name: "Department of Business Administration (UG)",
      code: "BBA",
      description: "Undergraduate business management with industry-integrated curriculum.",
    },
  });

  const bcomDept = await prisma.department.create({
    data: {
      name: "Department of Commerce",
      code: "BCOM",
      description: "Commerce and accounting education with professional certification pathways.",
    },
  });

  console.log("Created departments:", [mcaDept.code, bcaDept.code, mbaDept.code, bbaDept.code, bcomDept.code]);

  // 3. Courses
  const mcaCourse = await prisma.course.create({
    data: {
      name: "Master of Computer Applications",
      slug: "mca",
      code: "PG-MCA",
      departmentId: mcaDept.id,
      durationYears: 2,
      eligibility: "BCA/B.Sc (CS/IT) with 50% marks",
      totalFees: 240000,
      description: "Two-year postgraduate program in advanced computing, AI/ML, cloud computing and software engineering.",
    },
  });

  const bcaCourse = await prisma.course.create({
    data: {
      name: "Bachelor of Computer Applications",
      slug: "bca",
      code: "UG-BCA",
      departmentId: bcaDept.id,
      durationYears: 3,
      eligibility: "10+2 with Mathematics, 45% marks",
      totalFees: 180000,
      description: "Three-year undergraduate program in computer science fundamentals, web development, and database systems.",
    },
  });

  const mbaCourse = await prisma.course.create({
    data: {
      name: "Master of Business Administration",
      slug: "mba",
      code: "PG-MBA",
      departmentId: mbaDept.id,
      durationYears: 2,
      eligibility: "Graduation with 50% marks, valid CAT/MAT score",
      totalFees: 300000,
      description: "Two-year postgraduate program with specializations in Finance, Marketing, HR, and Operations.",
    },
  });

  const bbaCourse = await prisma.course.create({
    data: {
      name: "Bachelor of Business Administration",
      slug: "bba",
      code: "UG-BBA",
      departmentId: bbaDept.id,
      durationYears: 3,
      eligibility: "10+2 any stream, 45% marks",
      totalFees: 150000,
      description: "Three-year undergraduate program in business management, entrepreneurship, and industry practices.",
    },
  });

  const bcomCourse = await prisma.course.create({
    data: {
      name: "Bachelor of Commerce",
      slug: "bcom",
      code: "UG-BCOM",
      departmentId: bcomDept.id,
      durationYears: 3,
      eligibility: "10+2 Commerce stream, 45% marks",
      totalFees: 120000,
      description: "Three-year undergraduate program in accounting, taxation, financial management, and commerce.",
    },
  });

  console.log("Created courses:", [mcaCourse.slug, bcaCourse.slug, mbaCourse.slug, bbaCourse.slug, bcomCourse.slug]);

  // 4. Users & Profiles (Admin, Faculty, Student)
  // Super Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin_test@srusti.ac.in",
      name: "Prof. Siba Prasad Pattanayak",
      passwordHash: defaultPasswordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.adminProfile.create({
    data: {
      userId: adminUser.id,
      designation: "Principal & Academic Director",
      departmentId: mcaDept.id,
    },
  });

  // Faculty
  const facultyUser = await prisma.user.create({
    data: {
      email: "faculty_test@srusti.ac.in",
      name: "Dr. Ashok Kumar Rath",
      passwordHash: defaultPasswordHash,
      role: UserRole.FACULTY,
      status: UserStatus.ACTIVE,
    },
  });

  const faculty = await prisma.faculty.create({
    data: {
      userId: facultyUser.id,
      departmentId: mcaDept.id,
      designation: "Professor & HOD (Computer Applications)",
      phone: "9861012345",
      bio: "20+ years of academic and research experience in Distributed Systems, Artificial Intelligence, and Database Technologies.",
    },
  });

  // Student
  const studentUser = await prisma.user.create({
    data: {
      email: "student_test@srusti.ac.in",
      name: "Debabrata Nayak",
      passwordHash: defaultPasswordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      regNo: "SRUSTI-2024-MCA-001",
      departmentId: mcaDept.id,
      courseId: mcaCourse.id,
      currentSemester: 3,
      enrollmentYear: 2024,
      phone: "9876543210",
      cgpa: 8.75,
    },
  });

  console.log("Created users:", {
    admin: adminUser.email,
    faculty: facultyUser.email,
    student: studentUser.email,
  });

  // 5. Subjects for MCA
  const subDSA = await prisma.subject.create({
    data: {
      name: "Data Structures & Algorithms",
      code: "MCA-101",
      courseId: mcaCourse.id,
      semester: 1,
      credits: 4,
      facultyId: faculty.id,
    },
  });

  const subDBMS = await prisma.subject.create({
    data: {
      name: "Database Management Systems",
      code: "MCA-102",
      courseId: mcaCourse.id,
      semester: 1,
      credits: 4,
      facultyId: faculty.id,
    },
  });

  const subOS = await prisma.subject.create({
    data: {
      name: "Operating Systems Concepts",
      code: "MCA-103",
      courseId: mcaCourse.id,
      semester: 1,
      credits: 3,
    },
  });

  const subJava = await prisma.subject.create({
    data: {
      name: "Object-Oriented Programming with Java",
      code: "MCA-201",
      courseId: mcaCourse.id,
      semester: 2,
      credits: 4,
      facultyId: faculty.id,
    },
  });

  const subCN = await prisma.subject.create({
    data: {
      name: "Computer Networks & Security",
      code: "MCA-202",
      courseId: mcaCourse.id,
      semester: 2,
      credits: 4,
    },
  });

  const subWeb = await prisma.subject.create({
    data: {
      name: "Web Technologies & Cloud Architecture",
      code: "MCA-203",
      courseId: mcaCourse.id,
      semester: 2,
      credits: 4,
      facultyId: faculty.id,
    },
  });

  const subAI = await prisma.subject.create({
    data: {
      name: "Artificial Intelligence & Machine Learning",
      code: "MCA-301",
      courseId: mcaCourse.id,
      semester: 3,
      credits: 4,
      facultyId: faculty.id,
    },
  });

  const subEnterprise = await prisma.subject.create({
    data: {
      name: "Enterprise Application Development",
      code: "MCA-302",
      courseId: mcaCourse.id,
      semester: 3,
      credits: 4,
      facultyId: faculty.id,
    },
  });

  const subBigData = await prisma.subject.create({
    data: {
      name: "Big Data Analytics",
      code: "MCA-303",
      courseId: mcaCourse.id,
      semester: 3,
      credits: 4,
    },
  });

  console.log("Created subjects for MCA.");

  // 6. Examination Results for Student (Semester 1 & 2 Published)
  await prisma.result.createMany({
    data: [
      {
        studentId: student.id,
        subjectId: subDSA.id,
        semester: 1,
        internalMarks: 28,
        externalMarks: 64,
        totalMarks: 92,
        grade: "O",
        credits: 4,
        isPublished: true,
      },
      {
        studentId: student.id,
        subjectId: subDBMS.id,
        semester: 1,
        internalMarks: 26,
        externalMarks: 59,
        totalMarks: 85,
        grade: "E",
        credits: 4,
        isPublished: true,
      },
      {
        studentId: student.id,
        subjectId: subOS.id,
        semester: 1,
        internalMarks: 25,
        externalMarks: 56,
        totalMarks: 81,
        grade: "E",
        credits: 3,
        isPublished: true,
      },
      {
        studentId: student.id,
        subjectId: subJava.id,
        semester: 2,
        internalMarks: 29,
        externalMarks: 66,
        totalMarks: 95,
        grade: "O",
        credits: 4,
        isPublished: true,
      },
      {
        studentId: student.id,
        subjectId: subCN.id,
        semester: 2,
        internalMarks: 27,
        externalMarks: 60,
        totalMarks: 87,
        grade: "E",
        credits: 4,
        isPublished: true,
      },
      {
        studentId: student.id,
        subjectId: subWeb.id,
        semester: 2,
        internalMarks: 28,
        externalMarks: 62,
        totalMarks: 90,
        grade: "O",
        credits: 4,
        isPublished: true,
      },
    ],
  });

  console.log("Created semester results.");

  // 7. Attendance Records for Student (Semester 3 subjects)
  const dates = [
    "2025-01-06", "2025-01-08", "2025-01-10", "2025-01-13", "2025-01-15",
    "2025-01-17", "2025-01-20", "2025-01-22", "2025-01-24", "2025-01-27",
    "2025-02-03", "2025-02-05", "2025-02-07", "2025-02-10", "2025-02-12",
  ];

  const attendanceEntries = [];
  for (const date of dates) {
    attendanceEntries.push({
      studentId: student.id,
      subjectId: subAI.id,
      date,
      status: date === "2025-01-17" ? AttendanceStatus.ABSENT : date === "2025-02-05" ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
    });
    attendanceEntries.push({
      studentId: student.id,
      subjectId: subEnterprise.id,
      date,
      status: date === "2025-01-24" ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT,
    });
    attendanceEntries.push({
      studentId: student.id,
      subjectId: subBigData.id,
      date,
      status: AttendanceStatus.PRESENT,
    });
  }

  await prisma.attendanceRecord.createMany({
    data: attendanceEntries,
  });

  console.log("Created attendance records:", attendanceEntries.length);

  // 8. Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: "Semester Examination Schedule Released",
        content: "The end-semester examination schedule for all programs has been published. Students are advised to check the examination portal for detailed timetables.",
        category: "Academic",
        isPinned: true,
      },
      {
        title: "Campus Placement Drive — TCS",
        content: "TCS will be conducting a campus placement drive on campus next month. Eligible students from MCA and BCA programs should register through the placement portal.",
        category: "Placement",
        isPinned: true,
      },
      {
        title: "Annual Sports Meet 2025",
        content: "The annual sports meet will be held next week. Students interested in participating should register with their respective department coordinators.",
        category: "Events",
        isPinned: false,
      },
    ],
  });

  console.log("Created announcements.");

  // 9. Events
  const techFest = await prisma.event.create({
    data: {
      title: "TechFest 2025",
      description: "Annual technology festival featuring coding competitions, hackathons, tech talks, and project exhibitions.",
      category: "Technical",
      eventDate: "2025-03-15",
      time: "09:00 AM - 06:00 PM",
      venue: "Main Auditorium & CS Labs",
      capacity: 500,
      isRegistrationOpen: true,
      isPublished: true,
    },
  });

  await prisma.event.createMany({
    data: [
      {
        title: "Cultural Night — Srujanee",
        description: "Annual cultural extravaganza with music, dance, drama, and fashion show performances by students.",
        category: "Cultural",
        eventDate: "2025-04-10",
        time: "05:00 PM - 10:00 PM",
        venue: "Open Air Theatre",
        capacity: 1000,
        isRegistrationOpen: true,
        isPublished: true,
      },
      {
        title: "Industry Expert Lecture — AI in Healthcare",
        description: "Guest lecture by Dr. Priya Sharma from AIIMS on applications of artificial intelligence in modern healthcare.",
        category: "Seminar",
        eventDate: "2025-02-20",
        time: "02:00 PM - 04:00 PM",
        venue: "Seminar Hall B",
        capacity: 200,
        isRegistrationOpen: false,
        isPublished: true,
      },
    ],
  });

  // Student registered for TechFest
  await prisma.eventRegistration.create({
    data: {
      eventId: techFest.id,
      studentId: student.id,
    },
  });

  console.log("Created events & registrations.");

  // 10. Companies & Placement Drives
  const tcs = await prisma.company.create({
    data: {
      name: "Tata Consultancy Services",
      website: "https://www.tcs.com",
      industry: "IT Services & Consulting",
      description: "Global leader in IT services, consulting, and business solutions.",
    },
  });

  const infosys = await prisma.company.create({
    data: {
      name: "Infosys Limited",
      website: "https://www.infosys.com",
      industry: "IT Services & Consulting",
      description: "Multinational corporation providing business consulting, information technology, and outsourcing services.",
    },
  });

  const tcsDrive = await prisma.placementDrive.create({
    data: {
      companyId: tcs.id,
      jobRole: "Systems Engineer",
      ctcPackage: "3.6 LPA",
      eligibleCourses: "MCA, BCA",
      minCgpa: 6.0,
      driveDate: "2025-03-01",
      location: "Campus",
      description: "TCS hiring for Systems Engineer role. Written test + technical interview + HR.",
      deadline: "2025-02-25",
      isActive: true,
    },
  });

  await prisma.placementDrive.create({
    data: {
      companyId: infosys.id,
      jobRole: "Software Developer",
      ctcPackage: "4.5 LPA",
      eligibleCourses: "MCA",
      minCgpa: 7.0,
      driveDate: "2025-04-05",
      location: "Campus",
      description: "Infosys campus drive for Software Developer position. Online assessment + interviews.",
      deadline: "2025-03-28",
      isActive: true,
    },
  });

  // Student application for TCS drive
  await prisma.placementApplication.create({
    data: {
      driveId: tcsDrive.id,
      studentId: student.id,
      status: PlacementStatus.APPLIED,
      notes: "Resume verified. Candidate meets eligibility criteria.",
    },
  });

  console.log("Created companies, drives, and student applications.");

  // 11. Gallery Items
  await prisma.galleryItem.createMany({
    data: [
      {
        title: "Campus Main Building",
        category: GalleryCategory.CAMPUS,
        imageUrl: "/images/gallery/campus-main.jpg",
        caption: "The iconic main building of Srusti Academy",
      },
      {
        title: "TechFest 2024 Highlights",
        category: GalleryCategory.EVENTS,
        imageUrl: "/images/gallery/techfest-2024.jpg",
        caption: "Students showcasing projects at TechFest 2024",
      },
      {
        title: "Annual Sports Day",
        category: GalleryCategory.SPORTS,
        imageUrl: "/images/gallery/sports-day.jpg",
        caption: "Cricket finals at the annual sports meet",
      },
      {
        title: "Srujanee Cultural Night",
        category: GalleryCategory.CULTURAL,
        imageUrl: "/images/gallery/cultural-night.jpg",
        caption: "Dance performances at the cultural evening",
      },
    ],
  });

  console.log("Created gallery items.");

  // 12. Inquiries
  await prisma.inquiry.createMany({
    data: [
      {
        name: "Rahul Patel",
        email: "rahul.patel@example.com",
        phone: "9876543210",
        courseOfInterest: "MCA",
        message: "I would like to know about the MCA admission process and fee structure for the upcoming session.",
        type: "ADMISSION",
        status: InquiryStatus.NEW,
      },
      {
        name: "Priya Mohanty",
        email: "priya.m@example.com",
        phone: "9123456789",
        message: "Can you share details about the placement record for BCA graduates?",
        type: "GENERAL",
        status: InquiryStatus.IN_REVIEW,
      },
    ],
  });

  console.log("Created inquiries.");

  // 13. Notifications for Student
  await prisma.notification.createMany({
    data: [
      {
        userId: studentUser.id,
        title: "Examination Schedule Published",
        message: "The Semester 3 examination timetable has been officially notified. Please review in the Results section.",
        link: "/student/results",
        isRead: false,
      },
      {
        userId: studentUser.id,
        title: "TCS Recruitment Drive Application Acknowledged",
        message: "Your application for Systems Engineer at TCS has been successfully submitted.",
        link: "/student/placements",
        isRead: false,
      },
      {
        userId: studentUser.id,
        title: "Attendance Notice: 85%+ Maintained",
        message: "Congratulations! You have maintained over 85% attendance across all core subjects this term.",
        link: "/student/attendance",
        isRead: true,
      },
    ],
  });

  console.log("Created notifications for student.");

  // 14. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      role: "SUPER_ADMIN",
      action: "INITIAL_DATABASE_SEED",
      targetResource: "SYSTEM",
      details: JSON.stringify({ seededAt: new Date().toISOString() }),
      ipAddress: "127.0.0.1",
    },
  });

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
