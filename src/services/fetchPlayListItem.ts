import axios from 'axios';
import { YoutubeSong } from '../hooks/useSearch';

export async function fetchPlaylistItem(id: string): Promise<YoutubeSong[]> {
    const url = `api/youtube/v3/playlistItems?playlistId=${id}&maxResults=50&type=video`;
    try {
        const response = await axios.get(url);
        if (response.data.items && response.data.items.length > 0) {
            const newResponse: YoutubeSong[] = response.data.items.map((item: any) => ({
                id: {
                    videoId: item.snippet.resourceId.videoId,
                },
                snippet: {
                    channelTitle: item.snippet.channelTitle,
                    thumbnails: {
                        high: {
                            url: item.snippet.thumbnails.high.url,
                        },
                    },
                    title: item.snippet.title,
                }
            }));
            return newResponse;
        } else {
            console.error(`Error fetching playlist info for ID ${id}: No items found`);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching playlist info for ID ${id}:`, error);
        throw error;
    }
}