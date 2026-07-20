import React, { useState, useEffect } from 'react';
import { 
  BookOpen, FolderHeart, Compass, Plus, Trash2, Edit2, Search, 
  X, Check, AlertCircle, FileText, Image as ImageIcon, Tag, Link2, 
  ChevronRight, Hash, Eye, Globe, Calendar, ArrowLeft, ArrowRight, User, Sparkles
} from 'lucide-react';
import { adminService, AdminCategory, AdminBlog, CareerResource } from '../../../services/adminService';

type EditorialSubTab = 'blogs' | 'categories' | 'resources';

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
];

const AVAILABLE_AUTHORS = [
  'Ritu Sen',
  'Dr. Arvinder Singh',
  'Admin Root',
  'Siddharth Sen'
];

export default function ContentAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<EditorialSubTab>('blogs');
  const [loading, setLoading] = useState(true);

  // Core collections
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [resources, setResources] = useState<CareerResource[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [blogStatusFilter, setBlogStatusFilter] = useState<'All' | 'Draft' | 'Published'>('All');
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState<string>('All');

  // Pagination states
  const [blogPage, setBlogPage] = useState(1);
  const [catPage, setCatPage] = useState(1);
  const [resPage, setResPage] = useState(1);
  const itemsPerPage = 5;

  // Bulk Actions states
  const [selectedBlogIds, setSelectedBlogIds] = useState<string[]>([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);

  // Modals / Forms Open States
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [isResFormOpen, setIsResFormOpen] = useState(false);

  // Form Tabs (Edit vs. High-Fidelity Preview)
  const [blogFormTab, setBlogFormTab] = useState<'edit' | 'preview'>('edit');
  const [resFormTab, setResFormTab] = useState<'edit' | 'preview'>('edit');

  // Form Editing Targets
  const [editingBlog, setEditingBlog] = useState<AdminBlog | null>(null);
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [editingRes, setEditingRes] = useState<CareerResource | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  // --- FORM FIELD STATES ---
  // 1. Blog Form state
  const [blogData, setBlogData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'Draft' as 'Draft' | 'Published',
    selectedCats: [] as string[],
    tags: '',
    featuredImage: '',
    author: 'Ritu Sen',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  // 2. Category Form state
  const [catData, setCatData] = useState({
    name: '',
    parentCategory: '',
    icon: '💻',
    ordering: 1,
    seoSlug: '',
    description: '',
  });

  // 3. Resource Form state
  const [resData, setResData] = useState({
    title: '',
    category: 'Resume Tips' as CareerResource['category'],
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    topicOrRole: '',
    excerpt: '',
    content: '',
    links: '', // Comma list name:url
    seoTitle: '',
    seoDescription: '',
    slug: '',
  });

  // Slugifier Helper
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Sync title to slug automatically if untouched
  const handleBlogTitleChange = (val: string) => {
    const isEditing = !!editingBlog;
    const previousSlug = slugify(blogData.title);
    const hasCustomSlug = blogData.slug !== previousSlug && blogData.slug !== '';

    setBlogData(prev => {
      const updated = { ...prev, title: val };
      if (!isEditing && !hasCustomSlug) {
        updated.slug = slugify(val);
      }
      return updated;
    });
  };

  const handleResTitleChange = (val: string) => {
    const isEditing = !!editingRes;
    const previousSlug = slugify(resData.title);
    const hasCustomSlug = resData.slug !== previousSlug && resData.slug !== '';

    setResData(prev => {
      const updated = { ...prev, title: val };
      if (!isEditing && !hasCustomSlug) {
        updated.slug = slugify(val);
      }
      return updated;
    });
  };

  const handleCatNameChange = (val: string) => {
    const isEditing = !!editingCat;
    const previousSlug = slugify(catData.name);
    const hasCustomSlug = catData.seoSlug !== previousSlug && catData.seoSlug !== '';

    setCatData(prev => {
      const updated = { ...prev, name: val };
      if (!isEditing && !hasCustomSlug) {
        updated.seoSlug = slugify(val);
      }
      return updated;
    });
  };

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const b = await adminService.getBlogs();
      const c = await adminService.getCategories();
      const r = await adminService.getCareerResources();
      setBlogs(b);
      setCategories(c);
      setResources(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  // --- BLOG HANDLERS ---
  const handleOpenAddBlog = () => {
    setEditingBlog(null);
    setFormError(null);
    setBlogFormTab('edit');
    setBlogData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      status: 'Draft',
      selectedCats: [],
      tags: 'career, tech, guides',
      featuredImage: PRESET_IMAGES[0],
      author: 'Ritu Sen',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: 'career growth, technical guides, recruitment',
    });
    setIsBlogFormOpen(true);
  };

  const handleOpenEditBlog = (blog: AdminBlog) => {
    setEditingBlog(blog);
    setFormError(null);
    setBlogFormTab('edit');
    setBlogData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      status: blog.status,
      selectedCats: blog.categories,
      tags: blog.tags.join(', '),
      featuredImage: blog.featuredImage,
      author: blog.author || 'Ritu Sen',
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || '',
      seoKeywords: blog.seoKeywords || '',
    });
    setIsBlogFormOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!blogData.title.trim() || !blogData.slug.trim() || !blogData.content.trim()) {
      setFormError('Blog title, slug, and core markdown content are required.');
      return;
    }

    try {
      const parsedTags = blogData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const payload: AdminBlog = {
        id: editingBlog ? editingBlog.id : `blog-${Date.now()}`,
        title: blogData.title,
        slug: blogData.slug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        excerpt: blogData.excerpt,
        content: blogData.content,
        status: blogData.status,
        categories: blogData.selectedCats,
        tags: parsedTags,
        featuredImage: blogData.featuredImage,
        author: blogData.author,
        seoTitle: blogData.seoTitle || blogData.title,
        seoDescription: blogData.seoDescription || blogData.excerpt,
        seoKeywords: blogData.seoKeywords,
        created_at: editingBlog ? editingBlog.created_at : new Date().toISOString(),
      };

      await adminService.saveBlog(payload);
      setIsBlogFormOpen(false);
      await loadAllContent();
      setSelectedBlogIds([]);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save blog post.');
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm('Delete this blog post permanently?')) return;
    try {
      await adminService.deleteBlog(blogId);
      await loadAllContent();
      setSelectedBlogIds(prev => prev.filter(id => id !== blogId));
    } catch (err) {
      console.error(err);
    }
  };

  // --- CATEGORY HANDLERS ---
  const handleOpenAddCat = () => {
    setEditingCat(null);
    setFormError(null);
    setCatData({
      name: '',
      parentCategory: '',
      icon: '💻',
      ordering: categories.length + 1,
      seoSlug: '',
      description: '',
    });
    setIsCatFormOpen(true);
  };

  const handleOpenEditCat = (cat: AdminCategory) => {
    setEditingCat(cat);
    setFormError(null);
    setCatData({
      name: cat.name,
      parentCategory: cat.parentCategory || '',
      icon: cat.icon,
      ordering: cat.ordering,
      seoSlug: cat.seoSlug,
      description: cat.description,
    });
    setIsCatFormOpen(true);
  };

  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!catData.name.trim() || !catData.seoSlug.trim()) {
      setFormError('Category name and SEO friendly slug are required.');
      return;
    }

    try {
      const payload: AdminCategory = {
        id: editingCat ? editingCat.id : `cat-${Date.now()}`,
        name: catData.name,
        parentCategory: catData.parentCategory || undefined,
        icon: catData.icon,
        ordering: Number(catData.ordering),
        seoSlug: catData.seoSlug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        description: catData.description,
      };

      await adminService.saveCategory(payload);
      setIsCatFormOpen(false);
      await loadAllContent();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save category.');
    }
  };

  const handleDeleteCat = async (catId: string) => {
    if (!window.confirm('Delete this category permanently?')) return;
    try {
      await adminService.deleteCategory(catId);
      await loadAllContent();
    } catch (err) {
      console.error(err);
    }
  };

  // --- CAREER RESOURCES HANDLERS ---
  const handleOpenAddRes = () => {
    setEditingRes(null);
    setFormError(null);
    setResFormTab('edit');
    setResData({
      title: '',
      category: 'Resume Tips',
      difficulty: 'Easy',
      topicOrRole: 'All Professions',
      excerpt: '',
      content: '',
      links: '',
      seoTitle: '',
      seoDescription: '',
      slug: '',
    });
    setIsResFormOpen(true);
  };

  const handleOpenEditRes = (res: CareerResource) => {
    setEditingRes(res);
    setFormError(null);
    setResFormTab('edit');
    const serializedLinks = res.links ? res.links.map(l => `${l.name}:${l.url}`).join(', ') : '';
    setResData({
      title: res.title,
      category: res.category,
      difficulty: res.difficulty || 'Easy',
      topicOrRole: res.topicOrRole || '',
      excerpt: res.excerpt,
      content: res.content,
      links: serializedLinks,
      seoTitle: res.seoTitle || '',
      seoDescription: res.seoDescription || '',
      slug: res.id,
    });
    setIsResFormOpen(true);
  };

  const handleSaveRes = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!resData.title.trim() || !resData.content.trim()) {
      setFormError('Resource title and body content are required.');
      return;
    }

    try {
      const parsedLinks = resData.links
        .split(',')
        .map(pair => {
          const parts = pair.split(':');
          if (parts.length >= 2) {
            const name = parts[0].trim();
            const url = parts.slice(1).join(':').trim();
            if (name && url) return { name, url };
          }
          return null;
        })
        .filter((l): l is { name: string; url: string } => l !== null);

      const generatedId = editingRes ? editingRes.id : `res-${slugify(resData.title) || Date.now()}`;

      const payload: CareerResource = {
        id: generatedId,
        title: resData.title,
        category: resData.category,
        difficulty: resData.difficulty,
        topicOrRole: resData.topicOrRole,
        excerpt: resData.excerpt,
        content: resData.content,
        links: parsedLinks,
        seoTitle: resData.seoTitle || resData.title,
        seoDescription: resData.seoDescription || resData.excerpt,
      };

      await adminService.saveCareerResource(payload);
      setIsResFormOpen(false);
      await loadAllContent();
      setSelectedResourceIds([]);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save career resource.');
    }
  };

  const handleDeleteRes = async (resId: string) => {
    if (!window.confirm('Delete this career resource permanently?')) return;
    try {
      await adminService.deleteCareerResource(resId);
      await loadAllContent();
      setSelectedResourceIds(prev => prev.filter(id => id !== resId));
    } catch (err) {
      console.error(err);
    }
  };

  // --- BULK ACTION HANDLERS ---
  const handleBulkPublishBlogs = async () => {
    if (selectedBlogIds.length === 0) return;
    try {
      await Promise.all(
        selectedBlogIds.map(async (id) => {
          const blog = blogs.find(b => b.id === id);
          if (blog) {
            await adminService.saveBlog({ ...blog, status: 'Published' });
          }
        })
      );
      await loadAllContent();
      setSelectedBlogIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDraftBlogs = async () => {
    if (selectedBlogIds.length === 0) return;
    try {
      await Promise.all(
        selectedBlogIds.map(async (id) => {
          const blog = blogs.find(b => b.id === id);
          if (blog) {
            await adminService.saveBlog({ ...blog, status: 'Draft' });
          }
        })
      );
      await loadAllContent();
      setSelectedBlogIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDeleteBlogs = async () => {
    if (selectedBlogIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedBlogIds.length} blogs permanently?`)) return;
    try {
      await Promise.all(selectedBlogIds.map(id => adminService.deleteBlog(id)));
      await loadAllContent();
      setSelectedBlogIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDeleteResources = async () => {
    if (selectedResourceIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedResourceIds.length} resources permanently?`)) return;
    try {
      await Promise.all(selectedResourceIds.map(id => adminService.deleteCareerResource(id)));
      await loadAllContent();
      setSelectedResourceIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDifficultyResources = async (diff: 'Easy' | 'Medium' | 'Hard') => {
    if (selectedResourceIds.length === 0) return;
    try {
      await Promise.all(
        selectedResourceIds.map(async (id) => {
          const res = resources.find(r => r.id === id);
          if (res) {
            await adminService.saveCareerResource({ ...res, difficulty: diff });
          }
        })
      );
      await loadAllContent();
      setSelectedResourceIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  // --- FILTERS & SEARCH ---
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = blogStatusFilter === 'All' || b.status === blogStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResources = resources.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.topicOrRole && r.topicOrRole.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = resourceCategoryFilter === 'All' || r.category === resourceCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // --- PAGINATION MATHEMATICS ---
  const getPaginatedItems = (items: any[], currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalBlogPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;
  const totalCatPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const totalResPages = Math.ceil(filteredResources.length / itemsPerPage) || 1;

  const currentBlogs = getPaginatedItems(filteredBlogs, blogPage);
  const currentCategories = getPaginatedItems(filteredCategories, catPage);
  const currentResources = getPaginatedItems(filteredResources, resPage);

  // Sync pages if filtered bounds change
  useEffect(() => { setBlogPage(1); }, [searchQuery, blogStatusFilter]);
  useEffect(() => { setCatPage(1); }, [searchQuery]);
  useEffect(() => { setResPage(1); }, [searchQuery, resourceCategoryFilter]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Platform Content & Editorial CMS</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Draft blogs, verify categories, configure SEO indices, and curate professional career prep resources.
          </p>
        </div>

        {!isBlogFormOpen && !isCatFormOpen && !isResFormOpen && (
          <div className="self-start sm:self-auto shrink-0">
            {activeSubTab === 'blogs' && (
              <button
                onClick={handleOpenAddBlog}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer select-none"
              >
                <Plus className="w-4 h-4" />
                <span>Write Blog Post</span>
              </button>
            )}
            {activeSubTab === 'categories' && (
              <button
                onClick={handleOpenAddCat}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer select-none"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Category</span>
              </button>
            )}
            {activeSubTab === 'resources' && (
              <button
                onClick={handleOpenAddRes}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer select-none"
              >
                <Plus className="w-4 h-4" />
                <span>Index Career Resource</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* SUB TABS NAVIGATION */}
      <div className="flex gap-2 border-b border-slate-100">
        <button
          onClick={() => { setActiveSubTab('blogs'); setSearchQuery(''); }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'blogs' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Blogs CMS ({blogs.length})</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('categories'); setSearchQuery(''); }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'categories' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FolderHeart className="w-3.5 h-3.5" />
          <span>Category Directory ({categories.length})</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('resources'); setSearchQuery(''); }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'resources' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Career Prep Curations ({resources.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 font-medium">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-xs">Querying editorial assets...</span>
        </div>
      ) : (
        <>
          {/* SEARCH & FILTERS COMPONENTS */}
          {!isBlogFormOpen && !isCatFormOpen && !isResFormOpen && (
            <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={`Search in ${activeSubTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
                />
              </div>

              {activeSubTab === 'blogs' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Status:</span>
                  <select
                    value={blogStatusFilter}
                    onChange={(e: any) => setBlogStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published Only</option>
                    <option value="Draft">Drafts Only</option>
                  </select>
                </div>
              )}

              {activeSubTab === 'resources' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Category:</span>
                  <select
                    value={resourceCategoryFilter}
                    onChange={(e: any) => setResourceCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Resume Tips">Resume Tips</option>
                    <option value="Interview Questions">Interview Questions</option>
                    <option value="Salary Guides">Salary Guides</option>
                    <option value="Career Guides">Career Guides</option>
                    <option value="Skill Roadmaps">Skill Roadmaps</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* BULK ACTION PANEL FOR BLOGS */}
          {activeSubTab === 'blogs' && selectedBlogIds.length > 0 && !isBlogFormOpen && (
            <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl text-xs animate-fadeIn">
              <span className="font-bold text-emerald-800">
                {selectedBlogIds.length} blog posts selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkPublishBlogs}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Publish Selected
                </button>
                <button
                  onClick={handleBulkDraftBlogs}
                  className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Revert to Drafts
                </button>
                <button
                  onClick={handleBulkDeleteBlogs}
                  className="px-3 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* BULK ACTION PANEL FOR RESOURCES */}
          {activeSubTab === 'resources' && selectedResourceIds.length > 0 && !isResFormOpen && (
            <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl text-xs animate-fadeIn">
              <span className="font-bold text-emerald-800">
                {selectedResourceIds.length} prep guides selected
              </span>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleBulkDifficultyResources('Easy')}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Set Easy
                </button>
                <button
                  onClick={() => handleBulkDifficultyResources('Medium')}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Set Medium
                </button>
                <button
                  onClick={() => handleBulkDifficultyResources('Hard')}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Set Hard
                </button>
                <button
                  onClick={handleBulkDeleteResources}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* 1. BLOG POSTS EDITOR WITH LIVE PREVIEW TAB */}
          {isBlogFormOpen && (
            <div className="space-y-4 text-left animate-fadeIn">
              
              {/* TAB SELECTOR FOR FORM EDITOR */}
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-150">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBlogFormTab('edit')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                      blogFormTab === 'edit' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Specifications Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogFormTab('preview')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                      blogFormTab === 'preview' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>👁️ Live Preview Mode</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBlogFormOpen(false)}
                  className="p-1 hover:bg-slate-200 rounded-lg"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {blogFormTab === 'edit' ? (
                <form onSubmit={handleSaveBlog} className="bg-slate-50/40 border border-slate-150 p-5 rounded-2xl space-y-4">
                  {formError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Blog Post Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. A Complete Guide to Next.js 15 Performance"
                        value={blogData.title}
                        onChange={(e) => handleBlogTitleChange(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-slate-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 block">SEO Friendly Slug *</label>
                        <button
                          type="button"
                          onClick={() => setBlogData({ ...blogData, slug: slugify(blogData.title) })}
                          className="text-[10px] text-emerald-600 hover:underline font-bold"
                        >
                          Auto-generate slug
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="nextjs-15-performance"
                        value={blogData.slug}
                        onChange={(e) => setBlogData({ ...blogData, slug: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-mono font-bold focus:outline-none focus:border-slate-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Author *</label>
                      <select
                        value={blogData.author}
                        onChange={(e) => setBlogData({ ...blogData, author: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-bold focus:outline-none"
                      >
                        {AVAILABLE_AUTHORS.map(auth => (
                          <option key={auth} value={auth}>{auth}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Featured Image Preset URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={blogData.featuredImage}
                          onChange={(e) => setBlogData({ ...blogData, featuredImage: e.target.value })}
                          className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                        />
                        <div className="flex gap-1">
                          {PRESET_IMAGES.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setBlogData({ ...blogData, featuredImage: img })}
                              className={`w-8 h-8 rounded-lg overflow-hidden border-2 ${
                                blogData.featuredImage === img ? 'border-emerald-500' : 'border-transparent'
                              }`}
                            >
                              <img src={img} alt="preset" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">Short Excerpt / Summary *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Short engaging description for listing pages..."
                        value={blogData.excerpt}
                        onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-slate-400"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">Core Article Content (Markdown support) *</label>
                      <textarea
                        rows={6}
                        required
                        placeholder="Type standard headings and paragraphs here..."
                        value={blogData.content}
                        onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-slate-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="nextjs, react, frontend"
                        value={blogData.tags}
                        onChange={(e) => setBlogData({ ...blogData, tags: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Publishing Status Mode</label>
                      <div className="flex gap-4 pt-1.5">
                        {['Draft', 'Published'].map(st => (
                          <label key={st} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="blog-status"
                              value={st}
                              checked={blogData.status === st}
                              onChange={(e: any) => setBlogData({ ...blogData, status: e.target.value })}
                              className="text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                            />
                            <span>{st}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2 bg-white p-3.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Category Associations</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        {categories.map(cat => (
                          <label key={cat.id} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={blogData.selectedCats.includes(cat.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBlogData({ ...blogData, selectedCats: [...blogData.selectedCats, cat.name] });
                                } else {
                                  setBlogData({ ...blogData, selectedCats: blogData.selectedCats.filter(n => n !== cat.name) });
                                }
                              }}
                              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                            />
                            <span>{cat.icon} {cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* SEO FIELDS & GOOGLE MOCK SNIPPET */}
                    <div className="md:col-span-2 space-y-4 border-t border-slate-150 pt-4">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide font-heading flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span>SEO Metadata Configuration</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">SEO Meta Title Overwrite</label>
                          <input
                            type="text"
                            placeholder="Defaults to blog title"
                            value={blogData.seoTitle}
                            onChange={(e) => setBlogData({ ...blogData, seoTitle: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">SEO Keywords Tags</label>
                          <input
                            type="text"
                            placeholder="e.g. Next.js 15, React 19 Compiler, Web Performance"
                            value={blogData.seoKeywords}
                            onChange={(e) => setBlogData({ ...blogData, seoKeywords: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 block">SEO Meta Description Overwrite</label>
                          <textarea
                            rows={2}
                            placeholder="Defaults to short excerpt"
                            value={blogData.seoDescription}
                            onChange={(e) => setBlogData({ ...blogData, seoDescription: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-medium"
                          />
                        </div>
                      </div>

                      {/* Google Search Result Preview */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Google SERP Index Preview</span>
                        <div className="pt-2">
                          <div className="text-[14px] text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug">
                            {blogData.seoTitle || blogData.title || 'Untitled Blog Post | JOB Lo'}
                          </div>
                          <div className="text-[12px] text-[#006621] leading-none mt-0.5">
                            https://joblo.in/blog/{blogData.slug || 'slug-placeholder'}
                          </div>
                          <div className="text-[12px] text-[#545454] leading-relaxed mt-1 max-w-2xl">
                            {blogData.seoDescription || blogData.excerpt || 'Please provide an excerpt description to view the google indexed search snippets.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsBlogFormOpen(false)}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {editingBlog ? 'Update Blog Specifications' : 'Publish Blog Post'}
                    </button>
                  </div>
                </form>
              ) : (
                /* HIGH FIDELITY BLOG LIVE PREVIEW MODE */
                <div className="bg-white border border-slate-150 rounded-2xl p-6 md:p-8 space-y-6 text-slate-800 animate-fadeIn shadow-2xs max-w-3xl mx-auto">
                  
                  {/* Category badging */}
                  <div className="flex flex-wrap gap-2">
                    {blogData.selectedCats.length > 0 ? (
                      blogData.selectedCats.map(cat => (
                        <span key={cat} className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 rounded">
                          {cat}
                        </span>
                      ))
                    ) : (
                      <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-400 rounded">
                        General Editorial
                      </span>
                    )}
                  </div>

                  {/* Blog Title */}
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-950 font-heading">
                    {blogData.title || 'Untitled Blog Post'}
                  </h1>

                  {/* Author Meta Card */}
                  <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                    <span className="w-10 h-10 rounded-full bg-slate-900/10 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                      {blogData.author[0]}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>{blogData.author}</span>
                        <span className="bg-emerald-50 text-[8px] font-extrabold text-emerald-700 px-1 py-0.2 rounded border border-emerald-100 uppercase tracking-wide">Verified Advisor</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">Published on {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} • 5 Min Read</p>
                    </div>
                  </div>

                  {/* Featured Image placeholder or URL */}
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={blogData.featuredImage || PRESET_IMAGES[0]}
                      alt="Featured Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Standfirst Excerpt */}
                  <p className="text-xs md:text-sm text-slate-600 font-medium italic border-l-4 border-slate-300 pl-4 py-1 leading-relaxed">
                    {blogData.excerpt || 'Provide a brief excerpt summary of the post...'}
                  </p>

                  {/* Main content body (Rendered beautifully with spacing) */}
                  <div className="prose prose-sm max-w-none text-slate-700 text-xs leading-relaxed space-y-4 pt-2">
                    {blogData.content ? (
                      blogData.content.split('\n').map((para, i) => {
                        if (para.startsWith('# ')) {
                          return <h2 key={i} className="text-sm font-extrabold text-slate-950 pt-3">{para.replace('# ', '')}</h2>;
                        }
                        if (para.startsWith('## ')) {
                          return <h3 key={i} className="text-xs font-extrabold text-slate-950 pt-2">{para.replace('## ', '')}</h3>;
                        }
                        if (para.trim() === '') return null;
                        return <p key={i} className="leading-relaxed font-sans">{para}</p>;
                      })
                    ) : (
                      <p className="text-slate-400 italic">No post specifications content defined yet.</p>
                    )}
                  </div>

                  {/* Tags */}
                  {blogData.tags && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-6 border-t border-slate-100">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider mr-1">Tags:</span>
                      {blogData.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="bg-slate-100 border border-slate-150 text-slate-600 font-semibold px-2 py-0.5 rounded text-[10px]">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. CATEGORY FORM */}
          {isCatFormOpen && (
            <form onSubmit={handleSaveCat} className="bg-slate-50/60 border border-slate-150 p-5 rounded-2xl space-y-4 text-left animate-fadeIn">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-1.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Design Systems"
                    value={catData.name}
                    onChange={(e) => handleCatNameChange(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Parent Category (If nested)</label>
                  <select
                    value={catData.parentCategory}
                    onChange={(e) => setCatData({ ...catData, parentCategory: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-bold focus:outline-none"
                  >
                    <option value="">-- No Parent (Top Level) --</option>
                    {categories.filter(c => !c.parentCategory && c.id !== (editingCat?.id || '')).map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Emoji Icon representation</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={catData.icon}
                    onChange={(e) => setCatData({ ...catData, icon: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Ordering / Sort Index</label>
                  <input
                    type="number"
                    required
                    value={catData.ordering}
                    onChange={(e) => setCatData({ ...catData, ordering: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">SEO Friendly Slug *</label>
                    <button
                      type="button"
                      onClick={() => setCatData({ ...catData, seoSlug: slugify(catData.name) })}
                      className="text-[10px] text-emerald-600 hover:underline font-bold"
                    >
                      Auto-generate slug
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="design-systems-jobs"
                    value={catData.seoSlug}
                    onChange={(e) => setCatData({ ...catData, seoSlug: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-mono font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Detailed Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief definition of what this category encompasses..."
                    value={catData.description}
                    onChange={(e) => setCatData({ ...catData, description: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCatFormOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  {editingCat ? 'Update Category Specs' : 'Add Category'}
                </button>
              </div>
            </form>
          )}

          {/* 3. CAREER PREP RESOURCES EDITOR WITH LIVE PREVIEW */}
          {isResFormOpen && (
            <div className="space-y-4 text-left animate-fadeIn">
              
              {/* TAB SELECTOR FOR CAREER RESOURCE */}
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-150">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setResFormTab('edit')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                      resFormTab === 'edit' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Specifications Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setResFormTab('preview')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                      resFormTab === 'preview' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>👁️ Live Preview Mode</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResFormOpen(false)}
                  className="p-1 hover:bg-slate-200 rounded-lg"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {resFormTab === 'edit' ? (
                <form onSubmit={handleSaveRes} className="bg-slate-50/40 border border-slate-150 p-5 rounded-2xl space-y-4">
                  {formError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">Guide / Preparation Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Modern ATS-Friendly Resume Construction Blueprint"
                        value={resData.title}
                        onChange={(e) => handleResTitleChange(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Editorial Category</label>
                      <select
                        value={resData.category}
                        onChange={(e: any) => setResData({ ...resData, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-bold focus:outline-none"
                      >
                        <option value="Resume Tips">Resume Tips</option>
                        <option value="Interview Questions">Interview Questions</option>
                        <option value="Salary Guides">Salary Guides</option>
                        <option value="Career Guides">Career Guides</option>
                        <option value="Skill Roadmaps">Skill Roadmaps</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Difficulty Score</label>
                      <select
                        value={resData.difficulty}
                        onChange={(e: any) => setResData({ ...resData, difficulty: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-bold focus:outline-none"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Target Profession or Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Frontend Engineer, Product Design"
                        value={resData.topicOrRole}
                        onChange={(e) => setResData({ ...resData, topicOrRole: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">External Prep Resource Links (comma: name:url)</label>
                      <input
                        type="text"
                        placeholder="System Design Prep:https://system.com, ATS checker:https://ats.com"
                        value={resData.links}
                        onChange={(e) => setResData({ ...resData, links: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-mono"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">Short Summary Excerpt *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Brief description matching the catalog lists..."
                        value={resData.excerpt}
                        onChange={(e) => setResData({ ...resData, excerpt: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-medium focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">Curated Resource Content (Core body text) *</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Detailed study content or step-by-step tips..."
                        value={resData.content}
                        onChange={(e) => setResData({ ...resData, content: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-medium focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-3.5 border-t border-slate-150 pt-4">
                      <span className="text-xs font-bold text-slate-700 block uppercase font-mono">SEO Settings Override</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">SEO Meta Title</label>
                          <input
                            type="text"
                            placeholder="Defaults to guide title"
                            value={resData.seoTitle}
                            onChange={(e) => setResData({ ...resData, seoTitle: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">SEO Meta Description</label>
                          <input
                            type="text"
                            placeholder="Defaults to summary excerpt"
                            value={resData.seoDescription}
                            onChange={(e) => setResData({ ...resData, seoDescription: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsResFormOpen(false)}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {editingRes ? 'Update Editorial Asset' : 'Index Editorial Asset'}
                    </button>
                  </div>
                </form>
              ) : (
                /* HIGH FIDELITY PREP RESOURCE LIVE PREVIEW */
                <div className="bg-white border border-slate-150 rounded-2xl p-6 md:p-8 space-y-6 text-slate-800 animate-fadeIn shadow-2xs max-w-3xl mx-auto">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 rounded">
                      {resData.category}
                    </span>
                    <span className="text-[9px] font-extrabold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Difficulty: {resData.difficulty}
                    </span>
                  </div>

                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-950 font-heading">
                    {resData.title || 'Untitled Preparation Guide'}
                  </h1>

                  {resData.topicOrRole && (
                    <p className="text-xs font-bold text-slate-600 font-mono uppercase tracking-wider">
                      🎯 Targeted Profession: {resData.topicOrRole}
                    </p>
                  )}

                  <p className="text-xs md:text-sm text-slate-600 font-medium italic border-l-4 border-slate-300 pl-4 py-1">
                    {resData.excerpt || 'Brief prep summary is shown here...'}
                  </p>

                  <div className="text-xs leading-relaxed space-y-4 pt-2">
                    {resData.content ? (
                      resData.content.split('\n').map((para, i) => <p key={i} className="font-sans text-slate-700">{para}</p>)
                    ) : (
                      <p className="text-slate-400 italic">No prep content written yet.</p>
                    )}
                  </div>

                  {resData.links && (
                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Curated References Links</span>
                      <div className="flex flex-col gap-1.5 pt-1">
                        {resData.links.split(',').map((pair, idx) => {
                          const parts = pair.split(':');
                          if (parts.length >= 2) {
                            const name = parts[0].trim();
                            const url = parts.slice(1).join(':').trim();
                            return (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                                <Link2 className="w-3.5 h-3.5" />
                                <span className="hover:underline cursor-pointer">{name} ({url})</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CMS INDEX LISTS & PAGINATION */}
          {!isBlogFormOpen && !isCatFormOpen && !isResFormOpen && (
            <div className="space-y-4">
              
              {/* 1. BLOGS TAB VIEW */}
              {activeSubTab === 'blogs' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {currentBlogs.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 font-medium bg-slate-50 border border-dashed rounded-xl">
                        No blog posts match your criteria.
                      </div>
                    ) : (
                      currentBlogs.map((blog) => {
                        const isChecked = selectedBlogIds.includes(blog.id);
                        return (
                          <div key={blog.id} className="p-4 bg-slate-50/40 hover:bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 transition-all justify-between items-start">
                            <div className="flex items-start gap-3 flex-1 w-full">
                              
                              {/* Selection checkbox */}
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedBlogIds([...selectedBlogIds, blog.id]);
                                  } else {
                                    setSelectedBlogIds(selectedBlogIds.filter(id => id !== blog.id));
                                  }
                                }}
                                className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-2 cursor-pointer shrink-0"
                              />

                              <span className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center text-slate-400">
                                {blog.featuredImage ? (
                                  <img src={blog.featuredImage} alt="Featured" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon className="w-6 h-6" />
                                )}
                              </span>
                              
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{blog.title}</h4>
                                  <span className={`text-[8px] font-extrabold px-1.5 py-0.5 font-mono rounded ${
                                    blog.status === 'Published' 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                                  }`}>
                                    {blog.status}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-xl line-clamp-2">{blog.excerpt}</p>
                                
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[9px] text-slate-400 font-bold font-mono">
                                  <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase">
                                    {blog.categories.join(' & ') || 'General'}
                                  </span>
                                  <span>•</span>
                                  <span className="text-slate-700">AUTHOR: {blog.author || 'Ritu Sen'}</span>
                                  <span>•</span>
                                  <span>TAGS: {blog.tags.join(', ')}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 shrink-0 md:self-center ml-7 md:ml-0">
                              <button
                                onClick={() => handleOpenEditBlog(blog)}
                                className="p-1.5 text-slate-500 hover:text-slate-950 border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
                                title="Edit blog post"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 border border-rose-150 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title="Delete blog post"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* BLOG PAGINATION CONTROLS */}
                  {filteredBlogs.length > itemsPerPage && (
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      <span>
                        Showing {((blogPage - 1) * itemsPerPage) + 1} to {Math.min(blogPage * itemsPerPage, filteredBlogs.length)} of {filteredBlogs.length} entries
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={blogPage === 1}
                          onClick={() => setBlogPage(prev => prev - 1)}
                          className="p-1 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="font-bold px-2">Page {blogPage} of {totalBlogPages}</span>
                        <button
                          disabled={blogPage === totalBlogPages}
                          onClick={() => setBlogPage(prev => prev + 1)}
                          className="p-1 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. CATEGORIES TAB VIEW */}
              {activeSubTab === 'categories' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentCategories.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 font-medium bg-slate-50 border border-dashed rounded-xl col-span-2">
                        No categories match your criteria.
                      </div>
                    ) : (
                      currentCategories.map((cat) => (
                        <div key={cat.id} className="p-4 bg-slate-50/45 hover:bg-slate-50 rounded-xl border border-slate-100 space-y-2 flex flex-col justify-between transition-all">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-lg">{cat.icon}</span>
                              <span className="text-[9px] font-bold font-mono text-slate-400 uppercase">
                                SORT ORDER: {cat.ordering}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 leading-snug">
                                <span>{cat.name}</span>
                                {cat.parentCategory && (
                                  <span className="text-[8px] font-extrabold bg-indigo-50 border border-indigo-100 text-indigo-700 px-1 py-0.5 rounded uppercase">
                                    sub-category of {cat.parentCategory}
                                  </span>
                                )}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">/slug: {cat.seoSlug}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed pt-1 border-t border-slate-100">
                              {cat.description || 'No description listed.'}
                            </p>
                          </div>

                          <div className="flex justify-end gap-1.5 pt-2">
                            <button
                              onClick={() => handleOpenEditCat(cat)}
                              className="p-1 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-100 cursor-pointer"
                              title="Edit category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCat(cat.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 border border-rose-150 rounded-md hover:bg-rose-50 cursor-pointer"
                              title="Delete category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* CATEGORIES PAGINATION CONTROLS */}
                  {filteredCategories.length > itemsPerPage && (
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      <span>
                        Showing {((catPage - 1) * itemsPerPage) + 1} to {Math.min(catPage * itemsPerPage, filteredCategories.length)} of {filteredCategories.length} entries
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={catPage === 1}
                          onClick={() => setCatPage(prev => prev - 1)}
                          className="p-1 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="font-bold px-2">Page {catPage} of {totalCatPages}</span>
                        <button
                          disabled={catPage === totalCatPages}
                          onClick={() => setCatPage(prev => prev + 1)}
                          className="p-1 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. CAREER PREP RESOURCES TAB VIEW */}
              {activeSubTab === 'resources' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentResources.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 font-medium bg-slate-50 border border-dashed rounded-xl col-span-2">
                        No curated resources match your criteria.
                      </div>
                    ) : (
                      currentResources.map((res) => {
                        const isChecked = selectedResourceIds.includes(res.id);
                        return (
                          <div key={res.id} className="p-4 bg-slate-50/45 hover:bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between space-y-3 transition-all">
                            <div className="space-y-2 text-xs">
                              <div className="flex items-start gap-3 w-full">
                                
                                {/* Selection checkbox */}
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedResourceIds([...selectedResourceIds, res.id]);
                                    } else {
                                      setSelectedResourceIds(selectedResourceIds.filter(id => id !== res.id));
                                    }
                                  }}
                                  className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-1.5 cursor-pointer shrink-0"
                                />

                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h4 className="font-extrabold text-slate-900 leading-tight">{res.title}</h4>
                                      <p className="text-[10px] text-indigo-700 font-extrabold uppercase mt-1">
                                        {res.category} {res.topicOrRole ? `• For ${res.topicOrRole}` : ''}
                                      </p>
                                    </div>
                                    <span className="text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                      {res.difficulty || 'Easy'}
                                    </span>
                                  </div>

                                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-2">{res.excerpt}</p>

                                  {res.links && res.links.length > 0 && (
                                    <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-150 mt-3">
                                      <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Curated References</span>
                                      <div className="flex flex-col gap-1 pt-1.5">
                                        {res.links.map((link, idx) => (
                                          <a
                                            key={idx}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-[10px] text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                                          >
                                            <Link2 className="w-3 h-3 text-emerald-600" />
                                            <span>{link.name}</span>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100/60 ml-7">
                              <button
                                onClick={() => handleOpenEditRes(res)}
                                className="p-1 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-100 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRes(res.id)}
                                className="p-1 text-rose-500 hover:text-rose-700 border border-rose-150 rounded-md hover:bg-rose-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* RESOURCES PAGINATION CONTROLS */}
                  {filteredResources.length > itemsPerPage && (
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      <span>
                        Showing {((resPage - 1) * itemsPerPage) + 1} to {Math.min(resPage * itemsPerPage, filteredResources.length)} of {filteredResources.length} entries
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={resPage === 1}
                          onClick={() => setResPage(prev => prev - 1)}
                          className="p-1 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="font-bold px-2">Page {resPage} of {totalResPages}</span>
                        <button
                          disabled={resPage === totalResPages}
                          onClick={() => setResPage(prev => prev + 1)}
                          className="p-1 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
}
