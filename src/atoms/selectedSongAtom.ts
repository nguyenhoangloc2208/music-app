import { YoutubeSong } from "../hooks/useSearch";
import { storage } from "../utils/storage";
import { atomWithStorage } from "jotai/utils";

export const selectedSongAtom = atomWithStorage<YoutubeSong>(
    'selectedSong',
    {
        id: {
            videoId: ''
        },
        snippet: {
            channelTitle: '',
            thumbnails: {
                medium: {
                    url: ''
                }
            },
            title: ''
        }
    },
    storage,
);