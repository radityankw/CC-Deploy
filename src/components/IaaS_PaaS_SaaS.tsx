/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Database, Layers, AppWindow, Info, ShoppingBag, Pizza } from 'lucide-react';
import { CloudService } from '../types';

const SERVICES_DATA: CloudService[] = [
  {
    id: 'iaas',
    name: 'IaaS',
    fullName: 'Infrastructure as a Service',
    description: 'Penyedia cloud menyewa infrastruktur dasar seperti Server Fisik, Virtual Machine, Jaringan, dan Penyimpanan. Anda memiliki kontrol penuh atas sistem operasi, runtime, dan aplikasi yang diinstal.',
    analogyTitle: 'Analogi: Membeli Pizza Beku (Take & Bake)',
    analogy: 'Penjual menyediakan adonan mentah dan piringan pizza (infrastruktur siap pakai). Anda yang harus membawanya pulang, menyiapkan oven sendiri (Sistem Operasi), mematangkannya (Runtime), serta menyediakan piring dan minuman sendiri (Data & Aplikasi).',
    managedByProvider: ['Virtualisasi (Hypervisor)', 'Server Fisik / Hardware', 'Penyimpanan Fisik', 'Jaringan / Kabel & Router'],
    managedByUser: ['Aplikasi', 'Data & Keamanan', 'Runtime Engine', 'Sistem Operasi (OS)', 'Middleware'],
    bestFor: 'Perusahaan skala besar yang butuh kontrol penuh pada konfigurasi server & OS, seperti migrasi software warisan (legacy) atau komputasi intensif.',
    examples: [
      { name: 'Amazon EC2', desc: 'Sewa Virtual Machine fleksibel dari AWS.', iconName: 'server' },
      { name: 'Google Compute Engine (GCE)', desc: 'Virtual Machine berperforma tinggi milik Google Cloud.', iconName: 'layers' },
      { name: 'DigitalOcean Droplets', desc: 'Server virtual sederhana yang mudah dikonfigurasi.', iconName: 'server' }
    ]
  },
  {
    id: 'paas',
    name: 'PaaS',
    fullName: 'Platform as a Service',
    description: 'Penyedia menyediakan lingkungan pengembangan lengkap serta runtime otomatis. Anda cukup fokus menulis baris kode aplikasi Anda dan mengelola data, tanpa perlu pusing memikirkan manajemen OS, patching, atau update server.',
    analogyTitle: 'Analogi: Pizza Pesan Antar (Pizza Delivery)',
    analogy: 'Chef restoran memasak pizza sampai matang menggunakan oven mereka (Provider mengurus backend, OS, dan runtime). Pizza dikirim langsung ke rumah Anda. Anda tinggal menyiapkan meja makan, piring, serta minuman Anda sendiri untuk menikmatinya.',
    managedByProvider: ['Sistem Operasi (OS)', 'Runtime (Node.js, Python, dll)', 'Middleware', 'Virtualisasi', 'Server Fisik & Jaringan'],
    managedByUser: ['Aplikasi (Kode Anda)', 'Data Aplikasi', 'Konfigurasi Endpoint Client'],
    bestFor: 'Tim developer software yang ingin langsung merilis aplikasi tanpa dibebani administrasi server atau pemeliharaan OS.',
    examples: [
      { name: 'Heroku', desc: 'Platform deployment instan hanya dengan git push.', iconName: 'layers' },
      { name: 'Google App Engine', desc: 'Platform serverless untuk menjalankan aplikasi skala besar.', iconName: 'app-window' },
      { name: 'AWS Elastic Beanstalk', desc: 'Deployment otomatis aplikasi web Java, .NET, PHP, dll.', iconName: 'server' }
    ]
  },
  {
    id: 'saas',
    name: 'SaaS',
    fullName: 'Software as a Service',
    description: 'Aplikasi siap pakai yang dapat diakses langsung oleh pengguna akhir secara online melalui browser atau aplikasi mobile. Semua infrastruktur, platform, server, keamanan, hingga perbaikan bug diurus seutuhnya oleh produsen.',
    analogyTitle: 'Analogi: Makan di Restoran Pizza (Dining Out)',
    analogy: 'Anda pergi ke restoran. Koki membuat pizza, menyediakan oven, piring, gelas, bahkan mencuci piring kotor Anda setelahnya. Anda datang hanya untuk langsung memesan, menyantap, lalu membayar sesuai porsi makan Anda.',
    managedByProvider: ['Aplikasi Utuh', 'Data Aplikasi', 'Runtime & OS', 'Layanan Server & Database', 'Keamanan Global & Update'],
    managedByUser: ['Hanya preferensi akun / konfigurasi user minimal'],
    bestFor: 'Pengguna umum atau bisnis yang memerlukan solusi software instan tanpa perlu repot membangun atau memelihara kode apa pun.',
    examples: [
      { name: 'Google Workspace', desc: 'Gmail, Drive, dan Docs yang diakses via web.', iconName: 'app-window' },
      { name: 'Microsoft 365', desc: 'Aplikasi perkantoran berbasis cloud modern.', iconName: 'app-window' },
      { name: 'Netflix / Spotify', desc: 'Layanan streaming hiburan instan berbayar bulanan.', iconName: 'shopping-bag' }
    ]
  }
];

