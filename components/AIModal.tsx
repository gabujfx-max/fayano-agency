import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, Check, ArrowRight, Loader2 } from 'lucide-react';
import { analyzeServiceRequest } from '../services/geminiService';
import { AIAnalysisResult, ServiceCategory } from '../types';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToBooking: (result: AIAnalysisResult) => void;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, onProceedToBooking }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeServiceRequest(input);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInput('');
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200 ring-1 ring-white/10">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white flex justify-between items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Smart Diagnosis</h2>
            </div>
            <p className="text-brand-100 text-sm leading-relaxed max-w-xs">Describe your issue naturally, and our AI will match you with the right expert and estimate.</p>
          </div>
          <button onClick={onClose} className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {!result ? (
            <div className="space-y-6">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">
                What seems to be the problem?
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., My kitchen sink is leaking underneath and making a huge mess on the floor..."
                className="w-full h-40 p-5 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 resize-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-700/50 transition-all outline-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !input.trim()}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Issue...
                    </>
                  ) : (
                    <>
                      Diagnose & Get Price
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-brand-50/50 dark:bg-brand-900/10 rounded-2xl p-6 border border-brand-100 dark:border-brand-800/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Recommended Service</span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{result.category}</h3>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                    result.urgency === 'Critical' ? 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' :
                    result.urgency === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' :
                    'bg-green-50 border-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                  }`}>
                    {result.urgency} Priority
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                  {result.reasoning}
                </p>

                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-full shrink-0">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">Estimated Cost Range</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">KSh {result.estimatedPriceMin.toLocaleString()} - {result.estimatedPriceMax.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={reset}
                  className="flex-1 px-4 py-4 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-bold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => onProceedToBooking(result)}
                  className="flex-[2] bg-brand-600 hover:bg-brand-700 text-white px-4 py-4 rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  Book Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};