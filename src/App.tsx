/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, 
  BookOpen, 
  Database, 
  Cpu, 
  Layout, 
  Compass, 
  HelpCircle,
  Code2,
  BookmarkCheck,
  Server,
  UserCheck
} from 'lucide-react';
import DemoTab from './components/DemoTab';
import GuideTab from './components/GuideTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'docs'>('sandbox');

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* Top Navigation & Branding Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight leading-4 flex items-center gap-1.5">
                BelajarKuy! 
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-1.5 py-0.5 rounded-full border border-indigo-100">
                  Dev Blueprint
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Vue 3 + Laravel 11 + Supabase / MySQL</p>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/40">
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'sandbox'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Simulasi Interaktif (Sandbox)
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'docs'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Rancangan & Source Code
            </button>
          </div>

          {/* Quick Platform Badges */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-slate-600 font-semibold border border-slate-200">
              <Database className="w-3 h-3 text-emerald-600" />
              MySQL/Supabase
            </span>
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-slate-600 font-semibold border border-slate-200">
              <Server className="w-3 h-3 text-indigo-600" />
              Laravel API
            </span>
          </div>
        </div>
      </nav>

      {/* Main Showcase Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro Alert Banner */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl text-left">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold tracking-wide uppercase border border-indigo-100">
                SYSTEM ARCHITECT DRAFT
              </span>
              <span className="text-xs text-slate-400 font-mono">Status: Ready to Copy & Test</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Panduan Pembuatan Platform E-Learning Mandiri
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Selamat datang! Ini adalah modul analisis sistem dan pustaka kode siap pakai untuk membangun portal pembelajaran berbasis <strong>Laravel REST API</strong> sebagai Backend dan <strong>Vue.js 3 (Composition API)</strong> sebagai Frontend. Anda dapat berpindah tab untuk mempelajari skema tabel database, menyalin kodingan backend/frontend, atau langsung mencobanya di panel simulator interaktif.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-400 font-mono">Last updated</p>
              <p className="text-xs font-bold text-slate-700">Mei 2026 (Laravel 11, Vue 3)</p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
              <Code2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Contents loaded inside a layout animated frame */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm text-left"
        >
          {activeTab === 'sandbox' ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="text-indigo-600 w-5 h-5" />
                  Area Simulasi Aplikasi (Vue.js + Laravel API Sandbox)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Uji coba alur pendaftaran (Register), masuk akun (Login), pengambilan daftar materi dari Laravel, serta penyelesaian materi dengan kuis interaktif yang secara otomatis tercatat di baris log REST API.
                </p>
              </div>
              <DemoTab />
            </div>
          ) : (
            <GuideTab />
          )}
        </motion.div>

        {/* Informative Grid Benefits (Anti-slop, clean architectural highlights) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-xs space-y-2">
            <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center border border-emerald-100 mb-2">
              <Database className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Integritas Supabase / MySQL</h5>
            <p className="text-xs text-slate-500 leading-normal font-sans">
              Rancangan tabel memiliki foreign key referensial di tabel <code>user_progress</code> yang mereferensikan <code>users</code> dan <code>materials</code>. Memastikan relasi data aman dari orphanal records.
            </p>
          </div>

          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-xs space-y-2">
            <div className="w-9 h-9 bg-indigo-50 text-indigo-700 rounded-lg flex items-center justify-center border border-indigo-100 mb-2">
              <Server className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Sanctum Token Guard</h5>
            <p className="text-xs text-slate-500 leading-normal font-sans">
              Seluruh rute pengambilan kurikulum materials dan submission hasil terlindungi di balik Sanctum Middleware API Laravel, menjauhkan pembobolan materi oleh pengguna luar.
            </p>
          </div>

          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-xs space-y-2">
            <div className="w-9 h-9 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center border border-blue-100 mb-2">
              <Layout className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Vue 3 setup & Tailwind</h5>
            <p className="text-xs text-slate-500 leading-normal font-sans">
              Templat Vue.js menggunakan standard industri <code>{"<script setup>"}</code> dengan pemanggilan API asinkronus Axios yang reaktif untuk memperbarui data layout secara instan.
            </p>
          </div>

        </div>

      </main>

      {/* Footer Design Credits */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400 font-mono">
        <div>BelajarKuy Platform Pembelajaran Blueprint & Sandbox • 2026</div>
        <div className="mt-1 text-[10px] text-slate-300">Dibuat menggunakan spesifikasi arsitektur Laravel, Vue.js, Supabase, dan Tailwind CSS</div>
      </footer>

    </div>
  );
}

// Simple Icon fallback logic
function GraduationCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.91a2 2 0 0 0 1.66 0z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}

