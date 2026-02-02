
import React, { useState, useEffect, useRef } from 'react';
import { generateAdvancedChat } from '../services/geminiService';
import { ChatMessage, Note, StudyVideo } from '../types';
import { MOCK_STUDY_VIDEOS } from '../constants';

type NotificationSound = 'gentle' | 'standard' | 'cheerful' | 'none';

interface TimerSettings {
  work: { min: number; sec: number };
  break: { min: number; sec: number };
  sound: NotificationSound;
}

const StudyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'videos' | 'notes'>('videos');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<StudyVideo | null>(MOCK_STUDY_VIDEOS[0]);
  
  // Granular Timer State
  const [settings, setSettings] = useState<TimerSettings>({
    work: { min: 25, sec: 0 },
    break: { min: 5, sec: 0 },
    sound: 'standard'
  });
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const [timer, setTimer] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const playNotificationSound = (type: NotificationSound) => {
    if (type === 'none') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'gentle') {
        oscillator.frequency.setValueAtTime(330, now);
        oscillator.frequency.exponentialRampToValueAtTime(220, now + 1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1);
        oscillator.start();
        oscillator.stop(now + 1);
      } else if (type === 'standard') {
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.5);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        oscillator.start();
        oscillator.stop(now + 0.5);
      } else if (type === 'cheerful') {
        oscillator.frequency.setValueAtTime(523.25, now);
        oscillator.frequency.setValueAtTime(659.25, now + 0.15);
        oscillator.frequency.setValueAtTime(783.99, now + 0.3);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        oscillator.start();
        oscillator.stop(now + 0.5);
      }
    } catch (e) {
      console.warn("Audio notification failed", e);
    }
  };

  useEffect(() => {
    const savedNotes = localStorage.getItem('sectionE_study_notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    
    const savedSettings = localStorage.getItem('sectionE_timer_v2_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setTimer(parsed.work.min * 60 + parsed.work.sec);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sectionE_study_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playNotificationSound(settings.sound);
      const nextMode = timerMode === 'work' ? 'break' : 'work';
      const nextTotalSec = nextMode === 'work' 
        ? settings.work.min * 60 + settings.work.sec 
        : settings.break.min * 60 + settings.break.sec;
      setTimerMode(nextMode);
      setTimer(nextTotalSec);
    }
    return () => {
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timer, timerMode, settings]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const response = await generateAdvancedChat(input, messages);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const saveTimerSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    const nextTotalSec = timerMode === 'work' 
      ? newSettings.work.min * 60 + newSettings.work.sec 
      : newSettings.break.min * 60 + newSettings.break.sec;
    setTimer(nextTotalSec);
    setIsTimerRunning(false);
    localStorage.setItem('sectionE_timer_v2_settings', JSON.stringify(newSettings));
    setShowTimerSettings(false);
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Study Reflection',
      content: '',
      timestamp: Date.now(),
      videoEmbeds: []
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
    setActiveTab('notes');
  };

  const updateNote = (field: 'title' | 'content', value: string) => {
    if (!activeNote) return;
    setNotes(notes.map(n => n.id === activeNote ? { ...n, [field]: value } : n));
  };

  const currentNote = notes.find(n => n.id === activeNote);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 p-3 sm:p-6 overflow-hidden relative">
      
      {/* Main Workspace: Lectures or Notes */}
      <div className="lg:col-span-8 flex flex-col space-y-4 overflow-hidden h-full">
        
        {/* Workspace Toolbar */}
        <div className="bg-gray-800/80 backdrop-blur rounded-2xl p-3 sm:p-4 border border-gray-700 flex flex-wrap items-center justify-between shadow-xl gap-3">
          <div className="flex bg-gray-900/50 p-1 rounded-xl border border-gray-700">
            {[{ id: 'videos', label: 'Lectures', icon: 'fa-graduation-cap' }, { id: 'notes', label: 'Workspace', icon: 'fa-pen-nib' }].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center ${activeTab === tab.id ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-gray-400 hover:text-white'}`}
              >
                <i className={`fa-solid ${tab.icon} mr-1.5 sm:mr-2`}></i> <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 bg-gray-900/50 px-3 py-1.5 rounded-xl border border-gray-700 relative">
             <div className="flex flex-col items-center">
                <span className={`text-[8px] font-black uppercase tracking-widest leading-none mb-1 ${timerMode === 'work' ? 'text-orange-400' : 'text-teal-400'}`}>
                  {timerMode === 'work' ? 'Focus' : 'Break'}
                </span>
                <span className="text-sm sm:text-xl font-mono font-bold text-white leading-none">{formatTime(timer)}</span>
             </div>
             <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all ${isTimerRunning ? 'bg-orange-500/20 text-orange-500' : 'bg-teal-500/20 text-teal-400'}`}>
                <i className={`fa-solid ${isTimerRunning ? 'fa-pause' : 'fa-play'} text-xs`}></i>
              </button>
              <button onClick={() => setShowTimerSettings(!showTimerSettings)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all hover:bg-white/10 text-gray-500">
                <i className="fa-solid fa-sliders text-xs"></i>
              </button>
              
              {showTimerSettings && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-2xl p-4 shadow-2xl z-[70] animate-in slide-in-from-top-2">
                   <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Settings</h4>
                   <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2 text-[9px] text-gray-500 font-black uppercase tracking-widest">Focus</div>
                        <input type="number" min="0" value={settings.work.min} onChange={(e) => setSettings({...settings, work: {...settings.work, min: parseInt(e.target.value) || 0}})} className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white outline-none" placeholder="Min" />
                        <input type="number" min="0" value={settings.work.sec} onChange={(e) => setSettings({...settings, work: {...settings.work, sec: parseInt(e.target.value) || 0}})} className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white outline-none" placeholder="Sec" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2 text-[9px] text-gray-500 font-black uppercase tracking-widest">Break</div>
                        <input type="number" min="0" value={settings.break.min} onChange={(e) => setSettings({...settings, break: {...settings.break, min: parseInt(e.target.value) || 0}})} className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white outline-none" placeholder="Min" />
                        <input type="number" min="0" value={settings.break.sec} onChange={(e) => setSettings({...settings, break: {...settings.break, sec: parseInt(e.target.value) || 0}})} className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white outline-none" placeholder="Sec" />
                      </div>
                      <button onClick={() => saveTimerSettings(settings)} className="w-full py-2 bg-teal-600 text-white text-[10px] font-black uppercase rounded-lg">Apply</button>
                   </div>
                </div>
              )}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 bg-gray-800/50 rounded-2xl border border-gray-700 flex flex-col overflow-hidden shadow-2xl">
          {activeTab === 'videos' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="aspect-video bg-black relative flex-shrink-0">
                <video ref={videoRef} className="w-full h-full object-contain" src={selectedVideo?.videoUrl} poster={selectedVideo?.thumbnail} controls />
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Available Lectures</h3>
                <div className="grid grid-cols-1 portrait:grid-cols-1 landscape:sm:grid-cols-2 gap-3 sm:gap-4">
                  {MOCK_STUDY_VIDEOS.map(video => (
                    <button key={video.id} onClick={() => setSelectedVideo(video)} className={`flex items-start p-3 rounded-xl border transition-all text-left ${selectedVideo?.id === video.id ? 'bg-teal-600/10 border-teal-500/50' : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'}`}>
                      <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                        <img src={video.thumbnail} className="w-full h-full object-cover" alt={video.title} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${selectedVideo?.id === video.id ? 'text-teal-400' : 'text-gray-200'}`}>{video.title}</p>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase truncate">{video.subject}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="flex h-full flex-col sm:flex-row overflow-hidden">
              <div className="w-full sm:w-48 lg:w-56 border-r border-gray-700 bg-gray-900/30 flex flex-col flex-shrink-0">
                <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Notes</span>
                  <button onClick={createNewNote} className="text-teal-500 hover:text-teal-400"><i className="fa-solid fa-plus-circle text-lg"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {notes.map(note => (
                    <button key={note.id} onClick={() => setActiveNote(note.id)} className={`w-full p-3 sm:p-4 text-left text-xs border-b border-gray-800 transition-colors ${activeNote === note.id ? 'bg-teal-500/10 text-teal-400 border-l-4 border-l-teal-500' : 'text-gray-500 hover:bg-white/5'}`}>
                      <p className="font-bold line-clamp-1">{note.title || 'Draft'}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto">
                {currentNote ? (
                  <>
                    <input value={currentNote.title} onChange={(e) => updateNote('title', e.target.value)} placeholder="Note Title..." className="w-full bg-transparent text-xl sm:text-2xl font-black border-none outline-none text-white placeholder:text-gray-800" />
                    <textarea value={currentNote.content} onChange={(e) => updateNote('content', e.target.value)} placeholder="Start writing..." className="w-full min-h-[300px] sm:min-h-[400px] bg-transparent border-none outline-none resize-none text-gray-400 text-sm leading-relaxed" />
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-700 h-full opacity-30">
                     <i className="fa-solid fa-pen-fancy text-5xl mb-4"></i>
                     <p className="text-sm font-bold uppercase tracking-widest">Select or create a workspace</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Sidebar: Hidden on small portrait, visible on large landscape/PC */}
      <div className="hidden lg:flex lg:col-span-4 bg-gray-900 border border-gray-700 rounded-3xl flex-col overflow-hidden shadow-2xl h-full">
        <div className="p-5 border-b border-gray-700 flex items-center bg-gray-800/50">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center mr-3 shadow-lg shadow-teal-500/10">
            <i className="fa-solid fa-brain text-white text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-100">AI Tutor</h3>
            <span className="text-[8px] text-teal-400 uppercase font-black tracking-[0.2em]">Online & Ready</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>{m.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 p-2">
               <div className="flex space-x-1">
                 <div className="w-1 h-1 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-1 h-1 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-1 h-1 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
               <span className="text-[10px] text-teal-500 font-black uppercase tracking-widest">Thinking</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="relative">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
              placeholder="Ask for help or summary..." 
              className="w-full bg-gray-900 border border-gray-700 rounded-2xl py-3 pl-5 pr-14 text-xs outline-none focus:ring-1 focus:ring-teal-500 transition-all" 
            />
            <button 
              onClick={handleSendMessage} 
              className="absolute right-2 top-1.5 w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg hover:bg-teal-500 transition-colors"
            >
              <i className="fa-solid fa-paper-plane text-white text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyView;
