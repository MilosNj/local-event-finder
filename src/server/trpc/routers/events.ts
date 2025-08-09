/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/trpc/trpc";

export const eventsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          city: z.string().optional(),
          limit: z.number().min(1).max(50).default(20),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const limit = input?.limit ?? 20;
      const where = input?.city
        ? { city: { equals: input.city, mode: "insensitive" as const } }
        : {};
      const events: Array<{
        id: number;
        title: string;
        slug: string;
        city: string;
        description: string | null;
        category: string;
        imageUrl: string | null;
        startsAt: Date;
      }> = await db.event.findMany({
        where,
        orderBy: { startsAt: "asc" },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          city: true,
          description: true,
          category: true,
          imageUrl: true,
          startsAt: true,
        },
      });
      return events;
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      return db.event.findUnique({
        where: { slug: input.slug },
        select: {
          id: true,
          title: true,
          slug: true,
          city: true,
          description: true,
          category: true,
          imageUrl: true,
          startsAt: true,
          endsAt: true,
          venue: { select: { name: true, city: true } },
        },
      });
    }),

  bySlugs: publicProcedure
    .input(z.object({ slugs: z.array(z.string().min(1)).max(100) }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const events: Array<{
        id: number;
        title: string;
        slug: string;
        city: string;
        description: string | null;
        category: string;
        imageUrl: string | null;
        startsAt: Date;
      }> = await db.event.findMany({
        where: { slug: { in: input.slugs } },
        select: {
          id: true,
          title: true,
          slug: true,
          city: true,
          description: true,
          category: true,
          imageUrl: true,
          startsAt: true,
        },
      });
      // preserve incoming order of slugs
      const bySlug = new Map<string, (typeof events)[number]>(
        events.map((e) => [e.slug, e]),
      );
      return input.slugs.map((s) => bySlug.get(s)).filter(Boolean);
    }),

  cities: createTRPCRouter({
    list: publicProcedure.query(async ({ ctx }) => {
      const { db } = ctx;
      const cities: Array<{ city: string }> = await db.event.findMany({
        distinct: ["city"],
        select: { city: true },
        orderBy: { city: "asc" },
      });
      return cities.map((c) => c.city);
    }),
  }),
});
