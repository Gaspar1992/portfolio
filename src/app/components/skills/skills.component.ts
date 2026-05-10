import { ProfileService } from '../../services/profile.service';
import { Component, computed, inject } from '@angular/core';
import type {
  ProfileExperience,
  ProfileSkill,
} from '../../services/profile.service';

// Años recientes para considerar una skill "expert" aunque ya no esté en la experiencia actual
const EXPERT_RECENCY_YEARS = 3;

// Tamaño del podio (protagonistas)
const HEADLINER_COUNT = 3;

// Aliases para unificar nombres que varían entre profile.skills y experience.skills
const SKILL_ALIASES: Record<string, string> = {
  ia: 'ai',
  'cascading style sheets': 'css',
};

interface SkillWithStats {
  name: string;
  /** Nº de experiencias donde aparece la skill */
  count: number;
  /** Suma de duración (en años) de las experiencias donde aparece */
  totalYears: number;
  /** Último año de uso (0 si no hay evidencia) */
  lastYear: number;
  /** Aparece en la experiencia actual (isCurrent:true) */
  isCurrent: boolean;
  /** Calculado: es expert según recencia/actualidad (no el flag del JSON) */
  isExpert: boolean;
  /** Top 3 sostenidos en el tiempo — el podio */
  isHeadliner: boolean;
}

function normalizeSkillName(raw: string): string {
  let value = raw.toLowerCase().trim();
  // Si termina con un alias entre paréntesis (ej. "Cascading Style Sheets (CSS)"), usar el alias
  const parenAtEnd = value.match(/\(([^)]+)\)\s*$/);
  if (parenAtEnd) {
    value = parenAtEnd[1].trim();
  } else {
    value = value.replace(/\s*\([^)]*\)\s*/g, '').trim();
  }
  return SKILL_ALIASES[value] ?? value;
}

function scoreSkill(
  skill: ProfileSkill,
  experiences: ProfileExperience[],
  currentYear: number
): SkillWithStats {
  const target = normalizeSkillName(skill.name);
  const matching = experiences.filter((exp) =>
    exp.skills.some((s) => normalizeSkillName(s) === target)
  );

  const count = matching.length;
  const totalYears = matching.reduce((sum, exp) => {
    const start = new Date(exp.startDate).getFullYear();
    const end = exp.endDate ? new Date(exp.endDate).getFullYear() : currentYear;
    return sum + Math.max(1, end - start);
  }, 0);
  const lastYear = matching.length
    ? Math.max(
        ...matching.map((exp) => (exp.endDate ? new Date(exp.endDate).getFullYear() : currentYear))
      )
    : 0;
  const isCurrent = matching.some((exp) => exp.isCurrent);

  const hasEvidence = matching.length > 0;
  const isExpert = hasEvidence
    ? isCurrent || lastYear >= currentYear - EXPERT_RECENCY_YEARS
    : skill.expert;

  return {
    name: skill.name,
    count,
    totalYears,
    lastYear,
    isCurrent,
    isExpert,
    isHeadliner: false,
  };
}

