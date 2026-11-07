import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db, getDatabaseStatus, reconnectDatabase } from "./src/db/index.ts";
import { seedDatabase } from "./src/db/seed.ts";
import { adminAuth } from "./src/lib/firebase-admin.ts";
import { eq, desc } from "drizzle-orm";
import {
  users,
  industries,
  contractors,
  workers,
  assignments,
  requirements,
  attendance,
  complianceDocs,
  bills,
  verificationLogs,
  auditLogs,
  revenueLogs,
  supervisors,
  complaints,
  salaryTransactions,
  leaveRecords,
  adminPlatformInvoices
} from "./src/db/schema.ts";

// Process-level uncaught error guards to prevent unexpected dev server termination
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception (handled safely):", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection (handled safely):", reason);
});

const app = express();

// Parse PORT and HOST from environment variables or command line arguments
let PORT = Number(process.env.PORT) || 3000;
let HOST = process.env.HOST || "0.0.0.0";

const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if ((argv[i] === "--port" || argv[i] === "-p") && argv[i + 1]) {
    const parsedPort = Number(argv[i + 1]);
    if (!isNaN(parsedPort) && parsedPort > 0) {
      PORT = parsedPort;
    }
    i++;
  } else if ((argv[i] === "--host" || argv[i] === "-h") && argv[i + 1]) {
    HOST = argv[i + 1];
    i++;
  }
}

app.use(express.json());

// Enable CORS for PWA manifest and assets to allow PWABuilder to read them
app.get(["/manifest.json", "/manifest.webmanifest"], (req: any, res: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Content-Type", "application/manifest+json");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(path.join(process.cwd(), "public", "manifest.json"));
});

app.get("/sw.js", (req: any, res: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(path.join(process.cwd(), "public", "sw.js"));
});

// Enable CORS for all PWA icons
app.get(["/pwa-192x192.png", "/pwa-512x512.png", "/pwa-maskable-512x512.png", "/apple-touch-icon.png", "/icon.png", "/favicon.ico"], (req: any, res: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const filename = path.basename(req.path);
  if (filename === "icon.png") {
    res.setHeader("Content-Type", "image/png");
    res.sendFile(path.join(process.cwd(), "public", "pwa-512x512.png"));
  } else if (filename === "pwa-maskable-512x512.png") {
    res.setHeader("Content-Type", "image/png");
    res.sendFile(path.join(process.cwd(), "public", "pwa-maskable-512x512.png"));
  } else if (filename === "favicon.ico") {
    res.setHeader("Content-Type", "image/x-icon");
    res.sendFile(path.join(process.cwd(), "public", "pwa-192x192.png"));
  } else {
    res.setHeader("Content-Type", "image/png");
    res.sendFile(path.join(process.cwd(), "public", filename));
  }
});

// Optional Auth Middleware (gracefully handles Firebase token or portal session)
const optionalAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// Database seed trigger (ensures the DB is populated on first request if empty)
const ensureDbSeeded = async () => {
  try {
    await seedDatabase();
  } catch (err) {
    console.error("Error during auto-seeding:", err);
  }
};

// 1. Sync user profile after Firebase Authentication
app.post("/api/users/sync", optionalAuth, async (req: any, res: any) => {
  const { role } = req.body;
  const uid = req.user?.uid || "user-" + Date.now();
  const email = req.user?.email || req.body?.email || "";

  try {
    const result = await db.insert(users)
      .values({
        uid,
        email: email || "",
        role: role || "worker",
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: email || "",
          role: role || "worker",
        },
      })
      .returning();

    res.json({ success: true, user: result[0] });
  } catch (error: any) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user profile with Postgres" });
  }
});

