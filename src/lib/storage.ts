export interface Link {
    id: string;
    url: string;
    title: string;
    icon?: string;
    category: string;
    createdAt: number;
}

export type Category = string;

const STORAGE_KEY = 'linkvault_data';
const CATEGORIES_KEY = 'linkvault_categories';

const INITIAL_CATEGORIES: Category[] = ['Coding', 'Design', 'News', 'Social', 'AI Tools', 'Travel'];

// Mock initial data if empty
const INITIAL_LINKS: Link[] = [
    {
        id: '1',
        url: 'https://github.com',
        title: 'GitHub',
        icon: 'https://github.com/favicon.ico',
        category: 'Coding',
        createdAt: Date.now(),
    },
    {
        id: '2',
        url: 'https://dribbble.com',
        title: 'Dribbble',
        icon: 'https://cdn.dribbble.com/assets/favicon-b3852513460de5685a0fd0b2b804da6d39368d372e924d5ba6d3e7d8123010d8.ico',
        category: 'Design',
        createdAt: Date.now(),
    }
];

export const storage = {
    getLinks: (): Link[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : INITIAL_LINKS;
    },

    addLink: (link: Omit<Link, 'id' | 'createdAt'>): Link => {
        const links = storage.getLinks();
        const newLink: Link = {
            ...link,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([newLink, ...links]));
        return newLink;
    },

    deleteLink: (id: string) => {
        const links = storage.getLinks().filter(l => l.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    },

    updateLink: (id: string, updates: Partial<Link>) => {
        const links = storage.getLinks().map(l => l.id === id ? { ...l, ...updates } : l);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    },

    getCategories: (): Category[] => {
        const data = localStorage.getItem(CATEGORIES_KEY);
        return data ? JSON.parse(data) : INITIAL_CATEGORIES;
    },

    addCategory: (category: string) => {
        const categories = storage.getCategories();
        if (!categories.includes(category)) {
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify([...categories, category]));
        }
    },
    deleteCategory: (category: string) => {
        // 1. Remove from categories list
        const categories = storage.getCategories().filter(c => c !== category);
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));

        // 2. Move links to 'Uncategorized' (or 'Other')
        const links = storage.getLinks().map(l =>
            l.category === category ? { ...l, category: 'Uncategorized' } : l
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    }
};
