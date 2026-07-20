import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Calendar, User, Clock, ChevronRight, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { adminService, AdminBlog, AdminCategory } from '../../services/adminService';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { LoadingState } from '../../components/common/StatusMessages';

interface BlogsPageProps {
  onNavigate: (path: string) => void;
}

export default function BlogsPage({ onNavigate }: BlogsPageProps) {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const allBlogs = await adminService.getBlogs();
        // Only show published blogs on public site
        const publishedBlogs = allBlogs.filter(b => b.status === 'Published');
        setBlogs(publishedBlogs);

        const cats = await adminService.getCategories();
        setCategories(cats);
      } catch (e) {
        console.error('Error loading blogs:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute all available tags
  const allTags = ['All', ...Array.from(new Set(blogs.flatMap(b => b.tags || [])))];

  // Filter Blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.content && blog.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' || 
      (blog.categories && blog.categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase()));

    const matchesTag = 
      selectedTag === 'All' || 
      (blog.tags && blog.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase()));

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Featured Blogs (First 2 published blogs that are marked or just latest)
  const featuredBlogs = filteredBlogs.slice(0, 2);
  const remainingBlogs = filteredBlogs.slice(2);

  // Pagination for remaining blogs
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = remainingBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(remainingBlogs.length / itemsPerPage);

  // Calculate reading time
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content ? content.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Sourcing Insights & Tech Career Blog | JOB Lo" 
        description="Read fact-checked tech blogs, recruitment compliance reviews, DPDP tutorials, and interview preparation blueprints on India's largest career CMS." 
        h1Text="JOB Lo Careers Insights & Blog"
      />

      <Breadcrumbs items={[{ label: 'Blog', path: '/blogs' }]} onNavigate={onNavigate} />

      {/* Header section */}
      <section className="bg-slate-50 border-b border-slate-100 py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-800 border border-emerald-100 uppercase tracking-wider select-none">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Certified Recruiter Editorial Board</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Sourcing Insights & Tech Blog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Read verified guides, software salary trends, and DPDP compliance logs written by top-tier HR advisors, software leaders, and executive directors.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Columns - Blog List */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <LoadingState message="Extracting career insights database..." />
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed rounded-2xl p-8">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-800">No Articles Found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                No blog articles match your current query or category filter. Try clearing filters to query all insights.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedTag('All');
                }}
                className="mt-4 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured Section */}
              {currentPage === 1 && featuredBlogs.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Featured Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredBlogs.map(blog => (
                      <article 
                        key={blog.id} 
                        onClick={() => onNavigate(`/blog/${blog.slug}`)}
                        className="bg-white border border-slate-200 hover:border-emerald-300 transition-all rounded-2xl overflow-hidden shadow-2xs cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <div className="h-48 overflow-hidden relative bg-slate-100">
                            <img 
                              src={blog.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'} 
                              alt={blog.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                              {blog.categories?.slice(0, 2).map(cat => (
                                <span key={cat} className="px-2 py-0.5 bg-black/75 backdrop-blur-xs text-[9px] font-bold text-white rounded uppercase">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="p-5 space-y-2.5">
                            <div className="flex items-center gap-3.5 text-[10px] text-gray-400 font-medium">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400" />
                                <span>{blog.author || 'Admin Root'}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{getReadingTime(blog.content)} min read</span>
                              </span>
                            </div>
                            
                            <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors font-heading">
                              {blog.title}
                            </h3>
                            
                            <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-2">
                              {blog.excerpt}
                            </p>
                          </div>
                        </div>

                        <div className="p-5 pt-0 border-t border-slate-50 flex items-center justify-between text-xs text-emerald-700 font-bold">
                          <span>Read Full Article</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Remaining Section */}
              <div className="space-y-4">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">
                  All Insights & Guides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(currentPage === 1 ? currentBlogs : filteredBlogs.slice(indexOfFirstItem, indexOfLastItem)).map(blog => (
                    <article 
                      key={blog.id} 
                      onClick={() => onNavigate(`/blog/${blog.slug}`)}
                      className="bg-white border border-slate-100 hover:border-emerald-200 transition-all rounded-2xl overflow-hidden shadow-3xs cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-36 overflow-hidden relative bg-slate-50">
                          <img 
                            src={blog.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'} 
                            alt={blog.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                        </div>
                        
                        <div className="p-4 space-y-2">
                          <span className="text-[9px] font-bold text-indigo-700 uppercase block">
                            {blog.categories?.[0] || 'Uncategorized'}
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                            {blog.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                            {blog.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                        <span>Read article</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 text-xs text-slate-500 font-medium">
                    <span>
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, remainingBlogs.length)} of {remainingBlogs.length} remaining articles
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-1 border border-slate-250 rounded-lg bg-white disabled:opacity-50 cursor-pointer hover:bg-slate-50"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="font-bold px-2">Page {currentPage} of {totalPages}</span>
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-1 border border-slate-250 rounded-lg bg-white disabled:opacity-50 cursor-pointer hover:bg-slate-50"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - Filters */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* SEARCH FIELD */}
          <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Search Articles</h3>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Query keyword, tag..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:outline-none focus:border-emerald-600 rounded-lg font-sans text-gray-800"
              />
            </div>
          </div>

          {/* CATEGORY DIRECTORY */}
          <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-2.5">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Category Index</h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedCategory === 'All' 
                    ? 'bg-emerald-50 text-emerald-800' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full">
                  {blogs.length}
                </span>
              </button>
              {categories.map(cat => {
                const count = blogs.filter(b => b.categories?.some(bc => bc.toLowerCase() === cat.name.toLowerCase())).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase() 
                        ? 'bg-emerald-50 text-emerald-800' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAG CLOUD */}
          <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-2.5">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Tag Cloud</h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {allTags.map(tag => {
                const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer select-none border uppercase tracking-wider ${
                      isSelected 
                        ? 'bg-zinc-950 text-white border-zinc-950' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    {tag === 'All' ? 'All Tags' : `#${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}
