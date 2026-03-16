import { Component, input } from '@angular/core';
import type { LinkedInProfile } from '../../services/profile.service';

@Component({
  selector: 'app-certifications',
  standalone: true,
  template: `
    <section class="section-transition certs-section section-snap" id="certifications">
      <div class="container">
        <h2 class="text-center">Credentials</h2>
        
        <div class="divider-deco mb-6">
          <div class="divider-icon">
            <span>✓</span>
          </div>
        </div>
        
        <div class="certs-list">
          @for (cert of profile()?.certifications; track cert.id) {
            <div class="cert-item card-deco">
              <div class="cert-badge">{{ getBadge(cert.issuingOrganization) }}</div>
              <div class="cert-info">
                <h3>{{ cert.name }}</h3>
                <p>{{ cert.issuingOrganization }} • {{ formatDate(cert.issueDate) }} — {{ formatDate(cert.expirationDate) }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .section-transition {
      position: relative;
      padding: 6rem 0;
    }

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
    }

    .cert-info p {
      font-size: 0.9rem;
      color: var(--color-bronze);
      margin: 0;
    }

    .card-deco {
      background: var(--color-white);
      border: 1px solid var(--color-cream-dark);
      padding: 2rem;
      position: relative;
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
    }

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

    .mb-6 {
      margin-bottom: 3rem;
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
      
      .cert-item {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
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
}
