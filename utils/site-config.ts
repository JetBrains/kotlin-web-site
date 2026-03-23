export function getSiteUrl(): string {
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://kotlinlang.org';
}

export function getCanonicalUrl(path: string): string {
    const baseUrl = getSiteUrl();
    const normalizedPath = path.endsWith('/') ? path : `${path}/`;
    return `${baseUrl}${normalizedPath}`;
}
