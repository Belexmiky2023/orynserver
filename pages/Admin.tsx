
import React, { useState, useEffect } from 'react';
import { Editor, User, Transaction, Rating } from '../types';
import { getStoredEditors, getStoredUsers, getStoredTransactions, getStoredRatings, saveEditors } from '../store';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editors' | 'users' | 'transactions' | 'ratings'>('editors');
  const [editors, setEditors] = useState<Editor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [newEditorName, setNewEditorName] = useState('');

  useEffect(() => {
    setEditors(getStoredEditors());
    setUsers(getStoredUsers());
    setTransactions(getStoredTransactions());
    setRatings(getStoredRatings());
  }, []);

  const addEditor = () => {
    if (!newEditorName) return;
    const newEditor: Editor = {
      id: Math.random().toString(36).substr(2, 9),
      name: newEditorName,
      thumbnail: `https://picsum.photos/seed/${newEditorName}/600/400`,
      votes: 0,
      videoUrl: '#'
    };
    const updated = [...editors, newEditor];
    setEditors(updated);
    saveEditors(updated);
    setNewEditorName('');
  };

  const removeEditor = (id: string) => {
    const updated = editors.filter(e => e.id !== id);
    setEditors(updated);
    saveEditors(updated);
  };

  const adjustVotes = (id: string, amount: number) => {
    const updated = editors.map(e => {
      if (e.id === id) return { ...e, votes: Math.max(0, e.votes + amount) };
      return e;
    });
    setEditors(updated);
    saveEditors(updated);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'editors':
        return (
          <div className="space-y-6">
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="New Editor Name" 
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none"
                value={newEditorName}
                onChange={(e) => setNewEditorName(e.target.value)}
              />
              <button 
                onClick={addEditor}
                className="bg-[#00FF41] text-black px-6 py-2 rounded-lg font-bold"
              >
                ADD EDITOR
              </button>
            </div>
            <div className="grid gap-4">
              {editors.map(e => (
                <div key={e.id} className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">{e.name}</h4>
                    <p className="text-xs text-white/40">ID: {e.id} | Votes: <span className="text-[#00FF41] font-bold">{e.votes}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => adjustVotes(e.id, 10)} className="bg-[#00FF41]/10 text-[#00FF41] px-3 py-1 rounded text-xs font-bold">+10</button>
                    <button onClick={() => adjustVotes(e.id, -10)} className="bg-white/5 text-white/50 px-3 py-1 rounded text-xs font-bold">-10</button>
                    <button onClick={() => removeEditor(e.id)} className="bg-red-500/10 text-red-500 px-3 py-1 rounded text-xs font-bold">REMOVE</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="grid gap-4">
             <div className="flex items-center justify-between px-4 text-xs font-bold text-white/30 uppercase tracking-widest">
                <span>User</span>
                <span>Last Login</span>
             </div>
             {users.map(u => (
               <div key={u.id} className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={u.picture} className="w-8 h-8 rounded-full" alt="" />
                    <div>
                      <p className="font-bold text-sm">{u.name}</p>
                      <p className="text-[10px] text-white/40">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/40">{new Date(u.loginTime).toLocaleString()}</span>
               </div>
             ))}
          </div>
        );
      case 'transactions':
        return (
          <div className="space-y-4">
             {transactions.length === 0 && <p className="text-center text-white/30 py-10 italic">No transactions recorded.</p>}
             {transactions.map(tx => (
                <div key={tx.id} className="glass-panel p-4 rounded-xl border border-white/10">
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[#00FF41] font-orbitron font-bold text-sm tracking-widest">+{tx.votes} VOTES</span>
                      <span className="text-[10px] text-white/40">{new Date(tx.timestamp).toLocaleString()}</span>
                   </div>
                   <p className="text-sm font-bold">{tx.userName} purchased for {tx.stars} STARS</p>
                   <p className="text-[10px] text-white/30 mt-1">TXID: {tx.id}</p>
                </div>
             ))}
          </div>
        );
      case 'ratings':
        return (
          <div className="space-y-4">
             {ratings.length === 0 && <p className="text-center text-white/30 py-10 italic">No ratings yet.</p>}
             {ratings.map((r, i) => (
               <div key={i} className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">{r.userName}</p>
                    <p className="text-[10px] text-white/40">{new Date(r.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`w-2 h-2 rounded-full ${s <= r.stars ? 'bg-[#00FF41]' : 'bg-white/10'}`}></span>
                    ))}
                    <span className="ml-2 font-black text-[#00FF41]">{r.stars}</span>
                  </div>
               </div>
             ))}
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center gap-4 mb-8">
         <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
         </div>
         <div>
            <h1 className="font-orbitron text-3xl font-black">ADMIN <span className="text-red-500">CENTRAL</span></h1>
            <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase">Security Level: Maximum</p>
         </div>
      </div>

      <div className="flex border-b border-white/10 font-orbitron text-xs font-black tracking-widest overflow-x-auto">
        {[
          { id: 'editors', label: 'MANAGEMENT' },
          { id: 'users', label: 'USER LOG' },
          { id: 'transactions', label: 'GIFT VOTES' },
          { id: 'ratings', label: 'FEEDBACK' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 transition-all border-b-2 ${
              activeTab === tab.id ? 'border-[#00FF41] text-[#00FF41]' : 'border-transparent text-white/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;
