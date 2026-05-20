import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Terminal as TermIcon, 
  ArrowLeft, 
  Lock, 
  UserPlus, 
  CheckCircle, 
  BookOpen, 
  Activity, 
  LogOut, 
  GraduationCap,
  Calendar,
  Layers,
  CirclePlay,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MOCK_MATERIALS, MockMaterial } from '../data';

interface LogEntry {
  id: string;
  method: 'GET' | 'POST' | 'DELETE';
  url: string;
  status: number;
  timestamp: string;
  payload?: any;
  response: any;
}

export default function DemoTab() {
  // Navigation & Sesi state
  const [page, setPage] = useState<'login' | 'register' | 'dashboard' | 'detail'>('login');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  
  // Quiz progress state
  const [materialsProgress, setMaterialsProgress] = useState<Record<number, { isCompleted: boolean; quizScore: number | null }>>({
    1: { isCompleted: false, quizScore: null },
    2: { isCompleted: false, quizScore: null },
    3: { isCompleted: false, quizScore: null }
  });

  const [selectedSlug, setSelectedSlug] = useState<string>('cloud-computing');
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: 'siswa@eduonline.id', password: 'password123' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState<string | null>(null);

  // Inspector Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Add Log helper
  const addLog = (method: 'GET' | 'POST' | 'DELETE', url: string, status: number, payload?: any, response?: any) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      method,
      url,
      status,
      timestamp: new Date().toLocaleTimeString(),
      payload,
      response
    };
    setLogs(prev => [newLog, ...prev]);
    setSelectedLog(newLog); // Auto-focus newest log
  };

  // Initial log
  useEffect(() => {
    if (logs.length === 0) {
      addLog('GET', '/api/health', 200, undefined, { status: 'ok', server: 'Laravel 11.x', database: 'MySQL & Redis Connected' });
    }
  }, []);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!loginForm.email || !loginForm.password) {
      setAuthError('Email dan password wajib diisi');
      return;
    }

    const payload = { ...loginForm };
    let mockUser = { name: 'Kurniawan', email: loginForm.email };
    
    // Simulate API Response
    const response = {
      status: 'success',
      message: 'Login berhasil!',
      data: {
        user: { id: 104, name: 'Kurniawan', email: loginForm.email },
        access_token: '12|sanctum_token_6bc781fd4f22a8bc94d',
        token_type: 'Bearer'
      }
    };

    addLog('POST', '/api/login', 200, payload, response);
    setCurrentUser(mockUser);
    setPage('dashboard');
    
    // Log listing materials
    setTimeout(() => {
      triggerMaterialsFetch();
    }, 450);
  };

  // Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setAuthError('Mohon isi semua field pendaftaran');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError('Sandi konfirmasi tidak cocok');
      return;
    }

    const payload = { ...registerForm };
    const mockUser = { name: registerForm.name, email: registerForm.email };
    
    const response = {
      status: 'success',
      message: 'Registrasi berhasil',
      data: {
        user: { id: 105, name: registerForm.name, email: registerForm.email },
        access_token: '13|sanctum_token_88dfcca23719da6ef91',
        token_type: 'Bearer'
      }
    };

    addLog('POST', '/api/register', 201, payload, response);
    setCurrentUser(mockUser);
    setPage('dashboard');

    setTimeout(() => {
      triggerMaterialsFetch();
    }, 450);
  };

  const triggerMaterialsFetch = () => {
    const response = {
      status: 'success',
      data: MOCK_MATERIALS.map(m => ({
        id: m.id,
        title: m.title,
        slug: m.slug,
        description: m.description,
        difficulty_level: m.difficulty_level,
        duration_minutes: m.duration_minutes,
        is_completed: materialsProgress[m.id].isCompleted,
        quiz_score: materialsProgress[m.id].quizScore
      }))
    };
    addLog('GET', '/api/materials', 200, undefined, response);
  };

  // Handle Logout
  const handleLogout = () => {
    const token = '12|sanctum_token_6bc781fd4f22a8bc94d';
    addLog('POST', '/api/logout', 200, {}, { status: 'success', message: 'Berhasil keluar, token dicabut.' });
    setCurrentUser(null);
    setLoginForm({ email: 'siswa@eduonline.id', password: 'password123' });
    setPage('login');
  };

  // Handle Selected Material View
  const handleViewMaterial = (slug: string) => {
    const mat = MOCK_MATERIALS.find(m => m.slug === slug);
    if (!mat) return;
    
    setSelectedSlug(slug);
    setQuizChoice(null);
    setQuizError(null);
    setPage('detail');

    const response = {
      status: 'success',
      data: {
        material: mat,
        progress: {
          is_completed: materialsProgress[mat.id].isCompleted,
          quiz_score: materialsProgress[mat.id].quizScore
        }
      }
    };
    addLog('GET', `/api/materials/${slug}`, 200, undefined, response);
  };

  // Handle Quiz Submission
  const handleQuizSubmit = (materialId: number, selectedIndex: number) => {
    const mat = MOCK_MATERIALS.find(m => m.id === materialId);
    if (!mat) return;

    if (selectedIndex !== mat.correctQuizIndex) {
      setQuizError('Jawaban kurang tepat! Silakan baca kembali sub-materi di atas.');
      // Log wrong attempt
      addLog('POST', `/api/materials/${mat.id}/complete`, 422, { quiz_answer_index: selectedIndex }, {
        status: 'error',
        message: 'Jawaban salah, silakan coba lagi.'
      });
      return;
    }

    // Success
    setQuizError(null);
    setMaterialsProgress(prev => ({
      ...prev,
      [materialId]: { isCompleted: true, quizScore: 100 }
    }));

    const response = {
      status: 'success',
      message: 'Progres modul berhasil disimpan!',
      data: {
        id: Math.floor(Math.random() * 500) + 1,
        user_id: 104,
        material_id: materialId,
        completed_at: new Date().toISOString(),
        quiz_score: 100
      }
    };

    addLog('POST', `/api/materials/${materialId}/complete`, 200, { quiz_score: 100 }, response);
  };

  // Reset progress simulation
  const handleResetSimulation = () => {
    setMaterialsProgress({
      1: { isCompleted: false, quizScore: null },
      2: { isCompleted: false, quizScore: null },
      3: { isCompleted: false, quizScore: null }
    });
    setLogs([]);
    addLog('GET', '/api/health', 200, undefined, { status: 'simulation_reset', progress: 'restored to pristine' });
  };

  const activeMaterial = MOCK_MATERIALS.find(m => m.slug === selectedSlug) || MOCK_MATERIALS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* LEFT PANEL: SIMULATED BROWSER (VUE PORTAL) */}
      <div className="lg:col-span-8 flex flex-col border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm h-[720px]">
        
        {/* Mock Browser Frame Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-400 rounded-full inline-block"></span>
            <span className="w-3 h-3 bg-amber-400 rounded-full inline-block"></span>
            <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span>
          </div>
          
          <div className="flex-1 max-w-md mx-4 bg-white border border-slate-200 rounded-md text-[11px] font-mono py-1 px-3 text-slate-500 shadow-inner flex items-center justify-between">
            <span className="truncate">http://localhost:5173/{page === 'detail' ? `materials/${selectedSlug}` : page}</span>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 rounded">Vue Client</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleResetSimulation}
              title="Reset Simulasi Data"
              className="p-1 text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 rounded hover:shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-400 font-bold uppercase select-none">Preview App</span>
          </div>
        </div>

        {/* Browser Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative flex flex-col text-slate-800 text-left">
          
          {/* SIMULATED VIEW: LOGIN */}
          {page === 'login' && (
            <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-12">
              <div className="max-w-md w-full mx-auto space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-600 text-white font-mono font-bold rounded-2xl flex items-center justify-center mx-auto text-xl shadow-md">
                    B
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-slate-900 tracking-tight">Masuk ke Portal Belajar</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Gunakan kredensial default untuk mencoba asisten login.
                  </p>
                </div>

                <div className="bg-white py-6 px-6 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                  {authError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 text-xs text-red-700 font-medium">
                      {authError}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700">Alamat Email</label>
                      <input 
                        type="email" 
                        value={loginForm.email}
                        onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs" 
                        placeholder="nama@email.com"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700">Password</label>
                      <input 
                        type="password" 
                        value={loginForm.password}
                        onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                        placeholder="••••••••"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                    >
                      Masuk (Login)
                    </button>
                  </form>

                  <div className="pt-4 border-t border-slate-100 text-center">
                    <p className="text-[11px] text-slate-500">
                      Belum punya akun?{' '}
                      <button 
                        onClick={() => { setPage('register'); setAuthError(null); }}
                        className="font-bold text-indigo-600 hover:text-indigo-500"
                      >
                        Register Baru
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATED VIEW: REGISTER */}
          {page === 'register' && (
            <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-12">
              <div className="max-w-md w-full mx-auto space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-600 text-white font-mono font-bold rounded-2xl flex items-center justify-center mx-auto text-xl shadow-md">
                    B
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-slate-900 tracking-tight">Daftar Akun Baru</h3>
                  <p className="mt-1 text-xs text-slate-500">Buat akun siswa simulasi untuk menguji token Sanctum.</p>
                </div>

                <div className="bg-white py-6 px-6 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                  {authError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 text-xs text-red-700 font-medium">
                      {authError}
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700">Nama Lengkap</label>
                      <input 
                        type="text" 
                        required
                        value={registerForm.name}
                        onChange={e => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                        placeholder="Budi Santoso"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700">Alamat Email</label>
                      <input 
                        type="email" 
                        required
                        value={registerForm.email}
                        onChange={e => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 block w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs" 
                        placeholder="budi@domain.com"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700">Password</label>
                      <input 
                        type="password" 
                        required
                        value={registerForm.password}
                        onChange={e => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        className="mt-1 block w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                        placeholder="Minimal 8 karakter"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700">Konfirmasi Password</label>
                      <input 
                        type="password" 
                        required
                        value={registerForm.confirmPassword}
                        onChange={e => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="mt-1 block w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                        placeholder="Sandi konfirmasi"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                    >
                      Daftar (Registrasi)
                    </button>
                  </form>

                  <div className="pt-3 border-t border-slate-100 text-center">
                    <p className="text-[11px] text-slate-500">
                      Sudah punya akun?{' '}
                      <button 
                        onClick={() => { setPage('login'); setAuthError(null); }}
                        className="font-bold text-indigo-600 hover:text-indigo-500"
                      >
                        Login Saja
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATED VIEW: DASHBOARD */}
          {page === 'dashboard' && (
            <div className="flex-1 flex flex-col">
              {/* Header Navbar */}
              <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-600 text-white rounded font-mono font-bold text-xs">B</span>
                  <span className="text-sm font-bold tracking-tight text-slate-900">Portal EduOnline</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-600">
                    Siswa: <strong className="text-slate-800">{currentUser?.name || 'Siswa'}</strong>
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-slate-100 hover:bg-red-50 hover:text-red-700 rounded font-semibold text-slate-700 transition"
                  >
                    <LogOut className="w-3 h-3" />
                    Keluar (Logout)
                  </button>
                </div>
              </header>

              {/* Main Container */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Banner */}
                <div className="bg-indigo-950 rounded-xl p-5 text-white shadow-sm relative overflow-hidden">
                  <div className="relative z-10 max-w-md">
                    <span className="bg-indigo-500 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wide">STUDENT HUB</span>
                    <h4 className="text-lg font-extrabold tracking-tight mt-1.5">Selamat Datang di Hub Pembelajaran!</h4>
                    <p className="mt-1 text-[11px] text-indigo-200 leading-relaxed">
                      Silakan pilih modul di bawah untuk memulai pembelajaran mandiri secara interaktif. Selesaikan kuis untuk mengantongi skor.
                    </p>
                  </div>
                  <div className="absolute right-3 bottom-0 top-0 w-24 opacity-10 flex items-center justify-center">
                    <GraduationCap className="w-16 h-16" />
                  </div>
                </div>

                {/* Grid Header */}
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Modul Terdaftar</h5>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    3 Modul Tersedia
                  </span>
                </div>

                {/* Grid Modules */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {MOCK_MATERIALS.map(m => {
                    const progress = materialsProgress[m.id];
                    return (
                      <div 
                        key={m.id}
                        className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition duration-200"
                      >
                        <div className="p-4 flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                              m.difficulty_level === 'Beginner' ? 'bg-green-50 text-green-700' :
                              m.difficulty_level === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                              'bg-rose-50 text-rose-700'
                            }`}>
                              {m.difficulty_level}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">⏱️ {m.duration_minutes}m</span>
                          </div>

                          <h6 className="text-xs font-bold font-sans text-slate-900 group-hover:text-indigo-600 transition truncate-2-lines h-8 leading-tight">
                            {m.title}
                          </h6>
                          <p className="text-[11px] text-slate-500 leading-normal line-clamp-3">
                            {m.description}
                          </p>
                        </div>

                        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            {progress.isCompleted ? (
                              <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1 border border-emerald-100 animate-pulse">
                                ✓ Lulus <span className="font-mono text-[9px]">({progress.quizScore}/100)</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium text-[10px]">Belum Mulai</span>
                            )}
                          </div>
                          
                          <button 
                            onClick={() => handleViewMaterial(m.slug)}
                            className="text-indigo-600 hover:text-indigo-700 font-bold text-[11px] flex items-center gap-0.5"
                          >
                            Belajar ➔
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SIMULATED VIEW: MATERIAL DETAIL */}
          {page === 'detail' && (
            <div className="flex-1 flex flex-col">
              {/* Detail Header */}
              <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shrink-0">
                <button 
                  onClick={() => { setPage('dashboard'); triggerMaterialsFetch(); }}
                  className="flex items-center text-xs font-bold text-slate-600 hover:text-indigo-600 transition gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali ke Dashboard
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    materialsProgress[activeMaterial.id].isCompleted 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {materialsProgress[activeMaterial.id].isCompleted ? '✓ Selesai' : 'Sedang Dipelajari'}
                  </span>
                </div>
              </header>

              {/* Main Detail Scroller */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="border-b border-slate-200/60 pb-4">
                  <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider font-mono">Modul Pembelajaran</span>
                  <h3 className="text-lg font-black tracking-tight text-slate-900 mt-1">{activeMaterial.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{activeMaterial.description}</p>
                </div>

                {/* Sub chapters mapped */}
                <div className="space-y-6">
                  {activeMaterial.lessons.map((les, index) => (
                    <div key={les.id} className="bg-white border border-slate-200/70 p-5 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {index + 1}
                        </span>
                        {les.title}
                      </h4>
                      <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3.5 rounded border-l-2 border-indigo-500 font-sans">
                        {les.content_markdown}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Interaction Quiz Form */}
                <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100/80 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      Kuis Evaluasi Akhir Modul
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Selesaikan pertanyaan berikut untuk memvalidasi pemahaman Anda.</p>
                  </div>

                  {!materialsProgress[activeMaterial.id].isCompleted ? (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-800 leading-normal">
                        {activeMaterial.quizQuestion}
                      </p>

                      <div className="space-y-2 text-xs">
                        {activeMaterial.quizOptions.map((opt, oIdx) => (
                          <label 
                            key={oIdx} 
                            onClick={() => setQuizChoice(oIdx)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer hover:bg-white transition ${
                              quizChoice === oIdx 
                                ? 'bg-white border-indigo-500 text-slate-900 shadow-sm' 
                                : 'bg-white/60 border-slate-200 text-slate-600'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name="mock_quiz" 
                              checked={quizChoice === oIdx}
                              onChange={() => {}} // Handle on parent label click
                              className="text-indigo-600 focus:ring-indigo-500 mt-0.5 shrink-0" 
                            />
                            <span className="text-[11px] select-none">{opt}</span>
                          </label>
                        ))}
                      </div>

                      {quizError && (
                        <div className="text-[11px] text-rose-600 font-semibold bg-rose-50 px-3 py-2 rounded">
                          ❌ {quizError}
                        </div>
                      )}

                      <button
                        onClick={() => quizChoice !== null && handleQuizSubmit(activeMaterial.id, quizChoice)}
                        disabled={quizChoice === null}
                        className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        Submit Jawaban Kuis
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-center justify-between text-emerald-800 text-xs text-left">
                      <div>
                        <p className="font-bold text-[13px]">Status kelulusan: Selesai!</p>
                        <p className="text-[11px] mt-0.5 text-emerald-600 leading-normal">
                          Laporan data Anda telah di-sync ke entitas relasi tabel <code>user_progress</code> di DB via route API Laravel.
                        </p>
                      </div>
                      <div className="text-center shrink-0">
                        <span className="block text-[10px] text-slate-500 uppercase font-mono">My Score</span>
                        <span className="block text-xl font-mono font-black text-emerald-700">100 / 100</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* RIGHT PANEL: LARAVEL ENDPOINT INSPECTOR & DATABASE EMULATION LOGS */}
      <div className="lg:col-span-4 flex flex-col border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 text-slate-300 h-[720px] font-mono select-none">
        
        {/* Terminal Header */}
        <div className="bg-slate-900 border-b border-indigo-950/40 px-4 py-3 flex items-center justify-between font-mono shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <TermIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Inspector: API Laravel & DB Logs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
            <span className="text-[9px] text-slate-400 font-bold uppercase font-mono">PORT 8000</span>
          </div>
        </div>

        {/* Logs Stream Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 border-b border-indigo-950/40 text-left">
          <div className="text-[10px] text-slate-500 leading-normal border-b border-slate-900 pb-2 mb-3">
            Klik sebuah baris log di bawah untuk mengurai (inspect) payload request dan JSON response REST API Laravel.
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              Menunggu pemanggilan HTTP API client...
            </div>
          ) : (
            logs.map(log => {
              const isSelected = selectedLog?.id === log.id;
              return (
                <div 
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-sm' 
                      : 'bg-slate-900/60 border-slate-900 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        log.method === 'POST' ? 'bg-amber-950/80 text-amber-300' : 'bg-emerald-950/80 text-emerald-300'
                      }`}>
                        {log.method}
                      </span>
                      <span className="text-slate-300 font-semibold font-mono truncate max-w-[140px] md:max-w-none">{log.url}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Response Status:</span>
                    <span className={`font-bold ${log.status >= 200 && log.status < 300 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Log Inspector Payload Info Panel */}
        <div className="h-[280px] bg-slate-950 p-4 overflow-y-auto border-t border-slate-900 shrink-0 text-left">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-1.5 mb-2 flex items-center justify-between">
            <span>JSON Inspector Detail</span>
            {selectedLog && (
              <span className="text-[9px] text-indigo-400 capitalize">
                {selectedLog.method} {selectedLog.url}
              </span>
            )}
          </h4>

          {selectedLog ? (
            <div className="space-y-4 text-[10px]">
              {selectedLog.payload && (
                <div>
                  <span className="text-amber-300 font-semibold block mb-1">📥 Request Payload (Headers & Body):</span>
                  <pre className="bg-slate-900/80 p-2 rounded text-slate-300 overflow-x-auto max-h-[70px] border border-slate-900">
                    {JSON.stringify(selectedLog.payload, null, 2)}
                  </pre>
                </div>
              )}
              <div>
                <span className="text-emerald-400 font-semibold block mb-1">📤 Laravel API JSON Response:</span>
                <pre className="bg-slate-900/80 p-2 rounded text-slate-300 overflow-x-auto max-h-[110px] border border-slate-900">
                  {JSON.stringify(selectedLog.response, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-xs flex items-center justify-center h-full pb-6">
              Tidak ada log terpilih.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
