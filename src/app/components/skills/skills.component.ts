import { Component, input } from '@angular/core';
import type { LinkedInProfile } from '../../services/profile.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  template: `
    <section class="section-transition skills-section section-snap" id="skills">
      <div class="container">
        <h2 class="text-center">Technical Repertoire</h2>
        
        <div class="divider-deco mb-6">
          <div class="divider-icon">
            <span>⚙</span>
          </div>
        </div>
        
        <div class="skills-grid">
          @for (category of getSkillsByCategory(); track category.name) {
            <div class="skill-category card-deco">
              <h3>{{ category.name }}</h3>
              <div class="skill-list">
                @for (skill of category.skills; track skill.name) {
                  <div class="skill-item">
                    <span class="skill-name">{{ skill.name }}</span>
                    <div class="skill-bar">
                      <div class="skill-fill" [style.width.%]="getSkillPercentage(skill.endorsements)"></div>
                    </div>
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

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .skills-grid {
        grid-template-columns: 1fr;
      }
    }

    .skill-category h3 {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .skill-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
  `]
})
export class SkillsComponent {
  profile = input<LinkedInProfile | null>(null);

  getSkillsByCategory() {
    const skills = this.profile()?.skills || [];
    
    const frontendSkills = skills.filter(s => 
      ['Angular', 'TypeScript', 'React', 'RxJS', 'NgRx/Redux', 'Sass'].includes(s.name)
    );
    
    const backendSkills = skills.filter(s => 
      ['Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'CI/CD'].includes(s.name)
    );
    
    const devopsSkills = skills.filter(s => 
      ['AWS', 'Docker', 'Git'].includes(s.name)
    );

    return [
      { name: 'Frontend', skills: frontendSkills.slice(0, 4) },
      { name: 'Backend', skills: backendSkills.slice(0, 4) },
      { name: 'DevOps & Cloud', skills: devopsSkills.slice(0, 4) }
    ].filter(c => c.skills.length > 0);
  }

  getSkillPercentage(endorsements: number): number {
    const maxEndorsements = 50;
    return Math.min((endorsements / maxEndorsements) * 100, 100);
  }
}
