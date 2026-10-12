import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Check, 
  Plus, 
  Phone, 
  ShieldCheck, 
  Building2, 
  Clock, 
  X, 
  BadgeCheck, 
  AlertCircle,
  Briefcase,
  Layers,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Worker, Contractor, WorkerAgencyConnection } from '../types';

interface ContractorPlatformWorkerPoolProps {
  contractor: Contractor;
  allWorkers: Worker[];
  workerConnections: WorkerAgencyConnection[];
  onAddNewWorker: (worker: Omit<Worker, 'id' | 'onboardingDate'>) => void;
  onClaimPlatformWorker: (workerId: string) => void;
  onAcceptWorkerRequest: (connectionId: string, workerId: string) => void;
  onRejectWorkerRequest: (connectionId: string) => void;
  showNotice?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function ContractorPlatformWorkerPool({
  contractor,
  allWorkers,
  workerConnections,
  onAddNewWorker,
  onClaimPlatformWorker,
  onAcceptWorkerRequest,
  onRejectWorkerRequest,
  showNotice = () => {}
}: ContractorPlatformWorkerPoolProps) {
  const [activeTab, setActiveTab] = useState<'my_workforce' | 'claim_pool' | 'requests'>('my_workforce');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Unskilled' | 'Security-Guard'>('All');

  // Add Worker Modal
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAadhaar4, setNewAadhaar4] = useState('');
  const [newRole, setNewRole] = useState<'Unskilled-Laborer' | 'Security-Guard' | 'Security-Supervisor'>('Unskilled-Laborer');
  const [newWage, setNewWage] = useState(480);

  // Workforce mapped to this contractor
  const myWorkers = allWorkers.filter(w => w.contractorId === contractor.id);

  // Platform workers who are currently independent (direct / unassigned)
  const unassignedPlatformWorkers = allWorkers.filter(w => 
    w.contractorId === 'direct' || !w.contractorId || w.contractorId === 'unassigned'
  );

  // Connection requests sent by workers to this specific contractor
  const incomingRequests = workerConnections.filter(c => 
    c.contractorId === contractor.id && c.status === 'Pending'
  );

