
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import EntertainmentView from './components/EntertainmentView';
import StudyView from './components/StudyView';
import UploadModal from './components/UploadModal';
import SubscriptionModal from './components/SubscriptionModal';
import CommentSection from './components/CommentSection';
import DownloadsModal from './components/DownloadsModal';
import { ViewMode, ContentItem, DownloadRecord, ChatMessage } from './types';
import { generateAdvancedChat } from './services/geminiService';
import { MOCK_CONTENT } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.ENTERTAINMENT);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [watchlist, setWatchlist] = useState<ContentItem[]>([]);
  const [recentlyWatched, setRecentlyWatched] = useState<ContentItem[]>([]);
  const [userUploadedContent, setUserUploadedContent] = useState<ContentItem[]>([]);
  const [downloads, setDownloads] = useState<Record<string, DownloadRecord>>({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  
  const allContent = [...userUploadedContent, ...MOCK_CONTENT];
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('sectionE_watchlist');
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    const savedRecentlyWatched = localStorage.getItem('sectionE_recentlyWatched');
    if (savedRecentlyWatched) setRecentlyWatched(JSON.parse(savedRecentlyWatched));
    const savedUserContent = localStorage.getItem('sectionE_userContent');
    if (savedUserContent) setUserUploadedContent(JSON.parse(savedUserContent));
    const savedPremium = localStorage.getItem('sectionE_premium');
    if (savedPremium) setIsPremium(JSON.parse(savedPremium));
    
    const savedDownloads = localStorage.getItem('sectionE_downloads');
    if (savedDownloads) {
      const parsed: Record<string, DownloadRecord> = JSON.parse(savedDownloads);
      const now = Date.now();
      const valid: Record<string, DownloadRecord> = {};
      Object.entries(parsed).forEach(([id, record]) => {
        if (record.expiryDate > now) valid[id] = record;
      });
      setDownloads(valid);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sectionE_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('sectionE_recentlyWatched', JSON.stringify(recentlyWatched));
  }, [recentlyWatched]);

  useEffect(() => {
    localStorage.setItem('sectionE_userContent', JSON.stringify(userUploadedContent));
    localStorage.setItem('sectionE_premium', JSON.stringify(isPremium));
    localStorage.setItem('sectionE_downloads', JSON.stringify(downloads));
  }, [userUploadedContent, isPremium, downloads]);

  const handleStartDownload = (item: ContentItem) => {
    if (item.isVIP && !isPremium) {
      setIsSubModalOpen(true);
      return;
    }
    const downloadId = item.id;
    setDownloads(prev => ({
      ...prev,
      [downloadId]: {
        contentId: downloadId,
        downloadDate: Date.now(),
        expiryDate: Date.now() + (48 * 60 * 60 * 1000),
        progress: 0,
        status: 'downloading',
        sizeMB: Math.floor(Math.random() * 400) + 150
      }
    }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloads(prev => ({ ...prev, [downloadId]: { ...prev[downloadId], progress: 100, status: 'completed' } }));
      } else {
        setDownloads(prev => ({ ...prev, [downloadId]: { ...prev[downloadId], progress } }));
      }
    }, 300);
  };

  const handlePlayContent = (item: ContentItem) => {
    const isDownloaded = downloads[item.id]?.status === 'completed' && downloads[item.id].expiryDate > Date.now();
    if (!isDownloaded && item.isVIP && !isPremium) {
      setIsSubModalOpen(true);
      return;
    }
    setRecentlyWatched(prev => [item, ...prev.filter(i => i.id !== item.id)].slice(0, 10));
    setSelectedContent(item);
  };

  const toggleWatchlist = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    setWatchlist(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      return [item, ...prev];
    });
  };

  const toggleVIP = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setUserUploadedContent(prev => 
      prev.map(item => item.id === itemId ? { ...item, isVIP: !item.isVIP } : item)
    );
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);
    const botRes = await generateAdvancedChat(userMsg, chatHistory);
    setChatHistory(prev => [...prev, { role: 'model', text: botRes }]);
    setIsChatLoading(false);
  };

  const getVideoSource = (item: ContentItem) => {
    return item.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-all duration-500">
      <Navbar activeView={activeView} onViewChange={setActiveView} isPremium={isPremium} onOpenVIP={() => setIsSubModalOpen(true)} />
      
      <main className="flex-1 relative">
        <div className={`transition-all duration-500 h-full ${activeView === ViewMode.ENTERTAINMENT ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute inset-0'}`}>
          <EntertainmentView 
            contentList={allContent} 
            onPlay={handlePlayContent} 
            watchlist={watchlist} 
            recentlyWatched={recentlyWatched} 
            downloads={downloads} 
            onToggleWatchlist={toggleWatchlist} 
            onToggleVIP={toggleVIP} 
            onOpenUpload={() => setIsUploadModalOpen(true)} 
            onStartDownload={handleStartDownload} 
            onOpenDownloads={() => setIsDownloadsModalOpen(true)} 
          />
        </div>
        <div className={`transition-all duration-500 h-full ${activeView === ViewMode.STUDY ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute inset-0'}`}>
          <StudyView />
        </div>
      </main>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUpload={item => setUserUploadedContent(p => [item, ...p])} />
      <DownloadsModal isOpen={isDownloadsModalOpen} onClose={() => setIsDownloadsModalOpen(false)} downloads={downloads} contentList={allContent} onDelete={(id) => setDownloads(prev => { const n = {...prev}; delete n[id]; return n; })} onPlay={handlePlayContent} />
      <SubscriptionModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} onSuccess={() => setIsPremium(true)} />

      {selectedContent && activeView === ViewMode.ENTERTAINMENT && (
        <div className="fixed inset-0 bg-gray-950 z-[110] flex flex-col overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="sticky top-0 p-4 flex items-center justify-between z-50 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-[2px] h-16 sm:h-20">
            <button onClick={() => setSelectedContent(null)} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
              <i className="fa-solid fa-arrow-left text-xl sm:text-2xl"></i>
            </button>
            <div className="flex flex-col items-center flex-1 mx-4">
              <h2 className="font-black text-sm sm:text-lg text-white drop-shadow-lg truncate max-w-[200px] uppercase tracking-tighter">{selectedContent.title}</h2>
              {downloads[selectedContent.id]?.status === 'completed' && (
                <span className="text-[8px] font-black text-green-400 uppercase tracking-[0.2em] flex items-center gap-1">
                  <i className="fa-solid fa-circle-check"></i> Playing Offline
                </span>
              )}
            </div>
            <div className="w-10"></div>
          </div>
          
          <div className="flex flex-col items-center w-full pb-20">
            <div className="w-full flex justify-center bg-black">
              <div className="relative aspect-video w-full max-w-7xl bg-black shadow-2xl transition-all sm:rounded-3xl sm:mt-4 sm:mx-4 overflow-hidden border border-white/5">
                <video 
                  ref={videoRef} 
                  poster={selectedContent.thumbnail} 
                  className="w-full h-full object-contain" 
                  src={getVideoSource(selectedContent)} 
                  autoPlay 
                  controls
                />
              </div>
            </div>
            <div className="mt-6 sm:mt-10 px-4 sm:px-8 w-full max-w-5xl flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 delay-300 duration-500">
               <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">{selectedContent.category}</span>
                       <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                       <span className="text-[10px] font-bold text-gray-600">{selectedContent.releaseYear}</span>
                       <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                       <div className="flex items-center text-sky-400 text-[10px] font-black"><i className="fa-solid fa-star mr-1"></i>{selectedContent.rating}</div>
                    </div>
                    <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tighter mb-4 sm:mb-6 uppercase">{selectedContent.title}</h3>
                    <p className="text-gray-400 max-w-3xl text-sm sm:text-base leading-relaxed font-medium">{selectedContent.description}</p>
                 </div>
               </div>
               <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent my-10" />
               <CommentSection contentId={selectedContent.id} />
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[100] safe-area-bottom">
        {isChatOpen ? (
          <div className="w-[85vw] sm:w-80 h-[60vh] sm:h-96 bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-4 bg-violet-600 flex items-center justify-between">
              <span className="font-bold text-sm flex items-center uppercase tracking-widest"><i className="fa-solid fa-sparkles mr-2"></i> AI Assistant</span>
              <button onClick={() => setIsChatOpen(false)} className="hover:rotate-90 transition-transform"><i className="fa-solid fa-times"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-950 scrollbar-thin">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${msg.role === 'user' ? 'bg-violet-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>{msg.text}</div>
                </div>
              ))}
              {isChatLoading && <div className="text-[10px] text-violet-500 font-bold animate-pulse px-2 uppercase tracking-tighter">Thinking...</div>}
            </div>
            <div className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat()} placeholder="Ask AI..." className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-xs focus:ring-1 focus:ring-violet-500 outline-none" />
              <button onClick={handleSendChat} className="bg-violet-600 p-3 rounded-xl shadow-lg shadow-violet-500/10"><i className="fa-solid fa-paper-plane text-white"></i></button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsChatOpen(true)} className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-indigo-600 via-violet-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all active:scale-95 group ring-4 ring-violet-600/20">
            <i className="fa-solid fa-robot text-white text-xl sm:text-2xl group-hover:rotate-12 transition-transform"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
