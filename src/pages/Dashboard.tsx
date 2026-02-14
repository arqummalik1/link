import React, { useState, useEffect } from 'react';
import { Plus, Search, Sun, Moon, LogOut } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useLinks } from '../context/LinkContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { LinkGrid } from '../components/dashboard/LinkGrid';
import { AddLinkModal } from '../components/dashboard/AddLinkModal';

import { Button } from '../components/ui/Button';
import { type Link } from '../context/LinkContext';

export const Dashboard: React.FC = () => {
    const { links, categories, deleteLink, deleteCategory } = useLinks();
    const { theme, toggleTheme } = useTheme();
    const { signOut } = useAuth();
    const [searchParams] = useSearchParams();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<Link | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [shareData, setShareData] = useState<{ url?: string; title?: string; text?: string } | undefined>(undefined);

    useEffect(() => {
        // Check for share target params
        const title = searchParams.get('title');
        const text = searchParams.get('text');
        const url = searchParams.get('url');

        if (title || text || url) {
            setShareData({
                title: title || '',
                text: text || '',
                url: url || text || '' // some apps share URL in text field
            });
            setIsAddModalOpen(true);
        }
    }, [searchParams]);

    const handleEdit = (link: Link) => {
        setEditingLink(link);
        setIsAddModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this link?')) {
            deleteLink(id);
        }
    };

    const handleDeleteCategory = (category: string) => {
        if (confirm(`Are you sure you want to delete "${category}"? Links will be moved to Uncategorized.`)) {
            deleteCategory(category);
        }
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingLink(null);
        setShareData(undefined);
        // Clear URL params without reloading to prevent reopening on refresh
        window.history.replaceState({}, '', '/');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="font-bold text-white text-lg">L</span>
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 hidden sm:block">
                            LinkVault
                        </h1>
                    </div>

                    <div className="flex-1 max-w-md">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search links..."
                                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <Button
                            variant="primary"
                            size="sm"
                            className="rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus className="w-5 h-5 sm:mr-1" />
                            <span className="hidden sm:inline">Add Link</span>
                        </Button>

                        <button
                            onClick={signOut}
                            className="p-2 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                            title="Log Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <LinkGrid
                    links={links}
                    categories={categories}
                    searchQuery={searchQuery}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDeleteCategory={handleDeleteCategory}
                />
            </main>

            {/* Add/Edit Modal */}
            <AddLinkModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                defaultValues={shareData}
                editingLink={editingLink}
            />
        </div>
    );
};
