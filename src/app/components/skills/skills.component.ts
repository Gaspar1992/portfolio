import { Component, input } from '@angular/core';
import type { LinkedInProfile } from '../../services/profile.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  template: `
    <section 
      class="section-transition skills-section" 
      id="skills"
      aria-labelledby="skills-title"
      role="region"
      data-testid="skills-section">
      <div class="container">
        <h2 class="text-center" id="skills-title">Technical Repertoire</h2>
        
        <div class="divider-deco mb-6" aria-hidden="true">
          <div class="divider-icon">
            <span aria-hidden="true">⚙</span>
          </div>
        </div>
        
        <!-- Core Expertise -->
        @if (getExpertSkills().length > 0) {
          <div class="skills-group">
            <h3 class="skills-subtitle" aria-label="Core expertise">
              <span class="subtitle-line"></span>
              <span class="subtitle-text">STARRING</span>
              <span class="subtitle-line"></span>
            </h3>
            <ul class="skills-grid" aria-label="Core expertise skills" data-testid="expert-skills-list">
              @for (skill of getExpertSkills(); track skill.name) {
                <li class="skill-item card-deco skill-expert" [attr.aria-label]="skill.name" data-testid="skill-item-expert">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="expert-badge" aria-hidden="true">★</span>
                </li>
              }
            </ul>
          </div>
        }
        
        <!-- Additional Capabilities -->
        @if (getAdditionalSkills().length > 0) {
          <div class="skills-group">
            <h3 class="skills-subtitle" aria-label="Additional capabilities">
              <span class="subtitle-line"></span>
              <span class="subtitle-text">ALSO FEATURING</span>
              <span class="subtitle-line"></span>
            </h3>
            <ul class="skills-grid skills-additional" aria-label="Additional skills" data-testid="additional-skills-list">
              @for (skill of getAdditionalSkills(); track skill.name) {
                <li class="skill-item card-deco" [attr.aria-label]="skill.name" data-testid="skill-item">
                  <span class="skill-name">{{ skill.name }}</span>
                </li>
              }
            </ul>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
    .section-transition {
      position: relative;
      padding: 6rem 0;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      .skills-grid {
        grid-template-columns: 1fr;
      }
    }

    .skills-group {
      margin-bottom: 3rem;
    }

    .skills-group:last-child {
      margin-bottom: 0;
    }

    .skills-subtitle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
      font-family: var(--font-display);
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      color: var(--color-bronze);
      text-transform: uppercase;
    }

    .subtitle-line {
      flex: 0 0 60px;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--color-bronze),
        transparent
      );
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .skills-additional {
      opacity: 0.85;
    }

    @media (max-width: 768px) {
      .skills-grid {
        grid-template-columns: 1fr;
      }
    }

    .skill-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .skill-item.skill-expert {
      border-color: var(--color-gold);
    }

    .skill-item.skill-expert::before {
      border-color: var(--color-gold);
      opacity: 0.8;
    }

    .skill-name {
      font-family: var(--font-display);
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .expert-badge {
      font-size: 1rem;
      color: var(--color-gold);
      line-height: 1;
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
export class SkillsComponent {
  profile = input<LinkedInProfile | null>(null);

  getExpertSkills() {
    const skills = this.profile()?.skills || [];
    return skills.filter((s) => s.expert);
  }

  getAdditionalSkills() {
    const skills = this.profile()?.skills || [];
    return skills.filter((s) => !s.expert);
  }
}
