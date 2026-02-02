
import React, { useState } from 'react';
import { ContentItem, DramaCategory, DownloadRecord } from '../types';
import ContentCard from './ContentCard';

interface EntertainmentViewProps {
  contentList: ContentItem[];
  onPlay: (item: ContentItem) => void;
  watchlist: ContentItem[];
  recentlyWatched: ContentItem[];
  downloads: Record<string, DownloadRecord>;
  onToggleWatchlist: (e: React.MouseEvent, item: ContentItem) => void;
  onToggleVIP: (e: React.MouseEvent, itemId: string) => void;
  onOpenUpload: () => void;
  onStartDownload: (item: ContentItem) => void;
  onOpenDownloads: () => void;
}

const EntertainmentView: React.FC<EntertainmentViewProps> = ({ 
  contentList, 
  onPlay, 
  watchlist, 
  recentlyWatched,
  downloads,
  onToggleWatchlist,
  onToggleVIP,
  onOpenUpload,
  onStartDownload,
  onOpenDownloads
}) => {
  const [activeCategory, setActiveCategory] = useState<DramaCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: (DramaCategory | 'All')[] = [
    'All', 'K-Drama', 'C-Drama', 'J-Drama', 'Anime', 'Thai', 'Filipino', 'Hollywood', 'Movies', 'Variety', 'Reality', 'Documentary'
  ];

  const filteredContent = contentList.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const lowerSearch = searchTerm.toLowerCase();
    const matchesTitle = item.title.toLowerCase().includes(lowerSearch);
    const matchesActors = item.actors?.some(actor => actor.toLowerCase().includes(lowerSearch));
    return matchesCategory && (matchesTitle || matchesActors);
  });

  const ongoingContent = filteredContent.filter(i => i.status === 'Ongoing');
  const upcomingContent = filteredContent.filter(i => i.status === 'Upcoming');
  const vipContent = filteredContent.filter(i => i.isVIP);
  
  const downloadedItemsCount = Object.values(downloads).filter(d => d.status === 'completed' && d.expiryDate > Date.now()).length;
  const isBrowsing = activeCategory !== 'All' || searchTerm !== '';

  const RowSection = ({ title, icon, color, items, subTitle, isContinuing }: { title: string, icon: string, color: string, items: ContentItem[], subTitle?: string, isContinuing?: boolean }) => {
    if (items.length === 0) return null;
    return (
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 mb-12 last:mb-0">
        <div className="flex items-center justify-between mb-5 px-2">
          <div className="flex items-center space-x-4">
             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color} bg-opacity-10 border border-white/5`}>
                <i className={`fa-solid ${icon} ${color.replace('bg-', 'text-')} text-sm`}></i>
             </div>
             <div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter leading-none">{title}</h3>
                {subTitle && <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1.5">{subTitle}</p>}
             </div>
          </div>
          <button className="text-[10px] text-gray-500 font-black uppercase tracking-widest hover:text-white transition-colors">See All</button>
        </div>
        <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-8 px-2 snap-x">
          {items.map(item => (
            <div key={item.id} className="snap-start">
              <ContentCard 
                item={item} 
                onClick={onPlay} 
                isContinuing={isContinuing}
                isWatchlisted={watchlist.some(w => w.id === item.id)}
                onToggleWatchlist={onToggleWatchlist}
                onToggleVIP={onToggleVIP}
                downloadStatus={downloads[item.id]}
                onStartDownload={onStartDownload}
              />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-12 pb-32 p-4 sm:p-10 max-w-[1600px] mx-auto">
      {/* Hero Header */}
      {!isBrowsing && (
        <div className="relative h-[450px] sm:h-[700px] rounded-[56px] overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.4)] animate-in fade-in duration-1000">
          <img 
            src="https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?auto=format&fit=crop&q=80&w=1400&h=800" 
            alt="Hero Feature" 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
          <div className="absolute inset-0 p-10 sm:p-20 flex flex-col justify-end max-w-4xl">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-red-600 text-white font-black px-3 py-1 rounded text-[10px] uppercase tracking-tighter flex items-center gap-1.5">
                <i className="fa-solid fa-chart-line"></i> TOP 10 GLOBAL
              </div>
              <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em]">Drama of the Year</span>
            </div>
            <h2 className="text-6xl sm:text-9xl font-black mb-8 tracking-tighter text-white drop-shadow-2xl uppercase leading-none">Alchemy of Souls</h2>
            <p className="text-gray-300 text-sm sm:text-2xl line-clamp-2 mb-12 font-medium max-w-2xl leading-relaxed">
              In a world of sorcery, a powerful mage trapped in a weak body must regain her strength to settle old scores.
            </p>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => onPlay(contentList.find(i => i.id === 'k-1')!)}
                className="px-12 py-5 bg-white text-black font-black rounded-3xl transition-all shadow-xl hover:bg-violet-600 hover:text-white active:scale-95 uppercase tracking-widest text-xs"
              >
                Start Watching
              </button>
              <button className="flex items-center space-x-3 text-white font-black uppercase tracking-widest text-[10px] group">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-3xl flex items-center justify-center group-hover:bg-white/20 transition-all border border-white/20">
                  <i className="fa-solid fa-circle-info"></i>
                </div>
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Filter Bar */}
      <div className="sticky top-20 z-[55] py-8 bg-gray-950/95 backdrop-blur-3xl -mx-4 px-4 border-b border-white/5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
           <div className="flex flex-1 items-center gap-5">
             <div className="relative flex-1 max-w-xl group">
                <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 transition-colors group-focus-within:text-violet-500"></i>
                <input 
                  type="text"
                  placeholder="Titles, actors, genres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-[28px] py-4 pl-16 pr-8 text-sm focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-gray-700 font-bold"
                />
              </div>
              <button onClick={onOpenDownloads} className="relative flex items-center justify-center w-14 h-14 bg-gray-900 border border-white/10 text-gray-600 hover:text-white rounded-[20px] transition-all shadow-inner">
                <i className="fa-solid fa-arrow-down-long text-lg"></i>
                {downloadedItemsCount > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-[10px] font-black flex items-center justify-center rounded-full border-4 border-gray-950">{downloadedItemsCount}</span>}
              </button>
           </div>
          
          <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-8 py-3.5 rounded-[18px] text-[10px] font-black transition-all uppercase tracking-widest border ${
                  activeCategory === cat 
                  ? 'bg-white text-black border-white shadow-xl' 
                  : 'bg-gray-900 text-gray-600 border-white/10 hover:border-white/30 hover:text-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Rows */}
      <div className="space-y-16 min-h-[800px]">
        {isBrowsing ? (
          <section className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center justify-between mb-10 px-2">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                {searchTerm ? `Search Results` : `${activeCategory} Library`}
              </h3>
              <span className="text-xs text-gray-700 font-black uppercase tracking-widest">{filteredContent.length} ITEMS</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-12">
              {filteredContent.map(item => (
                <ContentCard 
                  key={item.id} 
                  item={item} 
                  onClick={onPlay} 
                  isWatchlisted={watchlist.some(w => w.id === item.id)}
                  onToggleWatchlist={onToggleWatchlist}
                  onToggleVIP={onToggleVIP}
                  downloadStatus={downloads[item.id]}
                  onStartDownload={onStartDownload}
                />
              ))}
            </div>
          </section>
        ) : (
          <>
            <RowSection 
              title="Continue Watching" 
              icon="fa-clock-rotate-left" 
              color="bg-violet-500" 
              items={recentlyWatched} 
              isContinuing={true}
              subTitle="Pick up where you left off"
            />
            
            <RowSection 
              title="My List" 
              icon="fa-bookmark" 
              color="bg-teal-500" 
              items={watchlist} 
              subTitle="Saved for later"
            />

            <RowSection 
              title="Airing Now" 
              icon="fa-broadcast-tower" 
              color="bg-red-500" 
              items={ongoingContent} 
              subTitle="Daily Updated Episodes"
            />

            <RowSection 
              title="VIP Global Selection" 
              icon="fa-crown" 
              color="bg-sky-400" 
              items={vipContent} 
              subTitle="Exclusive Premieres"
            />

            <RowSection 
              title="Upcoming Releases" 
              icon="fa-calendar-day" 
              color="bg-orange-500" 
              items={upcomingContent} 
              subTitle="Coming soon to Section E"
            />

            {/* Category Rows Generated Automatically */}
            {categories.filter(c => c !== 'All').map(genre => (
              <RowSection 
                key={genre}
                title={genre} 
                icon="fa-film" 
                color="bg-gray-500" 
                items={contentList.filter(i => i.category === genre)} 
                subTitle={`The best of ${genre}`}
              />
            ))}
          </>
        )}

        {filteredContent.length === 0 && (
          <div className="py-60 flex flex-col items-center justify-center text-gray-800 bg-gray-900/10 rounded-[64px] border-4 border-dashed border-white/5">
             <i className="fa-solid fa-ghost text-9xl mb-10 opacity-10"></i>
             <p className="text-3xl font-black uppercase tracking-widest opacity-20">No Titles Found</p>
             <button onClick={() => {setSearchTerm(''); setActiveCategory('All');}} className="mt-8 text-violet-500 font-black hover:text-violet-400 uppercase text-xs tracking-widest transition-all">Reset Discovery</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntertainmentView;