// 2. Get all compliance platform data (all tables)
app.get("/api/data", async (req: any, res: any) => {
  try {
    await ensureDbSeeded();

    const [
      allIndustries,
      allContractors,
      allWorkers,
      allAssignments,
      allRequirements,
      allAttendance,
      allComplianceDocs,
      allBills,
      allVerificationLogs,
      allAuditLogs,
      allRevenueLogs,
      allSupervisors,
      allComplaints,
      allSalaryTransactions,
      allLeaveRecords,
      allPlatformInvoices
    ] = await Promise.all([
      db.select().from(industries).catch(() => []),
      db.select().from(contractors).catch(() => []),
      db.select().from(workers).catch(() => []),
      db.select().from(assignments).catch(() => []),
      db.select().from(requirements).catch(() => []),
      db.select().from(attendance).catch(() => []),
      db.select().from(complianceDocs).catch(() => []),
      db.select().from(bills).catch(() => []),
      db.select().from(verificationLogs).orderBy(desc(verificationLogs.timestamp)).catch(() => []),
      db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).catch(() => []),
      db.select().from(revenueLogs).orderBy(desc(revenueLogs.date)).catch(() => []),
      db.select().from(supervisors).catch(() => []),
      db.select().from(complaints).orderBy(desc(complaints.createdAt)).catch(() => []),
      db.select().from(salaryTransactions).orderBy(desc(salaryTransactions.paymentDate)).catch(() => []),
      db.select().from(leaveRecords).orderBy(desc(leaveRecords.appliedAt)).catch(() => []),
      db.select().from(adminPlatformInvoices).orderBy(desc(adminPlatformInvoices.issuedDate)).catch(() => [])
    ]);

    const parsedBills = (allBills || []).map((b: any) => ({
      ...b,
      complianceDocIds: b.complianceDocIds ? (typeof b.complianceDocIds === 'string' ? JSON.parse(b.complianceDocIds) : b.complianceDocIds) : []
    }));

    res.json({
      industries: allIndustries || [],
      contractors: allContractors || [],
      workers: allWorkers || [],
      assignments: allAssignments || [],
      requirements: allRequirements || [],
      attendance: allAttendance || [],
      complianceDocs: allComplianceDocs || [],
      bills: parsedBills,
      verificationLogs: allVerificationLogs || [],
      auditLogs: allAuditLogs || [],
      revenueLogs: allRevenueLogs || [],
      supervisors: allSupervisors || [],
      complaints: allComplaints || [],
      salaryTransactions: allSalaryTransactions || [],
      leaveRecords: allLeaveRecords || [],
      platformInvoices: allPlatformInvoices || []
    });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    res.json({
      industries: [],
      contractors: [],
      workers: [],
      assignments: [],
      requirements: [],
      attendance: [],
      complianceDocs: [],
      bills: [],
      verificationLogs: [],
      auditLogs: [],
      revenueLogs: [],
      supervisors: [],
      complaints: [],
      salaryTransactions: [],
      leaveRecords: [],
      platformInvoices: []
    });
  }
});

// 3. Database Diagnostics & Live Neon Connection
app.get("/api/database/status", async (req: any, res: any) => {
  try {
    const status = await getDatabaseStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to query database status", details: error.message });
  }
});

app.post("/api/database/connect-neon", async (req: any, res: any) => {
  const { connectionString } = req.body;
  if (!connectionString || typeof connectionString !== "string") {
    return res.status(400).json({ error: "Connection string is required" });
  }

  try {
    const newStatus = await reconnectDatabase(connectionString);
    res.json({
      success: true,
      message: "Neon database connected successfully and schema initialized!",
      status: newStatus
    });
  } catch (error: any) {
    console.error("Neon database connection error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to connect to Neon database."
    });
  }
});

// 4. Create Industry / Establishment
app.post("/api/industries/create", optionalAuth, async (req: any, res: any) => {
  const { id, name, location, regNo, lin, contactEmail } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Industry name is required" });
  }

  try {
    const indId = id || "ind-" + Date.now();
    const result = await db.insert(industries)
      .values({
        id: indId,
        name: name.trim(),
        location: location?.trim() || "Assam",
        regNo: regNo?.trim() || `ESTAB-${Date.now().toString().slice(-6)}`,
        lin: lin?.trim() || `LIN-${Date.now().toString().slice(-8)}`,
        contactEmail: contactEmail?.trim() || "admin@icwl.in",
      })
      .onConflictDoUpdate({
        target: industries.id,
        set: {
          name: name.trim(),
          location: location?.trim() || "Assam",
          regNo: regNo?.trim() || `ESTAB-${Date.now().toString().slice(-6)}`,
          lin: lin?.trim() || `LIN-${Date.now().toString().slice(-8)}`,
          contactEmail: contactEmail?.trim() || "admin@icwl.in",
        }
      })
      .returning();

    res.json({ success: true, industry: result[0] });
  } catch (error: any) {
    console.error("Error creating industry:", error);
    res.status(500).json({ error: "Failed to save industry to database" });
  }
});

