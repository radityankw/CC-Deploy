/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cloud, BookOpen, Activity, Coins, Info, Layers, 
  HelpCircle, Compass, ShieldCheck, Cpu, ArrowDown, ChevronRight
} from 'lucide-react';

// Import our modular sub-components
import IaaS_PaaS_SaaS from './components/IaaS_PaaS_SaaS';
import CloudPricingCalculator from './components/CloudPricingCalculator';
import CloudArchitectureBuilder from './components/CloudArchitectureBuilder';
import DeploymentModels from './components/DeploymentModels';
import InteractiveQuiz from './components/InteractiveQuiz';

export default function App() {
  const [activeTab, setActiveTab] = useState<'fundamental' | 'models' | 'builder' | 'calculator' | 'quiz'>('fundamental');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1C1C1C] flex flex-col font-serif pb-16 selection:bg-blue-600 selection:text-white">
      
      {/* Floating Header */}
      <header className="sticky top-0 z-50 bg-[#FDFCFB]/90 backdrop-blur-md border-b border-[#1C1C1C] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-blue-600 flex items-center justify-center shadow-sm">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-black text-xl italic tracking-tight text-[#1C1C1C]">
                AwanAkademi
              </span>
              <span className="text-[9px] font-sans font-bold text-blue-600 block -mt-1 tracking-widest uppercase">
                Interactive Cloud Lab
              </span>
            </div>
          </div>

          {/* Elegant Sticky Navigation Anchors */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F7F4F0] p-1 rounded-sm border border-[#1C1C1C]">
            <button
              onClick={() => scrollToSection('fundamental-section')}
              className="px-3.5 py-1.5 rounded-sm text-xs font-sans font-bold uppercase tracking-wider text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#FDFCFB] transition-all cursor-pointer"
            >
              Fundamental
            </button>
            <button
              onClick={() => scrollToSection('service-models-card')}
              className="px-3.5 py-1.5 rounded-sm text-xs font-sans font-bold uppercase tracking-wider text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#FDFCFB] transition-all cursor-pointer"
            >
              Layanan (IaaS)
            </button>
            <button
              onClick={() => scrollToSection('deployment-models-card')}
              className="px-3.5 py-1.5 rounded-sm text-xs font-sans font-bold uppercase tracking-wider text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#FDFCFB] transition-all cursor-pointer"
            >
              Deployment
            </button>
            <button
              onClick={() => scrollToSection('architecture-builder-card')}
              className="px-3.5 py-1.5 rounded-sm text-xs font-sans font-bold uppercase tracking-wider text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#FDFCFB] transition-all cursor-pointer"
            >
              Lab Arsitektur
            </button>
            <button
              onClick={() => scrollToSection('pricing-calculator-card')}
              className="px-3.5 py-1.5 rounded-sm text-xs font-sans font-bold uppercase tracking-wider text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#FDFCFB] transition-all cursor-pointer"
            >
              Kalkulator Biaya
            </button>
            <button
              onClick={() => scrollToSection('interactive-quiz-card')}
              className="px-4 py-1.5 bg-blue-600 text-[#FDFCFB] rounded-sm text-xs font-sans font-bold uppercase tracking-wider hover:bg-blue-700 transition-all cursor-pointer"
            >
              Kuis Cepat
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 mt-8 flex-grow space-y-16 relative z-10 w-full">
        
        {/* HERO INTRO */}
        <section id="hero-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#F7F4F0] p-6 md:p-10 rounded-sm border-2 border-[#1C1C1C] overflow-hidden relative">
          
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-sm text-[10px] md:text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span className="text-blue-600 font-sans tracking-widest uppercase font-bold">
                  E-Learning Interaktif Satu Halaman
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl font-display font-black tracking-tighter leading-tight italic text-[#1C1C1C]">
                Cloud Computing.
              </h1>
              <p className="font-sans text-xs uppercase tracking-widest text-[#1C1C1C] font-bold block -mt-2">
                Pengantar Arsitektur Digital Untuk Skalabilitas Modern
              </p>
              
              <p className="text-sm md:text-base text-[#1C1C1C]/90 font-serif leading-relaxed max-w-xl">
                Komputasi awan bukan sekadar 'menyimpan file di internet'. Ini adalah revolusi penyediaan infrastruktur, platform, dan perangkat lunak dinamis di mana Anda hanya membayar apa yang Anda pergunakan (**Pay-As-You-Go** & **On-Demand**).
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => scrollToSection('architecture-builder-card')}
                className="px-6 py-3 bg-[#1C1C1C] text-[#FDFCFB] hover:bg-blue-600 font-sans font-bold uppercase tracking-widest text-xs transition-with duration-300 flex items-center gap-2 border border-[#1C1C1C] cursor-pointer"
              >
                Mulai Simulasi Topologi
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToSection('interactive-quiz-card')}
                className="px-6 py-3 bg-white text-[#1C1C1C] hover:bg-gray-100 font-sans font-bold uppercase tracking-widest text-xs transition-with duration-300 flex items-center gap-1 border border-[#1C1C1C] cursor-pointer"
              >
                Uji Pengetahuan (Kuis)
              </button>
            </div>
          </div>

          {/* Quick interactive infographic on the right */}
          <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-[#1C1C1C] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-sans font-black text-blue-600 uppercase tracking-widest">Analisis Komparatif</span>
              <h3 className="text-xl font-display font-bold text-[#1C1C1C] mt-1 italic">Mengapa Industri Bermigrasi?</h3>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3.5 text-xs">
                  <div className="p-1 px-1.5 bg-[#F7F4F0] border border-[#1C1C1C] text-[#1C1C1C] font-mono font-bold shrink-0">01</div>
                  <div>
                    <span className="font-sans font-extrabold uppercase tracking-wide block text-[#1C1C1C]">Tanpa Batas Fisik (Zero Hardwares)</span>
                    <span className="text-slate-600 text-[11px] font-serif leading-normal mt-0.5 block">Tak perlu merakit rack server, menarik kabel, pendingin AC jumbo, atau membeli genset listrik cadangan.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs">
                  <div className="p-1 px-1.5 bg-[#F7F4F0] border border-[#1C1C1C] text-[#1C1C1C] font-mono font-bold shrink-0">02</div>
                  <div>
                    <span className="font-sans font-extrabold uppercase tracking-wide block text-[#1C1C1C]">Skalabilitas Elastis (Elasticity)</span>
                    <span className="text-slate-600 text-[11px] font-serif leading-normal mt-0.5 block">Server bisa naik spek secara kilat (scale up) saat dibanjiri jutaan pengguna, lalu menciut (scale down) ketika malam tiba demi menghemat tagihan.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs">
                  <div className="p-1 px-1.5 bg-[#F7F4F0] border border-[#1C1C1C] text-[#1C1C1C] font-mono font-bold shrink-0">03</div>
                  <div>
                    <span className="font-sans font-extrabold uppercase tracking-wide block text-[#1C1C1C]">Ekonomi Pay-As-You-Go OpEx</span>
                    <span className="text-slate-600 text-[11px] font-serif leading-normal mt-0.5 block">Anda hanya didenda tagihan untuk jam operasi virtual server Anda saat aktif. Adil, transparan, tak ada server yang dibiarkan mubazir.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1C1C1C]/40 flex justify-between items-center text-[10px] font-sans uppercase tracking-widest text-slate-500 font-bold">
              <span>Kurikulum Industri Terstandarisasi</span>
              <button 
                onClick={() => scrollToSection('fundamental-section')}
                className="text-blue-600 hover:underline flex items-center gap-0.5 font-bold"
              >
                Lihat Dasar NIST
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 1: COMPREHENSIVE FUNDAMENTAL (NIST Standard Indonesian) */}
        <section id="fundamental-section" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-sans text-blue-600 tracking-[0.2em] uppercase font-bold block">Dasar Teori Komputasi Awan</span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#1C1C1C] italic">5 Pilar Pokok Karakteristik Cloud (NIST)</h2>
            <div className="h-[2px] bg-blue-600 w-24 mx-auto my-3" />
            <p className="text-sm text-slate-600 max-w-xl mx-auto italic">
              Lembaga Standarisasi Nasional Amerika (NIST) menetapkan 5 syarat wajib agar sebuah teknologi dapat dikategorikan sebagai "Cloud Computing" yang sah:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {/* Char 1 */}
            <div className="p-5 bg-white border border-[#1C1C1C] hover:bg-[#F7F4F0] rounded-sm transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans font-extrabold text-blue-600 tracking-wider block">PILAR 01</span>
                <h3 className="text-sm font-sans font-extrabold text-[#1C1C1C] uppercase mt-1 leading-snug">On-Demand Self-Service</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2.5 font-serif">
                  Pengguna bisa menyewa VM, database, atau kapasitas storage secara mandiri lewat dashboard tanpa intervensi manual staf internal provider.
                </p>
              </div>
            </div>

            {/* Char 2 */}
            <div className="p-5 bg-white border border-[#1C1C1C] hover:bg-[#F7F4F0] rounded-sm transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans font-extrabold text-blue-600 tracking-wider block">PILAR 02</span>
                <h3 className="text-sm font-sans font-extrabold text-[#1C1C1C] uppercase mt-1 leading-snug">Broad Network Access</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2.5 font-serif">
                  Semua instansi software dan resource bisa diakses tanpa hambatan melewati aneka perangkat (HP, Laptop, Tablet) di jaringan internet standar.
                </p>
              </div>
            </div>

            {/* Char 3 */}
            <div className="p-5 bg-white border border-[#1C1C1C] hover:bg-[#F7F4F0] rounded-sm transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans font-extrabold text-blue-600 tracking-wider block">PILAR 03</span>
                <h3 className="text-sm font-sans font-extrabold text-[#1C1C1C] uppercase mt-1 leading-snug">Resource Pooling</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2.5 font-serif">
                  Sumber daya fisik (CPU, RAM, HDD) dikelompokkan bersama oleh provider untuk melayani banyak tenant dengan isolasi keamanan data mutlak.
                </p>
              </div>
            </div>

            {/* Char 4 */}
            <div className="p-5 bg-[#F7F4F0] border border-[#1C1C1C] hover:bg-white rounded-sm transition-all duration-300 flex flex-col justify-between ring-1 ring-[#1C1C1C]/10">
              <div>
                <span className="text-[10px] font-sans font-extrabold text-blue-600 tracking-wider block">PILAR 04</span>
                <h3 className="text-sm font-sans font-extrabold text-[#1C1C1C] uppercase mt-1 leading-snug">Rapid Elasticity</h3>
                <p className="text-xs text-slate-800 leading-relaxed mt-2.5 font-serif font-bold italic">
                  Kapasitas server mengembang (scale-up) atau meremas kempis (scale-down) super kilat secara fleksibel sejalan fluktuasi grafik trafik real-time.
                </p>
              </div>
            </div>

            {/* Char 5 */}
            <div className="p-5 bg-white border border-[#1C1C1C] hover:bg-[#F7F4F0] rounded-sm transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans font-extrabold text-blue-600 tracking-wider block">PILAR 05</span>
                <h3 className="text-sm font-sans font-extrabold text-[#1C1C1C] uppercase mt-1 leading-snug">Measured Service</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2.5 font-serif">
                  Sistem pencatatan pemakaian berjalan otomatis dan sangat akurat, mirip sistem arloji pemakaian air PDAM atau pulsa listrik rumah Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE SERVICE MODELS COMPONENT (IaaS, PaaS, SaaS) */}
        <section id="service-models-section">
          <IaaS_PaaS_SaaS />
        </section>

        {/* SECTION 3: COMPREHENSIVE DEPLOYMENT MODELS */}
        <section id="deployment-models-section">
          <DeploymentModels />
        </section>

        {/* SECTION 4: ARCHITECTURE SIMULATOR & LAB TOOL */}
        <section id="architecture-simulator-section">
          <CloudArchitectureBuilder />
        </section>

        {/* SECTION 5: CLOUD ECONOMY CALCULATOR */}
        <section id="pricing-calculator-section">
          <CloudPricingCalculator />
        </section>

        {/* SECTION 6: INTERACTIVE DRILL / QUIZ */}
        <section id="quiz-section">
          <InteractiveQuiz />
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#1C1C1C] pt-8 pb-4 text-center text-xs text-[#1C1C1C] max-w-7xl mx-auto w-full px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-blue-600" />
          <span className="font-sans font-bold uppercase tracking-wider text-[11px]">© 2026 AwanAkademi. Kompilasi Satu Halaman Pembelajaran Interaktif.</span>
        </div>
        <div className="flex gap-4 font-sans font-bold text-slate-500 uppercase tracking-widest text-[10px]">
          <span>Materi E-Learning</span>
          <span>•</span>
          <span>Insinyur Awan Masa Depan 🇮🇩</span>
        </div>
      </footer>
    </div>
  );
}
