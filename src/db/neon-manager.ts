import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import {
  initialIndustries,
  initialContractors,
  initialWorkers,
  initialAssignments,
  initialRequirements,
  initialAttendance,
  initialComplianceDocs,
  initialBills,
  initialVerificationLogs,
  initialAuditLogs,
  initialRevenueLogs,
  initialComplaints,
  initialSalaryTransactions,
  initialLeaveRecords,
  initialPlatformInvoices
} from '../mockData.ts';

const CONFIG_PATH = path.join(process.cwd(), '.neon_config.json');

export const DDL_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uid TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`,

  `CREATE TABLE IF NOT EXISTS industries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    reg_no TEXT NOT NULL,
    lin TEXT NOT NULL,
    contact_email TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS contractors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    license_no TEXT NOT NULL,
    lin TEXT NOT NULL,
    pan TEXT NOT NULL,
    epf_code TEXT NOT NULL,
    esi_code TEXT NOT NULL,
    contact_no TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 5
  );`,

  `CREATE TABLE IF NOT EXISTS workers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    aadhaar_hash TEXT NOT NULL,
    phone TEXT NOT NULL,
    contractor_id TEXT NOT NULL,
    skill_type TEXT NOT NULL,
    daily_wage_rate INTEGER NOT NULL,
    status TEXT NOT NULL,
    uan TEXT,
    esic_no TEXT,
    bank_account_no TEXT,
    ifsc_code TEXT,
    bank_name TEXT,
    blacklisted_reason TEXT,
    onboarding_verified BOOLEAN NOT NULL DEFAULT false,
    onboarding_date TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    worker_id TEXT NOT NULL,
    contractor_id TEXT NOT NULL,
    industry_id TEXT NOT NULL,
    assigned_at TEXT NOT NULL,
    status TEXT NOT NULL,
    shift_timing TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS requirements (
    id TEXT PRIMARY KEY,
    industry_id TEXT NOT NULL,
    industry_name TEXT NOT NULL,
    contractor_id TEXT NOT NULL,
    date TEXT NOT NULL,
    skill_type TEXT NOT NULL,
    workers_needed INTEGER NOT NULL,
    workers_fulfilled INTEGER NOT NULL DEFAULT 0,
    shift_timing TEXT NOT NULL,
    status TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    worker_id TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    contractor_id TEXT NOT NULL,
    industry_id TEXT NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT,
    aadhaar_verified BOOLEAN NOT NULL DEFAULT false,
    verification_method TEXT NOT NULL,
    hours_worked REAL NOT NULL DEFAULT 0,
    overtime_hours REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS compliance_docs (
    id TEXT PRIMARY KEY,
    contractor_id TEXT NOT NULL,
    month TEXT NOT NULL,
    doc_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TEXT NOT NULL,
    status TEXT NOT NULL,
    verified_by TEXT,
    remarks TEXT
  );`,

  `CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY,
    contractor_id TEXT NOT NULL,
    industry_id TEXT NOT NULL,
    month TEXT NOT NULL,
    base_amount REAL NOT NULL,
    service_charge REAL NOT NULL,
    gst_amount REAL NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT NOT NULL,
    submitted_at TEXT,
    reviewed_at TEXT,
    remarks TEXT,
    compliance_doc_ids TEXT
  );`,

  `CREATE TABLE IF NOT EXISTS verification_logs (
    id TEXT PRIMARY KEY,
    worker_id TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    activity TEXT NOT NULL,
    status TEXT NOT NULL,
    remarks TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    inspector_name TEXT NOT NULL,
    inspected_entity TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    findings TEXT NOT NULL,
    status TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS revenue_logs (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    worker_count INTEGER NOT NULL,
    fee_amount INTEGER NOT NULL,
    status TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS supervisors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    supervisor_type TEXT NOT NULL DEFAULT 'industry',
    contractor_id TEXT,
    industry_id TEXT NOT NULL,
    department TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    assigned_contractor_ids TEXT,
    created_at TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY,
    complaint_number TEXT NOT NULL,
    supervisor_id TEXT NOT NULL,
    supervisor_name TEXT NOT NULL,
    industry_id TEXT NOT NULL,
    industry_name TEXT NOT NULL,
    contractor_id TEXT NOT NULL,
    contractor_name TEXT NOT NULL,
    worker_id TEXT,
    worker_name TEXT,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'Medium',
    status TEXT NOT NULL DEFAULT 'Open',
    cc_admin BOOLEAN NOT NULL DEFAULT true,
    cc_contractor BOOLEAN NOT NULL DEFAULT true,
    created_at TEXT NOT NULL,
    resolution_notes TEXT,
    resolved_at TEXT
  );`,

  `CREATE TABLE IF NOT EXISTS salary_transactions (
    id TEXT PRIMARY KEY,
    worker_id TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    contractor_id TEXT NOT NULL,
    contractor_name TEXT,
    industry_id TEXT NOT NULL,
    industry_name TEXT,
    month TEXT NOT NULL,
    amount REAL NOT NULL,
    payment_date TEXT NOT NULL,
    payment_mode TEXT NOT NULL,
    utr_number TEXT NOT NULL,
    account_number_masked TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Successful',
    pf_deducted REAL DEFAULT 0,
    esic_deducted REAL DEFAULT 0,
    net_paid REAL NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS leave_records (
    id TEXT PRIMARY KEY,
    worker_id TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    contractor_id TEXT NOT NULL,
    contractor_name TEXT,
    industry_id TEXT,
    industry_name TEXT,
    leave_type TEXT NOT NULL,
    days_count INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Approved',
    applied_at TEXT NOT NULL,
    approved_by TEXT,
    wage_paid_for_leave BOOLEAN NOT NULL DEFAULT true
  );`,

  `CREATE TABLE IF NOT EXISTS admin_platform_invoices (
    id TEXT PRIMARY KEY,
    invoice_no TEXT NOT NULL,
    billed_entity TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    month TEXT NOT NULL,
    active_workers_count INTEGER NOT NULL,
    mandays_count INTEGER NOT NULL,
    rate_per_worker_day REAL NOT NULL DEFAULT 1,
    subtotal REAL NOT NULL,
    gst_amount REAL NOT NULL,
    total_payable REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Generated',
    issued_date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    paid_at TEXT,
    transaction_ref TEXT
  );`
];

export async function createAllTables(client: any) {
  for (const ddl of DDL_STATEMENTS) {
    await client.query(ddl);
  }
}

export function getStoredNeonUrl(): string | null {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      if (data && data.neonUrl) {
        return data.neonUrl;
      }
    }
  } catch (err) {
    console.warn('Error reading neon config:', err);
  }
  return process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || null;
}

export function saveNeonUrl(url: string) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ neonUrl: url, updatedAt: new Date().toISOString() }, null, 2));
  } catch (err) {
    console.warn('Error saving neon config:', err);
  }
}

export async function seedTablesIfEmpty(client: any) {
  // Seed Industries
  const indRes = await client.query('SELECT COUNT(*) FROM industries');
  if (parseInt(indRes.rows[0].count) === 0) {
    for (const ind of initialIndustries) {
      await client.query(
        'INSERT INTO industries (id, name, location, reg_no, lin, contact_email) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
        [ind.id, ind.name, ind.location, ind.regNo, ind.lin, ind.contactEmail]
      );
    }
  }

  // Seed Contractors
  const conRes = await client.query('SELECT COUNT(*) FROM contractors');
  if (parseInt(conRes.rows[0].count) === 0) {
    for (const con of initialContractors) {
      await client.query(
        'INSERT INTO contractors (id, name, license_no, lin, pan, epf_code, esi_code, contact_no, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING',
        [con.id, con.name, con.licenseNo, con.lin, con.pan, con.epfCode, con.esiCode, con.contactNo, con.rating]
      );
    }
  }

  // Seed Workers
  const wrkRes = await client.query('SELECT COUNT(*) FROM workers');
  if (parseInt(wrkRes.rows[0].count) === 0) {
    for (const wrk of initialWorkers) {
      await client.query(
        `INSERT INTO workers (
          id, name, aadhaar_hash, phone, contractor_id, skill_type, daily_wage_rate,
          status, uan, esic_no, bank_account_no, ifsc_code, bank_name,
          blacklisted_reason, onboarding_verified, onboarding_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) ON CONFLICT (id) DO NOTHING`,
        [
          wrk.id, wrk.name, wrk.aadhaarHash, wrk.phone, wrk.contractorId, wrk.skillType, wrk.dailyWageRate,
          wrk.status, wrk.uan || null, wrk.esicNo || null, wrk.bankAccountNo || null, wrk.ifscCode || null, wrk.bankName || null,
          wrk.blacklistedReason || null, wrk.onboardingVerified || false, wrk.onboardingDate
        ]
      );
    }
  }

  // Seed Requirements
  const reqRes = await client.query('SELECT COUNT(*) FROM requirements');
  if (parseInt(reqRes.rows[0].count) === 0) {
    for (const req of initialRequirements) {
      await client.query(
        'INSERT INTO requirements (id, industry_id, industry_name, contractor_id, date, skill_type, workers_needed, workers_fulfilled, shift_timing, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING',
        [req.id, req.industryId, req.industryName, req.contractorId, req.date, req.skillType, req.workersNeeded, req.workersFulfilled || 0, req.shiftTiming, req.status]
      );
    }
  }

  // Seed Attendance
  const attRes = await client.query('SELECT COUNT(*) FROM attendance');
  if (parseInt(attRes.rows[0].count) === 0) {
    for (const att of initialAttendance) {
      await client.query(
        'INSERT INTO attendance (id, date, worker_id, worker_name, contractor_id, industry_id, check_in, check_out, aadhaar_verified, verification_method, hours_worked, overtime_hours, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (id) DO NOTHING',
        [att.id, att.date, att.workerId, att.workerName, att.contractorId, att.industryId, att.checkIn, att.checkOut || null, att.aadhaarVerified || false, att.verificationMethod, att.hoursWorked || 0, att.overtimeHours || 0, att.status]
      );
    }
  }

  // Seed Bills
  const billRes = await client.query('SELECT COUNT(*) FROM bills');
  if (parseInt(billRes.rows[0].count) === 0) {
    for (const b of initialBills) {
      await client.query(
        'INSERT INTO bills (id, contractor_id, industry_id, month, base_amount, service_charge, gst_amount, total_amount, status, submitted_at, reviewed_at, remarks, compliance_doc_ids) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (id) DO NOTHING',
        [b.id, b.contractorId, b.industryId, b.month, b.baseAmount, b.serviceCharge, b.gstAmount, b.totalAmount, b.status, b.submittedAt || null, b.reviewedAt || null, b.remarks || null, JSON.stringify(b.complianceDocIds || [])]
      );
    }
  }

  // Seed Invoices
  const invRes = await client.query('SELECT COUNT(*) FROM admin_platform_invoices');
  if (parseInt(invRes.rows[0].count) === 0) {
    for (const inv of initialPlatformInvoices) {
      await client.query(
        `INSERT INTO admin_platform_invoices (
          id, invoice_no, billed_entity, entity_id, entity_name, month,
          active_workers_count, mandays_count, rate_per_worker_day, subtotal,
          gst_amount, total_payable, status, issued_date, due_date, paid_at, transaction_ref
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) ON CONFLICT (id) DO NOTHING`,
        [
          inv.id, inv.invoiceNo, inv.billedEntity, inv.entityId, inv.entityName, inv.month,
          inv.activeWorkersCount, inv.mandaysCount, inv.ratePerWorkerDay || 1, inv.subtotal,
          inv.gstAmount, inv.totalPayable, inv.status || 'Generated', inv.issuedDate, inv.dueDate,
          inv.paidAt || null, inv.transactionRef || null
        ]
      );
    }
  }
}
