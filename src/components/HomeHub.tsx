import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Shield, 
  UserCheck, 
  ClipboardCheck, 
  FileText, 
  Scale, 
  UserPlus, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  TrendingUp, 
  PhoneCall, 
  Factory, 
  Home as HomeIcon,
  HardHat,
  Lock,
  ExternalLink,
  Layers,
  Milestone,
  Send,
  LogIn
} from 'lucide-react';
import { AppLanguage } from '../i18n';
import { Industry, Contractor, Worker } from '../types';

interface HomeHubProps {
  currentLang: AppLanguage;
  industries: Industry[];
  contractors: Contractor[];
  workers: Worker[];
  onNavigateToPanel: (roleKey: string, subCategory?: string) => void;
  onNavigateToTab: (tab: 'app' | 'admin' | 'architecture' | 'roadmap') => void;
  onRegisterRole?: (roleKey: string, subCategory?: string) => void;
  onContractorApplyIndustry?: () => void;
  onAgencyApplyApartment?: () => void;
}

export default function HomeHub({
  currentLang,
  industries,
  contractors,
  workers,
  onNavigateToPanel,
  onNavigateToTab,
  onRegisterRole,
  onContractorApplyIndustry,
  onAgencyApplyApartment
}: HomeHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'enterprise' | 'agency' | 'worker' | 'supervisor' | 'governance'>('all');

  // Counts
  const totalIndustries = industries.length;
  const totalContractors = contractors.length;
  const totalWorkers = workers.length;
  const totalGuards = workers.filter(w => w.workerType === 'Security-Guard' || w.workerType === 'Security-Supervisor').length;
  const deployedWorkers = workers.filter(w => w.status === 'Deployed').length;

  // The 10 Essential Modules Specified by User
  const panels = useMemo(() => [
    {
      id: 'admin',
      roleKey: 'admin_panel',
      registerRoleKey: '',
      category: 'governance',
      icon: ShieldCheck,
      accentColor: 'purple',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      title: currentLang === 'as' ? '🛡️ ছুপাৰ এডমিন পেনেল ও পিয়ল' : 
             currentLang === 'hi' ? '🛡️ सुपर एडमिन प्लेटफॉर्म पैनल व सेंसस' : 
             currentLang === 'bn' ? '🛡️ সুপার অ্যাডমিন প্ল্যাটফর্ম প্যানেল' : 
             '🛡️ Super Admin Platform Panel & Census',
      subTitle: currentLang === 'as' ? 'Unified Census • ₹1/Day Billing • Bank Transfer • User Moderation' :
                currentLang === 'hi' ? 'समग्र सेंसस • ₹1/दिन बिलिंग • बैंक ट्रांसफर' :
                currentLang === 'bn' ? 'প্ল্যাটফর্ম সেন্সাস • ₹১/দিন বিলিং • ব্যাঙ্ক পেমেন্ট' :
                'Unified Census • ₹1/Day Billing • User Moderation',
      target: currentLang === 'as' ? 'প্লেটফৰ্ম পৰিচালক আৰু মুখ্য প্ৰশাসন' : 'Platform Operations & Founders',
      description: currentLang === 'as'
        ? 'সকলো উদ্যোগ, ঠিকাদাৰ আৰু শ্ৰমিকৰ কেন্দ্ৰীয় তালিকা, মাহিলী ইনভয়েচ জেনেৰেচন (@₹১/দিন), বেংক ট্ৰাঞ্চফাৰ আৰু ব্লেকলিষ্ট ব্যৱস্থাপনা।'
        : 'Platform-wide census, monthly billing generation under ₹1/worker/day model, salary bank disbursement records, and user moderation.',
      highlights: [
        currentLang === 'as' ? 'প্ৰতিষ্ঠান আৰু শ্ৰমিকৰ কেন্দ্ৰীয় পিয়ল (Platform Census)' : 'Platform-Wide Census',
        currentLang === 'as' ? 'মাহিলী ইনভয়েচ প্ৰস্তুত (@₹১/শ্ৰমিক/দিন)' : 'Monthly Billing (@₹1/Worker/Day)',
        currentLang === 'as' ? 'দৰমহা বেংক হস্তান্তৰ খতিয়ান (Bank Transfer)' : 'Salary Bank Transfer Ledger',
        currentLang === 'as' ? 'ব্যৱহাৰকাৰী এক্টিভেশন আৰু ব্লেকলিষ্ট কন্ট্ৰোল' : 'User Status & Blacklist Control'
      ],
      actionText: currentLang === 'as' ? 'এডমিন পেনেল খোলক' : 'Open Admin Panel',
      tag: 'Master Control',
      isSystemPortal: true
    },
    {
      id: 'architecture',
      roleKey: 'architecture_guide',
      registerRoleKey: '',
      category: 'governance',
      icon: Compass,
      accentColor: 'slate',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      title: currentLang === 'as' ? '📐 CLRA সংৰচনা আৰু আইনী নিৰ্দেশনা' : 
             currentLang === 'hi' ? '📐 CLRA ढांचा व कानूनी निर्देशिका' : 
             currentLang === 'bn' ? '📐 CLRA কাঠামো ও আইনি নির্দেশিকা' : 
             '📐 CLRA Structure & Legal Architecture',
      subTitle: currentLang === 'as' ? 'Interactive Flowchart • Original Master Blueprint • CLRA Compliance' :
                currentLang === 'hi' ? 'इंटरएक्टिव फ्लोचार्ट • मास्टर ब्लूप्रिंट' :
                currentLang === 'bn' ? 'ইন্টারেক্টিভ ফ্লোচার্ট • মাস্টার ব্লুপ্রিন্ট' :
                'Interactive Flowchart & Master Blueprint',
      target: currentLang === 'as' ? 'গ্ৰাহক, উদ্যোগিক এইচ.আৰ., আৰু আইনী পৰিদৰ্শক' : 'Clients, Auditors & Investors',
      description: currentLang === 'as'
        ? 'প্লেটফৰ্মৰ মূল ৫ টা স্তম্ভ আৰু শ্ৰম পৰিদৰ্শকৰ সংৰচনাৰ ইণ্টাৰেক্টিভ ডিজিটেল গাইড আৰু মূল ব্লুপ্ৰিন্ট চিত্ৰ পৰিদৰ্শন কৰক।'
        : 'Explore the full multi-tier architecture diagram, customer hierarchy, and statutory CLRA compliance workflow with high-res diagram.',
      highlights: [
        currentLang === 'as' ? '৫ টা মূল স্তম্ভ আৰু শ্ৰম পৰিদৰ্শক সংৰচনা' : '5-Pillar Customer Hierarchy',
        currentLang === 'as' ? 'ইণ্টাৰেক্টিভ ডিজিটেল ফ্ল’চাৰ্ট (Interactive Diagram)' : 'Interactive Capability Diagram',
        currentLang === 'as' ? 'মূল নিৰ্দেশনা চিত্ৰ প্ৰদৰ্শন (Original Blueprint View)' : 'Original Blueprint Image Viewer',
        currentLang === 'as' ? 'আইনী ধাৰা আৰু অনুপালন নিৰ্দেশনা' : 'CLRA Legal Guidelines'
      ],
      actionText: currentLang === 'as' ? 'আইনী কাঠামো চাওক' : 'View CLRA Structure',
      tag: 'Customer Pitch',
      isSystemPortal: true
    },
    {
      id: 'roadmap',
      roleKey: 'roadmap_view',
      registerRoleKey: '',
      category: 'governance',
      icon: Milestone,
      accentColor: 'indigo',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: currentLang === 'as' ? '🚀 ভৱিষ্যৎ ৰোডমেপ আৰু সম্প্ৰসাৰণ' : 
             currentLang === 'hi' ? '🚀 भविष्य का रोडमैप व विस्तार' : 
             currentLang === 'bn' ? '🚀 ভবিষ্যৎ রোডম্যাপ ও সম্প্রসারণ' : 
             '🚀 Roadmap & Strategic Expansion',
      subTitle: currentLang === 'as' ? 'Phase 1 to Phase 4 • ₹1/Day Scaling • Pan-India Vision' :
                currentLang === 'hi' ? 'फेज 1 से 4 • ₹1/दिन स्केलिंग • अखिल भारतीय विजन' :
                currentLang === 'bn' ? 'ফেজ ১ থেকে ৪ • ₹১/দিন স্কেলিং • সর্বভারতীয় ভিশন' :
                'Phase 1 to 4 • ₹1/Day Scaling • Pan-India Vision',
      target: currentLang === 'as' ? 'বিনিয়োগকাৰী, প্ৰতিষ্ঠাপক আৰু ৰণনীতি অংশীদাৰ' : 'Investors, Founders & Partners',
      description: currentLang === 'as'
        ? 'IndustrialContractorWorkerLink ৰ ৪ টা পৰ্যায়ৰ ভৱিষ্যৎ ৰোডমেপ, AI ভিত্তিক স্কেনিং, বেংক পেমেন্ট আৰু উত্তৰ-পূৰ্বাঞ্চল সম্প্ৰসাৰণ।'
        : 'Explore the 4-phase strategic roadmap, automated compliance AI, multi-bank payment pipelines, and regional industrial expansion.',
      highlights: [
        currentLang === 'as' ? 'পৰ্যায় ১-৪ ৰণনীতি ৰোডমেপ (Strategic 4-Phase Roadmap)' : '4-Phase Strategic Roadmap',
        currentLang === 'as' ? '₹১/শ্ৰমিক/দিন মডেল স্কেলিং (₹1/Worker Scaling)' : '₹1/Worker/Day Micro-SaaS Scaling',
        currentLang === 'as' ? 'অসম আৰু উত্তৰ-পূৰ্বাঞ্চল ঔদ্যোগিক হাব' : 'Assam & NE Industrial Expansion',
        currentLang === 'as' ? 'AI আধাৰ বায়’মেট্ৰিক ও ভইচ হাজিৰা' : 'AI Biometric & Multilingual Voice Hazira'
      ],
      actionText: currentLang === 'as' ? 'ৰোডমেপ চাওক' : 'View Roadmap',
      tag: 'Strategic Vision',
      isSystemPortal: true
    },
    {
      id: 'industry',
      roleKey: 'industry_admin',
      subCategory: 'Industry HR',
      registerRoleKey: 'industry_admin',
      category: 'enterprise',
      icon: Building2,
      accentColor: 'indigo',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: currentLang === 'as' ? '🏭 কাৰখানা কনচোল আৰু বিলিং' : 
             currentLang === 'hi' ? '🏭 कारखाना कंसोल व बिलिंग' : 
             currentLang === 'bn' ? '🏭 কারখানা কনসোল ও বিলিং' : 
             '🏭 Factory Console & Billing',
      subTitle: currentLang === 'as' ? 'Factory HR • Apartment Owner • Shop • Corporate Office' :
                currentLang === 'hi' ? 'कारखाना HR • अपार्टमेंट सोसाइटी • दुकान मालिक • कार्यालय' :
                currentLang === 'bn' ? 'শিল্প এইচআর • অ্যাপার্টমেন্ট ওনার • দোকান • কর্পোরেট অফিস' :
                'Factory HR • Apartment Owner • Shop Owner • Office',
      target: currentLang === 'as' ? 'উদ্যোগ মালিক, কাৰখানা প্ৰবন্ধক আৰু এইচ.আৰ.' : 'Factory Management & HR',
      description: currentLang === 'as' 
        ? 'শ্ৰমিকৰ চাহিদা প্ৰেৰণ, ঠিকাদাৰ অনুমোদন, ইউনিট অনুসৰি ছুপাৰভাইজাৰ অৰ্পণ, গেট হাজিৰা আৰু ₹১/দিনৰ বিলিং নিৰীক্ষণ কৰক।'
        : 'Publish manpower requisitions, approve contractor supply, assign unit supervisors, and track compliance-locked muster billing.',
      highlights: [
        currentLang === 'as' ? 'শ্ৰমিক চাহিদা প্ৰেৰণ (Labor Requisition)' : 'Labor Requisition Management',
        currentLang === 'as' ? 'ঠিকাদাৰ সংযোগ আৰু অনুমোদন (Contractor Connect)' : 'Contractor Approval & Linking',
        currentLang === 'as' ? 'ছুপাৰভাইজাৰক শ্ৰমিক অৰ্পণ (Assign to Supervisor)' : 'Unit-wise Supervisor Assignment',
        currentLang === 'as' ? 'মাহিলী বিল আৰু পেমেন্ট ট্ৰেকিং (Admin Bill & Pay)' : 'Admin Billing & Payment Status'
      ],
      actionText: currentLang === 'as' ? 'উদ্যোগ পেনেলত প্ৰৱেশ' : 'Enter Factory Console',
      registerText: currentLang === 'as' ? 'প্ৰতিষ্ঠান পঞ্জীয়ন' : 'Register Enterprise',
      tag: 'Principal Employer'
    },
    {
      id: 'contractor',
      roleKey: 'contractor',
      subCategory: 'Labour Contractor',
      registerRoleKey: 'contractor',
      category: 'agency',
      icon: Users,
      accentColor: 'blue',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      title: currentLang === 'as' ? '🏢 শ্ৰম ঠিকাদাৰ পেনেল (Labour Contractor Desk)' : 
             currentLang === 'hi' ? '🏢 श्रम ठेकेदार डेस्क (Labour Contractor Desk)' : 
             currentLang === 'bn' ? '🏢 শ্রম ঠিকাদার ডেস্ক (Labour Contractor Desk)' : 
             '🏢 Labour Contractor Desk',
      subTitle: currentLang === 'as' ? 'Licensed Manpower Vendor • Gang Leaders (সৰ্দাৰ)' :
                currentLang === 'hi' ? 'लाइसेंस प्राप्त श्रम ठेकेदार • गैंग लीडर' :
                currentLang === 'bn' ? 'লাইসেন্সধারী লেবার ঠিকাদার • দলনেতা' :
                'Licensed Manpower Vendor • Gang Leaders',
      target: currentLang === 'as' ? 'শ্ৰম ঠিকাদাৰ আৰু মেনপাৱাৰ ভেন্দৰ' : 'Labor Contractors & Vendors',
      description: currentLang === 'as'
        ? 'উদ্যোগলৈ শ্ৰমিক যোগান, কৰ্মীদল পৰিচালনা, আৰু শ্ৰম আইনৰ ৫ টা বৈধানিক ৰেজিষ্টাৰ (Form XIII, XVII, XVI ইত্যাদি) ৰক্ষণাবেক্ষণ কৰক।'
        : 'Supply workforce to factories, manage roster, track wage disbursements, and maintain all 5 mandatory CLRA registers.',
      highlights: [
        currentLang === 'as' ? '৫ টা আইনগত ৰেজিষ্টাৰ (Form XIII, XVII, XVI)' : '5 Mandatory CLRA Registers',
        currentLang === 'as' ? 'উদ্যোগ চাহিদাৰ বাবে আবেদন (Apply to Requisitions)' : 'Apply to Factory Requisitions',
        currentLang === 'as' ? 'শ্ৰমিক প্ৰফাইল আৰু মজুৰি হিচাপ (Wage & Loan Ledger)' : 'Wage, Advance & Loan Ledger',
        currentLang === 'as' ? 'মুক্ত শ্ৰমিক পুলৰ পৰা কৰ্মী অন্তৰ্ভুক্তি' : 'Workforce Pool Integration'
      ],
      actionText: currentLang === 'as' ? 'ঠিকাদাৰ পেনেলত প্ৰৱেশ' : 'Enter Contractor Desk',
      registerText: currentLang === 'as' ? 'ঠিকাদাৰ পঞ্জীয়ন' : 'Register Contractor',
      tag: 'CLRA Licensed',
      hasB2BRequestButton: true,
      b2bButtonText: currentLang === 'as' ? '🏭 Industry HR ৰ কাম বিচাৰি আবেদন' : '🏭 Find Work & Apply to Industry HR',
      b2bButtonType: 'contractor_to_industry'
    },
    {
      id: 'security_agency',
      roleKey: 'contractor',
      subCategory: 'Security Agency',
      registerRoleKey: 'security_agency',
      category: 'agency',
      icon: Shield,
      accentColor: 'cyan',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      title: currentLang === 'as' ? '🛡️ ছিকিউৰিটি চাৰ্ভিচ এজেন্সি পেনেল' : 
             currentLang === 'hi' ? '🛡️ सुरक्षा सेवा एजेंसी पैनल (PSARA)' : 
             currentLang === 'bn' ? '🛡️ নিরাপত্তা সংস্থা প্যানেল (PSARA)' : 
             '🛡️ Security Service Agency Desk',
      subTitle: currentLang === 'as' ? 'PSARA Licensed Security Guard & Supervisor Provider' :
                currentLang === 'hi' ? 'PSARA लाइसेंस प्राप्त सुरक्षा एजेंसी' :
                currentLang === 'bn' ? 'PSARA অনুমোদিত সিকিউরিটি এজেন্সি' :
                'PSARA Licensed Security Agency',
      target: currentLang === 'as' ? 'ছিকিউৰিটি এজেন্সি আৰু গাৰ্ড যোগানকৰ্তা' : 'PSARA Security Agencies',
      description: currentLang === 'as'
        ? 'গেট নিৰাপত্তাৰক্ষী আৰু ছুপাৰভাইজাৰ মোতায়েন, শিফট ডিউটি ৰষ্টাৰ, অস্ত্ৰহীন গাৰ্ড ভেৰিফিকেচন আৰু বিলিং পৰিচালনা কৰক।'
        : 'Deploy unarmed guards and security supervisors, schedule shifts, verify guard records, and manage enterprise security contracts.',
      highlights: [
        currentLang === 'as' ? 'নিৰাপত্তাৰক্ষী ও ছুপাৰভাইজাৰ নিযুক্তি (Guard Roster)' : 'Guard & Supervisor Roster',
        currentLang === 'as' ? 'গেট ডিউটি শিফট মেনেজমেন্ট (Shift Management)' : 'Shift Management & Patrol',
        currentLang === 'as' ? 'PSARA লাইসেন্স ও পৰীক্ষণ তথ্য (PSARA Compliance)' : 'PSARA Compliance Records',
        currentLang === 'as' ? 'এজেন্সি ইনভয়েচ আৰু বিলিং (Agency Billing)' : 'Agency Enterprise Invoicing'
      ],
      actionText: currentLang === 'as' ? 'ছিকিউৰিটি এজেন্সিত প্ৰৱেশ' : 'Enter Security Agency Desk',
      registerText: currentLang === 'as' ? 'এজেন্সি পঞ্জীয়ন' : 'Register Security Agency',
      tag: 'PSARA 2005',
      hasB2BRequestButton: true,
      b2bButtonText: currentLang === 'as' ? '🏢 এপাৰ্টমেণ্ট/দোকানলৈ নিৰাপত্তা প্ৰস্তাৱ' : '🏢 Send Security Proposal to Owners',
      b2bButtonType: 'agency_to_apartment'
    },
    {
      id: 'worker',
      roleKey: 'worker',
      registerRoleKey: 'worker',
      category: 'worker',
      icon: HardHat,
      accentColor: 'amber',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      title: currentLang === 'as' ? '👤 অসংগঠিত শ্ৰমিক ডেক্স আৰু স্মাৰ্ট কাৰ্ড' : 
             currentLang === 'hi' ? '👤 अकुशल श्रमिक डेस्क व स्मार्ट कार्ड' : 
             currentLang === 'bn' ? '👤 অনভিজ্ঞ শ্রমিক ডেস্ক ও স্মার্ট কার্ড' : 
             '👤 Unskilled Labourer Desk & Smart Card',
      subTitle: currentLang === 'as' ? 'Digital Smart Card • Daily Hazira • Wage Slips • EPFO/ESIC' :
                currentLang === 'hi' ? 'डिजिटल स्मार्ट कार्ड • दैनिक हाजिरी • वेतन पर्ची' :
                currentLang === 'bn' ? 'ডিজিটাল স্মার্ট কার্ড • দৈনিক হাজিরা • পে স্লিপ' :
                'Digital Smart Card • Daily Hazira • Wage Slips • EPFO/ESIC',
      target: currentLang === 'as' ? 'কাৰখানা শ্ৰমিক, সহায়ক আৰু দিনহাজিৰা কৰ্মী' : 'Floor Laborers & Helpers',
      description: currentLang === 'as'
        ? 'ডিজিটেল স্মাৰ্ট কাৰ্ড, দৈনিক হাজিৰাৰ খতিয়ান, দৰমহাৰ পে-স্লিপ, PF ব্যালেন্স সোধ-পোছ আৰু এডমিন হেল্পলাইন কলৰ সুবিধা।'
        : 'View verified Digital Smart Card with QR, check daily hazira logs, wage payout history, raise PF balance inquiry, and direct admin helpline.',
      highlights: [
        currentLang === 'as' ? 'ডিজিটেল স্মাৰ্ট কাৰ্ড (Smart Card with QR & ID)' : 'Digital Smart Card & QR',
        currentLang === 'as' ? 'নিয়োজিত উদ্যোগ, ঠিকাদাৰ আৰু ছুপাৰভাইজাৰৰ বিৱৰণ' : 'Mapped Industry & Contractor Info',
        currentLang === 'as' ? 'PF ব্যালেন্স সোধ-পোছ আৰু আবেদন (PF Inquiry)' : 'PF Balance Inquiry & Help',
        currentLang === 'as' ? 'দৰমহা আৰু হাজিৰা ট্ৰাঞ্জেকচন (Wage History)' : 'Transparent Wage Ledger'
      ],
      actionText: currentLang === 'as' ? 'শ্ৰমিক ডেক্সত প্ৰৱেশ' : 'Enter Worker Desk',
      registerText: currentLang === 'as' ? 'শ্ৰমিক পঞ্জীয়ন' : 'Register New Worker',
      tag: 'Zero-Proxy'
    },
    {
      id: 'security_guard',
      roleKey: 'security_guard',
      registerRoleKey: 'security_guard',
      category: 'worker',
      icon: UserCheck,
      accentColor: 'emerald',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: currentLang === 'as' ? '👮 নিৰাপত্তাৰক্ষী আৰু ছুপাৰভাইজাৰ ডেক্স' : 
             currentLang === 'hi' ? '👮 सुरक्षा गार्ड व सुपरवाइजर डेस्क' : 
             currentLang === 'bn' ? '👮 নিরাপত্তা কর্মী ও সুপারভাইজার ডেস্ক' : 
             '👮 Security Guard & Supervisor Desk',
      subTitle: currentLang === 'as' ? 'Unarmed Security Guard • Security Supervisor • Gate Pass' :
                currentLang === 'hi' ? 'अशस्त्र सुरक्षा गार्ड • गेट ड्यूटी • इन/आउट' :
                currentLang === 'bn' ? 'অস্ত্রবিহীন সিকিউরিটি গার্ড • গেট পাস' :
                'Unarmed Security Guard • Gate Duty • Pass In/Out',
      target: currentLang === 'as' ? 'কাৰখানা আৰু প্ৰতিষ্ঠানৰ গেট নিৰাপত্তাৰক্ষী' : 'Gate Security Guards',
      description: currentLang === 'as'
        ? 'গেট ডিউটি স্মাৰ্ট কাৰ্ড, ভিজিটৰ এণ্ট্ৰি/এক্সিট পাছ, মালবস্তুৰ গেট পাছ আৰু জৰুৰীকালীন সাহায্য নম্বৰৰ সুবিধা।'
        : 'Access guard identification smart card, log visitor entry/exit, verify material gate passes, and access direct emergency helpline.',
      highlights: [
        currentLang === 'as' ? 'গাৰ্ড স্মাৰ্ট কাৰ্ড আৰু ভেৰিফিকেচন (Guard ID Card)' : 'Guard Smart ID Card',
        currentLang === 'as' ? 'গেট পাছ আৰু এন্ট্ৰি/এক্সিট লগ (Gate Duty Log)' : 'Gate Entry & Material Pass Log',
        currentLang === 'as' ? 'এজেন্সী সংযোগ আৰু আইডি লিংক (Agency Connect)' : 'Agency Connection & Verification',
        currentLang === 'as' ? 'জৰুৰীকালীন যোগাযোগ আৰু হেল্পলাইন' : 'Emergency SOS & Helpline'
      ],
      actionText: currentLang === 'as' ? 'গাৰ্ড ডেক্সত প্ৰৱেশ' : 'Enter Guard Desk',
      registerText: currentLang === 'as' ? 'গাৰ্ড পঞ্জীয়ন' : 'Register New Guard',
      tag: 'Gate Security'
    },
    {
      id: 'supervisor',
      roleKey: 'supervisor',
      registerRoleKey: 'supervisor',
      category: 'supervisor',
      icon: ClipboardCheck,
      accentColor: 'teal',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      title: currentLang === 'as' ? '📋 উদ্যোগ ছুপাৰভাইজাৰ আৰু হাজিৰা ডেক্স' : 
             currentLang === 'hi' ? '📋 उद्योग सुपरवाइजर व हाजिरी डेस्क' : 
             currentLang === 'bn' ? '📋 শিল্প সুপারভাইজার ও হাজিরা ডেস্ক' : 
             '📋 Industry Supervisor Attendance Desk',
      subTitle: currentLang === 'as' ? 'Field Section In-Charge • Gate Biometric Check-In • Daily Hazira' :
                currentLang === 'hi' ? 'फील्ड सुपरवाइजर • गेट बायोमेट्रिक उपस्थिति' :
                currentLang === 'bn' ? 'ফিল্ড সুপারভাইজার • বায়োমেট্রিক হাজিরা' :
                'Field Section In-Charge • Gate Entry • Attendance',
      target: currentLang === 'as' ? 'কাৰখানা মজিয়া আৰু ইউনিট ছুপাৰভাইজাৰ' : 'Floor & Gate Supervisors',
      description: currentLang === 'as'
        ? 'দৈনিক শ্ৰমিক আৰু গাৰ্ডৰ গেট হাজিৰা নথিভুক্তকৰণ, উপস্থিতি লক, আৰু উদ্যোগলৈ অভিযোগ দাখিল (এডমিন আৰু ঠিকাদাৰলৈ CC প্ৰতিলিপি সহ)।'
        : 'Record daily shift attendance, mark biometric gate check-in, and file on-duty complaints with automatic CC to Admin and Contractor.',
      highlights: [
        currentLang === 'as' ? 'দৈনিক গেট হাজিৰা (Daily Shift Attendance)' : 'Daily Shift Attendance Logging',
        currentLang === 'as' ? 'বায়’মেট্ৰিক ও ফেইচ ভেৰিফিকেচন টেগিং' : 'Biometric & Gate Verification',
        currentLang === 'as' ? 'অভিযোগ প্ৰেৰণ (CC to Admin & Contractor)' : 'Complaint Filing with CC Copy',
        currentLang === 'as' ? 'ইউনিট অনুসৰি শ্ৰমিক নিৰীক্ষণ' : 'Section Workforce Monitoring'
      ],
      actionText: currentLang === 'as' ? 'ছুপাৰভাইজাৰ পেনেলত প্ৰৱেশ' : 'Enter Supervisor Desk',
      registerText: currentLang === 'as' ? 'ছুপাৰভাইজাৰ পঞ্জীয়ন' : 'Register Supervisor',
      tag: 'Field Operations'
    },
    {
      id: 'inspector',
      roleKey: 'government_inspector',
      registerRoleKey: 'government_inspector',
      category: 'governance',
      icon: Scale,
      accentColor: 'rose',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      title: currentLang === 'as' ? '⚖️ চৰকাৰী শ্ৰম পৰিদৰ্শক পেনেল' : 
             currentLang === 'hi' ? '⚖️ सरकारी श्रम निरीक्षक पैनल' : 
             currentLang === 'bn' ? '⚖️ সরকারি শ্রম পরিদর্শক প্যানেল' : 
             '⚖️ Labour Inspector Statutory Panel',
      subTitle: currentLang === 'as' ? 'Govt Labor Commissionerate • Form XVI/XVII Audit • Statutory Notices' :
                currentLang === 'hi' ? 'श्रम विभाग • Form XVI/XVII ऑडिट • कानूनी नोटिस' :
                currentLang === 'bn' ? 'শ্রম কমিশনার অফিস • Form XVI/XVII অডিট' :
                'Govt Labor Inspection • Form XVI/XVII Audit',
      target: currentLang === 'as' ? 'সহকাৰী শ্ৰম আয়ুক্ত আৰু কাৰখানা পৰিদৰ্শক' : 'Government Labor Officers',
      description: currentLang === 'as'
        ? 'শ্ৰম আইন (CLRA & Factories Act) অনুসৰি কাৰখানা নিৰীক্ষণ, ডিজিটেল মাষ্টাৰ ৰোল পৰীক্ষা, আইনী জাননী জাৰি আৰু জৰিমনা নথিভুক্তকৰণ।'
        : 'Inspect factory labor rosters, audit Form XVI attendance & Form XVII wage registers digitally, and issue compliance notices.',
      highlights: [
        currentLang === 'as' ? 'ডিজিটেল মাষ্টাৰ ৰোল পৰীক্ষা (Form XVI & XVII Audit)' : 'Form XVI & XVII Digital Audit',
        currentLang === 'as' ? 'আইনী জাননী আৰু জৰিমনা জাৰি (Statutory Notices)' : 'Statutory Notices & Fines',
        currentLang === 'as' ? 'EPFO আৰু ESIC চালন নিশ্চিতকৰণ' : 'EPF & ESI Remittance Verification',
        currentLang === 'as' ? 'অধিক্ষেত্ৰ অনুসৰি উদ্যোগ পৰিদৰ্শন' : 'Jurisdiction Industry Inspection'
      ],
      actionText: currentLang === 'as' ? 'পৰিদৰ্শক পেনেলত প্ৰৱেশ' : 'Enter Inspector Desk',
      registerText: currentLang === 'as' ? 'পৰিদৰ্শক পঞ্জীয়ন' : 'Register Inspector',
      tag: 'Government Apex'
    }
  ], [currentLang]);

  // Filtering
  const filteredPanels = useMemo(() => {
    return panels.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const matchesQuery = 
        p.title.toLowerCase().includes(q) ||
        p.subTitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.target.toLowerCase().includes(q) ||
        p.highlights.some(h => h.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [panels, selectedCategory, searchQuery]);

  const handlePanelClick = (panel: typeof panels[0]) => {
    if (panel.id === 'admin') {
      onNavigateToTab('admin');
      return;
    }
    if (panel.id === 'architecture') {
      onNavigateToTab('architecture');
      return;
    }
    if (panel.id === 'roadmap') {
      onNavigateToTab('roadmap');
      return;
    }

    // Direct Login / Role-based navigation to SaaSApp
    onNavigateToPanel(panel.roleKey, panel.subCategory);
  };

  const handleRegisterClick = (panel: typeof panels[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRegisterRole) {
      onRegisterRole(panel.registerRoleKey || panel.roleKey, panel.subCategory);
    } else {
      window.dispatchEvent(new CustomEvent('icwl-open-register', { 
        detail: { role: panel.registerRoleKey || panel.roleKey, subCategory: panel.subCategory } 
      }));
      onNavigateToTab('app');
    }
  };

  const handleB2BActionClick = (panel: typeof panels[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (panel.b2bButtonType === 'contractor_to_industry') {
      if (onContractorApplyIndustry) {
        onContractorApplyIndustry();
      } else {
        window.dispatchEvent(new CustomEvent('icwl-contractor-apply-industry'));
        onNavigateToTab('app');
      }
    } else if (panel.b2bButtonType === 'agency_to_apartment') {
      if (onAgencyApplyApartment) {
        onAgencyApplyApartment();
      } else {
        window.dispatchEvent(new CustomEvent('icwl-agency-apply-apartment'));
        onNavigateToTab('app');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-900/60 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {currentLang === 'as' 
                  ? 'সকলো পেনেলৰ কেন্দ্ৰীয় দ্বাৰ • IndustrialContractorWorkerLink (ICWL) Operations Hub'
                  : 'Central All-in-One Operations Hub • IndustrialContractorWorkerLink (ICWL)'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {currentLang === 'as' ? (
                <>
                  স্বাগতম! <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-300 via-sky-300 to-emerald-300">আপোনাৰ প্ৰয়োজনীয় পেনেল বাছনি কৰক</span>
                </>
              ) : currentLang === 'hi' ? (
                <>
                  स्वागत है! <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-300 via-sky-300 to-emerald-300">अपना आवश्यक पैनल चुनें</span>
                </>
              ) : (
                <>
                  Welcome! <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-300 via-sky-300 to-emerald-300">Choose Any Portal to Start Working</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentLang === 'as'
                ? 'উদ্যোগ এইচ.আৰ., শ্ৰম ঠিকাদাৰ, ছিকিউৰিটি সংস্থা, অসংগঠিত শ্ৰমিক, গাৰ্ড, ছুপাৰভাইজাৰ আৰু চৰকাৰী শ্ৰম পৰিদৰ্শক—আটাইবোৰ পেনেল ইয়াত উপলব্ধ। আপুনি যাক যি পেনেল প্ৰয়োজন, ইয়াত পোনপটীয়াকৈ ক্লিক কৰি কাম আৰম্ভ কৰিব পাৰে।'
                : 'Central directory for Factory HR, Labor Contractors, Security Agencies, Unskilled Workers, Security Guards, Supervisors, and Labor Inspectors. Select any panel below for instant 1-click access.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                {currentLang === 'as' ? 'প্ৰতিষ্ঠান' : 'Enterprises'}
              </span>
              <span className="text-xl font-black text-indigo-400 flex items-center gap-1.5 mt-0.5">
                <Factory className="w-4 h-4 text-indigo-400" />
                {totalIndustries}
              </span>
              <span className="text-[9px] text-slate-400">Industry & Apt</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                {currentLang === 'as' ? 'ঠিকাদাৰ ও সংস্থা' : 'Agencies'}
              </span>
              <span className="text-xl font-black text-blue-400 flex items-center gap-1.5 mt-0.5">
                <Users className="w-4 h-4 text-blue-400" />
                {totalContractors}
              </span>
              <span className="text-[9px] text-slate-400">CLRA & PSARA</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                {currentLang === 'as' ? 'সক্ৰিয় কৰ্মীদল' : 'Active Workers'}
              </span>
              <span className="text-xl font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <HardHat className="w-4 h-4 text-emerald-400" />
                {totalWorkers}
              </span>
              <span className="text-[9px] text-emerald-300 font-medium">{deployedWorkers} Deployed</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                {currentLang === 'as' ? 'বিলিং নিৰিখ' : 'Billing Rate'}
              </span>
              <span className="text-xl font-black text-amber-400 flex items-center gap-1 mt-0.5">
                ₹১<span className="text-xs text-slate-300 font-normal">/দিন</span>
              </span>
              <span className="text-[9px] text-slate-400">EPF/ESI Locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Navigation */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLang === 'as' 
                  ? 'পেনেল বা সুবিধা বিচাৰক (যেনে: Industry, Security Guard, হাজিৰা, বিলিং, Inspector)...'
                  : 'Search panel, role, or feature (e.g., Industry, Security Guard, Attendance, Billing, Inspector)...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Flowchart Guide CTA */}
          <button
            onClick={() => onNavigateToTab('architecture')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>
              {currentLang === 'as' ? 'ফ্ল’চাৰ্ট গাইড চাওক' : 'View Workflow Guide'}
            </span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'all', label: currentLang === 'as' ? 'সকলো পেনেল (All Panels)' : 'All Panels' },
            { id: 'enterprise', label: currentLang === 'as' ? '🏭 প্ৰতিষ্ঠান ও মালিক (Enterprises)' : 'Enterprises' },
            { id: 'agency', label: currentLang === 'as' ? '🏢 ঠিকাদাৰ ও ছিকিউৰিটি (Agencies)' : 'Agencies' },
            { id: 'worker', label: currentLang === 'as' ? '👤 শ্ৰমিক ও গাৰ্ড (Workers)' : 'Workers & Guards' },
            { id: 'supervisor', label: currentLang === 'as' ? '📋 ছুপাৰভাইজাৰ ও হাজিৰা (Supervisors)' : 'Supervisors' },
            { id: 'governance', label: currentLang === 'as' ? '🛡️ এডমিন ও পৰিদৰ্শক (Admin & Inspector)' : 'Admin & Inspector' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of All Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPanels.map((panel) => {
          const IconComp = panel.icon;
          return (
            <div
              key={panel.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                
                {/* Header: Icon + Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-indigo-50 border border-slate-200 group-hover:border-indigo-200 flex items-center justify-center transition-colors">
                    <IconComp className="w-6 h-6 text-slate-700 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${panel.badgeColor}`}>
                    {panel.tag}
                  </span>
                </div>

                {/* Title & Target */}
                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                    {panel.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5 line-clamp-1">
                    {panel.subTitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {panel.description}
                </p>

                {/* Key Capabilities */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {currentLang === 'as' ? 'মুখ্য সুবিধাসমূহ:' : 'Key Capabilities:'}
                  </span>
                  {panel.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-tight">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Dual Login & Registration + B2B Requisitions */}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                {panel.isSystemPortal ? (
                  <button
                    onClick={() => handlePanelClick(panel)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 group-hover:shadow-indigo-500/20"
                  >
                    <span>{panel.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Direct Login / Enter Button */}
                      <button
                        onClick={() => handlePanelClick(panel)}
                        className="py-2.5 px-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                        title={currentLang === 'as' ? 'এই পেনেলত পোনে পোনে প্ৰৱেশ কৰক' : 'Direct Login / Enter Portal'}
                      >
                        <LogIn className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{panel.actionText}</span>
                      </button>

                      {/* Register New Account Button */}
                      <button
                        onClick={(e) => handleRegisterClick(panel, e)}
                        className="py-2.5 px-3 bg-white hover:bg-indigo-50 text-indigo-700 hover:text-indigo-900 font-bold border border-indigo-200 hover:border-indigo-400 rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                        title={currentLang === 'as' ? 'নতুন একাউণ্ট পঞ্জীয়ন কৰক' : 'Register New Account'}
                      >
                        <UserPlus className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">{panel.registerText || 'Register'}</span>
                      </button>
                    </div>

                    {/* Dedicated B2B Connection & Work Request Shortcut */}
                    {panel.hasB2BRequestButton && (
                      <button
                        onClick={(e) => handleB2BActionClick(panel, e)}
                        className={`w-full py-2 px-3 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98 border ${
                          panel.b2bButtonType === 'contractor_to_industry'
                            ? 'bg-linear-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white border-blue-700/60'
                            : 'bg-linear-to-r from-cyan-900 to-teal-900 hover:from-cyan-800 hover:to-teal-800 text-white border-cyan-700/60'
                        }`}
                        title={panel.b2bButtonText}
                      >
                        <Send className="w-3 h-3 text-amber-300 shrink-0" />
                        <span className="truncate">{panel.b2bButtonText}</span>
                        <ArrowRight className="w-3 h-3 shrink-0" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredPanels.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">কোনো পেনেল বিচাৰি পোৱা নগ’ল</h4>
          <p className="text-xs text-slate-500 mt-1">আপোনাৰ সন্ধান শব্দ পুনৰ পৰীক্ষা কৰক বা সকলো পেনেল বাছনি কৰক।</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
          >
            সকলো পেনেল দেখুৱাওক
          </button>
        </div>
      )}

      {/* Founder & Help Section */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white border border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-black text-xs">
            ICWL
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>IndustrialContractorWorkerLink (ICWL) • প্ৰতিষ্ঠাপক: ভাস্কৰ সেনাপতি (Bhaskar Senapati)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">Assam & NE India</span>
            </h4>
            <p className="text-xs text-slate-300">
              কাৰিকৰী সহায় বা এণ্টাৰপ্ৰাইজ অনবৰ্ডিংৰ বাবে: <span className="font-mono text-indigo-300">senapatibhaskar6@gmail.com</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('architecture')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
        >
          কাৰ্য্যপ্ৰণালী ও আইনগত কাঠামো চাওক →
        </button>
      </div>

    </div>
  );
}
