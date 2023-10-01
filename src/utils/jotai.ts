import { atom } from "jotai";

export const globalGamePlayersAtom = atom<{ id: string; name: string }[]>([]);
