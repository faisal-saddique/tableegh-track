import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const visitRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        contactId: z.string().optional(),
        blockId: z.string().optional(),
        purpose: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const visits = await ctx.db.visit.findMany({
        where: {
          ...(input.contactId && { contactId: input.contactId }),
          ...(input.blockId && { blockId: input.blockId }),
          ...(input.purpose && { purpose: input.purpose }),
        },
        include: {
          contact: true,
          block: true,
          createdBy: {
            select: { name: true, email: true },
          },
        },
        orderBy: { visitDate: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (visits.length > input.limit) {
        const nextItem = visits.pop();
        nextCursor = nextItem!.id;
      }

      return {
        visits,
        nextCursor,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.visit.findUnique({
        where: { id: input.id },
        include: {
          contact: true,
          block: true,
          createdBy: {
            select: { name: true, email: true },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        contactId: z.string(),
        blockId: z.string(),
        visitDate: z.date().optional(),
        purpose: z.string().min(1),
        response: z.string().optional(),
        duration: z.number().optional(),
        followUpNeeded: z.boolean().default(false),
        followUpDate: z.date().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.visit.create({
        data: {
          ...input,
          visitDate: input.visitDate ?? new Date(),
          createdById: ctx.session.user.id,
        },
        include: {
          contact: true,
          block: true,
          createdBy: {
            select: { name: true, email: true },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        visitDate: z.date().optional(),
        purpose: z.string().min(1).optional(),
        response: z.string().optional(),
        duration: z.number().optional(),
        followUpNeeded: z.boolean().optional(),
        followUpDate: z.date().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.visit.update({
        where: { id },
        data,
        include: {
          contact: true,
          block: true,
          createdBy: {
            select: { name: true, email: true },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.visit.delete({
        where: { id: input.id },
      });
    }),

  getUpcomingFollowUps: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.visit.findMany({
      where: {
        followUpNeeded: true,
        followUpDate: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
      },
      include: {
        contact: true,
        block: true,
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { followUpDate: "asc" },
    });
  }),

  getRecentActivity: protectedProcedure
    .input(z.object({ days: z.number().min(1).max(30).default(7) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.visit.findMany({
        where: {
          visitDate: {
            gte: new Date(Date.now() - input.days * 24 * 60 * 60 * 1000),
          },
        },
        include: {
          contact: true,
          block: true,
          createdBy: {
            select: { name: true, email: true },
          },
        },
        orderBy: { visitDate: "desc" },
        take: 20,
      });
    }),
});