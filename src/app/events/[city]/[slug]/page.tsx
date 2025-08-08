import { HydrateClient, api } from "~/trpc/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FavoriteToggle } from "~/components/FavoriteToggle";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city, slug } = await params;
  const data = await api.events.bySlug({ slug });
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
        <p className="text-sm text-gray-500">{city}</p>
        <div className="mb-2 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <FavoriteToggle slug={data.slug} />
        </div>
        <p className="text-gray-700">{data.description}</p>
      </main>
    </HydrateClient>
  );
}
