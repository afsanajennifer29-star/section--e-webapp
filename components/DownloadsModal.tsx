
import React from 'react';
import { ContentItem, DownloadRecord } from '../types';

interface DownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloads: Record<string, DownloadRecord>;
  contentList: ContentItem[];
  onDelete: (id: string) => void;
  onPlay: (item: ContentItem) => void;
}

const DownloadsModal: React.FC<DownloadsModalProps> = ({ isOpen, onClose, downloads, contentList, onDelete, onPlay }) => {
  if (!isOpen) return null;

  const downloadedItems = contentList.filter(item => downloads[item.id]?.status === 'completed');
  const totalSize = downloadedItems.reduce((acc, item) => acc + (downloads[item.id]?.sizeMB || 0), 0);

  const formatTimeLeft = (expiryDate: number) => {
    const hours = Math.ceil((expiryDate - Date.now()) / (1000 * 60 * 60));
    if (hours <= 0) return 'Expired';
    return `${hours}h remaining`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-gray-900 border border-gray-800 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fa-solid fa-cloud-arrow-down text-white"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Offline Hub</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {downloadedItems.length} Titles • {totalSize.toFixed(1)} MB Cached
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-all p-2">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {downloadedItems.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-800">
              <i className="fa-solid fa-download text-6xl mb-4 opacity-5"></i>
              <p className="text-xs font-black uppercase tracking-widest">Your offline library is empty</p>
            </div>
          ) : (
            downloadedItems.map(item => (
              <div key={item.id} className="group bg-gray-800/40 border border-gray-700/50 rounded-2xl p-3 flex items-center gap-4 hover:bg-gray-800 transition-all">
                <img src={item.thumbnail} className="w-16 h-20 rounded-lg object-cover shadow-lg" alt={item.title} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">{item.category}</span>
                    <span className="text-[9px] font-bold text-gray-500">{downloads[item.id].sizeMB} MB</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-bold text-gray-400">{formatTimeLeft(downloads[item.id].expiryDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onPlay(item)}
                    className="w-10 h-10 bg-indigo-600/10 text-indigo-400 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <i className="fa-solid fa-play text-xs"></i>
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="w-10 h-10 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-950/50 border-t border-gray-800 text-center">
          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em]">
            Downloaded content automatically expires after 48 hours to save space.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DownloadsModal;
