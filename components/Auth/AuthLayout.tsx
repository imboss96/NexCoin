
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      </div>
      
      {/* Mesh Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="w-full max-w-[480px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white font-bold text-3xl italic shadow-2xl shadow-blue-600/30 mb-6">N</div>
          <h1 className="text-4xl font-bold tracking-tight text-white text-center">{title}</h1>
          <p className="text-gray-400 mt-2 text-center max-w-sm">{subtitle}</p>
        </div>

        <div className="bg-[#1e2329]/80 backdrop-blur-xl border border-gray-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          {children}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            © 2024 Nexus Secure Infrastructure. All rights reserved. <br/>
            By continuing, you agree to our <span className="text-blue-500 cursor-pointer hover:underline">Terms of Service</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
