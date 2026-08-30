import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { MessageCircle, X, Send, ChevronDown, Check, CheckCheck } from 'lucide-react';

export const LiveSupportWidget = () => {
  const { user, addChatMessage, chatMessages, markChatRead, accountants, teams, labs } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const prevMessagesCountRef = useRef(0);
  const [targetRole, setTargetRole] = useState('operations');
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const chatEndRef = useRef(null);

  // Roles filtered based on administrative scope dynamically
  const roles = [];
  
  // 1. Operations
  if (user?.role !== 'admin' && user?.role !== 'central_director' && user?.role !== 'director') {
    roles.push({ id: 'operations', label: 'غرفة العمليات المركزية', sector: 'all' });
  }

  // 2. Accountants
  (accountants || []).forEach(acc => {
    if (acc.id === user?.id) return;
    roles.push({
      id: acc.id,
      label: `محاسب ${acc.name} - ${acc.sector || 'عموم نينوى'}`,
      sector: acc.sector || 'all'
    });
  });

  // 3. Teams
  (teams || []).forEach(t => {
    if (t.id === user?.id) return;
    roles.push({
      id: t.id,
      label: `فريق: ${t.name} - ${t.sector || 'عموم نينوى'}`,
      sector: t.sector || 'all'
    });
  });

  // 4. Labs
  (labs || []).forEach(l => {
    if (l.id === user?.id) return;
    roles.push({
      id: l.id,
      label: `المختبر المركزي: ${l.name}`,
      sector: 'all'
    });
  });

  const currentRoleObj = roles.find(r => r.id === targetRole);
  const currentRoleLabel = currentRoleObj?.label || (roles.length > 0 ? roles[0].label : 'غير محدد');

  useEffect(() => {
    if (!roles.find(r => r.id === targetRole) && roles.length > 0) {
      setTargetRole(roles[0].id);
    }
  }, [roles, targetRole]);

  // Filter messages relevant to the current user
  const visibleMessages = (chatMessages || []).filter(msg => {
    if (msg.senderId === user?.id) return true;
    if (msg.targetRole === user?.id) return true;
    const isTargetRole = msg.targetRole === user?.role;
    const isTargetSector = msg.targetSector === 'all' || msg.targetSector === user?.sector || !msg.targetSector;
    if (isTargetRole && isTargetSector) return true;
    if (msg.targetRole === 'operations' && (user?.role === 'admin' || user?.role === 'director' || user?.role === 'central_director')) return true;
    return false;
  }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Isolate conversation to prevent crosstalk
  const relevantMessages = visibleMessages.filter(msg => {
    const isOperations = user?.role === 'admin' || user?.role === 'director' || user?.role === 'central_director';
    if (isOperations) {
      if (msg.senderId === targetRole || msg.targetRole === targetRole) return true;
      if (msg.targetRole === 'operations' && msg.senderId === targetRole) return true;
      if (msg.senderRole === 'operations' && msg.targetRole === targetRole) return true;
      return false;
    }
    return true; // Non-operations users only see their own isolated chat with operations anyway
  });

  // Unread badge calculation for operations should reflect ALL chats, not just the active one
  const totalUnreadMessages = visibleMessages.filter(m => m.senderId !== user?.id && !m.isRead);
  const totalUnreadCount = totalUnreadMessages.length;

  // Sound effect logic
  useEffect(() => {
    if (relevantMessages.length > prevMessagesCountRef.current) {
      // Only play sound if the last message was NOT sent by me
      const lastMsg = relevantMessages[relevantMessages.length - 1];
      if (lastMsg && lastMsg.senderId !== user?.id) {
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.volume = 0.6;
          audio.play().catch(e => console.log('Audio play error:', e));
        } catch (e) {}
      }
    }
    prevMessagesCountRef.current = relevantMessages.length;
  }, [relevantMessages, user?.id]);

  const unreadMessages = relevantMessages.filter(m => m.senderId !== user?.id && !m.isRead);
  const unreadCount = unreadMessages.length;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (unreadCount > 0) {
        const unreadIds = unreadMessages.map(m => m.id);
        markChatRead(unreadIds);
      }
    }
  }, [relevantMessages, isOpen, unreadCount, markChatRead]);

  // Simulate receiving a message from the target
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    if (addChatMessage) {
      addChatMessage(targetRole, currentRoleObj?.sector || 'all', chatMessage, user?.name || 'مستخدم', user?.role, user?.sector, user?.id);
    }

    setChatMessage('');
  };

  // If there's no user logged in, don't show the chat
  if (!user || user.role === 'admin') return null;

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 w-80 sm:w-96 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-700 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-4 flex items-center justify-between text-white relative">
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 cursor-pointer" onClick={() => setShowRoleSelect(!showRoleSelect)}>
                <h4 className="text-sm font-black text-right flex items-center gap-1 justify-end">
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRoleSelect ? 'rotate-180' : ''}`} />
                  الدعم المباشر
                </h4>
                <p className="text-[10px] text-teal-100 font-bold truncate text-right">إلى: {currentRoleLabel}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors shrink-0 mr-2">
              <X className="w-5 h-5" />
            </button>

            {/* Dropdown for role selection */}
            {showRoleSelect && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-b-xl overflow-hidden z-10 animate-in fade-in slide-in-from-top-2">
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => { setTargetRole(r.id); setShowRoleSelect(false); }}
                      className={`w-full text-right px-4 py-3 text-xs font-bold transition-colors ${targetRole === r.id ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 h-72 overflow-y-auto flex flex-col gap-3 bg-[#e5ddd5] dark:bg-slate-950/80 custom-scrollbar" style={{backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain', backgroundBlendMode: 'multiply'}}>
            {relevantMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-sm ${msg.senderId === user?.id ? 'bg-[#dcf8c6] dark:bg-teal-800 text-slate-800 dark:text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-none'}`}>
                  {msg.senderId !== user?.id && <span className="block text-[10px] font-bold text-teal-600 mb-1">{msg.senderName}</span>}
                  <p className="text-xs font-bold leading-relaxed text-right">{msg.text}</p>
                  <span className={`text-[9px] block mt-1 text-left flex items-center justify-end gap-1 ${msg.senderId === user?.id ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}
                    {msg.senderId === user?.id && (
                      msg.isRead ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3 text-slate-400" />
                    )}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-3 bg-slate-100 dark:bg-slate-900 flex gap-2 items-end">
            <button 
              onClick={handleSendMessage}
              disabled={!chatMessage.trim()}
              className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4 rtl:-scale-x-100 mr-1" />
            </button>
            <textarea 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-white dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-teal-500/30 text-right resize-none shadow-sm"
              rows="1"
            />
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(13,148,136,0.4)] transition-all hover:scale-110 relative ${isOpen ? 'bg-slate-700' : 'bg-teal-600 hover:bg-teal-500'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <>
            <MessageCircle className="w-7 h-7" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 animate-pulse">
                {totalUnreadCount > 9 ? '+9' : totalUnreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
};