export default function IaaS_PaaS_SaaS() {
  const [activeService, setActiveService] = useState<CloudService['id']>('iaas');
  const [viewMode, setViewMode] = useState<'stack' | 'analogy'>('stack');

  const selectedData = SERVICES_DATA.find((s) => s.id === activeService) || SERVICES_DATA[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'server':
        return <Server className="w-4 h-4 text-blue-600" />;
      case 'layers':
        return <Layers className="w-4 h-4 text-indigo-600" />;
      case 'app-window':
        return <AppWindow className="w-4 h-4 text-emerald-600" />;
      case 'shopping-bag':
        return <ShoppingBag className="w-4 h-4 text-pink-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const fullStackItems = [
    'Aplikasi (Code/App)',
    'Data & Database',
    'Runtime Environment',
    'Middleware',
    'Sistem Operasi (OS)',
    'Virtualisasi / Hypervisor',
    'Server Fisik / Hardware',
    'Penyimpanan Fisik (Storage)',
    'Jaringan / Network & Kabel'
  ];

  return (
    <div id="service-models-card" className="bg-white border-2 border-[#1C1C1C] rounded-sm p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#1C1C1C]/30 pb-6">
        <div>
          <span className="text-xs font-sans text-blue-600 tracking-[0.2em] uppercase block mb-1 font-bold">
            Model Layanan Cloud
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-black text-[#1C1C1C] italic">
            IaaS, PaaS, & SaaS.
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl font-serif">
            Tiga pilar utama pengiriman layanan cloud computing. Pilih model untuk melihat perbedaan nyata lingkup pengelolaannya.
          </p>
        </div>

        {/* Toggle Mode Visualisasi */}
        <div className="flex bg-[#F7F4F0] p-1 rounded-sm border border-[#1C1C1C] self-start md:self-auto">
          <button
            id="view-stack-btn"
            onClick={() => setViewMode('stack')}
            className={`px-4 py-2 rounded-sm text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'stack' ? 'bg-[#1C1C1C] text-[#FDFCFB]' : 'text-slate-600 hover:text-[#1C1C1C]'
            }`}
          >
            Tanggung Jawab IT
          </button>
          <button
            id="view-analogy-btn"
            onClick={() => setViewMode('analogy')}
            className={`px-4 py-2 rounded-sm text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'analogy' ? 'bg-[#1C1C1C] text-[#FDFCFB]' : 'text-slate-600 hover:text-[#1C1C1C]'
            }`}
          >
            <Pizza className="w-3.5 h-3.5" />
            Analogi Pizza
          </button>
        </div>
      </div>

      {/* Tabs Pilihan Layanan */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {SERVICES_DATA.map((service) => (
          <button
            key={service.id}
            id={`tab-service-${service.id}`}
            onClick={() => setActiveService(service.id)}
            className={`relative py-4 px-3 rounded-sm flex flex-col items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
              activeService === service.id
                ? 'bg-[#F7F4F0] border-[#1C1C1C] text-[#1C1C1C] ring-2 ring-blue-600/20'
                : 'bg-white border-[#1C1C1C]/40 text-slate-500 hover:bg-[#F7F4F0] hover:text-[#1C1C1C]'
            }`}
          >
            <span className="text-xl md:text-2xl font-display font-black tracking-tight italic">
              {service.name}
            </span>
            <span className="text-[10px] md:text-xs text-slate-500 text-center truncate w-full mt-1 font-sans font-bold uppercase tracking-wider">
              {service.fullName.split(' ')[0]} ...
            </span>
            {activeService === service.id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute bottom-1 w-2 h-2 bg-blue-600 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Konten Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info detail layanan kiri */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            key={selectedData.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-[#1C1C1C] flex items-center gap-2 italic">
                {selectedData.fullName}
              </h3>
              <p className="text-sm md:text-base text-slate-800 leading-relaxed mt-2.5 font-serif">
                {selectedData.description}
              </p>
            </div>

            {/* Analogi Card */}
            <div className="p-4 bg-[#FDFCFB] rounded-sm border border-[#1C1C1C] shadow-sm">
              <h4 className="text-xs font-sans text-amber-800 bg-amber-50 border border-amber-200 self-start inline-flex items-center gap-1.5 px-2 py-1 rounded-sm mb-3 font-bold uppercase tracking-wider">
                <Pizza className="w-4 h-4 text-amber-600" />
                {selectedData.analogyTitle}
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed font-serif italic">
                "{selectedData.analogy}"
              </p>
            </div>

            {/* Target Pengguna */}
            <div className="p-4 bg-[#F7F4F0] rounded-sm border border-[#1C1C1C]/40">
              <h4 className="text-[10px] font-sans font-bold text-blue-600 tracking-widest uppercase mb-1.5">REKOMENDASI PENGGUNAAN:</h4>
              <p className="text-xs text-slate-800 font-serif font-semibold">{selectedData.bestFor}</p>
            </div>

            {/* Contoh Populer */}
            <div>
              <h4 className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-widest mb-3">
                CONTOH LAYANAN DI INDUSTRI:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedData.examples.map((ex, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-sm border border-[#1C1C1C] hover:bg-[#F7F4F0] transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      {getIcon(ex.iconName)}
                      <span className="text-xs font-sans font-bold text-[#1C1C1C]">{ex.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-serif leading-snug">{ex.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Visual stack kanan */}
        <div className="lg:col-span-5 bg-[#F7F4F0] p-5 rounded-sm border border-[#1C1C1C] self-stretch flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {viewMode === 'stack' ? (
              <motion.div
                key="stack"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 flex-grow"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]/35 mb-3">
                  <span className="text-xs font-sans font-bold text-slate-600 uppercase tracking-wider">Tanggung Jawab Teknis</span>
                  <span className="text-[10px] px-2.5 py-1 bg-blue-600 text-[#FDFCFB] font-sans font-bold uppercase tracking-wider">
                    {selectedData.name}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {fullStackItems.map((item, index) => {
                    const isProvider = selectedData.managedByProvider.some((p) =>
                      p.toLowerCase().includes(item.toLowerCase().split(' ')[0]) ||
                      item.toLowerCase().includes(p.toLowerCase().split(' ')[0])
                    );

                    return (
                      <div
                        key={index}
                        className={`py-2 px-3 rounded-sm text-xs flex items-center justify-between transition-all duration-300 ${
                          isProvider
                            ? 'bg-blue-50 border border-blue-200 text-blue-900 font-serif'
                            : 'bg-white border-2 border-[#1C1C1C] text-[#1C1C1C] font-semibold font-serif'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isProvider ? 'bg-blue-600' : 'bg-[#1C1C1C]'}`} />
                          {item}
                        </span>
                        <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isProvider ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-[#1C1C1C]'
                        }`}>
                          {isProvider ? 'Provider' : 'Anda'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#1C1C1C]/20 text-[10px] font-sans font-bold uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-white border-2 border-[#1C1C1C]" />
                    <span>Dikelola Anda</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-100 border border-blue-300" />
                    <span>Dikelola Provider</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="analogy"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]/35 mb-3">
                    <span className="text-xs font-sans font-bold text-slate-600 uppercase tracking-widest font-mono">Analogi Seru</span>
                    <span className="text-[10px] px-2.5 py-1 bg-amber-600 text-white font-sans font-bold uppercase tracking-wider">
                      Chef & Pembeli
                    </span>
                  </div>

                  <div className="py-2.5 text-center px-4 rounded-sm bg-white border border-[#1C1C1C] mb-4 text-xs font-serif font-medium italic text-slate-800">
                    Bila Cloud adalah Pizza, siapakah yang memasak, membakar, & menyajikan?
                  </div>

                  <div className="space-y-2">
                    <div className={`p-3 rounded-sm border-2 text-xs flex justify-between items-center ${
                      selectedData.id === 'iaas' ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold' : 'opacity-40 bg-white border-slate-300 text-slate-400'
                    }`}>
                      <div>
                        <p className="font-sans font-extrabold uppercase tracking-wide">IaaS (Take & Bake / Pizza Beku)</p>
                        <p className="text-[11px] font-serif font-normal mt-0.5">Adonan disiapkan toko, oven & meja buatan Anda.</p>
                      </div>
                      <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-mono">Setengah</span>
                    </div>

                    <div className={`p-3 rounded-sm border-2 text-xs flex justify-between items-center ${
                      selectedData.id === 'paas' ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold' : 'opacity-40 bg-white border-slate-300 text-slate-400'
                    }`}>
                      <div>
                        <p className="font-sans font-extrabold uppercase tracking-wide">PaaS (Pizza Delivery / Diantar)</p>
                        <p className="text-[11px] font-serif font-normal mt-0.5">Dimasak koki restoran, piring & minuman oleh Anda.</p>
                      </div>
                      <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-mono">Ready</span>
                    </div>

                    <div className={`p-3 rounded-sm border-2 text-xs flex justify-between items-center ${
                      selectedData.id === 'saas' ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold' : 'opacity-40 bg-white border-slate-300 text-slate-400'
                    }`}>
                      <div>
                        <p className="font-sans font-extrabold uppercase tracking-wide">SaaS (Dining Out / Makan Resto)</p>
                        <p className="text-[11px] font-serif font-normal mt-0.5">Anda cukup duduk, semua disediakan restoran & santap.</p>
                      </div>
                      <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-mono">Penuh</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-sm border border-[#1C1C1C] text-[11px] text-[#1C1C1C] flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="font-serif">
                    Analogi ini sangat populer untuk menerangkan cloud! Konsep intinya: semakin bergeser ke kanan (SaaS), semakin sedikit urusan teknis manual yang dikelola pembeli.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
