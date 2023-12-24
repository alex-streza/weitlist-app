import type { Entry } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import JoinedEmail from "react-email-starter/emails/joined";
import { z } from "zod";
import { env } from "~/env";

import { Resend } from "resend";
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
      let referredEntry: Entry | null = null;
      if (referralCode) {
        referredEntry = await ctx.db.entry.findUnique({
          where: {
            referralCode,
          },
        });
      }
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

      const existingEntry = await ctx.db.entry.findUnique({
        where: {
          waitlistId: waitlist.id,
          email: input.email,
        },
      });

      if (existingEntry) {
        return existingEntry;
      }

      const entry = await ctx.db.entry.create({
        data: {
          ...input,
          waitlistId: waitlist.id,
          referralCode: generateCode(6),
          ...(referredEntry
            ? {
                referrerId: referredEntry.id,
              }
            : {}),
        },
      });

      const resend = new Resend(env.RESEND_API_KEY);

      await resend.emails.send({
        from: "notifications@weitlist.me",
        to: entry.email,
        subject: "You're on the waitlist 🎉",
        react: (
          <JoinedEmail
            name={entry.firstName ?? undefined}
            link={`https://weitlist.me/w/${waitlist.refId}?user=${entry.referralCode}`}
            regards={`The ${waitlist.name} team`}
          />
        ),
      });

      return entry;
    }),

  getReferralInfo: publicProcedure
    .input(
      z.object({
        referralCode: z.string(),
      }),
    )
    .query(async ({ ctx, input: { referralCode } }) => {
      const entry = await ctx.db.entry.findUnique({
        where: {
          referralCode,
        },
        include: { waitlist: true },
      });
      if (!entry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Referral code not found",
        });
      }

      const entriesCount = await ctx.db.entry.count({
        where: {
          waitlistId: entry.waitlistId,
        },
      });

      const referrers = await ctx.db.entry.findMany({
        where: {
          referrerId: entry.id,
        },
      });
      return {
        entry,
        entriesCount,
        referrers,
      };
    }),
  getWaitlist: publicProcedure
    .input(
      z.object({
        refId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { refId } }) => {
      const waitlist = await ctx.db.waitlist.findUnique({
        where: {
          refId,
        },
        select: {
          name: true,
          refId: true,
          description: true,
          websiteURL: true,
        },
      });
      if (!waitlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Waitlist not found",
        });
      }

      const entriesCount = await ctx.db.entry.count({
        where: {
          waitlistId: waitlist.id,
        },
      });

      return {
        waitlist,
        entriesCount,
      };
    }),
});
