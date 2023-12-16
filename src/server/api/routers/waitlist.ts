import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
        referralCode: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { refId, referralCode, ...input } }) => {
      const referredEntry = await ctx.db.entry.findUnique({
        where: {
          referralCode,
        },
      });
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
          referrerId: referredEntry?.id,
        },
      });
      console.log("entry", entry);
      return entry;
    }),
});
