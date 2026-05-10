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
                  class="skill-item skill-marquee headliner"
                  [attr.aria-label]="skill.name + ' — ' + skill.count + ' positions, ' + skill.totalYears + ' years'"
                  data-testid="skill-item-headliner">
                  <span class="skill-name">{{ skill.name }}</span>
                </li>
              }
            </ul>
          </div>
        }

        <!-- Core Expertise -->
        @if (expertSkills().length > 0) {
          <div class="skills-group skills-group-expert">
            <h3 class="skills-subtitle" aria-label="Core expertise">
              <span class="subtitle-line"></span>
              <span class="subtitle-text">STARRING</span>
              <span class="subtitle-line"></span>
            </h3>
            <ul class="skills-grid" aria-label="Core expertise skills" data-testid="skills-list">
              @for (skill of expertSkills(); track skill.name) {
                <li class="skill-item skill-marquee" [attr.aria-label]="skill.name" data-testid="skill-item-expert">
                  <span class="skill-name">{{ skill.name }}</span>
                </li>
              }
            </ul>
          </div>
        }
        
        <!-- Additional Capabilities -->
        @if (additionalSkills().length > 0) {
          <div class="skills-group skills-group-additional">
            <h3 class="skills-subtitle" aria-label="Additional capabilities">
              <span class="subtitle-line"></span>
              <span class="subtitle-text">ALSO FEATURING</span>
              <span class="subtitle-line"></span>
            </h3>
            <ul class="skills-grid skills-additional" aria-label="Additional skills" data-testid="additional-skills-list">
              @for (skill of additionalSkills(); track skill.name) {
                <li class="skill-item skill-marquee" [attr.aria-label]="skill.name" data-testid="skill-item">
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
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      .skills-grid {
        grid-template-columns: 1fr;
      }
    }

    .skills-group {
      margin-block-end: 3.5rem;

      &:last-child {
        margin-block-end: 0;
      }
    }

    .skills-subtitle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin-block-end: 2.5rem;
      font-family: var(--font-display);
      font-size: 0.8rem;
      letter-spacing: 0.35em;
      color: var(--color-bronze);
    }

    .subtitle-line {
      flex: 0 0 80px;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--color-gold),
        transparent
      );
    }

    /* Starring (Expert) differentiation */
    .skills-group-expert {
      .skill-marquee {
        background: color-mix(in srgb, var(--color-white), var(--color-cream-light) 30%);
        box-shadow: inset 0 0 15px color-mix(in srgb, var(--color-gold), transparent 95%);
        
        &::before {
          border-style: solid; 
          border-width: 1px;
          opacity: 0.3;
        }

        &:hover {
          box-shadow: 0 10px 25px color-mix(in srgb, var(--color-gold), transparent 85%);
        }
      }
    }

    /* Also Featuring (Additional) - More subtle */
    .skills-group-additional {
      opacity: 0.9;
      
      .skill-marquee {
        background: transparent;
        border-color: color-mix(in srgb, var(--color-gold), transparent 40%);
        
        .skill-name {
          color: var(--color-text-muted);
          font-weight: 500;
        }
      }
    }

    /* Podio — Leading Roles (top 3) */
    .skills-group-headliners {
      margin-block-end: 5rem;

      .skills-subtitle {
        color: var(--color-gold);
        font-size: 0.9rem;
        letter-spacing: 0.45em;
      }

      .subtitle-line {
        flex: 0 0 120px;
      }

      .skills-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 2.5rem;
        max-width: 1000px;
        margin-inline: auto;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
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
