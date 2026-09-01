import React from "react";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#F5F4EE] flex flex-col items-center justify-center p-6 text-[#13251F] font-sans">
      
      {/* Top Left Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#13251F] flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="font-bold text-2xl tracking-tight">finora</span>
      </div>

      <div className="w-full max-w-4xl text-center mt-12">
        <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] mb-3 uppercase">
          TAYYORGARLIK
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-[#13251F] tracking-tight">Sertifikatni tanlang.</h1>
        <p className="text-[#6B7A74] mb-12 text-[17px] font-medium max-w-2xl mx-auto">
          Qaysi yo&apos;nalish bo&apos;yicha tayyorgarlik ko&apos;rishni istaysiz?
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Active Course Card */}
          <Link href="/dashboard" className="group p-8 bg-white border-2 border-[#13251F] rounded-[24px] hover:shadow-xl transition-all text-left block">
            <div className="w-14 h-14 bg-[#F5F4EE] border border-[#E2E4DF] text-[#13251F] rounded-xl flex items-center justify-center text-2xl font-bold mb-6">
              📚
            </div>
            <h3 className="text-2xl font-extrabold text-[#13251F] tracking-tight">CP3P Foundation</h3>
            <p className="text-[#6B7A74] text-[15px] mt-3 leading-relaxed">Davlat-Xususiy Sheriklik (PPP) bo&apos;yicha boshlang&apos;ich bosqich va asosiy tamoyillar.</p>
            
            <div className="mt-8 flex items-center text-[#13251F] font-bold text-sm">
              Kursni boshlash 
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
          
          {/* Disabled Course Card */}
          <div className="p-8 bg-[#F5F4EE] border border-[#E2E4DF] rounded-[24px] text-left opacity-80">
            <div className="w-14 h-14 bg-white border border-[#E2E4DF] text-[#A3ACA8] rounded-xl flex items-center justify-center text-2xl font-bold mb-6">
              🔒
            </div>
            <h3 className="text-2xl font-extrabold text-[#6B7A74] tracking-tight">CFA Level 1</h3>
            <p className="text-[#A3ACA8] text-[15px] mt-3 leading-relaxed">Moliya tahlilchilari uchun xalqaro sertifikat.</p>
            
            <div className="mt-8 flex items-center text-[#6B7A74] font-bold text-sm bg-[#E2E4DF]/50 w-max px-4 py-2 rounded-lg">
              Tez kunda...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
