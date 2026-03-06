export const truncateText = (str: string, limit: number): string => {
    if (str.length <= limit) return str;
    return str.slice(0, str.lastIndexOf(' ', limit)) || str.slice(0, limit);
};
