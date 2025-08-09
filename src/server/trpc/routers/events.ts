import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/trpc/trpc";

export const eventsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          city: z.string().optional(),
          limit: z.number().min(1).max(50).default(20),
          page: z.number().min(1).default(1).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const limit = input?.limit ?? 20;
      const page = input?.page ?? 1;
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
        skip: (page - 1) * limit,
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
  count: publicProcedure
    .input(
      z
        .object({
          city: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const where = input?.city
        ? { city: { equals: input.city, mode: "insensitive" as const } }
        : {};
      const total = await db.event.count({ where });
      return total;
    }),
  listInfinite: publicProcedure
    .input(
      z
        .object({
          city: z.string().optional(),
          limit: z.number().min(1).max(50).default(12),
          cursor: z
            .object({
              startsAt: z.string(),
              id: z.number(),
            })
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const limit = input?.limit ?? 12;
      const whereBase = input?.city
        ? { city: { equals: input.city, mode: "insensitive" as const } }
        : {};
      const cursorFilter = input?.cursor
        ? {
            OR: [
              { startsAt: { gt: new Date(input.cursor.startsAt) } },
              {
                AND: [
                  { startsAt: { equals: new Date(input.cursor.startsAt) } },
                  { id: { gt: input.cursor.id } },
                ],
              },
            ],
          }
        : {};
      const where = { AND: [whereBase, cursorFilter] };

      const rows = await db.event.findMany({
        where,
        orderBy: [{ startsAt: "asc" }, { id: "asc" }],
        take: limit + 1, // fetch one extra to determine next cursor
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

      let nextCursor: { startsAt: string; id: number } | undefined = undefined;
      if (rows.length > limit) {
        const next = rows.pop();
        if (next)
          nextCursor = { startsAt: next.startsAt.toISOString(), id: next.id };
      }

      return { items: rows, nextCursor };
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
