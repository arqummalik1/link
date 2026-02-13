import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, type Link, type Category } from '../lib/storage';

interface LinkContextType {
    links: Link[];
    categories: Category[];
    addLink: (link: Omit<Link, 'id' | 'createdAt'>) => void;
    deleteLink: (id: string) => void;
    updateLink: (id: string, updates: Partial<Link>) => void;
    addCategory: (category: string) => void;
    deleteCategory: (category: string) => void;
    refresh: () => void;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export const LinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [links, setLinks] = useState<Link[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const refresh = () => {
        setLinks(storage.getLinks());
        setCategories(storage.getCategories());
    };

    useEffect(() => {
        refresh();
    }, []);

    const addLink = (link: Omit<Link, 'id' | 'createdAt'>) => {
        storage.addLink(link);
        refresh();
    };

    const deleteLink = (id: string) => {
        storage.deleteLink(id);
        refresh();
    };

    const updateLink = (id: string, updates: Partial<Link>) => {
        storage.updateLink(id, updates);
        refresh();
    };

    const addCategory = (category: string) => {
        storage.addCategory(category);
        refresh();
    };

    const deleteCategory = (category: string) => {
        storage.deleteCategory(category);
        refresh();
    };

    return (
        <LinkContext.Provider value={{ links, categories, addLink, deleteLink, updateLink, addCategory, deleteCategory, refresh }}>
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