function markHeadliners(scored: SkillWithStats[]): SkillWithStats[] {
  const headliners = [...scored]
    .filter((s) => s.isExpert && s.isCurrent)
    .sort((a, b) => b.count - a.count || b.totalYears - a.totalYears)
    .slice(0, HEADLINER_COUNT);
  const headlinerNames = new Set(headliners.map((s) => s.name));
  return scored.map((s) => ({ ...s, isHeadliner: headlinerNames.has(s.name) }));
}

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

        <!-- Leading Roles (Podio) -->
        @if (headlinerSkills().length > 0) {
          <div class="skills-group skills-group-headliners">
            <h3 class="skills-subtitle skills-subtitle-headliners" aria-label="Leading roles">
              <span class="subtitle-line"></span>
              <span class="subtitle-text">LEADING ROLES</span>
              <span class="subtitle-line"></span>
            </h3>
            <ul
              class="skills-grid skills-headliners"
              aria-label="Leading skills — most consistent and current"
              data-testid="headliner-skills-list">
              @for (skill of headlinerSkills(); track skill.name) {
                <li
                  class="skill-item card-deco skill-expert skill-headliner"
                  [attr.aria-label]="skill.name + ' — ' + skill.count + ' positions, ' + skill.totalYears + ' years'"
                  data-testid="skill-item-headliner">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="expert-badge" aria-hidden="true">★★★</span>
                </li>
              }
            </ul>
          </div>
        }

        <!-- Core Expertise -->
        @if (expertSkills().length > 0) {
          <div class="skills-group">
            <h3 class="skills-subtitle" aria-label="Core expertise">
              <span class="subtitle-line"></span>
              <span class="subtitle-text">STARRING</span>
              <span class="subtitle-line"></span>
            </h3>
            <ul class="skills-grid" aria-label="Core expertise skills" data-testid="expert-skills-list">
              @for (skill of expertSkills(); track skill.name) {
                <li class="skill-item card-deco skill-expert" [attr.aria-label]="skill.name" data-testid="skill-item-expert">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="expert-badge" aria-hidden="true">★</span>
                </li>
              }
            </ul>
          </div>
        }
        
        <!-- Additional Capabilities -->
        @if (additionalSkills().length > 0) {
          <div class="skills-group">
            <h3 class="skills-subtitle" aria-label="Additional capabilities">
              <span class="subtitle-line"></span>
              <span class="subtitle-text">ALSO FEATURING</span>
              <span class="subtitle-line"></span>
            </h3>
            <ul class="skills-grid skills-additional" aria-label="Additional skills" data-testid="additional-skills-list">
              @for (skill of additionalSkills(); track skill.name) {
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

    /* Podio — Leading Roles (top 3) */
    .skills-group-headliners {
      margin-bottom: 4rem;
    }

    .skills-subtitle-headliners {
      color: var(--color-gold);
      font-size: 0.85rem;
      letter-spacing: 0.4em;
    }

    .skills-subtitle-headliners .subtitle-line {
      background: linear-gradient(
        90deg,
        transparent,
        var(--color-gold),
        transparent
      );
      flex: 0 0 80px;
    }

    .skills-headliners {
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .skills-headliners {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    .skill-headliner {
      padding: 2rem 1.5rem;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      gap: 0.75rem;
      border-color: var(--color-gold);
      box-shadow: 0 0 0 1px var(--color-gold);
    }

    .skill-headliner::before {
      border-color: var(--color-gold);
      opacity: 1;
    }

    .skill-headliner .skill-name {
      font-size: 1rem;
      letter-spacing: 0.15em;
      color: var(--color-black);
    }

    .skill-headliner .expert-badge {
      font-size: 1.1rem;
      letter-spacing: 0.15em;
      color: var(--color-gold);
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
  profile = inject(ProfileService).profile;

  private readonly currentYear = new Date().getFullYear();

  private readonly scoredSkills = computed<SkillWithStats[]>(() => {
    const data = this.profile();
    if (!data) return [];
    const scored = data.skills.map((skill) => scoreSkill(skill, data.experience, this.currentYear));
    return markHeadliners(scored);
  });

  readonly headlinerSkills = computed<SkillWithStats[]>(() =>
    this.scoredSkills().filter((s) => s.isHeadliner)
  );

  readonly expertSkills = computed<SkillWithStats[]>(() =>
    this.scoredSkills().filter((s) => s.isExpert && !s.isHeadliner)
  );

  readonly additionalSkills = computed<SkillWithStats[]>(() =>
    this.scoredSkills().filter((s) => !s.isExpert)
  );

  /**
   * Compat API: expone expert = headliners + starring (lo que el usuario percibe como "expert")
   */
  getExpertSkills(): SkillWithStats[] {
    return [...this.headlinerSkills(), ...this.expertSkills()];
  }

  /**
   * Compat API: skills que ya no se consideran expert (legacy)
   */
  getAdditionalSkills(): SkillWithStats[] {
    return this.additionalSkills();
  }
}
