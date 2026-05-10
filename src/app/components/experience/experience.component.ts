import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  type ElementRef,
  effect,
  inject,
  type OnDestroy,
  PLATFORM_ID,
  viewChildren,
} from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { DateRangePipe } from '../../pipes/date-range.pipe';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [DateRangePipe],
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

        <div class="film-reel" aria-hidden="true">
          <span class="reel-label reel-label--left">KODAK · SAFETY FILM · 5247</span>
          <span class="reel-label reel-label--right">★ PORTFOLIO ★ 35MM ★</span>
        </div>

        <div class="film-strip timeline" role="list" aria-label="Work experience" data-testid="experience-timeline">
          @for (exp of profile()?.experience; track exp.id; let i = $index) {
            <article 
              #frame
              class="film-frame timeline-item" 
              role="listitem" 
              [style.--frame-delay.ms]="i * 120"
              [attr.aria-label]="exp.title + ' at ' + exp.company" 
              data-testid="experience-item">
              <div class="frame-slate" aria-hidden="true">
                <span class="slate-take">TAKE {{ formatFrameNumber(i + 1) }}</span>
                <span class="slate-scene">SCENE {{ profile()?.experience?.length }}-{{ formatFrameNumber(i + 1) }}</span>
              </div>
              <div class="card-deco frame-card timeline-card">
                <header class="timeline-header">
                  <h3 data-testid="experience-title">{{ exp.title }}</h3>
                  <span class="timeline-company" data-testid="experience-company">{{ exp.company }}</span>
                  <time class="timeline-date" [attr.datetime]="exp.startDate" data-testid="experience-date">
                    {{ exp.startDate | dateRange:exp.endDate:exp.isCurrent }}
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
    /* ========== CARRETE DE PELÍCULA 35MM ========== */
    .film-reel {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background: #0d0d0d;
      border-top: 2px solid var(--color-gold-dark);
      border-left: 2px solid var(--color-gold-dark);
      border-right: 2px solid var(--color-gold-dark);
      border-bottom: 1px solid #0d0d0d;
      margin-bottom: -1px;
      font-family: var(--font-display);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--color-gold-light);
      text-transform: uppercase;
    }

    .reel-label {
      opacity: 0.7;
    }

    /* La tira de película: fondo negro con perforaciones a ambos lados */
    .film-strip {
      position: relative;
      padding: 2rem 3.5rem;
      background:
        /* Perforaciones izquierdas */
        linear-gradient(
          to bottom,
          transparent 0,
          transparent 0.6rem,
          var(--color-cream) 0.6rem,
          var(--color-cream) 1.5rem,
          transparent 1.5rem,
          transparent 2.4rem
        ) left / 1.5rem 2.4rem repeat-y,
        /* Perforaciones derechas */
        linear-gradient(
          to bottom,
          transparent 0,
          transparent 0.6rem,
          var(--color-cream) 0.6rem,
          var(--color-cream) 1.5rem,
          transparent 1.5rem,
          transparent 2.4rem
        ) right / 1.5rem 2.4rem repeat-y,
        /* Cuerpo del celuloide */
        #0d0d0d;
      background-repeat: repeat-y, repeat-y, no-repeat;
      border-left: 2px solid var(--color-gold-dark);
      border-right: 2px solid var(--color-gold-dark);
      border-bottom: 2px solid var(--color-gold-dark);
      box-shadow:
        inset 2.2rem 0 0 rgba(255, 255, 255, 0.03),
        inset -2.2rem 0 0 rgba(255, 255, 255, 0.03),
        var(--shadow-lg);
    }

    /* Cada fotograma: estado inicial oculto (simula fotograma aún no proyectado) */
    .film-frame {
      position: relative;
      margin: 0 0 1.5rem 0;
      transition: transform var(--transition-normal);
      opacity: 0;
      transform: translateY(24px) scale(0.96);
      clip-path: inset(0 0 100% 0);
      will-change: opacity, transform, clip-path;
    }

    /* Reveal: "proyector enciende el fotograma" */
    .film-frame.is-visible {
      animation: filmReveal 0.75s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
      animation-delay: var(--frame-delay, 0ms);
    }

    @keyframes filmReveal {
      0% {
        opacity: 0;
        transform: translateY(24px) scale(0.96);
        clip-path: inset(0 0 100% 0);
        filter: brightness(0.4) contrast(1.3);
      }
      40% {
        opacity: 0.85;
        filter: brightness(1.15) contrast(1.1);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        clip-path: inset(0 0 0 0);
        filter: brightness(1) contrast(1);
      }
    }

    .film-frame:last-child {
      margin-bottom: 0;
    }

    .film-frame:hover {
      transform: scale(1.01);
    }

    /* "Claqueta" superior del fotograma */
    .frame-slate {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.35rem 0.8rem;
      background: linear-gradient(
        135deg,
        var(--color-black) 0%,
        var(--color-black) 50%,
        var(--color-cream) 50%,
        var(--color-cream) 100%
      );
      background-size: 0.6rem 0.6rem;
      border: 2px solid var(--color-gold);
      border-bottom: none;
      font-family: var(--font-display);
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      color: var(--color-cream);
      text-shadow: 1px 1px 0 var(--color-black);
    }

    .slate-take,
    .slate-scene {
      background: rgba(13, 13, 13, 0.85);
      padding: 0.1rem 0.5rem;
      border: 1px solid var(--color-gold-light);
    }

    /* Tarjeta del fotograma (el "frame" visible) */
    .frame-card {
      position: relative;
      border: 2px solid var(--color-gold);
      border-top: none;
      background: var(--color-cream);
      padding: 1.5rem;
      box-shadow:
        inset 0 0 0 4px var(--color-cream-dark),
        inset 0 0 0 5px var(--color-gold);
    }

    .frame-card::before,
    .frame-card::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 0.7rem;
      height: 0.7rem;
      background: var(--color-gold);
      border: 2px solid var(--color-black);
      transform: translateY(-50%) rotate(45deg);
    }

    .frame-card::before {
      left: -1.2rem;
    }

    .frame-card::after {
      right: -1.2rem;
    }

    .timeline-header {
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px dashed var(--color-gold-dark);
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

    /* ========== RESPONSIVE ========== */
    @media (max-width: 768px) {
      .film-strip {
        padding: 1.5rem 2.2rem;
        background-size: 1rem 1.8rem, 1rem 1.8rem, auto;
      }

      .frame-card {
        padding: 1rem;
      }

      .frame-card::before,
      .frame-card::after {
        display: none;
      }

      .reel-label {
        font-size: 0.55rem;
      }
    }

    /* Reduce motion: sin escalado ni reveal animado */
    @media (prefers-reduced-motion: reduce) {
      .film-frame,
      .film-frame:hover,
      .film-frame.is-visible {
        transform: none;
        transition: none;
        animation: none;
        opacity: 1;
        clip-path: none;
        filter: none;
      }
    }
  `,
  ],
})
export class ExperienceComponent implements OnDestroy {
  profile = inject(ProfileService).profile;
  profileService = inject(ProfileService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly frames = viewChildren<ElementRef<HTMLElement>>('frame');
  private observer: IntersectionObserver | null = null;
  private readonly observed = new WeakSet<Element>();

  constructor() {
    // Reactivo: se dispara cada vez que cambia la lista de frames renderizados.
    // Necesario porque profile() llega async y los @for aparecen después del init.
    effect((onCleanup) => {
      const frames = this.frames();
      if (!isPlatformBrowser(this.platformId)) {
        // SSR / prerender: mostrar todo (no hay JS en servidor para observar).
        for (const ref of frames) ref.nativeElement.classList.add('is-visible');
        return;
      }
      if (frames.length === 0) return;

      if (typeof IntersectionObserver === 'undefined') {
        for (const ref of frames) ref.nativeElement.classList.add('is-visible');
        return;
      }

      if (!this.observer) {
        this.observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                this.observer?.unobserve(entry.target);
              }
            }
          },
          { threshold: 0, rootMargin: '0px 0px 0px 0px' }
        );
      }

      for (const ref of frames) {
        const el = ref.nativeElement;
        if (this.observed.has(el)) continue;
        this.observed.add(el);
        this.observer.observe(el);
      }

      // Safety net: si a los 1500ms algún frame sigue oculto, revelarlo.
      // Cubre casos donde el observer no dispara (iframes, virtualización, etc).
      const timeoutId = window.setTimeout(() => {
        for (const ref of this.frames()) {
          ref.nativeElement.classList.add('is-visible');
        }
      }, 1500);

      onCleanup(() => {
        window.clearTimeout(timeoutId);
      });
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

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

  formatFrameNumber(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
