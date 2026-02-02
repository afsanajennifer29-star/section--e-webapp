
import React, { useState, useEffect } from 'react';
import { Comment } from '../types';

interface CommentSectionProps {
  contentId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ contentId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const savedComments = localStorage.getItem(`sectionE_comments_${contentId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      setComments([]);
    }
  }, [contentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      contentId,
      userName: 'Streamer_01',
      text: newComment,
      timestamp: Date.now(),
      avatar: 'https://picsum.photos/seed/sectione/100'
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`sectionE_comments_${contentId}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  const deleteComment = (id: string) => {
    const updated = comments.filter(c => c.id !== id);
    setComments(updated);
    localStorage.setItem(`sectionE_comments_${contentId}`, JSON.stringify(updated));
  };

  return (
    <div className="w-full mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-white flex items-center">
          <i className="fa-solid fa-comments text-violet-500 mr-3"></i>
          Episode Discussion
          <span className="ml-4 text-xs bg-gray-800 text-gray-500 px-3 py-1 rounded-full font-bold">
            {comments.length}
          </span>
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-10 group">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-white/10">
            <img src="https://picsum.photos/seed/sectione/100" alt="me" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts on this episode?"
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all resize-none h-24 placeholder:text-gray-700 text-gray-300"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="absolute bottom-3 right-3 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-20 active:scale-95 shadow-lg shadow-violet-600/20"
            >
              Post Comment
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-800 border-2 border-dashed border-gray-800 rounded-[40px]">
            <i className="fa-solid fa-comment-slash text-4xl mb-4 opacity-10"></i>
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex-shrink-0 overflow-hidden border border-white/5">
                <img src={comment.avatar} alt={comment.userName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 group-hover:border-gray-700 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-black text-violet-400 uppercase tracking-tight">{comment.userName}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                      <span className="text-[10px] text-gray-600 font-bold">
                        {new Date(comment.timestamp).toLocaleDateString()} at {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-500 transition-all text-[10px]"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{comment.text}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2 ml-4">
                   <button className="text-[9px] font-black text-gray-600 uppercase hover:text-violet-400 transition-colors">Like</button>
                   <button className="text-[9px] font-black text-gray-600 uppercase hover:text-violet-400 transition-colors">Reply</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
