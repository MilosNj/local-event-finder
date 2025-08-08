import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/trpc/trpc";

type MockEvent = {
  id: string;
  title: string;
  slug: string;
  city: string;
  createdAt: Date;
  description?: string;
};

const MOCK_EVENTS: MockEvent[] = [
  {
    id: "1",
    title: "Belgrade Jazz Night",
    slug: "belgrade-jazz-night-1",
    city: "Belgrade",
    createdAt: new Date(),
    description: "An evening of smooth jazz in downtown Belgrade.",
  },
  {
    id: "2",
    title: "Novi Sad Tech Meetup",
    slug: "novi-sad-tech-meetup-2",
    city: "Novi Sad",
    createdAt: new Date(),
    description: "Monthly meetup for developers and tech enthusiasts.",
  },
  {
    id: "3",
    title: "Niš Rock Festival",
    slug: "nis-rock-festival-3",
    city: "Niš",
    createdAt: new Date(),
    description: "Local bands and headliners rock the stage!",
  },
  {
    id: "4",
    title: "Kragujevac Food Fair",
    slug: "kragujevac-food-fair-4",
    city: "Kragujevac",
    createdAt: new Date(),
    description: "Taste the best of local cuisine and street food.",
  },
  {
    id: "5",
    title: "Subotica Film Screening",
    slug: "subotica-film-screening-5",
    city: "Subotica",
    createdAt: new Date(),
    description: "Indie films from regional directors.",
  },
  {
    id: "6",
    title: "Belgrade Startup Pitch Night",
    slug: "belgrade-startup-pitch-night-6",
    city: "Belgrade",
    createdAt: new Date(),
    description: "Early-stage startups pitch to local investors.",
  },
];

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
    .query(async ({ input }) => {
      const filtered = input?.city
        ? MOCK_EVENTS.filter(
            (e) => e.city.toLowerCase() === input.city!.toLowerCase(),
          )
        : MOCK_EVENTS;
      return filtered.slice(0, input?.limit ?? 20);
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      return MOCK_EVENTS.find((e) => e.slug === input.slug) ?? null;
    }),

  cities: createTRPCRouter({
    list: publicProcedure.query(async () => {
      return Array.from(new Set(MOCK_EVENTS.map((e) => e.city)));
    }),
  }),
});
