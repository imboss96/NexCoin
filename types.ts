
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
  sparkline: number[];
}

export interface PortfolioAsset {
  coinId: string;
  amount: number;
  avgPrice: number;
}

export interface Trade {
  id: string;
  coinId: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  timestamp: number;
}

export interface MarketHistory {
  time: string;
  price: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  imageUrl: string;
}

export interface P2PAd {
  id: string;
  advertiser: string;
  orders: number;
  completionRate: number;
  price: number;
  currency: string;
  available: number;
  limitMin: number;
  limitMax: number;
  paymentMethods: string[];
  type: 'BUY' | 'SELL';
  asset: string;
  isVerified: boolean;
}
