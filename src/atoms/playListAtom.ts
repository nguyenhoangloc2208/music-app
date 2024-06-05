import { atomWithStorage } from "jotai/utils";
import { storage } from "../utils/storage";
import { YoutubeSong } from "../hooks/useSearch";

export const playListAtom = atomWithStorage<YoutubeSong[]>(
    'playList',
    [],
    storage
);