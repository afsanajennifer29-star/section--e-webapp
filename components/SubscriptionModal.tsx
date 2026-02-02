
import React, { useState } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'plans' | 'payment' | 'processing' | 'success';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'drama-pass',
    name: 'Single Pass',
    price: '₹9',
    period: 'per VIP drama',
    features: ['Access to 1 VIP Drama', '1080p Streaming', 'Lifetime access to title']
  },
  {
    id: 'monthly',
    name: 'Monthly VIP',
    price: '₹39',
    period: 'per month',
    features: ['All VIP Dramas', '1080p Streaming', 'No Advertisements', 'Multi-device sync']
  },
  {
    id: 'quarterly',
    name: 'Quarterly VIP',
    price: '₹99',
    period: 'per 3 months',
    features: ['All VIP Dramas', '4K Ultra HD', 'Priority Support', 'Offline Downloads'],
    recommended: true
  },
  {
    id: 'semi-annual',
    name: 'Semi-Annual VIP',
    price: '₹199',
    period: 'per 6 months',
    features: ['All VIP Dramas', 'Early access to releases', 'Best Value Plan', 'Family Sharing']
  }
];

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<Step>('plans');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'upi'>('bank');

  if (!isOpen) return null;

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep('payment');
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
        setStep('plans');
        setSelectedPlan(null);
      }, 2000);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-gray-900 border border-gray-800 rounded-[32px] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <i className="fa-solid fa-gem text-white"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Upgrade to VIP</h2>
              <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Premium Content Awaits</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-all p-2">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-800">
          {step === 'plans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLANS.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative p-5 rounded-3xl border transition-all cursor-pointer flex flex-col group ${
                    plan.recommended 
                    ? 'bg-violet-600/10 border-violet-500 ring-2 ring-violet-500/20' 
                    : 'bg-gray-800/40 border-gray-700 hover:border-gray-500'
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      Recommended
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{plan.name}</h3>
                    <div className="flex items-baseline mt-2">
                      <span className="text-2xl font-black text-white">{plan.price}</span>
                      <span className="text-[10px] text-gray-500 ml-1 font-bold">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start text-[10px] text-gray-400">
                        <i className="fa-solid fa-circle-check text-violet-500 mt-0.5 mr-2"></i>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    plan.recommended ? 'bg-violet-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                  }`}>
                    Choose Plan
                  </button>
                </div>
              ))}
            </div>
          )}

          {step === 'payment' && selectedPlan && (
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800/40 p-5 rounded-3xl border border-gray-700 mb-6 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedPlan.name}</h4>
                  <p className="text-[10px] text-gray-500">{selectedPlan.period}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-violet-400">{selectedPlan.price}</span>
                  <button onClick={() => setStep('plans')} className="block text-[8px] text-gray-500 font-bold hover:text-white mt-1">Change</button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'bank' ? 'bg-teal-600/10 border-teal-500 text-white shadow-lg shadow-teal-500/10' : 'bg-gray-800/40 border-gray-700 text-gray-500'}`}
                  >
                    <i className="fa-solid fa-university text-lg"></i>
                    <span className="text-[9px] font-black uppercase tracking-tighter">Direct Bank Transfer</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'upi' ? 'bg-violet-600/10 border-violet-500 text-white shadow-lg shadow-violet-500/10' : 'bg-gray-800/40 border-gray-700 text-gray-500'}`}
                  >
                    <i className="fa-solid fa-mobile-screen-button text-lg"></i>
                    <span className="text-[9px] font-black uppercase tracking-tighter">UPI (PhonePe/GPay)</span>
                  </button>
                </div>

                <div className="p-6 bg-gray-800/60 border border-gray-700 rounded-3xl space-y-4">
                  {paymentMethod === 'bank' ? (
                    <>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                        <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest">Official Bank Details</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-gray-500 font-bold uppercase">Account Holder</span>
                          <span className="text-xs text-white font-black tracking-wide">ADMIN SECTION E</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-gray-500 font-bold uppercase">Account Number</span>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-teal-400 font-mono font-bold">1234 5678 9012</span>
                            <i className="fa-solid fa-copy text-[10px] text-gray-600 cursor-pointer hover:text-white"></i>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-gray-500 font-bold uppercase">Bank / IFSC</span>
                          <span className="text-xs text-white font-bold">STATE BANK OF INDIA / SBIN0001234</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center py-2">
                      <div className="w-32 h-32 bg-white rounded-2xl mb-4 p-2 flex items-center justify-center">
                        <i className="fa-solid fa-qrcode text-6xl text-gray-900"></i>
                      </div>
                      <p className="text-[10px] text-gray-300 font-bold">UPI ID: sectione@upi</p>
                      <p className="text-[8px] text-gray-500 mt-1">Scan or pay to this ID</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block ml-1">Upload Transaction ID / Proof</label>
                    <input 
                      required 
                      placeholder="Enter 12-digit Ref/UTR Number" 
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-violet-500 outline-none placeholder:text-gray-700" 
                    />
                  </div>
                  <button 
                    onClick={handlePayment}
                    className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-violet-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Confirm & Submit Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h3 className="text-lg font-black text-white uppercase tracking-tighter">Verifying Funds</h3>
              <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-widest">Checking direct bank transfer receipt...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="h-64 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-teal-500/20">
                <i className="fa-solid fa-check text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">VIP Activated</h3>
              <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-widest">Thank you for your support</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-950/50 border-t border-gray-800 text-center">
          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.3em]">
            Funds go directly to admin bank account. No intermediaries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
