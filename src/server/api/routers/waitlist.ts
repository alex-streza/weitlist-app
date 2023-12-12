import { TRPCError } from "@trpc/server";
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
        refId: z.string(),
        email: z.string(),
        source: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { refId, ...input } }) => {
      const waitlist = await ctx.db.waitlist.findUnique({
        where: {
          refId,
        },
      });

      if (!waitlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Waitlist not found",
        });
      }

      const entry = await ctx.db.entry.create({
        data: {
          ...input,
          waitlistId: waitlist.id,
          referralCode: generateCode(6),
        },
      });

      return entry;
    }),
});
