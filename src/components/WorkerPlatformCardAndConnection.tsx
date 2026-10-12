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
  HelpCircle
} from 'lucide-react';
import { Worker, Contractor, WorkerAgencyConnection } from '../types';

interface WorkerPlatformCardAndConnectionProps {
  currentWorker: Worker;
  allContractors: Contractor[];
  workerConnections: WorkerAgencyConnection[];
  onConnectAgency: (contractorId: string) => void;
  showNotice?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function WorkerPlatformCardAndConnection({
  currentWorker,
  allContractors,
  workerConnections,
  onConnectAgency,
  showNotice = () => {}
}: WorkerPlatformCardAndConnectionProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [searchAgency, setSearchAgency] = useState('');
  const [agencyTypeFilter, setAgencyTypeFilter] = useState<'All' | 'Labour Contractor' | 'Security Agency'>('All');

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
                  ShramikLink Verified Card
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

              {/* Status Badge */}
              <div className="pt-1">
                {assignedContractor ? (
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-500/40 inline-flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    সংযুক্ত সংস্থা: {assignedContractor.name} ({assignedContractor.contractorType || 'Labour Contractor'})
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-500/40 inline-flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    মুক্ত শ্ৰমিক (স্বতন্ত্ৰ - কোনো ঠিকাদাৰৰ লগত সংযুক্ত হোৱা নাই)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Unique Platform ID & QR Box */}
          <div className="bg-slate-900/90 border-2 border-indigo-400/60 rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-center shrink-0 w-full sm:w-auto shadow-md">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-1">
              ইউনিক প্লেটফৰ্ম আইডি (ShramikLink ID)
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
    </div>
  );
}
