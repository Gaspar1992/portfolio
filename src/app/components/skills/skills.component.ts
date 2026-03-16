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
      role="region">
      <div class="container">
        <h2 class="text-center" id="skills-title">Technical Repertoire</h2>
        
        <div class="divider-deco mb-6" aria-hidden="true">
          <div class="divider-icon">
            <span aria-hidden="true">⚙</span>
          </div>
        </div>
        
        <div class="skills-grid" role="list" aria-label="Technical skills">
          @for (skill of getTopSkills(); track skill.name) {
            <div class="skill-item card-deco" role="listitem" [attr.aria-label]="skill.name">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                @if (skill.endorsements > 0) {
                  <span class="skill-count" aria-label="{{ skill.endorsements }} endorsements">{{ skill.endorsements }} endorsements</span>
                }
              </div>
              <div class="skill-bar" role="progressbar" [attr.aria-valuenow]="getSkillPercentage(skill.endorsements)" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="'Skill level for ' + skill.name">
                <div class="skill-fill" [style.width.%]="getSkillPercentage(skill.endorsements)"></div>
              </div>
            </div>
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

    .skill-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .skill-count {
      font-family: var(--font-display);
      font-size: 0.75rem;
      color: var(--color-gold);
      letter-spacing: 0.05em;
    }

    .skill-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .skill-name {
      font-family: var(--font-display);
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .skill-bar {
      height: 4px;
      background: var(--color-cream-dark);
      overflow: hidden;
    }

    .skill-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-gold), var(--color-gold-dark));
      transition: width 1s ease;
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

  getTopSkills() {
    const skills = this.profile()?.skills || [];
    return skills.sort((a, b) => b.endorsements - a.endorsements).slice(0, 12);
  }

  getSkillPercentage(endorsements: number): number {
    const maxEndorsements = Math.max(
      ...(this.profile()?.skills || []).map((s) => s.endorsements),
      1
    );
    return Math.min((endorsements / maxEndorsements) * 100, 100);
  }
}
