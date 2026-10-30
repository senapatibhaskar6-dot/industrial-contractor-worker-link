import { pgTable, serial, text, timestamp, boolean, integer, real } from 'drizzle-orm/pg-core';

// Define the 'users' table mapped to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  role: text('role').notNull(), // 'industry_admin' | 'contractor' | 'worker' | 'government_inspector'
  createdAt: timestamp('created_at').defaultNow(),
});

// Define IndustrialContractorWorkerLink (ICWL) compliance tables
export const industries = pgTable('industries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  regNo: text('reg_no').notNull(),
  lin: text('lin').notNull(),
  contactEmail: text('contact_email').notNull(),
});

export const contractors = pgTable('contractors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  licenseNo: text('license_no').notNull(),
  lin: text('lin').notNull(),
  pan: text('pan').notNull(),
  epfCode: text('epf_code').notNull(),
  esiCode: text('esi_code').notNull(),
  contactNo: text('contact_no').notNull(),
  rating: real('rating').notNull().default(5),
});

export const workers = pgTable('workers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  aadhaarHash: text('aadhaar_hash').notNull(),
  phone: text('phone').notNull(),
  contractorId: text('contractor_id').notNull(),
  skillType: text('skill_type').notNull(),
  dailyWageRate: integer('daily_wage_rate').notNull(),
  status: text('status').notNull(),
  uan: text('uan'),
  esicNo: text('esic_no'),
  bankAccountNo: text('bank_account_no'),
  ifscCode: text('ifsc_code'),
  bankName: text('bank_name'),
  blacklistedReason: text('blacklisted_reason'),
  onboardingVerified: boolean('onboarding_verified').notNull().default(false),
  onboardingDate: text('onboarding_date').notNull(),
});

export const assignments = pgTable('assignments', {
  id: text('id').primaryKey(),
  workerId: text('worker_id').notNull(),
  contractorId: text('contractor_id').notNull(),
  industryId: text('industry_id').notNull(),
  assignedAt: text('assigned_at').notNull(),
  status: text('status').notNull(),
  shiftTiming: text('shift_timing').notNull(),
});

export const requirements = pgTable('requirements', {
  id: text('id').primaryKey(),
  industryId: text('industry_id').notNull(),
  industryName: text('industry_name').notNull(),
  contractorId: text('contractor_id').notNull(),
  date: text('date').notNull(),
  skillType: text('skill_type').notNull(),
  workersNeeded: integer('workers_needed').notNull(),
  workersFulfilled: integer('workers_fulfilled').notNull().default(0),
  shiftTiming: text('shift_timing').notNull(),
  status: text('status').notNull(),
});

export const attendance = pgTable('attendance', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  workerId: text('worker_id').notNull(),
  workerName: text('worker_name').notNull(),
  contractorId: text('contractor_id').notNull(),
  industryId: text('industry_id').notNull(),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out'),
  aadhaarVerified: boolean('aadhaar_verified').notNull().default(false),
  verificationMethod: text('verification_method').notNull(),
  hoursWorked: real('hours_worked').notNull().default(0),
  overtimeHours: real('overtime_hours').notNull().default(0),
  status: text('status').notNull(),
});

export const complianceDocs = pgTable('compliance_docs', {
  id: text('id').primaryKey(),
  contractorId: text('contractor_id').notNull(),
  month: text('month').notNull(),
  docType: text('doc_type').notNull(),
  fileUrl: text('file_url').notNull(),
  uploadedAt: text('uploaded_at').notNull(),
  status: text('status').notNull(),
  verifiedBy: text('verified_by'),
  remarks: text('remarks'),
});

export const bills = pgTable('bills', {
  id: text('id').primaryKey(),
  contractorId: text('contractor_id').notNull(),
  industryId: text('industry_id').notNull(),
  month: text('month').notNull(),
  baseAmount: real('base_amount').notNull(),
  serviceCharge: real('service_charge').notNull(),
  gstAmount: real('gst_amount').notNull(),
  totalAmount: real('total_amount').notNull(),
  status: text('status').notNull(),
  submittedAt: text('submitted_at'),
  reviewedAt: text('reviewed_at'),
  remarks: text('remarks'),
  complianceDocIds: text('compliance_doc_ids'), // serialized as JSON array
});

