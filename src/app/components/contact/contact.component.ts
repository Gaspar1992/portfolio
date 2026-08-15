import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-contact',
  imports: [UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="section-transition contact-section"
      id="contact"
      aria-labelledby="contact-title"
      role="region"
      data-testid="contact-section"
    >
      <div class="container">
        <div class="corner-deco contact-shell">
          <div class="card-deco contact-card">
            <h2 class="text-center" id="contact-title">Get In Touch</h2>

            <div class="divider-deco mb-4" aria-hidden="true">
              <div class="divider-icon">
                <span aria-hidden="true">✉</span>
              </div>
            </div>

            <p class="text-center contact-text" role="text">
              Open to collaborations on challenging projects. Currently
              accepting new opportunities in architecture and frontend
              engineering.
            </p>

            <ul
              class="contact-methods"
              aria-label="Contact methods"
              data-testid="contact-methods"
            >
              @if (profile()?.contactInfo?.email) {
                <li class="contact-method-item">
                  <a
                    [href]="
                      'mailto:' +
                      $safeNavigationMigration(profile()?.contactInfo?.email)
                    "
                    class="contact-link"
                    [attr.aria-label]="
                      'Send email to ' + profile()?.contactInfo?.email
                    "
                    data-testid="contact-email"
                  >
                    <span class="contact-icon" aria-hidden="true">@</span>
                    <span>Email</span>
                  </a>
                </li>
              }

              @if (profile()?.linkedInUrl) {
                <li class="contact-method-item">
                  <a
                    [href]="$safeNavigationMigration(profile()?.linkedInUrl)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="contact-link"
                    aria-label="View LinkedIn profile"
                    data-testid="contact-linkedin"
                  >
                    <span class="contact-icon" aria-hidden="true">in</span>
                    <span>LinkedIn</span>
                  </a>
                </li>
              }

              @if (profile()?.contactInfo?.github) {
                <li class="contact-method-item">
                  <a
                    [href]="
                      $safeNavigationMigration(profile()?.contactInfo?.github)
                    "
                    target="_blank"
                    rel="noopener noreferrer"
                    class="contact-link"
                    aria-label="View GitHub profile"
                    data-testid="contact-github"
                  >
                    <span class="contact-icon" aria-hidden="true">gh</span>
                    <span>GitHub</span>
                  </a>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer-section" role="contentinfo" data-testid="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="footer-name">{{
              $safeNavigationMigration(profile()?.fullName) | uppercase
            }}</span>
            <span class="footer-tagline">{{ profile()?.headline }}</span>
          </div>

          <div class="footer-year" aria-label="Footer information">
            <span>Est. {{ careerStartYear() }}</span>
            <span class="footer-divider" aria-hidden="true">|</span>
            <span
              >{{ profile()?.location?.city }},
              {{ profile()?.location?.country }}</span
            >
          </div>
        </div>

        <div class="footer-credits">
          <p>Designed in the style of the Golden Age of Cinema</p>
          <p
            class="footer-film"
            aria-label="End of portfolio"
            data-testid="footer-end"
          >
            THE END
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .contact-shell {
        max-width: 600px;
        margin-inline: auto;
        position: relative;
      }

      .contact-card {
        padding: clamp(1.5rem, 5vw, 3rem);
      }

      .contact-text {
        font-size: 1.1rem;
        color: var(--color-black-soft);
      }

      .contact-methods {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-block-start: 2rem;
        list-style: none;
        padding: 0;
      }

      .contact-link {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid var(--color-cream-dark);
        text-decoration: none;
        color: var(--color-black);
        border-block-end: 1px solid var(--color-cream-dark);
        transition: all 0.3s ease;

        &:hover {
          border-color: var(--color-gold);
          background: var(--color-cream-light);
        }
      }

      .contact-icon {
        width: 40px;
        aspect-ratio: 1/1;
        display: grid;
        place-items: center;
        background: var(--color-black);
        color: var(--color-gold);
        font-family: var(--font-display);
        font-size: 0.85rem;
        font-weight: 600;
        flex-shrink: 0;
      }

      .footer-section {
        padding-block: 4rem;
        padding-inline: 2rem;
        border-block-start: 1px solid var(--color-cream-dark);
        margin-block-start: 4rem;
      }

      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        margin-block-end: 2.5rem;
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

      @media (max-width: 768px) {
        .contact-link {
          flex-direction: column;
          text-align: center;
          span:last-child {
            word-break: break-all;
          }
        }
      }
    `,
  ],
})
export class ContactComponent {
  profile = inject(ProfileService).profile;

  careerStartYear = computed(() => {
    const profileData = this.profile();
    if (!profileData?.experience || profileData.experience.length === 0) {
      return '2017'; // fallback to original hardcoded value
    }

    // Find the earliest start date from all experiences
    const earliestYear = Math.min(
      ...profileData.experience
        .map((exp) => new Date(exp.startDate).getFullYear())
        .filter((year) => Number.isNaN(year) === false),
    );

    return earliestYear.toString();
  });
}
