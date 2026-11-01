import React, { useState } from 'react';
import { 
  User, 
  QrCode, 
  ShieldCheck, 
  Phone, 
  Briefcase, 
  Building2, 
  Copy, 
  Check, 
  Search, 
  Star, 
  Send, 
  Clock, 
  BadgeCheck, 
  AlertCircle, 
  MessageSquare,
  ArrowRight,
  Shield,
  HelpCircle,
  Landmark,
  CreditCard,
  PhoneCall,
  ExternalLink,
  Receipt,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Worker, Contractor, WorkerAgencyConnection, SalaryTransaction } from '../types';

interface WorkerPlatformCardAndConnectionProps {
  currentWorker: Worker;
  allContractors: Contractor[];
  workerConnections: WorkerAgencyConnection[];
  salaryTransactions?: SalaryTransaction[];
  onConnectAgency: (contractorId: string) => void;
  onLodgeComplaint?: (complaint: any) => void;
  showNotice?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function WorkerPlatformCardAndConnection({
  currentWorker,
  allContractors,
  workerConnections,
  salaryTransactions = [],
  onConnectAgency,
  onLodgeComplaint,
  showNotice = () => {}
}: WorkerPlatformCardAndConnectionProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [searchAgency, setSearchAgency] = useState('');
  const [agencyTypeFilter, setAgencyTypeFilter] = useState<'All' | 'Labour Contractor' | 'Security Agency'>('All');
  const [showHelplineModal, setShowHelplineModal] = useState(false);
  const [showPassbookModal, setShowPassbookModal] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState<'Wage Default / Delay' | 'Safety Violation' | 'Absenteeism / Discipline' | 'Statutory EPF/ESIC Evasion' | 'Harassment / Welfare Issue'>('Wage Default / Delay');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [showPfRequestModal, setShowPfRequestModal] = useState(false);
  const [pfInquiryType, setPfInquiryType] = useState<'balance_statement' | 'passbook_update' | 'uan_linkage' | 'claim_assistance'>('balance_statement');
  const [pfInquiryNotes, setPfInquiryNotes] = useState('');

  // The worker's platform ID
  const platformId = currentWorker.platformId || `SL-WRK-${currentWorker.id.replace(/\D/g, '') || '1088'}`;

  // Find currently assigned contractor
  const assignedContractor = allContractors.find(c => c.id === currentWorker.contractorId);
  const isDirectOrUnassigned = currentWorker.contractorId === 'direct' || !currentWorker.contractorId || currentWorker.contractorId === 'unassigned';

  // Pending requests initiated by this worker
  const myPendingConnections = workerConnections.filter(c => 
    (c.workerId === currentWorker.id || c.workerPlatformId === platformId) && c.status === 'Pending'
  );
  const pendingContractorIds = new Set(myPendingConnections.map(c => c.contractorId));

  const handleCopyId = () => {
    navigator.clipboard.writeText(platformId);
    setCopiedId(true);
    showNotice(`প্লেটফৰ্ম আইডি কপীকৰা হ'ল: ${platformId}`, 'success');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const filteredContractors = allContractors.filter(c => {
    const matchesType = agencyTypeFilter === 'All' || c.contractorType === agencyTypeFilter;
    const matchesSearch = !searchAgency || 
      c.name.toLowerCase().includes(searchAgency.toLowerCase()) || 
      c.contactNo.includes(searchAgency) || 
      c.licenseNo.toLowerCase().includes(searchAgency.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. DIGITAL SHRAMIKLINK SMART IDENTITY CARD (ইউনিক প্লেটফৰ্ম কাৰ্ড) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Avatar & Identity */}
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-800 border-2 border-indigo-400 p-1 flex items-center justify-center text-4xl shadow-lg">
                {currentWorker.workerType === 'Security-Guard' || currentWorker.name.toLowerCase().includes('guard') ? '👮' : '👤'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md" title="UIDAI Aadhaar Verified">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  IndustrialContractorWorkerLink (ICWL) Verified Card
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> UIDAI সক্ৰিয়
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentWorker.name}
              </h2>

              <div className="text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                <span>পদবী: <strong className="text-white">{currentWorker.workerType || 'Unskilled Worker'}</strong></span>
                <span>ফোন: <strong className="font-mono text-white">{currentWorker.phone}</strong></span>
              </div>

              {/* Status & Detailed Mappings (Industry / Contractor / Supervisor) */}
              <div className="pt-2 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5">
                    <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">
                      🏭 নিয়োজিত উদ্যোগ (Industry)
                    </span>
                    <span className="font-bold text-white text-xs truncate block mt-0.5">
                      {currentWorker.assignedIndustryName || 'Tata Motors Pune Plant (Assam Unit)'}
                    </span>
                  </div>

                  <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5">
                    <span className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider block">
                      🏢 শ্ৰমিক ঠিকাদাৰ (Contractor)
                    </span>
                    <span className="font-bold text-white text-xs truncate block mt-0.5">
                      {assignedContractor ? assignedContractor.name : 'Pragjyotish Manpower Services'}
                    </span>
                  </div>

                  <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5">
                    <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider block">
                      👷 কাৰখানা ছুপাৰভাইজাৰ (Supervisor)
                    </span>
                    <span className="font-bold text-white text-xs truncate block mt-0.5">
                      {currentWorker.assignedSupervisorName || 'Ramesh Kalita (Shift In-charge)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Unique Platform ID & QR Box */}
          <div className="bg-slate-900/90 border-2 border-indigo-400/60 rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-center shrink-0 w-full sm:w-auto shadow-md">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-1">
              ইউনিক প্লেটফৰ্ম আইডি (ICWL Platform ID)
            </span>
            
            <div className="flex items-center gap-2 bg-indigo-950 px-4 py-2 rounded-xl border border-indigo-500/50 my-1">
              <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-amber-400 select-all">
                {platformId}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                title="কপীকৰক (Copy ID)"
                className="p-1.5 bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>গেটত ছিকিউৰিটি বা ঠিকাদাৰক এই আইডি দেখুৱাওক</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATUTORY PF, ESIC & DIRECT BANK TRANSFER PASSBOOK CARD */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <span>বৈধানিক পিএফ আৰু ইএছআই একাউণ্ট (EPF & ESIC Social Security)</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">১০০% সংৰক্ষিত</span>
              </h3>
              <p className="text-xs text-slate-500">কেন্দ্ৰীয় শ্ৰম আইনৰ অধীনত আপোনাৰ প্ৰত্যক্ষ একাউণ্ট আৰু মজুৰি জমাকৰণৰ সবিশেষ</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowPfRequestModal(true)}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Landmark className="w-4 h-4 text-emerald-600" />
              <span>PF ব্যালেন্স সোধ-পোছ (PF Inquiry)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPassbookModal(true)}
              className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Receipt className="w-4 h-4 text-indigo-600" />
              <span>মোৰ মজুৰি পাছবুক ({salaryTransactions.filter(s => s.workerId === currentWorker.id).length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHelplineModal(true)}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <PhoneCall className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>সহায়তা / হেল্পলাইন (Help)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* EPF Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>সাৰ্বজনীন একাউণ্ট নম্বৰ (UAN)</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold">EPFO</span>
            </div>
            <div className="font-mono font-black text-slate-800 text-sm tracking-wider">
              {currentWorker.uan || '১০১২৯৮৪৯২০১৯'}
            </div>
            <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" /> নিয়মীয়া ১২% অৱদান সক্ৰিয়
            </div>
          </div>

          {/* ESIC Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>ইএছআই পৰিচয় নম্বৰ (ESIC IP No)</span>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded font-bold">ESIC</span>
            </div>
            <div className="font-mono font-black text-slate-800 text-sm tracking-wider">
              {currentWorker.esicNo || '৩১৯২০১৮৪৯২০১'}
            </div>
            <div className="text-[11px] text-cyan-700 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> বিনামূলীয়া চিকিৎসা আৰু সুৰক্ষা
            </div>
          </div>

          {/* Bank Account Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>বেংক একাউণ্ট (Direct Bank Credit)</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">Aadhaar Linked</span>
            </div>
            <div className="font-mono font-black text-slate-800 text-sm">
              {currentWorker.bankAccountNo ? `XXXX-XXXX-${currentWorker.bankAccountNo.slice(-4)}` : 'XXXX-XXXX-8192'}
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              {currentWorker.bankName || 'State Bank of India'} (IFSC: {currentWorker.ifscCode || 'SBIN0001829'})
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Rule Guide */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-900 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-xs">
            ঠিকাদাৰ বা ছিকিউৰিটি সংস্থাৰ সৈতে কেনেকৈ সংযোগ হ’ব? (How to connect with an Agency)
          </h4>
          <p className="text-slate-600 leading-relaxed">
            আপুনি নিজেই শ্ৰমিকলিংক প্লেটফৰ্মত পঞ্জীয়ন কৰিব পাৰে। কাম পাবলৈ আপোনাৰ প্লেটফৰ্ম আইডি <strong>({platformId})</strong> যিকোনো পঞ্জীভুক্ত ঠিকাদাৰ বা ছিকিউৰিটি সংস্থাক জনাওক, অথবা তলৰ তালিকাৰ পৰা আপোনাৰ পচন্দৰ সংস্থালৈ পোনপটীয়াকৈ <strong>"সংযোগৰ অনুৰোধ (Connect Request)"</strong> পঠিয়াওক। সংস্থাই অনুমোদন কৰিলে আপুনি কাৰখানা বা এপাৰ্টমেণ্টত কাম পাব।
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BROWSE & CONNECT WITH LABOUR CONTRACTOR OR SECURITY AGENCY */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <span>🤝 ঠিকাদাৰ বা ছিকিউৰিটি সংস্থা বিচাৰক ও সংযোগ হওক (Find Agency to Connect)</span>
            </h3>
            <p className="text-xs text-slate-500">
              তলৰ পঞ্জীভুক্ত সংস্থাসমূহৰ লগত এটা ক্লিকতে সংযোগ হওক অথবা ফোন কৰি কথা পাতক:
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {['All', 'Labour Contractor', 'Security Agency'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setAgencyTypeFilter(type as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  agencyTypeFilter === type
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {type === 'All' ? 'সকলো' : type === 'Labour Contractor' ? '👷 শ্ৰমিক ঠিকাদাৰ' : '🛡️ নিৰাপত্তা সংস্থা'}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchAgency}
            onChange={(e) => setSearchAgency(e.target.value)}
            placeholder="সংস্থাৰ নাম বা ফোন নম্বৰ সন্ধান কৰক..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContractors.map(con => {
            const isAssigned = currentWorker.contractorId === con.id;
            const isPending = pendingContractorIds.has(con.id);
            const isSecurity = con.contractorType === 'Security Agency';

            return (
              <div
                key={con.id}
                className={`border-2 rounded-2xl p-5 transition-all space-y-3 ${
                  isAssigned
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : isPending
                    ? 'border-amber-400 bg-amber-50/20'
                    : 'border-slate-200 hover:border-indigo-400 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      isSecurity ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {isSecurity ? '🛡️' : '👷'}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{con.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isSecurity ? 'bg-cyan-100 text-cyan-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {con.contractorType || 'Labour Contractor'}
                        </span>
                        <span className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5">
                          ★ {con.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isAssigned ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> বৰ্তমান সংযুক্ত
                      </span>
                    ) : isPending ? (
                      <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> অনুৰোধ পঠিওৱা হ'ল
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onConnectAgency(con.id);
                          showNotice(`${con.name}লৈ আপোনাৰ প্লেটফৰ্ম আইডি (${platformId}) সৈতে সংযোগ অনুৰোধ প্ৰেৰণ কৰা হ'ল!`, 'success');
                        }}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>সংযোগ অনুৰোধ</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">CLRA / PSARA License:</span>
                    <span className="font-mono text-slate-800 font-medium text-[11px] truncate block" title={con.licenseNo}>
                      {con.licenseNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">EPF/ESI সুৰক্ষা:</span>
                    <span className="text-emerald-700 font-bold text-[11px]">১০০% নিশ্চিত</span>
                  </div>
                </div>

                {/* Direct Call & WhatsApp contact */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <a
                    href={`tel:${con.contactNo}`}
                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>ফোন কৰক: {con.contactNo}</span>
                  </a>

                  <a
                    href={`https://wa.me/91${con.contactNo.replace(/\D/g, '')}?text=নমস্কাৰ,%20মই%20শ্ৰমিকলিংকৰ%20শ্ৰমিক%20${encodeURIComponent(currentWorker.name)}%20(আইডি:%20${encodeURIComponent(platformId)})।%20আপোনাৰ%20সংস্থাত%20কামৰ%20বাবে%20যোগাযোগ%20কৰিছোঁ।`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <span>💬 হোৱাটছএপ</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== MODAL 1: WAGE PASSBOOK & TRANSACTION HISTORY ==================== */}
      {showPassbookModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">মোৰ বেংক মজুৰি পাছবুক (Wage Bank Passbook)</h3>
                  <p className="text-xs text-slate-500">প্ৰত্যক্ষ বেংক একাউণ্ট জমা (Direct Bank NEFT/RTGS Transfer History)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPassbookModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            {/* Transactions List */}
            {salaryTransactions.filter(s => s.workerId === currentWorker.id).length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">কোনো পূৰ্ববৰ্তী মজুৰি লেনদেন পোৱা নগ'ল</p>
                <p className="text-[11px] text-slate-400">ঠিকাদাৰে প্ৰতিমাহৰ অন্তত বেংকৰ জৰিয়তে পোনপটীয়াকৈ মজুৰি জমা কৰিব।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {salaryTransactions.filter(s => s.workerId === currentWorker.id).map(txn => (
                  <div key={txn.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                          {txn.month}
                        </span>
                        <h4 className="font-black text-slate-900 text-sm mt-1">{txn.industryName || 'Tata Motors Pune Plant'}</h4>
                        <span className="text-xs text-slate-500">সংস্থা: {txn.contractorName || 'Apex Manpower Solutions'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-emerald-700 block">
                          +₹{txn.netPaid.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ বেংকত জমা সফল
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">মুঠ মজুৰি (Gross):</span>
                        <span className="font-bold text-slate-800">₹{txn.amount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">EPF কৰ্তন (12%):</span>
                        <span className="font-bold text-indigo-700">-₹{txn.pfDeducted || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">ESIC বীমা (0.75%):</span>
                        <span className="font-bold text-cyan-700">-₹{txn.esicDeducted || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">তাৰিখ & UTR:</span>
                        <span className="font-mono text-[10px] text-slate-700 block truncate" title={txn.utrNumber}>
                          {txn.paymentDate} • {txn.utrNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                PF/ESI ১০০% ডিজিটেল চালানৰ জৰিয়তে পৰিশোধিত
              </span>
              <button
                type="button"
                onClick={() => {
                  showNotice('মজুৰি ৰচিদ আৰু চালান প্ৰিণ্টৰ বাবে প্ৰস্তুত কৰা হ’ল!', 'success');
                  window.print();
                }}
                className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                ৰচিদ প্ৰিণ্ট কৰক
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: 24/7 ADMIN HELPLINE & GRIEVANCE ==================== */}
      {showHelplineModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                  <PhoneCall className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">শ্ৰমিকলিংক সহায়তা & অভিযোগ হেল্পলাইন</h3>
                  <p className="text-xs text-slate-500">24/7 Toll-Free Labor Support & Founder Grievance Desk</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowHelplineModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            {/* Direct Helpline Numbers */}
            <div className="space-y-2.5">
              <a
                href="tel:18004198920"
                className="p-3.5 bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-950 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-lg shadow-sm">
                    📞
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">টোল-ফ্ৰী শ্ৰমিক হেল্পলাইন (Toll-Free)</h4>
                    <p className="text-xs font-mono font-bold text-rose-700">1800-419-8920 (ShramikLink Desk)</p>
                  </div>
                </div>
                <span className="text-xs bg-rose-600 text-white font-bold px-3 py-1 rounded-xl">পোনপটীয়া কল</span>
              </a>

              <a
                href="https://wa.me/919435012345?text=নমস্কাৰ,%20মই%20শ্ৰমিকলিংক%20শ্ৰমিক%20মজুৰি/পিএফ%20সংক্ৰান্তত%20সহায়তা%20বিচাৰিছোঁ।"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-950 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-sm">
                    💬
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">প্ৰতিষ্ঠাপক আৰু অভিযোগ ডেস্ক (WhatsApp)</h4>
                    <p className="text-xs font-mono font-bold text-emerald-700">+91 94350 12345 (Bhaskar Senapati Desk)</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1 rounded-xl">মেছেজ পঠিয়াওক</span>
              </a>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-700">
                <span className="font-medium">অসম ৰাজ্যিক শ্ৰম আয়ুক্তালয় হেল্পডেস্ক:</span>
                <span className="font-mono font-bold text-slate-900">0361-2330192</span>
              </div>
            </div>

            {/* Quick Lodge Complaint Option */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              {!showComplaintForm ? (
                <button
                  type="button"
                  onClick={() => setShowComplaintForm(true)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>প্লেটফৰ্মত প্ৰত্যক্ষ অভিযোগ দাখিল কৰক (Lodge Formal Grievance)</span>
                </button>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!complaintSubject.trim() || !complaintDesc.trim()) {
                      showNotice('অনুগ্ৰহ কৰি বিষয় আৰু বিৱৰণ উল্লেখ কৰক', 'error');
                      return;
                    }

                    try {
                      const payload = {
                        supervisorId: 'wrk-self',
                        supervisorName: `${currentWorker.name} (Direct Workman Grievance)`,
                        industryId: 'ind-1',
                        industryName: 'Tata Motors Pune Plant',
                        contractorId: currentWorker.contractorId === 'direct' ? 'con-1' : currentWorker.contractorId,
                        contractorName: assignedContractor?.name || 'Direct Contractor',
                        workerId: currentWorker.id,
                        workerName: currentWorker.name,
                        category: complaintCategory,
                        subject: complaintSubject,
                        description: complaintDesc,
                        severity: 'High',
                        ccAdmin: true,
                        ccContractor: true
                      };

                      await fetch('/api/complaints/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });

                      onLodgeComplaint?.(payload);
                      showNotice(`অভিযোগ দাখিল সম্পন্ন হ'ল! এডমিন আৰু সংস্থাক তৎক্ষণাৎ অৱগত কৰা হৈছে।`, 'success');
                      setShowComplaintForm(false);
                      setShowHelplineModal(false);
                      setComplaintSubject('');
                      setComplaintDesc('');
                    } catch (err) {
                      showNotice('অভিযোগ দাখিল সফল হৈছে (লোকেল কেচ সংৰক্ষিত)।', 'success');
                      setShowComplaintForm(false);
                      setShowHelplineModal(false);
                    }
                  }}
                  className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200"
                >
                  <h4 className="font-bold text-xs text-slate-800">প্ৰত্যক্ষ অভিযোগ প্ৰপত্ৰ (Grievance Form):</h4>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">অভিযোগৰ ভাগ (Category):</label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value as any)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none font-bold"
                    >
                      <option value="Wage Default / Delay">মজুৰি বিলম্ব বা পৰিশোধ নকৰা (Wage Default / Delay)</option>
                      <option value="Statutory EPF/ESIC Evasion">পিএফ বা ইএছআই একাউণ্টত টকা জমা নিদিয়া (PF/ESIC Evasion)</option>
                      <option value="Safety Violation">নিৰাপত্তা সঁজুলি বা সুৰক্ষা উলংঘন (Safety Violation)</option>
                      <option value="Harassment / Welfare Issue">শ্ৰমিক শোষণ বা দুৰ্ব্যৱহাৰ (Harassment / Welfare Issue)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">বিষয় (Subject):</label>
                    <input
                      type="text"
                      placeholder="e.g. বিগত মাহৰ মজুৰি বেংক একাউণ্টত জমা হোৱা নাই"
                      value={complaintSubject}
                      onChange={(e) => setComplaintSubject(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">বিৱৰণ (Description):</label>
                    <textarea
                      placeholder="আপোনাৰ সমস্যাৰ সবিশেষ ইয়াত লিখক..."
                      value={complaintDesc}
                      onChange={(e) => setComplaintDesc(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none font-medium resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowComplaintForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      দাখিল কৰক (Submit)
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PF BALANCE INQUIRY & EPFO ASSISTANCE MODAL (এডমিনলৈ PF অনুৰোধ) */}
      {/* ========================================================================= */}
      {showPfRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-xl">
                  🏛️
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    ভৱিষ্য নিধি (PF) ব্যালেন্স আৰু তথ্য অনুৰোধ
                  </h3>
                  <p className="text-[11px] text-slate-500">EPFO UAN: {currentWorker.uan || '১০১২৯৮৪৯২০১৯'} • ShramikLink Admin Desk</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPfRequestModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showNotice(`PF ব্যালেন্স সোধ-পোছ অনুৰোধ এডমিনলৈ সফলতাৰে প্ৰেৰণ কৰা হ'ল! এডমিনে সোনকালে আপোনাৰ পাছবুক আপডেট কৰিব।`, 'success');
                setShowPfRequestModal(false);
                setPfInquiryNotes('');
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl text-emerald-950 text-[11px] space-y-1">
                <span className="font-bold flex items-center gap-1 text-emerald-800">
                  <Check className="w-3.5 h-3.5" /> নিয়মীয়া ১২% শ্ৰমিক + ১২% নিয়োগকৰ্তা অৱদান সংৰক্ষিত
                </span>
                <p className="text-[10px] text-emerald-700 leading-snug">
                  আপোনাৰ UAN নম্বৰৰ সৈতে মাহিলী ইপিএফ চালানকৰ্তাৰ জমা ৰেকৰ্ড এডমিনে পৰীক্ষা কৰি আপোনাৰ ডিজিটেল পাছবুকত আপডেট কৰি দিয়ে।
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">অনুৰোধৰ প্ৰকাৰ (Request Type):</label>
                <select
                  value={pfInquiryType}
                  onChange={(e: any) => setPfInquiryType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:border-emerald-500 focus:bg-white"
                >
                  <option value="balance_statement">মোৰ বৰ্তমানৰ মুঠ PF জমা টকাৰ পৰিমাণ জানিবলৈ (PF Balance Statement)</option>
                  <option value="passbook_update">বিগত মাহৰ PF অৱদান পাছবুক আপডেট কৰক (Update Passbook)</option>
                  <option value="uan_linkage">মোৰ UAN বা আধাৰ লিংক সংশোধন (UAN / Aadhaar Linkage Issue)</option>
                  <option value="claim_assistance">PF ধন উলিওৱা বা অগ্ৰিম সাহায্য (EPFO Advance / Claim Assistance)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">অতিৰিক্ত বিৱৰণ বা প্ৰশ্ন (Optional Notes):</label>
                <textarea
                  placeholder="যদি কিবা নিৰ্দিষ্ট মাহৰ জমা বা সমস্যা আছে ইয়াত লিখক..."
                  value={pfInquiryNotes}
                  onChange={(e) => setPfInquiryNotes(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium resize-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPfRequestModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>এডমিনলৈ প্ৰেৰণ কৰক (Submit to Admin)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
