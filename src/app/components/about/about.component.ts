import { Component, input } from '@angular/core';
import type { LinkedInProfile } from '../../services/profile.service';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section 
      class="section-transition about-section" 
      id="about"
      aria-labelledby="about-title"
      role="region">
      <div class="container">
        <div class="corner-deco card-deco about-card">
          <h2 class="text-center" id="about-title">The Artist</h2>
          
          <div class="divider-deco mb-4" aria-hidden="true">
            <div class="divider-icon">
              <span>◆</span>
            </div>
          </div>
          
          <div class="about-content">
            <div class="about-portrait">
              <figure class="film-frame portrait-frame" aria-label="Profile photo">
                @if (profile()?.profilePictureUrl) {
                  <img [src]="profile()?.profilePictureUrl" 
                       [alt]="'Professional photo of ' + profile()?.fullName"
                       class="portrait-image" 
                       width="180" 
                       height="270" 
                       loading="lazy"
                       role="img">
                } @else {
                  <div class="portrait-placeholder" role="img" aria-label="Name initials">
                    <span class="portrait-initials" aria-hidden="true">
                      {{ getInitials(profile()?.fullName) }}
                    </span>
                  </div>
                }
              </figure>
            </div>
            
            <article class="about-text" aria-label="Biography">
              @if (getFirstParagraph(); as firstPara) {
                <p class="quote-deco" role="text">{{ firstPara }}</p>
              }
              
              @for (paragraph of getSummaryParagraphs(); track $index) {
                <p role="text">{{ paragraph }}</p>
              }
              
              <div class="about-tags" role="list" aria-label="Top skills">
                @for (skill of getTopSkills(); track skill.name) {
                  <span class="tag-deco" role="listitem">{{ skill.name }}</span>
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
    .section-transition {
      position: relative;
      padding: 6rem 0;
    }

    .about-card {
      padding: 3rem;
    }

    .about-content {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 3rem;
      align-items: start;
    }

    @media (max-width: 768px) {
      .about-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .about-portrait {
        margin: 0 auto;
      }

      .portrait-frame {
        width: 150px;
        height: 225px;
      }

      .portrait-image {
        width: 150px;
        height: 225px;
      }

      .about-card {
        padding: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .about-card {
        padding: 1rem;
      }

      .about-text p {
        font-size: 1rem;
        line-height: 1.7;
      }

      .quote-deco {
        font-size: 1.2rem;
        padding: 1.5rem;
      }
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
    }

    .portrait-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--color-cream-dark), var(--color-cream));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .portrait-initials {
      font-family: var(--font-display);
      font-size: 3rem;
      font-weight: 900;
      color: var(--color-gold);
    }

    .about-tags {
      margin-top: 1.5rem;
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

    .quote-deco {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-style: italic;
      text-align: center;
      padding: 2rem;
      position: relative;
      color: var(--color-black);
    }

    .quote-deco::before,
    .quote-deco::after {
      content: '"';
      font-family: var(--font-display);
      font-size: 4rem;
      color: var(--color-gold);
      opacity: 0.5;
      position: absolute;
    }

    .quote-deco::before {
      top: 0;
      left: 0;
    }

    .quote-deco::after {
      bottom: -1rem;
      right: 0;
      transform: rotate(180deg);
    }

    .card-deco {
      background: var(--color-white);
      border: 1px solid var(--color-cream-dark);
      padding: 2rem;
      position: relative;
      z-index: 1;
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
      z-index: 1;
    }

    .card-deco::after {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      height: 3px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--color-gold),
        transparent
      );
      z-index: 2;
    }

    .corner-deco {
      position: relative;
      z-index: 1;
      overflow: visible;
    }

    .corner-deco::before,
    .corner-deco::after {
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
      border-color: var(--color-gold);
      border-style: solid;
      z-index: 10;
      pointer-events: none;
    }

    .corner-deco::before {
      top: -2px;
      left: -2px;
      border-width: 3px 0 0 3px;
    }

    .corner-deco::after {
      bottom: -2px;
      right: -2px;
      border-width: 0 3px 3px 0;
    }

    .film-frame {
      border: 3px solid var(--color-black);
      padding: 4px;
      background: var(--color-white);
      box-shadow: 
        0 0 0 1px var(--color-gold),
        inset 0 0 20px rgba(0, 0, 0, 0.1);
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

    .mb-4 {
      margin-bottom: 2rem;
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
export class AboutComponent {
  profile = input<LinkedInProfile | null>(null);

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
