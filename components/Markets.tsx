
import React from 'react';
import { Coin } from '../types';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MarketsProps {
  coins: Coin[];
}

const Markets: React.FC<MarketsProps> = ({ coins }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Market Overview</h2>
        <div className="flex space-x-2">
          {['All', 'Favorites', 'Layer 1', 'DeFi', 'NFT'].map((tab) => (
            <button key={tab} className="px-4 py-2 text-sm font-medium rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1e2329] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-sm uppercase font-semibold">
              <th className="px-6 py-5">Asset</th>
              <th className="px-6 py-5 text-right">Price</th>
              <th className="px-6 py-5 text-right">24h Change</th>
              <th className="px-6 py-5 text-right hidden md:table-cell">Market Cap</th>
              <th className="px-6 py-5 text-center hidden lg:table-cell">Chart</th>
              <th className="px-6 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {coins.map((coin) => (
              <tr key={coin.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                      {coin.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white">{coin.name}</div>
                      <div className="text-xs text-gray-500">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="font-bold font-mono">${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={`flex items-center justify-end font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.change24h >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                    {Math.abs(coin.change24h).toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-gray-400 hidden md:table-cell font-mono">
                  ${coin.marketCap}
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="h-10 w-32 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={coin.sparkline.map((v, i) => ({ v, i }))}>
                        <Line 
                          type="monotone" 
                          dataKey="v" 
                          stroke={coin.change24h >= 0 ? '#4ade80' : '#f87171'} 
                          strokeWidth={2} 
                          dot={false} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Markets;
