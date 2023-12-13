import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

export const useWaitlists = (
  initialData?: RouterOutputs["admin"]["getWaitlists"],
) => {
  const {
    data: waitlists,
    refetch,
    ...rest
  } = api.admin.getWaitlists.useQuery(undefined, {
    initialData: initialData ?? [],
  });

  const selectWaitlist = api.admin.selectWaitlist.useMutation({
    onSuccess: () => refetch(),
  });

  const createWaitlist = api.admin.createWaitlist.useMutation({
    onSuccess: (waitlist) => {
      selectWaitlist.mutate({
        id: waitlist.id,
      });
    },
  });

  return {
    ...rest,
    refetch,
    waitlists,
    selectWaitlist,
    createWaitlist,
    selectedWaitlist: waitlists.filter((waitlist) => waitlist.selected)[0],
  };
};
