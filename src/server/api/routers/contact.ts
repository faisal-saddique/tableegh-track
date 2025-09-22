import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const contactRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        blockId: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const contacts = await ctx.db.contact.findMany({
        where: {
          ...(input.blockId && { blockId: input.blockId }),
          ...(input.search && {
            OR: [
              { name: { contains: input.search } },
              { phoneNumber: { contains: input.search } },
              { address: { contains: input.search } },
              { occupation: { contains: input.search } },
            ],
          }),
        },
        include: {
          block: true,
          createdBy: {
            select: { name: true, email: true },
          },
          visits: {
            orderBy: { visitDate: "desc" },
            take: 3,
          },
          _count: {
            select: { visits: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (contacts.length > input.limit) {
        const nextItem = contacts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        contacts,
        nextCursor,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.contact.findUnique({
        where: { id: input.id },
        include: {
          block: true,
          createdBy: {
            select: { name: true, email: true },
          },
          visits: {
            orderBy: { visitDate: "desc" },
            include: {
              createdBy: {
                select: { name: true, email: true },
              },
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        fatherName: z.string().optional(),
        phoneNumber: z.string().optional(),
        houseNumber: z.string().optional(),
        address: z.string().optional(),
        occupation: z.string().optional(),
        timings: z.string().optional(),
        notes: z.string().optional(),
        isMuslim: z.boolean().default(false),
        isInterested: z.boolean().default(false),
        blockId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.contact.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
        },
        include: {
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
        name: z.string().min(1).optional(),
        fatherName: z.string().optional(),
        phoneNumber: z.string().optional(),
        houseNumber: z.string().optional(),
        address: z.string().optional(),
        occupation: z.string().optional(),
        timings: z.string().optional(),
        notes: z.string().optional(),
        isMuslim: z.boolean().optional(),
        isInterested: z.boolean().optional(),
        blockId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.contact.update({
        where: { id },
        data,
        include: {
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
      return ctx.db.contact.delete({
        where: { id: input.id },
      });
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [totalContacts, muslimContacts, interestedContacts, recentVisits] =
      await Promise.all([
        ctx.db.contact.count(),
        ctx.db.contact.count({ where: { isMuslim: true } }),
        ctx.db.contact.count({ where: { isInterested: true } }),
        ctx.db.visit.count({
          where: {
            visitDate: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
      ]);

    return {
      totalContacts,
      muslimContacts,
      interestedContacts,
      recentVisits,
    };
  }),
});