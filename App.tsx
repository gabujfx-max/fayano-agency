import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesGrid } from './components/ServicesGrid';
import { BookingForm } from './components/BookingForm';
import { ContactSection } from './components/ContactSection';
import { AIModal } from './components/AIModal';
import { LoyaltyModal } from './components/LoyaltyModal';
import { ServiceCategory, AIAnalysisResult } from './types';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-900 dark:bg-black text-white pt-20 pb-10 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold mb-6 tracking-tight">Fayano Agency</h3>
          <p className="text-gray-400 leading-relaxed max-w-sm mb-6">
            We are revolutionizing home services in Kenya. Connecting homes and offices with vetted, reliable fundis. 
            Repairs made simple, transparent, and guaranteed.
          </p>
          <div className="flex gap-4">
            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-brand-600 transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-brand-600 transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-brand-600 transition-colors"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-6">Quick Contacts</h3>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-brand-500" /> 
              <a href="https://wa.me/254759298305" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer font-medium">Chat on WhatsApp</a>
            </li>
            <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-brand-500" /> <span className="hover:text-white transition-colors cursor-pointer">support@fayano.co.ke</span></li>
            <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-brand-500 shrink-0" /> <span>Westlands Commercial Ctr,<br/>Nairobi, Kenya</span></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-6">Company</h3>
          <ul className="space-y-3 text-gray-400">
            <li><a href="#" className="hover:text-brand-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Careers (Join as Fundi)</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">
        <p>&copy; {new Date().getFullYear()} Fayano Agency. All rights reserved.</p>
        <p>Designed with <span className="text-red-500">♥</span> in Nairobi</p>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'booking'>('home');
  const [selectedService, setSelectedService] = useState<ServiceCategory | undefined>(undefined);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or persisted state
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      setCurrentView('home');
      setSelectedService(undefined);
      setAiResult(null);
      window.scrollTo(0, 0);
    } else if (page === 'book') {
      setCurrentView('booking');
      window.scrollTo(0, 0);
    }
  };

  const handleServiceSelect = (service: ServiceCategory) => {
    setSelectedService(service);
    setCurrentView('booking');
    window.scrollTo(0, 0);
  };

  const handleAIProceed = (result: AIAnalysisResult) => {
    setAiResult(result);
    setSelectedService(result.category);
    setIsAIModalOpen(false);
    setCurrentView('booking');
    window.scrollTo(0, 0);
  };

  const handleBookingComplete = () => {
    alert("Booking Confirmed! You have earned 1 Loyalty Point.");
    handleNavigate('home');
    setIsLoyaltyModalOpen(true); // Open rewards modal to show progress
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300 font-sans selection:bg-brand-500/30">
      <Header 
        onNavigate={handleNavigate} 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme} 
        onOpenLoyalty={() => setIsLoyaltyModalOpen(true)}
      />
      
      <main className="flex-grow">
        {currentView === 'home' ? (
          <>
            <Hero onStartAI={() => setIsAIModalOpen(true)} />
            <ServicesGrid onSelectService={handleServiceSelect} />
            
            <section className="bg-brand-900 dark:bg-brand-950 text-white py-24 transition-colors duration-300 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-4xl font-bold mb-6 tracking-tight">Are you a Skilled Fundi?</h2>
                <p className="text-brand-100 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                  Join Fayano Agency today. We offer steady jobs, fair pay, and professional branding. Stop bargaining, start earning consistently.
                </p>
                <button className="bg-white dark:bg-gray-800 text-brand-900 dark:text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg shadow-black/20 text-lg">
                  Join as a Pro
                </button>
              </div>
            </section>

            <ContactSection />
          </>
        ) : (
          <BookingForm 
            initialService={selectedService}
            aiData={aiResult}
            onBack={() => handleNavigate('home')}
            onComplete={handleBookingComplete}
          />
        )}
      </main>

      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
        onProceedToBooking={handleAIProceed}
      />

      <LoyaltyModal 
        isOpen={isLoyaltyModalOpen} 
        onClose={() => setIsLoyaltyModalOpen(false)}
      />
      
      <Footer />
    </div>
  );
}