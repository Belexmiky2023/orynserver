
import React, { useState, useEffect } from 'react';
import { Editor, User } from '../types';
import { getStoredEditors, castVote, getVoteMap } from '../store';

interface VoteProps {
  user: User | null;
  onLogin: () => void;
}

const Vote: React.FC<VoteProps> = ({ user, onLogin }) => {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [votedForId, setVotedForId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setEditors(getStoredEditors());
    if (user) {
      const votes = getVoteMap();
      if (votes[user.id]) setVotedForId(votes[user.id]);
    }
  }, [user]);

  const handleVote = (editorId: string) => {
    if (!user) {
      onLogin();
      return;
    }
    if (votedForId) return;

    setLoadingId(editorId);
    // Simulate API call
    setTimeout(() => {
      const success = castVote(user.id, editorId);
      if (success) {
        setVotedForId(editorId);
        setEditors(getStoredEditors());
      }
      setLoadingId(null);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="font-orbitron text-4xl md:text-5xl font-black">CAST YOUR <span className="text-[#00FF41]">VOTE</span></h1>
        <p className="text-white/50">Support your favorite editor. You can only vote once per tournament. Each vote counts towards the final decision.</p>
        
        {!user && (
          <div className="bg-[#00FF41]/10 border border-[#00FF41]/30 p-4 rounded-xl inline-flex items-center gap-4 mt-6">
            <span className="text-sm font-bold text-[#00FF41]">LOGIN TO VOTE</span>
            <button onClick={onLogin} className="bg-[#00FF41] text-black px-4 py-1.5 rounded-lg text-xs font-black font-orbitron hover:scale-105 transition-all">SIGN IN WITH GOOGLE</button>
          </div>
        )}

        {user && votedForId && (
          <div className="bg-[#00FF41]/10 border border-[#00FF41]/30 p-4 rounded-xl inline-flex items-center gap-4 mt-6">
            <span className="text-sm font-bold text-[#00FF41]">YOU HAVE ALREADY VOTED ✓</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {editors.map((editor) => {
          const isVoted = votedForId === editor.id;
          const isDisabled = !!votedForId || loadingId !== null;

          return (
            <div key={editor.id} className={`glass-panel group rounded-2xl overflow-hidden border transition-all duration-500 ${isVoted ? 'border-[#00FF41] scale-105' : 'border-white/10 hover:border-white/20'}`}>
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={editor.thumbnail} 
                  alt={editor.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[50%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></div>
                   <span className="text-[10px] font-orbitron tracking-widest text-white/70">EDITOR VIEW</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-orbitron font-bold text-lg group-hover:text-[#00FF41] transition-colors">{editor.name}</h3>
                    <p className="text-white/40 text-xs font-bold tracking-widest uppercase">Ranked Season 4</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[#00FF41] font-orbitron font-black text-xl">{editor.votes}</span>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-tighter">TOTAL VOTES</span>
                  </div>
                </div>

                <button
                  onClick={() => handleVote(editor.id)}
                  disabled={isDisabled}
                  className={`w-full font-orbitron font-black py-3 rounded-xl transition-all ${
                    isVoted 
                      ? 'bg-[#00FF41] text-black shadow-[0_0_20px_#00FF41]' 
                      : isDisabled
                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                        : 'bg-white/10 text-white hover:bg-[#00FF41] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]'
                  }`}
                >
                  {loadingId === editor.id ? 'VOTING...' : isVoted ? 'VOTED' : 'VOTE'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Vote;
