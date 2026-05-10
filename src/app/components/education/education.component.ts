import { Component, inject, } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { DateRangePipe } from '../../pipes/date-range.pipe';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [DateRangePipe],
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
            <article class="diploma" role="listitem" [attr.aria-labelledby]="'edu-' + edu.id" data-testid="education-card">
              <!-- Sello central decorativo -->
              <div class="diploma-seal" aria-hidden="true">
                <span class="seal-inner">✦</span>
              </div>

              <div class="diploma-body">
                <p class="diploma-presents">This certifies that</p>
                <time class="diploma-year" [attr.datetime]="edu.startDate" data-testid="education-year">
                  {{ edu.startDate | dateRange:edu.endDate }}
                </time>
                <h3 class="diploma-degree" [id]="'edu-' + edu.id" data-testid="education-degree">{{ edu.degree }}</h3>
                <div class="diploma-rule" aria-hidden="true"></div>
                <p class="diploma-school" role="doc-subtitle" data-testid="education-school">{{ edu.school }}</p>
                <p class="diploma-field">{{ edu.fieldOfStudy }}</p>
                @if (edu.grade) {
                  <span class="diploma-grade" aria-label="Grade: {{ edu.grade }}">{{ edu.grade }}</span>
                }
              </div>

              <!-- Ornamentos de esquina -->
              <span class="diploma-corner diploma-corner--tl" aria-hidden="true">◆</span>
              <span class="diploma-corner diploma-corner--tr" aria-hidden="true">◆</span>
              <span class="diploma-corner diploma-corner--bl" aria-hidden="true">◆</span>
              <span class="diploma-corner diploma-corner--br" aria-hidden="true">◆</span>
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
    /* ===== DIPLOMA FRAME ===== */
    .diploma {
      position: relative;
      text-align: center;
      padding: 2.5rem 2rem;

      /* Textura pergamino via gradiente */
      background:
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 28px,
          rgba(180, 150, 80, 0.04) 28px,
          rgba(180, 150, 80, 0.04) 29px
        ),
        var(--color-white);

      /* Marco doble dorado */
      border: 2px solid var(--color-gold);
      outline: 6px solid var(--color-cream-dark);
      outline-offset: -10px;

      box-shadow:
        0 4px 24px rgba(0,0,0,0.10),
        inset 0 0 40px rgba(180,140,60,0.04);

      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }

    .diploma:hover {
      box-shadow:
        0 8px 32px rgba(0,0,0,0.16),
        inset 0 0 40px rgba(180,140,60,0.06);
      transform: translateY(-3px);
    }

    /* Ornamentos de esquina */
    .diploma-corner {
      position: absolute;
      font-size: 0.55rem;
      color: var(--color-gold);
      line-height: 1;
    }
    .diploma-corner--tl { top: 6px;    left: 6px; }
    .diploma-corner--tr { top: 6px;    right: 6px; }
    .diploma-corner--bl { bottom: 6px; left: 6px; }
    .diploma-corner--br { bottom: 6px; right: 6px; }

    /* Sello central superior */
    .diploma-seal {
      width: 52px;
      height: 52px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      background: var(--color-black);
      border: 2px solid var(--color-gold);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 0 0 3px var(--color-cream-dark),
        0 0 0 5px var(--color-gold-dark);
    }

    .seal-inner {
      color: var(--color-gold);
      font-size: 1.1rem;
    }

    /* Cuerpo */
    .diploma-presents {
      font-family: var(--font-heading);
      font-style: italic;
      font-size: 0.8rem;
      color: var(--color-black-soft);
      letter-spacing: 0.05em;
      margin-bottom: 0.4rem;
    }

    .diploma-year {
      display: block;
      font-family: var(--font-display);
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      color: var(--color-gold);
      margin-bottom: 0.75rem;
    }

    .diploma-degree {
      font-family: var(--font-heading);
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--color-black);
      line-height: 1.3;
      margin-bottom: 0.75rem;
    }

    /* Línea ornamental separadora */
    .diploma-rule {
      width: 60%;
      height: 1px;
      margin: 0.75rem auto;
      background: linear-gradient(
        90deg,
        transparent,
        var(--color-gold),
        transparent
      );
    }

    .diploma-school {
      font-family: var(--font-heading);
      font-style: italic;
      font-size: 1rem;
      color: var(--color-black);
      margin-bottom: 0.4rem;
    }

    .diploma-field {
      font-size: 0.88rem;
      color: var(--color-black-soft);
      margin-bottom: 1rem;
    }

    .diploma-grade {
      display: inline-block;
      font-family: var(--font-display);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      padding: 0.3rem 0.9rem;
      border: 1px solid var(--color-gold);
      color: var(--color-gold);
      text-transform: uppercase;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .diploma {
        padding: 2rem 1.25rem;
      }
    }
  `,
  ],
})
export class EducationComponent {
  profile = inject(ProfileService).profile;
}
