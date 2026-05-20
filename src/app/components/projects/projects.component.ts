import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      margin-block-end: 1rem;
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

    .project-links { margin-block: 1.5rem; }
    .project-tags { margin-block-start: 1rem; }
    
  `,
  ],
})
export class ProjectsComponent {
  profile = inject(ProfileService).profile;
}