// 5. Create Contractor / Security Agency
app.post("/api/contractors/create", optionalAuth, async (req: any, res: any) => {
  const { id, name, licenseNo, lin, pan, epfCode, esiCode, contactNo, rating } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Contractor name is required" });
  }

  try {
    const conId = id || "con-" + Date.now();
    const result = await db.insert(contractors)
      .values({
        id: conId,
        name: name.trim(),
        licenseNo: licenseNo?.trim() || `CLRA-AS-${Date.now().toString().slice(-4)}`,
        lin: lin?.trim() || `L-${Date.now().toString().slice(-8)}`,
        pan: pan?.trim() || "AAAAA0000A",
        epfCode: epfCode?.trim() || "AS/GHY/1000A/001",
        esiCode: esiCode?.trim() || "43-0000-000-0000",
        contactNo: contactNo?.trim() || "9864012345",
        rating: typeof rating === "number" ? rating : 5.0,
      })
      .onConflictDoUpdate({
        target: contractors.id,
        set: {
          name: name.trim(),
          licenseNo: licenseNo?.trim() || `CLRA-AS-${Date.now().toString().slice(-4)}`,
          lin: lin?.trim() || `L-${Date.now().toString().slice(-8)}`,
          pan: pan?.trim() || "AAAAA0000A",
          epfCode: epfCode?.trim() || "AS/GHY/1000A/001",
          esiCode: esiCode?.trim() || "43-0000-000-0000",
          contactNo: contactNo?.trim() || "9864012345",
          rating: typeof rating === "number" ? rating : 5.0,
        }
      })
      .returning();

    res.json({ success: true, contractor: result[0] });
  } catch (error: any) {
    console.error("Error creating contractor:", error);
    res.status(500).json({ error: "Failed to save contractor to database" });
  }
});

// 6. Register Contract Worker / Guard
app.post("/api/workers/register", optionalAuth, async (req: any, res: any) => {
  const { name, phone, aadhaarHash, contractorId, skillType, dailyWageRate } = req.body;
  if (!name || !phone || !aadhaarHash || !contractorId || !skillType) {
    return res.status(400).json({ error: "Missing required worker information" });
  }

  try {
    const workerId = "wrk-" + Date.now();
    const maskedAadhaar = aadhaarHash.includes("XXXX") ? aadhaarHash : `XXXX-XXXX-${aadhaarHash.slice(-4)}`;

    const newWorker = await db.insert(workers).values({
      id: workerId,
      name,
      aadhaarHash: maskedAadhaar,
      phone,
      contractorId,
      skillType,
      dailyWageRate: Number(dailyWageRate) || 500,
      status: "Available",
      onboardingVerified: true,
      onboardingDate: new Date().toISOString().split("T")[0]
    }).returning();

    const contractorObj = await db.select().from(contractors).where(eq(contractors.id, contractorId)).limit(1);
    const contractorName = contractorObj[0]?.name || "Assigned Contractor";

    const newLog = await db.insert(verificationLogs).values({
      id: "log-" + Date.now(),
      workerId,
      workerName: name,
      timestamp: new Date().toLocaleString(),
      activity: "Onboarding",
      status: "Success",
      remarks: `Aadhaar verified for new contract worker. Assigned under contractor: ${contractorName}.`
    }).returning();

    res.json({ success: true, worker: newWorker[0], log: newLog[0] });
  } catch (error: any) {
    console.error("Error registering worker:", error);
    res.status(500).json({ error: "Failed to register worker in database" });
  }
});

