
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Wallet, 
  BarChart3, 
  LayoutDashboard, 
  MessageSquare, 
  Search,
  Menu,
  ShieldCheck,
  ShieldAlert,
  Newspaper,
  Users,
  RefreshCw,
  Activity,
  SendHorizontal,
  WifiOff,
  Globe,
  LogOut,
  ChevronDown
} from 'lucide-react';

import { Coin, PortfolioAsset, Trade } from './types';
import { INITIAL_COINS } from './constants';
import Dashboard from './components/Dashboard';
import Markets from './components/Markets';
import Trading from './components/Trading';
import Portfolio from './components/Portfolio';
import AIConsultant from './components/AIConsultant';
import KYC from './components/KYC';
import Blog from './components/Blog';
import P2PArea from './components/P2PArea';
import Transfer from './components/Transfer';
import NetworkExplorer from './components/NetworkExplorer';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';

const SidebarLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
      : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [coins, setCoins] = useState<Coin[]>(INITIAL_COINS);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([
    { coinId: 'bitcoin', amount: 0.25, avgPrice: 58000 },
    { coinId: 'ethereum', amount: 4.5, avgPrice: 3200 },
  ]);
  const [balance, setBalance] = useState(15000.00); 
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const fetchPrices = useCallback(async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const ids = INITIAL_COINS.map(c => c.id).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCoins(prevCoins => {
          return prevCoins.map(coin => {
            const apiData = data.find((d: any) => d.id === coin.id);
            if (apiData) {
              const newPrice = apiData.current_price;
              const newSparkline = [...coin.sparkline.slice(1), newPrice];
              return {
                ...coin,
                price: newPrice,
                change24h: apiData.price_change_percentage_24h || 0,
                marketCap: formatCompact(apiData.market_cap),
                volume24h: formatCompact(apiData.total_volume),
                sparkline: newSparkline
              };
            }
            return coin;
          });
        });
        setLastUpdated(new Date());
      }
    } catch (error) {
      setFetchError(true);
      setCoins(prevCoins => prevCoins.map(coin => ({
        ...coin,
        price: coin.price * (1 + (Math.random() * 0.001 - 0.0005)),
      })));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatCompact = (val: number) => {
    if (!val) return '0';
    if (val >= 1e12) return (val / 1e12).toFixed(1) + 'T';
    if (val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
    return val.toLocaleString();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPrices();
      const interval = setInterval(fetchPrices, 300000);
      return () => clearInterval(interval);
    }
  }, [fetchPrices, isAuthenticated]);

  const handleLogin = (name: string, email: string) => {
    setCurrentUser({ name, email });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowProfileMenu(false);
  };

  const handleTrade = (trade: Omit<Trade, 'id' | 'timestamp'>) => {
    if (!isVerified) return;
    const newTrade: Trade = {
      ...trade,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setTrades(prev => [newTrade, ...prev]);
    const cost = trade.amount * trade.price;
    if (trade.type === 'BUY') {
      setBalance(prev => prev - cost);
      setPortfolio(prev => {
        const existing = prev.find(p => p.coinId === trade.coinId);
        if (existing) {
          return prev.map(p => p.coinId === trade.coinId ? {
            ...p,
            amount: p.amount + trade.amount,
            avgPrice: (p.avgPrice * p.amount + trade.price * trade.amount) / (p.amount + trade.amount)
          } : p);
        }
        return [...prev, { coinId: trade.coinId, amount: trade.amount, avgPrice: trade.price }];
      });
    } else {
      setBalance(prev => prev + cost);
      setPortfolio(prev => prev.map(p => p.coinId === trade.coinId ? {
        ...p,
        amount: p.amount - trade.amount,
      } : p).filter(p => p.amount > 0));
    }
  };

  const handleTransfer = (assetId: string, amount: number) => {
    setPortfolio(prev => prev.map(p => p.coinId === assetId ? {
      ...p,
      amount: p.amount - amount
    } : p).filter(p => p.amount > 0));
    const coin = coins.find(c => c.id === assetId);
    if (coin) {
      setTrades(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        coinId: assetId,
        type: 'SELL',
        amount: amount,
        price: coin.price,
        timestamp: Date.now()
      }, ...prev]);
    }
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-[#0b0e11] text-[#eaecef] overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} border-r border-gray-800 transition-all duration-300 hidden md:flex flex-col bg-[#0b0e11] z-20`}>
          <div className="p-6 mb-6">
            <div className="flex items-center space-x-3 text-blue-500">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl italic">N</div>
              {isSidebarOpen && <span className="text-xl font-bold tracking-tight text-white">NEXUS</span>}
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" active={window.location.hash === '#/'} />
            <SidebarLink to="/markets" icon={TrendingUp} label="Markets" active={window.location.hash === '#/markets'} />
            <SidebarLink to="/trade" icon={BarChart3} label="Trade" active={window.location.hash === '#/trade'} />
            <SidebarLink to="/network" icon={Globe} label="Network" active={window.location.hash === '#/network'} />
            <SidebarLink to="/transfer" icon={SendHorizontal} label="Transfer" active={window.location.hash === '#/transfer'} />
            <SidebarLink to="/p2p" icon={Users} label="P2P Area" active={window.location.hash === '#/p2p'} />
            <SidebarLink to="/portfolio" icon={Wallet} label="Portfolio" active={window.location.hash === '#/portfolio'} />
            <SidebarLink to="/blog" icon={Newspaper} label="Finance Blog" active={window.location.hash === '#/blog'} />
            <SidebarLink to="/ai" icon={MessageSquare} label="AI Insights" active={window.location.hash === '#/ai'} />
            <SidebarLink to="/kyc" icon={ShieldCheck} label="Verification" active={window.location.hash === '#/kyc'} />
          </nav>
          <div className="p-4 border-t border-gray-800">
            <div className="bg-gray-800/50 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1">Total Balance</div>
              <div className="text-lg font-bold text-white">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto relative">
          <header className="sticky top-0 z-10 bg-[#0b0e11]/80 backdrop-blur-md border-b border-gray-800 p-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center md:hidden">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold mr-3">N</div>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu size={24} /></button>
            </div>
            <div className="hidden md:flex items-center bg-gray-800/50 rounded-full px-4 py-2 w-96">
              <Search size={18} className="text-gray-500 mr-2" />
              <input type="text" placeholder="Search assets, news, or network data..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-4 border-r border-gray-800 pr-6">
                 <div className="flex items-center space-x-2">
                    <div className="relative">
                       {fetchError ? <WifiOff size={16} className="text-red-500" /> : <Activity size={16} className={`${isLoading ? 'text-blue-500 animate-spin' : 'text-green-500'}`} />}
                       {!isLoading && !fetchError && <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                       {fetchError ? 'Sync Error' : 'Market Live'}
                       <div className="font-mono text-[9px] lowercase opacity-50">
                         {fetchError ? 'reconnecting...' : `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                       </div>
                    </div>
                 </div>
              </div>
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors" onClick={fetchPrices}><RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} /></button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 pl-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold">
                    {currentUser?.name.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium flex items-center">
                      {currentUser?.name || 'User'}
                      <ChevronDown size={14} className={`ml-1 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </div>
                    {isVerified ? (
                      <div className="text-[10px] text-green-400 flex items-center font-bold uppercase tracking-widest"><ShieldCheck size={10} className="mr-1" /> Verified</div>
                    ) : (
                      <div className="text-[10px] text-yellow-500 flex items-center font-bold uppercase tracking-widest"><ShieldAlert size={10} className="mr-1" /> Unverified</div>
                    )}
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#1e2329] border border-gray-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-800 mb-2">
                      <div className="text-xs text-gray-500 mb-1">Signed in as</div>
                      <div className="text-sm font-bold truncate">{currentUser?.email}</div>
                    </div>
                    <Link to="/kyc" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5" onClick={() => setShowProfileMenu(false)}>
                      <ShieldCheck size={16} /> <span>Account Security</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <LogOut size={16} /> <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard coins={coins} portfolio={portfolio} balance={balance} trades={trades} isVerified={isVerified} />} />
              <Route path="/markets" element={<Markets coins={coins} />} />
              <Route path="/trade" element={<Trading coins={coins} onTrade={handleTrade} balance={balance} portfolio={portfolio} isVerified={isVerified} />} />
              <Route path="/network" element={<NetworkExplorer coins={coins} />} />
              <Route path="/transfer" element={<Transfer coins={coins} portfolio={portfolio} isVerified={isVerified} onTransfer={handleTransfer} />} />
              <Route path="/p2p" element={<P2PArea isVerified={isVerified} />} />
              <Route path="/portfolio" element={<Portfolio coins={coins} portfolio={portfolio} balance={balance} trades={trades} />} />
              <Route path="/ai" element={<AIConsultant coins={coins} />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/kyc" element={<KYC onVerify={() => setIsVerified(true)} isVerified={isVerified} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
