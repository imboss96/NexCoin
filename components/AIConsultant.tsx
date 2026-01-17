
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, Sparkles, User, Loader2 } from 'lucide-react';
import { Coin } from '../types';
import { getMarketInsights } from '../services/geminiService';

interface AIConsultantProps {
  coins: Coin[];
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ coins }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! I'm Nexus AI, your professional crypto market analyst. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    
    setIsTyping(true);
    const aiResponse = await getMarketInsights(coins, userMsg);
    setMessages(prev => [...prev, { role: 'ai', content: aiResponse || "I'm having trouble analyzing the data right now. Please try again." }]);
    setIsTyping(false);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-[#1e2329] rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl animate-in zoom-in duration-500">
      <div className="p-6 border-b border-gray-800 bg-[#1e2329] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Nexus Market Analyst</h2>
            <div className="flex items-center text-xs text-green-400 font-bold">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Gemini-3 Pro Active
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400 bg-gray-800/50 px-4 py-2 rounded-xl">
          <Sparkles size={14} className="text-yellow-500" />
          <span>Powered by Google Gemini</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-800'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-3xl ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/10' 
                : 'bg-gray-800/50 text-[#eaecef] rounded-tl-none border border-gray-700'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex flex-row items-center gap-4">
               <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-800">
                <Bot size={16} />
              </div>
              <div className="bg-gray-800/50 p-4 rounded-3xl rounded-tl-none border border-gray-700">
                <Loader2 size={18} className="animate-spin text-blue-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-800 bg-[#1e2329]">
        <div className="flex space-x-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about market trends, coin analysis, or portfolio advice..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button 
            onClick={handleSend}
            className="p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center disabled:opacity-50"
            disabled={isTyping}
          >
            <Send size={24} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Price prediction for BTC?", "Is ETH overbought?", "Market sentiment?", "Explain DeFi"].map(suggestion => (
            <button 
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-800/50 hover:bg-gray-800 hover:text-white px-3 py-1.5 rounded-lg border border-gray-700/50 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