// 7. Deploy Worker to Industry
app.post("/api/workers/deploy", optionalAuth, async (req: any, res: any) => {
  const { workerId, industryId, shiftTiming } = req.body;
  if (!workerId || !industryId) {
    return res.status(400).json({ error: "Worker ID and Industry ID are required" });
  }

  try {
    const workerObj = await db.select().from(workers).where(eq(workers.id, workerId)).limit(1);
    const contractorId = workerObj[0]?.contractorId || "con-1";

    // Update worker status
    await db.update(workers)
      .set({ status: "Deployed" })
      .where(eq(workers.id, workerId));

    // Create new assignment
    const newAssignment = await db.insert(assignments).values({
      id: "asg-" + Date.now(),
      workerId,
      contractorId,
      industryId,
      assignedAt: new Date().toISOString().split("T")[0],
      status: "Active",
      shiftTiming: shiftTiming || "Morning (06:00 - 14:00)"
    }).returning();

    res.json({ success: true, assignment: newAssignment[0] });
  } catch (error: any) {
    console.error("Error deploying worker:", error);
    res.status(500).json({ error: "Failed to deploy worker" });
  }
});

// 8. Recall Worker from Industry
app.post("/api/workers/recall", optionalAuth, async (req: any, res: any) => {
  const { assignmentId, workerId } = req.body;

  try {
    if (assignmentId) {
      await db.update(assignments)
        .set({ status: "Recalled" })
        .where(eq(assignments.id, assignmentId));
    }
    if (workerId) {
      await db.update(workers)
        .set({ status: "Available" })
        .where(eq(workers.id, workerId));
    }

    res.json({ success: true, message: "Worker recalled successfully" });
  } catch (error: any) {
    console.error("Error recalling worker:", error);
    res.status(500).json({ error: "Failed to recall worker" });
  }
});

// 9. Update Worker Status (Activate, Deactivate, Blacklist)
app.post("/api/workers/update-status", optionalAuth, async (req: any, res: any) => {
  const { workerId, status, remarks } = req.body;
  if (!workerId || !status) {
    return res.status(400).json({ error: "workerId and status are required" });
  }

  try {
    const updateData: any = { status };
    if (remarks) updateData.blacklistedReason = remarks;

    const updated = await db.update(workers)
      .set(updateData)
      .where(eq(workers.id, workerId))
      .returning();

    res.json({ success: true, worker: updated[0] });
  } catch (error: any) {
    console.error("Error updating worker status:", error);
    res.status(500).json({ error: "Failed to update worker status" });
  }
});

// 10. Update Worker PF, ESIC & Bank Details
app.post("/api/workers/update-pf", optionalAuth, async (req: any, res: any) => {
  const { workerId, uan, esicNo, bankAccountNo, ifscCode, bankName } = req.body;
  if (!workerId) {
    return res.status(400).json({ error: "workerId is required" });
  }

  try {
    const updated = await db.update(workers)
      .set({
        uan: uan || null,
        esicNo: esicNo || null,
        bankAccountNo: bankAccountNo || null,
        ifscCode: ifscCode || null,
        bankName: bankName || null,
      })
      .where(eq(workers.id, workerId))
      .returning();

    res.json({ success: true, worker: updated[0] });
  } catch (error: any) {
    console.error("Error updating worker PF/Bank:", error);
    res.status(500).json({ error: "Failed to update PF details" });
  }
});

// 11. Upload Missing Compliance Challan (EPF / ESI / GST)
app.post("/api/compliance/upload-missing", optionalAuth, async (req: any, res: any) => {
  const { contractorId, month, docType, fileUrl, remarks } = req.body;
  if (!contractorId || !docType) {
    return res.status(400).json({ error: "Contractor ID and docType are required" });
  }

  try {
    const newDoc = await db.insert(complianceDocs).values({
      id: "doc-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      contractorId,
      month: month || "July 2026",
      docType,
      fileUrl: fileUrl || `${docType.toLowerCase()}-verified.pdf`,
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "Verified",
      verifiedBy: "EPFO/ESIC Automated Gateway",
      remarks: remarks || `${docType} digitally verified.`
    }).returning();

    res.json({ success: true, doc: newDoc[0] });
  } catch (error: any) {
    console.error("Error uploading compliance doc:", error);
    res.status(500).json({ error: "Failed to upload compliance document" });
  }
});

