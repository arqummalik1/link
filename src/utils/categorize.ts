import { type Category } from '../lib/storage';

export function categorizeUrl(url: string, categories: Category[]): Category {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('github') || lowerUrl.includes('gitlab') || lowerUrl.includes('stackoverflow') || lowerUrl.includes('dev.to') || lowerUrl.includes('code')) {
        return 'Coding';
    }

    if (lowerUrl.includes('gpt') || lowerUrl.includes('ai') || lowerUrl.includes('openai') || lowerUrl.includes('claude') || lowerUrl.includes('midjourney')) {
        return 'AI Tools';
    }

    if (lowerUrl.includes('dribbble') || lowerUrl.includes('behance') || lowerUrl.includes('figma') || lowerUrl.includes('design') || lowerUrl.includes('unsplash')) {
        return 'Design';
    }

    if (lowerUrl.includes('bbc') || lowerUrl.includes('cnn') || lowerUrl.includes('nytimes') || lowerUrl.includes('news')) {
        return 'News';
    }

    if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com') || lowerUrl.includes('linkedin') || lowerUrl.includes('facebook') || lowerUrl.includes('instagram')) {
        return 'Social';
    }

    if (lowerUrl.includes('flight') || lowerUrl.includes('hotel') || lowerUrl.includes('trip') || lowerUrl.includes('booking') || lowerUrl.includes('airbnb')) {
        return 'Travel';
    }

    // Default to first category available
    return categories[0] || 'Uncategorized';
}
