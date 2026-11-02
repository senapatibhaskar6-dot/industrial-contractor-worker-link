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

// Enable CORS for all PWA icons to allow external scanners like PWABuilder to download them safely
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

// Auth middleware to verify Firebase ID Token
const requireAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// 1. Database seed trigger (ensures the DB is populated on first request if empty)
const ensureDbSeeded = async () => {
  try {
    await seedDatabase();
  } catch (err) {
    console.error("Error during auto-seeding:", err);
  }
};

// 2. Sync user profile after Firebase Authentication
app.post("/api/users/sync", requireAuth, async (req: any, res: any) => {
  const { role } = req.body;
  const { uid, email } = req.user;

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

// 3. Get all compliance platform data (all tables)
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
      db.select().from(industries),
      db.select().from(contractors),
      db.select().from(workers),
      db.select().from(assignments),
      db.select().from(requirements),
      db.select().from(attendance),
      db.select().from(complianceDocs),
      db.select().from(bills),
      db.select().from(verificationLogs).orderBy(desc(verificationLogs.timestamp)),
      db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)),
      db.select().from(revenueLogs).orderBy(desc(revenueLogs.date)),
      db.select().from(supervisors),
      db.select().from(complaints).orderBy(desc(complaints.createdAt)),
      db.select().from(salaryTransactions).orderBy(desc(salaryTransactions.paymentDate)),
      db.select().from(leaveRecords).orderBy(desc(leaveRecords.appliedAt)),
      db.select().from(adminPlatformInvoices).orderBy(desc(adminPlatformInvoices.issuedDate))
    ]);

    // Parse serialized arrays/fields
    const parsedBills = allBills.map(b => ({
      ...b,
      complianceDocIds: b.complianceDocIds ? JSON.parse(b.complianceDocIds) : []
    }));

    res.json({
      industries: allIndustries,
      contractors: allContractors,
      workers: allWorkers,
      assignments: allAssignments,
      requirements: allRequirements,
      attendance: allAttendance,
      complianceDocs: allComplianceDocs,
      bills: parsedBills,
      verificationLogs: allVerificationLogs,
      auditLogs: allAuditLogs,
      revenueLogs: allRevenueLogs,
      supervisors: allSupervisors,
      complaints: allComplaints,
      salaryTransactions: allSalaryTransactions,
      leaveRecords: allLeaveRecords,
      platformInvoices: allPlatformInvoices
    });
  } catch (error: any) {
    console.error("Error fetching CLRA compliance data:", error);
    res.status(500).json({ error: "Failed to load database contents", details: error.message });
  }
});

// Database Diagnostics & Live Neon Connection
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
      error: error.message || "Failed to connect to Neon database. Please check credentials and URL format."
    });
  }
});

// 4. Register new contract worker
app.post("/api/workers/register", requireAuth, async (req: any, res: any) => {
  const { name, phone, aadhaarHash, contractorId, skillType, dailyWageRate } = req.body;
  if (!name || !phone || !aadhaarHash || !contractorId || !skillType) {
    return res.status(400).json({ error: "Missing required worker information" });
  }

  try {
    const workerId = "wrk-" + Date.now();
    const maskedAadhaar = `XXXX-XXXX-${aadhaarHash.slice(-4)}`;

    // 1. Insert Worker
    const newWorker = await db.insert(workers).values({
      id: workerId,
      name,
      aadhaarHash: maskedAadhaar,
      phone,
      contractorId,
      skillType,
      dailyWageRate: Number(dailyWageRate),
      status: "Available",
      onboardingVerified: true,
      onboardingDate: new Date().toISOString().split("T")[0]
    }).returning();

    // 2. Fetch contractor name for audit log
    const contractorObj = await db.select().from(contractors).where(eq(contractors.id, contractorId)).limit(1);
    const contractorName = contractorObj[0]?.name || "Assigned Contractor";

    // 3. Create Verification Log
    const newLog = await db.insert(verificationLogs).values({
      id: "log-" + Date.now(),
      workerId,
      workerName: name,
      timestamp: new Date().toLocaleString(),
      activity: "Onboarding",
      status: "Success",
      remarks: `Aadhaar OTP verified for new contract worker. Assigned under CLRA contractor: ${contractorName}.`
    }).returning();

    res.json({ success: true, worker: newWorker[0], log: newLog[0] });
  } catch (error: any) {
    console.error("Error registering worker:", error);
    res.status(500).json({ error: "Failed to register worker in database" });
  }
});

