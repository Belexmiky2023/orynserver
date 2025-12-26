
export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  isAdmin: boolean;
  votedFor?: string; // Editor ID
  hasRated?: boolean;
  loginTime: number;
}

export interface Editor {
  id: string;
  name: string;
  thumbnail: string;
  votes: number;
  videoUrl: string;
}

export interface GiftPackage {
  id: string;
  name: string;
  stars: number;
  votes: number;
  highlighted?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  stars: number;
  votes: number;
  timestamp: number;
  status: 'pending' | 'completed';
}

export interface Rating {
  userId: string;
  userName: string;
  stars: number;
  timestamp: number;
}

export enum Page {
  Home = 'home',
  Vote = 'vote',
  Gift = 'gift',
  RateUs = 'rate-us',
  Admin = 'admin',
  Success = 'success'
}
