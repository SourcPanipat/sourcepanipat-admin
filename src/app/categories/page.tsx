'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CategoryItem, SubCategoryItem } from '@/types';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ArrowUp, 
  ArrowDown, 
  Shirt, 
  Scissors, 
  Sparkles, 
  Building, 
  Sun, 
  Heart, 
  Package,
  X,
  Upload,
  Image as ImageIcon,
  Save,
  Check,
  Flame,
  Shield,
  Tag,
  RefreshCw,
  Info
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([
    { id: 'winter-jackets', name: 'Winter Jackets & Outerwear', slug: 'winter-jackets-outerwear', iconName: 'Layers', sortOrder: 1, isActive: true },
    { id: 'fleece-sweatshirts', name: 'Fleece & Sweatshirts', slug: 'fleece-sweatshirts', iconName: 'Shirt', sortOrder: 2, isActive: true },
    { id: 'pants-joggers', name: 'Pants, Joggers & Cargo', slug: 'pants-joggers-cargo', iconName: 'Scissors', sortOrder: 3, isActive: true },
    { id: 'jeans-denim', name: 'Jeans & Denim Workwear', slug: 'jeans-denim-workwear', iconName: 'Sparkles', sortOrder: 4, isActive: true },
    { id: 'overcoats-trench', name: 'Overcoats & Woolen Trench', slug: 'overcoats-trench', iconName: 'Building', sortOrder: 5, isActive: true },
    { id: 'summer-tees', name: 'Summer Tees & Tops', slug: 'summer-tees-tops', iconName: 'Sun', sortOrder: 6, isActive: true },
    { id: 'womens-thrift', name: 'Women Thrift & Y2K', slug: 'womens-thrift-y2k', iconName: 'Heart', sortOrder: 7, isActive: true },
    { id: 'home-mink', name: 'Home Furnishings & Mink', slug: 'home-furnishings-mink', iconName: 'Package', sortOrder: 8, isActive: true },
  ]);

  const [subCategoriesList, setSubCategoriesList] = useState<SubCategoryItem[]>([
    { id: 'heavy-puffers', categoryId: 'winter-jackets', name: 'Heavy Puffers', slug: 'heavy-puffers', isActive: true },
    { id: 'flight-bombers', categoryId: 'winter-jackets', name: 'Leather Flight Bombers', slug: 'leather-flight-bombers', isActive: true },
    { id: 'sherpa-truckers', categoryId: 'winter-jackets', name: 'Sherpa Trucker Jackets', slug: 'sherpa-trucker-jackets', isActive: true },
    { id: 'heavy-hoodies', categoryId: 'fleece-sweatshirts', name: '450 GSM Heavy Hoodies', slug: '450-gsm-heavy-hoodies', isActive: true },
    { id: 'graphic-crewnecks', categoryId: 'fleece-sweatshirts', name: 'Vintage Graphic Crewnecks', slug: 'vintage-graphic-crewnecks', isActive: true },
    { id: 'tactical-cargo', categoryId: 'pants-joggers', name: 'Multi-Pocket Tactical Cargo', slug: 'multi-pocket-tactical-cargo', isActive: true },
    { id: 'baggy-denim', categoryId: 'jeans-denim', name: '90s Baggy Denim Jeans', slug: '90s-baggy-denim-jeans', isActive: true },
    { id: 'mink-blankets', categoryId: 'home-mink', name: 'Korean Double-Ply Mink Blankets', slug: 'korean-double-ply-mink-blankets', isActive: true },
  ]);

  const [selectedMasterCatId, setSelectedMasterCatId] = useState<string>('winter-jackets');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');

  // Master Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catIcon, setCatIcon] = useState('Layers');
  const [catLogoUrl, setCatLogoUrl] = useState('');
  const [catSortOrder, setCatSortOrder] = useState(1);
  const [catIsActive, setCatIsActive] = useState(true);

  // Sub Category Modal State
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subName, setSubName] = useState('');
  const [subSlug, setSubSlug] = useState('');

  // Fetch from Turso DB on mount
  useEffect(() => {
    fetchCategoriesFromDB();
  }, []);

  const fetchCategoriesFromDB = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && data.categories && data.categories.length > 0) {
        setCategoriesList(data.categories);
        
        // Extract all sub categories
        const allSubs: SubCategoryItem[] = [];
        data.categories.forEach((cat: any) => {
          if (cat.subCategories && cat.subCategories.length > 0) {
            allSubs.push(...cat.subCategories);
          }
        });
        if (allSubs.length > 0) {
          setSubCategoriesList(allSubs);
        }
      }
    } catch (err) {
      console.error('Error fetching categories from DB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Shirt': return <Shirt className="w-4 h-4" />;
      case 'Scissors': return <Scissors className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Building': return <Building className="w-4 h-4" />;
      case 'Sun': return <Sun className="w-4 h-4" />;
      case 'Heart': return <Heart className="w-4 h-4" />;
      case 'Package': return <Package className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  // Reorder rankings: Move Up / Down
  const handleMoveRank = async (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= categoriesList.length) return;

    const updated = [...categoriesList];
    const itemA = updated[currentIndex];
    const itemB = updated[targetIndex];

    // Swap sortOrder values
    const tempOrder = itemA.sortOrder;
    itemA.sortOrder = itemB.sortOrder;
    itemB.sortOrder = tempOrder;

    // Swap positions in array
    updated[currentIndex] = itemB;
    updated[targetIndex] = itemA;

    // Normalize sortOrders 1..N
    const reindexed = updated.map((item, idx) => ({
      ...item,
      sortOrder: idx + 1,
    }));

    setCategoriesList(reindexed);
    setSyncStatus('saving');

    // Sync to Turso DB
    try {
      await fetch('/api/categories/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: reindexed.map(c => ({ id: c.id, sortOrder: c.sortOrder })),
        }),
      });
      setSyncStatus('synced');
    } catch (e) {
      console.error(e);
      setSyncStatus('error');
    }
  };

  // Set Direct Rank (e.g. move #1 to #3)
  const handleDirectRankChange = async (catId: string, newRank: number) => {
    if (isNaN(newRank) || newRank < 1) return;

    const targetCat = categoriesList.find(c => c.id === catId);
    if (!targetCat) return;

    const otherCats = categoriesList.filter(c => c.id !== catId);
    const insertIndex = Math.min(Math.max(newRank - 1, 0), otherCats.length);

    otherCats.splice(insertIndex, 0, targetCat);

    const reindexed = otherCats.map((item, idx) => ({
      ...item,
      sortOrder: idx + 1,
    }));

    setCategoriesList(reindexed);
    setSyncStatus('saving');

    try {
      await fetch('/api/categories/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: reindexed.map(c => ({ id: c.id, sortOrder: c.sortOrder })),
        }),
      });
      setSyncStatus('synced');
    } catch (e) {
      console.error(e);
      setSyncStatus('error');
    }
  };

  // Open Add Category Modal
  const handleOpenAddCat = () => {
    setEditingCat(null);
    setCatName('');
    setCatSlug('');
    setCatIcon('Layers');
    setCatLogoUrl('');
    setCatSortOrder(categoriesList.length + 1);
    setCatIsActive(true);
    setIsCatModalOpen(true);
  };

  // Open Edit Category Modal
  const handleOpenEditCat = (cat: CategoryItem) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatIcon(cat.iconName);
    setCatLogoUrl(cat.logoUrl || '');
    setCatSortOrder(cat.sortOrder);
    setCatIsActive(cat.isActive);
    setIsCatModalOpen(true);
  };

  // Handle Logo File Upload (Cloudflare R2 + Local fallback)
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'categories');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setCatLogoUrl(data.url);
      } else {
        // Fallback local reader
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) setCatLogoUrl(event.target.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('R2 upload notice, using local preview:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setCatLogoUrl(event.target.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Save Category (Create or Edit)
  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncStatus('saving');

    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingCat) {
      // Update
      const updatedList = categoriesList.map(c => {
        if (c.id === editingCat.id) {
          return {
            ...c,
            name: catName,
            slug,
            iconName: catIcon,
            logoUrl: catLogoUrl || undefined,
            sortOrder: catSortOrder,
            isActive: catIsActive,
          };
        }
        return c;
      });

      setCategoriesList(updatedList);

      try {
        await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCat.id,
            name: catName,
            slug,
            iconName: catIcon,
            logoUrl: catLogoUrl || null,
            sortOrder: catSortOrder,
            isActive: catIsActive,
          }),
        });
        setSyncStatus('synced');
      } catch (err) {
        console.error(err);
        setSyncStatus('error');
      }

    } else {
      // Create New
      const id = slug;
      const newCat: CategoryItem = {
        id,
        name: catName,
        slug,
        iconName: catIcon,
        logoUrl: catLogoUrl || undefined,
        sortOrder: catSortOrder,
        isActive: catIsActive,
        subCategoriesCount: 0,
      };

      setCategoriesList([...categoriesList, newCat]);

      try {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCat),
        });
        setSyncStatus('synced');
      } catch (err) {
        console.error(err);
        setSyncStatus('error');
      }
    }

    setIsCatModalOpen(false);
  };

  // Delete Category
  const handleDeleteCat = async (id: string) => {
    if (!confirm('Are you sure you want to delete this master category and its sub-lots?')) return;

    setCategoriesList(prev => prev.filter(c => c.id !== id));
    setSubCategoriesList(prev => prev.filter(s => s.categoryId !== id));

    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Active/Hidden
  const handleToggleCatActive = async (cat: CategoryItem) => {
    const nextState = !cat.isActive;
    setCategoriesList(prev => prev.map(c => {
      if (c.id === cat.id) return { ...c, isActive: nextState };
      return c;
    }));

    try {
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id, isActive: nextState }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Sub-Category: Add
  const handleSaveSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = subSlug.trim() || subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newSub: SubCategoryItem = {
      id: `${selectedMasterCatId}-${slug}`,
      categoryId: selectedMasterCatId,
      name: subName,
      slug,
      isActive: true,
    };

    setSubCategoriesList([...subCategoriesList, newSub]);
    setIsSubModalOpen(false);
    setSubName('');
    setSubSlug('');

    try {
      await fetch('/api/categories/sub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSub),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Sub-Category: Delete
  const handleDeleteSubCategory = async (subId: string) => {
    setSubCategoriesList(prev => prev.filter(s => s.id !== subId));
    try {
      await fetch(`/api/categories/sub?id=${subId}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const activeMasterCat = categoriesList.find(c => c.id === selectedMasterCatId) || categoriesList[0];
  const currentSubList = subCategoriesList.filter(s => s.categoryId === selectedMasterCatId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Module Heading & Turso Sync Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Marketplace Category & Sub-Category Tree Manager
            </h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              syncStatus === 'synced' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
              syncStatus === 'saving' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
              'bg-rose-50 text-rose-800'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{syncStatus === 'saving' ? 'Syncing to Turso DB...' : 'Turso LibSQL Connected'}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload custom category logos, re-rank order weights (#1 $\rightarrow$ #3), and manage dynamic sub-lot classification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCategoriesFromDB}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
            title="Refresh from Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAddCat}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ New Master Category</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split: Master Categories & Sub-Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Master Categories List with Re-ranking Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-700" />
              <span>Master Categories ({categoriesList.length})</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-semibold">
              Live Homepage Rank Order
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100">
            {categoriesList.map((cat, idx) => {
              const isSelected = cat.id === selectedMasterCatId;
              const subCount = subCategoriesList.filter(s => s.categoryId === cat.id).length;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedMasterCatId(cat.id)}
                  className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/80 border-l-4 border-amber-500' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    
                    {/* Rank Reordering Arrows (#1 to #3) */}
                    <div className="flex flex-col items-center gap-0.5 bg-slate-100 p-1 rounded-md border border-slate-200 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveRank(idx, 'up');
                        }}
                        className="p-0.5 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-20 transition-colors"
                        title="Move Up in Rank"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>

                      <input
                        type="text"
                        value={cat.sortOrder}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleDirectRankChange(cat.id, parseInt(e.target.value))}
                        className="w-6 text-center font-mono font-bold text-[10.5px] bg-white border border-slate-300 rounded text-slate-900 focus:outline-none"
                        title="Click to type rank"
                      />

                      <button
                        type="button"
                        disabled={idx === categoriesList.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveRank(idx, 'down');
                        }}
                        className="p-0.5 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-20 transition-colors"
                        title="Move Down in Rank"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Logo Image or Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border overflow-hidden ${
                      isSelected ? 'bg-slate-900 text-amber-400 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {cat.logoUrl ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={cat.logoUrl}
                            alt={cat.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        getIconComponent(cat.iconName)
                      )}
                    </div>

                    {/* Category Title & Info */}
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5">
                        <span>{cat.name}</span>
                        {cat.logoUrl && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                            Custom Logo
                          </span>
                        )}
                      </div>
                      <div className="text-[10.5px] text-slate-500 flex items-center gap-2">
                        <span className="font-mono text-slate-400">/{cat.slug}</span>
                        <span>•</span>
                        <span>{subCount} Sub-Lots</span>
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCatActive(cat);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cat.isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditCat(cat);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      title="Edit Category & Logo"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCat(cat.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Sub-Categories Linked to Selected Master (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>Sub-Categories for: </span>
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                  {activeMasterCat?.name}
                </span>
              </h2>
            </div>

            <button
              onClick={() => setIsSubModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Sub-Lot</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Sub-Category Name</th>
                  <th className="py-3 px-4">Catalog Key / Slug</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentSubList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400 text-xs">
                      No sub-categories defined yet. Click "+ Add Sub-Lot" to create one.
                    </td>
                  </tr>
                ) : (
                  currentSubList.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {sub.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {sub.slug}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteSubCategory(sub.id)}
                          className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                          title="Remove Sub-Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Note banner */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Sellers select from these sub-categories when listing lots and set their own custom MOQ (e.g. 25, 50 pcs).</span>
            </div>
          </div>
        </div>

      </div>

      {/* MASTER CATEGORY CREATE & EDIT MODAL (WITH LOGO UPLOAD) */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl text-xs overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-800" />
                <h3 className="font-bold text-sm text-slate-900">
                  {editingCat ? 'Edit Master Category & Logo' : 'Create New Master Category'}
                </h3>
              </div>
              <button onClick={() => setIsCatModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="space-y-3.5">
              
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Jackets & Outerwear"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-800 focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  URL Slug (Optional - auto generated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. winter-jackets-outerwear"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-700 focus:border-slate-800 focus:outline-none"
                />
              </div>

              {/* Category Logo & Visual Icon Upload Area */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                  <span>Category Visual Logo / Icon</span>
                  <span className="text-[10px] text-slate-500 font-normal">Shown on buyer homepage</span>
                </div>

                <div className="flex items-center gap-3">
                  
                  {/* Logo Preview */}
                  <div className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center shrink-0 overflow-hidden relative shadow-xs">
                    {catLogoUrl ? (
                      <Image
                        src={catLogoUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-slate-400 flex flex-col items-center">
                        {getIconComponent(catIcon)}
                        <span className="text-[9px] mt-0.5">Preset</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-1.5">
                    <label className={`cursor-pointer px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-300 text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload className={`w-3.5 h-3.5 text-slate-600 ${isUploading ? 'animate-bounce' : ''}`} />
                      <span>{isUploading ? 'Uploading to Cloudflare R2...' : 'Upload Logo Photo / Icon'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleLogoFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="text-[10.5px] text-slate-500">
                      Or paste direct image URL below:
                    </div>
                  </div>

                </div>

                <input
                  type="url"
                  placeholder="https://pub-sourcepanipat.r2.dev/icons/jackets.png"
                  value={catLogoUrl}
                  onChange={(e) => setCatLogoUrl(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900 focus:border-slate-800 focus:outline-none"
                />

                {catLogoUrl && (
                  <button
                    type="button"
                    onClick={() => setCatLogoUrl('')}
                    className="text-[10px] text-rose-600 hover:underline font-semibold"
                  >
                    Remove custom logo (use Lucide fallback)
                  </button>
                )}
              </div>

              {/* Fallback Lucide Icon & Sort Rank */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Lucide Fallback Icon
                  </label>
                  <select
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-800 focus:outline-none bg-white text-slate-900"
                  >
                    <option value="Layers">Layers (Jackets)</option>
                    <option value="Shirt">Shirt (Hoodies)</option>
                    <option value="Scissors">Scissors (Pants/Cargo)</option>
                    <option value="Sparkles">Sparkles (Denim/Jeans)</option>
                    <option value="Building">Building (Overcoats)</option>
                    <option value="Sun">Sun (Summer Tees)</option>
                    <option value="Heart">Heart (Women Thrift)</option>
                    <option value="Package">Package (Mink Blankets)</option>
                    <option value="Flame">Flame (Hot Deals)</option>
                    <option value="Shield">Shield (Vetted Lots)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Homepage Rank Position
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={catSortOrder}
                    onChange={(e) => setCatSortOrder(parseInt(e.target.value) || 1)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-800 focus:outline-none font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActiveCat"
                    checked={catIsActive}
                    onChange={(e) => setCatIsActive(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <label htmlFor="isActiveCat" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Visible on Marketplace Feed
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCatModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to Turso DB</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* SUB-CATEGORY CREATE MODAL */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Add Sub-Lot for {activeMasterCat?.name}
              </h3>
              <button onClick={() => setIsSubModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveSubCategory} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Sub-Category / Lot Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quilted Down Vests (Grade A)"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-800 focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Sub-Category Slug (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. quilted-down-vests"
                  value={subSlug}
                  onChange={(e) => setSubSlug(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-700 focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold"
                >
                  Add Sub-Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
