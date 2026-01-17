
import React, { useState } from 'react';
import { MOCK_BLOG_POSTS } from '../constants';
import { BlogPost as BlogPostType } from '../types';
import { Calendar, Clock, User, ArrowRight, Share2, Bookmark } from 'lucide-react';

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null);

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedPost(null)}
          className="mb-8 text-blue-500 hover:text-blue-400 flex items-center font-medium transition-colors"
        >
          <ArrowRight size={20} className="rotate-180 mr-2" />
          Back to Insights
        </button>
        
        <img 
          src={selectedPost.imageUrl} 
          alt={selectedPost.title} 
          className="w-full h-96 object-cover rounded-[2.5rem] mb-8 shadow-2xl"
        />
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest">
              {selectedPost.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar size={14} className="mr-2" />
              {selectedPost.date}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={14} className="mr-2" />
              {selectedPost.readTime}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{selectedPost.title}</h1>
          
          <div className="flex items-center space-x-4 py-4 border-y border-gray-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold">
              {selectedPost.author[0]}
            </div>
            <div>
              <div className="font-bold">{selectedPost.author}</div>
              <div className="text-xs text-gray-500">Nexus Financial Analyst</div>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-6 italic">
              {selectedPost.excerpt}
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              {selectedPost.content}
            </p>
            <p className="text-lg text-gray-400 leading-relaxed mt-4">
              Financial markets in the digital age are evolving at a pace unprecedented in human history. 
              The convergence of high-frequency trading, machine learning, and decentralized protocols 
              has created an environment where traditional metrics are being redefined. 
              Nexus continues to monitor these changes to provide our users with the most accurate 
              real-time assessments available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[3rem] p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Financial Intelligence</h2>
          <p className="text-blue-100 text-lg mb-8 opacity-80">
            Expert analysis, market trends, and educational resources to help you navigate the future of finance.
          </p>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 transition-colors">
              Featured Articles
            </button>
            <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
              Educational Guides
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1611974717482-48cd91000c14?auto=format&fit=crop&q=80&w=1200" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_BLOG_POSTS.map((post) => (
          <article 
            key={post.id} 
            className="bg-[#1e2329] rounded-[2.5rem] border border-gray-800 overflow-hidden group hover:border-blue-500/50 transition-all cursor-pointer flex flex-col shadow-lg hover:shadow-blue-500/5"
            onClick={() => setSelectedPost(post)}
          >
            <div className="h-56 overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 px-3 py-1 bg-blue-500/10 rounded-lg">
                  {post.category}
                </span>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"><Share2 size={16} /></button>
                  <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"><Bookmark size={16} /></button>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-xs">
                    {post.author[0]}
                  </div>
                  <div className="text-xs font-medium text-gray-400">{post.author}</div>
                </div>
                <div className="text-xs text-gray-600 font-mono italic">{post.readTime}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
