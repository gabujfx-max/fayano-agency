import React, { useEffect, useState } from 'react';
import { X, Gift, Star, Trophy, CheckCircle } from 'lucide-react';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoyaltyModal: React.FC<LoyaltyModalProps> = ({ isOpen, onClose }) => {
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('fayano_loyalty_count');
      setBookingsCount(stored ? parseInt(stored) : 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate progress
  const currentLevel = bookingsCount % 10;
  const cyclesCompleted = Math.floor(bookingsCount / 10);
  const remaining = 10 - currentLevel;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transition-colors duration-200 relative">
        
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-300 transition-colors z-10"
        >
            <X className="w-5 h-5" />
        </button>

        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-50 pattern-grid"></div>
            <div className="relative z-10">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-lg">
                    <Trophy className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Fayano Rewards</h2>
                <p className="text-amber-100 text-sm font-medium">Earn points for every service booked!</p>
            </div>
        </div>

        <div className="p-8">
            <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {cyclesCompleted > 0 ? `You've earned ${cyclesCompleted} Free Services!` : 'Collect 10 stamps for a Free Service'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {remaining === 0 
                        ? "Congratulations! You can claim your reward now." 
                        : `${remaining} more booking${remaining > 1 ? 's' : ''} until your next reward.`}
                </p>
            </div>

            {/* Stamps Grid */}
            <div className="grid grid-cols-5 gap-3 mb-8">
                {Array.from({ length: 10 }).map((_, index) => {
                    const isCompleted = index < currentLevel;
                    return (
                        <div key={index} className="aspect-square relative">
                            <div className={`w-full h-full rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                isCompleted 
                                    ? 'bg-amber-100 border-amber-400 dark:bg-amber-900/30 dark:border-amber-500' 
                                    : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                            }`}>
                                {isCompleted ? (
                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500 animate-in zoom-in duration-300" />
                                ) : (
                                    <span className="text-xs font-bold text-gray-300 dark:text-gray-600">{index + 1}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {currentLevel === 0 && cyclesCompleted > 0 && (
                 <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3 mb-6 animate-pulse">
                    <Gift className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                        <p className="font-bold text-green-800 dark:text-green-300">Reward Unlocked!</p>
                        <p className="text-xs text-green-700 dark:text-green-400">Claim your free service on your next booking.</p>
                    </div>
                 </div>
            )}

            <div className="space-y-3">
                {currentLevel === 0 && cyclesCompleted > 0 ? (
                    <a 
                        href="https://wa.me/254759298305?text=Hi%2C%20I%20have%20completed%2010%20bookings%20and%20would%20like%20to%20claim%20my%20free%20service."
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-center block shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5"
                    >
                        Claim Free Service
                    </a>
                ) : (
                    <button 
                        onClick={onClose}
                        className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all"
                    >
                        Keep Booking
                    </button>
                )}
                
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
                    Terms apply. Free service value capped at KSh 2,000.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};