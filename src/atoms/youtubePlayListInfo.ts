import { atomWithStorage } from "jotai/utils";
import { storage } from "../utils/storage";
import { YoutubePlayListInfo } from "../services/fetchPlayList";


export const YoutubePlayListInfoAtom = atomWithStorage<YoutubePlayListInfo[]>(
    'youtubePlayListInfo',
    [],
    storage
);