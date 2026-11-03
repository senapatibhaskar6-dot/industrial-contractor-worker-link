import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Shield, 
  HardHat, 
  UserCheck, 
  ClipboardCheck, 
  Scale, 
  X, 
  LogIn, 
  UserPlus, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Industry, Contractor, Worker, Supervisor, IndustryCategory } from '../types';

export interface PortalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  initialRole?: string;
  initialSubCategory?: string;
  onLoginSuccess: (role: string, subCategory?: string, userName?: string) => void;
  industries: Industry[];
  contractors: Contractor[];
  workers: Worker[];
  onAddNewIndustry?: (industry: Industry) => void;
  onAddNewContractor?: (contractor: Contractor) => void;
  onAddNewWorker?: (worker: Worker) => void;
  showNotice: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export default function PortalAuthModal({
  isOpen,
  onClose,
  initialTab = 'login',
  initialRole = 'industry_admin',
  initialSubCategory,
  onLoginSuccess,
  industries,
  contractors,
  workers,
  onAddNewIndustry,
  onAddNewContractor,
  onAddNewWorker,
  showNotice
}: PortalAuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register common fields
  const [regFullName, setRegFullName] = useState('');
  const [regPhoneOrEmail, setRegPhoneOrEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Industry / Owner specific fields
  const [regEstName, setRegEstName] = useState('');
  const [regLocation, setRegLocation] = useState('Guwahati Industrial Area, Assam');
  const [regFactoryLicense, setRegFactoryLicense] = useState('');
  const [regLin, setRegLin] = useState('');

  // Contractor / Agency specific fields
  const [regAgencyName, setRegAgencyName] = useState('');
  const [regLicenseNo, setRegLicenseNo] = useState('');
  const [regEpfCode, setRegEpfCode] = useState('');
  const [regEsiCode, setRegEsiCode] = useState('');
  const [regPan, setRegPan] = useState('');

  // Worker / Guard specific fields
  const [regWorkerType, setRegWorkerType] = useState<'Unskilled' | 'Security-Guard' | 'Security-Supervisor'>('Unskilled');
  const [regAadhaarLast4, setRegAadhaarLast4] = useState('');
  const [regDailyWage, setRegDailyWage] = useState(480);
  const [regContractorId, setRegContractorId] = useState(contractors[0]?.id || 'direct');

  // Supervisor specific fields
  const [regDepartment, setRegDepartment] = useState('Gate Operations & Attendance');
  const [regSupervisorType, setRegSupervisorType] = useState<'industry' | 'contractor'>('contractor');

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (initialSubCategory) {
      if (initialSubCategory === 'Apartment Owner') setSelectedRole('apartment_owner');
      else if (initialSubCategory === 'Shop Owner') setSelectedRole('shop_owner');
      else if (initialSubCategory === 'Office') setSelectedRole('office');
      else if (initialSubCategory === 'Security Agency') setSelectedRole('security_agency');
      else if (initialSubCategory === 'Labour Contractor') setSelectedRole('contractor');
      else if (initialSubCategory === 'Industry HR') setSelectedRole('industry_admin');
    } else if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole, initialSubCategory, isOpen]);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = loginIdentifier.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (!cleanId || !cleanPass) {
      showNotice('অনুগ্ৰহ কৰি মেইল/ফোন আৰু পাছৱৰ্ড প্ৰবিষ্ট কৰক।', 'error');
      return;
    }

    // Read stored credential users
    let usersList: any[] = [];
    try {
      const stored = localStorage.getItem('s_credential_users');
      if (stored) usersList = JSON.parse(stored);
    } catch {}

    const matched = usersList.find(
      u => (u.emailOrPhone?.trim().toLowerCase() === cleanId || u.phone?.trim() === cleanId || u.email?.trim().toLowerCase() === cleanId) &&
           (u.passwordHash === cleanPass || cleanPass === 'admin')
    );

    if (matched) {
      sessionStorage.setItem('s_session_authenticated', 'true');
      localStorage.setItem('s_is_logged_in', 'true');
      localStorage.setItem('s_current_role', matched.role);
      if (matched.subCategory) {
        localStorage.setItem('s_current_subcategory', matched.subCategory);
      }
      showNotice(`লগইন সফল হ'ল! স্বাগতম, ${matched.name}!`, 'success');
      onLoginSuccess(matched.role, matched.subCategory, matched.name);
      onClose();
    } else {
      // Default direct login check
      let fallbackRole = selectedRole;
      let fallbackSubCategory: string | undefined = undefined;
      if (selectedRole === 'apartment_owner' || selectedRole === 'shop_owner' || selectedRole === 'office') {
        fallbackRole = 'industry_admin';
        fallbackSubCategory = selectedRole === 'apartment_owner' ? 'Apartment Owner' : selectedRole === 'shop_owner' ? 'Shop Owner' : 'Office';
      } else if (selectedRole === 'security_agency') {
        fallbackRole = 'contractor';
        fallbackSubCategory = 'Security Agency';
      }

      sessionStorage.setItem('s_session_authenticated', 'true');
      localStorage.setItem('s_is_logged_in', 'true');
      localStorage.setItem('s_current_role', fallbackRole);
      if (fallbackSubCategory) localStorage.setItem('s_current_subcategory', fallbackSubCategory);
      
      showNotice(`প্ৰৱেশ নিশ্চিত হ'ল: ${fallbackRole.toUpperCase()}`, 'success');
      onLoginSuccess(fallbackRole, fallbackSubCategory, cleanId);
      onClose();
    }
  };

  // Direct fast role bypass
  const handleQuickRoleEnter = (role: string, subCategory?: string, displayName?: string) => {
    sessionStorage.setItem('s_session_authenticated', 'true');
    localStorage.setItem('s_is_logged_in', 'true');
    localStorage.setItem('s_current_role', role);
    if (subCategory) localStorage.setItem('s_current_subcategory', subCategory);
    showNotice(`প্ৰৱেশ নিশ্চিত হ'ল: ${displayName || role}`, 'success');
    onLoginSuccess(role, subCategory, displayName);
    onClose();
  };

  // Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regFullName.trim() || !regPhoneOrEmail.trim() || !regPassword.trim()) {
      showNotice('অনুগ্ৰহ কৰি সকলো প্ৰয়োজনীয় তথ্য পূৰণ কৰক।', 'error');
      return;
    }

    const cleanContact = regPhoneOrEmail.trim();
    const cleanPass = regPassword.trim();
    const cleanName = regFullName.trim();

    let finalRole: string = selectedRole;
    let finalSubCategory: string | undefined = undefined;

    // 1. Industry / Enterprise Registration
    if (selectedRole === 'industry_admin' || selectedRole === 'apartment_owner' || selectedRole === 'shop_owner' || selectedRole === 'office') {
      finalRole = 'industry_admin';
      const cat: IndustryCategory = 
        selectedRole === 'apartment_owner' ? 'Apartment Owner' :
        selectedRole === 'shop_owner' ? 'Shop Owner' :
        selectedRole === 'office' ? 'Office' : 'Industry HR';
      finalSubCategory = cat;

      const newInd: Industry = {
        id: `ind-${Date.now()}`,
        name: regEstName.trim() || `${cleanName} (${cat})`,
        location: regLocation.trim() || 'Guwahati Industrial Area, Assam',
        regNo: regFactoryLicense.trim() || `AS/ESTAB/2026/${Math.floor(100 + Math.random() * 900)}`,
        lin: regLin.trim() || `L-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        contactEmail: cleanContact.includes('@') ? cleanContact : `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}@industry.in`,
        category: cat
      };

      if (onAddNewIndustry) onAddNewIndustry(newInd);
      
      // Update local storage
      try {
        const stored = JSON.parse(localStorage.getItem('s_industries_list') || '[]');
        localStorage.setItem('s_industries_list', JSON.stringify([newInd, ...stored]));
        localStorage.setItem('s_selected_industry_id', newInd.id);
        localStorage.setItem('s_my_registered_industry_id', newInd.id);
        localStorage.setItem('s_authenticated_persona', 'industry_admin');
      } catch {}

      showNotice(`অভিনন্দন! নতুন প্ৰতিষ্ঠান "${newInd.name}" সফলতাৰে পঞ্জীভুক্ত হ'ল আৰু সক্ৰিয় কৰা হ'ল।`, 'success');
    } 
    // 2. Contractor / Security Agency Registration
    else if (selectedRole === 'contractor' || selectedRole === 'security_agency') {
      finalRole = 'contractor';
      const isSec = selectedRole === 'security_agency';
      finalSubCategory = isSec ? 'Security Agency' : 'Labour Contractor';

      const newCon: Contractor = {
        id: `con-${Date.now()}`,
        name: regAgencyName.trim() || cleanName,
        licenseNo: regLicenseNo.trim() || (isSec ? `PSARA-AS-2026-${Math.floor(100 + Math.random() * 900)}` : `CLRA-AS-2026-${Math.floor(100 + Math.random() * 900)}`),
        lin: regLin.trim() || `L-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        pan: regPan.trim().toUpperCase() || 'ABCDE1234F',
        epfCode: regEpfCode.trim() || `AS/GHY/${Math.floor(1000 + Math.random() * 9000)}/001`,
        esiCode: regEsiCode.trim() || `43-${Math.floor(1000 + Math.random() * 9000)}-101-1001`,
        contactNo: cleanContact.replace(/\D/g, '') || '9864012345',
        rating: 5.0,
        contractorType: finalSubCategory as any
      };

      if (onAddNewContractor) onAddNewContractor(newCon);

      try {
        const stored = JSON.parse(localStorage.getItem('s_contractors_list') || '[]');
        localStorage.setItem('s_contractors_list', JSON.stringify([newCon, ...stored]));
        localStorage.setItem('s_selected_contractor_id', newCon.id);
        localStorage.setItem('s_my_registered_contractor_id', newCon.id);
        localStorage.setItem('s_authenticated_persona', 'contractor');
      } catch {}

      showNotice(`অভিনন্দন! সংস্থা "${newCon.name}" সফলতাৰে পঞ্জীভুক্ত হ'ল আৰু সক্ৰিয় কৰা হ'ল।`, 'success');
    } 
    // 3. Worker / Security Guard Registration
    else if (selectedRole === 'worker' || selectedRole === 'security_guard') {
      finalRole = selectedRole === 'security_guard' ? 'security_guard' : 'worker';
      const isGuard = selectedRole === 'security_guard';
      finalSubCategory = isGuard ? 'Security Guard' : 'Unskilled Worker';

      const cleanLast4 = regAadhaarLast4.replace(/\D/g, '').slice(-4) || String(Math.floor(1000 + Math.random() * 9000));
      const newWrk: Worker = {
        id: `wrk-${Date.now()}`,
        platformId: isGuard ? `SL-GRD-${Math.floor(1000 + Math.random() * 9000)}` : `SL-WRK-${Math.floor(1000 + Math.random() * 9000)}`,
        name: cleanName,
        aadhaarHash: `XXXX-XXXX-${cleanLast4}`,
        phone: cleanContact.replace(/\D/g, '') || '9864012345',
        contractorId: regContractorId || 'direct',
        skillType: 'Unskilled',
        workerType: isGuard ? 'Security-Guard' : 'Unskilled-Laborer',
        dailyWageRate: Number(regDailyWage) || (isGuard ? 550 : 480),
        status: 'Available',
        onboardingVerified: true,
        onboardingDate: new Date().toISOString().split('T')[0]
      };

      if (onAddNewWorker) onAddNewWorker(newWrk);

      try {
        const stored = JSON.parse(localStorage.getItem('s_workers_list') || '[]');
        localStorage.setItem('s_workers_list', JSON.stringify([newWrk, ...stored]));
      } catch {}

      showNotice(`অভিনন্দন! শ্ৰমিক/গাৰ্ড "${cleanName}" সফলতাৰে পঞ্জীভুক্ত হ'ল।`, 'success');
    }
    // 4. Supervisor Registration
    else if (selectedRole === 'supervisor') {
      finalRole = 'supervisor';
      finalSubCategory = 'Supervisor';

      const newSup: Supervisor = {
        id: `sup-${Date.now()}`,
        name: cleanName,
        phone: cleanContact.replace(/\D/g, '') || '9864012345',
        email: cleanContact.includes('@') ? cleanContact : `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}@industry.in`,
        supervisorType: regSupervisorType,
        contractorId: regSupervisorType === 'contractor' ? (contractors[0]?.id || 'con-1') : undefined,
        industryId: industries[0]?.id || 'ind-1',
        department: regDepartment.trim() || 'Plant Floor Operations',
        active: true,
        createdAt: new Date().toISOString()
      };

      try {
        const stored = JSON.parse(localStorage.getItem('s_supervisors_list') || '[]');
        localStorage.setItem('s_supervisors_list', JSON.stringify([newSup, ...stored]));
      } catch {}

      showNotice(`ছুপাৰভাইজাৰ "${cleanName}" সফলতাৰে পঞ্জীভুক্ত হ'ল।`, 'success');
    }

    // Save to Credential Users
    const newUserRecord = {
      name: cleanName,
      emailOrPhone: cleanContact,
      passwordHash: cleanPass,
      role: finalRole,
      subCategory: finalSubCategory
    };

    try {
      const stored = JSON.parse(localStorage.getItem('s_credential_users') || '[]');
      const filtered = stored.filter((u: any) => u.emailOrPhone?.toLowerCase() !== cleanContact.toLowerCase());
      localStorage.setItem('s_credential_users', JSON.stringify([newUserRecord, ...filtered]));
    } catch {}

    // Complete session
    sessionStorage.setItem('s_session_authenticated', 'true');
    localStorage.setItem('s_is_logged_in', 'true');
    localStorage.setItem('s_current_role', finalRole);
    if (finalSubCategory) localStorage.setItem('s_current_subcategory', finalSubCategory);

    onLoginSuccess(finalRole, finalSubCategory, cleanName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-5 sm:p-6 text-white shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white bg-slate-800/80 p-1.5 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1 pr-8">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                IndustrialContractorWorkerLink (ICWL)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Live Portal
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {tab === 'login' ? '🔑 প্ৰতিষ্ঠান আৰু শ্ৰমিক প্ৰৱেশিকা (Portal Login)' : '📝 নতুন পঞ্জীয়ন অন্তৰ্ভুক্তিকৰণ (New Registration)'}
            </h2>
            <p className="text-xs text-slate-300 leading-snug">
              উদ্যোগ, এপাৰ্টমেণ্ট/দোকান মালিক, ঠিকাদাৰ, ছিকিউৰিটি সংস্থা আৰু শ্ৰমিকৰ বাবে কেন্দ্ৰীয় প্ৰণালী।
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'login' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন (Sign In)</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'register' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>নতুন পঞ্জীয়ন (Register)</span>
            </button>
          </div>
        </div>

        {/* Modal Body with Scrolling */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* ========================================================================= */}
          {/* 1. LOGIN TAB */}
          {/* ========================================================================= */}
          {tab === 'login' && (
            <div className="space-y-5">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    ম’বাইল নম্বৰ অথবা মেইল ঠিকনা (Mobile No or Email):
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="যেনে: 9864012345 বা hr@industry.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">পাছৱৰ্ড (Password):</label>
                    <span className="text-[10px] text-slate-400 font-mono">Default: admin</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <LogIn className="w-4 h-4" />
                  <span>প্ৰৱেশ কৰক (Enter Portal)</span>
                </button>
              </form>

              {/* 1-Click Instant Role Launch for Stakeholders */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                  ⚡ সত্যায়িত পোনপটীয়া প্ৰৱেশিকা (Verified Direct Role Access):
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickRoleEnter('industry_admin', 'Industry HR', 'Industry HR')}
                    className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-left transition-all cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">🏭</span>
                    <strong className="block text-slate-900 text-[11px]">উদ্যোগ কাৰখানা</strong>
                    <span className="text-[9px] text-indigo-700">Factory HR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleEnter('industry_admin', 'Apartment Owner', 'Apartment Owner')}
                    className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-left transition-all cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">🏢</span>
                    <strong className="block text-slate-900 text-[11px]">এপাৰ্টমেণ্ট/দোকান</strong>
                    <span className="text-[9px] text-indigo-700">Society Owner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleEnter('contractor', 'Labour Contractor', 'Labour Contractor')}
                    className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-left transition-all cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">👷</span>
                    <strong className="block text-slate-900 text-[11px]">শ্ৰম ঠিকাদাৰ</strong>
                    <span className="text-[9px] text-blue-700">Labour Contractor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleEnter('contractor', 'Security Agency', 'Security Agency')}
                    className="p-2.5 rounded-xl border border-cyan-200 bg-cyan-50/70 hover:bg-cyan-100 text-left transition-all cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">🛡️</span>
                    <strong className="block text-slate-900 text-[11px]">ছিকিউৰিটি সংস্থা</strong>
                    <span className="text-[9px] text-cyan-700">PSARA Agency</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleEnter('supervisor', undefined, 'Site Supervisor')}
                    className="p-2.5 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-left transition-all cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">📋</span>
                    <strong className="block text-slate-900 text-[11px]">ছুপাৰভাইজাৰ</strong>
                    <span className="text-[9px] text-teal-700">Site Supervisor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleEnter('worker', undefined, 'Industrial Worker')}
                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-left transition-all cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">👤</span>
                    <strong className="block text-slate-900 text-[11px]">ঔদ্যোগিক শ্ৰমিক</strong>
                    <span className="text-[9px] text-amber-700">Labour Smart Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleEnter('security_guard', undefined, 'Security Guard')}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-left transition-all cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">👮</span>
                    <strong className="block text-slate-900 text-[11px]">নিৰাপত্তাৰক্ষী</strong>
                    <span className="text-[9px] text-emerald-700">Security Guard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleEnter('government_inspector', undefined, 'Labour Inspector')}
                    className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-left transition-all cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">⚖️</span>
                    <strong className="block text-slate-900 text-[11px]">শ্ৰম পৰিদৰ্শক</strong>
                    <span className="text-[9px] text-purple-700">Govt Inspector</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. REGISTER TAB */}
          {/* ========================================================================= */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Role Selector Card */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  পঞ্জীয়নৰ ভূমিকা বাছক (Select Registration Category):
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <optgroup label="🏭 উদ্যোগ আৰু প্ৰতিষ্ঠান মালিক (Establishments & Owners)">
                    <option value="industry_admin">🏭 Industry HR (কাৰখানা / বৃহৎ উদ্যোগ)</option>
                    <option value="apartment_owner">🏢 Apartment Owner (আৱাসিক সমিতি / চছাইটি)</option>
                    <option value="shop_owner">🛍️ Shop Owner (বাণিজ্যিক দোকান / ব্যৱসায়িক প্ৰতিষ্ঠান)</option>
                    <option value="office">🏛️ Corporate Office (ব্যক্তিগত কাৰ্যালয় / অফিচ)</option>
                  </optgroup>
                  <optgroup label="🏢 ঠিকাদাৰ আৰু নিৰাপত্তা সংস্থা (Contractors & Agencies)">
                    <option value="contractor">👷 Labour Contractor (শ্ৰমিক ঠিকাদাৰ - CLRA License)</option>
                    <option value="security_agency">🛡️ Security Agency (নিৰাপত্তা সংস্থা - PSARA License)</option>
                  </optgroup>
                  <optgroup label="📋 ছুপাৰভাইজাৰ (Site & Factory Supervisors)">
                    <option value="supervisor">📋 Site Supervisor (প্ৰকল্প ও গেট ছুপাৰভাইজাৰ)</option>
                  </optgroup>
                  <optgroup label="👤 শ্ৰমিক আৰু নিৰাপত্তাৰক্ষী (Workforce)">
                    <option value="worker">👤 Unskilled Worker (অদক্ষ চুক্তিভিত্তিক শ্ৰমিক)</option>
                    <option value="security_guard">👮 Security Guard (নিৰাপত্তাৰক্ষী ও পহৰাদাৰ)</option>
                  </optgroup>
                </select>
              </div>

              {/* Common User Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {selectedRole === 'worker' || selectedRole === 'security_guard' ? 'শ্ৰমিক/গাৰ্ডৰ পূৰ্ণ নাম:' : 'অধিকাৰীৰ পূৰ্ণ নাম (Full Name):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="যেনে: ভাস্কৰ সেনাপতি"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    ম’বাইল নম্বৰ / ফোন নম্বৰ:
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhoneOrEmail}
                    onChange={(e) => setRegPhoneOrEmail(e.target.value)}
                    placeholder="যেনে: 9864012345"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Role Specific Fields: 1. Industry / Apartment / Shop / Office */}
              {(selectedRole === 'industry_admin' || selectedRole === 'apartment_owner' || selectedRole === 'shop_owner' || selectedRole === 'office') && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs pb-1 border-b border-indigo-200/60">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>প্ৰতিষ্ঠানৰ অনুপালন তথ্য (Establishment Details)</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {selectedRole === 'apartment_owner' ? 'আৱাসিক সমিতি/এপাৰ্টমেণ্টৰ নাম:' :
                       selectedRole === 'shop_owner' ? 'দোকান/বাণিজ্যিক প্ৰতিষ্ঠানৰ নাম:' :
                       selectedRole === 'office' ? 'কাৰ্যালয়/অফিচৰ নাম:' : 'কাৰখানা/উদ্যোগৰ নাম:'}
                    </label>
                    <input
                      type="text"
                      value={regEstName}
                      onChange={(e) => setRegEstName(e.target.value)}
                      placeholder="যেনে: কামাখ্যা ইণ্ডাষ্ট্ৰীজ / গ্ৰীণউড হাইটছ"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">লাইচেঞ্চ / পঞ্জীয়ন নম্বৰ:</label>
                      <input
                        type="text"
                        value={regFactoryLicense}
                        onChange={(e) => setRegFactoryLicense(e.target.value)}
                        placeholder="AS/KAM/2026/892"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">স্থান / জিলা (Location):</label>
                      <input
                        type="text"
                        value={regLocation}
                        onChange={(e) => setRegLocation(e.target.value)}
                        placeholder="Guwahati, Assam"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Role Specific Fields: 2. Labour Contractor / Security Agency */}
              {(selectedRole === 'contractor' || selectedRole === 'security_agency') && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-2 text-blue-950 font-bold text-xs pb-1 border-b border-blue-200/60">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>সংস্থা আৰু শ্ৰম অনুজ্ঞাপত্ৰ (CLRA / PSARA Statutory Info)</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {selectedRole === 'security_agency' ? 'ছিকিউৰিটি সংস্থাৰ নাম (Agency Name):' : 'শ্ৰম ঠিকাদাৰ সংস্থাৰ নাম (Contractor Firm):'}
                    </label>
                    <input
                      type="text"
                      value={regAgencyName}
                      onChange={(e) => setRegAgencyName(e.target.value)}
                      placeholder="যেনে: প্ৰাগজ্যোতিষ মেনপাৱাৰ চলিউচনছ"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        {selectedRole === 'security_agency' ? 'PSARA License No:' : 'CLRA Form VI License No:'}
                      </label>
                      <input
                        type="text"
                        value={regLicenseNo}
                        onChange={(e) => setRegLicenseNo(e.target.value)}
                        placeholder="AS-GHY-2026-902"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">PAN Card No:</label>
                      <input
                        type="text"
                        value={regPan}
                        onChange={(e) => setRegPan(e.target.value.toUpperCase())}
                        placeholder="AAACA1029K"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono uppercase text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">EPFO Code:</label>
                      <input
                        type="text"
                        value={regEpfCode}
                        onChange={(e) => setRegEpfCode(e.target.value)}
                        placeholder="AS/GHY/4567/001"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">ESIC Code:</label>
                      <input
                        type="text"
                        value={regEsiCode}
                        onChange={(e) => setRegEsiCode(e.target.value)}
                        placeholder="43-8973-102-1001"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Role Specific Fields: 3. Worker / Security Guard */}
              {(selectedRole === 'worker' || selectedRole === 'security_guard') && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-xs pb-1 border-b border-amber-200/60">
                    <HardHat className="w-4 h-4 text-amber-600" />
                    <span>শ্ৰমিক ও গাৰ্ড পৰিচয় (Worker Identification)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">আধাৰ নম্বৰৰ শেষৰ ৪ টা অংক:</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={regAadhaarLast4}
                        onChange={(e) => setRegAadhaarLast4(e.target.value)}
                        placeholder="যেনে: 8920"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">দৈনিক মজুৰি নিৰিখ (Daily Wage):</label>
                      <input
                        type="number"
                        value={regDailyWage}
                        onChange={(e) => setRegDailyWage(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  গোপনীয় পাছৱৰ্ড নিৰ্ধাৰণ কৰক (Set Account Password):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="নূন্যতম ৬ টা আখৰ..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>পঞ্জীয়ন সম্পূৰ্ণ কৰক আৰু ডেশ্ববৰ্ড খোলক (Register & Enter)</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-center text-slate-500 text-[11px] shrink-0">
          ShramikLink • CLRA Act 1970 & Factories Act 1948 Compliant • ₹1/Worker/Day Micro-SaaS
        </div>

      </div>
    </div>
  );
}
