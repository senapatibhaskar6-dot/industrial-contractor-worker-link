/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Database, 
  Milestone, 
  Smartphone,
  LogOut,
  Factory,
  ShieldCheck
} from 'lucide-react';
import SaaSApp from './components/SaaSApp';
import ArchitectureDocs from './components/ArchitectureDocs';
import RoadmapView from './components/RoadmapView';
import MobileSingleView from './components/MobileSingleView';
import PlatformAdminPanel from './components/PlatformAdminPanel';
import { initialIndustries, initialContractors, initialWorkers } from './mockData';
import { AppLanguage, getStoredLanguage, setStoredLanguage, TRANSLATIONS } from './i18n';
import { LanguageSelector } from './components/LanguageSelector';

export default function App() {
  // Pure Industry / Factory Standalone Mode: 'app' (Main Console) | 'admin' | 'architecture' | 'roadmap'
  const [activeTab, setActiveTab] = useState<'app' | 'admin' | 'architecture' | 'roadmap'>(() => {
    return 'app';
  });

  const [currentLang, setCurrentLangState] = useState<AppLanguage>(() => getStoredLanguage());
  const [isMobileView, setIsMobileView] = useState<boolean>(() => {
    const saved = localStorage.getItem('icwl_mobile_mode') || localStorage.getItem('shramiklink_mobile_mode');
    if (saved !== null) return saved === 'true';
    return false;
  });

  const toggleMobileMode = (val: boolean) => {
    setIsMobileView(val);
    localStorage.setItem('icwl_mobile_mode', val ? 'true' : 'false');
    localStorage.setItem('shramiklink_mobile_mode', val ? 'true' : 'false');
  };

  const handleTabChange = (tab: 'app' | 'admin' | 'architecture' | 'roadmap') => {
    setActiveTab(tab);
    localStorage.setItem('icwl_industry_tab', tab);
    localStorage.setItem('shramiklink_industry_tab', tab);
  };

  React.useEffect(() => {
    // Sync language when changed anywhere in the app
    const handleLangEvt = (e: any) => {
      if (e.detail && TRANSLATIONS[e.detail as AppLanguage]) {
        setCurrentLangState(e.detail as AppLanguage);
      }
    };
    window.addEventListener('shramiklink-language-change', handleLangEvt);
    window.addEventListener('icwl-language-change', handleLangEvt);

    // Clear any previous tea garden cached tabs and role from browser localStorage
    try {
      localStorage.removeItem('shramiklink_current_app');
      localStorage.removeItem('shramiklink_active_tab');
      localStorage.removeItem('shramiklink_tea_active_tab');
      localStorage.removeItem('shramiklink_tea_state');
      if (localStorage.getItem('s_current_role') === 'tea_garden') {
        localStorage.setItem('s_current_role', 'industry_admin');
      }
      // If URL has ?app=bagan or ?app=hub, clean it up to keep it purely industry
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (url.searchParams.has('app') && url.searchParams.get('app') !== 'udyog') {
          url.searchParams.delete('app');
          window.history.replaceState({}, '', url.toString());
        }
      }
    } catch {
      // ignore
    }

    const handleOpenAppTab = () => handleTabChange('app');
    window.addEventListener('open-app-tab', handleOpenAppTab);

    const handleSwitchTab = (e: any) => {
      if (e?.detail) handleTabChange(e.detail);
    };
    window.addEventListener('icwl-switch-tab', handleSwitchTab);

    return () => {
      window.removeEventListener('shramiklink-language-change', handleLangEvt);
      window.removeEventListener('icwl-language-change', handleLangEvt);
      window.removeEventListener('open-app-tab', handleOpenAppTab);
      window.removeEventListener('icwl-switch-tab', handleSwitchTab);
    };
  }, []);

  const handleLanguageChange = (lang: AppLanguage) => {
    setCurrentLangState(lang);
    setStoredLanguage(lang);
  };

  const t = TRANSLATIONS[currentLang];

  // Dynamic Navigation & UI Text per selected language (Default: English)
  const navText = {
    appTab: currentLang === 'as' ? '🏭 কাৰখানা ডেশ্ববৰ্ড ও চালান' :
            currentLang === 'hi' ? '🏭 कारखाना डैशबोर्ड व चालान' :
            currentLang === 'bn' ? '🏭 কারখানা ড্যাশবোর্ড ও চালান' :
            '🏭 Factory Console & Billing',
    adminTab: currentLang === 'as' ? '🛡️ ছুপাৰ এডমিন পেনেল' :
              currentLang === 'hi' ? '🛡️ सुपर एडमिन पैनल' :
              currentLang === 'bn' ? '🛡️ সুপার অ্যাডমিন প্যানেল' :
              '🛡️ Super Admin Panel',
    archTab: currentLang === 'as' ? '📐 CLRA ও আইনী সংৰচনা' :
             currentLang === 'hi' ? '📐 CLRA व कानूनी ढांचा' :
             currentLang === 'bn' ? '📐 CLRA ও আইনি কাঠামো' :
             '📐 CLRA & Legal Structure',
    roadmapTab: currentLang === 'as' ? '🚀 ৰোডমেপ' :
                currentLang === 'hi' ? '🚀 रोडमैप' :
                currentLang === 'bn' ? '🚀 রোডম্যাপ' :
                '🚀 Roadmap',
    loginBtn: currentLang === 'as' ? 'লগইন' :
              currentLang === 'hi' ? 'लॉगिन' :
              currentLang === 'bn' ? 'লগইন' :
              'Login',
    mobileBtn: currentLang === 'as' ? 'মোবাইল' :
               currentLang === 'hi' ? 'मोबाइल' :
               currentLang === 'bn' ? 'মোবাইল' :
               'Mobile View',
    legalStripTitle: currentLang === 'as' ? 'উদ্যোগিক শ্ৰম অনুপালন প্ৰণালী সক্ৰিয়:' :
                     currentLang === 'hi' ? 'औद्योगिक श्रम व सुरक्षा अनुपालन प्रणाली सक्रिय:' :
                     currentLang === 'bn' ? 'শিল্প শ্রম ও সুরক্ষা সম্মতি ব্যবস্থা সক্রিয়:' :
                     'Industrial Labor & Security Compliance Active:',
    legalStripSub: currentLang === 'as' ? '• অসংগঠিত ঠিকাদাৰী শ্ৰমিক, নিৰাপত্তা সংস্থা (PSARA), গেট এন্ট্ৰি ও Compliance-Locked Billing' :
                   currentLang === 'hi' ? '• अकुशल ठेका श्रमिक, सुरक्षा एजेंसी (PSARA), गेट उपस्थिति व कम्प्लायंस-लॉक्ड बिलिंग' :
                   currentLang === 'bn' ? '• অসংগঠিত ঠিকাদারী শ্রমিক, সিকিউরিটি এজেন্সি (PSARA), গেট বায়োমেট্রিক ও লকড বিলিং' :
                   '• Unskilled Labor, Security Agencies (PSARA), Biometric Gate Entry & Compliance-Locked Billing'
  };

  if (isMobileView) {
    return (
      <MobileSingleView
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onSwitchToFullDesktop={() => toggleMobileMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen md:h-screen w-full bg-white text-slate-900 flex flex-col font-sans overflow-x-hidden md:overflow-hidden relative">
      
      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        
        {/* ========================================================================= */}
        {/* STANDALONE INDUSTRY & FACTORY SAAS TOP NAVIGATION (FULLY RESPONSIVE) */}
        {/* ========================================================================= */}
        <nav className="bg-slate-950 text-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center min-h-14 shrink-0 z-40 border-b border-indigo-900/60 shadow-md px-2.5 sm:px-4 py-2 sm:py-0 gap-2 sm:gap-0">
          
          {/* Top Row on Mobile: Brand Logo + Quick Controls */}
          <div className="flex items-center justify-between gap-2">
            {/* Brand & Logo */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-indigo-500/50 flex items-center justify-center shadow-xs overflow-hidden p-0.5">
                <img src="/ICWL.png" alt="ICWL Logo" className="w-full h-full object-contain rounded-lg" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-1">
                  <span className="hidden sm:inline">IndustrialContractorWorkerLink</span>
                  <span className="sm:hidden font-black text-indigo-300">ShramikLink</span>
                  <span className="text-indigo-400 font-bold text-[10px] sm:text-xs font-mono">(ICWL)</span>
                </span>
                <span className="text-[8px] sm:text-[9px] text-indigo-300/90 font-bold tracking-wider uppercase">
                  Factories Act, 1948 & CLRA 1970
                </span>
              </div>
            </div>

            {/* Quick Actions on Mobile Header */}
            <div className="flex sm:hidden items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('icwl-logout'));
                  window.dispatchEvent(new CustomEvent('shramiklink-logout'));
                }}
                title="Login / Portal Access"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold px-2 py-1 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="h-3 w-3 text-rose-400" />
                <span>{navText.loginBtn}</span>
              </button>

              <LanguageSelector 
                currentLang={currentLang} 
                onLanguageChange={handleLanguageChange} 
                variant="header" 
              />
            </div>
          </div>

          {/* Dedicated Sub-Tabs (Smooth Horizontal Scroll for Mobile) */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-0.5 sm:py-0 sm:h-full flex-1 sm:mx-3 scroll-smooth">
            <button
              id="industry-app-btn"
              onClick={() => handleTabChange('app')}
              className={`flex items-center justify-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-0 sm:h-full transition-all relative cursor-pointer whitespace-nowrap rounded-lg sm:rounded-none shrink-0 ${
                activeTab === 'app'
                  ? 'text-indigo-400 font-bold bg-indigo-950/70 sm:bg-indigo-950/40'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 sm:bg-transparent'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span className="text-[11px] sm:text-xs tracking-wide">{navText.appTab}</span>
              {activeTab === 'app' && (
                <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
              )}
            </button>

            <button
              id="platform-admin-btn"
              onClick={() => handleTabChange('admin')}
              className={`flex items-center justify-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-0 sm:h-full transition-all relative cursor-pointer whitespace-nowrap rounded-lg sm:rounded-none shrink-0 ${
                activeTab === 'admin'
                  ? 'text-indigo-400 font-bold bg-indigo-950/70 sm:bg-indigo-950/40'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 sm:bg-transparent'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span className="text-[11px] sm:text-xs tracking-wide">{navText.adminTab}</span>
              {activeTab === 'admin' && (
                <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
              )}
            </button>

            <button
              id="industry-arch-btn"
              onClick={() => handleTabChange('architecture')}
              className={`flex items-center justify-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-0 sm:h-full transition-all relative cursor-pointer whitespace-nowrap rounded-lg sm:rounded-none shrink-0 ${
                activeTab === 'architecture'
                  ? 'text-indigo-400 font-bold bg-indigo-950/70 sm:bg-indigo-950/40'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 sm:bg-transparent'
              }`}
            >
              <Database className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span className="text-[11px] sm:text-xs tracking-wide">{navText.archTab}</span>
              {activeTab === 'architecture' && (
                <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
              )}
            </button>

            <button
              id="industry-roadmap-btn"
              onClick={() => handleTabChange('roadmap')}
              className={`flex items-center justify-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-0 sm:h-full transition-all relative cursor-pointer whitespace-nowrap rounded-lg sm:rounded-none shrink-0 ${
                activeTab === 'roadmap'
                  ? 'text-indigo-400 font-bold bg-indigo-950/70 sm:bg-indigo-950/40'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 sm:bg-transparent'
              }`}
            >
              <Milestone className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span className="text-[11px] sm:text-xs tracking-wide">{navText.roadmapTab}</span>
              {activeTab === 'roadmap' && (
                <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
              )}
            </button>
          </div>

          {/* Quick Actions (Desktop Header) */}
          <div className="hidden sm:flex shrink-0 items-center gap-2">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('icwl-logout'));
                window.dispatchEvent(new CustomEvent('shramiklink-logout'));
              }}
              title="Portal Login"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-400" />
              <span>{navText.loginBtn}</span>
            </button>

            <button
              onClick={() => toggleMobileMode(true)}
              title="Mobile Card View"
              className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <Smartphone className="h-3.5 w-3.5 text-indigo-400" />
              <span>{navText.mobileBtn}</span>
            </button>

            <LanguageSelector 
              currentLang={currentLang} 
              onLanguageChange={handleLanguageChange} 
              variant="header" 
            />
          </div>
        </nav>

        {/* Persistent Statutory Legal Strip (Responsive Mobile Stacking) */}
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 border-b shadow-xs bg-indigo-950/90 border-indigo-800/60 text-indigo-200">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold flex items-center gap-1.5">
              <Factory className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span className="text-white">{navText.legalStripTitle}</span>
              <span className="text-indigo-300 font-mono text-[9px] sm:text-xs">
                Factories Act, 1948 & CLRA Act, 1970
              </span>
            </span>
            <span className="text-slate-400 hidden lg:inline text-[11px]">
              {navText.legalStripSub}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="text-[9px] sm:text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Zero Proxy & Locked Billing</span>
            </span>
          </div>
        </div>

        {/* Viewport Content with Clean White Dashboard Background */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-5 pb-8 space-y-4 sm:space-y-6 bg-white text-slate-900 scroll-smooth">
          
          {activeTab === 'app' && (
            <div className="space-y-6">
              <SaaSApp 
                externalLang={currentLang} 
                onLanguageChange={handleLanguageChange} 
              />
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm text-slate-900">
              <PlatformAdminPanel
                industries={initialIndustries}
                contractors={initialContractors}
                workers={initialWorkers}
                onSelectRole={(role) => {
                  handleTabChange('app');
                  localStorage.setItem('s_current_role', role);
                  sessionStorage.setItem('s_session_authenticated', 'true');
                  localStorage.setItem('s_is_logged_in', 'true');
                  window.dispatchEvent(new CustomEvent('shramiklink-switch-role', { detail: role }));
                }}
              />
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm text-slate-900">
              <ArchitectureDocs />
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm text-slate-900">
              <RoadmapView />
            </div>
          )}

          {/* Micro Footer */}
          <footer className="border-t border-slate-200 pt-6 text-[11px] text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <span>
              {currentLang === 'as' 
                ? '© 2026 IndustrialContractorWorkerLink (ICWL) • Factories Act, 1948 আৰু CLRA Act, 1970 ৰ নিৰ্দেশনা অনুযায়ী নিৰ্মিত ঔদ্যোগিক শ্ৰম আৰু ছিকিউৰিটি ব্যৱস্থাপনা প্ৰণালী।'
                : currentLang === 'hi'
                ? '© 2026 IndustrialContractorWorkerLink (ICWL) • Factories Act, 1948 एवं CLRA Act, 1970 के तहत निर्मित औद्योगिक श्रम व सुरक्षा एजेंसी अनुपालन प्रणाली।'
                : currentLang === 'bn'
                ? '© 2026 IndustrialContractorWorkerLink (ICWL) • Factories Act, 1948 ও CLRA Act, 1970 এর অধীনে নির্মিত শিল্প শ্রম ও সিকিউরিটি এজেন্সি সম্মতি ব্যবস্থা।'
                : '© 2026 IndustrialContractorWorkerLink (ICWL) • Built under Factories Act, 1948, CLRA Act, 1970 & PSARA 2005 for Industrial & Security Agency Compliance.'}
            </span>
            <div className="flex gap-4">
              <span className="text-slate-600 font-medium">EPFO & ESIC Compliance-Locked</span>
              <span>&bull;</span>
              <span className="text-slate-600 font-medium">CLRA Form XVI & XVII</span>
              <span>&bull;</span>
              <span className="text-indigo-600 font-bold">Founder: Bhaskar Senapati, Assam</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
