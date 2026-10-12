import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  Check, 
  Clock, 
  Phone, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  Building, 
  Store, 
  X, 
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  FileText,
  MapPin,
  Lock
} from 'lucide-react';
import { Industry, Contractor, IndustryContractorConnection } from '../types';

interface ContractorIndustryConnectionManagerProps {
  activeContractor: Contractor;
  allIndustries: Industry[];
  connections: IndustryContractorConnection[];
  onApplyToIndustry: (industryId: string, notes?: string) => void;
  showNotice?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function ContractorIndustryConnectionManager({
  activeContractor,
  allIndustries,
  connections,
  onApplyToIndustry,
  showNotice = () => {}
}: ContractorIndustryConnectionManagerProps) {
  const [activeTab, setActiveTab] = useState<'my_clients' | 'explore'>('my_clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Industry HR' | 'Apartment Owner' | 'Shop Owner' | 'Office'>('All');

  // Application Modal state
  const [selectedIndustryForApply, setSelectedIndustryForApply] = useState<Industry | null>(null);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [capacityOffered, setCapacityOffered] = useState('20');

  // Connections belonging to this active contractor
  const contractorConnections = connections.filter(c => c.contractorId === activeContractor.id);
  const connectedClients = contractorConnections.filter(c => c.status === 'Connected');
  const pendingApplications = contractorConnections.filter(c => c.status === 'Pending');

  const connectedIndustryIds = new Set(connectedClients.map(c => c.industryId));
  const pendingIndustryIds = new Set(pendingApplications.map(c => c.industryId));

  // Filter industries for explore tab
  const filteredIndustries = allIndustries.filter(ind => {
    const matchesCategory = categoryFilter === 'All' || ind.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      ind.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ind.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ind.regNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSendApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIndustryForApply) return;

    const fullNote = `${activeContractor.name} (${activeContractor.contractorType || 'Labour Contractor'}) দ্বাৰা ${capacityOffered} জন শ্ৰমিক/গাৰ্ড যোগানৰ বাবে আবেদন। ${applicationNotes ? `বাৰ্তা: ${applicationNotes}` : ''}`;
    onApplyToIndustry(selectedIndustryForApply.id, fullNote);
    setSelectedIndustryForApply(null);
    setApplicationNotes('');
    setCapacityOffered('20');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-purple-200">
              Agency Client Authorization
            </span>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              {activeContractor.contractorType || 'Labour Contractor'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>🏭 কাৰখানা ও প্ৰতিষ্ঠান সংযোগ পৰ্টেল (Industry Client Connections)</span>
          </h3>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            প্লেটফৰ্মত থকা যিকোনো কাৰখানা, এপাৰ্টমেণ্ট, দোকান বা অফিচলৈ শ্ৰমিক/গাৰ্ড যোগানৰ আবেদন কৰক। <strong>প্ৰধান নিয়োগকাৰীয়ে অনুমোদন (Allow) কৰিলেহে</strong> আপুনি তেওঁলোকৰ লগত কাম কৰিব পাৰিব।
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 text-center">
            <span className="text-[10px] text-emerald-700 font-bold block uppercase">অনুমোদিত প্ৰতিষ্ঠান</span>
            <span className="text-base font-black text-emerald-800">{connectedClients.length} গ্ৰাহক</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2 text-center">
            <span className="text-[10px] text-amber-700 font-bold block uppercase">আবেদন বাকী</span>
            <span className="text-base font-black text-amber-800">{pendingApplications.length} প্ৰক্ৰিয়াধীন</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('my_clients')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'my_clients'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BadgeCheck className="w-4 h-4" />
            <span>মোৰ অনুমোদিত প্ৰতিষ্ঠানসমূহ ({connectedClients.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>নতুন কাৰখানা / প্ৰতিষ্ঠান বিচাৰি আবেদন কৰক</span>
          </button>
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          {['All', 'Industry HR', 'Apartment Owner', 'Shop Owner', 'Office'].map(cat => (
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
              {cat === 'All' ? 'সকলো' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MY CONNECTED CLIENTS */}
      {/* ========================================================================= */}
      {activeTab === 'my_clients' && (
        <div className="space-y-4">
          {connectedClients.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-3">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">বৰ্তমান কোনো প্ৰতিষ্ঠানৰ লগত সংযোগ অনুমোদিত হোৱা নাই</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                "নতুন কাৰখানা / প্ৰতিষ্ঠান বিচাৰি আবেদন কৰক" টেবৰ পৰা কাৰখানা, এপাৰ্টমেণ্ট বা দোকান বিচাৰি আবেদন পঠিয়াওক। তেওঁলোকে অনুমোদন কৰিলে আপুনি শ্ৰমিক যোগান ধৰিব পাৰিব।
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>কাৰখানা বিচাৰি আবেদন কৰক</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedClients.map(conn => {
                const industry = allIndustries.find(i => i.id === conn.industryId);

                return (
                  <div
                    key={conn.id}
                    className="bg-white border-2 border-emerald-500/40 rounded-2xl p-5 shadow-xs hover:border-emerald-500 transition-all space-y-3 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black uppercase px-3 py-0.5 rounded-bl-lg tracking-wider">
                      অনুমোদিত ও সক্ৰিয় ক্লায়েণ্ট
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-xl shrink-0">
                        {industry?.category === 'Industry HR' ? '🏭' :
                         industry?.category === 'Apartment Owner' ? '🏢' :
                         industry?.category === 'Shop Owner' ? '🛍️' : '🏛️'}
                      </div>
                      <div className="flex-1 pr-14">
                        <h4 className="font-black text-slate-900 text-sm">{conn.industryName}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                            {conn.industryCategory || industry?.category}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {industry?.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Establishment Reg / Lic:</span>
                        <span className="font-mono text-slate-800 font-medium text-[11px] truncate block" title={industry?.regNo}>
                          {industry?.regNo}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Labour ID (LIN):</span>
                        <span className="font-mono text-slate-800 font-medium text-[11px]">{industry?.lin}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        বৈধানিক শ্ৰমিক যোগানৰ অনুমতি আছে
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        Connected: {conn.respondedAt || conn.requestedAt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EXPLORE & APPLY TO INDUSTRIES / OWNERS */}
      {/* ========================================================================= */}
      {activeTab === 'explore' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="কাৰখানা, এপাৰ্টমেণ্ট বা দোকান সন্ধান কৰক..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-bold">
              উপলব্ধ প্ৰতিষ্ঠান: {filteredIndustries.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIndustries.map(ind => {
              const isAlreadyConnected = connectedIndustryIds.has(ind.id);
              const isPending = pendingIndustryIds.has(ind.id);

              return (
                <div
                  key={ind.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition-all space-y-3 ${
                    isAlreadyConnected
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : isPending
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-xl shrink-0">
                        {ind.category === 'Industry HR' ? '🏭' :
                         ind.category === 'Apartment Owner' ? '🏢' :
                         ind.category === 'Shop Owner' ? '🛍️' : '🏛️'}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{ind.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                            {ind.category}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {ind.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isAlreadyConnected ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> অনুমোদিত (Connected)
                        </span>
                      ) : isPending ? (
                        <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> আবেদন দাখিল হৈছে (Pending)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedIndustryForApply(ind)}
                          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>শ্ৰমিক যোগানৰ আবেদন</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">License / Reg:</span>
                      <span className="font-mono text-slate-800 font-medium text-[11px] truncate block" title={ind.regNo}>
                        {ind.regNo}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Labour ID (LIN):</span>
                      <span className="font-mono text-slate-800 font-medium text-[11px]">{ind.lin}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Apply to Supply Workforce */}
      {selectedIndustryForApply && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-600" />
                <span>প্ৰতিষ্ঠানলৈ শ্ৰমিক/গাৰ্ড যোগানৰ আবেদন</span>
              </h3>
              <button 
                onClick={() => setSelectedIndustryForApply(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900">{selectedIndustryForApply.name}</div>
              <div className="text-slate-500">{selectedIndustryForApply.category} • {selectedIndustryForApply.location}</div>
            </div>

            <form onSubmit={handleSendApplication} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  আপুনি যোগান ধৰিব পৰা শ্ৰমিক / নিৰাপত্তাৰক্ষীৰ সংখ্যা:
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={capacityOffered}
                  onChange={(e) => setCapacityOffered(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  প্ৰতিষ্ঠানৰ HR / মালিকলৈ প্ৰস্তাৱ বা টোকা (Message):
                </label>
                <textarea
                  rows={3}
                  value={applicationNotes}
                  onChange={(e) => setApplicationNotes(e.target.value)}
                  placeholder="যেনে: আমাৰ ওচৰত বৈধানিক EPF/ESI চালিত প্ৰশিক্ষিত শ্ৰমিক আৰু PSARA গাৰ্ড প্ৰস্তুত আছে..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedIndustryForApply(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  বাতিল কৰক
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-xs"
                >
                  আবেদন প্ৰেৰণ কৰক (Submit Request)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
