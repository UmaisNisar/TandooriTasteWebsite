import DishCard from "./DishCard";

type BestSellersProps = {
  dishes?: Array<{
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    badge?: string;
  }>;
};

export default function BestSellers({ dishes }: BestSellersProps) {
  if (!dishes || dishes.length === 0) {
    return null;
  }

  const displayDishes = dishes;

  return (
    <section className="section-padding bg-black/40">
      <div className="container-section space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-heading">Our Best Sellers</h2>
            <p className="section-subtitle">
              Guest favourites that showcase the heart of Pakistani tandoor and
              curry cooking. Perfect for first-time visitors and regulars
              alike.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayDishes.map((dish) => (
            <DishCard key={dish.name} {...dish} />
          ))}
        </div>
      </div>
    </section>
  );
}




