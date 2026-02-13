export async function getFavicon(url: string) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch (error) {
        return null;
    }
}

export function generateTitle(url: string) {
    try {
        const hostname = new URL(url).hostname;
        // Remove www. and extension (simple extraction)
        return hostname.replace('www.', '').split('.')[0];
    } catch (error) {
        return url;
    }
}
