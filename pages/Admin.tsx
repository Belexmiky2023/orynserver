
import React, { useState, useEffect } from 'react';
import { Editor, User, Transaction, Rating, AuditEntry } from '../types';
import { getStoredEditors, getStoredUsers, getStoredTransactions, getStoredRatings, saveEditors, getAuditLogs, logSecurityAction } from '../store';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editors' | 'users' | 'transactions' | 'ratings' | 'audit'>('editors');
  const [editors, setEditors] = useState<Editor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [newEditorName, setNewEditorName] = useState('');
  
  const currentAdmin = JSON.parse(localStorage.getItem('oryn_current_user') || '{}') as User;

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setEditors(getStoredEditors());
    setUsers(getStoredUsers());
    setTransactions(getStoredTransactions());
    setRatings(getStoredRatings());
    setAuditLogs(getAuditLogs());
  };

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
    saveEditors(updated, currentAdmin, `Added new editor: ${newEditorName}`);
    setNewEditorName('');
    refreshData();
  };

  const deleteEditor = (id: string, name: string) => {
    if (confirm(`Delete editor ${name}?`)) {
      const updated = editors.filter(e => e.id !== id);
      setEditors(updated);
      saveEditors(updated, currentAdmin, `Deleted editor: ${name}`);
      refreshData();
    }
  };

  const adjustVotes = (id: string, name: string, amount: number) => {
    const updated = editors.map(e => {
      if (e.id === id) return { ...e, votes: Math.max(0, e.votes + amount) };
      return e;
    });
    setEditors(updated);
    saveEditors(updated, currentAdmin, `Adjusted votes for ${name} by ${amount}`);
    refreshData();
  };

  const tabs = [
    { id: 'editors', label: 'EDITORS' },
    { id: 'users', label: 'USERS' },
    { id: 'transactions', label: 'GIFTS' },
    { id: 'ratings', label: 'RATINGS' },
    { id: 'audit', label: 'AUDIT LOG' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="font-orbitron text-4xl font-black neon-glow text-[#00FF41]">ADMIN CENTER</h1>
          <p className="text-white/40 font-bold tracking-widest text-xs uppercase mt-2">Secure Tournament Management Protocol</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-[10px] font-orbitron font-bold transition-all ${
                activeTab === tab.id ? 'bg-[#00FF41] text-black shadow-[0_0_15px_#00FF41]' : 'text-white/50 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        {activeTab === 'editors' && (
          <div className="p-8 space-y-8">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="New Editor Name..."
                value={newEditorName}
                onChange={(e) => setNewEditorName(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF41]"
              />
              <button 
                onClick={addEditor}
                className="bg-[#00FF41] text-black font-orbitron font-black px-6 rounded-xl hover:scale-105 transition-all"
              >
                + ADD EDITOR
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-white/30 text-[10px] font-orbitron tracking-widest">
                    <th className="pb-4">EDITOR</th>
                    <th className="pb-4">VOTES</th>
                    <th className="pb-4">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {editors.map(editor => (
                    <tr key={editor.id} className="group hover:bg-white/[0.02]">
                      <td className="py-4 font-bold">{editor.name}</td>
                      <td className="py-4 text-[#00FF41] font-black">{editor.votes}</td>
                      <td className="py-4 flex gap-2">
                        <button onClick={() => adjustVotes(editor.id, editor.name, 10)} className="bg-green-500/10 text-green-500 border border-green-500/30 px-2 py-1 rounded text-[10px]">+10</button>
                        <button onClick={() => adjustVotes(editor.id, editor.name, -10)} className="bg-red-500/10 text-red-500 border border-red-500/30 px-2 py-1 rounded text-[10px]">-10</button>
                        <button onClick={() => deleteEditor(editor.id, editor.name)} className="bg-white/5 text-white/40 border border-white/10 px-2 py-1 rounded text-[10px] hover:bg-red-500 hover:text-white transition-all">DELETE</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-white/30 text-[10px] font-orbitron tracking-widest">
                    <th className="pb-4">USER</th>
                    <th className="pb-4">EMAIL</th>
                    <th className="pb-4">LOGGED IN</th>
                    <th className="pb-4">ROLE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(user => (
                    <tr key={user.id} className="group hover:bg-white/[0.02]">
                      <td className="py-4 flex items-center gap-3">
                        <img src={user.picture} className="w-8 h-8 rounded-full" alt="" />
                        <span className="font-bold">{user.name}</span>
                      </td>
                      <td className="py-4 text-white/40 text-sm">{user.email}</td>
                      <td className="py-4 text-white/40 text-xs">{new Date(user.loginTime).toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${user.isAdmin ? 'bg-red-500/10 text-red-500' : 'bg-[#00FF41]/10 text-[#00FF41]'}`}>
                          {user.isAdmin ? 'ADMIN' : 'EDITOR'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-white/30 text-[10px] font-orbitron tracking-widest">
                    <th className="pb-4">ID</th>
                    <th className="pb-4">USER</th>
                    <th className="pb-4">STARS</th>
                    <th className="pb-4">VOTES</th>
                    <th className="pb-4">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td className="py-4 font-mono text-xs text-white/30">{tx.id}</td>
                      <td className="py-4 font-bold">{tx.userName}</td>
                      <td className="py-4 font-black text-[#00FF41]">{tx.stars}</td>
                      <td className="py-4">{tx.votes}</td>
                      <td className="py-4">
                        <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-[10px] font-bold">PENDING</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ratings' && (
          <div className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {ratings.map((r, i) => (
                 <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                    <div>
                      <p className="font-bold">{r.userName}</p>
                      <p className="text-white/40 text-xs">{new Date(r.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1 text-[#00FF41]">
                       {Array.from({length: r.stars}).map((_, j) => (
                         <svg key={j} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                       ))}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="p-8">
            <div className="space-y-4">
              {auditLogs.map(log => (
                <div key={log.id} className="bg-black/20 p-4 rounded-xl border-l-2 border-[#00FF41] font-mono text-xs space-y-2">
                  <div className="flex justify-between text-white/40">
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                    <span>Admin: {log.adminName}</span>
                  </div>
                  <p><span className="text-[#00FF41]">ACTION:</span> {log.action}</p>
                  <p><span className="text-[#00FF41]">TARGET:</span> {log.target}</p>
                </div>
              ))}
              {auditLogs.length === 0 && <p className="text-center text-white/20 py-12">No audit logs found.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
