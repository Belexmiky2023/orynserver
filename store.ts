
import { User, Editor, Transaction, Rating, AuditEntry } from './types';

const STORAGE_KEYS = {
  USERS: 'oryn_users',
  EDITORS: 'oryn_editors',
  TRANSACTIONS: 'oryn_transactions',
  RATINGS: 'oryn_ratings',
  VOTES: 'oryn_votes_map',
  AUDIT: 'oryn_security_audit'
};

// Initial Data
const DEFAULT_EDITORS: Editor[] = [
  { id: '1', name: 'Zenix FX', thumbnail: 'https://picsum.photos/seed/editor1/600/400', votes: 124, videoUrl: '#' },
  { id: '2', name: 'Motion King', thumbnail: 'https://picsum.photos/seed/editor2/600/400', votes: 89, videoUrl: '#' },
  { id: '3', name: 'Nova Edits', thumbnail: 'https://picsum.photos/seed/editor3/600/400', votes: 256, videoUrl: '#' },
  { id: '4', name: 'Vortex VFX', thumbnail: 'https://picsum.photos/seed/editor4/600/400', votes: 167, videoUrl: '#' },
];

export const getStoredUsers = (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
export const saveUser = (user: User) => {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) users[index] = user;
  else users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getStoredEditors = (): Editor[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EDITORS);
  return data ? JSON.parse(data) : DEFAULT_EDITORS;
};

export const saveEditors = (editors: Editor[], admin?: User, actionDetail?: string) => {
  localStorage.setItem(STORAGE_KEYS.EDITORS, JSON.stringify(editors));
  if (admin && actionDetail) {
    logSecurityAction(admin, actionDetail, 'Editors Table');
  }
};

export const logSecurityAction = (admin: User, action: string, target: string) => {
  const logs = getAuditLogs();
  const entry: AuditEntry = {
    id: Math.random().toString(36).substr(2, 9),
    adminId: admin.id,
    adminName: admin.name,
    action,
    target,
    timestamp: Date.now()
  };
  logs.unshift(entry);
  localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs.slice(0, 100))); // Keep last 100
};

export const getAuditLogs = (): AuditEntry[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT) || '[]');

export const getStoredTransactions = (): Transaction[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
export const saveTransaction = (tx: Transaction) => {
  const txs = getStoredTransactions();
  txs.push(tx);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
};

export const getStoredRatings = (): Rating[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || '[]');
export const saveRating = (rating: Rating) => {
  const rs = getStoredRatings();
  rs.push(rating);
  localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(rs));
};

export const getVoteMap = (): Record<string, string> => JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '{}');
export const castVote = (userId: string, editorId: string) => {
  const votes = getVoteMap();
  if (votes[userId]) return false;
  votes[userId] = editorId;
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
  
  const editors = getStoredEditors();
  const index = editors.findIndex(e => e.id === editorId);
  if (index >= 0) {
    editors[index].votes += 1;
    saveEditors(editors);
  }
  return true;
};