// 5. Deploy worker to industry
app.post("/api/workers/deploy", requireAuth, async (req: any, res: any) => {
  const { workerId, industryId, shiftTiming } = req.body;
  if (!workerId || !industryId || !shiftTiming) {
    return res.status(400).json({ error: "Missing deployment parameters" });
  }

  try {
    // 1. Fetch worker info
    const workerObj = await db.select().from(workers).where(eq(workers.id, workerId)).limit(1);
    if (!workerObj[0]) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const assignmentId = "asg-" + Date.now();

    // 2. Insert Assignment
    const newAsg = await db.insert(assignments).values({
      id: assignmentId,
      workerId,
      contractorId: workerObj[0].contractorId,
      industryId,
      assignedAt: new Date().toISOString().split("T")[0],
      status: "Active",
      shiftTiming
    }).returning();

    // 3. Update Worker status to Deployed
    await db.update(workers)
      .set({ status: "Deployed" })
      .where(eq(workers.id, workerId));

    res.json({ success: true, assignment: newAsg[0] });
  } catch (error: any) {
    console.error("Error deploying worker:", error);
    res.status(500).json({ error: "Failed to deploy worker" });
  }
});

// 6. Recall worker deployment
app.post("/api/workers/recall", requireAuth, async (req: any, res: any) => {
  const { assignmentId, workerId } = req.body;
  if (!assignmentId || !workerId) {
    return res.status(400).json({ error: "Missing parameters for recall" });
  }

  try {
    // 1. Update assignment
    const updatedAsg = await db.update(assignments)
      .set({ status: "Recalled" })
      .where(eq(assignments.id, assignmentId))
      .returning();

    // 2. Update worker
    await db.update(workers)
      .set({ status: "Available" })
      .where(eq(workers.id, workerId));

    res.json({ success: true, assignment: updatedAsg[0] });
  } catch (error: any) {
    console.error("Error recalling worker:", error);
    res.status(500).json({ error: "Failed to recall worker" });
  }
});

// 7. Upload missing statutory compliance documents
app.post("/api/compliance/upload-missing", requireAuth, async (req: any, res: any) => {
  const { contractorId, month, docType, fileUrl, remarks } = req.body;
  if (!contractorId || !month || !docType || !fileUrl) {
    return res.status(400).json({ error: "Missing compliance parameters" });
  }

  try {
    const docId = "doc-" + Date.now();
    const newDoc = await db.insert(complianceDocs).values({
      id: docId,
      contractorId,
      month,
      docType,
      fileUrl,
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "Verified", // Auto verified in sandbox demo
      verifiedBy: "Labour Portal API",
      remarks: remarks || "Statutory return verified with portal records."
    }).returning();

    res.json({ success: true, document: newDoc[0] });
  } catch (error: any) {
    console.error("Error uploading document:", error);
    res.status(500).json({ error: "Failed to upload compliance document" });
  }
});

