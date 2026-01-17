
import React, { useState } from 'react';
import { MOCK_P2P_ADS } from '../constants';
import { P2PAd } from '../types';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CreditCard, 
  DollarSign, 
  Lock, 
  User, 
  ArrowRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface P2PAreaProps {
  isVerified: boolean;
}

const P2PArea: React.FC<P2PAreaProps> = ({ isVerified }) => {
  const [activeType, setActiveType] = useState<'BUY' | 'SELL'>('BUY');
  const [activeAsset, setActiveAsset] = useState('USDT');
  const [fiatCurrency, setFiatCurrency] = useState('USD');

  const filteredAds = MOCK_P2P_ADS.filter(ad => 
    ad.type === activeType && ad.asset === activeAsset
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {!isVerified && (
        <div className="absolute inset-0 z-40 bg-[#0b0e11]/50 backdrop-blur-[4px] rounded-[3rem] flex items-center justify-center p-6">
          <div className="bg-[#1e2329] border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl max-w-lg text-center">
            <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Lock size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-4">P2P Trading Locked</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Peer-to-Peer trading involves direct interaction with other users. To ensure community safety and compliance, identity verification is mandatory.
            </p>
            <Link 
              to="/kyc" 
              className="w-full inline-block py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-bold transition-all shadow-xl shadow-blue-600/20"
            >
              Verify Identity to Trade P2P
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e2329] p-8 rounded-[2.5rem] border border-gray-800 shadow-xl">
        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
          <button 
            onClick={() => setActiveType('BUY')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeType === 'BUY' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Buy
          </button>
          <button 
            onClick={() => setActiveType('SELL')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeType === 'SELL' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Sell
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {['USDT', 'BTC', 'ETH', 'FDUSD', 'BNB'].map(asset => (
            <button 
              key={asset}
              onClick={() => setActiveAsset(asset)}
              className={`px-5 py-3 rounded-xl text-sm font-bold transition-all border ${activeAsset === asset ? 'bg-blue-600/10 border-blue-600 text-blue-400' : 'bg-transparent border-gray-800 text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              {asset}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1e2329] p-4 rounded-2xl border border-gray-800 flex items-center justify-between group cursor-pointer hover:border-gray-700 transition-colors">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Amount</div>
            <div className="text-sm font-bold">Enter amount</div>
          </div>
          <ChevronDown size={16} className="text-gray-600" />
        </div>
        <div className="bg-[#1e2329] p-4 rounded-2xl border border-gray-800 flex items-center justify-between group cursor-pointer hover:border-gray-700 transition-colors">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Fiat</div>
            <div className="text-sm font-bold">{fiatCurrency}</div>
          </div>
          <ChevronDown size={16} className="text-gray-600" />
        </div>
        <div className="bg-[#1e2329] p-4 rounded-2xl border border-gray-800 flex items-center justify-between group cursor-pointer hover:border-gray-700 transition-colors">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Payment</div>
            <div className="text-sm font-bold">All Payments</div>
          </div>
          <ChevronDown size={16} className="text-gray-600" />
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/10 transition-all">
          <Search size={18} />
          <span>Search Ads</span>
        </button>
      </div>

      <div className="bg-[#1e2329] rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase font-bold">
                <th className="px-8 py-6">Advertiser</th>
                <th className="px-8 py-6 text-right">Price</th>
                <th className="px-8 py-6">Limit/Available</th>
                <th className="px-8 py-6">Payment</th>
                <th className="px-8 py-6 text-right">Trade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredAds.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-500 italic">
                    <Info size={32} className="mx-auto mb-4 opacity-20" />
                    No advertisements found for this criteria.
                  </td>
                </tr>
              ) : (
                filteredAds.map((ad) => (
                  <tr key={ad.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold relative">
                          {ad.advertiser[0]}
                          {ad.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black p-0.5 rounded-full border-2 border-[#1e2329]">
                              <ShieldCheck size={10} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold flex items-center">
                            {ad.advertiser}
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center">
                            {ad.orders} orders | {ad.completionRate}% completion
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-xl font-bold font-mono">
                        {ad.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs text-gray-500">{ad.currency}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="text-xs flex justify-between w-40">
                          <span className="text-gray-500">Available</span>
                          <span className="font-bold">{ad.available.toLocaleString()} {ad.asset}</span>
                        </div>
                        <div className="text-xs flex justify-between w-40">
                          <span className="text-gray-500">Limits</span>
                          <span className="font-bold">${ad.limitMin.toLocaleString()} - ${ad.limitMax.toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {ad.paymentMethods.map(method => (
                          <div key={method} className="flex items-center space-x-1.5 px-3 py-1 bg-gray-900/50 border border-gray-800 rounded-lg text-[10px] font-bold">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span>{method}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className={`px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${activeType === 'BUY' ? 'bg-green-600 hover:bg-green-500 shadow-green-900/10' : 'bg-red-600 hover:bg-red-500 shadow-red-900/10'}`}>
                        {activeType} {activeAsset}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-blue-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="flex-1 space-y-4">
          <div className="flex items-center space-x-2 text-blue-400">
            <ShieldCheck size={20} />
            <h4 className="font-bold uppercase tracking-[0.2em] text-xs">Safe Trading Protocol</h4>
          </div>
          <h3 className="text-2xl font-bold">Trading Safely with Nexus P2P</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            Never release your assets until you have confirmed receipt of payment in your bank account or payment processor. 
            Nexus Escrow protects your transaction from start to finish. Our 24/7 support is ready to assist with any disputes.
          </p>
          <div className="flex items-center space-x-6 pt-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-bold text-gray-500">Escrow Protected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-bold text-gray-500">Verified Merchants</span>
            </div>
          </div>
        </div>
        <button className="px-8 py-4 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 transition-all flex items-center space-x-2 whitespace-nowrap shadow-xl">
          <span>P2P Guide</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default P2PArea;
