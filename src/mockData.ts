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

export const initialIndustries: Industry[] = [
  {
    id: 'ind-1',
    name: 'Brahmaputra Petrochemicals Complex (BCPL)',
    location: 'Lepetkata, Dibrugarh, Assam',
    regNo: 'AS/DIB/892/F-LIC',
    lin: '1982738920',
    contactEmail: 'admin.dibrugarh@bcpl-assam.in',
    category: 'Industry HR'
  },
  {
    id: 'ind-2',
    name: 'Numaligarh Refinery Industrial Unit',
    location: 'Golaghat, Assam',
    regNo: 'AS/GOL/734/F-LIC',
    lin: '1029384758',
    contactEmail: 'compliance@nrl-assam.in',
    category: 'Industry HR'
  },
  {
    id: 'ind-3',
    name: 'Guwahati Premier Industrial Manufacturing Estate',
    location: 'Amingaon Industrial Area, Guwahati, Assam',
    regNo: 'AS/KAM/219/F-LIC',
    lin: '1847293849',
    contactEmail: 'hr@guwahati-manufacturing.in',
    category: 'Industry HR'
  },
  {
    id: 'ind-apt-1',
    name: 'Greenwood Heights Residential Society',
    location: 'Guwahati, Assam',
    regNo: 'AS/GH-APT/412/SOC',
    lin: '1948201948',
    contactEmail: 'society.president@greenwoodheights.org',
    category: 'Apartment Owner'
  },
  {
    id: 'ind-apt-2',
    name: 'Royal Palms Luxury Towers RWA',
    location: 'Khanapara, Guwahati',
    regNo: 'AS/KAM-APT/884/RWA',
    lin: '1849204918',
    contactEmail: 'management@royalpalmstowers.in',
    category: 'Apartment Owner'
  },
  {
    id: 'ind-shop-1',
    name: 'Mega Mart Supermarket & Retail Hub',
    location: 'GS Road, Guwahati, Assam',
    regNo: 'AS/GHY/SHOP/2024/918',
    lin: '1628394819',
    contactEmail: 'operations@megamartassam.com',
    category: 'Shop Owner'
  },
  {
    id: 'ind-shop-2',
    name: 'Assam Silk & Handicrafts Emporium',
    location: 'Panbazar, Guwahati',
    regNo: 'AS/KAM/SHOP/2023/455',
    lin: '1538294710',
    contactEmail: 'contact@assamsilkemporium.in',
    category: 'Shop Owner'
  },
  {
    id: 'ind-off-1',
    name: 'Zenith Infotech Corporate Office',
    location: 'VIP Road, Guwahati, Assam',
    regNo: 'AS/ESTAB/2024/OFF-31',
    lin: '1948205930',
    contactEmail: 'admin.northeast@zenithtech.in',
    category: 'Office'
  },
  {
    id: 'ind-off-2',
    name: 'Axis Commercial Center & Admin Complex',
    location: 'Dispur, Guwahati',
    regNo: 'AS/ESTAB/2023/OFF-88',
    lin: '1839204812',
    contactEmail: 'facilities@axiscenter.co.in',
    category: 'Office'
  }
];

export const initialContractors: Contractor[] = [
  {
    id: 'con-1',
    name: 'Pragjyotish Industrial Manpower Solutions',
    licenseNo: 'AS-GHY-CLRA-2026-902',
    lin: 'L-1293840291',
    pan: 'AAACA1029K',
    epfCode: 'AS/GHY/4567A/002',
    esiCode: '43-8973-102-1001',
    contactNo: '+91 98223 11045',
    rating: 4.8,
    contractorType: 'Labour Contractor'
  },
  {
    id: 'con-2',
    name: 'Jai Hind Security & Protection Agency',
    licenseNo: 'PSARA/AS/2023/SEC-412',
    lin: 'L-1029384812',
    pan: 'AAACJ7732L',
    epfCode: 'AS/GHY/8821B/005',
    esiCode: '43-4432-801-2002',
    contactNo: '+91 99304 55321',
    rating: 4.6,
    contractorType: 'Security Agency'
  },
  {
    id: 'con-3',
    name: 'Kaziranga Allied Manpower Services',
    licenseNo: 'AS-GHY-CLRA-2026-502',
    lin: 'L-1847293021',
    pan: 'AAACS4412M',
    epfCode: 'AS/GHY/9012C/001',
    esiCode: '43-4029-202-3003',
    contactNo: '+91 91580 88219',
    rating: 4.2,
    contractorType: 'Labour Contractor'
  },
  {
    id: 'con-4',
    name: 'Brahmaputra Manpower & Labour Supply',
    licenseNo: 'AS-GHY-CLRA-2024-819',
    lin: 'L-1928374829',
    pan: 'AAACB9921D',
    epfCode: 'AS/GHY/1928A/001',
    esiCode: '43-8921-201-1002',
    contactNo: '+91 94350 22345',
    rating: 4.7,
    contractorType: 'Labour Contractor'
  },
  {
    id: 'con-5',
    name: 'Garuda Vigilance & Security Services',
    licenseNo: 'PSARA/AS/2024/SEC-998',
    lin: 'L-1849201948',
    pan: 'AAACG4419E',
    epfCode: 'AS/GHY/5541C/002',
    esiCode: '43-5591-402-3001',
    contactNo: '+91 98640 77123',
    rating: 4.9,
    contractorType: 'Security Agency'
  }
];

