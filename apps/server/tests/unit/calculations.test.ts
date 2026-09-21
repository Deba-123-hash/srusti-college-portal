import { describe, it, expect } from "vitest";

function calculateAttendanceStats(records: Array<{ status: "PRESENT" | "ABSENT" | "LATE" }>) {
  const totalClasses = records.length;
  if (totalClasses === 0) {
    return { totalClasses: 0, present: 0, absent: 0, late: 0, percentage: 0 };
  }
  const present = records.filter((r) => r.status === "PRESENT").length;
  const late = records.filter((r) => r.status === "LATE").length;
  const absent = records.filter((r) => r.status === "ABSENT").length;
  // Late counts as present in percentage or weighted 100%
  const effectivePresent = present + late;
  const percentage = Math.round((effectivePresent / totalClasses) * 100 * 10) / 10;

  return { totalClasses, present, absent, late, percentage };
}

function calculateCgpa(results: Array<{ grade: string; credits: number }>) {
  const gradePoints: Record<string, number> = {
    "O": 10,
    "A+": 9,
    "A": 8,
    "B+": 7,
    "B": 6,
    "C": 5,
    "P": 4,
    "F": 0,
  };

  let totalPoints = 0;
  let totalCredits = 0;

  for (const res of results) {
    const points = gradePoints[res.grade.toUpperCase()] ?? 0;
    totalPoints += points * res.credits;
    totalCredits += res.credits;
  }

  if (totalCredits === 0) return 0.0;
  return Math.round((totalPoints / totalCredits) * 100) / 100;
}

describe("Unit: Attendance & CGPA Calculations", () => {
  it("should accurately compute attendance percentage with present and late", () => {
    const records: Array<{ status: "PRESENT" | "ABSENT" | "LATE" }> = [
      { status: "PRESENT" },
      { status: "PRESENT" },
      { status: "PRESENT" },
      { status: "LATE" },
      { status: "ABSENT" },
    ];

    const stats = calculateAttendanceStats(records);
    expect(stats.totalClasses).toBe(5);
    expect(stats.present).toBe(3);
    expect(stats.late).toBe(1);
    expect(stats.absent).toBe(1);
    expect(stats.percentage).toBe(80); // (4/5) * 100 = 80%
  });

  it("should handle 0 total classes gracefully without NaN or division by zero", () => {
    const stats = calculateAttendanceStats([]);
    expect(stats.totalClasses).toBe(0);
    expect(stats.percentage).toBe(0);
    expect(Number.isNaN(stats.percentage)).toBe(false);
  });

  it("should compute weighted CGPA accurately across multiple semester subjects", () => {
    const results = [
      { grade: "O", credits: 4 },   // 10 * 4 = 40
      { grade: "A+", credits: 4 },  // 9 * 4 = 36
      { grade: "A", credits: 3 },   // 8 * 3 = 24
      { grade: "B+", credits: 3 },  // 7 * 3 = 21
    ];
    // Total points: 40 + 36 + 24 + 21 = 121
    // Total credits: 4 + 4 + 3 + 3 = 14
    // CGPA: 121 / 14 = 8.6428... -> 8.64
    const cgpa = calculateCgpa(results);
    expect(cgpa).toBe(8.64);
  });

  it("should return 0.0 for zero credits results without NaN", () => {
    const cgpa = calculateCgpa([]);
    expect(cgpa).toBe(0.0);
    expect(Number.isNaN(cgpa)).toBe(false);
  });
});
