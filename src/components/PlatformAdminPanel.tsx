import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  FileCheck, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ExternalLink, 
  Coins, 
  Briefcase, 
  Shield, 
  UserCheck, 
  Building, 
  Store, 
  Eye, 
  HelpCircle, 
  FileText, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  MapPin,
  Phone,
  Mail,
  Calendar,
  X
} from 'lucide-react';
import { Industry, Contractor, Worker } from '../types';

interface PlatformAdminPanelProps {
  industries: Industry[];
  contractors: Contractor[];
  workers: Worker[];
  onSelectRole?: (role: 'industry_admin' | 'contractor' | 'worker' | 'security_guard' | 'supervisor' | 'government_inspector') => void;
  onAddNewIndustry?: (industry: Industry) => void;
  onAddNewContractor?: (contractor: Contractor) => void;
  onAddNewWorker?: (worker: Worker) => void;
  showNotice?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function PlatformAdminPanel({
  industries,
  contractors,
  workers,
  onSelectRole,
  onAddNewIndustry,
  onAddNewContractor,
  onAddNewWorker,
  showNotice = () => {}
}: PlatformAdminPanelProps) {
  // Navigation tabs inside Admin Panel
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'establishments' | 'agencies' | 'workforce' | 'how_it_works'>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [establishmentFilter, setEstablishmentFilter] = useState<string>('All');
  const [agencyFilter, setAgencyFilter] = useState<string>('All');
  const [workforceFilter, setWorkforceFilter] = useState<string>('All');
  
  // Quick Registration Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addEntityType, setAddEntityType] = useState<'industry' | 'contractor' | 'worker'>('industry');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Industry HR');
  const [newLocation, setNewLocation] = useState('Guwahati, Assam');
  const [newPhone, setNewPhone] = useState('9864012345');
  const [newEmail, setNewEmail] = useState('');
  const [newLicense, setNewLicense] = useState('AS-LIC-2026-');

  // Breakdown counts for Establishments / Owners
  const industryHRCount = industries.filter(i => i.category === 'Industry HR').length;
  const apartmentOwnerCount = industries.filter(i => i.category === 'Apartment Owner').length;
  const shopOwnerCount = industries.filter(i => i.category === 'Shop Owner').length;
  const officeCount = industries.filter(i => i.category === 'Office').length;
  const totalEstablishments = industries.length;

  // Breakdown counts for Agencies & Contractors
  const labourContractorCount = contractors.filter(c => c.contractorType === 'Labour Contractor' || !c.contractorType).length;
  const securityAgencyCount = contractors.filter(c => c.contractorType === 'Security Agency').length;
  const totalAgencies = contractors.length;

  // Breakdown counts for Workers & Guards
  // Any worker marked as guard or unskilled
  const unskilledLabourCount = workers.filter(w => !w.name.toLowerCase().includes('guard') && !w.name.toLowerCase().includes('security')).length;
  const securityGuardsCount = workers.filter(w => w.name.toLowerCase().includes('guard') || w.name.toLowerCase().includes('security')).length + 2; // Including demo guards
  const totalWorkforce = workers.length + 2;

  // Filtered lists
  const filteredIndustries = industries.filter(ind => {
    const matchesCategory = establishmentFilter === 'All' || ind.category === establishmentFilter;
    const matchesQuery = !searchQuery || 
      ind.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ind.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ind.contactEmail && ind.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const filteredContractors = contractors.filter(con => {
    const matchesCategory = agencyFilter === 'All' || con.contractorType === agencyFilter;
    const matchesQuery = !searchQuery || 
      con.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      con.contactNo.includes(searchQuery) ||
      (con.licenseNo && con.licenseNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const filteredWorkers = workers.filter(wrk => {
    const isGuard = wrk.name.toLowerCase().includes('guard') || wrk.name.toLowerCase().includes('security');
    const matchesCategory = workforceFilter === 'All' || 
      (workforceFilter === 'Labour' && !isGuard) || 
      (workforceFilter === 'Security Guard' && isGuard);
    const matchesQuery = !searchQuery || 
      wrk.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      wrk.phone.includes(searchQuery) ||
      wrk.aadhaarHash.includes(searchQuery);
    return matchesCategory && matchesQuery;
  });

  const handleCreateEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showNotice('অনুগ্ৰহ কৰি প্ৰতিষ্ঠান বা ব্যক্তিৰ নাম লিখক।', 'error');
      return;
    }

    if (addEntityType === 'industry') {
      const newInd: Industry = {
        id: `ind-new-${Date.now()}`,
        name: newName,
        category: newCategory as any,
        location: newLocation,
        regNo: newLicense || `AS/ESTAB/2026/${Math.floor(Math.random() * 900 + 100)}`,
        lin: `L-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        contactEmail: newEmail || `${newName.toLowerCase().replace(/[^a-z0-9]/g, '')}@icwl.in`
      };
      if (onAddNewIndustry) onAddNewIndustry(newInd);
      showNotice(`নতুন প্ৰতিষ্ঠান সফলতাৰে যুক্ত কৰা হ'ল: ${newName} (${newCategory})`, 'success');
    } else if (addEntityType === 'contractor') {
      const newCon: Contractor = {
        id: `con-new-${Date.now()}`,
        name: newName,
        contractorType: newCategory as any,
        licenseNo: newLicense || `CLRA-AS-2026-${Math.floor(Math.random() * 900 + 100)}`,
        lin: `L-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        pan: `AAAC${Math.random().toString(36).substring(2, 6).toUpperCase()}P`,
        epfCode: `AS/GHY/${Math.floor(Math.random() * 9000 + 1000)}/001`,
        esiCode: `43-${Math.floor(Math.random() * 9000 + 1000)}-101-1001`,
        contactNo: newPhone,
        rating: 4.8
      };
      if (onAddNewContractor) onAddNewContractor(newCon);
      showNotice(`নতুন সংস্থা/ঠিকাদাৰ যুক্ত কৰা হ'ল: ${newName} (${newCategory})`, 'success');
    } else {
      const newWrk: Worker = {
        id: `wrk-new-${Date.now()}`,
        name: newName,
        phone: newPhone,
        aadhaarHash: `XXXX-XXXX-${Math.floor(Math.random() * 9000 + 1000)}`,
        contractorId: contractors[0]?.id || 'con-1',
        skillType: 'Unskilled',
        dailyWageRate: 480,
        status: 'Available',
        onboardingVerified: true,
        onboardingDate: new Date().toISOString().split('T')[0]
      };
      if (onAddNewWorker) onAddNewWorker(newWrk);
      showNotice(`নতুন শ্ৰমিক/নিৰাপত্তাৰক্ষী যুক্ত কৰা হ'ল: ${newName}`, 'success');
    }

    setNewName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BANNER (PLATFORM ADMIN & FOUNDER OVERSIGHT) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/60 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                CENTRAL PLATFORM GOVERNANCE
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                CLRA & Factories Act Audit Live
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>🛡️ শ্ৰমিকলিংক কেন্দ্ৰীয় এডমিন পেনেল</span>
              <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-500/40">
                Super Admin
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              IndustrialContractorWorkerLink (ICWL) প্লেটফৰ্মৰ সকলো অংশীদাৰ—উদ্যোগ, এপাৰ্টমেণ্ট, দোকান, অফিচ, ঠিকাদাৰ, ছিকিউৰিটি সংস্থা আৰু শ্ৰমিকৰ লাইভ সংখ্যা আৰু পৰিচালনাৰ কেন্দ্ৰবিন্দু।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => {
                setAddEntityType('industry');
                setShowAddModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন পঞ্জীয়ন অন্তৰ্ভুক্ত কৰক</span>
            </button>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Platform Founder</span>
              <span className="text-xs font-bold text-indigo-300">Bhaskar Senapati, Assam</span>
            </div>
          </div>
        </div>

        {/* Real-time Counter Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-indigo-900/60 text-slate-200">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between text-indigo-300 text-xs font-medium mb-1">
              <span>প্ৰতিষ্ঠান ও মালিক (Owners)</span>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white">{totalEstablishments}</div>
            <div className="text-[10px] text-indigo-300/80 mt-1">
              🏭 {industryHRCount} Industry • 🏢 {apartmentOwnerCount} Apt • 🛍️ {shopOwnerCount} Shop • 🏛️ {officeCount} Office
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between text-indigo-300 text-xs font-medium mb-1">
              <span>সংস্থা ও ঠিকাদাৰ (Agencies)</span>
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white">{totalAgencies}</div>
            <div className="text-[10px] text-indigo-300/80 mt-1">
              👷 {labourContractorCount} ঠিকাদাৰ • 🛡️ {securityAgencyCount} ছিকিউৰিটি সংস্থা
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between text-indigo-300 text-xs font-medium mb-1">
              <span>শ্ৰমিক ও গাৰ্ড (Workforce)</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white">{totalWorkforce}</div>
            <div className="text-[10px] text-indigo-300/80 mt-1">
              👤 {unskilledLabourCount} শ্ৰমিক • 👮 {securityGuardsCount} নিৰাপত্তাৰক্ষী
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-medium mb-1">
              <span>Statutory Compliance</span>
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-emerald-400">100% Locked</div>
            <div className="text-[10px] text-emerald-300/80 mt-1">
              EPF & ESI চৰকাৰী চালানেৰে সুৰক্ষিত
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ADMIN NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 gap-3 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 সৰ্বমুঠ পৰিসংখ্যা (Overview)', icon: Layers },
            { id: 'establishments', label: `🏭 উদ্যোগ ও মালিক (${totalEstablishments})`, icon: Building2 },
            { id: 'agencies', label: `🏢 সংস্থা ও ঠিকাদাৰ (${totalAgencies})`, icon: Briefcase },
            { id: 'workforce', label: `👤 শ্ৰমিক ও গাৰ্ড (${totalWorkforce})`, icon: Users },
            { id: 'how_it_works', label: '📘 চিষ্টেমৰ কাৰ্য্যপ্ৰণালী ও নিৰ্দেশনা (How it Works)', icon: HelpCircle, highlight: true }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : tab.highlight
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.highlight ? 'text-amber-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Search Bar */}
        {activeAdminTab !== 'how_it_works' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="প্ৰতিষ্ঠান, সংস্থা বা শ্ৰমিক সন্ধান কৰক..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT: OVERVIEW DASHBOARD */}
      {/* ========================================================================= */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Detailed 3-Pillar Cards (Establishments, Agencies, Workers) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1: Establishments & Owners */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">উদ্যোগ আৰু প্ৰতিষ্ঠান</h3>
                    <span className="text-[10px] text-slate-500">Principal Employers / Owners</span>
                  </div>
                </div>
                <span className="text-xl font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                  {totalEstablishments}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span>🏭</span> Industry HR (কাৰখানা / বৃহৎ উদ্যোগ)
                  </span>
                  <span className="font-bold text-indigo-700">{industryHRCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span>🏢</span> Apartment Owner (আৱাসিক চছাইটি)
                  </span>
                  <span className="font-bold text-indigo-700">{apartmentOwnerCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span>🛍️</span> Shop Owner (বাণিজ্যিক দোকান)
                  </span>
                  <span className="font-bold text-indigo-700">{shopOwnerCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span>🏛️</span> Office (ব্যক্তিগত কাৰ্যালয় / অফিচ)
                  </span>
                  <span className="font-bold text-indigo-700">{officeCount}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveAdminTab('establishments')}
                className="w-full mt-2 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>তালিকা আৰু সবিশেষ চাওক</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 2: Contractors & Agencies */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">ঠিকাদাৰ আৰু এজেন্সী</h3>
                    <span className="text-[10px] text-slate-500">Contractors & Security Agencies</span>
                  </div>
                </div>
                <span className="text-xl font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  {totalAgencies}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span>👷</span> Labour Contractor (শ্ৰমিক ঠিকাদাৰ / চৰ্দাৰ)
                  </span>
                  <span className="font-bold text-purple-700">{labourContractorCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span>🛡️</span> Security Agency (নিৰাপত্তা সংস্থা - PSARA)
                  </span>
                  <span className="font-bold text-purple-700">{securityAgencyCount}</span>
                </div>
                <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-[11px] text-purple-900 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>বৈধানিক অনুজ্ঞাপত্ৰ:</span>
                    <span className="font-bold text-emerald-600">১০০% সক্ৰিয় (Verified)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>EPFO & ESIC ক'ড:</span>
                    <span className="font-bold text-emerald-600">ডিজিটেল সংলগ্ন</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveAdminTab('agencies')}
                className="w-full mt-2 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>তালিকা আৰু সবিশেষ চাওক</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 3: Workforce & Guards */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">শ্ৰমিক আৰু নিৰাপত্তাৰক্ষী</h3>
                    <span className="text-[10px] text-slate-500">Workforce & Security Staff</span>
                  </div>
                </div>
                <span className="text-xl font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {totalWorkforce}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span>👤</span> Unskilled Worker / Labour (অদক্ষ শ্ৰমিক)
                  </span>
                  <span className="font-bold text-emerald-700">{unskilledLabourCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span>👮</span> Security Guard (নিৰাপত্তাৰক্ষী - Unarmed)
                  </span>
                  <span className="font-bold text-emerald-700">{securityGuardsCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span>🎖️</span> Security / Field Supervisor (ছুপাৰভাইজাৰ)
                  </span>
                  <span className="font-bold text-emerald-700">2</span>
                </div>
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-[11px] text-emerald-900 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>আধাৰ মাস্কড ভেৰিফিকেচন:</span>
                    <span className="font-bold text-emerald-700">১০০% সম্পন্ন</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>মজুৰি হাৰ (Wage Rate):</span>
                    <span className="font-bold text-emerald-700">₹৪৮০ / দিন (বৈধানিক)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveAdminTab('workforce')}
                className="w-full mt-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>তালিকা আৰু সবিশেষ চাওক</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Action Role Switches (Test each role directly from Admin) */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  এডমিনৰ পৰা পোনপটীয়া যিকোনো ডেশ্ববৰ্ড পৰিদৰ্শন কৰক (Quick Dashboard Switch)
                </h4>
                <p className="text-[11px] text-slate-400">
                  তলৰ যিকোনো বুটামত ক্লিক কৰি সেই নিৰ্দিষ্ট পদবীৰ ডেশ্ববৰ্ডলৈ তৎমুহূৰ্ততে প্ৰৱেশ কৰিব পাৰে:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
              <button
                onClick={() => onSelectRole && onSelectRole('industry_admin')}
                className="p-3 bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-500 rounded-xl text-center text-xs font-bold transition-all cursor-pointer group"
              >
                <Building2 className="w-5 h-5 mx-auto mb-1 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="block text-white">Owner Dashboard</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Industry / Apt / Shop</span>
              </button>

              <button
                onClick={() => onSelectRole && onSelectRole('contractor')}
                className="p-3 bg-slate-800 hover:bg-purple-900/60 border border-slate-700 hover:border-purple-500 rounded-xl text-center text-xs font-bold transition-all cursor-pointer group"
              >
                <Briefcase className="w-5 h-5 mx-auto mb-1 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="block text-white">Agency Dashboard</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Contractor / Security</span>
              </button>

              <button
                onClick={() => onSelectRole && onSelectRole('worker')}
                className="p-3 bg-slate-800 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500 rounded-xl text-center text-xs font-bold transition-all cursor-pointer group"
              >
                <Users className="w-5 h-5 mx-auto mb-1 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="block text-white">Labour Dashboard</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Unskilled Worker</span>
              </button>

              <button
                onClick={() => onSelectRole && onSelectRole('security_guard')}
                className="p-3 bg-slate-800 hover:bg-cyan-900/60 border border-slate-700 hover:border-cyan-500 rounded-xl text-center text-xs font-bold transition-all cursor-pointer group"
              >
                <Shield className="w-5 h-5 mx-auto mb-1 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="block text-white">Guard Dashboard</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Gate Duty & Sentry</span>
              </button>

              <button
                onClick={() => onSelectRole && onSelectRole('supervisor')}
                className="p-3 bg-slate-800 hover:bg-amber-900/60 border border-slate-700 hover:border-amber-500 rounded-xl text-center text-xs font-bold transition-all cursor-pointer group"
              >
                <UserCheck className="w-5 h-5 mx-auto mb-1 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="block text-white">Supervisor Desk</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Muster Roll Approval</span>
              </button>

              <button
                onClick={() => onSelectRole && onSelectRole('government_inspector')}
                className="p-3 bg-slate-800 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-500 rounded-xl text-center text-xs font-bold transition-all cursor-pointer group"
              >
                <FileCheck className="w-5 h-5 mx-auto mb-1 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="block text-white">Labor Inspector</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">CLRA Form Audit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT: ESTABLISHMENTS & OWNERS DIRECTORY */}
      {/* ========================================================================= */}
      {activeAdminTab === 'establishments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 mr-1">শ্ৰেণী অনুসৰি ফিল্টাৰ:</span>
              {['All', 'Industry HR', 'Apartment Owner', 'Shop Owner', 'Office'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setEstablishmentFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    establishmentFilter === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat === 'All' ? `সকলো (${industries.length})` : cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setAddEntityType('industry');
                setShowAddModal(true);
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ নতুন প্ৰতিষ্ঠান যোগ কৰক</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIndustries.map(ind => (
              <div 
                key={ind.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 text-lg">
                      {ind.category === 'Industry HR' ? '🏭' :
                       ind.category === 'Apartment Owner' ? '🏢' :
                       ind.category === 'Shop Owner' ? '🛍️' : '🏛️'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{ind.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          ind.category === 'Industry HR' ? 'bg-blue-100 text-blue-800' :
                          ind.category === 'Apartment Owner' ? 'bg-amber-100 text-amber-800' :
                          ind.category === 'Shop Owner' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {ind.category}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {ind.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                    সক্ৰিয় (Active)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Registration / License No:</span>
                    <span className="font-mono font-medium text-slate-800 text-[11px]">{ind.regNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">LIN (Labour ID Number):</span>
                    <span className="font-mono font-medium text-slate-800 text-[11px]">{ind.lin}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block">Contact Email / Portal:</span>
                    <span className="font-medium text-indigo-600 text-[11px]">{ind.contactEmail}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    CLRA Form XVI অনুপালন সুৰক্ষিত
                  </span>
                  <button
                    onClick={() => {
                      if (onSelectRole) onSelectRole('industry_admin');
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>ডেশ্ববৰ্ড চাওক</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT: AGENCIES & CONTRACTORS DIRECTORY */}
      {/* ========================================================================= */}
      {activeAdminTab === 'agencies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 mr-1">সংস্থাৰ প্ৰকাৰ:</span>
              {['All', 'Labour Contractor', 'Security Agency'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setAgencyFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    agencyFilter === cat
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat === 'All' ? `সকলো (${contractors.length})` : cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setAddEntityType('contractor');
                setShowAddModal(true);
              }}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ নতুন সংস্থা যোগ কৰক</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContractors.map(con => (
              <div 
                key={con.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0 text-lg">
                      {con.contractorType === 'Security Agency' ? '🛡️' : '👷'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{con.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          con.contractorType === 'Security Agency' 
                            ? 'bg-cyan-100 text-cyan-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {con.contractorType || 'Labour Contractor'}
                        </span>
                        <span className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5">
                          ★ {con.rating} Rating
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                    EPF/ESI Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block">CLRA / PSARA License:</span>
                    <span className="font-mono font-medium text-slate-800 text-[11px]">{con.licenseNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Labour ID (LIN):</span>
                    <span className="font-mono font-medium text-slate-800 text-[11px]">{con.lin}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">EPF Code:</span>
                    <span className="font-mono text-emerald-700 font-bold text-[11px]">{con.epfCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ESIC Code:</span>
                    <span className="font-mono text-emerald-700 font-bold text-[11px]">{con.esiCode}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {con.contactNo}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      PAN: {con.pan}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    Compliance-Locked Billing সক্ৰিয়
                  </span>
                  <button
                    onClick={() => {
                      if (onSelectRole) onSelectRole('contractor');
                    }}
                    className="text-xs text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>এজেন্সী পেনেল চাওক</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB CONTENT: WORKFORCE & GUARDS DIRECTORY */}
      {/* ========================================================================= */}
      {activeAdminTab === 'workforce' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 mr-1">শ্ৰেণী:</span>
              {['All', 'Labour', 'Security Guard'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setWorkforceFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    workforceFilter === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat === 'All' ? `সকলো (${workers.length})` : cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setAddEntityType('worker');
                setShowAddModal(true);
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ নতুন শ্ৰমিক/গাৰ্ড অন্তৰ্ভুক্ত কৰক</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">শ্ৰমিক / গাৰ্ডৰ নাম</th>
                    <th className="p-3.5">পদবী (Role)</th>
                    <th className="p-3.5">মাস্কড আধাৰ নং</th>
                    <th className="p-3.5">ফোন নম্বৰ</th>
                    <th className="p-3.5">দৈনিক মজুৰি</th>
                    <th className="p-3.5">সংযোজিত সংস্থা</th>
                    <th className="p-3.5">অৱস্থা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredWorkers.map(wrk => {
                    const isGuard = wrk.name.toLowerCase().includes('guard') || wrk.name.toLowerCase().includes('security');
                    const assignedAgency = contractors.find(c => c.id === wrk.contractorId)?.name || 'Apex Solutions';
                    return (
                      <tr key={wrk.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                            isGuard ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isGuard ? '👮' : '👤'}
                          </div>
                          <span>{wrk.name}</span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isGuard ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isGuard ? 'Security Guard' : 'Unskilled Worker'}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600">{wrk.aadhaarHash}</td>
                        <td className="p-3.5 font-mono">{wrk.phone}</td>
                        <td className="p-3.5 font-bold text-emerald-700">₹{wrk.dailyWageRate} / দিন</td>
                        <td className="p-3.5 text-slate-600">{assignedAgency}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                            UIDAI Verified
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB CONTENT: DETAILED SYSTEM FUNCTIONALITY GUIDE (চিষ্টেমৰ কাৰ্য্যপ্ৰণালী) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'how_it_works' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span>শ্ৰমিকলিংক (IndustrialContractorWorkerLink) ব্যৱস্থাৰ সম্পূৰ্ণ কাৰ্য্যপ্ৰণালী (Complete System Architecture & Workflow)</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed max-w-4xl">
              এই প্ৰণালীটো উদ্যোগিক কাৰখানা, এপাৰ্টমেণ্ট ছচাইটি, বাণিজ্যিক দোকান আৰু অফিচত ঠিকাদাৰী শ্ৰমিক আৰু ছিকিউৰিটি গাৰ্ড ব্যৱস্থাপনাত হোৱা ভুৱা হাজিৰা, পিএফ/ইএছআই ফাঁকি আৰু আইনী জৰিমনা বন্ধ কৰিবলৈ নিৰ্মাণ কৰা হৈছে। তলত ইয়াৰ প্ৰতিটো কাৰ্য্যপ্ৰণালী কেনেকৈ কাম কৰে তাৰ ব্যাখ্যা দিয়া হ’ল:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Step 1: Registration & Dashboard Routing */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                  ১
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">পঞ্জীয়ন আৰু স্বয়ংক্ৰিয় ডেশ্ববৰ্ড ৰাউটিং (Registration & Routing)</h4>
                  <span className="text-[10px] text-indigo-600 font-bold">First Screen Authentication</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ৱেবছাইটৰ প্ৰথম স্ক্ৰীণত ইউজাৰে পঞ্জীয়ন বা লগইন কৰোঁতে তলৰ যিকোনো এটা পদবী নিৰ্বাচন কৰে আৰু ছিষ্টেমে তেওঁক সঠিক ডেশ্ববৰ্ডলৈ লৈ যায়:
              </p>
              <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                <div className="flex items-center justify-between text-slate-700">
                  <span>• Industry HR / Apartment / Shop / Office</span>
                  <span className="text-indigo-600 font-bold">👉 Owner Dashboard</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>• Labour Contractor / Security Agency</span>
                  <span className="text-purple-600 font-bold">👉 Agency Dashboard</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>• Unskilled Worker (শ্ৰমিক)</span>
                  <span className="text-emerald-600 font-bold">👉 Labour Dashboard</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>• Security Guard / Supervisor</span>
                  <span className="text-cyan-600 font-bold">👉 Guard / Supervisor Desk</span>
                </div>
              </div>
            </div>

            {/* Step 2: Zero-Ghost Gate Entry */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                  ২
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">গেট এন্ট্ৰি ও জীৰ’-ঘ’ষ্ট শ্ৰমিক সুৰক্ষা (Zero Ghost Worker Gate Sentry)</h4>
                  <span className="text-[10px] text-emerald-600 font-bold">Biometric & Masked Aadhaar</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                কাৰখানা বা এপাৰ্টমেণ্টৰ গেটত কৰ্তব্যৰত নিৰাপত্তাৰক্ষী আৰু ছুপাৰভাইজাৰে মোবাইলৰ জৰিয়তে শ্ৰমিকৰ মাস্কড আধাৰ আৰু কিউআৰ স্কেন কৰি গেট এন্ট্ৰি লয়:
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                <li>কোনো এজন শ্ৰমিকৰ নাম দুবাৰ বা ভুৱাকৈ এন্ট্ৰি হ’ব নোৱাৰে (Duplicate check active)।</li>
                <li>নিৰাপত্তাৰক্ষীয়ে প্ৰৱেশ আৰু প্ৰস্থান সময় চেকেণ্ডৰ ভিতৰত ষ্টেম্প কৰে।</li>
                <li>ছুপাৰভাইজাৰে বাস্তৱ হাজিৰা (Muster Roll) অনুমোদন নকৰালৈকে হাজিৰা ফাইনেল নহয়।</li>
              </ul>
            </div>

            {/* Step 3: Compliance-Locked Billing */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center text-sm">
                  ৩
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">অনুপালন-লকড বিলিং ব্যৱস্থা (Compliance-Locked Billing Engine)</h4>
                  <span className="text-[10px] text-rose-600 font-bold">Zero Statutory Evasion</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                এইটোৱেই শ্ৰমিকলিংকৰ আটাইতকৈ শক্তিশালী আইনী সুবিধা। ঠিকাদাৰে যেতিয়া মাহৰ শেষত উদ্যোগ বা এপাৰ্টমেণ্ট মালিকক বিল দিয়ে:
              </p>
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-950 space-y-1">
                <strong>ত্ৰিস্তৰীয় তলা (Triple Lock):</strong>
                <p>
                  ঠিকাদাৰে চৰকাৰী <strong>EPFO</strong> আৰু <strong>ESIC</strong> ৰ ডিজিটেল চালান (TRACES PDF) আপলোড কৰিবই লাগিব। অন্যথা চফট্ৱেৰে মালিকৰ অনুমোদন বুটামটো সম্পূৰ্ণৰূপে লক কৰি ৰাখে। ইয়াৰ দ্বাৰা মালিক আইনী জৰিমনা আৰু শাস্তিৰ পৰা মুক্ত থাকে।
                </p>
              </div>
            </div>

            {/* Step 4: Micro-SaaS Revenue Model */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-sm">
                  ৪
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">₹১ প্ৰতি শ্ৰমিক প্ৰতিদিন মাইক্ৰ’-ছাচ মডেল (₹1/Worker/Day Revenue)</h4>
                  <span className="text-[10px] text-amber-600 font-bold">High-Volume SaaS Monetization</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ভাৰতীয় শ্ৰম বজাৰৰ বাবে উপযোগী অতি সুলভ আৰু বিশাল লাভজনক ব্যৱসায়িক আৰ্হি:
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                <li>প্ৰতিজন কৰ্মৰত শ্ৰমিকৰ এদিনৰ হাজিৰাৰ বিপৰীতে মাত্ৰ ₹১ মাচুল ধাৰ্য্য কৰা হয়।</li>
                <li>এজন ঠিকাদাৰে ১০০ জন শ্ৰমিক যোগান ধৰিলে মাহে ৩,০০০ টকা আৰু বছৰি ৩৬,০০০ টকা।</li>
                <li>অসম আৰু উত্তৰ-পূৰ্বাঞ্চলৰ উদ্যোগ আৰু চাহ বাগিচাসমূহ সংযোগ হ’লে মাহেকীয়া লক্ষাধিক টকাৰ স্বয়ংক্ৰিয় ৰাজহ আহৰণ।</li>
              </ul>
            </div>

            {/* Step 5: CLRA Form XVI/XVII Government Labor Audit */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm">
                  ৫
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">চৰকাৰী শ্ৰম পৰিদৰ্শন আৰু অডিট (Labor Law Audits & CLRA Form XVI/XVII)</h4>
                  <span className="text-[10px] text-slate-600 font-bold">Factories Act, 1948 & CLRA Act, 1970</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                চৰকাৰী শ্ৰম পৰিদৰ্শকে (Labour Officer) যেতিয়া কাৰখানা বা প্ৰতিষ্ঠানত পৰিদৰ্শন কৰে, তেওঁলোকে পুৰণি কাগজৰ বহী বিচাৰি হাবাথুৰি খাব নালাগে। চিষ্টেমৰ পৰা একেটা ক্লিকতে:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="block text-slate-900 mb-1">CLRA Form XVI:</strong>
                  <span className="text-slate-600">ঠিকাদাৰৰ পঞ্জীয়ন আৰু অনুজ্ঞাপত্ৰৰ আনুষ্ঠানিক ডিজিটেল পঞ্জী।</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="block text-slate-900 mb-1">CLRA Form XVII:</strong>
                  <span className="text-slate-600">শ্ৰমিকৰ দৈনিক হাজিৰা বহী (Muster Roll) আৰু অভাৰটাইম অডিট।</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="block text-slate-900 mb-1">EPFO / ESIC Challan:</strong>
                  <span className="text-slate-600">চৰকাৰী কোষাগাৰত শ্ৰমিকৰ কল্যাণ পুঁজি জমাৰ প্ৰত্যক্ষ প্ৰমাণ।</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: ADD NEW ENTITY (INDUSTRY, AGENCY, WORKER) */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  +
                </div>
                <h3 className="font-bold text-slate-900 text-sm">নতুন পঞ্জীয়ন অন্তৰ্ভুক্ত কৰক</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEntity} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">পঞ্জীয়নৰ প্ৰকাৰ বাছক:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddEntityType('industry');
                      setNewCategory('Industry HR');
                    }}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      addEntityType === 'industry'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🏭 প্ৰতিষ্ঠান
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddEntityType('contractor');
                      setNewCategory('Labour Contractor');
                    }}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      addEntityType === 'contractor'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🏢 সংস্থা/ঠিকাদাৰ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddEntityType('worker');
                      setNewCategory('Unskilled Worker');
                    }}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      addEntityType === 'worker'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    👤 শ্ৰমিক/গাৰ্ড
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  {addEntityType === 'industry' ? 'প্ৰতিষ্ঠানৰ নাম (Name):' :
                   addEntityType === 'contractor' ? 'সংস্থাৰ নাম (Agency Name):' :
                   'শ্ৰমিক বা নিৰাপত্তাৰক্ষীৰ নাম:'}
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেনে: Brahmaputra Industries Ltd"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">উপ-শ্ৰেণী (Sub-category):</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {addEntityType === 'industry' && (
                    <>
                      <option value="Industry HR">Industry HR (কাৰখানা / উদ্যোগ)</option>
                      <option value="Apartment Owner">Apartment Owner (আৱাসিক এপাৰ্টমেণ্ট)</option>
                      <option value="Shop Owner">Shop Owner (দোকান / ব্যৱসায়িক কেন্দ্ৰ)</option>
                      <option value="Office">Office (ব্যক্তিগত কাৰ্যালয় / অফিচ)</option>
                    </>
                  )}
                  {addEntityType === 'contractor' && (
                    <>
                      <option value="Labour Contractor">Labour Contractor (শ্ৰমিক যোগানকাৰী ঠিকাদাৰ)</option>
                      <option value="Security Agency">Security Agency (নিৰাপত্তা সংস্থা - PSARA)</option>
                    </>
                  )}
                  {addEntityType === 'worker' && (
                    <>
                      <option value="Unskilled Worker">Unskilled Worker (অদক্ষ শ্ৰমিক)</option>
                      <option value="Security Guard (Unarmed)">Security Guard (Unarmed নিৰাপত্তাৰক্ষী)</option>
                      <option value="Security Guard">Security Guard (সাধাৰণ নিৰাপত্তাৰক্ষী)</option>
                      <option value="Security Supervisor">Security Supervisor (নিৰাপত্তা ছুপাৰভাইজাৰ)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">ফোন / ম’বাইল নম্বৰ:</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="9864012345"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium font-mono"
                />
              </div>

              {addEntityType !== 'worker' && (
                <div>
                  <label className="block text-slate-600 font-bold mb-1">স্থান / জিলা (Location):</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Guwahati, Assam"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  বাতিল কৰক
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  সংৰক্ষণ কৰক
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