export const initialWorkers: Worker[] = [
  { 
    id: 'wrk-1', 
    platformId: 'SL-WRK-1001', 
    name: 'Rakesh Kumar Yadav', 
    aadhaarHash: 'XXXX-XXXX-8920', 
    phone: '9876543210', 
    contractorId: 'con-1', 
    skillType: 'Unskilled', 
    workerType: 'Unskilled-Laborer', 
    dailyWageRate: 480, 
    status: 'Deployed', 
    uan: '101298492019',
    esicNo: '319201849201',
    bankAccountNo: '918204928192',
    ifscCode: 'SBIN0001829',
    bankName: 'State Bank of India',
    onboardingVerified: true, 
    onboardingDate: '2026-01-10' 
  },
  { 
    id: 'wrk-2', 
    platformId: 'SL-WRK-1002', 
    name: 'Vikram Singh Shekhawat', 
    aadhaarHash: 'XXXX-XXXX-4531', 
    phone: '9823456789', 
    contractorId: 'con-1', 
    skillType: 'Unskilled', 
    workerType: 'Unskilled-Laborer', 
    dailyWageRate: 480, 
    status: 'Deployed', 
    uan: '101482910482',
    esicNo: '318294719284',
    bankAccountNo: '501004829104',
    ifscCode: 'HDFC0000240',
    bankName: 'HDFC Bank',
    onboardingVerified: true, 
    onboardingDate: '2026-01-12' 
  },
  { 
    id: 'wrk-3', 
    platformId: 'SL-WRK-1003', 
    name: 'Anil S. Patil', 
    aadhaarHash: 'XXXX-XXXX-1029', 
    phone: '9422019283', 
    contractorId: 'con-1', 
    skillType: 'Unskilled', 
    workerType: 'Unskilled-Laborer', 
    dailyWageRate: 480, 
    status: 'Deployed', 
    uan: '101928374920',
    esicNo: '317492819384',
    bankAccountNo: '304928109284',
    ifscCode: 'PUNB0182900',
    bankName: 'Punjab National Bank',
    onboardingVerified: true, 
    onboardingDate: '2026-02-15' 
  },
  { 
    id: 'wrk-4', 
    platformId: 'SL-WRK-1004', 
    name: 'Sunita Devi', 
    aadhaarHash: 'XXXX-XXXX-9382', 
    phone: '9112233445', 
    contractorId: 'direct', 
    skillType: 'Unskilled', 
    workerType: 'Unskilled-Laborer', 
    dailyWageRate: 480, 
    status: 'Available', 
    uan: '101839201948',
    esicNo: '316294829104',
    bankAccountNo: '201948201948',
    ifscCode: 'BKID0004910',
    bankName: 'Bank of India',
    onboardingVerified: true, 
    onboardingDate: '2026-03-01' 
  },
  { 
    id: 'wrk-5', 
    platformId: 'SL-WRK-1005', 
    name: 'Ramesh Sawant', 
    aadhaarHash: 'XXXX-XXXX-7721', 
    phone: '9552103948', 
    contractorId: 'direct', 
    skillType: 'Unskilled', 
    workerType: 'Unskilled-Laborer', 
    dailyWageRate: 480, 
    status: 'Available', 
    uan: '101748291048',
    esicNo: '315392819482',
    bankAccountNo: '601948291048',
    ifscCode: 'BARB0VISHAL',
    bankName: 'Bank of Baroda',
    onboardingVerified: true, 
    onboardingDate: '2026-03-20' 
  },
  { 
    id: 'wrk-6', 
    platformId: 'SL-WRK-1006', 
    name: 'Pappu Yadav', 
    aadhaarHash: 'XXXX-XXXX-3829', 
    phone: '9890210293', 
    contractorId: 'con-2', 
    skillType: 'Unskilled', 
    workerType: 'Security-Guard', 
    dailyWageRate: 480, 
    status: 'Deployed', 
    uan: '101648291029',
    esicNo: '314829104829',
    bankAccountNo: '901928491029',
    ifscCode: 'CNRB0002819',
    bankName: 'Canara Bank',
    onboardingVerified: true, 
    onboardingDate: '2026-02-10' 
  },
  { 
    id: 'wrk-7', 
    platformId: 'SL-WRK-1007', 
    name: 'Sandeep Gite', 
    aadhaarHash: 'XXXX-XXXX-4491', 
    phone: '9158302192', 
    contractorId: 'con-2', 
    skillType: 'Unskilled', 
    workerType: 'Security-Guard', 
    dailyWageRate: 480, 
    status: 'Deployed', 
    uan: '101539201948',
    esicNo: '313829104829',
    bankAccountNo: '401928491029',
    ifscCode: 'UBIN0532918',
    bankName: 'Union Bank of India',
    onboardingVerified: true, 
    onboardingDate: '2026-04-05' 
  },
  { 
    id: 'wrk-8', 
    platformId: 'SL-WRK-1008', 
    name: 'Laxmi Shinde', 
    aadhaarHash: 'XXXX-XXXX-9012', 
    phone: '9822453102', 
    contractorId: 'direct', 
    skillType: 'Unskilled', 
    workerType: 'Unskilled-Laborer', 
    dailyWageRate: 480, 
    status: 'Available', 
    uan: '101429104829',
    esicNo: '312849201948',
    bankAccountNo: '701928491029',
    ifscCode: 'MAHB0001029',
    bankName: 'Bank of Maharashtra',
    onboardingVerified: true, 
    onboardingDate: '2026-04-12' 
  },
  { 
    id: 'wrk-9', 
    platformId: 'SL-WRK-1009', 
    name: 'Arjun Pujari', 
    aadhaarHash: 'XXXX-XXXX-8822', 
    phone: '9049281293', 
    contractorId: 'con-3', 
    skillType: 'Unskilled', 
    workerType: 'Unskilled-Laborer', 
    dailyWageRate: 480, 
    status: 'Deployed', 
    uan: '101329104829',
    esicNo: '311829104829',
    bankAccountNo: '801928491029',
    ifscCode: 'ICIC0000192',
    bankName: 'ICICI Bank',
    onboardingVerified: true, 
    onboardingDate: '2026-05-01' 
  },
  { 
    id: 'wrk-10', 
    platformId: 'SL-WRK-1010', 
    name: 'Shiva Ramanna', 
    aadhaarHash: 'XXXX-XXXX-1144', 
    phone: '9130491029', 
    contractorId: 'direct', 
    skillType: 'Unskilled', 
    workerType: 'Security-Guard', 
    dailyWageRate: 480, 
    status: 'Available', 
    onboardingVerified: false, 
    onboardingDate: '2026-09-01' 
  },
  { 
    id: 'wrk-11', 
    platformId: 'SL-GRD-2001', 
    name: 'Rupen Das', 
    aadhaarHash: 'XXXX-XXXX-5512', 
    phone: '9876543218', 
    contractorId: 'con-2', 
    skillType: 'Unskilled', 
    workerType: 'Security-Guard', 
    dailyWageRate: 520, 
    status: 'Deployed', 
    uan: '101219201948',
    esicNo: '310928194829',
    bankAccountNo: '501928491029',
    ifscCode: 'SBIN0000092',
    bankName: 'State Bank of India',
    onboardingVerified: true, 
    onboardingDate: '2026-01-05' 
  },
  { 
    id: 'wrk-12', 
    platformId: 'SL-GRD-2002', 
    name: 'Bikash Barman', 
    aadhaarHash: 'XXXX-XXXX-7734', 
    phone: '9864019284', 
    contractorId: 'direct', 
    skillType: 'Unskilled', 
    workerType: 'Security-Guard', 
    dailyWageRate: 500, 
    status: 'Available', 
    uan: '101119201948',
    esicNo: '310828194829',
    bankAccountNo: '301928491029',
    ifscCode: 'SBIN0002104',
    bankName: 'State Bank of India',
    onboardingVerified: true, 
    onboardingDate: '2026-02-12' 
  },
  { 
    id: 'wrk-13', 
    platformId: 'SL-WRK-1013', 
    name: 'Gopal Kumar', 
    aadhaarHash: 'XXXX-XXXX-4412', 
    phone: '9876543212', 
    contractorId: 'con-1', 
    skillType: 'Unskilled', 
    workerType: 'Unskilled-Laborer', 
    dailyWageRate: 480, 
    status: 'Deployed', 
    uan: '101019201948',
    esicNo: '310728194829',
    bankAccountNo: '201928491029',
    ifscCode: 'HDFC0001829',
    bankName: 'HDFC Bank',
    onboardingVerified: true, 
    onboardingDate: '2026-01-15' 
  }
];

