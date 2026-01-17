
import React, { useState, useMemo } from 'react';
import { 
  SendHorizontal, 
  QrCode, 
  User, 
  Wallet, 
  ArrowRight, 
  Scan, 
  Copy, 
  CheckCircle2, 
  Lock, 
  AlertCircle,
  ChevronDown,
  Info,
  X,
  ShieldCheck,
  RefreshCw,
  Search
} from 'lucide-react';
import { Coin, PortfolioAsset } from '../types';
import { Link } from 'react-router-dom';

interface TransferProps {
  coins: Coin[];
  portfolio: PortfolioAsset[];
  isVerified: boolean;
  onTransfer: (assetId: string, amount: number) => void;
}

const Transfer: React.FC<TransferProps> = ({ coins, portfolio, isVerified, onTransfer }) => {
  const [activeTab, setActiveTab] = useState<'SEND' | 'RECEIVE'>('SEND');
  const [sendMethod, setSendMethod] = useState<'ADDRESS' | 'NEXUS'>('ADDRESS');
  const [selectedAssetId, setSelectedAssetId] = useState(portfolio[0]?.coinId || 'bitcoin');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  const selectedAsset = portfolio.find(p => p.coinId === selectedAssetId);
  const coinInfo = coins.find(c => c.id === selectedAssetId);

  // Realistic address generation based on coin type
  const myAddresses = useMemo(() => ({
    bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ethereum: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    solana: "H7pS6X9k7xVjXyP9q5N3A2W1E0F8G7H6J5K4L3M2N1",
    cardano: "addr1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh987654321",
    polkadot: "15oF4uH3YS6ykV6WzHSAfVzHSAfVzHSAfVzHSAfVzHSAf",
    nexus: "nx1p7z0w8e9r4t2y5u3i6o1p9a8s7d6f5g4h3j2k1l0m9n8b7v6c5x4z"
  }), []);

  const currentReceiveAddress = (myAddresses as any)[selectedAssetId] || myAddresses.nexus;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleSend = () => {
    if (!isVerified) return;
    setIsConfirming(true);
  };

  const confirmTransfer = () => {
    onTransfer(selectedAssetId, parseFloat(amount));
    setIsConfirming(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setAmount('');
      setRecipient('');
    }, 3000);
  };

  if (!isVerified) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-in fade-in duration-500">
        <div className="bg-[#1e2329] p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
          <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Transfer Access Restricted</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Identity verification is required to send or receive digital assets on the Nexus network for security and regulatory compliance.
          </p>
          <Link to="/kyc" className="w-full inline-block py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20">
            Complete Verification
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex bg-[#1e2329] p-1.5 rounded-3xl mb-8 border border-gray-800 w-fit mx-auto">
        <button 
          onClick={() => setActiveTab('SEND')}
          className={`px-10 py-3 rounded-2xl font-bold transition-all ${activeTab === 'SEND' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
        >
          Send Crypto
        </button>
        <button 
          onClick={() => setActiveTab('RECEIVE')}
          className={`px-10 py-3 rounded-2xl font-bold transition-all ${activeTab === 'RECEIVE' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
        >
          Receive
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Panel: Form */}
        <div className="bg-[#1e2329] p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl space-y-8 relative overflow-hidden">
          {isSuccess && (
            <div className="absolute inset-0 bg-green-500/90 backdrop-blur-md z-30 flex flex-col items-center justify-center text-white p-8 text-center animate-in zoom-in">
              <CheckCircle2 size={80} className="mb-6 animate-bounce" />
              <h3 className="text-3xl font-bold mb-2">Transfer Successful</h3>
              <p className="opacity-90">Your assets have been broadcasted to the network.</p>
            </div>
          )}

          {activeTab === 'SEND' ? (
            <>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setSendMethod('ADDRESS')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${sendMethod === 'ADDRESS' ? 'bg-blue-600/10 border-blue-600 text-blue-400' : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-white'}`}
                >
                  External Address
                </button>
                <button 
                  onClick={() => setSendMethod('NEXUS')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${sendMethod === 'NEXUS' ? 'bg-blue-600/10 border-blue-600 text-blue-400' : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-white'}`}
                >
                  Internal (Nexus ID)
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Select Asset</label>
                  <div className="relative">
                    <select 
                      value={selectedAssetId}
                      onChange={(e) => setSelectedAssetId(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 px-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
                    >
                      {portfolio.map(p => (
                        <option key={p.coinId} value={p.coinId}>
                          {coins.find(c => c.id === p.coinId)?.symbol} - {p.amount.toFixed(4)} Available
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Recipient</label>
                    {sendMethod === 'ADDRESS' && (
                      <button 
                        onClick={() => setShowScanner(true)}
                        className="text-blue-500 hover:text-blue-400 flex items-center text-[10px] font-bold uppercase"
                      >
                        <Scan size={14} className="mr-1" /> Scan QR
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder={sendMethod === 'ADDRESS' ? "0x... / bc1... / nx1..." : "Nexus Username or ID"}
                      className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {sendMethod === 'ADDRESS' ? <Wallet size={18} className="text-gray-500" /> : <User size={18} className="text-gray-500" />}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Amount</label>
                    <button 
                      onClick={() => setAmount((selectedAsset?.amount || 0).toString())}
                      className="text-blue-500 text-[10px] font-bold uppercase hover:underline"
                    >
                      Max: {selectedAsset?.amount.toFixed(4)}
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">{coinInfo?.symbol}</span>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-3xl space-y-3 border border-gray-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Network Fee</span>
                    <span className="text-green-400 font-bold">{sendMethod === 'NEXUS' ? '0.00 (Instant)' : 'Calculating...'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Processing Time</span>
                    <span className="text-white font-bold">{sendMethod === 'NEXUS' ? 'Real-time' : '~10-30 Mins'}</span>
                  </div>
                </div>

                <button 
                  onClick={handleSend}
                  disabled={!amount || parseFloat(amount) <= 0 || !recipient}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <SendHorizontal size={20} />
                  <span>Send Assets</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-8 text-center animate-in fade-in">
              <div className="relative inline-block p-4 bg-white rounded-3xl shadow-2xl mx-auto">
                <QrCode size={180} className="text-black" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl italic">N</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-4">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{coinInfo?.name} Address</span>
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[9px] font-bold uppercase">{sendMethod === 'NEXUS' ? 'Internal' : 'Mainnet'}</span>
                   </div>
                   <div className="flex items-start space-x-4 bg-black/30 p-4 rounded-2xl border border-gray-800 group relative">
                      <div className="flex-1 min-w-0">
                         <div className="text-xs font-mono text-white break-all leading-relaxed text-left">
                            {currentReceiveAddress}
                         </div>
                      </div>
                      <button 
                        onClick={() => handleCopy(currentReceiveAddress)}
                        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all shrink-0"
                      >
                        {copyStatus ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} className="text-blue-500" />}
                      </button>
                      {copyStatus && <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-in slide-in-from-bottom-2">Copied!</div>}
                   </div>
                   <p className="text-[10px] text-gray-500 text-left flex items-start space-x-2">
                     <AlertCircle size={12} className="shrink-0 mt-0.5" />
                     <span>Sending any other asset to this address may result in permanent loss. Ensure you use the correct network.</span>
                   </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/30 rounded-2xl border border-gray-800">
                  <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold">In-Network Fee</div>
                  <div className="text-xs font-bold text-green-400">0.00%</div>
                </div>
                <div className="p-4 bg-gray-900/30 rounded-2xl border border-gray-800">
                  <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold">Confirmation</div>
                  <div className="text-xs font-bold text-white">INSTANT</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Information / Scanner UI */}
        <div className="space-y-8">
          {showScanner ? (
            <div className="bg-black rounded-[2.5rem] border-4 border-blue-600 aspect-square flex items-center justify-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 blur-[2px] animate-scan-line"></div>
               <div className="text-center text-white/50 space-y-4">
                 <Scan size={64} className="mx-auto opacity-20 animate-pulse" />
                 <p className="text-xs font-bold uppercase tracking-widest">Scanning Network...</p>
                 <button 
                  onClick={() => setShowScanner(false)}
                  className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full text-xs font-bold transition-all"
                 >
                   Cancel
                 </button>
               </div>
               <style>{`
                  @keyframes scan-line {
                    0% { top: 0% }
                    100% { top: 100% }
                  }
                  .animate-scan-line {
                    animation: scan-line 2s infinite linear;
                  }
               `}</style>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden h-full border border-gray-800">
              <div className="relative z-10 space-y-8">
                <div>
                   <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                      <ShieldCheck size={28} />
                   </div>
                  <h3 className="text-3xl font-bold mb-4">Secured Infrastructure</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    Nexus utilizes Multi-Party Computation (MPC) to generate and secure your private keys. Your addresses are rotated automatically to preserve privacy.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                      <Lock size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Enterprise-Grade Custody</h4>
                      <p className="text-[11px] text-gray-500 mt-1">Institutional security for every retail wallet.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                      <RefreshCw size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Real-time Validation</h4>
                      <p className="text-[11px] text-gray-500 mt-1">Transaction screening for AML and risk mitigation.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10">
                  <div className="p-6 bg-blue-600/5 rounded-3xl border border-blue-600/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Info size={18} className="text-blue-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Security Note</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed italic">
                      "Always verify the recipient's address checksum before confirming. Nexus will automatically highlight valid Nexus Internal IDs."
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <Search size={120} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirming && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0b0e11]/95 backdrop-blur-md" onClick={() => setIsConfirming(false)}></div>
          <div className="relative bg-[#1e2329] border border-gray-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Verify Assets</h3>
                <button onClick={() => setIsConfirming(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
             </div>
             <div className="space-y-6">
                <div className="text-center">
                   <div className="text-gray-500 text-xs font-bold uppercase mb-2">Transferring</div>
                   <div className="text-4xl font-bold text-white font-mono">{amount} {coinInfo?.symbol}</div>
                   <div className="text-xs text-gray-400 mt-1">Current Value: ${(parseFloat(amount) * (coinInfo?.price || 0)).toLocaleString()}</div>
                </div>
                <div className="bg-gray-900/80 p-6 rounded-3xl border border-gray-800 space-y-4">
                   <div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Recipient Address</div>
                      <div className="text-xs font-mono break-all text-white bg-black/30 p-3 rounded-xl border border-gray-800">{recipient}</div>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 uppercase font-bold tracking-widest">Network</span>
                      <span className="font-bold text-blue-400">{sendMethod === 'NEXUS' ? 'Nexus Internal' : 'Blockchain Mainnet'}</span>
                   </div>
                </div>
                <div className="flex items-start space-x-3 text-red-400 bg-red-400/5 p-4 rounded-2xl border border-red-400/20">
                   <AlertCircle size={18} className="shrink-0" />
                   <p className="text-[10px] font-medium leading-relaxed uppercase tracking-wider">Blockchain transactions are final. Ensure the address and network are correct.</p>
                </div>
                <button 
                  onClick={confirmTransfer}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/30"
                >
                  Authorize Transfer
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer;
