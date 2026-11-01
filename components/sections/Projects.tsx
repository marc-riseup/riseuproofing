import { galleryProjects, type Project } from '@/lib/content';
import { BeforeAfter } from '@/components/projects/BeforeAfter';
import { ProjectsTabs } from '@/components/projects/ProjectsTabs';
import { Icon } from '@/components/ui/Icon';

function ProjectFigure({ p, featured = false }: { p: Project; featured?: boolean }) {
  return (
    <figure className={`proj ${featured ? 'proj--featured' : ''}`}>
      <BeforeAfter slug={p.slug} title={`${p.title}, ${p.city}`} beforeAlt={p.beforeAlt} afterAlt={p.afterAlt} />
      <figcaption className="proj__cap">
        <h3 className="proj__title">
          <a href={`/projects/${p.slug}`}>
            {p.title}, <span className="proj__city">{p.city}</span>
          </a>
        </h3>
        <dl className="proj__facts">
          <div>
            <dt>Size</dt>
            <dd>{p.size}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{p.days}</dd>
          </div>
          <div>
            <dt>Material</dt>
            <dd>{p.material}</dd>
          </div>
        </dl>
        <details className="proj__more">
          <summary>Project details</summary>
          <p>{p.summary}</p>
          <p className="proj__warranty">{p.warranty}</p>
          <p>
            <a className="tlink" href={`/projects/${p.slug}`}>
              Read full case study
              <Icon name="arrow" className="tlink__arrow" />
            </a>
          </p>
        </details>
      </figcaption>
    </figure>
  );
}

export function Projects() {
  const [featured, ...rest] = galleryProjects;
  return (
    <section id="projects" className="section projects" data-tone="light" aria-labelledby="projects-h">
      <div className="wrap">
        <header className="projects__head proj__head">
          <h2 id="projects-h" className="h2">
            Recent roofs across San Diego County
          </h2>
          <p className="lead">Drag any photo to compare. Every job is ours, start to finish: no subcontractors.</p>
          <div>
            <a className="tlink" href="/projects">
              View all projects
              <Icon name="arrow" className="tlink__arrow" />
            </a>
          </div>
        </header>
        <ProjectsTabs
          gallery={
            <div className="gallery">
              <ProjectFigure p={featured} featured />
              <div className="gallery__row">
                {rest.map((p) => (
                  <ProjectFigure key={p.slug} p={p} />
                ))}
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
