type FeatureProps = {
  icon?: string;
  title: string;
  description: string;
};

type WhyChooseUsProps = {
  items?: FeatureProps[];
};

export default function WhyChooseUs({ items }: WhyChooseUsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const features = items;

  return (
    <section className="section-padding">
      <div className="container-section space-y-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-heading">Why Choose Tandoori Tastes</h2>
          <p className="section-subtitle mx-auto">
            A little piece of Lahore and Karachi in Sudbury. We stay true to
            the flavours of Pakistan while tailoring spice levels to your
            table.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <article
              key={feature.title || idx}
              className="card-surface flex flex-col gap-3 p-5 sm:p-6 transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-soft"
            >
              {feature.icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-lg">
                  <span aria-hidden="true">{feature.icon}</span>
                </div>
              )}
              <h3 className="font-heading text-lg text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}