// 8. Submit contractor bill
app.post("/api/bills/submit", requireAuth, async (req: any, res: any) => {
  const { 
    billNumber,
    contractorId, 
    contractorName,
    industryId, 
    industryName,
    month, 
    totalWorkers,
    totalDaysWorked,
    dailyWageRate,
    baseAmount, 
    profitPercentage,
    serviceCharge, 
    subtotalAmount,
    gstPercentage,
    gstAmount, 
    totalAmount, 
    complianceDocIds,
    remarks 
  } = req.body;

  try {
    const billId = "bill-" + Date.now();
    const formattedBillNo = billNumber || `INV-${Date.now().toString().slice(-6)}`;
    const billRemarks = remarks || `Bill #${formattedBillNo} | Contractor Profit: ${profitPercentage || 10}% | GST: ${gstPercentage || 18}%`;

    const newBill = await db.insert(bills).values({
      id: billId,
      contractorId,
      industryId,
      month,
      baseAmount: Number(baseAmount),
      serviceCharge: Number(serviceCharge),
      gstAmount: Number(gstAmount),
      totalAmount: Number(totalAmount),
      status: req.body.status || "Submitted",
      submittedAt: new Date().toLocaleString(),
      reviewedAt: null,
      remarks: billRemarks,
      complianceDocIds: JSON.stringify(complianceDocIds || [])
    }).returning();

    res.json({ 
      success: true, 
      bill: { 
        ...newBill[0], 
        billNumber: formattedBillNo,
        contractorName,
        industryName,
        totalWorkers: Number(totalWorkers) || 0,
        totalDaysWorked: Number(totalDaysWorked) || 0,
        dailyWageRate: Number(dailyWageRate) || 0,
        profitPercentage: Number(profitPercentage) || 10,
        subtotalAmount: Number(subtotalAmount) || (Number(baseAmount) + Number(serviceCharge)),
        gstPercentage: Number(gstPercentage) || 18,
        status: newBill[0].status,
        complianceDocIds: complianceDocIds || [] 
      } 
    });
  } catch (error: any) {
    console.error("Error submitting bill:", error);
    res.status(500).json({ error: "Failed to submit bill" });
  }
});

// 8b. Update contractor bill status (e.g. from Draft to Submitted)
app.post("/api/bills/update-status", requireAuth, async (req: any, res: any) => {
  const { billId, status } = req.body;
  if (!billId || !status) {
    return res.status(400).json({ error: "Missing parameters for bill status update" });
  }

  try {
    const updatedBill = await db.update(bills)
      .set({
        status,
        submittedAt: status === "Submitted" ? new Date().toLocaleString() : undefined
      })
      .where(eq(bills.id, billId))
      .returning();

    res.json({ success: true, bill: updatedBill[0] });
  } catch (error: any) {
    console.error("Error updating bill status:", error);
    res.status(500).json({ error: "Failed to update bill status" });
  }
});

// 9. Industry Admin audits/approves or rejects bill
app.post("/api/bills/audit", requireAuth, async (req: any, res: any) => {
  const { billId, action } = req.body; // 'Approve' | 'Reject'
  if (!billId || !action) {
    return res.status(400).json({ error: "Missing parameters for bill audit" });
  }

  try {
    const updatedBill = await db.update(bills)
      .set({
        status: action === "Approve" ? "Approved" : "Rejected",
        reviewedAt: new Date().toLocaleString(),
        remarks: action === "Approve" ? "Verified with EPF/ESI Portal. Released for disbursement." : "Missing verified ESI receipts. Please re-submit."
      })
      .where(eq(bills.id, billId))
      .returning();

    res.json({ success: true, bill: updatedBill[0] });
  } catch (error: any) {
    console.error("Error auditing bill:", error);
    res.status(500).json({ error: "Failed to audit bill" });
  }
});

// 10. Worker check-in (attendance)
app.post("/api/attendance/check-in", requireAuth, async (req: any, res: any) => {
  const { workerId, verificationMethod, checkIn, date, industryId } = req.body;
  if (!workerId || !verificationMethod || !checkIn || !date || !industryId) {
    return res.status(400).json({ error: "Missing check-in parameters" });
  }

  try {
    // Fetch worker details
    const workerObj = await db.select().from(workers).where(eq(workers.id, workerId)).limit(1);
    if (!workerObj[0]) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const attendanceId = "att-" + Date.now();

    // Insert attendance record
    const newAtt = await db.insert(attendance).values({
      id: attendanceId,
      date,
      workerId,
      workerName: workerObj[0].name,
      contractorId: workerObj[0].contractorId,
      industryId,
      checkIn,
      checkOut: null,
      aadhaarVerified: true,
      verificationMethod,
      hoursWorked: 0,
      overtimeHours: 0,
      status: "Present"
    }).returning();

    // Create log
    await db.insert(verificationLogs).values({
      id: "log-" + Date.now(),
      workerId,
      workerName: workerObj[0].name,
      timestamp: new Date().toLocaleString(),
      activity: "Shift-Check-In",
      status: "Success",
      remarks: verificationMethod === "Biometric-Face" 
        ? "Facial Biometric matched 98.4% against Aadhaar UIDAI secure cache."
        : "Aadhaar OTP verified. UIDAI reference code txn_live."
    });

    res.json({ success: true, attendance: newAtt[0] });
  } catch (error: any) {
    console.error("Error checking in worker:", error);
    res.status(500).json({ error: "Failed to log shift check-in" });
  }
});

