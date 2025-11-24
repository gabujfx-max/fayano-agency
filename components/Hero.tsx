import React from 'react';
import { CheckCircle2, Shield, Clock, Banknote, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartAI: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAI }) => {
  return (
    <div className="relative bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-brand-50 to-transparent dark:from-brand-900/20"></div>
        <svg className="absolute right-0 top-0 h-full w-1/2 text-gray-100 dark:text-gray-800" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M0 100 L100 0 L100 100 Z" fill="currentColor" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="lg:w-3/5 space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-700 text-brand-700 dark:text-brand-300 text-sm font-bold tracking-wide shadow-sm hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors cursor-default">
            <Shield className="w-4 h-4" />
            <span>Guaranteed Quality & 1-Week Warranty</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
            Expert Fundis for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Home & Office.</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl font-light">
            We connect you with vetted, professional fundis for plumbing, electrical, and installations. 
            <span className="font-medium text-gray-900 dark:text-white"> Transparent pricing. Zero hassles.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-5 pt-4">
            <button 
              onClick={onStartAI}
              className="group relative flex-1 sm:flex-none bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>AI Diagnosis & Booking</span>
            </button>
            <button className="flex-1 sm:flex-none bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-sm transition-all hover:border-brand-300 dark:hover:border-brand-500">
              Explore Services
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
            {[
                { icon: CheckCircle2, text: "Vetted Pros" },
                { icon: Banknote, text: "Fixed Rates" },
                { icon: Clock, text: "On-Time" },
                { icon: Shield, text: "Warranty" }
            ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                    <div className="p-2 bg-brand-50 dark:bg-gray-800 rounded-lg text-brand-600 dark:text-brand-400">
                        <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">{item.text}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};