// 12. Submit Contractor Bill
app.post("/api/bills/submit", optionalAuth, async (req: any, res: any) => {
  const {
    billNumber,
    contractorId,
    industryId,
    month,
    baseAmount,
    serviceCharge,
    gstAmount,
    totalAmount,
    status,
    complianceDocIds,
    remarks
  } = req.body;

  if (!contractorId || !industryId) {
    return res.status(400).json({ error: "Contractor ID and Industry ID are required" });
  }

  try {
    const billId = "bill-" + Date.now();
    const docIdsSerialized = Array.isArray(complianceDocIds) ? JSON.stringify(complianceDocIds) : "[]";

    const newBill = await db.insert(bills).values({
      id: billId,
      contractorId,
      industryId,
      month: month || "July 2026",
      baseAmount: Number(baseAmount) || 0,
      serviceCharge: Number(serviceCharge) || 0,
      gstAmount: Number(gstAmount) || 0,
      totalAmount: Number(totalAmount) || 0,
      status: status || "Submitted",
      submittedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      remarks: remarks || `Bill No. ${billNumber || billId}`,
      complianceDocIds: docIdsSerialized
    }).returning();

    res.json({ success: true, bill: { ...newBill[0], complianceDocIds } });
  } catch (error: any) {
    console.error("Error submitting bill:", error);
    res.status(500).json({ error: "Failed to submit bill" });
  }
});

// 13. Update Bill Status
app.post("/api/bills/update-status", optionalAuth, async (req: any, res: any) => {
  const { billId, status } = req.body;
  if (!billId || !status) {
    return res.status(400).json({ error: "billId and status are required" });
  }

  try {
    const updated = await db.update(bills)
      .set({
        status,
        submittedAt: status === "Submitted" ? new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : undefined
      })
      .where(eq(bills.id, billId))
      .returning();

    res.json({ success: true, bill: updated[0] });
  } catch (error: any) {
    console.error("Error updating bill status:", error);
    res.status(500).json({ error: "Failed to update bill status" });
  }
});

// 14. Industry Audit / Approve / Reject Bill
app.post("/api/bills/audit", optionalAuth, async (req: any, res: any) => {
  const { billId, action } = req.body;
  if (!billId || !action) {
    return res.status(400).json({ error: "billId and action are required" });
  }

  try {
    const newStatus = action === "Approve" ? "Approved" : "Rejected";
    const updated = await db.update(bills)
      .set({
        status: newStatus,
        reviewedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      })
      .where(eq(bills.id, billId))
      .returning();

    // Log the audit
    await db.insert(auditLogs).values({
      id: "audit-" + Date.now(),
      inspectorName: "Principal Employer HR",
      inspectedEntity: "Contractor Bill",
      entityId: billId,
      entityName: `Bill ${billId}`,
      timestamp: new Date().toLocaleString(),
      findings: `Bill ${action === "Approve" ? "approved" : "rejected"} post EPF/ESI statutory audit.`,
      status: action === "Approve" ? "Compliant" : "Non-Compliant"
    });

    res.json({ success: true, bill: updated[0] });
  } catch (error: any) {
    console.error("Error auditing bill:", error);
    res.status(500).json({ error: "Failed to audit bill" });
  }
});

// 15. Post Industry Requirement
app.post("/api/requirements/add", optionalAuth, async (req: any, res: any) => {
  const { industryId, industryName, contractorId, date, skillType, workersNeeded, shiftTiming } = req.body;
  if (!industryId || !contractorId || !workersNeeded) {
    return res.status(400).json({ error: "Missing required requirement fields" });
  }

  try {
    const newReq = await db.insert(requirements).values({
      id: "req-" + Date.now(),
      industryId,
      industryName: industryName || "Industry Plant",
      contractorId,
      date: date || new Date().toISOString().split("T")[0],
      skillType: skillType || "Unskilled",
      workersNeeded: Number(workersNeeded),
      workersFulfilled: 0,
      shiftTiming: shiftTiming || "General (09:00 - 17:00)",
      status: "Open"
    }).returning();

    res.json({ success: true, requirement: newReq[0] });
  } catch (error: any) {
    console.error("Error adding requirement:", error);
    res.status(500).json({ error: "Failed to post requirement" });
  }
});

