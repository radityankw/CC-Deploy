/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Server, HelpCircle, TrendingUp, HeartCrack, Sparkles } from 'lucide-react';

export default function CloudPricingCalculator() {
  const [vms, setVms] = useState<number>(2);
  const [cores, setCores] = useState<number>(2);
  const [ram, setRam] = useState<number>(4);
  const [storage, setStorage] = useState<number>(200);
  const [hoursPerDay, setHoursPerDay] = useState<number>(24);
  const [autoScalingActive, setAutoScalingActive] = useState<boolean>(true);

  // Cost Coefficients (approximate typical cloud costs)
  const costPerCoreHour = 0.025; // $0.025 per core-hour
  const costPerGbRamHour = 0.005; // $0.005 per GB-RAM hour
  const costPerGbStorageMonth = 0.10; // $0.10 per GB-storage month

  // CALCULATE CLOUD MONTHLY COST
  const hoursPerMonth = hoursPerDay * 30;
  
  // Auto-scaling active: assume on average traffic is only high for 8 hours, 
  // so the remaining 16 hours we scale down to 50% capacity/vms.
  const vmFactor = autoScalingActive ? ((8 * vms) + (16 * Math.max(1, Math.round(vms * 0.5)))) / 24 : vms;

  const hourlyVmCost = (cores * costPerCoreHour) + (ram * costPerGbRamHour);
  const monthlyComputeCost = hourlyVmCost * hoursPerMonth * vmFactor;
  const monthlyStorageCost = storage * costPerGbStorageMonth;
  
  const totalCloudCost = monthlyComputeCost + monthlyStorageCost;

  // CALCULATE TRADITIONAL ON-PREMISE MONTHLY EQUIVALENT
  const hardwareCostUpfront = (vms * 1200) + (cores * 150) + (ram * 35) + (storage * 0.85); // amortized hardware buying
  const monthlyAmortizedHardware = hardwareCostUpfront / 36;
  const fixedPowerCooling = 120; // constant power, AC cooling
  const physicalSecurityAdmin = 180; // server maintenance overhead
  const totalOnPremiseCost = monthlyAmortizedHardware + fixedPowerCooling + physicalSecurityAdmin + (hourlyVmCost * 24 * 30 * vms); // always runs 24/7 at peak specs

  const savingsPercent = Math.max(0, Math.round(((totalOnPremiseCost - totalCloudCost) / totalOnPremiseCost) * 100));

  return (
    <div id="pricing-calculator-card" className="bg-white border-2 border-[#1C1C1C] rounded-sm p-6 md:p-8 shadow-sm">
      <div className="border-b border-[#1C1C1C]/30 pb-5 mb-6">
        <span className="text-xs font-sans text-blue-600 tracking-[0.2em] uppercase block mb-1 font-bold">
          Simulasi Ekonomi Awan
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-black text-[#1C1C1C] italic">
          Kalkulator Biaya: Cloud vs On-Premise.
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-xl font-serif">
          Eksperimen langsung bagaimana fleksibilitas penagihan "Pay-As-You-Go" dan fitur "Auto-Scaling" di ekosistem cloud mampu memangkas pengeluaran IT secara radikal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Kiri */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#F7F4F0] p-5 rounded-sm border border-[#1C1C1C] space-y-4">
            <h3 className="text-xs font-sans text-[#1C1C1C] uppercase tracking-wider flex items-center gap-1.5 font-black">
              <Server className="w-4 h-4 text-blue-600" />
              Sewa Sumber Daya Spek Virtual Machine:
            </h3>

            {/* Slider VM Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-serif font-bold">
                <span className="text-slate-800">Jumlah VM Server</span>
                <span className="text-blue-700 font-sans font-black uppercase tracking-wider">{vms} Node Server</span>
              </div>
              <input
                id="slider-vms"
                type="range"
                min="1"
                max="10"
                value={vms}
                onChange={(e) => setVms(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white border border-[#1C1C1C] rounded-none appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono font-bold">
                <span>1 Server</span>
                <span>10 Nodes</span>
              </div>
            </div>

            {/* Slider CPU Cores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-serif font-bold">
                  <span className="text-slate-800">VCPU Cores / VM</span>
                  <span className="text-blue-700 font-sans font-black uppercase tracking-wider">{cores} Core</span>
                </div>
                <input
                  id="slider-cores"
                  type="range"
                  min="1"
                  max="8"
                  value={cores}
                  onChange={(e) => setCores(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white border border-[#1C1C1C] rounded-none appearance-none cursor-pointer accent-blue-600"
                />
                <div className="grid grid-cols-3 text-[10px] text-slate-500 font-mono font-bold">
                  <span>1 Core</span>
                  <span className="text-center">4 Cores</span>
                  <span className="text-right">8 Cores</span>
                </div>
              </div>

              {/* Slider RAM */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-serif font-bold">
                  <span className="text-slate-800">Memory RAM / VM</span>
                  <span className="text-blue-700 font-sans font-black uppercase tracking-wider">{ram} GB RAM</span>
                </div>
                <input
                  id="slider-ram"
                  type="range"
                  min="2"
                  max="32"
                  step="2"
                  value={ram}
                  onChange={(e) => setRam(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white border border-[#1C1C1C] rounded-none appearance-none cursor-pointer accent-blue-600"
                />
                <div className="grid grid-cols-3 text-[10px] text-slate-500 font-mono font-bold">
                  <span>2 GB</span>
                  <span className="text-center">16 GB</span>
                  <span className="text-right">32 GB</span>
                </div>
              </div>
            </div>

            {/* Slider Storage */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-serif font-bold">
                <span className="text-slate-800">Kapasitas Cloud Storage (SSD)</span>
                <span className="text-blue-700 font-sans font-black uppercase tracking-wider">{storage} GB</span>
              </div>
              <input
                id="slider-storage"
                type="range"
                min="50"
                max="1000"
                step="50"
                value={storage}
                onChange={(e) => setStorage(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white border border-[#1C1C1C] rounded-none appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono font-bold">
                <span>50 GB</span>
                <span>500 GB</span>
                <span>1 TB</span>
              </div>
            </div>
          </div>

          {/* Fitur Elasticity Toggle */}
          <div className="bg-[#F7F4F0] p-5 rounded-sm border border-[#1C1C1C] space-y-4">
            <h3 className="text-xs font-sans text-[#1C1C1C] uppercase tracking-wider font-black">
              Karakteristik Komputasi Fleksibel (Elasticity):
            </h3>

            {/* Hours Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-serif font-bold">
                <span className="text-slate-800">Waktu Operasional Server dalam sehari</span>
                <span className="text-indigo-700 font-sans font-black uppercase tracking-wider">{hoursPerDay} Jam/Hari</span>
              </div>
              <input
                id="slider-hours"
                type="range"
                min="4"
                max="24"
                step="1"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white border border-[#1C1C1C] rounded-none appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[11px] text-slate-600 leading-normal font-serif italic mt-1 bg-white p-2.5 border border-[#1C1C1C]/20">
                💡 Di Cloud, jika server hanya menyala pada Jam Kerja (biasanya 8 jam/hari pkl 09.00-17.00), Anda hanya didenda tarif 8 jam itu saja. Di On-Premise fisik, server harus terus dicolok listrik 24/7 tanpa henti!
              </p>
            </div>

            {/* Auto Scaling Toggle */}
            <div className="pt-3 border-t border-[#1C1C1C]/20 flex items-center justify-between">
              <div className="max-w-[75%] pr-3">
                <span className="text-xs font-sans font-bold text-[#1C1C1C] block">
                  Aktifkan Auto-Scaling cerdas di Cloud?
                </span>
                <span className="text-[11px] text-slate-600 leading-tight block mt-0.5 font-serif">
                  Secara cerdas mengurangi jumlah VM menyusut 50% selama sepi pengunjung (malam hari).
                </span>
              </div>
              <button
                id="toggle-autoscaling"
                onClick={() => setAutoScalingActive(!autoScalingActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-none transition-colors duration-300 border-2 border-[#1C1C1C] cursor-pointer ${
                  autoScalingActive ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-none bg-[#1C1C1C] transition-transform duration-200 ${
                    autoScalingActive ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Hasil Komparasi Kanan */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 self-stretch justify-between">
          {/* Card comparison side-by-side */}
          <div className="bg-[#F7F4F0] border-2 border-[#1C1C1C] rounded-sm p-5 flex flex-col justify-between flex-grow shadow-sm">
            <div>
              <span className="text-xs font-sans text-slate-600 block mb-3 font-bold uppercase tracking-wider">Laporan Anggaran (Estimasi Bulanan)</span>
              
              <div className="space-y-4">
                {/* On premise card */}
                <div className="p-3.5 bg-white border border-[#1C1C1C] rounded-sm relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-red-600/10">
                    <HeartCrack className="w-12 h-12" />
                  </div>
                  <span className="text-[9px] font-sans text-slate-500 uppercase font-black tracking-wider">
                    On-Premise Tradisional (Fisik)
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-[10px] font-sans font-black text-slate-500">USD</span>
                    <span className="text-3xl font-display font-black text-slate-900">
                      ${totalOnPremiseCost.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-serif lowercase">/ bulan</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1.5 font-serif">
                    Mencakup amortisasi hardware tetap, pendingin/AC konstan, pemeliharaan fisik IT, serta zero elasticity.
                  </p>
                </div>

                {/* Cloud Pay-as-you-go card */}
                <div className="p-3.5 bg-white border-2 border-[#1C1C1C] rounded-sm relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-[#1C1C1C]/5">
                    <Sparkles className="w-12 h-12 animate-pulse" />
                  </div>
                  <span className="text-[9px] font-sans text-blue-700 uppercase font-black tracking-wider flex items-center gap-1">
                    Cloud Pay-As-You-Go
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-[10px] font-sans font-black text-blue-700">USD</span>
                    <span className="text-3xl font-display font-black text-blue-700">
                      ${totalCloudCost.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-serif lowercase">/ bulan</span>
                  </div>
                  <p className="text-[10px] text-slate-800 mt-1.5 font-serif">
                    Hanya ditagih sesuai durasi pemakaian. {autoScalingActive ? 'Kapasitas turun otomatis saat malam sehingga sangat ekonomis.' : 'Bebas biaya pemeliharaan overhead hardware fisik.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Savings gauge */}
            <div className="mt-5 pt-4 border-t border-[#1C1C1C]/20 text-center bg-white border border-[#1C1C1C] p-3 rounded-sm shadow-xs">
              <span className="text-xs text-slate-500 font-serif font-bold italic">Sertifikasi Keuntungan Ekonomis</span>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <TrendingUp className="w-5 h-5 text-emerald-700" />
                <span className="text-3xl font-display font-black text-emerald-800 italic">
                  +{savingsPercent}% Lebih Hemat!
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-serif leading-tight mt-1 px-3">
                Membuktikan pergeseran pengeluaran dari modal besar di awal (<strong className="font-sans text-[10px] uppercase font-bold text-red-700">CapEx</strong>) ke pengeluaran operasional harian yang fleksibel (<strong className="font-sans text-[10px] uppercase font-bold text-blue-600">OpEx</strong>).
              </p>
            </div>
          </div>

          {/* Mini Glosarium Ekonomi */}
          <div className="p-4 bg-white border-2 border-[#1C1C1C] rounded-sm shadow-sm">
            <h4 className="text-xs font-sans text-[#1C1C1C] mb-2 font-black uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Glosarium Finansial Cloud:
            </h4>
            <div className="space-y-2 text-xs font-serif leading-relaxed text-slate-800">
              <div>
                <strong className="font-sans font-bold text-[#1C1C1C] block text-[10px] uppercase">CapEx (Capital Expenditure):</strong>
                <span>Biaya investasi awal yang dihabiskan langsung di muka untuk membeli disk keras fisik, server, kabel, dll. Risikonya modal mengendap lama bila aplikasi belum ramai.</span>
              </div>
              <div>
                <strong className="font-sans font-bold text-[#1C1C1C] block text-[10px] uppercase">OpEx (Operational Expenditure):</strong>
                <span>Biaya operasional langsung harian/bulanan di mana Anda membayar sesuai pemakaian tanpa ada modal mati di muka, sehingga meminimalkan risiko finansial startup.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
