import { YoutubeSong } from "../hooks/useSearch";
import { storage } from "../utils/storage";
import { atomWithStorage } from "jotai/utils";

const emptyYoutubeSong: YoutubeSong = {
    id: {
        videoId: ""
    },
    snippet: {
        channelTitle: "",
        thumbnails: {
            medium: {
                url: ""
            }
        },
        title: ""
    }
};

export const selectedSongAtom = atomWithStorage<YoutubeSong>(
    'selectedSong',
    emptyYoutubeSong,
    storage,
);