export const verificationLogs = pgTable('verification_logs', {
  id: text('id').primaryKey(),
  workerId: text('worker_id').notNull(),
  workerName: text('worker_name').notNull(),
  timestamp: text('timestamp').notNull(),
  activity: text('activity').notNull(),
  status: text('status').notNull(),
  remarks: text('remarks').notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  inspectorName: text('inspector_name').notNull(),
  inspectedEntity: text('inspected_entity').notNull(),
  entityId: text('entity_id').notNull(),
  entityName: text('entity_name').notNull(),
  timestamp: text('timestamp').notNull(),
  findings: text('findings').notNull(),
  status: text('status').notNull(),
});

export const revenueLogs = pgTable('revenue_logs', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  workerCount: integer('worker_count').notNull(),
  feeAmount: integer('fee_amount').notNull(),
  status: text('status').notNull(),
});

export const supervisors = pgTable('supervisors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  supervisorType: text('supervisor_type').notNull().default('industry'),
  contractorId: text('contractor_id'),
  industryId: text('industry_id').notNull(),
  department: text('department').notNull(),
  active: boolean('active').notNull().default(true),
  assignedContractorIds: text('assigned_contractor_ids'), // JSON string array
  createdAt: text('created_at').notNull(),
});

export const complaints = pgTable('complaints', {
  id: text('id').primaryKey(),
  complaintNumber: text('complaint_number').notNull(),
  supervisorId: text('supervisor_id').notNull(),
  supervisorName: text('supervisor_name').notNull(),
  industryId: text('industry_id').notNull(),
  industryName: text('industry_name').notNull(),
  contractorId: text('contractor_id').notNull(),
  contractorName: text('contractor_name').notNull(),
  workerId: text('worker_id'),
  workerName: text('worker_name'),
  category: text('category').notNull(),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  severity: text('severity').notNull().default('Medium'),
  status: text('status').notNull().default('Open'),
  ccAdmin: boolean('cc_admin').notNull().default(true),
  ccContractor: boolean('cc_contractor').notNull().default(true),
  createdAt: text('created_at').notNull(),
  resolutionNotes: text('resolution_notes'),
  resolvedAt: text('resolved_at'),
});

export const salaryTransactions = pgTable('salary_transactions', {
  id: text('id').primaryKey(),
  workerId: text('worker_id').notNull(),
  workerName: text('worker_name').notNull(),
  contractorId: text('contractor_id').notNull(),
  contractorName: text('contractor_name'),
  industryId: text('industry_id').notNull(),
  industryName: text('industry_name'),
  month: text('month').notNull(),
  amount: real('amount').notNull(),
  paymentDate: text('payment_date').notNull(),
  paymentMode: text('payment_mode').notNull(),
  utrNumber: text('utr_number').notNull(),
  accountNumberMasked: text('account_number_masked').notNull(),
  bankName: text('bank_name').notNull(),
  status: text('status').notNull().default('Successful'),
  pfDeducted: real('pf_deducted').default(0),
  esicDeducted: real('esic_deducted').default(0),
  netPaid: real('net_paid').notNull(),
});

export const leaveRecords = pgTable('leave_records', {
  id: text('id').primaryKey(),
  workerId: text('worker_id').notNull(),
  workerName: text('worker_name').notNull(),
  contractorId: text('contractor_id').notNull(),
  contractorName: text('contractor_name'),
  industryId: text('industry_id'),
  industryName: text('industry_name'),
  leaveType: text('leave_type').notNull(),
  daysCount: integer('days_count').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('Approved'),
  appliedAt: text('applied_at').notNull(),
  approvedBy: text('approved_by'),
  wagePaidForLeave: boolean('wage_paid_for_leave').notNull().default(true),
});

export const adminPlatformInvoices = pgTable('admin_platform_invoices', {
  id: text('id').primaryKey(),
  invoiceNo: text('invoice_no').notNull(),
  billedEntity: text('billed_entity').notNull(),
  entityId: text('entity_id').notNull(),
  entityName: text('entity_name').notNull(),
  month: text('month').notNull(),
  activeWorkersCount: integer('active_workers_count').notNull(),
  mandaysCount: integer('mandays_count').notNull(),
  ratePerWorkerDay: real('rate_per_worker_day').notNull().default(1),
  subtotal: real('subtotal').notNull(),
  gstAmount: real('gst_amount').notNull(),
  totalPayable: real('total_payable').notNull(),
  status: text('status').notNull().default('Generated'),
  issuedDate: text('issued_date').notNull(),
  dueDate: text('due_date').notNull(),
  paidAt: text('paid_at'),
  transactionRef: text('transaction_ref'),
});

