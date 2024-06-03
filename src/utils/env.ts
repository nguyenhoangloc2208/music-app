export function getEnv(key: string): string {
    const value = import.meta.env[key];
    if (value === undefined) {
    throw new Error(`env ${key} is not defined`);
    }
    return value as string;
}

export const serverUrl = getEnv('VITE_SERVER_URL');

export const youtubeApiKey = getEnv('VITE_YOUTUBE_API_KEY');