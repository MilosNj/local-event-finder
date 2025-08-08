import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/trpc/trpc";

// Demo-only router kept for compatibility; no DB access.
export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // No-op: previously created a Post in the DB.
      return { id: 0, name: input.name, createdAt: new Date() };
    }),

  getLatest: publicProcedure.query(async () => {
    // No-op: previously fetched the latest Post from the DB.
    return null;
  }),
});
