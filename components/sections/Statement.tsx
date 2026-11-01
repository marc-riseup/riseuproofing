export function Statement() {
  return (
    <section id="statement" className="statement" aria-labelledby="statement-h">
      <div className="statement__stage">
        {/* TODO: placeholder photo (2.0 project shot). Replace with a real full-bleed project photo, ≥2400px wide. */}
        <picture>
          <source type="image/avif" srcSet="/img/statement/statement.avif" />
          <img
            className="statement__img"
            data-statement
            src="/img/statement/statement.webp"
            alt="A finished Rise Up tile roof on a Mediterranean home in Carlsbad"
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="statement__shade" aria-hidden="true" />
        <h2 id="statement-h" className="statement__line wrap">
          A good roof is one you never have to think about.
        </h2>
      </div>
    </section>
  );
}
