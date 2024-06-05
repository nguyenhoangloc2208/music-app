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
            medium: {
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
    >(`api/youtube/v3/search`, getDataWithArgs);

    const processedData = data ? data.items.map(item => ({
        id: item.id.videoId,
        snippet: {
            channelTitle: item.snippet.channelTitle,
            thumbnails: {
                medium: {
                    url: item.snippet.thumbnails.medium.url
                }
            },
            title: item.snippet.title
        }
    })) : null;
    
    return{
        data: processedData,
        isMutating,
        error,
        trigger
    }
}