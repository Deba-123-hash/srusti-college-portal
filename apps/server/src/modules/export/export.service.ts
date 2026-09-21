// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Data Export Service (Sanitized Records & Audit Logging)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { logAuditEvent } from "../../lib/audit";
import { AuthenticatedUserPayload } from "../../middleware/authenticate";

export class ExportService {
  async exportResource(
    resource: string,
    format: string,
    user: AuthenticatedUserPayload,
    ip?: string
  ) {
    let records: any[] = [];

    switch (resource.toLowerCase()) {
      case "students":
        records = await prisma.student.findMany({
          include: {
            user: { select: { name: true, email: true, status: true } },
            department: { select: { name: true, code: true } },
            course: { select: { name: true, code: true } },
          },
        });
        break;

      case "faculty":
        records = await prisma.faculty.findMany({
          include: {
            user: { select: { name: true, email: true, status: true } },
            department: { select: { name: true, code: true } },
          },
        });
        break;

      case "attendance":
        records = await prisma.attendanceRecord.findMany({
          include: {
            student: { select: { regNo: true } },
            subject: { select: { code: true, name: true } },
          },
          take: 1000,
        });
        break;

      case "results":
        records = await prisma.result.findMany({
          include: {
            student: { select: { regNo: true } },
            subject: { select: { code: true, name: true } },
          },
          take: 1000,
        });
        break;

      case "placements":
        records = await prisma.placementApplication.findMany({
          include: {
            student: { select: { regNo: true } },
            drive: {
              include: { company: { select: { name: true } } },
            },
          },
        });
        break;

      case "inquiries":
        records = await prisma.inquiry.findMany({
          take: 1000,
        });
        break;

      default:
        throw ApiError.badRequest(
          `Export for resource '${resource}' is not supported. Supported: students, faculty, attendance, results, placements, inquiries.`,
          "UNSUPPORTED_EXPORT_RESOURCE"
        );
    }

    // Audit Logging: DATA_EXPORT
    await logAuditEvent({
      userId: user.id,
      role: user.role,
      action: "DATA_EXPORT",
      targetResource: resource,
      details: JSON.stringify({ format, count: records.length }),
      ipAddress: ip,
    });

    if (format === "csv") {
      return {
        isCsv: true,
        data: this.convertToCsv(records),
        filename: `${resource}_export_${Date.now()}.csv`,
      };
    }

    return {
      isCsv: false,
      data: records,
    };
  }

  private convertToCsv(items: any[]): string {
    if (!items || items.length === 0) return "";

    const flatten = (obj: any, prefix = ""): any => {
      return Object.keys(obj).reduce((acc: any, k: string) => {
        const pre = prefix.length ? prefix + "." : "";
        if (
          typeof obj[k] === "object" &&
          obj[k] !== null &&
          !Array.isArray(obj[k]) &&
          !(obj[k] instanceof Date)
        ) {
          Object.assign(acc, flatten(obj[k], pre + k));
        } else {
          acc[pre + k] = obj[k];
        }
        return acc;
      }, {});
    };

    const flatItems = items.map((i) => flatten(i));
    const headers = Array.from(
      new Set(flatItems.flatMap((item) => Object.keys(item)))
    );

    const csvRows = [headers.join(",")];

    for (const item of flatItems) {
      const row = headers.map((header) => {
        const val = item[header];
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      });
      csvRows.push(row.join(","));
    }

    return csvRows.join("\n");
  }
}

export const exportService = new ExportService();
