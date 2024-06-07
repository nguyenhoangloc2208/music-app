import axios from 'axios';

export interface YoutubePlayListInfo {
    id: string
    snippet: {
        title: string
        thumbnails: {
            high: {
                url: string
            }
        }
    }
}

export async function fetchPlaylistInfo(ids: string[]): Promise<YoutubePlayListInfo[]> {
    const baseUrl = 'api/youtube/v3/playlists?id=';

    const results: YoutubePlayListInfo[] = [];

    for (const id of ids) {
        const url = `${baseUrl}${id}`;
        try {
            const response = await axios.get(url);
            if (response.data.items && response.data.items.length > 0) {
                results.push(response.data.items[0]);
            } else {
                console.error(`Error fetching playlist info for ID ${id}: No items found`);
            }
        } catch (error) {
            console.error(`Error fetching playlist info for ID ${id}:`, error);
        }
    }

    return results.filter(item => item !== null);
}
