import { 
  Industry, 
  Contractor, 
  Worker, 
  MultiIndustryAssignment, 
  DailyRequirement, 
  Attendance, 
  ComplianceDocument, 
  Bill, 
  AadhaarVerificationLog, 
  GovernmentAuditLog, 
  RevenueLog,
  GovernmentLaborInspector,
  IndustryContractorConnection,
  WorkerAgencyConnection,
  SalaryTransaction,
  SupervisorComplaint,
  LeaveRecord,
  AdminPlatformInvoice
} from './types';

// =======================================================================
// PRODUCTION LIVE DATABASE SEEDS (Zero Demo / Mock Data)
// All entities are self-registered by genuine stakeholders on ShramikLink
// =======================================================================

export const initialIndustries: Industry[] = [];

export const initialContractors: Contractor[] = [];

export const initialWorkers: Worker[] = [];

export const initialAssignments: MultiIndustryAssignment[] = [];

export const initialRequirements: DailyRequirement[] = [];

export const initialAttendance: Attendance[] = [];

export const initialComplianceDocs: ComplianceDocument[] = [];

export const initialBills: Bill[] = [];

export const initialVerificationLogs: AadhaarVerificationLog[] = [];

export const initialAuditLogs: GovernmentAuditLog[] = [];

export const initialRevenueLogs: RevenueLog[] = [];

export const initialInspectors: GovernmentLaborInspector[] = [];

export const initialIndustryContractorConnections: IndustryContractorConnection[] = [];

export const initialWorkerAgencyConnections: WorkerAgencyConnection[] = [];

export const initialSalaryTransactions: SalaryTransaction[] = [];

export const initialComplaints: SupervisorComplaint[] = [];

export const initialLeaveRecords: LeaveRecord[] = [];

export const initialPlatformInvoices: AdminPlatformInvoice[] = [];
