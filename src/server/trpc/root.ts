import { createCallerFactory, createTRPCRouter } from "~/server/trpc/trpc";
import { eventsRouter } from "~/server/trpc/routers/events";

export const appRouter = createTRPCRouter({
  events: eventsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
