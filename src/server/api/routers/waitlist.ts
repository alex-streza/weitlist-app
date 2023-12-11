import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

function generateCode(length: number) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n)).toUpperCase();
  }
  return retVal;
}

export const waitlistRouter = createTRPCRouter({
  join: publicProcedure
    .input(
      z.object({
        waitlistId: z.string(),
        email: z.string(),
        source: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const waitlist = await ctx.db.entry.create({
        data: {
          ...input,
          referralCode: generateCode(6),
        },
      });

      return waitlist;
    }),
});
