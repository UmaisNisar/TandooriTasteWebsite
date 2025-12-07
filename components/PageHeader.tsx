type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  subtitle
}: PageHeaderProps) {
  return (
    <section className="section-padding pb-6">
      <div className="container-section space-y-4">
        {eyebrow && <span className="pill">{eyebrow}</span>}
        <h1 className="section-heading">{title}</h1>
        {subtitle && (
          <p className="section-subtitle max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}




