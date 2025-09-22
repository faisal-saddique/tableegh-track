import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const blockRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.block.findMany({
      include: {
        _count: {
          select: {
            people: true,
            visits: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.block.findUnique({
        where: { id: input.id },
        include: {
          people: {
            include: {
              _count: {
                select: { visits: true },
              },
            },
            orderBy: { name: "asc" },
          },
          _count: {
            select: {
              people: true,
              visits: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.block.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.block.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.block.delete({
        where: { id: input.id },
      });
    }),

  getStats: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [totalPeople, muslimPeople, interestedPeople, recentVisits] =
        await Promise.all([
          ctx.db.contact.count({ where: { blockId: input.id } }),
          ctx.db.contact.count({
            where: { blockId: input.id, isMuslim: true },
          }),
          ctx.db.contact.count({
            where: { blockId: input.id, isInterested: true },
          }),
          ctx.db.visit.count({
            where: {
              blockId: input.id,
              visitDate: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          }),
        ]);

      return {
        totalPeople,
        muslimPeople,
        interestedPeople,
        recentVisits,
      };
    }),
});