// 16. Record Attendance Check-In
app.post("/api/attendance/check-in", optionalAuth, async (req: any, res: any) => {
  const { workerId, verificationMethod, checkIn, date, industryId } = req.body;
  if (!workerId) {
    return res.status(400).json({ error: "workerId is required" });
  }

  try {
    const workerObj = await db.select().from(workers).where(eq(workers.id, workerId)).limit(1);
    const workerName = workerObj[0]?.name || "Contract Worker";
    const contractorId = workerObj[0]?.contractorId || "con-1";

    const newAtt = await db.insert(attendance).values({
      id: "att-" + Date.now(),
      date: date || new Date().toISOString().split("T")[0],
      workerId,
      workerName,
      contractorId,
      industryId: industryId || "ind-1",
      checkIn: checkIn || new Date().toTimeString().split(" ")[0].slice(0, 5),
      aadhaarVerified: true,
      verificationMethod: verificationMethod || "Aadhaar-OTP",
      hoursWorked: 8,
      overtimeHours: 0,
      status: "Present"
    }).returning();

    res.json({ success: true, attendance: newAtt[0] });
  } catch (error: any) {
    console.error("Error recording attendance:", error);
    res.status(500).json({ error: "Failed to record attendance" });
  }
});

// 17. Submit Audit Notice
app.post("/api/audit/submit-notice", optionalAuth, async (req: any, res: any) => {
  const { inspectorName, inspectedEntity, entityId, entityName, findings, status } = req.body;

  try {
    const newLog = await db.insert(auditLogs).values({
      id: "audit-" + Date.now(),
      inspectorName: inspectorName || "Government Labour Inspector",
      inspectedEntity: inspectedEntity || "Industry",
      entityId: entityId || "unknown",
      entityName: entityName || "Unknown",
      timestamp: new Date().toLocaleString(),
      findings: findings || "Routine inspection completed.",
      status: status || "Compliant"
    }).returning();

    res.json({ success: true, auditLog: newLog[0] });
  } catch (error: any) {
    console.error("Error submitting audit notice:", error);
    res.status(500).json({ error: "Failed to submit audit notice" });
  }
});

// 18. Submit Complaint / Grievance
app.post("/api/complaints/submit", optionalAuth, async (req: any, res: any) => {
  const {
    id,
    complaintNumber,
    supervisorId,
    supervisorName,
    industryId,
    industryName,
    contractorId,
    contractorName,
    workerId,
    workerName,
    category,
    subject,
    description,
    severity,
    status
  } = req.body;

  try {
    const compId = id || "comp-" + Date.now();
    const compNo = complaintNumber || `CMP-${Date.now().toString().slice(-6)}`;

    const newComp = await db.insert(complaints).values({
      id: compId,
      complaintNumber: compNo,
      supervisorId: supervisorId || "sup-system",
      supervisorName: supervisorName || "Platform User",
      industryId: industryId || "ind-1",
      industryName: industryName || "Industry",
      contractorId: contractorId || "con-1",
      contractorName: contractorName || "Contractor",
      workerId: workerId || null,
      workerName: workerName || null,
      category: category || "General",
      subject: subject || "Issue Report",
      description: description || "",
      severity: severity || "Medium",
      status: status || "Open",
      ccAdmin: true,
      ccContractor: true,
      createdAt: new Date().toISOString().split("T")[0]
    }).returning();

    res.json({ success: true, complaint: newComp[0] });
  } catch (error: any) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ error: "Failed to submit complaint" });
  }
});

// 19. Disburse Salary to Worker (Bank Transfer DBT)
app.post("/api/salary/disburse", optionalAuth, async (req: any, res: any) => {
  const {
    workerId,
    workerName,
    industryName,
    contractorName,
    month,
    amount,
    pfDeducted,
    esicDeducted,
    netPaid,
    bankName,
    accountNumberMasked,
    utrNumber
  } = req.body;

  try {
    const newTxn = await db.insert(salaryTransactions).values({
      id: "txn-" + Date.now(),
      workerId: workerId || "wrk-1",
      workerName: workerName || "Worker",
      contractorId: "con-1",
      contractorName: contractorName || "Contractor",
      industryId: "ind-1",
      industryName: industryName || "Industry",
      month: month || "July 2026",
      amount: Number(amount) || 0,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMode: "NEFT/RTGS",
      utrNumber: utrNumber || `UTR${Date.now()}`,
      accountNumberMasked: accountNumberMasked || "XXXX-XXXX-1234",
      bankName: bankName || "State Bank of India",
      status: "Successful",
      pfDeducted: Number(pfDeducted) || 0,
      esicDeducted: Number(esicDeducted) || 0,
      netPaid: Number(netPaid) || Number(amount) || 0
    }).returning();

    res.json({ success: true, transaction: newTxn[0] });
  } catch (error: any) {
    console.error("Error disbursing salary:", error);
    res.status(500).json({ error: "Failed to record salary transaction" });
  }
});

