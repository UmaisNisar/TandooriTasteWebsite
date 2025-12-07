import Image from "next/image";

type DishCardProps = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  badge?: string;
};

export default function DishCard({
  name,
  description,
  price,
  imageUrl,
  badge
}: DishCardProps) {
  return (
    <article className="card-surface flex flex-col overflow-hidden transition hover:-translate-y-1 hover:border-gold/60 hover:shadow-soft">
      <div className="relative h-48 w-full sm:h-56">
        {/* Replace imageUrl with local assets or your own links */}
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal">
            {badge}
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-gold">
          {price}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="font-heading text-lg text-white">{name}</h3>
        <p className="flex-1 text-sm text-gray-300">{description}</p>
      </div>
    </article>
  );
}




