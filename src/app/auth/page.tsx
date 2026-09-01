import React from "react";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex bg-[#F5F4EE] font-sans">
      
      {/* LEFT PANEL - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 relative">
        
        {/* Top Left Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#13251F] flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#13251F]">finora</span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-12">
          {/* Header */}
          <div className="mb-8">
            <p className="text-[11px] font-bold tracking-[0.15em] text-[#6B7A74] mb-3 uppercase">
              Xush kelibsiz
            </p>
            <h1 className="text-4xl font-extrabold text-[#13251F] mb-3 tracking-tight">
              Hisobingizga kiring.
            </h1>
            <p className="text-[#6B7A74] text-[15px] leading-relaxed">
              O&apos;quv progressingiz va AI tutor suhbatlaringizni davom ettiring.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            
            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-bold text-[#354841]">
                <svg className="w-4 h-4 text-[#6B7A74]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </label>
              <input 
                type="email" 
                placeholder="siz@example.com" 
                className="w-full px-4 py-3.5 rounded-xl border border-[#E2E4DF] bg-white text-[#13251F] placeholder-[#A3ACA8] focus:outline-none focus:ring-2 focus:ring-[#13251F]/20 focus:border-[#13251F] transition-all shadow-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-bold text-[#354841]">
                <svg className="w-4 h-4 text-[#6B7A74]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Parol
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Kamida 8 ta belgi" 
                  className="w-full px-4 py-3.5 rounded-xl border border-[#E2E4DF] bg-white text-[#13251F] placeholder-[#A3ACA8] focus:outline-none focus:ring-2 focus:ring-[#13251F]/20 focus:border-[#13251F] transition-all shadow-sm pr-12"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3ACA8] hover:text-[#13251F] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-[#C5CAC6] bg-white flex items-center justify-center group-hover:border-[#13251F] transition-colors"></div>
                <span className="text-[13px] font-bold text-[#6B7A74] group-hover:text-[#13251F] transition-colors">Eslab qolish</span>
              </label>
              <Link href="#" className="text-[13px] font-bold text-[#354841] hover:text-[#13251F] transition-colors">
                Parolni unutdingizmi?
              </Link>
            </div>

            {/* Submit Button */}
            <Link href="/onboarding" className="block w-full">
              <button 
                type="button"
                className="w-full py-4 mt-2 bg-[#13251F] hover:bg-[#1C362D] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                Kirish 
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </Link>
          </form>

          {/* Footer text */}
          <p className="text-center mt-8 text-[13px] font-medium text-[#6B7A74]">
            Hali hisobingiz yo&apos;qmi? <Link href="#" className="font-bold text-[#13251F] hover:underline transition-colors">Ro&apos;yxatdan o&apos;tish</Link>
          </p>

        </div>

        {/* Very bottom disclaimer */}
        <div className="text-center">
          <p className="text-[11px] font-medium text-[#A3ACA8]">
            Davom etish orqali foydalanish shartlari va maxfiylik siyosatiga rozilik bildirasiz.
          </p>
        </div>

      </div>

      {/* RIGHT PANEL - Image/Brand Area */}
      <div className="hidden lg:flex w-1/2 bg-[#13251F] relative flex-col justify-between p-16 text-white overflow-hidden">
        
        {/* Background Concentric Rings */}
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full border border-white/5 opacity-50"></div>
        <div className="absolute top-[5%] right-[5%] w-[600px] h-[600px] rounded-full border border-white/5 opacity-50"></div>
        <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] rounded-full border border-white/5 opacity-50"></div>
        
        {/* Top Icon */}
        <div className="relative z-10 opacity-70">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        </div>

        {/* Main Text Content */}
        <div className="relative z-10 max-w-lg mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-8 tracking-tight">
            &quot;Moliyaviy erkinlik katta daromaddan emas, ongli qarorlardan boshlanadi.&quot;
          </h2>
          
          <div className="flex items-center gap-3 opacity-90">
            <div className="w-6 h-6 rounded-full border-2 border-emerald-400 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[#A3ACA8] font-medium text-sm">Ma&apos;lumotlaringiz himoyalangan</span>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10">
          <p className="text-[#A3ACA8] font-medium text-[13px]">
            Ta&apos;lim. Tushunish. Ishonchli qaror.
          </p>
        </div>

      </div>

    </div>
  );
}
