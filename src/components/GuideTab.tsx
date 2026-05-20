import React, { useState } from 'react';
import { 
  Database, 
  FolderTree, 
  Terminal, 
  BookOpen, 
  Copy, 
  Check, 
  Code, 
  Layout, 
  Server, 
  ChevronRight, 
  Hash, 
  Link2 
} from 'lucide-react';
import { 
  DATABASE_BLUEPRINT, 
  LARAVEL_ROUTES, 
  LARAVEL_AUTH_CONTROLLER, 
  LARAVEL_MATERIAL_CONTROLLER, 
  VUE_LOGIN, 
  VUE_REGISTER, 
  VUE_DASHBOARD, 
  VUE_MATERIAL_DETAIL 
} from '../codeSnippets';

export default function GuideTab() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Step Selector Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Rancangan Panduan Developer</h2>
          <p className="text-xs text-slate-500 mt-1">Panduan langkah-demi-langkah (Step-by-Step) berbasis arsitektur nyata.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeStep === 1 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Langkah 1: Database & IA
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeStep === 2 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Langkah 2: Laravel Backend
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeStep === 3 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            Langkah 3: Vue.js Frontend
          </button>
        </div>
      </div>

      {/* STEP 1: DATABASE & IA */}
      {activeStep === 1 && (
        <div className="space-y-8 animate-fadeIn">
          {/* Conceptual Intro */}
          <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="text-base font-bold text-indigo-950 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-600 text-white rounded-md text-xs font-mono">01</span>
              Database Relasional & Arsitektur Informasi (IA)
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Pada rancangan ini, kita memecah data menjadi 4 entitas relasional utama untuk menjamin konsistensi data, integritas referensial (foreign keys), dan kemudahan query pengerjaan modul. Model ini didesain agar kompatibel baik di <strong>MySQL lokal</strong> maupun <strong>Supabase (PostgreSQL)</strong>.
            </p>
          </div>

          {/* Database Relations Diagram */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-emerald-600" />
              Relasi Skema Database (E-R Diagram Ringkas)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">1. Users</span>
                <ul className="mt-3 space-y-1.5 font-mono text-slate-500">
                  <li className="text-slate-900 font-bold">🔑 id (PK)</li>
                  <li>name (string)</li>
                  <li>email (unique)</li>
                  <li>password</li>
                </ul>
              </div>

              <div className="flex items-center justify-center text-slate-400 font-bold py-2 md:py-0">
                <div className="text-center">
                  <span className="hidden md:block">1 : N (Foreign Key)</span>
                  <span className="md:hidden">⬇ 1 : N</span>
                  <ChevronRight className="w-5 h-5 mx-auto hidden md:block" />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">4. User_Progress</span>
                <ul className="mt-3 space-y-1.5 font-mono text-slate-500">
                  <li className="text-slate-900 font-bold">🔑 id (PK)</li>
                  <li className="text-indigo-600 font-bold">🔌 user_id (FK)</li>
                  <li className="text-indigo-600 font-bold">🔌 material_id (FK)</li>
                  <li>quiz_score (int)</li>
                  <li>completed_at</li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">2. Materials</span>
                <ul className="mt-3 space-y-1.5 font-mono text-slate-500">
                  <li className="text-slate-900 font-bold">🔑 id (PK)</li>
                  <li>title (string)</li>
                  <li>slug (unique)</li>
                  <li>description</li>
                </ul>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <span className="font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">3. Lessons</span>
                  <ul className="mt-2 space-y-1 font-mono text-slate-400">
                    <li>🔑 id</li>
                    <li className="text-indigo-600 font-bold">🔌 material_id</li>
                    <li>content_markdown</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Folder Structure */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-600" />
              Arsitektur Folder Utama (Vue.js 3 + Composition API)
            </h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Struktur project modular memisahkan reusable components (seperti Navbar), views dinamis utama, routing middleware, dan manajemen state utama (lewat Pinia/LocalStorage).
            </p>
            <div className="bg-slate-900 text-slate-300 p-5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
<pre>{`src/
├── assets/             # Aset gambar, logo, ikon global
├── components/         # Reusable Custom Components
│   ├── Navbar.vue      # Header dan status autentikasi atas
│   └── QuizWidget.vue  # Form pengerjaan kuis materi
├── router/
│   └── index.js        # Konfigurasi Vue Router (Auth Navigation Guard)
├── stores/
│   └── auth.js         # State management untuk token & user login
├── views/              # Halaman Tampilan Utama (Point of Entry)
│   ├── Login.vue       # Halaman Masuk Akun
│   ├── Register.vue    # Halaman Sign Up Baru
│   ├── Dashboard.vue   # Grid daftar ketersediaan modul materi
│   └── MaterialDetail.vue # Viewer sub-modul materi & pengerjaan kuis
├── App.vue             # Root layout utama (<router-view />)
└── main.js             # Bootstrapper Vue instance & inisialisasi awal`}</pre>
            </div>
          </div>

          {/* Database Code Snippet */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Code className="w-4 h-4 text-slate-600" />
                SQL DDL Script (MySQL atau Supabase PostgreSQL)
              </h4>
              <button
                onClick={() => handleCopy(DATABASE_BLUEPRINT, 'sql')}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg transition"
              >
                {copiedKey === 'sql' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Salin Skema
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-900 rounded-xl overflow-hidden text-xs max-h-[400px] overflow-y-auto">
              <pre className="p-5 text-slate-300 font-mono text-left whitespace-pre">{DATABASE_BLUEPRINT}</pre>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: LARAVEL BACKEND */}
      {activeStep === 2 && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-600 text-white rounded-md text-sm font-mono">02</span>
              Backend API Laravel (Autentikasi & Penyediaan Materi)
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Sistem backend Laravel dinamis bertugas menerbitkan <strong>Laravel Sanctum Token</strong> berbasis bearer token saat login/register berhasil. Rute pembelajaran dilindungi middleware token agar hanya siswa terverifikasi yang dapat mengunduh materi.
            </p>
          </div>

          {/* Route Config */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                📁 routes/api.php
              </span>
              <button
                onClick={() => handleCopy(LARAVEL_ROUTES, 'laravel_routes')}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded transition"
              >
                {copiedKey === 'laravel_routes' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                Salin Rute
              </button>
            </div>
            <div className="bg-slate-900 rounded-xl overflow-hidden text-xs max-h-[300px] overflow-y-auto">
              <pre className="p-5 text-slate-300 font-mono text-left whitespace-pre">{LARAVEL_ROUTES}</pre>
            </div>
          </div>

          {/* AuthController Code */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                📁 App/Http/Controllers/Api/AuthController.php
              </span>
              <button
                onClick={() => handleCopy(LARAVEL_AUTH_CONTROLLER, 'laravel_auth')}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded transition"
              >
                {copiedKey === 'laravel_auth' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                Salin Controller
              </button>
            </div>
            <div className="bg-slate-900 rounded-xl overflow-hidden text-xs max-h-[400px] overflow-y-auto">
              <pre className="p-5 text-slate-300 font-mono text-left whitespace-pre">{LARAVEL_AUTH_CONTROLLER}</pre>
            </div>
          </div>

          {/* MaterialController Code */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                📁 App/Http/Controllers/Api/MaterialController.php
              </span>
              <button
                onClick={() => handleCopy(LARAVEL_MATERIAL_CONTROLLER, 'laravel_mat')}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded transition"
              >
                {copiedKey === 'laravel_mat' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                Salin Controller
              </button>
            </div>
            <div className="bg-slate-900 rounded-xl overflow-hidden text-xs max-h-[400px] overflow-y-auto">
              <pre className="p-5 text-slate-300 font-mono text-left whitespace-pre">{LARAVEL_MATERIAL_CONTROLLER}</pre>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: VUEJS FRONTEND */}
      {activeStep === 3 && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-600 text-white rounded-md text-sm font-mono">03</span>
              Frontend Vue.js 3 dengan Composition API & Tailwind
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Membangun komponen reaktif yang fleksibel menggunakan sintaks modern <code>{"<script setup>"}</code>, terintegrasi penuh dengan <strong>Axios</strong> untuk memicu endpoint Laravel secara asinkronus dan <strong>Tailwind CSS</strong> untuk penataan visual.
            </p>
          </div>

          {/* Tab Submenu untuk Berbagai File Vue */}
          <div className="space-y-6">
            {/* Login View */}
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">1. Halaman Login</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">LoginView.vue - Autentikasi Form & validasi state email/password.</p>
                </div>
                <button
                  onClick={() => handleCopy(VUE_LOGIN, 'vue_login')}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded transition"
                >
                  {copiedKey === 'vue_login' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Salin Vue
                </button>
              </div>
              <div className="bg-slate-900 rounded-xl overflow-hidden text-xs max-h-[300px] overflow-y-auto">
                <pre className="p-4 text-slate-300 font-mono text-left whitespace-pre">{VUE_LOGIN}</pre>
              </div>
            </div>

            {/* Register View */}
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">2. Halaman Registrasi</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">RegisterView.vue - Registrasi siswa baru dan konfirmasi sandi.</p>
                </div>
                <button
                  onClick={() => handleCopy(VUE_REGISTER, 'vue_register')}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded transition"
                >
                  {copiedKey === 'vue_register' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Salin Vue
                </button>
              </div>
              <div className="bg-slate-900 rounded-xl overflow-hidden text-xs max-h-[300px] overflow-y-auto">
                <pre className="p-4 text-slate-300 font-mono text-left whitespace-pre">{VUE_REGISTER}</pre>
              </div>
            </div>

            {/* Dashboard View */}
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">3. Dashboard Utama</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">DashboardView.vue - Mapping grid modul pembelajaran, integrasi auth token filter.</p>
                </div>
                <button
                  onClick={() => handleCopy(VUE_DASHBOARD, 'vue_dashboard')}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded transition"
                >
                  {copiedKey === 'vue_dashboard' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Salin Vue
                </button>
              </div>
              <div className="bg-slate-900 rounded-xl overflow-hidden text-xs max-h-[300px] overflow-y-auto">
                <pre className="p-4 text-slate-300 font-mono text-left whitespace-pre">{VUE_DASHBOARD}</pre>
              </div>
            </div>

            {/* MaterialDetail View */}
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">4. Viewer Detail Komponen Dinamis</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">MaterialDetail.vue - Tampilan dinamis sub-chapter kurikulum dengan kuis penilaian interaktif.</p>
                </div>
                <button
                  onClick={() => handleCopy(VUE_MATERIAL_DETAIL, 'vue_detail')}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded transition"
                >
                  {copiedKey === 'vue_detail' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Salin Vue
                </button>
              </div>
              <div className="bg-slate-900 rounded-xl overflow-hidden text-xs max-h-[300px] overflow-y-auto">
                <pre className="p-4 text-slate-300 font-mono text-left whitespace-pre">{VUE_MATERIAL_DETAIL}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
