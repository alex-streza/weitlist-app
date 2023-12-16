import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  createWaitlist: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        websiteURL: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const waitlist = await ctx.db.waitlist.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });

      return waitlist;
    }),
  editWaitlist: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        websiteURL: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const waitlist = await ctx.db.waitlist.update({
        data: {
          ...input,
        },
        where: {
          userId: ctx.session.user.id,
          id: input.id,
        },
      });

      return waitlist;
    }),
  deleteEntries: protectedProcedure
    .input(
      z.object({
        ids: z.number().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const entries = await ctx.db.entry.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });

      return entries;
    }),
  selectWaitlist: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        data: {
          selectedWaitlistId: input.id,
        },
        where: {
          id: ctx.session.user.id,
        },
      });

      return user;
    }),
  getWaitlist: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input: { id } }) => {
      const waitlist = await ctx.db.waitlist.findUnique({
        where: {
          userId: ctx.session.user.id,
          id,
        },
      });

      return waitlist;
    }),
  getWaitlists: protectedProcedure.query(async ({ ctx }) => {
    const waitlists = await ctx.db.waitlist.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        user: true,
      },
    });

    return waitlists.map((waitlist) => ({
      ...waitlist,
      selected: waitlist.user.selectedWaitlistId === waitlist.id,
    }));
  }),
  getWaitlistEntries: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        search: z.string().optional(),
        type: z.enum(["JOINED", "INVITED"]).optional(),
        pagination: z.object({
          page: z.number().optional(),
          perPage: z.number().optional(),
        }),
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          id,
          search = "",
          type = "JOINED",
          pagination: { page = 0, perPage = 10 } = {},
        },
      }) => {
        const entries = await ctx.db.entry.findMany({
          where: {
            OR: [
              {
                email: {
                  contains: search,
                },
              },
              {
                firstName: {
                  contains: search,
                },
              },
              {
                lastName: {
                  contains: search,
                },
              },
            ],
            type,
            waitlistId: id,
            waitlist: {
              userId: ctx.session.user.id,
            },
          },
          take: perPage,
          skip: perPage * page,
          include: {
            referees: true,
          },
        });

        return entries;
      },
    ),
  getReferralEntries: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        search: z.string().optional(),
        pagination: z.object({
          page: z.number().optional(),
          perPage: z.number().optional(),
        }),
      }),
    )
    .query(
      async ({
        ctx,
        input: { id, search = "", pagination: { page = 0, perPage = 10 } = {} },
      }) => {
        const entries = await ctx.db.entry.findMany({
          select: {
            id: true,
            email: true,
            referralCode: true,
            referees: {
              select: {
                id: true,
                email: true,
              },
            },
          },
          where: {
            OR: [
              {
                email: {
                  contains: search,
                },
              },
              {
                firstName: {
                  contains: search,
                },
              },
              {
                lastName: {
                  contains: search,
                },
              },
            ],
            referees: {
              some: {
                waitlistId: id,
              },
            },
            waitlistId: id,
            waitlist: {
              userId: ctx.session.user.id,
            },
          },
          take: perPage,
          skip: perPage * page,
        });

        return entries;
      },
    ),
});
