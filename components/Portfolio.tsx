
import React from 'react';
import { Coin, PortfolioAsset, Trade } from '../types';
import { Wallet, PieChart, Clock, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface PortfolioProps {
  coins: Coin[];
  portfolio: PortfolioAsset[];
  balance: number;
  trades: Trade[];
}

const Portfolio: React.FC<PortfolioProps> = ({ coins, portfolio, balance, trades }) => {
  const assets = portfolio.map(asset => {
    const coin = coins.find(c => c.id === asset.coinId);
    if (!coin) return null;
    const currentVal = asset.amount * coin.price;
    const profit = currentVal - (asset.amount * asset.avgPrice);
    const profitPct = (profit / (asset.amount * asset.avgPrice)) * 100;
    return { ...asset, coin, currentVal, profit, profitPct };
  }).filter(Boolean);

  const totalPortfolioValue = assets.reduce((acc, a) => acc + (a?.currentVal || 0), 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-top duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-blue-100/70 mb-2">
              <Wallet size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Total Portfolio Balance</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">${(totalPortfolioValue + balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl">
                <div className="text-xs text-blue-100/70 mb-1">Portfolio Assets</div>
                <div className="text-lg font-bold">${totalPortfolioValue.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <div className="text-xs text-blue-100/70 mb-1">Available USD</div>
                <div className="text-lg font-bold">${balance.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full md:w-80 bg-[#1e2329] p-8 rounded-[2.5rem] border border-gray-800 flex flex-col items-center justify-center">
          <PieChart size={48} className="text-blue-500 mb-4 opacity-50" />
          <h3 className="font-bold text-center">Asset Allocation</h3>
          <p className="text-sm text-gray-500 text-center mt-2">Diversify your portfolio across different assets to manage risk effectively.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#1e2329] p-8 rounded-3xl border border-gray-800">
          <h3 className="text-xl font-bold mb-6">My Assets</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-500 text-xs uppercase font-bold text-left border-b border-gray-800">
                  <th className="pb-4">Asset</th>
                  <th className="pb-4 text-right">Amount</th>
                  <th className="pb-4 text-right">Avg. Price</th>
                  <th className="pb-4 text-right">Current Value</th>
                  <th className="pb-4 text-right">Profit/Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {assets.map((asset: any) => (
                  <tr key={asset.coin.id} className="group">
                    <td className="py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">{asset.coin.symbol[0]}</div>
                        <div>
                          <div className="font-bold">{asset.coin.name}</div>
                          <div className="text-xs text-gray-500">{asset.coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-right font-mono font-bold">{asset.amount.toLocaleString()}</td>
                    <td className="py-5 text-right font-mono text-gray-400">${asset.avgPrice.toLocaleString()}</td>
                    <td className="py-5 text-right font-mono font-bold">${asset.currentVal.toLocaleString()}</td>
                    <td className="py-5 text-right">
                      <div className={`font-mono font-bold ${asset.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.profit >= 0 ? '+' : '-'}${Math.abs(asset.profit).toLocaleString()}
                        <div className="text-[10px]">{asset.profitPct.toFixed(2)}%</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#1e2329] p-8 rounded-3xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent History</h3>
            <Clock size={18} className="text-gray-500" />
          </div>
          <div className="space-y-4">
            {trades.length === 0 ? (
              <div className="text-center py-8 text-gray-500 italic text-sm">No trades yet</div>
            ) : (
              trades.map((trade) => {
                const coin = coins.find(c => c.id === trade.coinId);
                return (
                  <div key={trade.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${trade.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {trade.type === 'BUY' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{trade.type} {coin?.symbol}</div>
                        <div className="text-[10px] text-gray-500">{new Date(trade.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">${(trade.amount * trade.price).toLocaleString()}</div>
                      <div className="text-[10px] text-gray-400">{trade.amount} @ ${trade.price.toLocaleString()}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
