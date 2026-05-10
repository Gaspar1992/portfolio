import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
@Component({
  selector: 'app-certifications',
  standalone: true,
  template: `
    <section 
      class="section-transition certs-section" 
      id="certifications"
      aria-labelledby="certs-title"
      role="region"
      data-testid="certifications-section">
      <div class="container">
        <h2 class="text-center" id="certs-title">Credentials</h2>
        
        <div class="divider-deco mb-6" aria-hidden="true">
          <div class="divider-icon">
            <span aria-hidden="true">✓</span>
          </div>
        </div>
        
        <div class="certs-list" role="list" aria-label="Certifications obtained" data-testid="certifications-list">
          @for (cert of profile()?.certifications; track cert.id) {
            <article class="cert-item card-deco" role="listitem" [attr.aria-labelledby]="'cert-' + cert.id" data-testid="certification-card">
              <div class="cert-medallion" aria-hidden="true">
                <div class="star-shape"></div>
                <span class="medallion-text">{{ getBadge(cert.issuingOrganization) }}</span>
              </div>
              <div class="cert-info">
                <h3 [id]="'cert-' + cert.id" [title]="cert.name" data-testid="certification-name">{{ shortenTitle(cert.name) }}</h3>
                <div class="cert-meta">
                  <span class="cert-org" data-testid="certification-org">{{ cert.issuingOrganization }}</span>
                  <span class="cert-dates">
                    <time [attr.datetime]="cert.issueDate">{{ formatDate(cert.issueDate) }}</time>
                    @if (cert.expirationDate) {
                      — <time [attr.datetime]="cert.expirationDate">{{ formatDate(cert.expirationDate) }}</time>
                    } @else {
                      <span class="cert-valid">— Valid indefinitely</span>
                    }
                  </span>
                </div>
                @if (cert.credentialUrl) {
                  <a [href]="cert.credentialUrl" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     class="cert-link"
                     [attr.aria-label]="'View credential for ' + cert.name"
                     data-testid="certification-link">
                    View Credential
                  </a>
                }
              </div>
            </article>
          } @empty {
            <p class="text-center" role="status" data-testid="certifications-empty">No certifications available.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
    .certs-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .cert-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .cert-medallion {
      width: 70px;
      height: 70px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .cert-item:hover .cert-medallion {
      transform: scale(1.1) rotate(5deg);
    }

    .star-shape {
      position: absolute;
      width: 100%;
      height: 100%;
      background: var(--color-gold);
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }

    .star-shape::after {
      content: '';
      position: absolute;
      inset: 6px;
      background: var(--color-black);
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }

    .medallion-text {
      position: relative;
      z-index: 1;
      color: var(--color-gold-light);
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-shadow: 0 0 10px rgba(180, 140, 60, 0.4);
    }

    .cert-info h3 {
      margin-bottom: 0.25rem;
      font-size: 1rem;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .cert-info h3:hover {
      -webkit-line-clamp: unset;
      overflow: visible;
    }

    .cert-meta {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }

    .cert-org {
      font-size: 0.9rem;
      color: var(--color-bronze);
      font-weight: 500;
    }

    .cert-dates {
      font-size: 0.85rem;
      color: var(--color-copper);
    }

    @media (max-width: 768px) {
      .cert-item {
        flex-direction: column;
        text-align: center;
      }
    }
  `,
  ],
})
export class CertificationsComponent {
  profile = inject(ProfileService).profile;

  getBadge(organization: string): string {
    if (organization.includes('Amazon') || organization.includes('AWS')) return 'AWS';
    if (organization.includes('Google') || organization.includes('GCP')) return 'GCP';
    return organization.substring(0, 3).toUpperCase();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }

  shortenTitle(title: string): string {
    if (title.length <= 45) return title;
    return `${title.substring(0, 42)}...`;
  }
}
