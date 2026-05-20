/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Laptop, Globe, Milestone, Server, Database, FolderHeart, 
  HelpCircle, CheckCircle2, AlertTriangle, Zap, ServerCrash
} from 'lucide-react';

interface ComponentNode {
  id: string;
  name: string;
  category: 'dns' | 'cdn' | 'lb' | 'app' | 'db' | 'storage';
  isActive: boolean;
  desc: string;
  role: string;
}

export default function CloudArchitectureBuilder() {
  // Initial Components Config
  const [components, setComponents] = useState<ComponentNode[]>([
    { id: 'dns', name: 'DNS (Domain Name System)', category: 'dns', isActive: true, role: 'Menerjemahkan nama domain web (seperti www.belajarcloud.com) ke alamat IP server target agar browser bisa terhubung.', desc: 'Penunjuk rute handal' },
    { id: 'cdn', name: 'CDN (Content Delivery Network)', category: 'cdn', isActive: true, role: 'Menyimpan cache halaman statis (HTML, CSS, Gambar) di server tepi (edge location) terdekat dengan lokasi geografis pengguna.', desc: 'Mempercepat muatan statik' },
    { id: 'lb', name: 'Load Balancer (Penyeimbang Beban)', category: 'lb', isActive: true, role: 'Menerima trafik masuk lalu menyebarkannya secara adil ke beberapa server di belakangnya agar tidak ada server yang tumbang over-kapasitas.', desc: 'Pembagi beban trafik' },
    { id: 'db', name: 'Cloud Database (Relational)', category: 'db', isActive: true, role: 'Menyimpan data pengguna yang terstruktur secara terpusat, tangguh karena otomatis ter-backup & mereplikasi data di lintas data center.', desc: 'Penyimpan data dinamis' },
    { id: 'storage', name: 'Cloud Object Storage', category: 'storage', isActive: true, role: 'Menampung berkas ukuran besar yang tidak terstruktur secara terisolasi tanpa batas kapasitas seperti file PDF, Video, atau Gambar.', desc: 'Gudang berkas digital' }
  ]);

  // Dynamic Scale state
  const [serverCount, setServerCount] = useState<number>(2); // 1, 2, atau 3 web servers
  const [trafficRate, setTrafficRate] = useState<'normal' | 'high' | 'peak'>('normal');
  const [simulationStatus, setSimulationStatus] = useState<string>('Sistem berjalan stabil dan optimal.');
  const [systemMetrics, setSystemMetrics] = useState({
    avgLoad: 35, // in %
    latency: 85, // in ms
    status: 'Optimal' as 'Optimal' | 'Overload' | 'Unstable' | 'Down'
  });

  // Toggle single component
  const toggleComponent = (id: string) => {
    setComponents(prev => prev.map(comp => comp.id === id ? { ...comp, isActive: !comp.isActive } : comp));
  };

  // Recalculate metrics based on current config and traffic
  useEffect(() => {
    let baseLoad = trafficRate === 'normal' ? 30 : trafficRate === 'high' ? 65 : 95;
    let baseLatency = 45;

    const dnsActive = components.find(c => c.id === 'dns')?.isActive;
    const cdnActive = components.find(c => c.id === 'cdn')?.isActive;
    const lbActive = components.find(c => c.id === 'lb')?.isActive;
    const dbActive = components.find(c => c.id === 'db')?.isActive;
    const storageActive = components.find(c => c.id === 'storage')?.isActive;

    // DNS is critically required wrapper
    if (!dnsActive) {
      setSystemMetrics({
        avgLoad: 0,
        latency: 999,
        status: 'Down'
      });
      setSimulationStatus('⚠️ Eror Koneksi! DNS dinonaktifkan. Pengguna luar tidak tahu alamat IP sistem Anda sehingga tidak bisa berkunjung.');
      return;
    }

    // CDN effect: absorbs static queries, drops latency. Without it, server load rises
    if (!cdnActive) {
      baseLoad += 25;
      baseLatency += 120;
    }

    // Server scaling effect
    // 1 server: vulnerable, load multiplied by 1.5. 2 servers: load divided by 2. 3 servers: load divided by 3
    let serverLoadFactor = 1.0;
    if (serverCount === 1) serverLoadFactor = 1.6;
    if (serverCount === 2) serverLoadFactor = 0.95;
    if (serverCount === 3) serverLoadFactor = 0.6;

    // Load Balancer effect
    let calculatedLoad = 0;
    if (!lbActive) {
      // All traffic bottlenecks on server 1
      calculatedLoad = Math.round(baseLoad * serverLoadFactor * 1.8);
      baseLatency += 180;
    } else {
      calculatedLoad = Math.round(baseLoad * serverLoadFactor);
    }

    // DB offline effect
    if (!dbActive) {
      setSystemMetrics({
        avgLoad: 0,
        latency: 999,
        status: 'Down'
      });
      setSimulationStatus('⚠️ Eror Sistem! Database tidak aktif. Aplikasi gagal query data transaksi, keranjang belanja, atau autentikasi user.');
      return;
    }

    // Object Storage offline effect
    if (!storageActive) {
      baseLatency += 80;
    }

    // Bound load to 100
    calculatedLoad = Math.min(100, Math.max(5, calculatedLoad));

    // Determine status
    let finalStatus = 'Optimal' as 'Optimal' | 'Overload' | 'Unstable' | 'Down';
    let statusText = 'Sistem berjalan stabil dan cepat.';

    if (calculatedLoad >= 85) {
      finalStatus = 'Overload';
      statusText = '🚨 Krisis! Server Utama kepayahan (High CPU). Rekomendasi: Aktifkan CDN, tambah node server, atau nyalakan Load Balancer!';
    } else if (calculatedLoad >= 65 && !lbActive) {
      finalStatus = 'Unstable';
      statusText = '⚠️ Beban tidak seimbang! Karena Load Balancer mati, server nomor 1 menanggung semua beban kerja, sementara server lain menganggur.';
    } else if (!cdnActive && trafficRate === 'peak') {
      finalStatus = 'Unstable';
      statusText = 'ℹ️ Beban mengkhawatirkan. Server kepayahan melayani asset statis. Aktifkan CDN untuk menetralisir gambar/file statik!';
    } else if (!storageActive) {
      finalStatus = 'Optimal';
      statusText = '⚠️ Server lambat mengambil file media karena Object Storage mati. Sistem harus membaca media langsung lewat database / disk server.';
    }

    // Latency bounds
    baseLatency = Math.min(800, baseLatency);

    setSystemMetrics({
      avgLoad: calculatedLoad,
      latency: baseLatency,
      status: finalStatus
    });
    setSimulationStatus(statusText);

  }, [components, serverCount, trafficRate]);

  return (
    <div id="architecture-builder-card" className="bg-white border-2 border-[#1C1C1C] rounded-sm p-6 md:p-8 shadow-sm">
      <div className="border-b border-[#1C1C1C]/30 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-sans text-blue-600 tracking-[0.2em] uppercase block mb-1 font-bold">
            Studio Laboratorium Topologi
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-black text-[#1C1C1C] flex items-center gap-2 italic">
            Simulator Arsitektur Cloud.
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl font-serif">
            Aktifkan/nonaktifkan modul jaringan cloud dan ubah jumlah server di bawah ini. Lihat pengaruh konfigurasi Anda secara nyata terhadap latensi dan ketangguhan arsitektur.
          </p>
        </div>

        {/* Traffic Controller */}
        <div className="bg-[#F7F4F0] p-2.5 border border-[#1C1C1C] rounded-sm flex flex-col items-center shrink-0">
          <span className="text-[10px] text-slate-600 font-sans font-bold mb-1.5 uppercase tracking-wider">Laju Trafik Simulasi</span>
          <div className="flex gap-1.5 bg-white p-1 rounded-sm border border-[#1C1C1C]/40">
            {(['normal', 'high', 'peak'] as const).map(rate => (
              <button
                key={rate}
                id={`btn-traffic-${rate}`}
                onClick={() => setTrafficRate(rate)}
                className={`text-[9px] uppercase font-sans font-extrabold py-1 px-2.5 rounded-sm transition-all cursor-pointer ${
                  trafficRate === rate 
                    ? 'bg-[#1C1C1C] text-[#FDFCFB]' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {rate === 'normal' ? 'Normal' : rate === 'high' ? 'Padat' : 'Puncak'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulator Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kiri: Topology Map */}
        <div className="lg:col-span-8 bg-[#FDFCFB] rounded-sm p-6 border-2 border-[#1C1C1C] relative overflow-hidden flex flex-col justify-between min-h-[460px] shadow-sm">
          {/* Animated Retro Blueprint/Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1c1c1c_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-[0.07]" />

          {/* Title Area */}
          <div className="relative z-10 flex justify-between items-center mb-6">
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#1C1C1C] px-2 py-1 bg-[#F7F4F0] border border-[#1C1C1C]/40 rounded-sm">
              Skema Jaringan Topologi Aktif
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              <span className="text-[9px] font-sans font-black text-[#1C1C1C] uppercase tracking-wider">Live Sandbox</span>
            </div>
          </div>

          {/* Interactive Topology Graph */}
          <div className="relative z-10 flex-grow grid grid-rows-3 gap-6 my-auto items-center justify-center">
            {/* Row 1: Users & DNS */}
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {/* Client node */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-sm bg-white border-2 border-[#1C1C1C] flex items-center justify-center relative shadow-sm">
                  <Laptop className="w-6 h-6 text-[#1C1C1C]" />
                  <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[8px] font-sans font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                    Client
                  </div>
                </div>
                <span className="text-[10px] font-sans font-bold text-slate-500 mt-2">Ribuan Gadget Pengguna</span>
              </div>

              {/* DNS node */}
              <button 
                id="node-dns"
                onClick={() => toggleComponent('dns')}
                className={`flex flex-col items-center scale-95 hover:scale-100 transition-all cursor-pointer ${
                  !components.find(c => c.id === 'dns')?.isActive ? 'opacity-30' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-sm border-2 flex items-center justify-center relative shadow-sm ${
                  components.find(c => c.id === 'dns')?.isActive 
                    ? 'bg-white border-[#1C1C1C] ring-4 ring-blue-600/10' 
                    : 'bg-white border-red-300'
                }`}>
                  <Globe className={`w-6 h-6 ${components.find(c => c.id === 'dns')?.isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="absolute -bottom-1.5 text-[8px] font-sans font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#1C1C1C] text-[#FDFCFB]">
                    DNS
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 mt-2.5 font-sans font-bold block uppercase tracking-wider">Buku Telepon</span>
              </button>

              {/* CDN node */}
              <button 
                id="node-cdn"
                onClick={() => toggleComponent('cdn')}
                className={`flex flex-col items-center scale-95 hover:scale-100 transition-all cursor-pointer ${
                  !components.find(c => c.id === 'cdn')?.isActive ? 'opacity-30' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-sm border-2 flex items-center justify-center relative shadow-sm ${
                  components.find(c => c.id === 'cdn')?.isActive 
                    ? 'bg-white border-[#1C1C1C] ring-4 ring-blue-600/10' 
                    : 'bg-white border-[#1C1C1C]/20'
                }`}>
                  <Zap className={`w-6 h-6 ${components.find(c => c.id === 'cdn')?.isActive ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`} />
                  <span className="absolute -bottom-1.5 text-[8px] font-sans font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#1C1C1C] text-[#FDFCFB]">
                    CDN
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 mt-2.5 font-sans font-bold block uppercase tracking-wider">Cache File</span>
              </button>
            </div>

            {/* Row 2: Load Balancer & Scaling Servers */}
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {/* Load Balancer Node */}
              <button 
                id="node-lb"
                onClick={() => toggleComponent('lb')}
                className={`flex flex-col items-center scale-95 hover:scale-100 transition-all cursor-pointer ${
                  !components.find(c => c.id === 'lb')?.isActive ? 'opacity-30' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-sm border-2 flex items-center justify-center relative shadow-sm ${
                  components.find(c => c.id === 'lb')?.isActive 
                    ? 'bg-white border-[#1C1C1C] ring-4 ring-blue-600/10' 
                    : 'bg-white border-[#1C1C1C]/20'
                }`}>
                  <Milestone className={`w-6 h-6 ${components.find(c => c.id === 'lb')?.isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="absolute -bottom-1.5 text-[7px] font-sans font-black uppercase tracking-widest px-1 py-0.5 rounded-sm bg-[#1C1C1C] text-[#FDFCFB]">
                    LOAD BALANCER
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 mt-2.5 font-sans font-bold block uppercase tracking-wider">Membagi Beban</span>
              </button>

              {/* Web Servers cluster (Increasable based on state) */}
              <div className="flex flex-col items-center">
                <div className="bg-[#F7F4F0] p-3 rounded-sm border-2 border-[#1C1C1C] shadow-sm flex items-center justify-center gap-2.5">
                  {Array.from({ length: serverCount }).map((_, index) => {
                    const lbActive = components.find(c => c.id === 'lb')?.isActive;
                    const isServerOverheated = (serverCount === 1 && trafficRate !== 'normal') || (!lbActive && index === 0 && trafficRate !== 'normal');

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`w-12 h-12 rounded-sm flex flex-col items-center justify-center border-2 relative ${
                          isServerOverheated 
                            ? 'bg-red-50 border-red-600 text-red-700 animate-pulse' 
                            : 'bg-white border-[#1C1C1C] text-blue-800'
                        }`}
                      >
                        <Server className="w-5 h-5" />
                        <span className="absolute -top-1.5 right-1 text-[7px] font-sans font-bold uppercase tracking-wider bg-[#1C1C1C] text-[#FDFCFB] px-1 rounded-sm">
                          VM#{index + 1}
                        </span>
                        {isServerOverheated && (
                          <span className="absolute -bottom-1.5 bg-red-600 text-white text-[6px] px-1 font-sans font-black uppercase tracking-wider rounded-sm">
                            OVERHEAT
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[10px] font-sans font-bold text-slate-600 uppercase tracking-wide">Jumlah Server:</span>
                  <div className="flex gap-1 items-center bg-white px-1 py-0.5 rounded-sm border border-[#1C1C1C]">
                    {[1, 2, 3].map(n => (
                      <button
                        key={n}
                        id={`btn-scale-${n}`}
                        onClick={() => setServerCount(n)}
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm cursor-pointer ${
                          serverCount === n ? 'bg-[#1C1C1C] text-[#FDFCFB]' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Database & Object Storage */}
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {/* SQL Database */}
              <button 
                id="node-db"
                onClick={() => toggleComponent('db')}
                className={`flex flex-col items-center scale-95 hover:scale-100 transition-all cursor-pointer ${
                  !components.find(c => c.id === 'db')?.isActive ? 'opacity-30' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-sm border-2 flex items-center justify-center relative shadow-sm ${
                  components.find(c => c.id === 'db')?.isActive 
                    ? 'bg-white border-[#1C1C1C] ring-4 ring-blue-600/10' 
                    : 'bg-white border-[#1C1C1C]/20'
                }`}>
                  <Database className={`w-6 h-6 ${components.find(c => c.id === 'db')?.isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                  <span className="absolute -bottom-1.5 text-[8px] font-sans font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#1C1C1C] text-[#FDFCFB]">
                    DATABASE
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 mt-2.5 font-sans font-bold block uppercase tracking-wider">Data Store</span>
              </button>

              {/* Object Storage */}
              <button 
                id="node-storage"
                onClick={() => toggleComponent('storage')}
                className={`flex flex-col items-center scale-95 hover:scale-100 transition-all cursor-pointer ${
                  !components.find(c => c.id === 'storage')?.isActive ? 'opacity-30' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-sm border-2 flex items-center justify-center relative shadow-sm ${
                  components.find(c => c.id === 'storage')?.isActive 
                    ? 'bg-white border-[#1C1C1C] ring-4 ring-blue-600/10' 
                    : 'bg-white border-[#1C1C1C]/20'
                }`}>
                  <FolderHeart className={`w-6 h-6 ${components.find(c => c.id === 'storage')?.isActive ? 'text-pink-600' : 'text-slate-400'}`} />
                  <span className="absolute -bottom-1.5 text-[8px] font-sans font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#1C1C1C] text-[#FDFCFB]">
                    OBJECTS
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 mt-2.5 font-sans font-bold block uppercase tracking-wider">Harddisk S3</span>
              </button>
            </div>
          </div>

          {/* Real-time System Simulation Status Box */}
          <div className="relative z-10 mt-6 p-4 bg-white border border-[#1C1C1C] rounded-sm flex items-start gap-3 shadow-xs">
            {systemMetrics.status === 'Optimal' ? (
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            ) : systemMetrics.status === 'Down' ? (
              <ServerCrash className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-[10px] font-sans font-black tracking-wider text-slate-500 uppercase">
                STATUS SIMULASI: <span className={`font-black ${
                  systemMetrics.status === 'Optimal' ? 'text-blue-600' : systemMetrics.status === 'Down' ? 'text-red-600' : 'text-amber-700'
                }`}>{systemMetrics.status}</span>
              </p>
              <p className="text-xs text-slate-800 font-serif leading-relaxed mt-1">
                {simulationStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Kanan: Interactive Controller, Metrics and Knowledge Cards */}
        <div className="lg:col-span-4 flex flex-col gap-4 self-stretch justify-between">
          {/* Live Monitor Card */}
          <div className="bg-[#F7F4F0] border border-[#1C1C1C] rounded-sm p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-sans text-slate-600 uppercase tracking-wider block mb-3 font-bold">
                Metrik Respon Real-Time
              </span>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-white rounded-sm border border-[#1C1C1C]/40 text-center">
                  <span className="text-[9px] text-[#1C1C1C] uppercase block font-sans font-black leading-none">CPU LOAD</span>
                  <span className={`text-3xl font-mono font-black block mt-2 ${
                    systemMetrics.avgLoad >= 85 ? 'text-red-600' : systemMetrics.avgLoad >= 65 ? 'text-amber-700' : 'text-blue-600'
                  }`}>
                    {systemMetrics.avgLoad}%
                  </span>
                  <span className="text-[8px] text-slate-500 font-serif">Aktifitas CPU</span>
                </div>

                <div className="p-3 bg-white rounded-sm border border-[#1C1C1C]/40 text-center">
                  <span className="text-[9px] text-[#1C1C1C] uppercase block font-sans font-black leading-none">LATENSI</span>
                  <span className={`text-3xl font-mono font-black block mt-2 ${
                    systemMetrics.latency >= 300 ? 'text-red-600' : systemMetrics.latency >= 150 ? 'text-amber-700' : 'text-blue-600'
                  }`}>
                    {systemMetrics.latency === 999 ? '∞ ms' : `${systemMetrics.latency} ms`}
                  </span>
                  <span className="text-[8px] text-slate-500 font-serif">Waktu Tunggu</span>
                </div>
              </div>
            </div>

            {/* Quick action helper card */}
            <div className="text-[10px] text-slate-800 leading-normal p-3.5 bg-white border border-[#1C1C1C] rounded-sm font-serif">
              💡 <strong className="font-sans text-[9px] uppercase font-bold text-blue-600 tracking-wider">Tugas Lab Mandiri:</strong>
              <ol className="list-decimal pl-4 space-y-1.5 mt-1.5 text-slate-600">
                <li>Atur trafik ke <strong className="font-sans font-semibold">Puncak</strong> &rarr; Beban CPU server melonjak drastis.</li>
                <li>Aktifkan <strong className="font-sans font-semibold">CDN</strong> kembali &rarr; Latensi drop instan karena aset disajikan via cache.</li>
                <li>Matikan <strong className="font-sans font-semibold">Load Balancer</strong> &rarr; Terlihat Server ke-1 lumpuh mengembang <strong className="text-red-700 font-sans">OVERHEAT</strong>.</li>
              </ol>
            </div>
          </div>

          {/* Module Explanator (Click standard nodes to understand) */}
          <div className="bg-white border-2 border-[#1C1C1C] rounded-sm p-5 flex-grow shadow-xs">
            <span className="text-xs font-sans text-blue-600 uppercase tracking-widest block mb-3 font-bold">
              Ensiklopedia Jaringan Cloud
            </span>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {components.map((comp) => (
                <div 
                  key={comp.id} 
                  id={`comp-explactor-${comp.id}`}
                  onClick={() => toggleComponent(comp.id)}
                  className={`p-2.5 rounded-sm border text-xs cursor-pointer select-none transition-all ${
                    comp.isActive 
                      ? 'bg-[#F7F4F0] border-[#1C1C1C]' 
                      : 'bg-white border-[#1C1C1C]/20 opacity-55 hover:bg-[#F7F4F0]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-extrabold uppercase tracking-wide text-[#1C1C1C]">{comp.name.split(' (')[0]}</span>
                    <span className={`text-[8px] font-sans font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      comp.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {comp.isActive ? 'Konek' : 'Mati'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1 leading-normal italic font-serif">"{comp.desc}"</p>
                  <p className="text-[10px] text-slate-800 mt-1 leading-relaxed font-serif">{comp.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
