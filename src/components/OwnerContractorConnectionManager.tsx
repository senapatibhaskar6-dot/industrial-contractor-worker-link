import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  Check, 
  X, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Phone, 
  Star, 
  Lock, 
  AlertCircle, 
  Send, 
  UserCheck,
  FileText,
  BadgeCheck,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Industry, Contractor, IndustryContractorConnection } from '../types';

interface OwnerContractorConnectionManagerProps {
  activeIndustry: Industry;
  allContractors: Contractor[];
  connections: IndustryContractorConnection[];
  onApproveConnection: (connectionId: string) => void;
  onRejectConnection: (connectionId: string) => void;
  onInviteContractor: (contractorId: string, notes?: string) => void;
  onDisconnectContractor?: (connectionId: string) => void;
  showNotice?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function OwnerContractorConnectionManager({
  activeIndustry,
  allContractors,
  connections,
  onApproveConnection,
  onRejectConnection,
  onInviteContractor,
  onDisconnectContractor,
  showNotice = () => {}
}: OwnerContractorConnectionManagerProps) {
  const [activeTab, setActiveTab] = useState<'connected' | 'requests' | 'browse'>('connected');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Labour Contractor' | 'Security Agency'>('All');
  
  // Custom Invite modal
  const [selectedContractorForInvite, setSelectedContractorForInvite] = useState<Contractor | null>(null);
  const [inviteNotes, setInviteNotes] = useState('');

  // Filter connections relevant to this active industry
  const industryConnections = connections.filter(c => c.industryId === activeIndustry.id);
  const connectedAgencies = industryConnections.filter(c => c.status === 'Connected');
  const pendingRequests = industryConnections.filter(c => c.status === 'Pending' && c.initiatedBy === 'contractor');
  const sentInvites = industryConnections.filter(c => c.status === 'Pending' && c.initiatedBy === 'industry');

  // Set of connected contractor IDs
  const connectedContractorIds = new Set(connectedAgencies.map(c => c.contractorId));
  const pendingContractorIds = new Set(industryConnections.filter(c => c.status === 'Pending').map(c => c.contractorId));

  // Browse contractors not yet connected
  const browseContractors = allContractors.filter(c => {
    const matchesCategory = categoryFilter === 'All' || c.contractorType === categoryFilter;
    const matchesSearch = !searchQuery || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.licenseNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactNo.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContractorForInvite) return;

    onInviteContractor(
      selectedContractorForInvite.id, 
      inviteNotes || `${activeIndustry.name} দ্বাৰা শ্ৰমিক/গাৰ্ড যোগানৰ বাবে আমন্ত্ৰণ জনোৱা হৈছে।`
    );
    setSelectedContractorForInvite(null);
    setInviteNotes('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
      {/* Header with Legal Rule Notice */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-indigo-200">
              Agency Governance & Authorization
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              CLRA & PSARA Compliance
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>🏢 ঠিকাদাৰ ও ছিকিউৰিটি সংস্থা সংযোগ পৰিচালনা (Authorized Agencies)</span>
          </h3>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            <strong>আইনী নিয়ম:</strong> আপোনাৰ প্ৰতিষ্ঠান ({activeIndustry.name})ৰ বাবে কেৱল এই পেনেলৰ পৰা <strong>অনুমোদন (Allow / Connect)</strong> কৰা ঠিকাদাৰ বা ছিকিউৰিটি সংস্থাইহে শ্ৰমিক আৰু গাৰ্ড যোগান ধৰিব পাৰিব।
          </p>
        </div>

        {/* Quick Stats Chips */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">অনুমোদিত সংস্থা</span>
            <span className="text-base font-black text-indigo-600">{connectedAgencies.length} সক্ৰিয়</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] text-amber-700 font-bold block uppercase">আবেদন বাকী</span>
            <span className="text-base font-black text-amber-700">{pendingRequests.length} নতুন</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('connected')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'connected'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BadgeCheck className="w-4 h-4" />
            <span>মোৰ অনুমোদিত সংস্থাসমূহ ({connectedAgencies.length})</span>
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
            <span>ঠিকাদাৰৰ সংযোগ অনুৰোধ</span>
            {pendingRequests.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono animate-pulse">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>নতুন সংস্থা বিচাৰক ও সংযোগ কৰক</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          {['All', 'Labour Contractor', 'Security Agency'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat as any)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat === 'All' ? 'সকলো' : cat === 'Labour Contractor' ? '👷 শ্ৰমিক ঠিকাদাৰ' : '🛡️ নিৰাপত্তা সংস্থা'}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CONNECTED & AUTHORIZED AGENCIES */}
      {/* ========================================================================= */}
      {activeTab === 'connected' && (
        <div className="space-y-4">
          {connectedAgencies.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-3">
              <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">বৰ্তমান কোনো ঠিকাদাৰ বা ছিকিউৰিটি সংস্থা অনুমোদিত হোৱা নাই</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                তলৰ "নতুন সংস্থা বিচাৰক ও সংযোগ কৰক" বুটাম ব্যৱহাৰ কৰি পঞ্জীভুক্ত সংস্থাসমূহক সংযোগৰ অনুমোদন দিয়ক অথবা অহা অনুৰোধসমূহ স্বীকাৰ কৰক।
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>প্লেটফৰ্মৰ সংস্থা বিচাৰি সংযোগ কৰক</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedAgencies.map(conn => {
                const contractor = allContractors.find(c => c.id === conn.contractorId);
                const isSecurity = conn.contractorType === 'Security Agency' || contractor?.contractorType === 'Security Agency';

                return (
                  <div
                    key={conn.id}
                    className="bg-white border-2 border-emerald-500/30 rounded-2xl p-5 shadow-xs hover:border-emerald-500 transition-all space-y-4 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black uppercase px-3 py-0.5 rounded-bl-lg tracking-wider">
                      অনুমোদিত ও সংযুক্ত (Allowed & Active)
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        isSecurity ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {isSecurity ? '🛡️' : '👷'}
                      </div>
                      <div className="flex-1 pr-16">
                        <h4 className="font-black text-slate-900 text-sm">{conn.contractorName}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isSecurity ? 'bg-cyan-100 text-cyan-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {conn.contractorType || (isSecurity ? 'Security Agency' : 'Labour Contractor')}
                          </span>
                          <span className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5">
                            ★ {contractor?.rating || 4.8}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Meta Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">অনুজ্ঞাপত্ৰ নং (License):</span>
                        <span className="font-mono text-slate-800 font-medium text-[11px] truncate block" title={contractor?.licenseNo}>
                          {contractor?.licenseNo || 'CLRA-VERIFIED-2026'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">যোগাযোগ ফোন:</span>
                        <span className="font-mono text-slate-800 font-medium text-[11px] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {contractor?.contactNo}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">EPF & ESI ক'ড:</span>
                        <span className="text-emerald-700 font-bold text-[11px]">১০০% চালিত (Compliant)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">সংযুক্ত হোৱাৰ তাৰিখ:</span>
                        <span className="font-mono text-slate-700 text-[11px]">{conn.respondedAt || conn.requestedAt}</span>
                      </div>
                    </div>

                    {conn.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                        "{conn.notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        শ্ৰমিক যোগানৰ আইনী অনুমতি সক্ৰিয়
                      </span>

                      {onDisconnectContractor && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`${conn.contractorName}ৰ সৈতে সংযোগ বন্ধ কৰিবলৈ নিশ্চিতনে?`)) {
                              onDisconnectContractor(conn.id);
                              showNotice(`${conn.contractorName}ৰ সৈতে সংযোগ বন্ধ কৰা হ'ল।`, 'info');
                            }
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                        >
                          সংযোগ কৰ্তন কৰক
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PENDING CONNECTION REQUESTS FROM AGENCIES */}
      {/* ========================================================================= */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                তলৰ ঠিকাদাৰ বা ছিকিউৰিটি সংস্থাসমূহে আপোনাৰ প্ৰতিষ্ঠানত শ্ৰমিক বা গাৰ্ড যোগান ধৰিবলৈ আবেদন কৰিছে। আপুনি <strong>অনুমোদন (Allow)</strong> কৰিলেহে সিহঁতে শ্ৰমিক পঠিয়াব পাৰিব।
              </span>
            </div>
            <span className="font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full shrink-0">
              {pendingRequests.length} আবেদন
            </span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-2">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">কোনো অমীমাংসিত সংযোগ আবেদন নাই</h4>
              <p className="text-xs text-slate-500">সকলো অনুৰোধ ইতিমধ্যে অনুমোদন কৰা হৈছে।</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map(req => {
                const contractor = allContractors.find(c => c.id === req.contractorId);
                const isSecurity = req.contractorType === 'Security Agency' || contractor?.contractorType === 'Security Agency';

                return (
                  <div 
                    key={req.id}
                    className="bg-white border-2 border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        isSecurity ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {isSecurity ? '🛡️' : '👷'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-slate-900 text-sm">{req.contractorName}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isSecurity ? 'bg-cyan-100 text-cyan-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {req.contractorType || (isSecurity ? 'Security Agency' : 'Labour Contractor')}
                          </span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded font-mono">
                            আবেদনৰ তাৰিখ: {req.requestedAt}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 flex items-center gap-4 flex-wrap">
                          <span>CLRA/PSARA: <strong className="font-mono">{contractor?.licenseNo}</strong></span>
                          <span>LIN: <strong className="font-mono">{contractor?.lin}</strong></span>
                          <span>ফোন: <strong className="font-mono">{contractor?.contactNo}</strong></span>
                        </div>
                        {req.notes && (
                          <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1">
                            <strong>আবেদনকাৰীৰ বাৰ্তা:</strong> {req.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          onRejectConnection(req.id);
                          showNotice(`${req.contractorName}ৰ সংযোগ আবেদন নাকচ কৰা হ'ল।`, 'info');
                        }}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        ❌ নাকচ কৰক
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onApproveConnection(req.id);
                          showNotice(`সফলতাৰে অনুমোদন কৰা হ'ল! ${req.contractorName} এতিয়া আপোনাৰ প্ৰতিষ্ঠানৰ লগত সংযুক্ত।`, 'success');
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>✅ অনুমোদন আৰু সংযোগ কৰক (Allow & Connect)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BROWSE ALL REGISTERED AGENCIES ON PLATFORM */}
      {/* ========================================================================= */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="সংস্থাৰ নাম, অনুজ্ঞাপত্ৰ বা ফোন সন্ধান কৰক..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-bold">
              উপলব্ধ সংস্থা: {browseContractors.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {browseContractors.map(con => {
              const isAlreadyConnected = connectedContractorIds.has(con.id);
              const isPending = pendingContractorIds.has(con.id);
              const isSecurity = con.contractorType === 'Security Agency';

              return (
                <div
                  key={con.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition-all space-y-3 ${
                    isAlreadyConnected
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : isPending
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200 hover:border-indigo-400'
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
                          <span className="text-[11px] text-amber-600 font-bold">
                            ★ {con.rating} Rating
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isAlreadyConnected ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> সংযুক্ত (Allowed)
                        </span>
                      ) : isPending ? (
                        <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> অপেক্ষমান (Pending)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedContractorForInvite(con)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ সংযোগ অনুমোদন</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">CLRA / PSARA License:</span>
                      <span className="font-mono text-slate-800 font-medium text-[11px] truncate block" title={con.licenseNo}>
                        {con.licenseNo}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">যোগাযোগ ফোন:</span>
                      <span className="font-mono text-slate-800 font-medium text-[11px]">{con.contactNo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">EPF ক'ড:</span>
                      <span className="font-mono text-emerald-700 font-bold text-[11px]">{con.epfCode}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">ESI ক'ড:</span>
                      <span className="font-mono text-emerald-700 font-bold text-[11px]">{con.esiCode}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invite / Allow Contractor Modal */}
      {selectedContractorForInvite && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>ঠিকাদাৰ / সংস্থাক সংযোগৰ অনুমোদন জনাওক</span>
              </h3>
              <button 
                onClick={() => setSelectedContractorForInvite(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900">{selectedContractorForInvite.name}</div>
              <div className="text-slate-500 font-mono">License: {selectedContractorForInvite.licenseNo}</div>
              <div className="text-slate-500 font-mono">Phone: {selectedContractorForInvite.contactNo}</div>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  সংস্থালৈ বিশেষ নিৰ্দেশনা বা বাৰ্তা (ঐচ্ছিক):
                </label>
                <textarea
                  rows={3}
                  value={inviteNotes}
                  onChange={(e) => setInviteNotes(e.target.value)}
                  placeholder="যেনে: আমাৰ কাৰখানাৰ বাবে ২০ জন অদক্ষ শ্ৰমিকৰ যোগানৰ বাবে সংযোগ কৰা হ'ল..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedContractorForInvite(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  বাতিল কৰক
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xs"
                >
                  অনুমোদন ও সংযোগ পঠিয়াওক
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
