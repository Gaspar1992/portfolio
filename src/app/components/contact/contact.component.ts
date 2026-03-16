import { UpperCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import type { LinkedInProfile } from '../../services/profile.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [UpperCasePipe],
  template: `
    <section 
      class="section-transition contact-section" 
      id="contact"
      aria-labelledby="contact-title"
      role="region"
      data-testid="contact-section">
      <div class="container">
        <div class="corner-deco card-deco contact-card">
          <h2 class="text-center" id="contact-title">Get In Touch</h2>
          
          <div class="divider-deco mb-4" aria-hidden="true">
            <div class="divider-icon">
              <span aria-hidden="true">✉</span>
            </div>
          </div>
          
          <p class="text-center contact-text" role="text">
            Interested in collaborating? I am available for freelance projects and professional opportunities.
          </p>
          
          <ul class="contact-methods" aria-label="Contact methods">
            @if (profile()?.contactInfo?.email) {
              <li class="contact-method-item">
                <a [href]="'mailto:' + profile()?.contactInfo?.email" 
                   class="contact-link"
                   [attr.aria-label]="'Send email to ' + profile()?.contactInfo?.email"
                   data-testid="contact-email">
                  <span class="contact-icon" aria-hidden="true">@</span>
                  <span>{{ profile()?.contactInfo?.email }}</span>
                </a>
              </li>
            }
            
            @if (profile()?.linkedInUrl) {
              <li class="contact-method-item">
                <a [href]="profile()?.linkedInUrl" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="contact-link"
                   aria-label="View LinkedIn profile"
                   data-testid="contact-linkedin">
                  <span class="contact-icon" aria-hidden="true">in</span>
                  <span>LinkedIn</span>
                </a>
              </li>
            }
            
            @if (profile()?.contactInfo?.github) {
              <li class="contact-method-item">
                <a [href]="profile()?.contactInfo?.github" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="contact-link"
                   aria-label="View GitHub profile"
                   data-testid="contact-github">
                  <span class="contact-icon" aria-hidden="true">gh</span>
                  <span>GitHub</span>
                </a>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>

    <footer class="footer-section" role="contentinfo" data-testid="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="footer-name">{{ profile()?.fullName | uppercase }}</span>
            <span class="footer-tagline">Full Stack Developer</span>
          </div>
          
          <div class="footer-year" aria-label="Footer information">
            <span>Est. 2017</span>
            <span class="footer-divider" aria-hidden="true">|</span>
            <span>{{ profile()?.location?.city }}, {{ profile()?.location?.country }}</span>
          </div>
        </div>
        
        <div class="footer-credits">
          <p>Designed in the style of the Golden Age of Cinema</p>
          <p class="footer-film" aria-label="End of portfolio" data-testid="footer-end">THE END</p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
    .section-transition {
      position: relative;
      padding: 6rem 0;
    }

    .contact-card {
      max-width: 600px;
      margin: 0 auto;
      padding: 3rem;
    }

    .contact-text {
      font-size: 1.1rem;
      color: var(--color-black-soft);
    }

    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 2rem;
      list-style: none;
      padding: 0;
    }

    .contact-method-item {
      display: block;
    }

    .contact-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid var(--color-cream-dark);
      text-decoration: none;
      color: var(--color-black);
      border-bottom: 1px solid var(--color-cream-dark);
      transition: all 0.3s ease;
    }

    .contact-link:hover {
      border-color: var(--color-gold);
      background: var(--color-cream-light);
    }

    .contact-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-black);
      color: var(--color-gold);
      font-family: var(--font-display);
      font-size: 0.85rem;
      font-weight: 600;
      flex-shrink: 0;
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
      width: 25px;
      height: 25px;
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

    .footer-section {
      padding: 4rem 2rem;
      border-top: 1px solid var(--color-cream-dark);
      margin-top: 4rem;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
    }

    .footer-name {
      font-family: var(--font-display);
      font-size: 1rem;
      letter-spacing: 0.2em;
      color: var(--color-black);
    }

    .footer-tagline {
      font-family: var(--font-body);
      font-size: 0.9rem;
      font-style: italic;
      color: var(--color-bronze);
    }

    .footer-year {
      font-family: var(--font-display);
      font-size: 0.8rem;
      letter-spacing: 0.15em;
      color: var(--color-bronze);
    }
    .card-deco {
      background: var(--color-white);
      border: 1px solid var(--color-cream-dark);
      padding: 2rem;
      position: relative;
    }

    /* Línea superior dorada para card-deco */
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
      z-index: 3;
    }

    /* Marco interno para card-deco */
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
      z-index: 2;
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
      
      .contact-link {
        flex-direction: column;
        text-align: center;
      }
      
      .contact-link span:last-child {
        word-break: break-all;
      }
    }
  `,
  ],
})
export class ContactComponent {
  profile = input<LinkedInProfile | null>(null);
}
