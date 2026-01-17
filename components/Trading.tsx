
import React, { useState } from 'react';
import { Coin, PortfolioAsset, Trade } from '../types';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Wallet, Lock, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TradingProps {
  coins: Coin[];
  balance: number;
  portfolio: PortfolioAsset[];
  onTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  isVerified: boolean;
}

const Trading: React.FC<TradingProps> = ({ coins, balance, portfolio, onTrade, isVerified }) => {
  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [amount, setAmount] = useState('');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');

  const assetInPortfolio = portfolio.find(p => p.coinId === selectedCoin.id);
  const maxBuy = balance / selectedCoin.price;
  const maxSell = assetInPortfolio?.amount || 0;

  const handleExecuteTrade = () => {
    if (!isVerified) return;
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      if (tradeType === 'BUY' && numAmount <= maxBuy) {
        onTrade({ coinId: selectedCoin.id, type: 'BUY', amount: numAmount, price: selectedCoin.price });
        setAmount('');
      } else if (tradeType === 'SELL' && numAmount <= maxSell) {
        onTrade({ coinId: selectedCoin.id, type: 'SELL', amount: numAmount, price: selectedCoin.price });
        setAmount('');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-700 relative">
      {!isVerified && (
        <div className="absolute inset-0 z-50 bg-[#0b0e11]/40 backdrop-blur-[2px] rounded-[2.5rem] flex items-center justify-center p-6">
          <div className="bg-[#1e2329] border border-gray-800 p-8 rounded-3xl shadow-2xl max-w-md text-center">
            <div className="w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Trading Restricted</h3>
            <p className="text-gray-400 mb-6 text-sm">To start trading real assets, you must first complete your identity verification (KYC).</p>
            <Link 
              to="/kyc" 
              className="w-full inline-block py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              Start KYC Verification
            </Link>
          </div>
        </div>
      )}

      {/* Chart and Market Data */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-[#1e2329] p-6 rounded-3xl border border-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <select 
                value={selectedCoin.id}
                onChange={(e) => setSelectedCoin(coins.find(c => c.id === e.target.value) || coins[0])}
                className="bg-gray-800 text-white font-bold px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {coins.map(c => <option key={c.id} value={c.id}>{c.symbol}/USD</option>)}
              </select>
              <div>
                <div className="text-2xl font-bold font-mono">${selectedCoin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className={`text-sm font-medium ${selectedCoin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedCoin.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="flex space-x-8">
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">High 24h</div>
                <div className="text-sm font-bold font-mono">${(selectedCoin.price * 1.05).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Low 24h</div>
                <div className="text-sm font-bold font-mono">${(selectedCoin.price * 0.95).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Vol 24h</div>
                <div className="text-sm font-bold font-mono">{selectedCoin.volume24h}</div>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full bg-gray-900/50 rounded-2xl flex items-center justify-center border border-dashed border-gray-700">
             <div className="text-center text-gray-500">
               <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
               <p className="text-sm font-medium">Interactive Advanced Trading Chart</p>
               <p className="text-xs text-gray-600">Simulated Real-time Depth View</p>
             </div>
          </div>
        </div>

        {/* Order Book Placeholder */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#1e2329] p-6 rounded-3xl border border-gray-800">
            <h4 className="text-sm font-bold uppercase text-gray-500 mb-4 tracking-widest">Order Book (Bids)</h4>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between text-xs font-mono">
                  <span className="text-green-400">${(selectedCoin.price * (1 - 0.001 * (i + 1))).toLocaleString()}</span>
                  <span className="text-gray-400">{(Math.random() * 5).toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1e2329] p-6 rounded-3xl border border-gray-800">
            <h4 className="text-sm font-bold uppercase text-gray-500 mb-4 tracking-widest">Order Book (Asks)</h4>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between text-xs font-mono">
                  <span className="text-red-400">${(selectedCoin.price * (1 + 0.001 * (i + 1))).toLocaleString()}</span>
                  <span className="text-gray-400">{(Math.random() * 5).toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trade Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#1e2329] p-6 rounded-3xl border border-gray-800 shadow-2xl sticky top-24">
          <div className="flex rounded-2xl bg-gray-900 p-1 mb-6">
            <button 
              onClick={() => setTradeType('BUY')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tradeType === 'BUY' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Buy
            </button>
            <button 
              onClick={() => setTradeType('SELL')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tradeType === 'SELL' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Sell
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-2 font-bold uppercase">
                <span>Amount</span>
                <span className="flex items-center"><Wallet size={12} className="mr-1"/> {tradeType === 'BUY' ? `$${balance.toLocaleString()}` : `${assetInPortfolio?.amount || 0} ${selectedCoin.symbol}`}</span>
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-900 border border-gray-700 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">{selectedCoin.symbol}</span>
              </div>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price</span>
                <span className="font-mono text-white">${selectedCoin.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated Total</span>
                <span className="font-mono text-white">${(parseFloat(amount || '0') * selectedCoin.price).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fee (0.1%)</span>
                <span className="font-mono text-white">${(parseFloat(amount || '0') * selectedCoin.price * 0.001).toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleExecuteTrade}
              disabled={!isVerified || !amount || parseFloat(amount) <= 0}
              className={`w-full py-4 rounded-2xl text-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                tradeType === 'BUY' 
                ? 'bg-green-600 hover:bg-green-500 shadow-xl shadow-green-900/20' 
                : 'bg-red-600 hover:bg-red-500 shadow-xl shadow-red-900/20'
              }`}
            >
              {tradeType} {selectedCoin.symbol}
            </button>

            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map(pct => (
                <button 
                  key={pct}
                  onClick={() => {
                    const maxVal = tradeType === 'BUY' ? maxBuy : maxSell;
                    setAmount((maxVal * (pct / 100)).toFixed(4));
                  }}
                  className="py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-bold text-gray-400 transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
