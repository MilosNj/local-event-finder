import Link from "next/link";

export type EventCardProps = {
  id: string;
  title: string;
  slug: string;
  city: string;
};

export function EventCard({ id, title, slug, city }: EventCardProps) {
  return (
    <Link
      key={id}
      href={`/events/${encodeURIComponent(city.toLowerCase())}/${slug}`}
      className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md"
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{city}</p>
    </Link>
  );
}
