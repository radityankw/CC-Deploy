/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle, XCircle, RotateCcw, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { QuizQuestion } from '../types';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Apa kelebihan utama model pengeluaran operasional (OpEx) dibanding investasi modal awal (CapEx) dalam komputasi awan?",
    options: [
      "Mengharuskan perusahaan membeli gedung pusat data ber-AC dingin sendiri.",
      "Membayar tagihan secara bertahap sesuai kapasitas sumber daya digital yang benar-benar dipakai.",
      "Membeli lisensi hardware fisik seumur hidup sejak hari pertama rilis.",
      "Menghilangkan kebutuhan menulis baris kode pemrograman sama sekali."
    ],
    correctAnswerIndex: 1,
    explanation: "OpEx (Operational Expenditure) membebaskan anggaran modal besar di awal karena kita hanya membayar tagihan sewa bulanan dinamis (Pay-as-you-go) sesuai jumlah server yang aktif."
  },
  {
    id: 2,
    question: "Ketika Anda menggunakan layanan kolaborasi online seperti Gmail atau Google Docs, model pengiriman layanan cloud manakah yang dikonsumsi?",
    options: [
      "IaaS (Infrastructure as a Service)",
      "PaaS (Platform as a Service)",
      "SaaS (Software as a Service)",
      "Dedicated On-Premise"
    ],
    correctAnswerIndex: 2,
    explanation: "Gmail dan Google Docs adalah aplikasi siap pakai untuk pengguna akhir via browser. Seluruh server, database, dan pemeliharaan kode diurus oleh Google (Provider), yang diklasifikasikan sebagai SaaS."
  },
  {
    id: 3,
    question: "Apa fungsi krusial dari komponen Load Balancer pada arsitektur sistem cloud skala besar?",
    options: [
      "Menerjemahkan nama domain teks (seperti google.com) menjadi deret angka alamat IP.",
      "Menampung berkas statik berukuran jumbo seperti video berbayar secara terisolasi.",
      "Membagi beban trafik masuk secara merata ke beberapa instansi server (VM) agar tidak ada server tunggal yang tumbang akibat overload.",
      "Membatalkan tagihan bulanan cloud secara ilegal."
    ],
    correctAnswerIndex: 2,
    explanation: "Load Balancer berfungsi layaknya polisi lalu lintas jaringan. Komponen ini mendistribusikan trafik request pembaca secara adil ke barisan server aktif di belakangnya."
  },
  {
    id: 4,
    question: "Sebuah perusahaan bank nasional harus mematuhi undang-undang kedaulatan data fisik, namun mereka juga butuh daya komputasi tinggi Public Cloud untuk promo e-commerce dadakan. Pilihan deployment model mana yang ideal?",
    options: [
      "Public Cloud murni",
      "Private Cloud murni",
      "Hybrid Cloud",
      "Multi-Hosting konvensional tanpa virtualisasi"
    ],
    correctAnswerIndex: 3,
    explanation: "Hybrid Cloud menggabungkan kedaulatan Private Cloud (untuk data sensitif bank) dengan ketangkasan ekspansi Public Cloud (untuk menangani lonjakan promosi e-commerce temporer)."
  },
  {
    id: 5,
    question: "Jika Anda mengunggah baris kode program Node.js langsung tanpa perlu pusing melakukan patching OS Ubuntu atau mengurus lisensi hypervisor server fisik, Anda menggunakan model...",
    options: [
      "PaaS (Platform as a Service)",
      "IaaS (Infrastructure as a Service)",
      "SaaS (Software as a Service)",
      "Serverless-Offline"
    ],
    correctAnswerIndex: 0,
    explanation: "Di bawah model PaaS (Platform as a Service), penyedia mengunci seluruh tumpukan OS, jaringan, dan runtime engine. Developer hanya fokus menulis baris kode program saja."
  }
];