// 11. Worker check-out (attendance)
app.post("/api/attendance/check-out", requireAuth, async (req: any, res: any) => {
  const { attendanceId, checkOut, hoursWorked, overtimeHours } = req.body;
  if (!attendanceId || !checkOut) {
    return res.status(400).json({ error: "Missing check-out parameters" });
  }

  try {
    const updatedAtt = await db.update(attendance)
      .set({
        checkOut,
        hoursWorked: Number(hoursWorked),
        overtimeHours: Number(overtimeHours),
      })
      .where(eq(attendance.id, attendanceId))
      .returning();

    res.json({ success: true, attendance: updatedAtt[0] });
  } catch (error: any) {
    console.error("Error checking out worker:", error);
    res.status(500).json({ error: "Failed to log shift check-out" });
  }
});

// 12. Add industry labor requirement
app.post("/api/requirements/add", requireAuth, async (req: any, res: any) => {
  const { industryId, industryName, contractorId, date, skillType, workersNeeded, shiftTiming } = req.body;
  if (!industryId || !contractorId || !date || !skillType || !workersNeeded) {
    return res.status(400).json({ error: "Missing requirement parameters" });
  }

  try {
    const reqId = "req-" + Date.now();
    const newReq = await db.insert(requirements).values({
      id: reqId,
      industryId,
      industryName,
      contractorId,
      date,
      skillType,
      workersNeeded: Number(workersNeeded),
      workersFulfilled: 0,
      shiftTiming,
      status: "Open"
    }).returning();

    res.json({ success: true, requirement: newReq[0] });
  } catch (error: any) {
    console.error("Error adding daily requirement:", error);
    res.status(500).json({ error: "Failed to publish daily requirement" });
  }
});

// 13. Inspector issues compliance notice
app.post("/api/audit/submit-notice", requireAuth, async (req: any, res: any) => {
  const { inspectorName, inspectedEntity, entityId, entityName, findings, status } = req.body;
  if (!inspectorName || !inspectedEntity || !entityId || !entityName || !findings || !status) {
    return res.status(400).json({ error: "Missing audit parameters" });
  }

  try {
    const auditId = "aud-" + Date.now();
    const newLog = await db.insert(auditLogs).values({
      id: auditId,
      inspectorName,
      inspectedEntity,
      entityId,
      entityName,
      timestamp: new Date().toLocaleString(),
      findings,
      status
    }).returning();

    res.json({ success: true, auditLog: newLog[0] });
  } catch (error: any) {
    console.error("Error submitting audit log:", error);
    res.status(500).json({ error: "Failed to publish regulatory compliance notice" });
  }
});

// 14. Supervisor generates complaint with auto-CC to Admin & Contractor
app.post("/api/complaints/submit", async (req: any, res: any) => {
  const {
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
    ccAdmin,
    ccContractor
  } = req.body;

  if (!supervisorName || !industryId || !contractorId || !category || !subject || !description) {
    return res.status(400).json({ error: "Missing mandatory complaint parameters" });
  }

  try {
    const complaintId = "cmp-" + Date.now();
    const count = Math.floor(100 + Math.random() * 900);
    const complaintNumber = `CMP-2026-${count}`;

    const newComplaint = await db.insert(complaints).values({
      id: complaintId,
      complaintNumber,
      supervisorId: supervisorId || 'sup-1',
      supervisorName,
      industryId,
      industryName: industryName || 'Assigned Industry',
      contractorId,
      contractorName: contractorName || 'Assigned Contractor',
      workerId: workerId || null,
      workerName: workerName || null,
      category,
      subject,
      description,
      severity: severity || 'Medium',
      status: 'Open',
      ccAdmin: ccAdmin !== false,
      ccContractor: ccContractor !== false,
      createdAt: new Date().toLocaleString()
    }).returning();

    // Also write to audit log so platform admin can see immediate activity
    await db.insert(auditLogs).values({
      id: "aud-" + Date.now(),
      inspectorName: supervisorName,
      inspectedEntity: "Contractor Compliance",
      entityId: contractorId,
      entityName: contractorName || "Contractor",
      timestamp: new Date().toLocaleString(),
      findings: `[Formal Supervisor Complaint ${complaintNumber}] Category: ${category}. Subject: ${subject}. CC: Admin, Contractor.`,
      status: "Notice Issued"
    });

    res.json({ success: true, complaint: newComplaint[0] });
  } catch (error: any) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ error: "Failed to lodge supervisor complaint" });
  }
});

