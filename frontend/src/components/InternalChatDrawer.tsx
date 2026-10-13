import React, { useState } from 'react';
import { X, Send, MessageSquare, Shield, Users, Briefcase, Hash, Sparkles } from 'lucide-react';
import { ChatMessage, Client } from '../types';

interface InternalChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: number;
    name: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
    avatar_color?: string;
  };
  clients: Client[];
  chatMessages: ChatMessage[];
  onSendMessage: (msg: Omit<ChatMessage, 'id' | 'created_at'>) => void;
  initialClientFilter?: string;
}

export const InternalChatDrawer: React.FC<InternalChatDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  clients,
  chatMessages,
  onSendMessage,
  initialClientFilter,
}) => {
  const [selectedClientName, setSelectedClientName] = useState<string>(initialClientFilter || 'ALL');
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const filteredMessages = chatMessages.filter((m) => {
    if (selectedClientName === 'ALL') return true;
    return m.client_name === selectedClientName;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage({
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      sender_role: currentUser.role,
      avatar_color: currentUser.avatar_color || (currentUser.role === 'ADMIN' ? 'bg-blue-600' : 'bg-indigo-600'),
      client_name: selectedClientName === 'ALL' ? (clients[0]?.name || 'Agency') : selectedClientName,
      message: inputText.trim(),
    });

    setInputText('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-sm tracking-tight">Internal Agency Chat</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Admin Visible
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Team & Manager coordination across client calendars</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel / Client Filter Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center space-x-1">
            <Hash className="w-3 h-3" />
            <span>Room:</span>
          </span>
          <button
            onClick={() => setSelectedClientName('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition ${
              selectedClientName === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Discussions
          </button>
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClientName(c.name)}
              className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition ${
                selectedClientName === c.name
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              #{c.code || c.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
              <MessageSquare className="w-10 h-10 text-slate-300" />
              <p className="font-semibold text-xs text-slate-600">No messages in this channel yet.</p>
              <p className="text-[11px]">Start the conversation below to coordinate tasks with team members and managers.</p>
            </div>
          ) : (
            filteredMessages.map((m) => {
              const isMe = m.sender_name === currentUser.name;
              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl border transition ${
                    m.sender_role === 'ADMIN'
                      ? 'bg-blue-50/80 border-blue-200'
                      : m.sender_role === 'MANAGER'
                      ? 'bg-indigo-50/80 border-indigo-200'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                          m.avatar_color || 'bg-slate-600'
                        }`}
                      >
                        {m.sender_name[0]}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">{m.sender_name}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          m.sender_role === 'ADMIN'
                            ? 'bg-blue-600 text-white'
                            : m.sender_role === 'MANAGER'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {m.sender_role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{m.created_at}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pl-8 whitespace-pre-wrap">{m.message}</p>

                  {m.client_name && (
                    <div className="mt-2 pl-8 flex items-center space-x-1.5 text-[10px] text-indigo-600 font-semibold">
                      <span>Ref:</span>
                      <span className="px-1.5 py-0.5 rounded bg-indigo-100/70">{m.client_name}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3.5 border-t border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Posting as: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role})
            </span>
            <span className="text-[10px] text-slate-400">Press Enter to send</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${selectedClientName === 'ALL' ? 'agency' : selectedClientName}...`}
              className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-md shadow-indigo-600/20 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
