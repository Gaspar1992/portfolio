import { Component, inject, input } from '@angular/core';
import { type LinkedInProfile, ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  template: `
    <section 
      class="section-transition experience-section" 
      id="experience"
      aria-labelledby="experience-title"
      role="region"
      data-testid="experience-section">
      <div class="container">
        <h2 class="text-center" id="experience-title">Professional Credits</h2>
        
        <div class="divider-deco mb-6" aria-hidden="true">
          <div class="divider-icon">
            <span>★</span>
          </div>
        </div>
        
        <div class="timeline" role="list" aria-label="Work experience" data-testid="experience-timeline">
          @for (exp of profile()?.experience; track exp.id) {
            <article class="timeline-item" role="listitem" [attr.aria-label]="exp.title + ' at ' + exp.company" data-testid="experience-item">
              <div class="timeline-marker" aria-hidden="true"></div>
              <div class="card-deco timeline-card">
                <header class="timeline-header">
                  <h3 data-testid="experience-title">{{ exp.title }}</h3>
                  <span class="timeline-company" data-testid="experience-company">{{ exp.company }}</span>
                  <time class="timeline-date" [attr.datetime]="exp.startDate" data-testid="experience-date">
                    {{ profileService.formatExperienceDate(exp.startDate, exp.endDate, exp.isCurrent) }}
                  </time>
                </header>
                
                @if (exp.description; as desc) {
                <p class="timeline-description" role="text">
                  {{ getFirstParagraph(desc) }}
                </p>
                
                @if (getAchievements(desc).length > 0) {
                  <ul class="timeline-achievements" role="list" aria-label="Key achievements">
                    @for (achievement of getAchievements(desc); track achievement) {
                      <li role="listitem">{{ achievement }}</li>
                    }
                  </ul>
                }
                
                <div class="timeline-tags" role="list" aria-label="Technologies used">
                  @for (skill of exp.skills.slice(0, 5); track skill) {
                    <span class="tag-deco" role="listitem">{{ skill }}</span>
                  }
                </div>
                }
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
    .timeline {
      position: relative;
      padding-left: 2rem;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(to bottom, var(--color-gold), var(--color-cream-dark));
    }

    .timeline-item {
      position: relative;
      margin-bottom: 2rem;
    }

    .timeline-marker {
      position: absolute;
      left: -2.4rem;
      top: 1.5rem;
      width: 12px;
      height: 12px;
      background: var(--color-gold);
      border: 2px solid var(--color-cream);
      transform: rotate(45deg);
    }

    .timeline-header {
      margin-bottom: 1rem;
    }

    .timeline-header h3 {
      margin-bottom: 0.25rem;
    }

    .timeline-company {
      display: block;
      font-family: var(--font-display);
      font-size: 0.9rem;
      color: var(--color-gold);
      letter-spacing: 0.1em;
    }

    .timeline-date {
      display: block;
      font-family: var(--font-display);
      font-size: 0.8rem;
      color: var(--color-bronze);
      margin-top: 0.25rem;
    }

    .timeline-achievements {
      list-style: none;
      margin: 1rem 0;
      padding-left: 0;
    }

    .timeline-achievements li {
      position: relative;
      padding-left: 1.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .timeline-achievements li::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: var(--color-gold);
    }

    .timeline-tags {
      margin-top: 1rem;
    }

  `,
  ],
})
export class ExperienceComponent {
  profile = input<LinkedInProfile | null>(null);
  profileService = inject(ProfileService);

  getAchievements(description: string): string[] {
    if (!description) return [];
    const parts = description.split('\n\n');
    if (parts.length < 2) return [];

    const achievementsText = parts[1];
    return achievementsText
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.trim().substring(1).trim());
  }

  getFirstParagraph(description: string): string {
    if (!description) return '';
    return description.split('\n\n')[0] || description;
  }
}
