export default function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    // Define all your routes here
    const routes = [
        '',
        '/join',
        '/audit',
        '/seasons',
        '/mrt'
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
    }));
    
    return routes;
} 