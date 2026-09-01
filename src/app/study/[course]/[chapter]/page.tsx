"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AITutorStudio() {
  const [isListening, setIsListening] = useState(false);
  const [activeChapter, setActiveChapter] = useState("chapter_1");

  const courseOutline = [
    { id: "chapter_1", title: "1-Bob: CP3P ga Kirish", status: "active" },
    { id: "chapter_2", title: "2-Bob: DXSh Asoslari", status: "locked" },
    { id: "chapter_3", title: "3-Bob: Loyihani Aniqlash", status: "locked" },
    { id: "test_1", title: "Foundation Daraja Testi", status: "locked" },
  ];

  return (
    <div className="flex h-screen bg-[#F5F4EE] text-[#13251F] font-sans overflow-hidden">
      
      {/* Chap panel */}
      <aside className="w-80 border-r border-[#E2E4DF] bg-white flex flex-col hidden md:flex shadow-sm z-20">
        <div className="p-6 border-b border-[#E2E4DF] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-[#13251F] flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <span className="font-bold text-xl tracking-tight text-[#13251F]">finora</span>
          </div>
          <Link href="/dashboard" className="text-xs font-bold text-[#6B7A74] hover:text-[#13251F] transition-colors uppercase tracking-widest">Chiqish</Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] mb-4 mt-2 px-2 uppercase">CP3P Foundation</p>
          <ul className="space-y-2">
            {courseOutline.map((item) => (
              <li 
                key={item.id}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  activeChapter === item.id 
                    ? "bg-[#F5F4EE] border-[#13251F]" 
                    : "bg-white border-transparent hover:border-[#E2E4DF] hover:bg-[#F5F4EE]/50"
                } ${item.status === "locked" ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => item.status !== "locked" && setActiveChapter(item.id)}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-[14px] ${activeChapter === item.id ? "text-[#13251F]" : "text-[#354841]"}`}>{item.title}</span>
                  {item.status === "locked" && <span className="text-xs text-[#A3ACA8]">🔒</span>}
                  {item.status === "active" && <span className="text-[10px] bg-[#13251F] text-white px-2 py-1 rounded-md uppercase font-bold tracking-wider">Davomida</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-6 border-t border-[#E2E4DF] bg-[#F5F4EE]/50">
          <div className="text-xs font-bold text-[#354841] mb-3 flex justify-between uppercase tracking-widest">
            <span>Umumiy natija</span>
            <span>10%</span>
          </div>
          <div className="w-full h-2 bg-[#E2E4DF] rounded-full overflow-hidden">
            <div className="h-full bg-[#13251F] w-[10%] rounded-full"></div>
          </div>
        </div>
      </aside>

      {/* Markaziy panel */}
      <main className="flex-1 flex flex-col relative bg-[#F5F4EE]">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-[#E2E4DF] bg-white flex justify-between items-center shadow-sm z-20">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-[#13251F] flex items-center justify-center text-white">
                <span className="font-bold">f</span>
             </div>
          </div>
          <Link href="/dashboard" className="text-xs font-bold text-[#6B7A74] uppercase tracking-widest">Chiqish</Link>
        </div>

        {/* 3D Yuz (Face) */}
        <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8">
          
          <div className="relative z-10 flex flex-col items-center w-full max-w-md mx-auto">
            <div className={`w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-[#E2E4DF] bg-white flex items-center justify-center relative shadow-sm transition-all duration-700 ${isListening ? "shadow-[0_20px_60px_-15px_rgba(19,37,31,0.2)] border-[#13251F]/20 scale-105" : ""}`}>
              
              <div className="text-center">
                <span className="text-6xl mb-3 block animate-pulse">🤖</span>
                <span className="text-xs text-[#6B7A74] tracking-[0.2em] uppercase font-bold">Finora AI</span>
              </div>
            </div>

            <h3 className="mt-12 text-2xl sm:text-3xl font-extrabold tracking-tight text-center text-[#13251F]">
              {isListening ? "Tinglayapman..." : "Ustozga gapiring."}
            </h3>
            
            <div className="flex gap-1.5 mt-6 h-10 items-center justify-center">
              {[1,2,3,4,5,6,7,8,9].map((i) => (
                <motion.div 
                  key={i}
                  animate={isListening ? { height: ["20%", "100%", "20%"] } : { height: "15%" }}
                  transition={{ repeat: Infinity, duration: (i % 5) * 0.1 + 0.3, delay: i * 0.05 }}
                  className={`w-1.5 sm:w-2 rounded-full ${isListening ? 'bg-[#13251F]' : 'bg-[#C5CAC6]'}`}
                ></motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat va Boshqaruv */}
        <div className="border-t border-[#E2E4DF] bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <div className="flex-1 w-full p-2">
            <p className="text-[#354841] text-base sm:text-lg font-medium leading-relaxed">
              <span className="text-[#13251F] font-extrabold mr-2 uppercase text-xs tracking-widest">Finora AI:</span>
              <br/>
              Salom! Men sizning shaxsiy ustozingizman. Bugun Davlat-Xususiy Sheriklik (DXSh) bo&apos;yicha 1-darsimizni boshlaymiz. Tayyormisiz?
            </p>
          </div>
          <button 
            onMouseDown={() => setIsListening(true)}
            onMouseUp={() => setIsListening(false)}
            onMouseLeave={() => setIsListening(false)}
            onTouchStart={() => setIsListening(true)}
            onTouchEnd={() => setIsListening(false)}
            className={`w-24 h-24 shrink-0 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg select-none ${isListening ? "bg-[#8B0000] shadow-[#8B0000]/40 scale-95 text-white" : "bg-[#13251F] shadow-[#13251F]/20 hover:scale-105 text-white"}`}
          >
            🎙️
          </button>
        </div>
      </main>
    </div>
  );
}
