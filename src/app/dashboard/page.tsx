import React from "react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F5F4EE] text-[#13251F] font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-[#E2E4DF]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#13251F] flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-2xl tracking-tight">finora</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-[#354841]">Alisher</span>
            <div className="w-10 h-10 bg-[#F5F4EE] border border-[#E2E4DF] rounded-full flex items-center justify-center font-bold text-[#13251F]">
              A
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold text-[#13251F] mb-8 tracking-tight">Dashboard.</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] mb-4 uppercase">
              FAOL KURS
            </p>
            <div className="bg-white border border-[#E2E4DF] rounded-[24px] p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="w-full">
                  <h3 className="text-3xl font-extrabold text-[#13251F] mb-2 tracking-tight">CP3P Foundation</h3>
                  <p className="text-[#6B7A74] font-medium text-[15px]">1-Bob: Davlat-Xususiy Sheriklikka Kirish</p>
                  
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-full h-2 bg-[#F5F4EE] rounded-full overflow-hidden">
                      <div className="w-[10%] h-full bg-[#13251F] rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold text-[#354841]">10%</span>
                  </div>
                </div>
                <Link href="/study/cp3p/chapter-1" className="shrink-0 px-8 py-4 bg-[#13251F] hover:bg-[#1C362D] text-white rounded-[14px] font-bold shadow-lg shadow-[#13251F]/15 transition-all transform hover:-translate-y-0.5 w-full sm:w-auto text-center flex items-center justify-center gap-2">
                  Davom etish
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] mb-4 uppercase">
              YUTUQLAR
            </p>
            <div className="bg-white border border-[#E2E4DF] rounded-[24px] p-8 text-center shadow-sm h-[calc(100%-2rem)]">
              <div className="w-20 h-20 mx-auto bg-[#F5F4EE] border border-[#E2E4DF] rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl grayscale opacity-50">🏅</span>
              </div>
              <h4 className="text-xl font-extrabold text-[#13251F] mb-3 tracking-tight">Tayyorgarlik</h4>
              <p className="text-[15px] text-[#6B7A74] font-medium leading-relaxed">
                Imtihonga tayyor bo&apos;lishingiz uchun yana 7 ta bob qoldi.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
