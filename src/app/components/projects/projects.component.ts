import { ProfileService } from '../../services/profile.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  template: `
    <section 
      class="section-transition projects-section" 
      id="projects"
      aria-labelledby="projects-title"
      role="region"
      data-testid="projects-section">
      <div class="container">
        <h2 class="text-center" id="projects-title">Featured Productions</h2>
        
        <div class="divider-deco mb-6" aria-hidden="true">
          <div class="divider-icon">
            <span aria-hidden="true">🎬</span>
          </div>
        </div>
        
        <div class="grid grid-2" role="list" aria-label="Proyectos destacados" data-testid="projects-grid">
          @for (project of profile()?.projects; track project.id) {
            <article class="card-deco project-card" role="listitem" [attr.aria-labelledby]="'project-' + project.id" data-testid="project-card">
              <header class="project-header">
                <h3 [id]="'project-' + project.id" data-testid="project-name">{{ project.name }}</h3>
                <span class="project-type" data-testid="project-technologies">{{ project.technologies.join(', ') }}</span>
              </header>
              <p role="text" data-testid="project-description">{{ project.description }}</p>
              @if (project.url) {
                <div class="project-links" data-testid="project-links">
                  <a [href]="project.url" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     class="btn-deco"
                     [attr.aria-label]="'View project ' + project.name + ' on GitHub'"
                     data-testid="project-link">
                    <span>View Project</span>
                  </a>
                </div>
              }
              <div class="project-tags" role="list" aria-label="Project technologies">
                @for (tech of project.technologies.slice(0, 4) || []; track tech) {
                  <span class="tag-deco" role="listitem">{{ tech }}</span>
                }
              </div>
            </article>
          } @empty {
            <p class="text-center" role="status" data-testid="projects-empty">No projects available at this time.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
    .project-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 0.5rem;
    }

    .project-type {
      font-family: var(--font-display);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 0.2rem 0.6rem;
      background: var(--color-black);
      color: var(--color-cream);
    }

    .project-links {
      margin: 1.5rem 0;
    }

    .project-tags {
      margin-top: 1rem;
    }

    .btn-deco {
      display: inline-block;
      font-family: var(--font-display);
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 1rem 2.5rem;
      border: 2px solid var(--color-gold);
      background: transparent;
      color: var(--color-gold);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      text-decoration: none;
    }

    .btn-deco::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: var(--color-gold);
      transition: left 0.3s ease;
      z-index: -1;
    }

    .btn-deco:hover {
      color: var(--color-white);
    }

    .btn-deco:hover::before {
      left: 0;
    }

  `,
  ],
})
export class ProjectsComponent {
  profile = inject(ProfileService).profile;
}
