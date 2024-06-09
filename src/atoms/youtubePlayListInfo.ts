import { atomWithStorage } from "jotai/utils";
import { storage } from "../utils/storage";
import { YoutubePlayListInfo } from "../services/fetchPlayList";
import youtubePlayListInfoJSON from "./youtubePlayListInfo.json"

const youtubePlayListInfos: YoutubePlayListInfo[] = youtubePlayListInfoJSON;

export const YoutubePlayListInfoAtom = atomWithStorage<YoutubePlayListInfo[]>(
    'youtubePlayListInfo',
    youtubePlayListInfos,
    storage
);