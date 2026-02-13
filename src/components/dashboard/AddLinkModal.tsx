import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useLinks } from '../../context/LinkContext';
import { categorizeUrl } from '../../utils/categorize';
import { getFavicon, generateTitle } from '../../utils/metadata';
import { type Link } from '../../lib/storage';

interface AddLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: {
        url?: string;
        title?: string;
        text?: string;
    };
    editingLink?: Link | null;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, defaultValues, editingLink }) => {
    const { addLink, updateLink, categories, addCategory } = useLinks();
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [icon, setIcon] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [isNewCategoryMode, setIsNewCategoryMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form with defaultValues or editingLink
    useEffect(() => {
        if (isOpen) {
            if (editingLink) {
                setUrl(editingLink.url);
                setTitle(editingLink.title);
                setIcon(editingLink.icon || '');
                setCategory(editingLink.category);
            } else if (defaultValues) {
                if (defaultValues.url) {
                    setUrl(defaultValues.url);
                    handleUrlBlur(defaultValues.url); // Auto-fetch on open if URL exists
                }
                if (defaultValues.title) setTitle(defaultValues.title);
                // If text is present, maybe append to title or use for notes (MVP: ignore or use as title fallback)
            } else {
                // Reset form
                setUrl('');
                setTitle('');
                setIcon('');
                setCategory(categories[0] || 'Uncategorized');
            }
            setIsNewCategoryMode(false);
            setNewCategory('');
        }
    }, [isOpen, defaultValues, editingLink, categories]);

    const handleUrlBlur = async (inputUrl: string) => {
        if (!inputUrl) return;

        // Only fetch if title/category aren't already set manually (or via share)
        if (!title) {
            setIsLoading(true);
            const generatedTitle = generateTitle(inputUrl);
            setTitle(generatedTitle);

            const fetchedIcon = await getFavicon(inputUrl);
            if (fetchedIcon) setIcon(fetchedIcon);

            const suggestedCategory = categorizeUrl(inputUrl, categories);
            if (!category || category === 'Uncategorized') {
                setCategory(suggestedCategory);
            }
            setIsLoading(false);
        }
    };

    const handleRefreshIcon = async () => {
        if (!url) return;
        setIsLoading(true);
        const fetchedIcon = await getFavicon(url);
        if (fetchedIcon) setIcon(fetchedIcon);
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let finalCategory = category;
        if (isNewCategoryMode && newCategory.trim()) {
            addCategory(newCategory.trim());
            finalCategory = newCategory.trim();
        }


        if (editingLink) {
            updateLink(editingLink.id, {
                url,
                title,
                category: finalCategory,
                icon: icon || editingLink.icon
            });
        } else {
            addLink({
                url,
                title,
                category: finalCategory,
                icon: icon || '', // Fallback handled in LinkItem
            });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={editingLink ? 'Edit Link' : 'Add New Link'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="URL"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onBlur={(e) => handleUrlBlur(e.target.value)}
                    required
                    autoFocus={!editingLink} // Auto-focus only for new links
                />

                <Input
                    label="Title"
                    placeholder="Website Name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <div className="flex gap-2 items-end">
                    <Input
                        label="Icon URL"
                        placeholder="https://example.com/logo.png"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="button" variant="secondary" onClick={handleRefreshIcon} title="Reset to Favicon">
                        Reset
                    </Button>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Category</label>
                    {!isNewCategoryMode ? (
                        <div className="flex gap-2">
                            <select
                                className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 p-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 sm:text-sm h-11 transition-all"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <Button type="button" variant="secondary" onClick={() => setIsNewCategoryMode(true)} title="Add Category">
                                + New
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Input
                                placeholder="New Category Name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="mb-0" // override default mb
                            />
                            <Button type="button" variant="ghost" onClick={() => setIsNewCategoryMode(false)}>
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700/50 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? 'Loading...' : (editingLink ? 'Save Changes' : 'Add Link')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
