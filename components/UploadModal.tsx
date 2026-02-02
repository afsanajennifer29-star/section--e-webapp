
import React, { useState } from 'react';
import { DramaCategory, ContentItem } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (item: ContentItem) => void;
}

const CATEGORIES: DramaCategory[] = [
  'K-Drama', 'C-Drama', 'J-Drama', 'Filipino', 'Thai', 'Anime', 'Hollywood', 'Movies'
];

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'K-Drama' as DramaCategory,
    thumbnail: '',
    videoUrl: '', // New field for the source link
    description: '',
    releaseYear: new Date().getFullYear(),
    isVIP: false,
    actors: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // Simulate an asynchronous upload process
    setTimeout(() => {
      // Fix: Added missing 'status' property to match ContentItem type definition
      const newItem: ContentItem = {
        id: `user-${Date.now()}`,
        title: formData.title,
        category: formData.category,
        thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400&h=600',
        videoUrl: formData.videoUrl, // Passing the source URL
        status: 'Completed',
        rating: 5.0,
        isVIP: formData.isVIP,
        description: formData.description,
        releaseYear: formData.releaseYear,
        subtitles: [{ id: 'en', label: 'English', lang: 'en' }],
        actors: formData.actors.split(',').map(a => a.trim()).filter(a => a !== '')
      };

      onUpload(newItem);
      setIsUploading(false);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        category: 'K-Drama',
        thumbnail: '',
        videoUrl: '',
        description: '',
        releaseYear: new Date().getFullYear(),
        isVIP: false,
        actors: ''
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-gray-900 border border-gray-700 rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-violet-600/5 to-transparent">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-600/20">
              <i className="fa-solid fa-link text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Universal Upload</h2>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Supports Any Video Source Link</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isUploading}
            className="text-gray-600 hover:text-white transition-all transform hover:rotate-90 disabled:opacity-30"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-violet-500 uppercase tracking-widest ml-1">Series Title</label>
            <input
              required
              disabled={isUploading}
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-800/40 border border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-gray-700 disabled:opacity-50"
              placeholder="e.g. Ang Mutya ng Section E"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-violet-500 uppercase tracking-widest ml-1">Video Source Link (Direct URL)</label>
            <input
              required
              disabled={isUploading}
              value={formData.videoUrl}
              onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full bg-gray-800/40 border border-teal-500/30 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all placeholder:text-gray-700 disabled:opacity-50"
              placeholder="https://any-site.com/video.mp4"
            />
            <p className="text-[8px] text-gray-500 mt-1 italic">Paste URLs from any web host or direct video links.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-violet-500 uppercase tracking-widest ml-1">Classification</label>
              <select
                disabled={isUploading}
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as DramaCategory })}
                className="w-full bg-gray-800/40 border border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all appearance-none text-gray-300 disabled:opacity-50"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-violet-500 uppercase tracking-widest ml-1">Production Year</label>
              <input
                disabled={isUploading}
                type="number"
                value={formData.releaseYear}
                onChange={e => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
                className="w-full bg-gray-800/40 border border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-violet-500 uppercase tracking-widest ml-1">Lead Cast</label>
            <input
              disabled={isUploading}
              value={formData.actors}
              onChange={e => setFormData({ ...formData, actors: e.target.value })}
              className="w-full bg-gray-800/40 border border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all disabled:opacity-50"
              placeholder="Names separated by commas"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-violet-500 uppercase tracking-widest ml-1">Cover Art URL</label>
            <input
              disabled={isUploading}
              value={formData.thumbnail}
              onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full bg-gray-800/40 border border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all disabled:opacity-50"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-violet-500 uppercase tracking-widest ml-1">Narrative Summary</label>
            <textarea
              required
              disabled={isUploading}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800/40 border border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all h-20 resize-none placeholder:text-gray-700 disabled:opacity-50"
              placeholder="Provide a brief synopsis..."
            />
          </div>

          <div className="flex items-center space-x-3 p-3 bg-violet-600/5 rounded-xl border border-violet-500/10">
            <input
              disabled={isUploading}
              type="checkbox"
              id="isVIP"
              checked={formData.isVIP}
              onChange={e => setFormData({ ...formData, isVIP: e.target.checked })}
              className="w-4 h-4 accent-violet-600 rounded-lg cursor-pointer disabled:opacity-50"
            />
            <label htmlFor="isVIP" className="text-[9px] font-black text-gray-500 cursor-pointer uppercase tracking-widest">
              Set as Premium (VIP) Content
            </label>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-3 border border-gray-700 rounded-xl text-xs font-bold text-gray-500 hover:text-white hover:bg-gray-800 transition-all disabled:opacity-30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-violet-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <span className="flex items-center justify-center">
                  <i className="fa-solid fa-circle-notch animate-spin mr-2"></i>
                  Indexing...
                </span>
              ) : (
                'Publish Content'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
