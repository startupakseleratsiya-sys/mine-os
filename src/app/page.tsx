"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F4EE] text-[#13251F] font-sans selection:bg-[#13251F] selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#F5F4EE]/90 backdrop-blur-md border-b border-[#E2E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#13251F] flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-2xl tracking-tight text-[#13251F]">
              finora
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-[15px] font-semibold text-[#6B7A74]">
            <Link href="#" className="hover:text-[#13251F] transition">Kurslar</Link>
            <Link href="#" className="hover:text-[#13251F] transition">Sertifikatlar</Link>
            <Link href="#" className="hover:text-[#13251F] transition">Narxlar</Link>
            <Link href="#" className="hover:text-[#13251F] transition">Biz haqimizda</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/auth" className="hidden sm:flex px-5 py-2.5 text-[15px] font-semibold text-[#354841] hover:text-[#13251F] transition items-center">
              Kirish
            </Link>
            <Link href="/auth" className="px-6 py-3 text-[15px] font-bold bg-[#13251F] hover:bg-[#1C362D] text-white rounded-xl shadow-md shadow-[#13251F]/10 transition-all transform hover:-translate-y-0.5 flex items-center">
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2E4DF] text-[#354841] text-sm font-bold mb-8 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13251F] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#13251F]"></span>
                </span>
                CP3P Foundation Endi O&apos;zbek tilida
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] text-[#13251F]">
                Sizning shaxsiy <br/>
                <span className="text-[#354841]">
                  Sun&apos;iy Intellekt
                </span> Ustozingiz.
              </h1>
              
              <p className="mt-6 text-lg sm:text-xl text-[#6B7A74] mb-10 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                CP3P, CFA va ACCA imtihonlariga tayyorlaning. O&apos;zbekiston va xalqaro 
                bozorda eng ko&apos;p talab qilinadigan moliya mutaxassisiga aylaning.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/auth" className="flex items-center justify-center gap-2 h-[56px] px-8 text-base font-bold bg-[#13251F] hover:bg-[#1C362D] text-white rounded-[14px] shadow-lg shadow-[#13251F]/15 transition-all transform hover:-translate-y-0.5">
                  Boshlash
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <button className="flex items-center justify-center h-[56px] px-8 text-base font-bold bg-white text-[#13251F] hover:bg-[#F5F4EE] border border-[#E2E4DF] rounded-[14px] shadow-sm transition-all transform hover:-translate-y-0.5">
                  Batafsil
                </button>
              </div>
            </motion.div>

            {/* Right Content: AI Tutor Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-6 mt-16 lg:mt-0 relative"
            >
              <div className="relative w-full aspect-square sm:aspect-video lg:aspect-square max-w-lg mx-auto rounded-[32px] border border-[#E2E4DF] bg-white overflow-hidden flex flex-col items-center justify-center shadow-xl group cursor-pointer">
                
                <div className="relative z-10 text-center p-8">
                  <div className="w-32 h-32 mx-auto bg-[#F5F4EE] border border-[#E2E4DF] rounded-full flex items-center justify-center mb-6 shadow-sm transition-all duration-500 relative">
                     {/* Halqalar */}
                    <div className="absolute inset-0 rounded-full border border-[#13251F]/20 animate-spin" style={{ animationDuration: '6s' }}></div>
                    <div className="absolute inset-4 rounded-full border border-[#354841]/10 animate-[spin_4s_linear_infinite_reverse]"></div>
                    <span className="text-5xl transform group-hover:scale-110 transition-transform duration-300">🎙️</span>
                  </div>
                  <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] mb-2 uppercase">
                    3D AI Avatar
                  </p>
                  <h3 className="text-2xl font-extrabold text-[#13251F] mb-3 tracking-tight">Ovozli suhbat</h3>
                  <p className="text-[#6B7A74] font-medium max-w-xs mx-auto leading-relaxed text-[15px]">
                    Ustozingiz bilan bevosita ovozli gaplashasiz.
                  </p>
                </div>

              </div>
            </motion.div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