export const initialAssignments: MultiIndustryAssignment[] = [
  { id: 'asg-1', workerId: 'wrk-1', contractorId: 'con-1', industryId: 'ind-1', assignedAt: '2026-08-01', status: 'Active', shiftTiming: 'Shift A (06:00 - 14:00)' },
  { id: 'asg-2', workerId: 'wrk-2', contractorId: 'con-1', industryId: 'ind-1', assignedAt: '2026-08-01', status: 'Active', shiftTiming: 'Shift A (06:00 - 14:00)' },
  { id: 'asg-3', workerId: 'wrk-3', contractorId: 'con-1', industryId: 'ind-2', assignedAt: '2026-08-10', status: 'Active', shiftTiming: 'Shift B (14:00 - 22:00)' },
  
  { id: 'asg-4', workerId: 'wrk-6', contractorId: 'con-2', industryId: 'ind-2', assignedAt: '2026-08-05', status: 'Active', shiftTiming: 'General (09:00 - 17:00)' },
  { id: 'asg-5', workerId: 'wrk-7', contractorId: 'con-2', industryId: 'ind-3', assignedAt: '2026-08-12', status: 'Active', shiftTiming: 'Shift C (22:00 - 06:00)' },
  
  { id: 'asg-6', workerId: 'wrk-9', contractorId: 'con-3', industryId: 'ind-1', assignedAt: '2026-08-15', status: 'Active', shiftTiming: 'Shift B (14:00 - 22:00)' }
];

export const initialRequirements: DailyRequirement[] = [
  { id: 'req-1', industryId: 'ind-1', industryName: 'Brahmaputra Petrochemicals Complex (BCPL)', contractorId: 'con-1', date: '2026-09-03', skillType: 'Unskilled', workersNeeded: 5, workersFulfilled: 2, shiftTiming: 'Shift A (06:00 - 14:00)', status: 'Open' },
  { id: 'req-2', industryId: 'ind-1', industryName: 'Brahmaputra Petrochemicals Complex (BCPL)', contractorId: 'con-1', date: '2026-09-03', skillType: 'Unskilled', workersNeeded: 10, workersFulfilled: 0, shiftTiming: 'Shift B (14:00 - 22:00)', status: 'Open' },
  { id: 'req-3', industryId: 'ind-2', industryName: 'Numaligarh Refinery Industrial Unit', contractorId: 'con-2', date: '2026-09-03', skillType: 'Unskilled', workersNeeded: 3, workersFulfilled: 1, shiftTiming: 'General (09:00 - 17:00)', status: 'Open' },
  { id: 'req-4', industryId: 'ind-3', industryName: 'Guwahati Premier Industrial Manufacturing Estate', contractorId: 'con-3', date: '2026-09-03', skillType: 'Unskilled', workersNeeded: 4, workersFulfilled: 0, shiftTiming: 'Shift B (14:00 - 22:00)', status: 'Open' }
];

