import { Component, inject, input } from '@angular/core';
import { type LinkedInProfile, ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-education',
  standalone: true,
  template: `
    <section 
      class="section-transition education-section" 
      id="education"
      aria-labelledby="education-title"
      role="region"
      data-testid="education-section">
      <div class="container">
        <h2 class="text-center" id="education-title">Academy Training</h2>
        
        <div class="divider-deco mb-6" aria-hidden="true">
          <div class="divider-icon">
            <span aria-hidden="true">🎓</span>
          </div>
        </div>
        
        <div class="grid grid-2" role="list" aria-label="Academic education" data-testid="education-grid">
          @for (edu of profile()?.education; track edu.id) {
            <article class="card-deco education-card" role="listitem" [attr.aria-labelledby]="'edu-' + edu.id" data-testid="education-card">
              <time class="education-year" [attr.datetime]="edu.startDate" data-testid="education-year">
                {{ edu.endDate ? profileService.formatEducationDate(edu.startDate, edu.endDate) : profileService.formatEducationDate(edu.startDate, edu.startDate) }}
              </time>
              <h3 [id]="'edu-' + edu.id" data-testid="education-degree">{{ edu.degree }}</h3>
              <p class="education-school" role="doc-subtitle" data-testid="education-school">{{ edu.school }}</p>
              <p class="education-field">{{ edu.fieldOfStudy }}</p>
              @if (edu.grade) {
                <span class="education-grade" aria-label="Grade: {{ edu.grade }}">{{ edu.grade }}</span>
              }
            </article>
          } @empty {
            <p class="text-center" role="status" data-testid="education-empty">No education information available.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
    .education-card {
      text-align: center;
    }

    .education-year {
      font-family: var(--font-display);
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      color: var(--color-gold);
      margin-bottom: 1rem;
    }

    .education-school {
      font-family: var(--font-heading);
      font-style: italic;
      color: var(--color-black);
      margin-bottom: 0.5rem;
    }

    .education-field {
      font-size: 0.95rem;
      color: var(--color-black-soft);
      margin-bottom: 1rem;
    }

    .education-grade {
      display: inline-block;
      font-family: var(--font-display);
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      padding: 0.3rem 0.8rem;
      border: 1px solid var(--color-gold);
      color: var(--color-gold);
    }

  `,
  ],
})
export class EducationComponent {
  profile = input<LinkedInProfile | null>(null);
  profileService = inject(ProfileService);
}
