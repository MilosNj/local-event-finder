import { createCallerFactory, createTRPCRouter } from "~/server/trpc/trpc";
import { eventsRouter } from "~/server/trpc/routers/events";
import { postRouter } from "~/server/api/routers/post";

export const appRouter = createTRPCRouter({
  events: eventsRouter,
  // Keep the demo post router for now to avoid breaking anything unexpected
  post: postRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