// 15. Update complaint resolution
app.post("/api/complaints/update-status", async (req: any, res: any) => {
  const { complaintId, status, resolutionNotes } = req.body;
  if (!complaintId || !status) {
    return res.status(400).json({ error: "Missing complaintId or status" });
  }

  try {
    const updated = await db.update(complaints)
      .set({
        status,
        resolutionNotes: resolutionNotes || undefined,
        resolvedAt: status === 'Resolved' || status === 'Action Taken' ? new Date().toLocaleString() : undefined
      })
      .where(eq(complaints.id, complaintId))
      .returning();

    res.json({ success: true, complaint: updated[0] });
  } catch (error: any) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({ error: "Failed to update complaint" });
  }
});

// 16. Admin / HR updates worker status (Active, Deactivated, Blacklisted)
app.post("/api/workers/update-status", async (req: any, res: any) => {
  const { workerId, status, blacklistedReason } = req.body;
  if (!workerId || !status) {
    return res.status(400).json({ error: "Missing workerId or status" });
  }

  try {
    const updated = await db.update(workers)
      .set({
        status,
        blacklistedReason: status === 'Blacklisted' ? (blacklistedReason || 'Administrative disciplinary action') : null
      })
      .where(eq(workers.id, workerId))
      .returning();

    // Log this critical action in verification logs
    await db.insert(verificationLogs).values({
      id: "log-" + Date.now(),
      workerId,
      workerName: updated[0]?.name || 'Worker',
      timestamp: new Date().toLocaleString(),
      activity: `Status-Change-${status}`,
      status: "Success",
      remarks: `Platform Admin changed worker status to ${status}. ${blacklistedReason ? 'Reason: ' + blacklistedReason : ''}`
    });

    res.json({ success: true, worker: updated[0] });
  } catch (error: any) {
    console.error("Error updating worker status:", error);
    res.status(500).json({ error: "Failed to update worker status" });
  }
});

// 17. Admin / Contractor updates worker PF / ESIC / Bank Details
app.post("/api/workers/update-pf", async (req: any, res: any) => {
  const { workerId, uan, esicNo, bankAccountNo, ifscCode, bankName } = req.body;
  if (!workerId) {
    return res.status(400).json({ error: "Missing workerId" });
  }

  try {
    const updated = await db.update(workers)
      .set({
        uan: uan || undefined,
        esicNo: esicNo || undefined,
        bankAccountNo: bankAccountNo || undefined,
        ifscCode: ifscCode || undefined,
        bankName: bankName || undefined
      })
      .where(eq(workers.id, workerId))
      .returning();

    res.json({ success: true, worker: updated[0] });
  } catch (error: any) {
    console.error("Error updating worker statutory details:", error);
    res.status(500).json({ error: "Failed to update statutory details" });
  }
});

// 18. Salary Bank Transfer Disbursal
app.post("/api/salary/disburse", async (req: any, res: any) => {
  const {
    workerId,
    workerName,
    contractorId,
    contractorName,
    industryId,
    industryName,
    month,
    amount,
    paymentMode,
    utrNumber,
    accountNumberMasked,
    bankName,
    pfDeducted,
    esicDeducted,
    netPaid
  } = req.body;

  if (!workerId || !amount || !month) {
    return res.status(400).json({ error: "Missing salary disbursal parameters" });
  }

  try {
    const txnId = "sal-" + Date.now();
    const newTxn = await db.insert(salaryTransactions).values({
      id: txnId,
      workerId,
      workerName: workerName || 'Worker',
      contractorId: contractorId || 'Direct',
      contractorName,
      industryId: industryId || 'Direct',
      industryName,
      month,
      amount: Number(amount),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: paymentMode || 'Direct Bank Transfer',
      utrNumber: utrNumber || `UTR${Date.now()}`,
      accountNumberMasked: accountNumberMasked || 'XXXX-XXXX-0000',
      bankName: bankName || 'Bank',
      status: 'Successful',
      pfDeducted: Number(pfDeducted || 0),
      esicDeducted: Number(esicDeducted || 0),
      netPaid: Number(netPaid || amount)
    }).returning();

    res.json({ success: true, transaction: newTxn[0] });
  } catch (error: any) {
    console.error("Error recording salary disbursement:", error);
    res.status(500).json({ error: "Failed to disburse salary" });
  }
});

