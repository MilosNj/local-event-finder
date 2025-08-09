import { HydrateClient, api } from "~/trpc/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FavoriteToggle } from "~/components/FavoriteToggle";

function formatDateRange(start: Date | string, end?: Date | string | null) {
  const s = new Date(start);
  if (!end)
    return s.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const e = new Date(end);
  const sameDay = s.toDateString() === e.toDateString();
  if (sameDay) {
    return `${s.toLocaleDateString(undefined, { month: "short", day: "numeric" })} ${s.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} – ${e.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
  }
  return `${s.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} – ${e.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
}

type EventDetail = {
  id: number;
  title: string;
  slug: string;
  city: string;
  description: string | null;
  category: string;
  imageUrl: string | null;
  startsAt: Date;
  endsAt: Date | null;
  venue: { name: string; city: string } | null;
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { slug } = await params;
  const data = (await api.events.bySlug({ slug })) as EventDetail | null;
  if (!data) notFound();

  return (
    <HydrateClient>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            ← Back to home
          </Link>
        </div>
        {data.imageUrl && (
          <div className="mb-6 overflow-hidden rounded-lg border bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.imageUrl}
              alt={data.title}
              className="h-80 w-full object-cover"
            />
          </div>
        )}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm tracking-wide text-gray-500 uppercase">
              {data.category}
            </p>
            <h1 className="mt-1 text-3xl font-bold">{data.title}</h1>
          </div>
          <FavoriteToggle slug={data.slug} />
        </div>
        <div className="mb-4 text-sm text-gray-600">
          <p>
            {formatDateRange(data.startsAt, data.endsAt)} • {data.city}
          </p>
          {data.venue && (
            <p>
              Venue: <span className="font-medium">{data.venue.name}</span>
              {" – "}
              <span className="text-gray-500">{data.venue.city}</span>
            </p>
          )}
        </div>
        {data.description && (
          <p className="leading-relaxed text-gray-700">{data.description}</p>
        )}
      </main>
    </HydrateClient>
  );
}
