/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Check, AlertCircle } from 'lucide-react';
import { DeploymentModel } from '../types';

const MODELS_DATA: DeploymentModel[] = [
  {
    id: 'public',
    name: 'Public Cloud',
    description: 'Seluruh infrastruktur fisik dimiliki dan dioperasikan sepenuhnya oleh penyedia pihak ketiga (seperti AWS atau Google Cloud). Sumber daya fisik (server, storage) dibagi menggunakan konsep penempatan multi-tenant yang aman.',
    pros: [
      'Biaya paling terjangkau (tanpa modal perangkat keras awal).',
      'Sangat elastis, dapat ditingkatkan lurus dengan pertumbuhan user.',
      'Bebas biaya pemeliharaan sistem internal.'
    ],
    cons: [
      'Kontrol kustomisasi fisik perangkat keras sangat minim.',
      'Sertifikasi kepatuhan hukum industri tertentu terasa lebih menantang.'
    ],
    securityLevel: 'Medium',
    costLevel: 'Lower',
    suitability: 'Sangat cocok untuk tim startup kecil, aplikasi publik, situs edukasi, dan pengembangan piranti lunak cepat.'
  },
  {
    id: 'private',
    name: 'Private Cloud',
    description: 'Infrastruktur cloud yang didedikasikan secara eksklusif hanya untuk satu organisasi tunggal. Fisik server bisa diletakkan di kantor mandiri (on-premise) atau disewa via server dedicated terisolasi.',
    pros: [
      'Kontrol keamanan fisik & logika super ketat dan eksklusif.',
      'Kebebasan tinggi dalam konfigurasi kustomisasi hardware sesuai standar perusahaan.',
      'Patuh penuh pada hukum privasi data krusial.'
    ],
    cons: [
      'Memerlukan biaya investasi (CapEx) sangat mahal di muka.',
      'Membutuhkan staf ahli tim IT khusus untuk operasional & patching harian.'
    ],
    securityLevel: 'High',
    costLevel: 'Higher',
    suitability: 'Sangat disarankan bagi industri keuangan, bank pemerintah, militer, rumah sakit, dan lembaga berisiko data tinggi.'
  },
  {
    id: 'hybrid',
    name: 'Hybrid Cloud',
    description: 'Menggabungkan fungsionalitas Public Cloud dan Private Cloud secara bersamaan. Data dan aplikasi bisa berpindah mengaburkan batas secara mulus di antara keduanya sesuai prioritas beban kerja.',
    pros: [
      'Fleksibilitas maksimal - simpan data rahasia di private, nyalakan public untuk web berat.',
      'Strategi "Cloud Bursting" demi menampung lonjakan trafik dadakan.',
      'Keamanan terkendali tanpa membuang kehematan awan.'
    ],
    cons: [
      'Konfigurasi integrasi antar jaringan multi-platform sangat rumit.',
      'Potensi kerentanan sinkronisasi data real-time.'
    ],
    securityLevel: 'Flexible',
    costLevel: 'Variable',
    suitability: 'Cocok bagi perusahaan menengah-besar yang sedang bertransisi perlahan ke sistem modern namun memiliki data server warisan luhur.'
  },
  {
    id: 'multicloud',
    name: 'Multi-Cloud',
    description: 'Strategi menggunakan jasa dua atau lebih penyedia Public Cloud sekaligus (misalnya, memadukan AWS untuk komputasi kognitif dan Google Cloud khusus kecerdasan buatan bertenaga AI).',
    pros: [
      'Menghindari bahaya "Vendor Lock-In" (terpenjara di satu brand cloud).',
      'Mengambil layanan terbaik dari masing-masing penyedia teknologi.',
      'Redundansi super tinggi bilamana satu merk provider lumpuh.'
    ],
    cons: [
      'Pemahaman tim IT harus luas karena menguasai aneka dashboard berbeda.',
      'Biaya langganan terpisah-pisah menyulitkan proses audit.'
    ],
    securityLevel: 'Flexible',
    costLevel: 'Highest',
    suitability: 'Cocok untuk korporasi lintas negara raksasa yang membutuhkan tingkat toleransi bencana zero downtime.'
  }
];

interface Scenario {
  id: number;
  question: string;
  answerId: DeploymentModel['id'];
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    question: "📱 'Saya ingin mendeploy aplikasi startup digital pembuat kuis santai yang baru dirintis, modal sangat terbatas.'",
    answerId: 'public',
    explanation: 'Startup baru perlu menghemat modal awal (CapEx). Menggunakan Public Cloud adalah pilihan mutlak karena bayar seadanya dan infrastruktur instan menyala secara hitungan menit.'
  },
  {
    id: 2,
    question: "🏦 'Kami adalah tim IT bank BUMN pusat yang mengelola riwayat tabungan rahasia warga negara dengan regulasi ketat.'",
    answerId: 'private',
    explanation: 'Riwayat dana nasabah membutuhkan kepatuhan enkripsi dan penyimpanan data fisik berdaulat. Private Cloud wajib digunakan agar kendali penuh server & database tetap di bawah pengawasan fisik instansi.'
  },
  {
    id: 3,
    question: "🛒 'Saya memiliki toko e-commerce lokal. Mayoritas data promosi ada di server kami sendiri, namun setiap pesta belanja 11.11, web lumpuh menerima luapan sejuta pembeli.'",
    answerId: 'hybrid',
    explanation: 'Anda butuh Hybrid Cloud! Saat hari normal, operasikan data lokal Anda (Private). Begitu gelombang pembeli masif menyerbu di tanggal 11.11, picu fitur "Cloud Bursting" mengalihkan beban kerja tambahan ke Public Cloud otomatis.'
  }
];