  // Filtered lists
  const filteredMyWorkers = myWorkers.filter(w => {
    const isSecurity = w.workerType === 'Security-Guard' || w.name.toLowerCase().includes('guard');
    const matchesRole = roleFilter === 'All' || 
      (roleFilter === 'Unskilled' && !isSecurity) || 
      (roleFilter === 'Security-Guard' && isSecurity);
    const matchesSearch = !searchQuery || 
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.phone.includes(searchQuery) ||
      (w.platformId && w.platformId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const filteredClaimWorkers = unassignedPlatformWorkers.filter(w => {
    const isSecurity = w.workerType === 'Security-Guard' || w.name.toLowerCase().includes('guard');
    const matchesRole = roleFilter === 'All' || 
      (roleFilter === 'Unskilled' && !isSecurity) || 
      (roleFilter === 'Security-Guard' && isSecurity);
    const matchesSearch = !searchQuery || 
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.phone.includes(searchQuery) ||
      (w.platformId && w.platformId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      showNotice('অনুগ্ৰহ কৰি শ্ৰমিকৰ নাম আৰু ফোন নম্বৰ লিখক।', 'error');
      return;
    }

    const random4 = Math.floor(Math.random() * 9000 + 1000);
    const generatedPlatformId = newRole === 'Security-Guard' || newRole === 'Security-Supervisor'
      ? `SL-GRD-${random4}`
      : `SL-WRK-${random4}`;

    onAddNewWorker({
      name: newName,
      platformId: generatedPlatformId,
      phone: newPhone,
      aadhaarHash: `XXXX-XXXX-${newAadhaar4.slice(-4) || Math.floor(Math.random() * 9000 + 1000)}`,
      contractorId: contractor.id,
      skillType: 'Unskilled',
      workerType: newRole,
      dailyWageRate: newWage,
      status: 'Available',
      onboardingVerified: true
    });

    showNotice(`নতুন শ্ৰমিক সফলতাৰে এন্ট্ৰি কৰা হ'ল! ইউনিক আইডি: ${generatedPlatformId}`, 'success');
    setNewName('');
    setNewPhone('');
    setNewAadhaar4('');
    setShowAddWorkerModal(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-purple-200">
              Agency Workforce Hub
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {contractor.name}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>👥 শ্ৰমিক ও গাৰ্ড পৰিচালনা আৰু প্লেটফৰ্ম পুল (Agency Workforce & Platform Pool)</span>
          </h3>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            আপোনাৰ এজেন্সীত <strong>নতুন শ্ৰমিক পোনপটীয়াকৈ এন্ট্ৰি কৰক</strong> অথবা শ্ৰমিকলিংক প্লেটফৰ্মত ইতিমধ্যে পঞ্জীভুক্ত হৈ থকা <strong>স্বতন্ত্ৰ শ্ৰমিকক নিজৰ এজেন্সীৰ পুলত অন্তৰ্ভুক্ত (Claim / Add to Agency)</strong> কৰক।
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setShowAddWorkerModal(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ নতুন শ্ৰমিক / গাৰ্ড এন্ট্ৰি কৰক</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('my_workforce')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'my_workforce'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>মোৰ এজেন্সীৰ শ্ৰমিক তালিকা ({myWorkers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('claim_pool')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'claim_pool'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>প্লেটফৰ্মত থকা শ্ৰমিকক অন্তৰ্ভুক্ত কৰক ({unassignedPlatformWorkers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'requests'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>শ্ৰমিকৰ পৰা অহা অনুৰোধ</span>
            {incomingRequests.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono animate-pulse">
                {incomingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          {['All', 'Unskilled', 'Security-Guard'].map(rf => (
            <button
              key={rf}
              type="button"
              onClick={() => setRoleFilter(rf as any)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                roleFilter === rf
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {rf === 'All' ? 'সকলো' : rf === 'Unskilled' ? '👤 অদক্ষ শ্ৰমিক' : '👮 নিৰাপত্তাৰক্ষী'}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MY AGENCY'S CURRENT WORKFORCE */}
      {/* ========================================================================= */}
      {activeTab === 'my_workforce' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শ্ৰমিকৰ নাম, ফোন বা প্লেটফৰ্ম আইডি সন্ধান কৰক..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-bold">
              সক্ৰিয় শ্ৰমিক: {filteredMyWorkers.length} জন
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">প্লেটফৰ্ম আইডি (ID)</th>
                  <th className="p-3.5">শ্ৰমিকৰ নাম</th>
                  <th className="p-3.5">পদবী</th>
                  <th className="p-3.5">ফোন নম্বৰ</th>
                  <th className="p-3.5">মাস্কড আধাৰ</th>
                  <th className="p-3.5">দৈনিক মজুৰি</th>
                  <th className="p-3.5">ষ্টেটাছ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredMyWorkers.map(w => {
                  const isGuard = w.workerType === 'Security-Guard' || w.name.toLowerCase().includes('guard');
                  return (
                    <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-indigo-700">
                        {w.platformId || `SL-WRK-${w.id.replace(/\D/g, '') || '101'}`}
                      </td>
                      <td className="p-3.5 font-bold flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                          isGuard ? 'bg-cyan-100 text-cyan-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {isGuard ? '👮' : '👤'}
                        </div>
                        <span>{w.name}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isGuard ? 'bg-cyan-100 text-cyan-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {w.workerType || 'Unskilled Worker'}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono">{w.phone}</td>
                      <td className="p-3.5 font-mono text-slate-600">{w.aadhaarHash}</td>
                      <td className="p-3.5 font-bold text-emerald-700">₹{w.dailyWageRate} / দিন</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          w.status === 'Deployed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CLAIM / ABSORB PLATFORM WORKERS INTO AGENCY */}
      {/* ========================================================================= */}
      {activeTab === 'claim_pool' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
            <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm">প্লেটফৰ্মত পঞ্জীভুক্ত মুক্ত শ্ৰমিকৰ তালিকা (Platform Independent Worker Directory)</h4>
              <p className="text-emerald-800 leading-relaxed">
                তলৰ শ্ৰমিকসকলে নিজে শ্ৰমিকলিংকত পঞ্জীয়ন কৰিছে আৰু বৰ্তমান কোনো ঠিকাদাৰৰ লগত সংলগ্ন নহয়। আপুনি তেওঁলোকৰ প্লেটফৰ্ম আইডি বা ফোন নম্বৰ চাই <strong>"মোৰ এজেন্সীত অন্তৰ্ভুক্ত কৰক (Claim / Add to Agency)"</strong> বুটামত ক্লিক কৰি নিজৰ কৰ্মীদলত সংযোগ কৰিব পাৰে।
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="প্লেটফৰ্ম আইডি (যেনে SL-WRK-1004), নাম বা ফোন সন্ধান কৰক..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClaimWorkers.map(w => {
              const isGuard = w.workerType === 'Security-Guard' || w.name.toLowerCase().includes('guard');
              const pId = w.platformId || `SL-WRK-${w.id.replace(/\D/g, '') || '102'}`;

              return (
                <div
                  key={w.id}
                  className="bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-2xl p-5 shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        isGuard ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isGuard ? '👮' : '👤'}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{w.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-bold text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            {pId}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isGuard ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {w.workerType || 'Unskilled Worker'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClaimPlatformWorker(w.id);
                        showNotice(`${w.name} (${pId})ক আপোনাৰ এজেন্সীত সফলতাৰে অন্তৰ্ভুক্ত কৰা হ'ল!`, 'success');
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>এজেন্সীত সুমুৱাওক</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">ফোন নম্বৰ:</span>
                      <span className="font-mono text-slate-800 font-medium text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {w.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">দৈনিক মজুৰি হাৰ:</span>
                      <span className="font-bold text-emerald-700 text-[11px]">₹{w.dailyWageRate} / দিন</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">আধাৰ ভেৰিফিকেচন:</span>
                      <span className="text-emerald-700 font-bold text-[11px]">UIDAI সক্ৰিয়</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">অনব’ৰ্ডিং তাৰিখ:</span>
                      <span className="font-mono text-slate-600 text-[11px]">{w.onboardingDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INCOMING WORKER CONNECTION REQUESTS */}
      {/* ========================================================================= */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                তলৰ শ্ৰমিকসকলে তেওঁলোকৰ ইউনিক প্লেটফৰ্ম আইডি দেখুৱাই আপোনাৰ এজেন্সীত কামৰ বাবে আবেদন কৰিছে:
              </span>
            </div>
            <span className="font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full shrink-0">
              {incomingRequests.length} আবেদন
            </span>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-2">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">কোনো অমীমাংসিত শ্ৰমিক আবেদন নাই</h4>
              <p className="text-xs text-slate-500">সকলো অনুৰোধ সমাধান কৰা হৈছে।</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map(req => (
                <div
                  key={req.id}
                  className="bg-white border-2 border-amber-300 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 text-sm">{req.workerName}</h4>
                      <span className="font-mono font-bold text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200">
                        {req.workerPlatformId}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {req.workerRole}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>ফোন: <strong className="font-mono text-slate-800">{req.workerPhone}</strong></span>
                      <span>তাৰিখ: <strong className="font-mono text-slate-800">{req.requestedAt}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onRejectWorkerRequest(req.id);
                        showNotice(`${req.workerName}ৰ অনুৰোধ নাকচ কৰা হ'ল।`, 'info');
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      নাকচ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onAcceptWorkerRequest(req.id, req.workerId);
                        showNotice(`স্বীকাৰ কৰা হ'ল! ${req.workerName} এতিয়া আপোনাৰ এজেন্সীত অন্তৰ্ভুক্ত।`, 'success');
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>স্বীকাৰ ও অন্তৰ্ভুক্ত কৰক</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DIRECT ADD NEW WORKER */}
      {/* ========================================================================= */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-600" />
                <span>নতুন শ্ৰমিক / নিৰাপত্তাৰক্ষী এন্ট্ৰি কৰক</span>
              </h3>
              <button 
                onClick={() => setShowAddWorkerModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorker} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">শ্ৰমিক বা গাৰ্ডৰ সম্পূৰ্ণ নাম:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেনে: গোপাল দাস"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">পদবী বা শ্ৰেণী:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                >
                  <option value="Unskilled-Laborer">Unskilled Laborer (অদক্ষ কাৰখানা শ্ৰমিক)</option>
                  <option value="Security-Guard">Security Guard (সাধাৰণ / অস্ত্ৰবিহীন নিৰাপত্তাৰক্ষী)</option>
                  <option value="Security-Supervisor">Security Supervisor (নিৰাপত্তা ছুপাৰভাইজাৰ)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">ফোন / ম’বাইল নম্বৰ:</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="9864012345"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">আধাৰ নম্বৰৰ শেষৰ ৪টা সংখ্যা (Last 4 Digits):</label>
                <input
                  type="text"
                  maxLength={4}
                  value={newAadhaar4}
                  onChange={(e) => setNewAadhaar4(e.target.value.replace(/\D/g, ''))}
                  placeholder="8920"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">দৈনিক মজুৰি হাৰ (INR/Day):</label>
                <input
                  type="number"
                  min="350"
                  required
                  value={newWage}
                  onChange={(e) => setNewWage(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWorkerModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  বাতিল কৰক
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-xs"
                >
                  সংৰক্ষণ ও এন্ট্ৰি কৰক
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
