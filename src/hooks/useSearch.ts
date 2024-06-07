import useSWRMutation from "swr/mutation";
import { getDataWithArgs } from "../services/fetcher";


export interface YoutubeSongResponse {
    items: YoutubeSong[]
}

export interface YoutubeSong {
    id: {
        videoId: string;
    };
    snippet: {
        channelTitle: string;
        thumbnails: {
            high: {
                url: string;
            };
        };
        title: string;
    }
}

export default function useSearch() {
    const {data, isMutating, error, trigger} = useSWRMutation<
        YoutubeSongResponse,
        Error,
        string,
        {q: string}
    >(`api/youtube/v3/search?type=video&maxResults=6`, getDataWithArgs);
    
    return{
        data: data?.items,
        isMutating,
        error,
        trigger
    }
}
