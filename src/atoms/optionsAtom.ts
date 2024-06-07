import { storage } from "../utils/storage";
import { atomWithStorage } from "jotai/utils";

export interface options {
    isRandom: boolean,
    isLoop: boolean,
    myPlaylist: boolean,
}

const normalOption: options = {
    isRandom: false,
    isLoop: false,
    myPlaylist: true,
};

export const optionsAtom = atomWithStorage<options>(
    'options',
    normalOption,
    storage,
);