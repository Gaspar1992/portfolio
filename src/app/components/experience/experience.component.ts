import { Component, input, inject } from '@angular/core';
import { ProfileService, type LinkedInProfile } from '../../services/profile.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  template: `
    <section class="section-transition experience-section section-snap" id="experience">
      <div class="container">
        <h2 class="text-center">Motion Picture Credits</h2>
        
        <div class="divider-deco mb-6">
          <div class="divider-icon">
            <span>★</span>
          </div>
        </div>
        
        <div class="timeline">
          @for (exp of profile()?.experience; track exp.id) {
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="card-deco timeline-card">
                <div class="timeline-header">
                  <h3>{{ exp.title }}</h3>
                  <span class="timeline-company">{{ exp.company }}</span>
                  <span class="timeline-date">
                    {{ profileService.formatExperienceDate(exp.startDate, exp.endDate, exp.isCurrent) }}
                  </span>
                </div>
                
                @if (exp.description; as desc) {
                <p class="timeline-description">
                  {{ desc.split('\n\n')[0] }}
                </p>
                
                @if (getAchievements(desc).length > 0) {
                  <ul class="timeline-achievements">
                    @for (achievement of getAchievements(desc); track achievement) {
                      <li>{{ achievement }}</li>
                    }
                  </ul>
                }
                
                <div class="timeline-tags">
                  @for (skill of exp.skills.slice(0, 5); track skill) {
                    <span class="tag-deco">{{ skill }}</span>
                  }
                </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .section-transition {
      position: relative;
      padding: 6rem 0;
    }

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
  `]
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
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());
  }
}
