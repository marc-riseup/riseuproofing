'use client';

import { useState } from 'react';
import { company, reviews, reviewsSummary, type Review } from '@/lib/content';
import { Icon } from '@/components/ui/Icon';

const PAGE = 3;
const pages: Review[][] = [];
for (let i = 0; i < reviews.length; i += PAGE) pages.push(reviews.slice(i, i + PAGE));

function Attribution({ r }: { r: Review }) {
  const href = r.source === 'Google' ? company.urls.google : company.urls.yelp;
  return (
    <figcaption className="quote__by">
      <span className="quote__avatar" aria-hidden="true">
        {r.initials}
      </span>
      <span className="quote__who">
        <span className="quote__name">{r.name}</span>
        <span className="quote__meta">
          {r.city}, {r.tag.toLowerCase()}
        </span>
      </span>
      <a className="quote__src" href={href} target="_blank" rel="noopener">
        {r.source}
        <span className="sr-only"> review by {r.name} (opens in a new tab)</span>
      </a>
    </figcaption>
  );
}

export function Reviews() {
  const [page, setPage] = useState(0);
  const go = (d: number) => setPage((p) => (p + d + pages.length) % pages.length);
  const first = page * PAGE + 1;
  const last = Math.min(reviews.length, first + PAGE - 1);

  return (
    <section id="reviews" className="section reviews" data-tone="light" aria-labelledby="reviews-h">
      <div className="wrap reviews__grid">
        <div className="reviews__agg">
          <h2 id="reviews-h" className="h2 reviews__h">
            What San Diego homeowners say
          </h2>
          <p className="agg">
            <span className="agg__score">{reviewsSummary.rating}</span>
            <span className="agg__stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Icon key={i} name="star" />
              ))}
            </span>
            <span className="sr-only">out of 5 stars</span>
          </p>
          <p className="agg__sources quote__sources">
            <a className="tlink" href={company.urls.google} target="_blank" rel="noopener">
              Google {reviewsSummary.google}
            </a>
            <a className="tlink" href={company.urls.yelp} target="_blank" rel="noopener">
              Yelp {reviewsSummary.yelp}
            </a>
            <a className="tlink" href="/reviews">
              Read all verified reviews
              <Icon name="arrow" className="tlink__arrow" />
            </a>
          </p>
          <p className="agg__honest">{reviewsSummary.total} verified reviews, all of them shown here.</p>
          <div className="reviews__nav">
            <button type="button" className="rnav" onClick={() => go(-1)} aria-label="Previous reviews" aria-controls="review-pages">
              <Icon name="prev" />
            </button>
            <button type="button" className="rnav" onClick={() => go(1)} aria-label="Next reviews" aria-controls="review-pages">
              <Icon name="next" />
            </button>
            <span className="rnav__count" aria-live="polite">
              {first === last ? first : `${first}–${last}`} of {reviews.length}
            </span>
          </div>
        </div>

        <div id="review-pages" className="reviews__pages">
          {pages.map((set, pi) => {
            const [lead, ...more] = set;
            return (
              <div key={pi} className="rpage" hidden={pi !== page}>
                <figure className="quote quote--lead">
                  <blockquote>
                    <p>&ldquo;{lead.text}&rdquo;</p>
                  </blockquote>
                  <Attribution r={lead} />
                </figure>
                {more.length > 0 ? (
                  <div className="rpage__more">
                    {more.map((r) => (
                      <figure key={r.id} className="quote">
                        <blockquote>
                          <p>&ldquo;{r.text}&rdquo;</p>
                        </blockquote>
                        <Attribution r={r} />
                      </figure>
                    ))}
                  </div>
                ) : (
                  <p className="rpage__end">
                    That is all ten. Read them where they were written:{' '}
                    <a className="tlink" href={company.urls.google} target="_blank" rel="noopener">
                      Google
                    </a>{' '}
                    and{' '}
                    <a className="tlink" href={company.urls.yelp} target="_blank" rel="noopener">
                      Yelp
                    </a>
                    .
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
