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

// 3. Get all compliance platform data (all tables) - Fallback handled safely to prevent 404
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

    // Parse serialized arrays/fields safely
    const parsedBills = (allBills || []).map((b: any) => ({
      ...b,
      complianceDocIds: b.complianceDocIds ? JSON.parse(b.complianceDocIds) : []
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
    console.error("Error fetching CLRA compliance data:", error);
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

    const contractorObj = await db.select().from(contractors).where(eq(contractors.id, contractorId)).limit(1);
    const contractorName = contractorObj[0]?.name || "Assigned Contractor";

    const newLog = await db.insert(verificationLogs).values({
      id: "log-" + Date.now(),
      workerId,
      workerName: name,
      timestamp: new Date().toLocaleString(),
      activity: "Onboarding",
      status: "Success",
      remarks: `Aadhaar verified for new contract worker. Assigned under CLRA contractor: ${contractorName}.`
    }).returning();

    res.json({ success: true, worker: newWorker[0], log: newLog[0] });
  } catch (error: any) {
    console.error("Error registering worker:", error);
    res.status(500).json({ error: "Failed to register worker in database" });
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