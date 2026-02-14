import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Link {
    id: string;
    url: string;
    title: string;
    icon?: string;
    category: string;
    created_at?: string;
    user_id?: string;
}

export type Category = string;

interface LinkContextType {
    links: Link[];
    categories: Category[];
    loading: boolean;
    addLink: (link: Omit<Link, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
    deleteLink: (id: string) => Promise<void>;
    updateLink: (id: string, updates: Partial<Link>) => Promise<void>;
    addCategory: (category: string) => Promise<void>;
    deleteCategory: (category: string) => Promise<void>;
    refresh: () => Promise<void>;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export const LinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [links, setLinks] = useState<Link[]>([]);
    const [categories, setCategories] = useState<Category[]>(['Uncategorized', 'Coding', 'Design', 'Reading', 'Music']); // Defaults
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        if (!user) {
            setLinks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setLinks(data as Link[]);
                // Extract unique categories from links
                const usedCategories = Array.from(new Set(data.map((l: Link) => l.category)));
                // Merge with defaults (logic can be improved to persist user categories separately if needed)
                const allCategories = Array.from(new Set([...categories, ...usedCategories]));
                setCategories(allCategories);
            }
        } catch (error) {
            console.error('Error fetching links:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [user]);

    const addLink = async (link: Omit<Link, 'id' | 'created_at' | 'user_id'>) => {
        if (!user) return;
        try {
            const { error } = await supabase.from('links').insert([
                { ...link, user_id: user.id }
            ]);
            if (error) throw error;
            refresh();
        } catch (error) {
            console.error('Error adding link:', error);
            alert('Failed to add link');
        }
    };

    const deleteLink = async (id: string) => {
        try {
            const { error } = await supabase.from('links').delete().eq('id', id);
            if (error) throw error;
            refresh();
        } catch (error) {
            console.error('Error deleting link:', error);
            alert('Failed to delete link');
        }
    };

    const updateLink = async (id: string, updates: Partial<Link>) => {
        try {
            const { error } = await supabase.from('links').update(updates).eq('id', id);
            if (error) throw error;
            refresh();
        } catch (error) {
            console.error('Error updating link:', error);
            alert('Failed to update link');
        }
    };

    const addCategory = async (category: string) => {
        // For MVP, categories are just strings on links. 
        // To "add" a category explicitly without a link, we might need a separate table or just local state until a link uses it.
        // For now, we'll update local state to reflect it immediately in UI
        if (!categories.includes(category)) {
            setCategories(prev => [...prev, category]);
        }
    };

    const deleteCategory = async (category: string) => {
        if (!user) return;
        // Move links in this category to 'Uncategorized'
        try {
            const { error } = await supabase
                .from('links')
                .update({ category: 'Uncategorized' })
                .eq('category', category)
                .eq('user_id', user.id);

            if (error) throw error;

            setCategories(prev => prev.filter(c => c !== category));
            refresh();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    };

    return (
        <LinkContext.Provider value={{ links, categories, loading, addLink, deleteLink, updateLink, addCategory, deleteCategory, refresh }}>
            {children}
        </LinkContext.Provider>
    );
};

export const useLinks = () => {
    const context = useContext(LinkContext);
    if (!context) {
        throw new Error('useLinks must be used within a LinkProvider');
    }
    return context;
};