// 20. Record Leave Application
app.post("/api/leave/record", optionalAuth, async (req: any, res: any) => {
  const {
    id,
    workerId,
    workerName,
    contractorId,
    contractorName,
    leaveType,
    daysCount,
    startDate,
    endDate,
    reason,
    status
  } = req.body;

  try {
    const leaveId = id || "lve-" + Date.now();
    const newLeave = await db.insert(leaveRecords).values({
      id: leaveId,
      workerId: workerId || "wrk-1",
      workerName: workerName || "Worker",
      contractorId: contractorId || "con-1",
      contractorName: contractorName || "Contractor",
      leaveType: leaveType || "Casual Leave",
      daysCount: Number(daysCount) || 1,
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: endDate || new Date().toISOString().split("T")[0],
      reason: reason || "Leave requested",
      status: status || "Approved",
      appliedAt: new Date().toISOString().split("T")[0],
      approvedBy: "Contractor Sardar / Supervisor",
      wagePaidForLeave: true
    }).returning();

    res.json({ success: true, leaveRecord: newLeave[0] });
  } catch (error: any) {
    console.error("Error recording leave:", error);
    res.status(500).json({ error: "Failed to record leave" });
  }
});

// 21. Generate Platform SaaS Invoice (₹1/worker/day)
app.post("/api/invoices/generate", optionalAuth, async (req: any, res: any) => {
  const {
    invoiceNo,
    entityName,
    billedEntity,
    entityId,
    month,
    activeWorkersCount,
    mandaysCount,
    subtotal,
    gstAmount,
    totalPayable
  } = req.body;

  try {
    const invId = "inv-" + Date.now();
    const newInv = await db.insert(adminPlatformInvoices).values({
      id: invId,
      invoiceNo: invoiceNo || `SL-INV-${Date.now().toString().slice(-6)}`,
      billedEntity: billedEntity || "Industry",
      entityId: entityId || "ind-1",
      entityName: entityName || "Industry Plant",
      month: month || "July 2026",
      activeWorkersCount: Number(activeWorkersCount) || 1,
      mandaysCount: Number(mandaysCount) || 30,
      ratePerWorkerDay: 1.0,
      subtotal: Number(subtotal) || 30,
      gstAmount: Number(gstAmount) || 5.4,
      totalPayable: Number(totalPayable) || 35.4,
      status: "Generated",
      issuedDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0]
    }).returning();

    res.json({ success: true, invoice: newInv[0] });
  } catch (error: any) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ error: "Failed to generate platform invoice" });
  }
});

// 22. Update Platform Invoice Status (Paid)
app.post("/api/invoices/update-status", optionalAuth, async (req: any, res: any) => {
  const { invoiceId, status, transactionRef } = req.body;
  if (!invoiceId || !status) {
    return res.status(400).json({ error: "invoiceId and status are required" });
  }

  try {
    const updated = await db.update(adminPlatformInvoices)
      .set({
        status,
        paidAt: status === "Paid" ? new Date().toISOString().split("T")[0] : undefined,
        transactionRef: transactionRef || `UPI-${Date.now().toString().slice(-6)}`
      })
      .where(eq(adminPlatformInvoices.id, invoiceId))
      .returning();

    res.json({ success: true, invoice: updated[0] });
  } catch (error: any) {
    console.error("Error updating invoice status:", error);
    res.status(500).json({ error: "Failed to update invoice status" });
  }
});

// Integrate Vite Dev Server / Static files middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const isHmrDisabled = process.env.DISABLE_HMR === "true";
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
        watch: isHmrDisabled ? null : undefined,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${PORT} is already in use. Dev server process remains active.`);
    } else {
      console.error("Express server error:", err);
    }
  });
}

startServer();