export const initialAttendance: Attendance[] = [
  // August 31st Records (Standard and Overtime)
  { id: 'att-1', date: '2026-08-31', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', contractorId: 'con-1', industryId: 'ind-1', checkIn: '06:02', checkOut: '14:05', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-2', date: '2026-08-31', workerId: 'wrk-2', workerName: 'Vikram Singh Shekhawat', contractorId: 'con-1', industryId: 'ind-1', checkIn: '05:58', checkOut: '18:15', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 12, overtimeHours: 4, status: 'Present' }, // 4h Overtime
  { id: 'att-3', date: '2026-08-31', workerId: 'wrk-3', workerName: 'Anil S. Patil', contractorId: 'con-1', industryId: 'ind-2', checkIn: '13:55', checkOut: '22:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-4', date: '2026-08-31', workerId: 'wrk-6', workerName: 'Pappu Yadav', contractorId: 'con-2', industryId: 'ind-2', checkIn: '08:50', checkOut: '21:05', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 12, overtimeHours: 4.25, status: 'Present' }, // Overtime
  { id: 'att-5', date: '2026-08-31', workerId: 'wrk-7', workerName: 'Sandeep Gite', contractorId: 'con-2', industryId: 'ind-3', checkIn: '21:45', checkOut: '05:45', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-6', date: '2026-08-31', workerId: 'wrk-9', workerName: 'Arjun Pujari', contractorId: 'con-3', industryId: 'ind-1', checkIn: '14:02', checkOut: '22:05', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 8, overtimeHours: 0, status: 'Present' },

  // August Previous Shifts showing workers rotating between different industries
  { id: 'att-14', date: '2026-08-28', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', contractorId: 'con-1', industryId: 'ind-2', checkIn: '06:00', checkOut: '14:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-15', date: '2026-08-29', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', contractorId: 'con-1', industryId: 'ind-2', checkIn: '06:10', checkOut: '14:15', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-16', date: '2026-08-25', workerId: 'wrk-3', workerName: 'Anil S. Patil', contractorId: 'con-1', industryId: 'ind-1', checkIn: '14:00', checkOut: '22:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-17', date: '2026-08-26', workerId: 'wrk-3', workerName: 'Anil S. Patil', contractorId: 'con-1', industryId: 'ind-1', checkIn: '14:05', checkOut: '22:10', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-18', date: '2026-08-30', workerId: 'wrk-4', workerName: 'Sunita Devi', contractorId: 'con-1', industryId: 'ind-1', checkIn: '09:00', checkOut: '17:00', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-19', date: '2026-08-29', workerId: 'wrk-9', workerName: 'Arjun Pujari', contractorId: 'con-3', industryId: 'ind-2', checkIn: '06:00', checkOut: '14:00', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  
  // September 1st Records
  { id: 'att-7', date: '2026-09-01', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', contractorId: 'con-1', industryId: 'ind-1', checkIn: '05:59', checkOut: '14:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-8', date: '2026-09-01', workerId: 'wrk-2', workerName: 'Vikram Singh Shekhawat', contractorId: 'con-1', industryId: 'ind-1', checkIn: '06:05', checkOut: '14:02', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-9', date: '2026-09-01', workerId: 'wrk-3', workerName: 'Anil S. Patil', contractorId: 'con-1', industryId: 'ind-2', checkIn: '13:58', checkOut: '22:05', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-10', date: '2026-09-01', workerId: 'wrk-6', workerName: 'Pappu Yadav', contractorId: 'con-2', industryId: 'ind-2', checkIn: '08:55', checkOut: '17:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-11', date: '2026-09-01', workerId: 'wrk-7', workerName: 'Sandeep Gite', contractorId: 'con-2', industryId: 'ind-3', checkIn: '21:55', checkOut: '06:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },

  // September 2nd (Live check-ins for interactive simulator)
  { id: 'att-12', date: '2026-09-02', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', contractorId: 'con-1', industryId: 'ind-1', checkIn: '06:01', checkOut: null, aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 0, overtimeHours: 0, status: 'Present' },
  { id: 'att-13', date: '2026-09-02', workerId: 'wrk-2', workerName: 'Vikram Singh Shekhawat', contractorId: 'con-1', industryId: 'ind-1', checkIn: '05:57', checkOut: null, aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 0, overtimeHours: 0, status: 'Present' }
];

export const initialComplianceDocs: ComplianceDocument[] = [
  // Verified Previous Month (July 2026) Challans - allowing Apex (con-1) to generate August bills
  { id: 'doc-1', contractorId: 'con-1', industryId: 'ind-1', month: 'July 2026', docType: 'EPF-Challan', fileUrl: 'EPF-CH-JULY-90212.pdf', fileName: 'EPF_ECR_Challan_Jul2026_TRRN90212.pdf', referenceNo: 'TRRN-90212984920', uploadedAt: '2026-08-15', status: 'Verified', verifiedBy: 'System Audit', remarks: 'EPF payment of ₹1,45,200 verified with EPFO portal API.' },
  { id: 'doc-2', contractorId: 'con-1', industryId: 'ind-1', month: 'July 2026', docType: 'ESI-Challan', fileUrl: 'ESI-CH-JULY-88310.pdf', fileName: 'ESIC_Contribution_Challan_Jul2026.pdf', referenceNo: 'ESIC-CH-8831029', uploadedAt: '2026-08-15', status: 'Verified', verifiedBy: 'System Audit', remarks: 'ESI payment of ₹38,400 matching with ESIC records.' },
  { id: 'doc-3', contractorId: 'con-1', industryId: 'ind-1', month: 'July 2026', docType: 'GST-Return', fileUrl: 'GST-3B-JULY-99231.pdf', fileName: 'GSTR_3B_Filed_July_2026.pdf', referenceNo: 'GSTR3B-2026-99231', uploadedAt: '2026-08-18', status: 'Verified', verifiedBy: 'System Audit', remarks: 'GSTR-3B filed. Tax of ₹1,88,290 verified.' },
  { id: 'doc-1a', contractorId: 'con-1', industryId: 'ind-1', month: 'August 2026', docType: 'Form-IV-License', fileUrl: 'CLRA_FORM_IV_APEX_TATA.pdf', fileName: 'CLRA_Form_IV_License_2026_TataMotors.pdf', referenceNo: 'AS-GHY-CLRA-2026-902', uploadedAt: '2026-08-01', status: 'Verified', verifiedBy: 'Labour Commissioner Office', remarks: 'Licensed for max 50 contract workmen. Valid till 31-Dec-2026.' },
  { id: 'doc-1b', contractorId: 'con-1', industryId: 'ind-1', month: 'August 2026', docType: 'Form-VI-A-Notice', fileUrl: 'FORM_VI_A_COMMENCEMENT_TATA.pdf', fileName: 'Notice_Commencement_Form_VI_A_Tata.pdf', referenceNo: 'NOT-VIA-PUN-2026-092', uploadedAt: '2026-08-05', status: 'Verified', verifiedBy: 'Senior Labour Inspector', remarks: 'Notice of contract work commencement acknowledged by Inspectorate.' },
  { id: 'doc-1c', contractorId: 'con-1', industryId: 'ind-1', month: 'August 2026', docType: 'Bank-Disbursement-Proof', fileUrl: 'NEFT_SALARY_DISBURSEMENT_TATA_AUG.pdf', fileName: 'SBI_Bulk_NEFT_Wages_Aug2026_Batch892.pdf', referenceNo: 'CMS-NEFT-99201948', uploadedAt: '2026-09-02', status: 'Verified', verifiedBy: 'BCPL HR Dept', remarks: 'Bank salary credit confirmed to 100% Aadhaar-linked worker bank accounts.' },

  // Jai Hind (con-2) Challans - Verified as well
  { id: 'doc-4', contractorId: 'con-2', industryId: 'ind-2', month: 'July 2026', docType: 'EPF-Challan', fileUrl: 'EPF-CH-JUL-2201.pdf', fileName: 'EPF_ECR_Receipt_July_2026.pdf', referenceNo: 'TRRN-2201984210', uploadedAt: '2026-08-14', status: 'Verified', verifiedBy: 'System Audit', remarks: 'EPF verified.' },
  { id: 'doc-5', contractorId: 'con-2', industryId: 'ind-2', month: 'July 2026', docType: 'ESI-Challan', fileUrl: 'ESI-CH-JUL-4322.pdf', fileName: 'ESIC_Paid_Challan_July_2026.pdf', referenceNo: 'ESIC-4322901', uploadedAt: '2026-08-14', status: 'Verified', verifiedBy: 'System Audit', remarks: 'ESI verified.' },
  { id: 'doc-6', contractorId: 'con-2', industryId: 'ind-2', month: 'July 2026', docType: 'GST-Return', fileUrl: 'GST-JUL-7712.pdf', fileName: 'GSTR3B_Receipt_Jul2026.pdf', referenceNo: 'GST-7712390', uploadedAt: '2026-08-14', status: 'Verified', verifiedBy: 'System Audit', remarks: 'GST verified.' },
  { id: 'doc-4a', contractorId: 'con-2', industryId: 'ind-2', month: 'August 2026', docType: 'Form-IV-License', fileUrl: 'CLRA_FORM_IV_JAIHIND_JSW.pdf', fileName: 'CLRA_Form_IV_License_JSW_Steel.pdf', referenceNo: 'KA-BEL-CLRA-2025-412', uploadedAt: '2026-08-02', status: 'Verified', verifiedBy: 'Labour Enforcement Officer', remarks: 'Licensed for max 35 contract workmen at Numaligarh Refinery Industrial Unit.' },
  { id: 'doc-4b', contractorId: 'con-2', industryId: 'ind-2', month: 'August 2026', docType: 'Form-VI-A-Notice', fileUrl: 'FORM_VI_A_JAIHIND_JSW.pdf', fileName: 'Form_VI_A_Commencement_JSW.pdf', referenceNo: 'NOT-VIA-BEL-2026-118', uploadedAt: '2026-08-04', status: 'Verified', verifiedBy: 'Labour Enforcement Officer', remarks: 'Form VI-A filed electronically on ICWL portal.' },
  { id: 'doc-4c', contractorId: 'con-2', industryId: 'ind-2', month: 'August 2026', docType: 'Bank-Disbursement-Proof', fileUrl: 'NEFT_SALARY_JSW_AUG.pdf', fileName: 'HDFC_Bank_Salary_Statement_Aug2026.pdf', referenceNo: 'HDFC-NEFT-8812903', uploadedAt: '2026-09-01', status: 'Verified', verifiedBy: 'NRL HR Dept', remarks: 'Wages disbursed via direct bank transfer.' },

  // Sahyadri (con-3) has NOT uploaded previous month's GST-Return, only EPF/ESI. This will trigger the compliance billing lock for them!
  { id: 'doc-7', contractorId: 'con-3', industryId: 'ind-1', month: 'July 2026', docType: 'EPF-Challan', fileUrl: 'EPF-CH-JUL-9912.pdf', fileName: 'EPF_Receipt_Jul_2026.pdf', referenceNo: 'TRRN-9912048', uploadedAt: '2026-08-19', status: 'Verified', verifiedBy: 'System Audit', remarks: 'EPF Verified.' },
  { id: 'doc-8', contractorId: 'con-3', industryId: 'ind-1', month: 'July 2026', docType: 'ESI-Challan', fileUrl: 'ESI-CH-JUL-0012.pdf', fileName: 'ESI_Challan_Jul_2026.pdf', referenceNo: 'ESIC-0012984', uploadedAt: '2026-08-19', status: 'Verified', verifiedBy: 'System Audit', remarks: 'ESI Verified.' },
  { id: 'doc-7a', contractorId: 'con-3', industryId: 'ind-1', month: 'August 2026', docType: 'Form-IV-License', fileUrl: 'CLRA_FORM_IV_SAHYADRI.pdf', fileName: 'Form_IV_License_Sahyadri.pdf', referenceNo: 'AS-GHY-CLRA-2026-502', uploadedAt: '2026-08-10', status: 'Verified', verifiedBy: 'Assistant Labour Commissioner', remarks: 'Contractor license valid.' },
  // Missing GST Challan and Form VI-A for con-3!
];

export const initialBills: Bill[] = [
  // Apex August Bill for Brahmaputra Petrochemicals (BCPL) (Compliant, pre-existing proof and approved)
  {
    id: 'bill-1',
    billNumber: 'INV-2026-08-001',
    contractorId: 'con-1',
    contractorName: 'Pragjyotish Manpower Services',
    industryId: 'ind-1',
    industryName: 'Brahmaputra Petrochemicals Complex (BCPL)',
    month: 'August 2026',
    totalWorkers: 4,
    totalDaysWorked: 26,
    dailyWageRate: 650,
    baseAmount: 185000,
    profitPercentage: 10,
    serviceCharge: 18500, // 10%
    subtotalAmount: 203500, // 185000 + 18500
    gstPercentage: 18,
    gstAmount: 36630, // 18% on total (base + service)
    totalAmount: 240130,
    status: 'Approved',
    submittedAt: '2026-08-25 10:30',
    reviewedAt: '2026-08-27 15:45',
    remarks: 'Approved after verification of all EPF and ESI payment challans for July.',
    complianceDocIds: ['doc-1', 'doc-2', 'doc-3']
  },
  // Jai Hind August Bill for Numaligarh Refinery Industrial Unit (Submitted, pending review)
  {
    id: 'bill-2',
    billNumber: 'INV-2026-08-002',
    contractorId: 'con-2',
    contractorName: 'Jai Hind Labour Logistics',
    industryId: 'ind-2',
    industryName: 'Numaligarh Refinery Industrial Unit Complex',
    month: 'August 2026',
    totalWorkers: 3,
    totalDaysWorked: 20,
    dailyWageRate: 600,
    baseAmount: 120000,
    profitPercentage: 10,
    serviceCharge: 12000,
    subtotalAmount: 132000,
    gstPercentage: 18,
    gstAmount: 23760,
    totalAmount: 155760,
    status: 'Submitted',
    submittedAt: '2026-09-01 11:20',
    reviewedAt: null,
    remarks: 'Awaiting Industry Admin verification of ESI challan.',
    complianceDocIds: ['doc-4', 'doc-5', 'doc-6']
  }
];

export const initialVerificationLogs: AadhaarVerificationLog[] = [
  { id: 'log-1', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', timestamp: '2026-09-02 06:01', activity: 'Shift-Check-In', status: 'Success', remarks: 'Facial Biometric matched 98.4% against Aadhaar UIDAI secure cache.' },
  { id: 'log-2', workerId: 'wrk-2', workerName: 'Vikram Singh Shekhawat', timestamp: '2026-09-02 05:57', activity: 'Shift-Check-In', status: 'Success', remarks: 'Aadhaar OTP verified. UIDAI reference code txn_810293.' },
  { id: 'log-3', workerId: 'wrk-10', workerName: 'Shiva Ramanna', timestamp: '2026-09-01 14:15', activity: 'Onboarding', status: 'Failed', remarks: 'Aadhaar verification failed: OTP timeout.' }
];

export const initialAuditLogs: GovernmentAuditLog[] = [
  { id: 'aud-1', inspectorName: 'Shri Bhaskar Senapati (Joint Labour Commissioner, Assam)', inspectedEntity: 'Industry', entityId: 'ind-1', entityName: 'Brahmaputra Petrochemicals Complex (BCPL)', timestamp: '2026-08-28 11:30', findings: 'Inspected CLRA Form V and Form VI registers. Payout records are fully compliant. Minimum wage standards strictly matched with digital attendance logs.', status: 'Clean' },
  { id: 'aud-2', inspectorName: 'Shri Bhaskar Senapati (Joint Labour Commissioner, Assam)', inspectedEntity: 'Contractor', entityId: 'con-1', entityName: 'Pragjyotish Industrial Manpower Solutions', timestamp: '2026-08-28 14:10', findings: 'EPF payment returns verified against payroll registers. Highly organized digital logs with Aadhaar authentication traces.', status: 'Clean' }
];

export const initialRevenueLogs: RevenueLog[] = [
  { id: 'rev-1', date: '2026-08-31', workerCount: 6, feeAmount: 6, status: 'Accrued' },
  { id: 'rev-2', date: '2026-09-01', workerCount: 5, feeAmount: 5, status: 'Accrued' },
  { id: 'rev-3', date: '2026-09-02', workerCount: 2, feeAmount: 2, status: 'Accrued' }
];

export const initialInspectors: GovernmentLaborInspector[] = [
  {
    id: 'insp-1',
    name: 'Shri Bhaskar Senapati',
    badgeId: 'GOV-AS-ALC-2026-081',
    designation: 'Assistant Labour Commissioner & Statutory Inspector',
    department: 'Office of the Labour Commissioner, Govt of Assam',
    email: 'inspector@icwl.in',
    phone: '9876543213',
    state: 'Assam',
    district: 'Kamrup Metropolitan',
    jurisdictionZone: 'Guwahati Industrial Belt, EPIP Amingaon & North Guwahati Zone',
    assignedPinCodes: ['781001', '781021', '781031', '781039', '781101'],
    active: true,
    registeredAt: '2026-01-15',
    officeAddress: 'Shram Bhavan, Ulubari, Guwahati, Assam - 781007',
    officeHours: 'Mon - Fri: 09:30 AM - 05:00 PM'
  },
  {
    id: 'insp-2',
    name: 'Shri K. D. Rane',
    badgeId: 'GOV-MH-LEO-109',
    designation: 'Regional Labour Enforcement Officer (Central Circle)',
    department: 'Office of the Commissioner of Labour, Maharashtra',
    email: 'kd.rane.labour@gov.in',
    phone: '9822019944',
    state: 'Maharashtra',
    district: 'Guwahati District',
    jurisdictionZone: 'Pimpri-Chinchwad, Hadapsar & Bhosari Industrial Corridor',
    assignedPinCodes: ['411018', '411028', '411033', '411019'],
    active: true,
    registeredAt: '2026-02-10',
    officeAddress: 'Kamgar Bhavan, Wakdewadi, Guwahati, Maharashtra - 411005',
    officeHours: 'Mon - Fri: 10:00 AM - 05:30 PM'
  },
  {
    id: 'insp-3',
    name: 'Smti. Ananya Borah',
    badgeId: 'GOV-AS-LI-2026-142',
    designation: 'Senior Labour Inspector (Plantations & Mining)',
    department: 'Zonal Labour Office, Upper Assam Division',
    email: 'ananya.borah@labourassam.gov.in',
    phone: '9435012345',
    state: 'Assam',
    district: 'Dibrugarh & Tinsukia',
    jurisdictionZone: 'Upper Assam Tea Belt, Digboi Refinery & Petrochemical Zone',
    assignedPinCodes: ['786001', '786125', '786192', '786181'],
    active: true,
    registeredAt: '2026-03-01',
    officeAddress: 'Labour Welfare Centre, Graham Bazar, Dibrugarh, Assam - 786001',
    officeHours: 'Mon - Fri: 09:30 AM - 04:30 PM'
  }
];

export const initialIndustryContractorConnections: IndustryContractorConnection[] = [
  {
    id: 'conn-1',
    industryId: 'ind-1',
    industryName: 'Brahmaputra Petrochemicals Complex (BCPL)',
    industryCategory: 'Industry HR',
    contractorId: 'con-1',
    contractorName: 'Pragjyotish Industrial Manpower Solutions',
    contractorType: 'Labour Contractor',
    initiatedBy: 'contractor',
    status: 'Connected',
    requestedAt: '2026-08-01',
    respondedAt: '2026-08-02',
    notes: 'Authorized under CLRA Form IV to deploy up to 50 workmen for assembly.'
  },
  {
    id: 'conn-2',
    industryId: 'ind-1',
    industryName: 'Brahmaputra Petrochemicals Complex (BCPL)',
    industryCategory: 'Industry HR',
    contractorId: 'con-2',
    contractorName: 'Jai Hind Security & Protection Agency',
    contractorType: 'Security Agency',
    initiatedBy: 'industry',
    status: 'Connected',
    requestedAt: '2026-08-05',
    respondedAt: '2026-08-05',
    notes: 'Authorized for 24/7 Gate security & perimeter sentry duty.'
  },
  {
    id: 'conn-3',
    industryId: 'ind-apt-1',
    industryName: 'Greenwood Heights Residential Society',
    industryCategory: 'Apartment Owner',
    contractorId: 'con-2',
    contractorName: 'Jai Hind Security & Protection Agency',
    contractorType: 'Security Agency',
    initiatedBy: 'industry',
    status: 'Connected',
    requestedAt: '2026-08-10',
    respondedAt: '2026-08-10',
    notes: 'Residential perimeter guards & visitor pass tracking active.'
  },
  {
    id: 'conn-4',
    industryId: 'ind-shop-1',
    industryName: 'Mega Mart Supermarket & Retail Hub',
    industryCategory: 'Shop Owner',
    contractorId: 'con-5',
    contractorName: 'Garuda Vigilance & Security Services',
    contractorType: 'Security Agency',
    initiatedBy: 'contractor',
    status: 'Pending',
    requestedAt: '2026-10-10',
    notes: 'Applied to supply retail loss prevention guards and CCTV surveillance.'
  },
  {
    id: 'conn-5',
    industryId: 'ind-off-1',
    industryName: 'Zenith Infotech Corporate Office',
    industryCategory: 'Office',
    contractorId: 'con-4',
    contractorName: 'Brahmaputra Manpower & Labour Supply',
    contractorType: 'Labour Contractor',
    initiatedBy: 'contractor',
    status: 'Pending',
    requestedAt: '2026-10-11',
    notes: 'Applied to supply office pantry & housekeeping manpower pool.'
  }
];

export const initialWorkerAgencyConnections: WorkerAgencyConnection[] = [
  {
    id: 'wconn-1',
    workerId: 'wrk-4',
    workerPlatformId: 'SL-WRK-1004',
    workerName: 'Sunita Devi',
    workerPhone: '9112233445',
    workerRole: 'Unskilled Worker',
    contractorId: 'con-1',
    contractorName: 'Pragjyotish Industrial Manpower Solutions',
    contractorType: 'Labour Contractor',
    initiatedBy: 'worker',
    status: 'Pending',
    requestedAt: '2026-10-09'
  },
  {
    id: 'wconn-2',
    workerId: 'wrk-12',
    workerPlatformId: 'SL-GRD-2002',
    workerName: 'Bikash Barman',
    workerPhone: '9864019284',
    workerRole: 'Security Guard',
    contractorId: 'con-2',
    contractorName: 'Jai Hind Security & Protection Agency',
    contractorType: 'Security Agency',
    initiatedBy: 'worker',
    status: 'Pending',
    requestedAt: '2026-10-11'
  }
];

export const initialSalaryTransactions: SalaryTransaction[] = [
  {
    id: 'sal-1',
    workerId: 'wrk-1',
    workerName: 'Rakesh Kumar Yadav',
    contractorId: 'con-1',
    contractorName: 'Pragjyotish Industrial Manpower Solutions',
    industryId: 'ind-1',
    industryName: 'Brahmaputra Petrochemicals Complex (BCPL)',
    month: 'August 2026',
    amount: 14400,
    paymentDate: '2026-09-02',
    paymentMode: 'Direct Bank Transfer',
    utrNumber: 'CMS99201948201',
    accountNumberMasked: 'XXXX-XXXX-8192',
    bankName: 'State Bank of India',
    status: 'Successful',
    pfDeducted: 1728,
    esicDeducted: 108,
    netPaid: 12564
  },
  {
    id: 'sal-2',
    workerId: 'wrk-2',
    workerName: 'Vikram Singh Shekhawat',
    contractorId: 'con-1',
    contractorName: 'Pragjyotish Industrial Manpower Solutions',
    industryId: 'ind-1',
    industryName: 'Brahmaputra Petrochemicals Complex (BCPL)',
    month: 'August 2026',
    amount: 15360,
    paymentDate: '2026-09-02',
    paymentMode: 'Direct Bank Transfer',
    utrNumber: 'CMS99201948202',
    accountNumberMasked: 'XXXX-XXXX-9104',
    bankName: 'HDFC Bank',
    status: 'Successful',
    pfDeducted: 1843,
    esicDeducted: 115,
    netPaid: 13402
  },
  {
    id: 'sal-3',
    workerId: 'wrk-6',
    workerName: 'Pappu Yadav',
    contractorId: 'con-2',
    contractorName: 'Jai Hind Security & Protection Agency',
    industryId: 'ind-2',
    industryName: 'Numaligarh Refinery Industrial Unit',
    month: 'August 2026',
    amount: 15360,
    paymentDate: '2026-09-01',
    paymentMode: 'NEFT',
    utrNumber: 'HDFCNEFT8812903',
    accountNumberMasked: 'XXXX-XXXX-1029',
    bankName: 'Canara Bank',
    status: 'Successful',
    pfDeducted: 1843,
    esicDeducted: 115,
    netPaid: 13402
  }
];

export const initialComplaints: SupervisorComplaint[] = [
  {
    id: 'cmp-1',
    complaintNumber: 'CMP-2026-001',
    supervisorId: 'sup-1',
    supervisorName: 'Prakash Deshmukh (Shop Floor Supervisor)',
    industryId: 'ind-1',
    industryName: 'Brahmaputra Petrochemicals Complex (BCPL)',
    contractorId: 'con-3',
    contractorName: 'Sahyadri Labour Contractors',
    workerId: 'wrk-9',
    workerName: 'Arjun Pujari',
    category: 'Safety Violation',
    subject: 'Repeated non-usage of mandatory PPE Helmets at Chassis Bay',
    description: 'During Shift B inspection, 3 contract personnel from Sahyadri failed to wear high-impact helmets and steel-toe boots near assembly crane zone.',
    severity: 'High',
    status: 'Open',
    ccAdmin: true,
    ccContractor: true,
    createdAt: '2026-08-30 15:40'
  },
  {
    id: 'cmp-2',
    complaintNumber: 'CMP-2026-002',
    supervisorId: 'sup-2',
    supervisorName: 'Kameshwar Rao (JSW Safety Officer)',
    industryId: 'ind-2',
    industryName: 'Numaligarh Refinery Industrial Unit',
    contractorId: 'con-2',
    contractorName: 'Jai Hind Security & Protection Agency',
    category: 'Absenteeism / Discipline',
    subject: 'Unannounced shift dropout at Perimeter Gate 3',
    description: 'Relief sentry was 45 minutes late causing security vulnerability at dispatch gate during dispatch peak hours.',
    severity: 'Medium',
    status: 'Action Taken',
    ccAdmin: true,
    ccContractor: true,
    createdAt: '2026-08-25 09:15',
    resolutionNotes: 'Contractor issued written warning to sentry and deployed backup supervisor.'
  }
];

export const initialLeaveRecords: LeaveRecord[] = [
  {
    id: 'lvr-1',
    workerId: 'wrk-1',
    workerName: 'Rakesh Kumar Yadav',
    contractorId: 'con-1',
    contractorName: 'Pragjyotish Industrial Manpower Solutions',
    industryId: 'ind-1',
    industryName: 'Brahmaputra Petrochemicals Complex (BCPL)',
    leaveType: 'Casual Leave',
    daysCount: 2,
    startDate: '2026-08-18',
    endDate: '2026-08-19',
    reason: 'Family emergency / Village visit for agricultural harvest',
    status: 'Approved',
    appliedAt: '2026-08-15',
    approvedBy: 'Apex Manpower HR',
    wagePaidForLeave: true
  },
  {
    id: 'lvr-2',
    workerId: 'wrk-2',
    workerName: 'Vikram Singh Shekhawat',
    contractorId: 'con-1',
    contractorName: 'Pragjyotish Industrial Manpower Solutions',
    industryId: 'ind-1',
    industryName: 'Brahmaputra Petrochemicals Complex (BCPL)',
    leaveType: 'Sick / Medical Leave',
    daysCount: 3,
    startDate: '2026-08-22',
    endDate: '2026-08-24',
    reason: 'Seasonal Viral fever under ESIC dispensary medical care',
    status: 'Approved',
    appliedAt: '2026-08-21',
    approvedBy: 'Apex Manpower HR',
    wagePaidForLeave: true
  }
];

export const initialPlatformInvoices: AdminPlatformInvoice[] = [
  {
    id: 'pinv-1',
    invoiceNo: 'SL-INV-2026-08-01',
    billedEntity: 'Industry',
    entityId: 'ind-1',
    entityName: 'Brahmaputra Petrochemicals Complex (BCPL)',
    month: 'August 2026',
    activeWorkersCount: 42,
    mandaysCount: 1120,
    ratePerWorkerDay: 1,
    subtotal: 1120,
    gstAmount: 201.6,
    totalPayable: 1321.6,
    status: 'Paid',
    issuedDate: '2026-09-01',
    dueDate: '2026-09-10',
    paidAt: '2026-09-04',
    transactionRef: 'AXIS-CORP-9921029'
  },
  {
    id: 'pinv-2',
    invoiceNo: 'SL-INV-2026-08-02',
    billedEntity: 'Contractor',
    entityId: 'con-1',
    entityName: 'Pragjyotish Industrial Manpower Solutions',
    month: 'August 2026',
    activeWorkersCount: 35,
    mandaysCount: 910,
    ratePerWorkerDay: 1,
    subtotal: 910,
    gstAmount: 163.8,
    totalPayable: 1073.8,
    status: 'Paid',
    issuedDate: '2026-09-01',
    dueDate: '2026-09-10',
    paidAt: '2026-09-05',
    transactionRef: 'HDFC-UPI-8849201'
  },
  {
    id: 'pinv-3',
    invoiceNo: 'SL-INV-2026-09-01',
    billedEntity: 'Industry',
    entityId: 'ind-2',
    entityName: 'Numaligarh Refinery Industrial Unit',
    month: 'September 2026',
    activeWorkersCount: 38,
    mandaysCount: 980,
    ratePerWorkerDay: 1,
    subtotal: 980,
    gstAmount: 176.4,
    totalPayable: 1156.4,
    status: 'Generated',
    issuedDate: '2026-10-01',
    dueDate: '2026-10-10'
  }
];

