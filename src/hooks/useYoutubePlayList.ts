import useSWR from 'swr';
import { getData } from '../services/fetcher';

interface YoutubePlayList {
    items: YoutubePlayListInfo[]
}

interface YoutubePlayListInfo {
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

export default function useYoutubePlayList(id: string) {
    const { data, isLoading, error } = useSWR<
        YoutubePlayList,
        Error,
        string
    >(`api/youtube/v3/playlists?id=${id}`, getData);

    return {
        data: data?.items,
        isLoading,
        error,
    };
}