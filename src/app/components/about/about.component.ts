import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
@Component({
  selector: 'app-about',
  template: `
    <section 
      class="section-transition about-section" 
      id="about"
      aria-labelledby="about-title"
      role="region"
      data-testid="about-section">
      <div class="container">
        <div class="corner-deco card-deco about-card">
          <h2 class="text-center" id="about-title">The Artist</h2>
          
          <div class="divider-deco mb-4" aria-hidden="true">
            <div class="divider-icon">
              <span>◆</span>
            </div>
          </div>
          
          <div class="about-content">
            <div class="about-portrait" data-testid="about-portrait">
              <figure class="film-frame portrait-frame" aria-label="Profile photo">
                @if (profile()?.profilePictureUrl) {
                  <img [src]="profile()?.profilePictureUrl" 
                       [alt]="'Professional photo of ' + profile()?.fullName"
                       class="portrait-image" 
                       width="180" 
                       height="270" 
                       loading="lazy"
                       role="img"
                       data-testid="about-portrait-image">
                } @else {
                  <div class="portrait-placeholder" role="img" aria-label="Name initials" data-testid="about-portrait-placeholder">
                    <span class="portrait-initials" aria-hidden="true">
                      {{ getInitials(profile()?.fullName) }}
                    </span>
                  </div>
                }
              </figure>
            </div>
            
            <article class="about-text" aria-label="Biography" data-testid="about-biography">
              @if (getFirstParagraph(); as firstPara) {
                <p class="quote-deco" role="text">{{ firstPara }}</p>
              }
              
              @for (paragraph of getSummaryParagraphs(); track $index) {
                <p role="text">{{ paragraph }}</p>
              }
              
              <div class="about-tags" role="list" aria-label="Top skills" data-testid="about-skills">
                @for (skill of getTopSkills(); track skill.name) {
                  <span class="tag-deco" role="listitem" data-testid="about-skill-tag">{{ skill.name }}</span>
                }
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
    .about-card { padding: clamp(1.5rem, 5vw, 3rem); }

    .about-content {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: clamp(2rem, 5vw, 3.5rem);
      align-items: start;
    }

    .portrait-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
      display: block;
    }

    .portrait-frame {
      width: 180px;
      height: 270px;
      overflow: hidden;
      border: 3px solid var(--color-black);
      padding: 4px;
      background: var(--color-white);
      box-shadow: 0 0 0 1px var(--color-gold), inset 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .portrait-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--color-cream-dark), var(--color-cream));
      display: grid;
      place-items: center;
    }

    .portrait-initials {
      font-family: var(--font-display);
      font-size: 3rem;
      font-weight: 900;
      color: var(--color-gold);
    }

    .about-tags { margin-block-start: 1.5rem; }

    .quote-deco {
      font-family: var(--font-heading);
      font-size: clamp(1.1rem, 3vw, 1.5rem);
      font-style: italic;
      text-align: center;
      padding: 2rem;
      position: relative;
      color: var(--color-black);

      &::before, &::after {
        content: '"';
        font-family: var(--font-display);
        font-size: 4rem;
        color: var(--color-gold);
        opacity: 0.5;
        position: absolute;
      }

      &::before { inset-block-start: 0; inset-inline-start: 0; }
      &::after { inset-block-end: -1rem; inset-inline-end: 0; transform: rotate(180deg); }
    }

    @media (max-width: 768px) {
      .about-content { grid-template-columns: 1fr; }
      .about-portrait { margin-inline: auto; }
    }
    
  `,
  ],
})
export class AboutComponent {
  profile = inject(ProfileService).profile;

  getInitials(fullName: string | undefined): string {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  getFirstParagraph(): string {
    const summary = this.profile()?.summary || '';
    return summary.split('\n\n')[0] || '';
  }

  getSummaryParagraphs(): string[] {
    const summary = this.profile()?.summary || '';
    const parts = summary.split('\n\n');
    return parts.slice(1).filter((p) => p.trim() !== '');
  }

  getTopSkills() {
    return (this.profile()?.skills || []).slice(0, 6);
  }
}
