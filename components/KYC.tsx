
import React, { useState } from 'react';
import { ShieldCheck, User, FileText, Camera, Loader2, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface KYCProps {
  onVerify: () => void;
  isVerified: boolean;
}

type Step = 'INITIAL' | 'PERSONAL_INFO' | 'DOC_UPLOAD' | 'SELFIE' | 'PROCESSING' | 'COMPLETED';

const KYC: React.FC<KYCProps> = ({ onVerify, isVerified }) => {
  const [step, setStep] = useState<Step>(isVerified ? 'COMPLETED' : 'INITIAL');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idType: 'Passport',
    idNumber: ''
  });
  const [isAiReviewing, setIsAiReviewing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');

  const handleNext = () => {
    if (step === 'INITIAL') setStep('PERSONAL_INFO');
    else if (step === 'PERSONAL_INFO') setStep('DOC_UPLOAD');
    else if (step === 'DOC_UPLOAD') setStep('SELFIE');
    else if (step === 'SELFIE') simulateAiReview();
  };

  const handleBack = () => {
    if (step === 'PERSONAL_INFO') setStep('INITIAL');
    else if (step === 'DOC_UPLOAD') setStep('PERSONAL_INFO');
    else if (step === 'SELFIE') setStep('DOC_UPLOAD');
  };

  const simulateAiReview = async () => {
    setStep('PROCESSING');
    setIsAiReviewing(true);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Simulate a KYC compliance officer reviewing this application for John Doe. 
    Details: Name: ${formData.firstName} ${formData.lastName}, ID Type: ${formData.idType}, ID Number: ${formData.idNumber}.
    Provide a professional, reassuring 2-sentence confirmation of verification.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiFeedback(response.text || "Identity verification completed successfully. Your Nexus account is now fully unlocked.");
      onVerify();
      setStep('COMPLETED');
    } catch (error) {
      console.error(error);
      setAiFeedback("Verification successful. Your documents have been processed by our automated system.");
      onVerify();
      setStep('COMPLETED');
    } finally {
      setIsAiReviewing(false);
    }
  };

  const StepIndicator = ({ current }: { current: number }) => (
    <div className="flex items-center space-x-2 mb-8">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
            current >= s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'
          }`}>
            {current > s ? <CheckCircle2 size={14} /> : s}
          </div>
          {s < 3 && <div className={`h-0.5 w-12 ${current > s ? 'bg-blue-600' : 'bg-gray-800'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-[#1e2329] border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative">
        
        {step === 'INITIAL' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/5">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-bold">Secure Your Account</h2>
            <p className="text-gray-400">Complete identity verification to increase your limits, enable withdrawals, and access advanced trading features.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left py-6">
              <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
                <CheckCircle2 className="text-green-400 mb-2" size={20} />
                <h4 className="font-bold text-sm">Enhanced Security</h4>
                <p className="text-xs text-gray-500">Protect your funds from unauthorized access.</p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
                <CheckCircle2 className="text-green-400 mb-2" size={20} />
                <h4 className="font-bold text-sm">High Limits</h4>
                <p className="text-xs text-gray-500">Up to $2M daily withdrawal capacity.</p>
              </div>
            </div>

            <button 
              onClick={handleNext}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20"
            >
              <span>Get Started</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 'PERSONAL_INFO' && (
          <div className="space-y-6">
            <StepIndicator current={1} />
            <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
            <p className="text-gray-400 text-sm mb-6">Enter your legal details as they appear on your government ID.</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Document Type</label>
                <select 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.idType}
                  onChange={(e) => setFormData({...formData, idType: e.target.value})}
                >
                  <option>Passport</option>
                  <option>Identity Card</option>
                  <option>Driver's License</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Document Number</label>
                <input 
                  type="text" 
                  value={formData.idNumber}
                  onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. A12345678"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button onClick={handleBack} className="px-6 py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-bold"><ArrowLeft size={20} /></button>
              <button 
                onClick={handleNext} 
                disabled={!formData.firstName || !formData.lastName || !formData.idNumber}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold disabled:opacity-50"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 'DOC_UPLOAD' && (
          <div className="space-y-6">
            <StepIndicator current={2} />
            <h2 className="text-2xl font-bold mb-2">Upload {formData.idType}</h2>
            <p className="text-gray-400 text-sm mb-6">Take a clear photo of your original document. Ensure all four corners are visible.</p>
            
            <div className="border-2 border-dashed border-gray-800 rounded-3xl p-12 text-center bg-gray-900/30 hover:bg-gray-900/50 transition-all group cursor-pointer">
              <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <h4 className="font-bold mb-1">Click to Capture</h4>
              <p className="text-xs text-gray-500">Supports JPG, PNG, PDF up to 10MB</p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-start space-x-3">
              <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-500/80 leading-relaxed">Make sure the document is not expired and the image is not blurry or reflecting light.</p>
            </div>

            <div className="flex space-x-4 pt-6">
              <button onClick={handleBack} className="px-6 py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-bold"><ArrowLeft size={20} /></button>
              <button onClick={handleNext} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold">I've Uploaded</button>
            </div>
          </div>
        )}

        {step === 'SELFIE' && (
          <div className="space-y-6 text-center">
            <StepIndicator current={3} />
            <h2 className="text-2xl font-bold mb-2">Liveness Check</h2>
            <p className="text-gray-400 text-sm mb-6">Position your face in the center of the frame to confirm your identity.</p>
            
            <div className="w-64 h-64 rounded-full border-4 border-blue-600/30 mx-auto overflow-hidden bg-gray-900 flex items-center justify-center relative shadow-inner">
               <User size={120} className="text-gray-800" />
               <div className="absolute inset-0 border-[12px] border-[#1e2329]"></div>
               <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-500/50 blur-[2px] animate-pulse"></div>
            </div>

            <p className="text-xs text-gray-500 italic mt-4">By continuing, you consent to biometric analysis for verification purposes.</p>

            <div className="flex space-x-4 pt-6">
              <button onClick={handleBack} className="px-6 py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-bold"><ArrowLeft size={20} /></button>
              <button onClick={handleNext} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold">Complete Verification</button>
            </div>
          </div>
        )}

        {step === 'PROCESSING' && (
          <div className="text-center py-12 space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-600/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={32} className="text-blue-500 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Analyzing Identity</h3>
              <p className="text-gray-400">Our Nexus AI compliance engine is reviewing your documentation...</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 max-w-sm mx-auto">
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <ShieldCheck size={16} className="text-blue-500" />
                <span>Encrypted transmission active</span>
              </div>
            </div>
          </div>
        )}

        {step === 'COMPLETED' && (
          <div className="text-center space-y-8 py-4">
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/20">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Account Verified</h2>
              <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 text-left mb-6">
                 <p className="text-sm text-gray-400 italic leading-relaxed">
                   "{aiFeedback}"
                 </p>
                 <div className="flex items-center mt-4 text-[10px] text-blue-500 font-bold uppercase tracking-widest">
                   <ShieldCheck size={12} className="mr-1" /> Verified by Nexus AI Compliance
                 </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-900/30 rounded-2xl">
                <div className="text-xs text-gray-500 mb-1">Trading</div>
                <div className="text-xs font-bold text-green-400">UNLOCKED</div>
              </div>
              <div className="text-center p-3 bg-gray-900/30 rounded-2xl">
                <div className="text-xs text-gray-500 mb-1">Limit</div>
                <div className="text-xs font-bold text-green-400">$2M/day</div>
              </div>
              <div className="text-center p-3 bg-gray-900/30 rounded-2xl">
                <div className="text-xs text-gray-500 mb-1">Withdraw</div>
                <div className="text-xs font-bold text-green-400">INSTANT</div>
              </div>
            </div>
            <button 
              onClick={() => window.location.hash = '#/'}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYC;
