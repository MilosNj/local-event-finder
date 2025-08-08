import { HydrateClient, api } from "~/trpc/server";
import { notFound } from "next/navigation";

export default async function EventDetailPage({
  params,
}: {
  params: { city: string; slug: string };
}) {
  const data = await api.events.bySlug({ slug: params.slug });
  if (!data) notFound();

  return (
    <HydrateClient>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-gray-500">{params.city}</p>
        <h1 className="mb-2 text-3xl font-bold">{data.title}</h1>
        <p className="text-gray-700">{data.description}</p>
      </main>
    </HydrateClient>
  );
}
