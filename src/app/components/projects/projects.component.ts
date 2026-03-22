import { Component, input } from '@angular/core';
import type { LinkedInProfile } from '../../services/profile.service';

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
    .section-transition {
      position: relative;
      padding: 6rem 0;
    }

    .grid {
      display: grid;
      gap: 2rem;
    }

    .grid-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }

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

    .tag-deco {
      display: inline-block;
      font-family: var(--font-display);
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.4rem 0.8rem;
      border: 1px solid var(--color-gold);
      color: var(--color-gold);
      margin: 0.25rem;
      transition: all 0.3s ease;
    }

    .tag-deco:hover {
      background: var(--color-gold);
      color: var(--color-white);
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

    .card-deco {
      background: var(--color-white);
      border: 1px solid var(--color-cream-dark);
      padding: 2rem;
      position: relative;
    }

    .card-deco::before {
      content: '';
      position: absolute;
      top: 8px;
      left: 8px;
      right: 8px;
      bottom: 8px;
      border: 1px solid var(--color-gold);
      pointer-events: none;
      opacity: 0.5;
    }

    .card-deco::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--color-gold),
        transparent
      );
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      position: relative;
      z-index: 10;
    }

    .text-center {
      text-align: center;
    }

    .mb-6 {
      margin-bottom: 3rem;
    }

    .divider-deco {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 3rem 0;
    }

    .divider-deco::before,
    .divider-deco::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--color-gold),
        transparent
      );
    }

    .divider-deco .divider-icon {
      width: 40px;
      height: 40px;
      margin: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--color-gold);
      transform: rotate(45deg);
    }

    .divider-deco .divider-icon span {
      transform: rotate(-45deg);
      color: var(--color-gold);
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .section-transition {
        padding: 3rem 0;
      }
      
      .container {
        padding: 0 1rem;
      }
    }
  `,
  ],
})
export class ProjectsComponent {
  profile = input<LinkedInProfile | null>(null);
}
