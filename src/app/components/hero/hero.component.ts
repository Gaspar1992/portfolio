import { Component, input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import type { LinkedInProfile } from '../../services/profile.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [UpperCasePipe],
  template: `
    <section class="hero-section section-snap">
      <div class="container">
        <div class="hero-content text-center">
          <div class="film-badge mb-4">
            <span class="film-year">MCMXXVI</span>
            <span class="film-label">PRESENTS</span>
          </div>
          
          <h1 class="hero-title">
            <span class="title-line">{{ profile()?.firstName | uppercase }}</span>
            <span class="title-line title-accent">{{ profile()?.lastName | uppercase }}</span>
          </h1>
          
          <div class="divider-deco mb-4">
            <div class="divider-icon">
              <span>✦</span>
            </div>
          </div>
          
          <p class="hero-subtitle">
            {{ profile()?.headline }}
          </p>
          
          <div class="hero-location">
            <span class="location-icon">📍</span>
            <span>{{ profile()?.location?.city }}, {{ profile()?.location?.country }}</span>
          </div>
          
          <div class="hero-actions mt-4">
            <a href="#experience" class="btn-deco">View Experience</a>
            <a href="#contact" class="btn-deco btn-dark">Get In Touch</a>
          </div>
        </div>
      </div>
      
      <div class="scroll-indicator">
        <div class="scroll-line"></div>
        <span>SCROLL</span>
      </div>
    </section>
  `,
  styles: [`
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

    .scroll-line {
      width: 1px;
      height: 60px;
      background: linear-gradient(to bottom, var(--color-gold), transparent);
      animation: scrollPulse 2s ease-in-out infinite;
    }

    @keyframes scrollPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
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

    .mt-4 {
      margin-top: 2rem;
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

    .btn-deco {
      display: inline-block;
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
      .container {
        padding: 0 1rem;
      }
      
      h1 {
        font-size: 2.5rem;
      }
    }
  `]
})
export class HeroComponent {
  profile = input<LinkedInProfile | null>(null);
}
