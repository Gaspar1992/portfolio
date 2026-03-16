import { Component, inject, input } from '@angular/core';
import { type LinkedInProfile, ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-education',
  standalone: true,
  template: `
    <section 
      class="section-transition education-section section-snap" 
      id="education"
      aria-labelledby="education-title"
      role="region">
      <div class="container">
        <h2 class="text-center" id="education-title">Academy Training</h2>
        
        <div class="divider-deco mb-6" aria-hidden="true">
          <div class="divider-icon">
            <span aria-hidden="true">🎓</span>
          </div>
        </div>
        
        <div class="grid grid-2" role="list" aria-label="Academic education">
          @for (edu of profile()?.education; track edu.id) {
            <article class="card-deco education-card" role="listitem" [attr.aria-labelledby]="'edu-' + edu.id">
              <time class="education-year" [attr.datetime]="edu.startDate">
                {{ edu.endDate ? profileService.formatEducationDate(edu.startDate, edu.endDate) : profileService.formatEducationDate(edu.startDate, edu.startDate) }}
              </time>
              <h3 [id]="'edu-' + edu.id">{{ edu.degree }}</h3>
              <p class="education-school" role="doc-subtitle">{{ edu.school }}</p>
              <p class="education-field">{{ edu.fieldOfStudy }}</p>
              @if (edu.grade) {
                <span class="education-grade" aria-label="Grade: {{ edu.grade }}">{{ edu.grade }}</span>
              }
            </article>
          } @empty {
            <p class="text-center" role="status">No education information available.</p>
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
export class EducationComponent {
  profile = input<LinkedInProfile | null>(null);
  profileService = inject(ProfileService);
}
