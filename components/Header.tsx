import React from 'react';
import { Wrench, Phone, ShieldCheck, Moon, Sun, MessageCircle, Gift } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenLoyalty: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, isDarkMode, onToggleTheme, onOpenLoyalty }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => onNavigate('home')}
          >
            <div className="bg-brand-600 p-2.5 rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Fayano Agency</h1>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold tracking-wide uppercase">Professional Fundis</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Services</button>
            <button onClick={() => onNavigate('home')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About Us</button>
            <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-green-100 dark:border-green-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified & Insured</span>
            </div>
          </nav>

          <div className="flex items-center gap-4">
             <button
                onClick={onOpenLoyalty}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
             >
                <Gift className="w-4 h-4" />
                <span>My Rewards</span>
             </button>

             <button 
                onClick={onToggleTheme}
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                aria-label="Toggle Dark Mode"
             >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>

             <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Need Help?</span>
                <a 
                   href="https://wa.me/254759298305"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                   <MessageCircle className="w-4 h-4 text-green-500" />
                   <span>WhatsApp Us</span>
                </a>
             </div>

             <button 
                onClick={() => onNavigate('book')}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 active:scale-95 text-sm"
             >
               Book Now
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};