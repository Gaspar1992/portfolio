import { Component, input } from '@angular/core';
import type { LinkedInProfile } from '../../services/profile.service';

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
              <div class="cert-badge" aria-hidden="true">{{ getBadge(cert.issuingOrganization) }}</div>
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

    .cert-badge {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-black);
      color: var(--color-cream);
      font-family: var(--font-display);
      font-size: 0.9rem;
      font-weight: 600;
      border: 2px solid var(--color-gold);
      flex-shrink: 0;
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
  profile = input<LinkedInProfile | null>(null);

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
