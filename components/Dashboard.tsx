
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, CreditCard, Activity, DollarSign, Wallet, ShieldAlert, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Coin, PortfolioAsset, Trade } from '../types';
import { MOCK_BLOG_POSTS } from '../constants';

interface DashboardProps {
  coins: Coin[];
  portfolio: PortfolioAsset[];
  balance: number;
  trades: Trade[];
  isVerified: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ coins, portfolio, balance, trades, isVerified }) => {
  const totalPortfolioValue = portfolio.reduce((acc, asset) => {
    const coin = coins.find(c => c.id === asset.coinId);
    return acc + (coin ? coin.price * asset.amount : 0);
  }, 0);

  const totalValue = totalPortfolioValue + balance;

  const chartData = [
    { time: '00:00', value: 12500 },
    { time: '04:00', value: 12800 },
    { time: '08:00', value: 12600 },
    { time: '12:00', value: 13100 },
    { time: '16:00', value: 13400 },
    { time: '20:00', value: 13200 },
    { time: '23:59', value: totalValue },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {!isVerified && (
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-6 rounded-3xl flex items-center justify-between group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-500/20 rounded-2xl text-yellow-500">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white">Complete Identity Verification</h4>
              <p className="text-sm text-gray-400">Unlock full trading features and higher withdrawal limits by completing KYC.</p>
            </div>
          </div>
          <Link to="/kyc" className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-2xl font-bold transition-all transform group-hover:scale-105">
            <span>Verify Now</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1e2329] p-6 rounded-3xl border border-gray-800 shadow-xl group hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <Wallet size={24} />
            </div>
            <div className="flex items-center text-green-400 text-sm font-bold bg-green-400/10 px-2 py-1 rounded-lg">
              <ArrowUpRight size={14} className="mr-1" />
              +5.4%
            </div>
          </div>
          <div className="text-gray-400 text-sm font-medium mb-1">Net Worth</div>
          <div className="text-2xl font-bold text-white">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="bg-[#1e2329] p-6 rounded-3xl border border-gray-800 shadow-xl group hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
              <Activity size={24} />
            </div>
            <div className="flex items-center text-red-400 text-sm font-bold bg-red-400/10 px-2 py-1 rounded-lg">
              <ArrowDownRight size={14} className="mr-1" />
              -1.2%
            </div>
          </div>
          <div className="text-gray-400 text-sm font-medium mb-1">Portfolio Assets</div>
          <div className="text-2xl font-bold text-white">${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="bg-[#1e2329] p-6 rounded-3xl border border-gray-800 shadow-xl group hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="text-gray-400 text-sm font-medium mb-1">Available USD</div>
          <div className="text-2xl font-bold text-white">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="bg-[#1e2329] p-6 rounded-3xl border border-gray-800 shadow-xl group hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="text-gray-400 text-sm font-medium mb-1">Active Trades</div>
          <div className="text-2xl font-bold text-white">{trades.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#1e2329] p-6 rounded-3xl border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Performance History</h3>
            <div className="flex space-x-2">
              {['1D', '1W', '1M', '1Y', 'ALL'].map(t => (
                <button key={t} className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors ${t === '1D' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3339" vertical={false} />
                <XAxis dataKey="time" stroke="#5e6673" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#5e6673" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e2329', border: '1px solid #374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1e2329] p-6 rounded-3xl border border-gray-800">
          <h3 className="text-lg font-bold mb-6">Top Gainers</h3>
          <div className="space-y-4">
            {coins.sort((a, b) => b.change24h - a.change24h).slice(0, 4).map(coin => (
              <div key={coin.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center font-bold text-sm">
                    {coin.symbol[0]}
                  </div>
                  <div>
                    <div className="font-bold">{coin.name}</div>
                    <div className="text-xs text-gray-500">{coin.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${coin.price.toLocaleString()}</div>
                  <div className={`text-xs font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/markets" className="mt-8 flex items-center justify-center space-x-2 w-full py-3 border border-gray-800 rounded-2xl text-xs font-bold text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
            <span>View All Markets</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="bg-[#1e2329] p-8 rounded-[2.5rem] border border-gray-800">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Newspaper size={24} className="text-blue-500" />
            <h3 className="text-xl font-bold">Latest Finance Insights</h3>
          </div>
          <Link to="/blog" className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center">
            Read All Articles <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_BLOG_POSTS.map(post => (
            <Link key={post.id} to="/blog" className="group">
              <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 hover:border-blue-500/30 transition-all h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{post.category}</span>
                  <span className="text-[10px] text-gray-500">{post.date}</span>
                </div>
                <h4 className="font-bold group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">{post.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
