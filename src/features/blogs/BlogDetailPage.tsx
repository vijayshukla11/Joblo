import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Clock, Calendar, ChevronRight, Tag, BookOpen, Share2, ShieldCheck, HelpCircle } from 'lucide-react';
import { adminService, AdminBlog } from '../../services/adminService';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { LoadingState, EmptyState } from '../../components/common/StatusMessages';

interface BlogDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export default function BlogDetailPage({ slug, onNavigate }: BlogDetailPageProps) {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<AdminBlog | null>(null);
  const [related, setRelated] = useState<AdminBlog[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadBlog() {
      setLoading(true);
      try {
        const allBlogs = await adminService.getBlogs();
        // Match by slug (case-insensitive)
        const found = allBlogs.find(b => b.slug.toLowerCase() === slug.toLowerCase() || b.id === slug);
        setBlog(found || null);

        if (found) {
          // Find related articles (matching at least one category or tag, excluding current)
          const matched = allBlogs.filter(b => 
            b.id !== found.id && 
            b.status === 'Published' &&
            (b.categories?.some(c => found.categories?.includes(c)) || 
             b.tags?.some(t => found.tags?.includes(t)))
          ).slice(0, 3);
          setRelated(matched);
        }
      } catch (e) {
        console.error('Error loading blog detail:', e);
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-12">
        <LoadingState message="Restoring dynamic author transcripts and article metadata..." />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-12">
        <EmptyState 
          title="Editorial Article Not Found" 
          description="The requested career guide, compliance review, or blog article is not indexed in our database."
          actionText="Browse Sourcing Blog"
          onAction={() => onNavigate('/blogs')}
        />
      </div>
    );
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content ? content.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const formattedDate = blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'Published Recently';

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title={blog.seoTitle || `${blog.title} | JOB Lo`}
        description={blog.seoDescription || blog.excerpt}
        h1Text={blog.title}
      />

      <Breadcrumbs 
        items={[
          { label: 'Blog', path: '/blogs' },
          { label: blog.title }
        ]} 
        onNavigate={onNavigate} 
      />

      {/* Main Layout Grid */}
      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-10">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/blogs')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        {/* Article Meta Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {blog.categories?.map(cat => (
              <span key={cat} className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-[9px] font-bold text-emerald-800 rounded uppercase">
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight font-heading">
            {blog.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-sans">
            {blog.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-slate-100 py-3.5 text-xs text-gray-500 font-medium">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold font-mono">
                  {blog.author ? blog.author.substring(0, 2).toUpperCase() : 'AR'}
                </div>
                <span>By <strong className="text-gray-900">{blog.author || 'Admin Root'}</strong></span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedDate}</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{getReadingTime(blog.content)} min read</span>
              </span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:border-black rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer select-none transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied link!' : 'Share Article'}</span>
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-150 shadow-2xs">
          <img 
            src={blog.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'} 
            alt={blog.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article content */}
        <article className="prose prose-sm sm:prose max-w-none text-slate-800 leading-relaxed font-sans space-y-6">
          {blog.content ? (
            blog.content.split('\n\n').map((para, index) => {
              if (para.startsWith('###')) {
                return (
                  <h3 key={index} className="text-base sm:text-lg font-black text-slate-900 font-heading pt-3 border-b border-slate-50 pb-1 uppercase tracking-wider">
                    {para.replace('###', '').trim()}
                  </h3>
                );
              }
              if (para.startsWith('##')) {
                return (
                  <h2 key={index} className="text-lg sm:text-xl font-bold text-slate-900 font-heading pt-4 border-b border-slate-100 pb-1.5">
                    {para.replace('##', '').trim()}
                  </h2>
                );
              }
              if (para.startsWith('#')) {
                return (
                  <h1 key={index} className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading pt-6 border-b border-slate-250 pb-2">
                    {para.replace('#', '').trim()}
                  </h1>
                );
              }
              if (para.startsWith('-') || para.startsWith('*')) {
                const listItems = para.split('\n').map(li => li.replace(/^[-*]\s*/, '').trim());
                return (
                  <ul key={index} className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 font-medium">
                    {listItems.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {para}
                </p>
              );
            })
          ) : (
            <p className="text-gray-400 italic">This article has no content preview.</p>
          )}
        </article>

        {/* Compliance Footer Shield */}
        <div className="p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex items-start gap-3 mt-6">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800">Sourced Gazette & Corporate Transparency</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
              This publication has been compiled in total compliance with modern editorial standards. For questions, rectifications, or syndication licensing details, contact our editorial desk coordinates.
            </p>
          </div>
        </div>

        {/* Tags footer */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Tags:</span>
            </span>
            {blog.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-slate-100 text-[10px] font-semibold text-slate-600 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <section className="pt-10 border-t border-slate-150 space-y-5">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-heading flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Recommended Reading</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map(r => (
                <div 
                  key={r.id}
                  onClick={() => onNavigate(`/blog/${r.slug}`)}
                  className="bg-white p-4 border border-slate-100 hover:border-emerald-200 transition-all rounded-xl cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-indigo-700 uppercase">{r.categories?.[0]}</span>
                    <h4 className="text-xs font-extrabold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {r.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 pt-1 border-t border-slate-50">
                    <span>Read now</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