export default function InteractiveQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [answersStatus, setAnswersStatus] = useState<boolean[]>([]); // Tracks true/false for each question
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleOptionSelect = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null || hasSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore((prev) => prev + 20); // Each question carries 20 pts (5 * 20 = 100)
    }

    setAnswersStatus((prev) => [...prev, isCorrect]);
    setHasSubmitted(true);
  };

  const handleNextBtn = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setAnswersStatus([]);
    setShowResults(false);
    setScore(0);
  };

  const getBadgeNameAndSymbol = (finalScore: number) => {
    if (finalScore === 100) return { name: 'Cloud Master 👑', color: 'text-amber-800 bg-amber-50 border-amber-300' };
    if (finalScore >= 60) return { name: 'Cloud Architect 🛡️', color: 'text-blue-800 bg-[#F7F4F0] border-[#1C1C1C]/40' };
    return { name: 'Cloud Novice 🌱', color: 'text-slate-800 bg-white border-slate-300' };
  };

  const activeBadge = getBadgeNameAndSymbol(score);

  return (
    <div id="interactive-quiz-card" className="bg-white border-2 border-[#1C1C1C] rounded-sm p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-[#1C1C1C]/30 pb-5 mb-6">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <div>
            <span className="text-[10px] font-sans font-bold text-blue-600 tracking-[0.15em] uppercase block mb-0.5">Evaluasi Mandiri</span>
            <h2 className="text-xl md:text-2xl font-display font-black text-[#1C1C1C] italic">Asah Pemahaman Cloud.</h2>
          </div>
        </div>

        {!showResults && (
          <div className="text-right">
            <span className="text-xs font-serif font-semibold text-slate-500">Pertanyaan</span>
            <p className="text-sm font-sans font-black text-blue-600">
              {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Question Text */}
            <div className="p-4 md:p-5 bg-[#F7F4F0] rounded-sm border border-[#1C1C1C]">
              <span className="text-[9px] font-sans font-black text-slate-500 uppercase tracking-widest block">SOAL:</span>
              <p className="text-sm md:text-base font-serif font-semibold text-[#1C1C1C] leading-relaxed mt-1">
                {currentQuestion.question}
              </p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswerIndex;
                
                let optionStyle = 'bg-white border-[#1C1C1C]/40 text-slate-800 hover:bg-[#F7F4F0] hover:text-[#1C1C1C] font-serif';
                if (isSelected) {
                  optionStyle = 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-bold font-serif';
                }
                
                // Styling when submitted
                if (hasSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 font-bold font-serif';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-red-50 border-2 border-red-600 text-red-950 font-serif';
                  } else {
                    optionStyle = 'bg-white border-[#1C1C1C]/10 text-slate-400 cursor-not-allowed font-serif opacity-40';
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={hasSubmitted}
                    className={`p-4 rounded-sm text-left border-2 text-xs md:text-sm transition-all duration-250 flex items-start gap-4 justify-between cursor-pointer ${optionStyle}`}
                  >
                    <span className="leading-snug">{opt}</span>
                    <div className="shrink-0 mt-0.5">
                      {hasSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                      {hasSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanatory notes if submitted */}
            {hasSubmitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-[#F7F4F0] rounded-sm border border-[#1C1C1C] text-xs md:text-sm text-slate-800 leading-relaxed italic font-serif"
              >
                💡 <strong className="font-sans font-bold text-blue-600 uppercase tracking-wide text-[10px]">Silakan Kaji Penjelasannya:</strong> {currentQuestion.explanation}
              </motion.div>
            )}

            {/* Nav Controls */}
            <div className="flex justify-end gap-3 pt-2">
              {!hasSubmitted ? (
                <button
                  id="btn-quiz-submit"
                  onClick={handleAnswerSubmit}
                  disabled={selectedOption === null}
                  className={`py-3 px-6 rounded-sm text-xs font-sans font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedOption !== null 
                      ? 'bg-[#1C1C1C] text-[#FDFCFB]' 
                      : 'bg-gray-100 border border-[#1C1C1C]/20 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Kunci Jawaban
                </button>
              ) : (
                <button
                  id="btn-quiz-next"
                  onClick={handleNextBtn}
                  className="py-3 px-6 rounded-sm bg-blue-600 text-white text-xs font-sans font-black uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? 'Lihat Hasil Akhir' : 'Lanjut Soal'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-6"
          >
            {/* Award / Result Badge */}
            <div className="flex flex-col items-center justify-center">
              <div className="p-4 bg-[#F7F4F0] rounded-full border border-[#1C1C1C] mb-4 relative">
                <Award className="w-16 h-16 text-blue-600" />
                <Sparkles className="w-6 h-6 text-amber-600 absolute top-2 right-2 animate-bounce" />
              </div>

              <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-widest block mb-1">Gelar Sertifikasi Anda:</span>
              <span className={`text-sm md:text-base font-sans font-black uppercase tracking-wider px-4 py-1.5 rounded-sm border-2 ${activeBadge.color}`}>
                {activeBadge.name}
              </span>
            </div>

            {/* Score Ring */}
            <div className="max-w-xs mx-auto p-5 bg-[#F7F4F0] rounded-sm border-2 border-[#1C1C1C] shadow-sm">
              <span className="text-xs font-serif font-bold text-slate-600">Nilai Akhir Ujian:</span>
              <p className="text-5xl font-mono font-black text-[#1C1C1C] mt-2">{score} <span className="text-lg text-slate-500 font-normal">/ 100</span></p>
              
              {/* Scoring breakdown indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {answersStatus.map((status, index) => (
                  <div 
                    key={index} 
                    className={`w-4 h-4 rounded-full border-2 ${
                      status ? 'bg-emerald-600 border-[#1C1C1C]' : 'bg-red-600 border-[#1C1C1C]'
                    }`} 
                    title={`Soal ${index + 1}: ${status ? 'Benar' : 'Salah'}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-serif">
              Selamat! Menguji diri Anda adalah salah satu cara belajar terbaik (**Active Recall**). Silakan gunakan diagram arsitektur di atas atau kalkulator biaya kapan saja untuk mendalami teori secara utuh.
            </p>

            <button
              id="btn-quiz-reset"
              onClick={handleResetQuiz}
              className="py-3 px-6 bg-[#1C1C1C] border border-[#1C1C1C] hover:bg-[#F7F4F0] hover:text-[#1C1C1C] mx-auto rounded-sm text-xs font-sans font-black uppercase tracking-wider flex items-center gap-1.5 transition-all text-[#FDFCFB] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Ulangi Kuis Dari Awal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
