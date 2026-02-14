import React, { useState } from 'react';
import { MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { type Link } from '../../context/LinkContext';

interface LinkItemProps {
    link: Link;
    onEdit: (link: Link) => void;
    onDelete: (id: string) => void;
}

export const LinkItem: React.FC<LinkItemProps> = ({ link, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [imgError, setImgError] = useState(false);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowMenu(true);
    };

    const handleTouchStart = () => {
        const timer = setTimeout(() => {
            setShowMenu(true);
        }, 500);
        setLongPressTimer(timer);
    };

    const handleTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
    };

    const handleClick = () => {
        if (!showMenu) {
            window.open(link.url, '_blank', 'noopener,noreferrer');
        }
    };

    // Get a high-res icon URL
    const getIconUrl = () => {
        if (link.icon && !imgError) return link.icon;
        try {
            const hostname = new URL(link.url).hostname;
            return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
        } catch {
            return '';
        }
    };

    // Generate a gradient based on the URL for fallback
    const getFallbackGradient = () => {
        const hash = link.url.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
        const hue = Math.abs(hash) % 360;
        return `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 40) % 360}, 70%, 40%))`;
    };

    const getInitial = () => {
        try {
            return new URL(link.url).hostname.replace('www.', '').charAt(0).toUpperCase();
        } catch {
            return link.title.charAt(0).toUpperCase();
        }
    };

    return (
        <div
            className="relative group perspective"
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="relative bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer aspect-square group"
                onClick={handleClick}
            >
                {/* App-style Icon */}
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md flex items-center justify-center flex-shrink-0">
                    {imgError ? (
                        <div
                            className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                            style={{ background: getFallbackGradient() }}
                        >
                            {getInitial()}
                        </div>
                    ) : (
                        <img
                            src={getIconUrl()}
                            alt={link.title}
                            className="w-full h-full object-cover bg-slate-100 dark:bg-slate-700"
                            onError={() => setImgError(true)}
                        />
                    )}
                </div>

                {/* Title */}
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate w-full text-center group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                    {link.title}
                </span>

                {/* Action Button (Desktop Hover) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <MoreVertical size={16} />
                </button>
            </div>

            {/* Context Menu */}
            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(false);
                        }}
                    />
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(link);
                                setShowMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
                        >
                            <Edit2 size={14} /> Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(link.id);
                                setShowMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-2"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
