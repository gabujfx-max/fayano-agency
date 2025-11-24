import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, User, Phone, CheckCircle, Loader2, ShieldCheck, LocateFixed, Send, Mail, Smartphone } from 'lucide-react';
import { ServiceCategory, BookingDetails, AIAnalysisResult } from '../types';

interface BookingFormProps {
  initialService?: ServiceCategory;
  aiData?: AIAnalysisResult | null;
  onBack: () => void;
  onComplete: () => void;
}

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM"
];

export const BookingForm: React.FC<BookingFormProps> = ({ initialService, aiData, onBack, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [stkStatus, setStkStatus] = useState<'idle' | 'sending' | 'prompt_sent'>('idle');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [transactionCode, setTransactionCode] = useState('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [useManualPayment, setUseManualPayment] = useState(false);

  const [formData, setFormData] = useState<BookingDetails>({
    service: initialService || ServiceCategory.GENERAL,
    description: aiData?.reasoning || '',
    date: '',
    time: '',
    address: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    estimatedCost: aiData ? aiData.estimatedPriceMin : 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Auto-fill payment phone with contact phone if empty
    if (e.target.name === 'contactPhone' && !paymentPhone) {
        setPaymentPhone(e.target.value);
    }
  };

  const handleTimeSelect = (time: string) => {
    setFormData({ ...formData, time });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.description) {
        alert("Please describe the work needed.");
        return;
      }
      if (!formData.date || !formData.time) {
        alert("Please select a preferred date and time.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.address) {
        alert("Please provide an address or use the location button.");
        return;
      }
      if (!formData.contactName || !formData.contactPhone || !formData.contactEmail) {
        alert("Please provide your name, phone, and email address.");
        return;
      }
      if (!paymentPhone) setPaymentPhone(formData.contactPhone);
      setStep(3);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData(prev => ({ ...prev, address: googleMapsLink }));
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please enter it manually.");
        setIsGettingLocation(false);
      }
    );
  };

  const handleInitiateSTK = async () => {
    if (!paymentPhone) {
        alert("Please enter a valid M-Pesa phone number");
        return;
    }
    setStkStatus('sending');
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    setStkStatus('prompt_sent');
  };

  const handlePayment = async () => {
    if (!transactionCode.trim()) {
      alert("Please enter the M-Pesa transaction code.");
      return;
    }

    setPaymentStatus('processing');
    
    try {
      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/movzeaqe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          email: formData.contactEmail, // For Formspree Reply-To
          paymentStatus: 'VERIFYING',
          mpesaTransactionCode: transactionCode,
          paymentMethod: 'M-Pesa',
          mpesaNumber: paymentPhone,
          timestamp: new Date().toISOString(),
          amountPaid: 200
        })
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      // Simulate Verification Delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentStatus('success');

      // Update Loyalty Points in LocalStorage
      const currentPoints = parseInt(localStorage.getItem('fayano_loyalty_count') || '0');
      localStorage.setItem('fayano_loyalty_count', (currentPoints + 1).toString());

      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete();
    } catch (error) {
      console.error("Booking failed:", error);
      alert("There was an issue processing your request. Please try again.");
      setPaymentStatus('idle');
    }
  };

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toLocaleDateString('en-CA');

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 transition-colors duration-300">
      <button onClick={onBack} className="group flex items-center text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 mb-8 transition-colors font-medium">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Services
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        
        {/* Progress Header */}
        <div className="bg-gray-50/50 dark:bg-gray-900/50 px-8 py-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {step === 1 ? 'Job Details' : step === 2 ? 'Contact Info' : 'Secure Payment'}
                </h2>
                <span className="text-sm font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-3 py-1 rounded-full">Step {step} of 3</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-brand-600 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>
        </div>

        <div className="p-8 lg:p-10">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Service Type</label>
                <div className="relative">
                    <select 
                    name="service" 
                    value={formData.service} 
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all appearance-none font-medium"
                    >
                    {Object.values(ServiceCategory).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Description of Work</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows={4}
                  placeholder="Please describe the issue in detail..."
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Preferred Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-600 transition-colors" />
                    <input 
                      type="date" 
                      name="date"
                      min={today}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-12 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all cursor-pointer shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Preferred Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleTimeSelect(slot)}
                        className={`py-2 px-2 text-sm rounded-lg border font-medium transition-all ${
                          formData.time === slot
                            ? 'bg-brand-600 text-white border-brand-600 shadow-md transform scale-105'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {formData.time && <p className="text-xs text-brand-600 dark:text-brand-400 mt-2 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Selected: {formData.time}</p>}
                </div>
              </div>

              <button 
                onClick={handleNextStep}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all transform hover:-translate-y-0.5"
              >
                Continue to Contact
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Location / Google Map Link</label>
                    <button 
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      className="text-xs flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:text-brand-700 font-bold"
                    >
                      {isGettingLocation ? <Loader2 className="w-3 h-3 animate-spin"/> : <LocateFixed className="w-3 h-3"/>}
                      {isGettingLocation ? 'Fetching...' : 'Use Current Location'}
                    </button>
                  </div>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-600 transition-colors" />
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g., Kilimani, Rose Avenue, Apt 4B or click button above"
                      className="w-full pl-12 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Your Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-600 transition-colors" />
                    <input 
                      type="text" 
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-12 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-600 transition-colors" />
                      <input 
                        type="tel" 
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="07XX XXX XXX"
                        className="w-full pl-12 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-600 transition-colors" />
                      <input 
                        type="email" 
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full pl-12 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-1">We'll send your booking confirmation here.</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNextStep}
                    className="flex-[2] bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all transform hover:-translate-y-0.5"
                  >
                    Proceed to Payment
                  </button>
                </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800 flex items-start gap-4">
                   <div className="bg-white dark:bg-gray-800 p-3 rounded-full h-fit shadow-sm text-green-600 dark:text-green-500">
                        <ShieldCheck className="w-6 h-6" />
                   </div>
                   <div>
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white">Secure Commitment Fee</h3>
                       <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">A KSh 200 fee reserves your slot. This ensures our vetted fundis are dispatched to serious clients.</p>
                   </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-3 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Service</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formData.service}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Date & Time</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formData.date} at {formData.time}</span>
                    </div>
                    <div className="my-2 border-t border-gray-200 dark:border-gray-600 border-dashed"></div>
                    <div className="flex justify-between text-xl font-bold text-brand-700 dark:text-brand-400">
                        <span>Total To Pay</span>
                        <span>KSh 200.00</span>
                    </div>
                </div>

                {paymentStatus === 'idle' && (
                    <div className="space-y-6">
                         {!useManualPayment && stkStatus !== 'prompt_sent' && (
                           <div className="space-y-6">
                              <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">M-Pesa Phone Number</label>
                                <div className="relative group">
                                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-600 transition-colors" />
                                  <input 
                                    type="tel" 
                                    value={paymentPhone}
                                    onChange={(e) => setPaymentPhone(e.target.value)}
                                    placeholder="07XX XXX XXX"
                                    className="w-full pl-12 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-lg tracking-wide font-medium"
                                  />
                                </div>
                              </div>

                              <button 
                                onClick={handleInitiateSTK}
                                disabled={stkStatus === 'sending'}
                                className="w-full bg-[#4CAF50] hover:bg-[#43A047] disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                              >
                                {stkStatus === 'sending' ? (
                                  <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending Prompt...
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-5 h-5" />
                                    Pay KSh 200 with M-Pesa
                                  </>
                                )}
                              </button>
                              
                              <div className="text-center">
                                <button 
                                  onClick={() => setUseManualPayment(true)}
                                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 underline"
                                >
                                  Having trouble? Pay Manually
                                </button>
                              </div>
                           </div>
                         )}

                         {(stkStatus === 'prompt_sent' || useManualPayment) && (
                            <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
                                {stkStatus === 'prompt_sent' && !useManualPayment ? (
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 text-center mb-6">
                                        <Loader2 className="w-8 h-8 text-green-600 dark:text-green-500 animate-spin mx-auto mb-2" />
                                        <p className="font-bold text-green-800 dark:text-green-200">Please check your phone</p>
                                        <p className="text-sm text-green-700 dark:text-green-300">Enter your M-Pesa PIN to complete payment.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col p-6 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Manual Payment Instructions</span>
                                        <div className="space-y-2 text-gray-800 dark:text-gray-200 text-sm">
                                            <p>1. Go to <span className="font-bold">M-PESA</span> menu.</p>
                                            <p>2. Select <span className="font-bold">Send Money</span>.</p>
                                            <p>3. Enter Number: <span className="font-bold text-brand-600 dark:text-brand-400 text-base">0759298305</span></p>
                                            <p>4. Enter Amount: <span className="font-bold">KSh 200</span></p>
                                            <p>5. Enter PIN and Send.</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Enter M-Pesa Transaction Code</label>
                                    <input 
                                    type="text" 
                                    value={transactionCode}
                                    onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. SBU12ABCD34"
                                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-mono tracking-wider"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Required for verification.</p>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => {
                                          setUseManualPayment(false);
                                          setStkStatus('idle');
                                        }}
                                        className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        onClick={handlePayment}
                                        className="flex-[2] bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 transition-all transform hover:-translate-y-0.5"
                                    >
                                        Confirm Payment
                                    </button>
                                </div>
                                {stkStatus === 'prompt_sent' && !useManualPayment && (
                                    <div className="text-center mt-2">
                                        <button 
                                            onClick={() => setUseManualPayment(true)}
                                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 underline"
                                        >
                                            Didn't get the pop-up? Use Manual Method
                                        </button>
                                    </div>
                                )}
                            </div>
                         )}
                    </div>
                )}

                {paymentStatus === 'processing' && (
                    <div className="text-center py-12">
                        <Loader2 className="w-16 h-16 text-brand-600 dark:text-brand-500 animate-spin mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verifying Payment...</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">We are checking transaction <span className="font-mono font-bold">{transactionCode}</span>. Please wait a moment.</p>
                    </div>
                )}

                {paymentStatus === 'success' && (
                    <div className="text-center py-12 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Your fundi has been dispatched. You've earned <span className="font-bold text-amber-500">1 Loyalty Point!</span></p>
                    </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};