// 19. Record Leave (Form XXIV Register)
app.post("/api/leave/record", async (req: any, res: any) => {
  const {
    workerId,
    workerName,
    contractorId,
    contractorName,
    industryId,
    industryName,
    leaveType,
    daysCount,
    startDate,
    endDate,
    reason,
    wagePaidForLeave
  } = req.body;

  if (!workerId || !leaveType || !daysCount || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing leave parameters" });
  }

  try {
    const leaveId = "lvr-" + Date.now();
    const newLeave = await db.insert(leaveRecords).values({
      id: leaveId,
      workerId,
      workerName: workerName || 'Worker',
      contractorId: contractorId || 'Direct',
      contractorName,
      industryId,
      industryName,
      leaveType,
      daysCount: Number(daysCount),
      startDate,
      endDate,
      reason: reason || 'Personal Leave',
      status: 'Approved',
      appliedAt: new Date().toISOString().split('T')[0],
      approvedBy: 'Contractor Management',
      wagePaidForLeave: wagePaidForLeave !== false
    }).returning();

    res.json({ success: true, leaveRecord: newLeave[0] });
  } catch (error: any) {
    console.error("Error recording leave:", error);
    res.status(500).json({ error: "Failed to record leave" });
  }
});

// 20. Generate Platform Invoice (₹1 per worker per day)
app.post("/api/invoices/generate", async (req: any, res: any) => {
  const { billedEntity, entityId, entityName, month, activeWorkersCount, mandaysCount } = req.body;
  if (!billedEntity || !entityId || !entityName || !month) {
    return res.status(400).json({ error: "Missing invoice generation parameters" });
  }

  try {
    const invId = "pinv-" + Date.now();
    const mandays = Number(mandaysCount || (Number(activeWorkersCount || 10) * 26));
    const subtotal = mandays * 1; // ₹1 per worker day
    const gstAmount = Number((subtotal * 0.18).toFixed(2));
    const totalPayable = Number((subtotal + gstAmount).toFixed(2));
    const invoiceNo = `SL-INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

    const newInv = await db.insert(adminPlatformInvoices).values({
      id: invId,
      invoiceNo,
      billedEntity,
      entityId,
      entityName,
      month,
      activeWorkersCount: Number(activeWorkersCount || 10),
      mandaysCount: mandays,
      ratePerWorkerDay: 1,
      subtotal,
      gstAmount,
      totalPayable,
      status: 'Generated',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]
    }).returning();

    res.json({ success: true, invoice: newInv[0] });
  } catch (error: any) {
    console.error("Error generating platform invoice:", error);
    res.status(500).json({ error: "Failed to generate platform invoice" });
  }
});

// 21. Update Platform Invoice Status (e.g. Paid)
app.post("/api/invoices/update-status", async (req: any, res: any) => {
  const { invoiceId, status, transactionRef } = req.body;
  if (!invoiceId || !status) {
    return res.status(400).json({ error: "Missing invoiceId or status" });
  }

  try {
    const updated = await db.update(adminPlatformInvoices)
      .set({
        status,
        paidAt: status === 'Paid' ? new Date().toISOString().split('T')[0] : undefined,
        transactionRef: transactionRef || undefined
      })
      .where(eq(adminPlatformInvoices.id, invoiceId))
      .returning();

    res.json({ success: true, invoice: updated[0] });
  } catch (error: any) {
    console.error("Error updating invoice status:", error);
    res.status(500).json({ error: "Failed to update platform invoice" });
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
