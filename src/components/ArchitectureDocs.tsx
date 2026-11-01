import React, { useState } from 'react';
import { 
  Database, 
  Key, 
  FileCheck, 
  ShieldAlert, 
  Layers, 
  Cpu, 
  CreditCard,
  Users,
  Building2,
  Briefcase,
  UserCheck,
  Shield,
  CheckCircle2,
  ArrowDown,
  Sparkles,
  PhoneCall,
  Receipt,
  Scale,
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';

export default function ArchitectureDocs() {
  const [activeView, setActiveView] = useState<'diagram' | 'original_image'>('diagram');
  return (
    <div className="space-y-12">
      {/* Statutory Architecture Brief (Government & Compliance Inspectorate Brief) */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-wide">
                Official Statutory Architecture
              </span>
              <span className="text-slate-400 text-xs font-mono">CLRA 1970 & Factories Act 1948</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
              <span>🏛️ ঔদ্যোগিক শ্ৰম আইনী সংৰচনা (Industrial Statutory Architecture)</span>
            </h3>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 font-mono">
            Status: 100% Statutory Compliance
          </div>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
          To comply strictly with the directives of the <strong>Labour Commissionerate and Factories Inspectorates of Assam</strong>, IndustrialContractorWorkerLink (ICWL) enforces strict <strong>operational, algorithmic, and statutory compliance</strong> for Industrial Manufacturing, Commercial Units, and Contract Labour operations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Module 1 */}
          <div className="bg-slate-900/90 border border-indigo-500/40 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="font-bold text-indigo-300 text-sm">🏭 ১. কাৰখানা আৰু নিৰ্মাণ শাখা (Factories Act, 1948)</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">Assam Rules</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• <strong>Statutory Act:</strong> The Factories Act, 1948 & Assam Factories Rules.</li>
              <li>• <strong>Workforce:</strong> Regular Industrial & Factory floor workers under plant supervisors.</li>
              <li>• <strong>Wage Metric:</strong> 8-Hour Shift Hazira + 2x Overtime under Factories Act Section 59.</li>
              <li>• <strong>Health & Safety:</strong> Automated safety logging and gate entry tracking.</li>
              <li>• <strong>Annual Bonus:</strong> Payment of Bonus Act, 1965 (8.33% to 20% on Balance Sheet).</li>
              <li>• <strong>Muster Roll:</strong> Biometric and digital supervisor gate verification.</li>
            </ul>
          </div>

          {/* Module 2 */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="font-bold text-emerald-300 text-sm">🏢 ২. ঠিকাদাৰী শ্ৰম শাখা (Contract Labour CLRA, 1970)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Central CLRA</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• <strong>Statutory Act:</strong> Contract Labour (Regulation & Abolition) Act, 1970.</li>
              <li>• <strong>Workforce:</strong> Contract manpower supplied by licensed manpower agencies.</li>
              <li>• <strong>Registers:</strong> Form XVI (Muster Roll) & Form XVII (Register of Wages).</li>
              <li>• <strong>Provident Fund & ESI:</strong> <strong>EPFO & ESIC</strong> (Central Ministry of Labour, New Delhi).</li>
              <li>• <strong>Section 21 Guarantee:</strong> Principal employer wage disbursement audit trail.</li>
              <li>• <strong>Compliance Lock:</strong> Zero-tolerance Vendor Invoice lock until EPFO/ESIC verified.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OFFICIAL CUSTOMER ARCHITECTURE & ROLE CAPABILITY FLOWCHART */}
      {/* ========================================================================= */}
      <section className="bg-white border-2 border-indigo-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Customer & Investor Pitch Architecture
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> All Modules 100% Implemented
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>👥 মাল্টি-ষ্টেকহোল্ডাৰ কাৰ্য্যপ্ৰণালী ফ্ল’চাৰ্ট (Customer Role & Workflow Hierarchy)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              শ্ৰমিকলিংক প্লেটফৰ্মৰ ৫ টা মুখ্য কাৰ্য্যবাহী পেনেল আৰু শীৰ্ষত থকা চৰকাৰী শ্ৰম পৰিদৰ্শকৰ আইনী নিয়ন্ত্ৰণৰ সম্পূৰ্ণ প্ৰণালী। গ্ৰাহক আৰু ব্যৱসায়িক অংশীদাৰসকলে প্ৰতিটো পদবীৰ কাৰ্য্যপ্ৰণালী তলৰ ডায়াগ্ৰামৰ জৰিয়তে সহজে বুজিব পাৰে।
            </p>
          </div>

          {/* Toggle between Interactive Diagram & Master Uploaded Image */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveView('diagram')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'diagram'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ইন্টাৰেক্টিভ ফ্ল’চাৰ্ট (Interactive Flowchart)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('original_image')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'original_image'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>মূল নিৰ্দেশনা চিত্ৰ (Original Image)</span>
            </button>
          </div>
        </div>

        {activeView === 'original_image' ? (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-2xl p-4 text-center border border-slate-800 shadow-inner overflow-hidden">
              <div className="text-xs text-indigo-300 font-mono mb-2 flex items-center justify-center gap-2">
                <span>📸 গ্ৰাহক বুজাবুজিৰ বাবে প্ৰস্তুত কৰা মূল স্থাপত্য নিৰ্দেশনা চিত্ৰ (Reference Blueprint)</span>
              </div>
              <img 
                src="/assets/aistudio/Screenshot_2026_1101_075518_7c5e1313.jpg" 
                alt="ShramikLink Master Architecture Flowchart" 
                className="max-h-[600px] w-auto mx-auto object-contain rounded-xl shadow-lg border border-slate-700 bg-black"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>স্থাপত্য বিশ্লেষণ:</strong> আপোনাৰ নিৰ্দেশনা চিত্ৰৰ প্ৰতিটো স্তম্ভ (Labor, Admin, Industry, Contractor, Supervisor আৰু Inspector) আমাৰ ক’ডবেচত পূৰ্ণভাৱে নিৰ্মাণ আৰু সক্ৰিয় কৰা হৈছে।
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Apex Node: Labor Inspector */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 text-white border-2 border-purple-400 p-4 sm:p-5 rounded-2xl shadow-lg max-w-md w-full text-center relative">
                <div className="w-10 h-10 rounded-xl bg-purple-800/80 border border-purple-400 text-white flex items-center justify-center mx-auto mb-1.5 text-xl">
                  ⚖️
                </div>
                <h4 className="font-black text-base sm:text-lg text-white tracking-wide">
                  Labor Inspector (চৰকাৰী শ্ৰম পৰিদৰ্শক)
                </h4>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Apex Statutory Authority • CLRA & Factories Act Enforcement • Muster Roll (Form XVI/XVII) Audit • EPF/ESIC Verification & Legal Notices
                </p>
                <span className="mt-2 inline-block bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Overarching Legal Regulatory Oversight
                </span>
              </div>

              {/* Connector lines to the 5 child pillars */}
              <div className="hidden lg:flex flex-col items-center my-3 w-full max-w-5xl">
                <div className="w-0.5 h-6 bg-purple-400"></div>
                <div className="w-full h-0.5 bg-purple-300"></div>
                <div className="flex justify-between w-full px-8">
                  <div className="w-0.5 h-4 bg-purple-400"></div>
                  <div className="w-0.5 h-4 bg-purple-400"></div>
                  <div className="w-0.5 h-4 bg-purple-400"></div>
                  <div className="w-0.5 h-4 bg-purple-400"></div>
                  <div className="w-0.5 h-4 bg-purple-400"></div>
                </div>
              </div>
            </div>

            {/* 5 Operational Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* 1. Labor Pillar */}
              <div className="bg-slate-50 border-2 border-blue-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-blue-400 transition-all shadow-xs">
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-100">
                    <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700 text-lg">👤</span>
                    <div>
                      <h5 className="font-black text-slate-900 text-sm">Labor</h5>
                      <span className="text-[9px] text-blue-600 font-bold block uppercase">শ্ৰমিক ডেশ্ববৰ্ড</span>
                    </div>
                  </div>
                  <ul className="text-[11px] text-slate-700 space-y-2 leading-snug">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Register with Verified mobile no (SMS OTP)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Maintain profile and view Information of PF & ESIC account Details, bank account details etc.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View details of industry / labor Contractor / industry supervisor under Which labor will be employee</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Able to view their transaction details like salary and the transaction history also</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View their Smart Card (Digital Smart Card with QR)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Raise a request to admin regarding their PF balance and also they can raise complain</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Helpline Button through which they can directly call to admin</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-blue-100">
                  <span className="text-[9px] font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md block text-center">
                    Status: 100% Operational
                  </span>
                </div>
              </div>

              {/* 2. Admin Pillar */}
              <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-slate-500 transition-all shadow-xs">
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                    <span className="p-1.5 rounded-lg bg-slate-200 text-slate-800 text-lg">🛡️</span>
                    <div>
                      <h5 className="font-black text-slate-900 text-sm">Admin</h5>
                      <span className="text-[9px] text-slate-600 font-bold block uppercase">ছুপাৰ এডমিন পেনেল</span>
                    </div>
                  </div>
                  <ul className="text-[11px] text-slate-700 space-y-2 leading-snug">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View profile of all the labor</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Supply labor to industry Via labor contractor</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View the activity of Labor contractor / industry / labor supervisor</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Generate monthly bill of labor payment to industry</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Track the payment status</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Transfer labor salary to Their bank account</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Handle the complain of Labor / industry / labor contractor</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Update payment details of labor PF account</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Can activate / deactivate / delete any user and also can blacklist the labor</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[9px] font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md block text-center">
                    Status: 100% Operational
                  </span>
                </div>
              </div>

              {/* 3. Industry Pillar */}
              <div className="bg-slate-50 border-2 border-indigo-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-indigo-400 transition-all shadow-xs">
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-indigo-100">
                    <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-lg">🏭</span>
                    <div>
                      <h5 className="font-black text-slate-900 text-sm">Industry</h5>
                      <span className="text-[9px] text-indigo-600 font-bold block uppercase">প্ৰধান নিয়োগকাৰী (Owner)</span>
                    </div>
                  </div>
                  <ul className="text-[11px] text-slate-700 space-y-2 leading-snug">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Register with details (Factories Act / Apt / Shop / Office)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View the labor details and labor contractor</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Assign labor to supervisor unit wise or as a whole</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View the bill of admin and also track the payment status</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Create / edit / activate / deactivate the account of labor contractor and industry supervisor</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Generate requisition to admin for labor</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View the activities of industry supervisor, labor contractor and labor like attendance, complain etc.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Remove labor from panel</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-indigo-100">
                  <span className="text-[9px] font-bold text-indigo-800 bg-indigo-100/80 px-2 py-0.5 rounded-md block text-center">
                    Status: 100% Operational
                  </span>
                </div>
              </div>

              {/* 4. Labor Contractor Pillar */}
              <div className="bg-slate-50 border-2 border-emerald-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-emerald-400 transition-all shadow-xs">
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-emerald-100">
                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-lg">🏢</span>
                    <div>
                      <h5 className="font-black text-slate-900 text-sm">Labor Contractor</h5>
                      <span className="text-[9px] text-emerald-600 font-bold block uppercase">শ্ৰমিক ঠিকাদাৰ ও ছিকিউৰিটি</span>
                    </div>
                  </div>
                  <ul className="text-[11px] text-slate-700 space-y-2 leading-snug">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Register by Industry / direct agency portal</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View the labor details allotted by admin</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View industry profile under which he assigned</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View the activities of industry, supervisor, and labor like attendance, complain etc</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Generate complain to admin regarding labor</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Remove labor from panel</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View the payment details of labor</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Maintain different register of labor:</span>
                    </li>
                    <ul className="pl-4 space-y-1 text-[10px] text-slate-600 list-disc">
                      <li>Employee register (Form XIII / Form A)</li>
                      <li>Wage register (Form XVII)</li>
                      <li>Register of loan / recoveries</li>
                      <li>Attendance register (Form XVI)</li>
                      <li>Register of rest days / leave with wages</li>
                    </ul>
                  </ul>
                </div>
                <div className="pt-2 border-t border-emerald-100">
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md block text-center">
                    Status: 100% Operational
                  </span>
                </div>
              </div>

              {/* 5. Industry Supervisor Pillar */}
              <div className="bg-slate-50 border-2 border-amber-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-amber-400 transition-all shadow-xs">
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-100">
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 text-lg">👷</span>
                    <div>
                      <h5 className="font-black text-slate-900 text-sm">Industry Supervisor</h5>
                      <span className="text-[9px] text-amber-700 font-bold block uppercase">গেট ও ফিল্ড ছুপাৰভাইজাৰ</span>
                    </div>
                  </div>
                  <ul className="text-[11px] text-slate-700 space-y-2 leading-snug">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Register by Industry</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>View the labor details allotted by industry</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Take daily attendance of the labor (gate hazira / biometric)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Generate complain to industry and a cc copy of this message goes to admin & labor contractor</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-amber-100">
                  <span className="text-[9px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md block text-center">
                    Status: 100% Operational
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* Executive Overview */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="text-indigo-600 h-6 w-6" />
          Technical System Architecture
        </h2>
        <p className="text-slate-600 leading-relaxed max-w-4xl">
          The Contract Labour Compliance Platform is a multi-tenant B2B SaaS platform structured specifically around Indian labor regulations: 
          <strong> The Contract Labour (Regulation & Abolition) Act, 1970 (CLRA)</strong>, 
          <strong> Employees' Provident Funds Scheme (EPF)</strong>, and 
          <strong> Employees' State Insurance Act (ESI)</strong>. 
          The platform operates with a decoupled full-stack architecture ensuring absolute security, encrypted ID hashes, and rigorous state-machine billing locking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white border border-slate-100 p-5 rounded-lg shadow-2xs">
            <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase mb-2">Frontend layer</div>
            <h4 className="font-semibold text-slate-800 mb-1">React + Tailwind + Vite</h4>
            <p className="text-xs text-slate-500">Role-gated dashboards for Factories, Contractors, Workers, and Government Inspectors with distinct access boundaries.</p>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-lg shadow-2xs">
            <div className="text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-2">Backend & Security Engine</div>
            <h4 className="font-semibold text-slate-800 mb-1">Node/Express API + Aadhaar UIDAI</h4>
            <p className="text-xs text-slate-500">Secure AES-256 Aadhaar hashing, biometric facial-matching API triggers, and stateful compliance lock middleware.</p>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-lg shadow-2xs">
            <div className="text-xs font-semibold text-amber-600 tracking-wider uppercase mb-2">Data & Storage</div>
            <h4 className="font-semibold text-slate-800 mb-1">PostgreSQL/Cloud SQL</h4>
            <p className="text-xs text-slate-500">Structured transactional SQL database with strict foreign key constraints, temporal wage auditing, and compliance ledgers.</p>
          </div>
        </div>
      </section>

      {/* Database Schema Design */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Database className="text-indigo-600 h-6 w-6" />
          <h2 className="text-2xl font-bold text-slate-900">Database Schema Design (Relational PostgreSQL)</h2>
        </div>
        <p className="text-sm text-slate-500 max-w-3xl">
          The following entity relationship schema enforces high integrity, allowing many-to-many relationship tracking between Industries and Contractors via multi-industry worker deployments.
        </p>

        {/* Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* 1. Industries */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: industries</span>
              <span className="text-xs text-slate-400">SaaS Principal/Client Tenants</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>name</span> <span className="text-slate-400">VARCHAR(255) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>location</span> <span className="text-slate-400">TEXT [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>reg_no</span> <span className="text-slate-400">VARCHAR(100) [UNIQUE] (Factory Lic)</span></li>
              <li className="flex justify-between p-1.5"><span>lin</span> <span className="text-slate-400">VARCHAR(10) [UNIQUE] (Labour ID)</span></li>
              <li className="flex justify-between p-1.5"><span>contact_email</span> <span className="text-slate-400">VARCHAR(100)</span></li>
              <li className="flex justify-between p-1.5"><span>created_at</span> <span className="text-slate-500">TIMESTAMP [DEFAULT NOW()]</span></li>
            </ul>
          </div>

          {/* 2. Contractors */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: contractors</span>
              <span className="text-xs text-slate-400">Independent Labor Vendors</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>name</span> <span className="text-slate-400">VARCHAR(255) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>license_no</span> <span className="text-slate-400">VARCHAR(100) [UNIQUE] (CLRA Lic)</span></li>
              <li className="flex justify-between p-1.5"><span>lin</span> <span className="text-slate-400">VARCHAR(10) [UNIQUE]</span></li>
              <li className="flex justify-between p-1.5"><span>pan</span> <span className="text-slate-400">VARCHAR(10) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>epf_code</span> <span className="text-slate-400">VARCHAR(50) [UNIQUE]</span></li>
              <li className="flex justify-between p-1.5"><span>esi_code</span> <span className="text-slate-400">VARCHAR(50) [UNIQUE]</span></li>
              <li className="flex justify-between p-1.5"><span>contact_no</span> <span className="text-slate-400">VARCHAR(15)</span></li>
              <li className="flex justify-between p-1.5"><span>rating</span> <span className="text-slate-400">NUMERIC(3,2) [DEFAULT 5.0]</span></li>
            </ul>
          </div>

          {/* 3. Workers */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: workers</span>
              <span className="text-xs text-slate-400">Labour Workforce Registry</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>name</span> <span className="text-slate-400">VARCHAR(255) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>aadhaar_hash</span> <span className="text-slate-500">VARCHAR(64) [UNIQUE, SHA256]</span></li>
              <li className="flex justify-between p-1.5"><span>phone</span> <span className="text-slate-400">VARCHAR(15)</span></li>
              <li className="flex justify-between p-1.5"><span>contractor_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; contractors.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>skill_type</span> <span className="text-slate-400">VARCHAR(30) (Skilled, Unskilled, etc)</span></li>
              <li className="flex justify-between p-1.5"><span>daily_wage_rate</span> <span className="text-slate-400">NUMERIC(10,2) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>status</span> <span className="text-slate-400">VARCHAR(20) [DEFAULT 'Available']</span></li>
              <li className="flex justify-between p-1.5"><span>onboarding_verified</span> <span className="text-slate-400">BOOLEAN [DEFAULT FALSE]</span></li>
            </ul>
          </div>

          {/* 4. Multi-Industry Assignments */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: assignments</span>
              <span className="text-xs text-slate-400">Live Multi-Industry Deployments</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>worker_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; workers.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>contractor_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; contractors.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>industry_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; industries.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>assigned_at</span> <span className="text-slate-400">TIMESTAMP [DEFAULT NOW()]</span></li>
              <li className="flex justify-between p-1.5"><span>status</span> <span className="text-slate-400">VARCHAR(20) [DEFAULT 'Active']</span></li>
              <li className="flex justify-between p-1.5"><span>shift_timing</span> <span className="text-slate-400">VARCHAR(50) [NOT NULL]</span></li>
            </ul>
          </div>

          {/* 5. Attendance & Timekeeper */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: attendance</span>
              <span className="text-xs text-slate-400">Aadhaar/Biometric Shift Check-ins</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>date</span> <span className="text-slate-400">DATE [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>worker_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; workers.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>industry_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; industries.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>check_in</span> <span className="text-slate-400">TIME [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>check_out</span> <span className="text-slate-400">TIME</span></li>
              <li className="flex justify-between p-1.5"><span>aadhaar_verified</span> <span className="text-slate-400">BOOLEAN [DEFAULT FALSE]</span></li>
              <li className="flex justify-between p-1.5"><span>verification_method</span> <span className="text-slate-400">VARCHAR(30)</span></li>
              <li className="flex justify-between p-1.5"><span>hours_worked</span> <span className="text-slate-400">NUMERIC(4,2)</span></li>
              <li className="flex justify-between p-1.5"><span>overtime_hours</span> <span className="text-slate-400">NUMERIC(4,2) [Calculated &gt; 8h]</span></li>
            </ul>
          </div>

          {/* 6. Compliance Documents */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: compliance_documents</span>
              <span className="text-xs text-slate-400">Statutory Monthly Challans Ledger</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>contractor_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; contractors.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>month</span> <span className="text-slate-400">VARCHAR(20) [NOT NULL] (e.g. "Aug 2026")</span></li>
              <li className="flex justify-between p-1.5"><span>doc_type</span> <span className="text-slate-400">VARCHAR(30) (EPF-Challan, ESI, GST)</span></li>
              <li className="flex justify-between p-1.5"><span>file_url</span> <span className="text-slate-400">TEXT [NOT NULL] (S3 Hash Path)</span></li>
              <li className="flex justify-between p-1.5"><span>uploaded_at</span> <span className="text-slate-400">TIMESTAMP</span></li>
              <li className="flex justify-between p-1.5"><span>status</span> <span className="text-slate-400">VARCHAR(20) (Verified, Rejected, Pending)</span></li>
              <li className="flex justify-between p-1.5"><span>verified_by</span> <span className="text-slate-400">VARCHAR(100)</span></li>
            </ul>
          </div>

          {/* 7. Compliance-Locked Billing */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: billing</span>
              <span className="text-xs text-slate-400">Regulatory Secured Invoices</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>contractor_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; contractors.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>industry_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; industries.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>month</span> <span className="text-slate-400">VARCHAR(20) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>base_amount</span> <span className="text-slate-400">NUMERIC(12,2) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>service_charge</span> <span className="text-slate-400">NUMERIC(12,2)</span></li>
              <li className="flex justify-between p-1.5"><span>gst_amount</span> <span className="text-slate-400">NUMERIC(12,2) [18%]</span></li>
              <li className="flex justify-between p-1.5"><span>total_amount</span> <span className="text-slate-400">NUMERIC(12,2)</span></li>
              <li className="flex justify-between p-1.5 bg-amber-50"><span>status</span> <span className="text-amber-800">VARCHAR(20) (Locked, Submitted, Approved)</span></li>
            </ul>
          </div>

          {/* 8. Aadhaar Verification Logs */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: aadhaar_logs</span>
              <span className="text-xs text-slate-400">UIDAI Compliance Audit Logs</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>worker_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; workers.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>timestamp</span> <span className="text-slate-400">TIMESTAMP [DEFAULT NOW()]</span></li>
              <li className="flex justify-between p-1.5"><span>activity</span> <span className="text-slate-400">VARCHAR(50) (Onboarding / Check-In)</span></li>
              <li className="flex justify-between p-1.5"><span>status</span> <span className="text-slate-400">VARCHAR(10) (Success / Failed)</span></li>
              <li className="flex justify-between p-1.5"><span>uidai_tx_ref</span> <span className="text-slate-400">VARCHAR(100) [Encrypted OTP audit key]</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Multi-Industry Real-Time Architecture Diagram */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="text-indigo-600 h-5 w-5" />
          The Multi-Vendor Compliance & Security Pipeline
        </h3>

        <div className="border border-slate-100 rounded-lg p-6 bg-slate-50 space-y-6 text-sm text-slate-600">
          <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
            <div className="bg-white p-4 rounded border border-slate-200 flex-1 flex flex-col justify-between">
              <div className="font-semibold text-indigo-600 mb-1 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                1. Aadhaar ID & Roster Setup
              </div>
              <p className="text-xs text-slate-500">Workers undergo instant UIDAI Aadhaar verification. Self-registered workers are immediately assigned to licensed contractors to satisfy CLRA standards.</p>
            </div>
            <div className="flex items-center justify-center text-slate-400 font-bold">➔</div>
            <div className="bg-white p-4 rounded border border-slate-200 flex-1 flex flex-col justify-between">
              <div className="font-semibold text-emerald-600 mb-1 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
                2. Live Multi-Industry Deployment
              </div>
              <p className="text-xs text-slate-500">Contractors deploy available workers to multiple industries using the real-time planner, routing the appropriate skill categories to factory shifts.</p>
            </div>
            <div className="flex items-center justify-center text-slate-400 font-bold">➔</div>
            <div className="bg-white p-4 rounded border border-slate-200 flex-1 flex flex-col justify-between">
              <div className="font-semibold text-amber-600 mb-1 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                3. Double-Locked Statutory Billing
              </div>
              <p className="text-xs text-slate-500">Prior to August billing, contractors must present EPF/ESI/GST deposit challans for July. Non-compliance results in an absolute lock of billing workflows.</p>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-4 flex gap-3 text-amber-900 text-xs">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <span className="font-semibold">Indian Statutory CLRA Clause 21 Alignment:</span>
              <p className="mt-1">
                The CLRA Act dictates that the Principal Employer (Industry) is ultimately liable for unpaid wages or statutory dues if the contractor defaults. 
                Our platform eliminates this massive liability for industries by locking monthly service bills until matching challans are uploaded and audited on-platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
