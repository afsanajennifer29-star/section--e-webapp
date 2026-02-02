
import React, { useState, useEffect } from 'react';
import { ContentItem, DownloadRecord } from '../types';

interface ContentCardProps {
  item: ContentItem;
  onClick: (item: ContentItem) => void;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (e: React.MouseEvent, item: ContentItem) => void;
  onToggleVIP?: (e: React.MouseEvent, itemId: string) => void;
  downloadStatus?: DownloadRecord;
  onStartDownload?: (item: ContentItem) => void;
  isContinuing?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  item, 
  onClick, 
  isWatchlisted, 
  onToggleWatchlist, 
  onToggleVIP,
  downloadStatus,
  onStartDownload,
  isContinuing
}) => {
  const isUpcoming = item.status === 'Upcoming';

  const hoursRemaining = downloadStatus?.status === 'completed' 
    ? Math.max(0, Math.ceil((downloadStatus.expiryDate - Date.now()) / (1000 * 60 * 60)))
    : null;

  const getStatusBadge = () => {
    switch (item.status) {
      case 'Ongoing':
        return <div className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest animate-pulse flex items-center gap-1"><i className="fa-solid fa-circle text-[6px]"></i> LIVE</div>;
      case 'Upcoming':
        return <div className="bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1"><i className="fa-solid fa-clock text-[8px]"></i> SOON</div>;
      case 'Completed':
        return <div className="bg-teal-600 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1"><i className="fa-solid fa-check-double text-[8px]"></i> ENDED</div>;
      default:
        return null;
    }
  };

  return (
    <div 
      onClick={() => !isUpcoming && onClick(item)}
      className={`group relative flex-shrink-0 w-40 sm:w-56 bg-gray-900 rounded-[24px] overflow-hidden shadow-2xl transition-all duration-500 ${isUpcoming ? 'cursor-default grayscale opacity-60' : 'cursor-pointer hover:scale-105 hover:z-20'}`}
    >
      <div className="aspect-[2/3] overflow-hidden relative">
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className={`w-full h-full object-cover transition-transform duration-[1.5s] ${!isUpcoming && 'group-hover:scale-110'}`}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-30">
          {getStatusBadge()}
          {item.isVIP && (
            <div className="bg-sky-400 text-black text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-sky-400/20"><i className="fa-solid fa-crown text-[8px]"></i> VIP</div>
          )}
        </div>

        {/* Continue Watching Progress */}
        {isContinuing && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800 z-30">
            <div 
              className="h-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]" 
              style={{ width: `${item.progress || 35}%` }} 
            />
          </div>
        )}

        {hoursRemaining !== null && (
          <div className="absolute bottom-4 left-4 z-30">
            <div className="bg-indigo-600/90 backdrop-blur-2xl text-white text-[8px] font-black px-3 py-1.5 rounded-xl border border-white/10 uppercase tracking-widest">
              OFFLINE {hoursRemaining}H
            </div>
          </div>
        )}

        {/* Interaction Overlay */}
        {!isUpcoming && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-40">
            <div className="flex gap-2">
              <button 
                onClick={(e) => onToggleWatchlist?.(e, item)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isWatchlisted ? 'bg-violet-600 text-white' : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
                }`}
              >
                <i className={`fa-solid ${isWatchlisted ? 'fa-bookmark' : 'fa-plus'} text-xs`}></i>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onStartDownload?.(item); }}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
              >
                <i className="fa-solid fa-download text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-white text-xs font-black truncate uppercase tracking-tighter mb-1.5">{item.title}</h3>
        <div className="flex items-center justify-between">
           <span className="text-violet-500 text-[9px] font-black uppercase tracking-widest">{item.category}</span>
           <div className="flex items-center text-sky-400 text-[9px] font-black">
             <i className="fa-solid fa-star mr-1"></i>
             {item.rating}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
