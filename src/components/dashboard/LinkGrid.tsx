import React, { useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { type Link, type Category } from '../../context/LinkContext';
import { LinkItem } from './LinkItem';

interface LinkGridProps {
    links: Link[];
    categories: Category[];
    searchQuery: string;
    loading?: boolean;
    onEdit: (link: Link) => void;
    onDelete: (id: string) => void;
    onDeleteCategory: (category: string) => void;
}

export const LinkGrid: React.FC<LinkGridProps> = ({ links, categories, searchQuery, loading, onEdit, onDelete, onDeleteCategory }) => {
    const filteredLinks = useMemo(() => {
        return links.filter(link =>
            link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            link.url.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [links, searchQuery]);

    const groupedLinks = useMemo(() => {
        const groups: Record<Category, Link[]> = {};
        categories.forEach(cat => {
            groups[cat] = filteredLinks.filter(l => l.category === cat);
        });
        // Add links that don't match any known category to 'Other' or first category
        const uncategorized = filteredLinks.filter(l => !categories.includes(l.category));
        if (uncategorized.length > 0) {
            groups['Other'] = uncategorized;
        }
        return groups;
    }, [filteredLinks, categories]);

    return (
        <div className="space-y-8 pb-20">
            {Object.entries(groupedLinks).map(([category, categoryLinks]) => {
                if (categoryLinks.length === 0) return null;

                return (
                    <div key={category} className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 group">
                            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                            {category}
                            <span className="text-sm font-normal text-slate-500 ml-2">({categoryLinks.length})</span>
                            {category !== 'Uncategorized' && (
                                <button
                                    onClick={() => onDeleteCategory(category)}
                                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 p-1"
                                    title="Delete Category"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {categoryLinks.map(link => (
                                <LinkItem
                                    key={link.id}
                                    link={link}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {loading && filteredLinks.length === 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 aspect-square animate-pulse">
                            <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                            <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredLinks.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    {searchQuery ? (
                        <p className="text-lg">No links found matching "{searchQuery}"</p>
                    ) : (
                        <div>
                            <p className="text-lg font-medium">No links yet</p>
                            <p className="text-sm mt-1">Tap + to add your first link</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
