
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, Github } from 'lucide-react';
import AuthLayout from './AuthLayout';

interface LoginProps {
  onLogin: (name: string, email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay for a "Secure Handshake" feel
    setTimeout(() => {
      onLogin("Trader User", email || "user@nexus.io");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Access your high-performance trading dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
            <button type="button" className="text-[10px] text-blue-500 font-bold uppercase hover:underline">Forgot?</button>
          </div>
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
        </div>

        <div className="flex items-center space-x-3 ml-1">
          <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-800 bg-black/20 text-blue-600 focus:ring-blue-600" />
          <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer select-none">Remember this device</label>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={20} />
              <span>Sign In to Nexus</span>
            </>
          )}
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1e2329] px-2 text-gray-600 font-bold tracking-widest">Or continue with</span></div>
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

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/signup" className="text-blue-500 font-bold hover:underline">Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