export default function DeploymentModels() {
  const [selectedModel, setSelectedModel] = useState<DeploymentModel['id']>('public');
  const [activeScenario, setActiveScenario] = useState<number | null>(null);

  const currentModel = MODELS_DATA.find((m) => m.id === selectedModel) || MODELS_DATA[0];

  const handleScenarioClick = (sc: Scenario) => {
    setActiveScenario(sc.id);
    setSelectedModel(sc.answerId);
  };

  return (
    <div id="deployment-models-card" className="bg-white border-2 border-[#1C1C1C] rounded-sm p-6 md:p-8 shadow-sm">
      <div className="border-b border-[#1C1C1C]/30 pb-5 mb-6">
        <span className="text-xs font-sans text-blue-600 tracking-[0.2em] uppercase block mb-1 font-bold">
          Model Penyebaran (Deployment Models)
        </span>
        <h2 className="text-2xl md:text-4xl font-display font-black text-[#1C1C1C] italic">
          Di Mana Cloud Bersemayam?
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-xl font-serif">
          Model deployment menentukan hak eksklusif penggunaan hardware server fisik serta isolasi virtual cloud Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kiri: Cards Selector */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-widest block mb-1">
            Pilih Model Penyebaran:
          </span>

          <div className="grid grid-cols-1 gap-3">
            {MODELS_DATA.map((model) => (
              <button
                key={model.id}
                id={`btn-model-${model.id}`}
                onClick={() => {
                  setSelectedModel(model.id);
                  setActiveScenario(null); // Reset scenario highlight when manually toggled
                }}
                className={`p-4 rounded-sm text-left border-2 transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  selectedModel === model.id
                    ? 'bg-[#F7F4F0] border-[#1C1C1C] text-[#1C1C1C]'
                    : 'bg-white border-[#1C1C1C]/30 text-slate-500 hover:bg-[#F7F4F0]/60 hover:text-[#1C1C1C]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-lg italic">{model.name}</span>
                  <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    model.securityLevel === 'High' ? 'bg-[#1C1C1C] text-white' :
                    model.securityLevel === 'Medium' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-[#1C1C1C] border border-[#1C1C1C]/20'
                  }`}>
                    Sandi: {model.securityLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-serif leading-normal mt-1.5 line-clamp-2">
                  {model.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Kanan: Detail Panel */}
        <div className="lg:col-span-7 bg-[#F7F4F0] p-6 rounded-sm border border-[#1C1C1C] flex flex-col justify-between self-stretch shadow-sm">
          <motion.div
            key={selectedModel}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div>
              <span className="text-[9px] bg-blue-100 text-blue-800 font-sans font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Fokus Kajian
              </span>
              <h3 className="text-2xl font-display font-black text-[#1C1C1C] mt-2 italic">
                {currentModel.name}
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed font-serif mt-2">
                {currentModel.description}
              </p>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="space-y-2">
                <span className="text-[10px] font-sans font-bold text-blue-700 uppercase tracking-widest block">
                  ✓ Kelebihan Utama:
                </span>
                <ul className="text-xs space-y-2 text-slate-800 font-serif">
                  {currentModel.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-1.5 leading-normal">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-sans font-bold text-amber-800 uppercase tracking-widest block">
                  ✗ Tantangan / Kekurangan:
                </span>
                <ul className="text-xs space-y-2 text-slate-800 font-serif">
                  {currentModel.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-1.5 leading-normal">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Spek Ringkasan */}
            <div className="p-4 bg-white border border-[#1C1C1C] rounded-sm grid grid-cols-2 gap-4 text-xs font-serif shadow-sm">
              <div>
                <span className="text-[10px] font-sans font-bold text-slate-500 block uppercase tracking-wider">Metode Pembiayaan</span>
                <span className="font-bold text-[#1C1C1C] mt-1 block leading-tight">{currentModel.costLevel === 'Lower' ? 'Sangat Hemat (Murni OpEx)' : currentModel.costLevel === 'Higher' ? 'Mahal (CapEx Hardware Awal)' : currentModel.costLevel === 'Variable' ? 'Variabel Tergantung Pipa Sinkronisasi' : 'Laporan Langganan Kompleks'}</span>
              </div>
              <div>
                <span className="text-[10px] font-sans font-bold text-slate-500 block uppercase tracking-wider">Keselarasan Solusi</span>
                <span className="font-bold text-[#1C1C1C] mt-1 block leading-tight">{currentModel.suitability}</span>
              </div>
            </div>
          </motion.div>

          {/* Interactive Case study helper */}
          <div className="mt-6 pt-5 border-t border-[#1C1C1C]/20">
            <span className="text-xs font-sans text-slate-600 font-black block mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Skenario Studi Kasus Interaktif:
            </span>

            <div className="flex flex-col gap-2.5">
              {SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  id={`scenario-btn-${sc.id}`}
                  onClick={() => handleScenarioClick(sc)}
                  className={`p-3 text-left rounded-sm text-xs transition-colors border-2 cursor-pointer ${
                    activeScenario === sc.id
                      ? 'bg-white border-[#1C1C1C] text-[#1C1C1C]'
                      : 'bg-white/40 border-[#1C1C1C]/20 hover:bg-white text-slate-700'
                  }`}
                >
                  <p className="font-serif leading-relaxed italic">"{sc.question.split("'")[1]}"</p>
                  
                  {activeScenario === sc.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2.5 pt-2.5 border-t border-[#1C1C1C] text-slate-800 font-serif leading-relaxed"
                    >
                      💡 <strong className="font-sans text-[10px] uppercase font-black text-blue-600 tracking-wider">Rekomendasi</strong>: Penyebaran jenis <strong className="font-sans font-bold text-[#1C1C1C]">{MODELS_DATA.find(m => m.id === sc.answerId)?.name}</strong> adalah yang paling tepat. {sc.explanation}
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
