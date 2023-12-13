import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { RouterOutputs } from "~/trpc/shared";

//deprecated
export const selectedWaitlistAtom = atomWithStorage<
  RouterOutputs["admin"]["getWaitlist"] | undefined
>("selectedWaitlist", undefined);
