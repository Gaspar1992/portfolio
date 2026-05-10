import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [UpperCasePipe],
  template: `
    <section 
      class="hero-section" 
      id="hero"
      aria-label="Main presentation"
      role="banner"
      data-testid="hero-section">
      <div class="container">
        <div class="hero-content text-center">
          <div class="film-badge mb-4" aria-hidden="true">
            <span class="film-year">MCMXXVI</span>
            <span class="film-label">PRESENTS</span>
          </div>
          
          <h1 class="hero-title" data-testid="hero-title">
            <span class="title-line" role="text">{{ profile()?.firstName | uppercase }}</span>
            <span class="title-line title-accent" role="text">{{ profile()?.lastName | uppercase }}</span>
          </h1>
          
          <div class="divider-deco mb-4" aria-hidden="true">
            <div class="divider-icon">
              <span>✦</span>
            </div>
          </div>
          
          <p class="hero-subtitle" role="doc-subtitle" data-testid="hero-headline">
            {{ profile()?.headline }}
          </p>
          
          <div class="hero-location" aria-label="Location" data-testid="hero-location">
            <span class="location-icon" aria-hidden="true">📍</span>
            <span>{{ profile()?.location?.city }}, {{ profile()?.location?.country }}</span>
          </div>
          
          <div class="hero-actions mt-4" role="navigation" aria-label="Main actions" data-testid="hero-actions">
            <button (click)="navigateToSection('experience')" class="btn-deco" aria-label="View my work experience" data-testid="hero-experience-link">
              <span>View Experience</span>
            </button>
            <a 
              href="cv-gaspar-rodriguez.pdf" 
              download 
              class="btn-deco btn-gold" 
              aria-label="Download CV as PDF"
              data-testid="hero-cv-link">
              <span>🎬 Get The Reel (CV)</span>
            </a>
            <button (click)="navigateToSection('contact')" class="btn-deco btn-dark" aria-label="Get in touch with me" data-testid="hero-contact-link">
              <span>Get In Touch</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="scroll-indicator" aria-hidden="true">
        <div class="camera-focus">
          <span class="focus-bracket focus-bracket--tl"></span>
          <span class="focus-bracket focus-bracket--tr"></span>
          <span class="focus-bracket focus-bracket--bl"></span>
          <span class="focus-bracket focus-bracket--br"></span>
          <div class="recording-symbol">▷</div>
        </div>
        <span>SCROLL</span>
      </div>
    </section>
  `,
  styles: [
    `
    .hero-section {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      padding: 2rem;
    }

    .hero-content {
      max-width: 800px;
    }

    .film-badge {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .film-year {
      font-family: var(--font-display);
      font-size: 0.9rem;
      letter-spacing: 0.3em;
      color: var(--color-gold);
      border: 1px solid var(--color-gold);
      padding: 0.3rem 1rem;
    }

    .film-label {
      font-family: var(--font-display);
      font-size: 0.7rem;
      letter-spacing: 0.5em;
      color: var(--color-black-soft);
    }

    .hero-title {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .title-line {
      display: block;
    }

    .title-accent {
      color: var(--color-gold);
      font-weight: 900;
    }

    .hero-subtitle {
      font-family: var(--font-heading);
      font-size: 1.3rem;
      font-style: italic;
      color: var(--color-black-soft);
      margin-top: 1rem;
    }

    .hero-location {
      font-family: var(--font-display);
      font-size: 0.9rem;
      letter-spacing: 0.2em;
      color: var(--color-bronze);
      margin-top: 1rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .scroll-indicator span {
      font-family: var(--font-display);
      font-size: 0.7rem;
      letter-spacing: 0.3em;
      color: var(--color-bronze);
    }

    .camera-focus {
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }

    .focus-bracket {
      position: absolute;
      width: 10px;
      height: 10px;
      border: 1.5px solid var(--color-gold);
      opacity: 0.6;
    }

    .focus-bracket--tl { top: 0; left: 0; border-right: none; border-bottom: none; }
    .focus-bracket--tr { top: 0; right: 0; border-left: none; border-bottom: none; }
    .focus-bracket--bl { bottom: 0; left: 0; border-right: none; border-top: none; }
    .focus-bracket--br { bottom: 0; right: 0; border-left: none; border-top: none; }

    .recording-symbol {
      color: var(--color-gold);
      font-size: 1.2rem;
      animation: recBlink 1.5s ease-in-out infinite;
    }

    @keyframes recBlink {
      0%, 100% { opacity: 0.2; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.1); }
    }

    .btn-deco {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 1rem 2.5rem;
      border: 2px solid var(--color-gold);
      background: transparent;
      color: var(--color-gold);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      text-decoration: none;
      min-height: 48px;
      min-width: 200px;
    }

    .btn-deco span {
      position: relative;
      z-index: 2;
    }

    .btn-deco:focus-visible {
      outline: 3px solid var(--color-gold);
      outline-offset: 3px;
    }

    @media (max-width: 768px) {
      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .btn-deco {
        width: 100%;
        max-width: 280px;
      }
    }

    @media (max-width: 480px) {
      .hero-section {
        padding: 6rem 1rem 2rem;
      }

      h1 {
        font-size: 2rem;
      }
    }

    .btn-deco::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: var(--color-gold);
      transition: left 0.3s ease;
      z-index: -1;
    }

    .btn-deco:hover {
      color: var(--color-white);
    }

    .btn-deco:hover::before {
      left: 0;
    }

    .btn-deco.btn-gold {
      background: var(--color-gold);
      border-color: var(--color-gold);
      color: var(--color-cream-light);
    }

    .btn-deco.btn-gold::before {
      background: var(--color-black);
    }

    .btn-deco.btn-gold:hover {
      color: var(--color-gold-light);
    }

    .btn-deco.btn-dark {
      background: var(--color-black);
      border-color: var(--color-black);
      color: var(--color-cream);
    }

    .btn-deco.btn-dark::before {
      background: var(--color-gold);
    }

    .btn-deco.btn-dark:hover {
      color: var(--color-black);
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2.5rem;
      }
    }
  `,
  ],
})
export class HeroComponent {
  profile = inject(ProfileService).profile;
  private keyboardNav = inject(KeyboardNavigationService);

  navigateToSection(sectionId: string): void {
    const sections = this.keyboardNav.getAllSections();
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index !== -1) {
      this.keyboardNav.navigateToSection(index);
    }
  }
}
