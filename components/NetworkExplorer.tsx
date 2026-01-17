
import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Cpu, 
  Zap, 
  Database, 
  ShieldCheck, 
  Activity, 
  Server, 
  Layers, 
  ArrowUpRight,
  ChevronRight,
  Lock,
  Boxes,
  Compass
} from 'lucide-react';
import { Coin } from '../types';

interface NetworkExplorerProps {
  coins: Coin[];
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  asset: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING';
}

const NetworkExplorer: React.FC<NetworkExplorerProps> = ({ coins }) => {
  const [tps, setTps] = useState(2450);
  const [blockHeight, setBlockHeight] = useState(14528990);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeNodes, setActiveNodes] = useState(428);
  const [totalValueLocked, setTotalValueLocked] = useState(8425000000);

  // Helper to generate a realistic looking address
  const generateAddress = (type: string) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let res = "";
    const prefix = type === 'ETH' ? '0x' : type === 'BTC' ? 'bc1q' : 'nx1p';
    const length = type === 'BTC' ? 32 : 40;
    for (let i = 0; i < length; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + res;
  };

  // Generate simulated network transactions
  useEffect(() => {
    const interval = setInterval(() => {
      setTps(prev => Math.floor(prev + (Math.random() * 100 - 50)));
      setBlockHeight(prev => prev + 1);
      
      const asset = coins[Math.floor(Math.random() * coins.length)];
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 12).toUpperCase(),
        from: generateAddress(asset.symbol),
        to: generateAddress(asset.symbol),
        amount: (Math.random() * 2).toFixed(4),
        asset: asset.symbol,
        timestamp: new Date().toLocaleTimeString(),
        status: Math.random() > 0.1 ? 'SUCCESS' : 'PENDING'
      };

      setTransactions(prev => [newTx, ...prev].slice(0, 15));
    }, 2000);

    return () => clearInterval(interval);
  }, [coins]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Network Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current TPS', value: tps.toLocaleString(), icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Block Height', value: blockHeight.toLocaleString(), icon: Boxes, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Network TVL', value: `$${(totalValueLocked / 1e9).toFixed(1)}B`, icon: Database, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Active Nodes', value: activeNodes.toLocaleString(), icon: Server, color: 'text-green-500', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1e2329] p-6 rounded-3xl border border-gray-800 shadow-xl group hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center text-green-400 text-[10px] font-bold bg-green-400/10 px-2 py-1 rounded-lg uppercase tracking-wider">
                Stable
              </div>
            </div>
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-2xl font-bold font-mono text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Network Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1e2329] p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <Layers size={24} className="text-blue-500" />
                <h3 className="text-xl font-bold">Real-time Network Ledger</h3>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 uppercase">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Live Propagation</span>
              </div>
            </div>

            <div className="space-y-3">
              {transactions.map((tx, idx) => (
                <div key={tx.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-900/40 rounded-2xl border border-gray-800 hover:border-blue-500/20 transition-all animate-in slide-in-from-right duration-300 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                      <Cpu size={18} className="text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[10px] font-bold text-blue-400 truncate max-w-[120px]">{tx.id}</div>
                      <div className="text-[10px] text-gray-500 flex items-center space-x-2 mt-1">
                        <span className="truncate font-mono max-w-[80px]">{tx.from}</span>
                        <ChevronRight size={10} className="shrink-0" />
                        <span className="truncate font-mono max-w-[80px]">{tx.to}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:flex-col md:items-end shrink-0">
                    <div className="font-bold text-sm">
                      {tx.amount} <span className="text-xs text-gray-500">{tx.asset}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">{tx.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full py-4 border border-gray-800 hover:bg-gray-800 rounded-2xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all">
              Explorer Dashboard
            </button>
          </div>
        </div>

        {/* Global Node Map & Staking */}
        <div className="space-y-8">
          {/* Node Visualization */}
          <div className="bg-[#1e2329] p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden group">
            <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <Globe size={18} className="text-cyan-400" />
              <span>Global Node Network</span>
            </h3>
            <div className="aspect-square bg-black/40 rounded-3xl relative flex items-center justify-center border border-gray-800">
               {/* Simulated Map Background */}
               <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                 <Compass size={200} className="text-blue-500" />
               </div>
               {/* Pulsing Nodes */}
               {[
                 { t: '15%', l: '20%' }, { t: '45%', l: '75%' }, { t: '70%', l: '30%' },
                 { t: '25%', l: '85%' }, { t: '60%', l: '10%' }, { t: '40%', l: '50%' }
               ].map((pos, i) => (
                 <div key={i} className="absolute w-2 h-2 bg-blue-500 rounded-full" style={{ top: pos.t, left: pos.l }}>
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                 </div>
               ))}
               <div className="relative text-center z-10">
                  <div className="text-3xl font-bold font-mono text-white">428</div>
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Active Validators</div>
               </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-900/50 rounded-2xl text-center border border-gray-800">
                <div className="text-[10px] text-gray-500 mb-1">Latency</div>
                <div className="text-xs font-bold text-green-400">12ms</div>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-2xl text-center border border-gray-800">
                <div className="text-[10px] text-gray-500 mb-1">Uptime</div>
                <div className="text-xs font-bold text-white">99.98%</div>
              </div>
            </div>
          </div>

          {/* Staking Promotion */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-3">
                <ShieldCheck size={28} />
                <h3 className="text-2xl font-bold leading-tight">Secure the<br/>Nexus Network</h3>
              </div>
              <p className="text-blue-100 text-sm opacity-80 leading-relaxed">
                Delegate your assets to Nexus validators and earn up to <span className="font-bold text-white">12.5% APY</span> in network rewards.
              </p>
              <div className="pt-4">
                 <div className="flex justify-between items-end mb-1">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Total Delegated</span>
                   <span className="text-lg font-bold font-mono">14.2M NEX</span>
                 </div>
                 <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3 group-hover:w-3/4 transition-all duration-1000"></div>
                 </div>
              </div>
              <button className="w-full py-4 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl">
                Stake Now
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkExplorer;
