
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, ShieldPlus, Github, Check } from 'lucide-react';
import AuthLayout from './AuthLayout';

interface SignUpProps {
  onLogin: (name: string, email: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  }, [password]);

  const strengthColor = useMemo(() => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  }, [passwordStrength]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(name, email);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join 2M+ traders securing the future of digital assets."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Legal Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-black/20 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-black/20 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Security Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/20 border border-gray-800 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Strength Meter */}
          <div className="px-1 pt-1">
             <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-gray-500 uppercase">Security Strength</span>
                <span className={`text-[9px] font-bold uppercase ${passwordStrength === 100 ? 'text-green-500' : 'text-gray-600'}`}>
                  {passwordStrength === 100 ? 'Optimal' : 'Required'}
                </span>
             </div>
             <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${strengthColor}`} 
                  style={{ width: `${passwordStrength}%` }}
                ></div>
             </div>
          </div>
        </div>

        <div className="flex items-start space-x-3 ml-1 py-2">
          <div className="mt-1">
            <input type="checkbox" id="terms" required className="w-4 h-4 rounded border-gray-800 bg-black/20 text-blue-600 focus:ring-blue-600" />
          </div>
          <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
            I agree to the <span className="text-blue-500 hover:underline">User Agreement</span> and <span className="text-blue-500 hover:underline">Privacy Policy</span>.
          </label>
        </div>

        <button 
          type="submit" 
          disabled={isLoading || passwordStrength < 50}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Creating Vault...</span>
            </>
          ) : (
            <>
              <ShieldPlus size={20} />
              <span>Create Nexus ID</span>
            </>
          )}
        </button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1e2329] px-2 text-gray-600 font-bold tracking-widest">Register with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center space-x-2 py-3 border border-gray-800 rounded-xl hover:bg-white/5 transition-all">
             <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-black font-bold text-[10px]">G</div>
             <span className="text-xs font-bold">Google</span>
          </button>
          <button type="button" className="flex items-center justify-center space-x-2 py-3 border border-gray-800 rounded-xl hover:bg-white/5 transition-all">
             <Github size={18} />
             <span className="text-xs font-bold">Github</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already a member? <Link to="/login" className="text-blue-500 font-bold hover:underline">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
