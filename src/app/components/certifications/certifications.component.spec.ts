import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { LinkedInProfile } from '../../services/profile.service';
import { CertificationsComponent } from './certifications.component';

describe('CertificationsComponent', () => {
  let component: CertificationsComponent;
  let fixture: ComponentFixture<CertificationsComponent>;

  const mockProfile: LinkedInProfile = {
    _meta: {
      source: 'linkedin',
      syncedAt: '2024-01-15T10:00:00Z',
      profileId: 'test-id',
    },
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    headline: 'Senior Developer',
    email: 'john@example.com',
    linkedInUrl: 'https://linkedin.com/in/johndoe',
    vanityName: 'johndoe',
    profilePictureUrl: null,
    location: {
      city: 'Madrid',
      country: 'Spain',
      countryCode: 'ES',
    },
    summary: 'Developer',
    industry: 'Technology',
    experience: [],
    education: [],
    skills: [],
    certifications: [
      {
        id: 'cert1',
        name: 'AWS Solutions Architect',
        issuingOrganization: 'Amazon Web Services',
        issueDate: '2023-01-15',
        expirationDate: '2026-01-15',
        credentialUrl: 'https://aws.amazon.com/certification/123',
      },
      {
        id: 'cert2',
        name: 'Google Cloud Professional',
        issuingOrganization: 'Google Cloud',
        issueDate: '2022-06-01',
        expirationDate: null,
        credentialUrl: null,
      },
    ],
    projects: [],
    languages: [],
    contactInfo: {
      email: 'john@example.com',
      website: null,
      github: null,
      twitter: null,
    },
    interests: [],
    honors: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get badge for AWS certification', () => {
    expect(component.getBadge('Amazon Web Services')).toBe('AWS');
    expect(component.getBadge('AWS Training')).toBe('AWS');
  });

  it('should get badge for Google certification', () => {
    expect(component.getBadge('Google Cloud')).toBe('GCP');
    expect(component.getBadge('Google Professional')).toBe('GCP');
  });

  it('should get default badge for other organizations', () => {
    expect(component.getBadge('Microsoft')).toBe('MIC');
    expect(component.getBadge('Oracle Corporation')).toBe('ORA');
  });

  it('should format date to year only', () => {
    expect(component.formatDate('2023-01-15')).toBe('2023');
    expect(component.formatDate('2022-06-01')).toBe('2022');
  });

  it('should shorten long titles', () => {
    const longTitle = 'This is a very long certification title that exceeds the limit';
    const shortened = component.shortenTitle(longTitle);
    expect(shortened.length).toBeLessThanOrEqual(45);
    expect(shortened.endsWith('...')).toBe(true);
  });

  it('should not shorten short titles', () => {
    const shortTitle = 'AWS Certification';
    expect(component.shortenTitle(shortTitle)).toBe(shortTitle);
  });

  it('should display certification items', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const certItems = fixture.nativeElement.querySelectorAll('.cert-item');
    expect(certItems.length).toBe(2);
  });

  it('should display credential link when available', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('.cert-link');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('https://aws.amazon.com/certification/123');
  });

  it('should show valid indefinitely for no expiration date', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const certItems = fixture.nativeElement.querySelectorAll('.cert-item');
    expect(certItems[1].textContent).toContain('Valid indefinitely');
  });

  it('should show empty state when no certifications', () => {
    const profileNoCerts = { ...mockProfile, certifications: [] };
    fixture.componentRef.setInput('profile', profileNoCerts);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('[role="status"]');
    expect(emptyState.textContent).toContain('No certifications available');
  });

  it('should have correct section id for navigation', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('id')).toBe('certifications');
  });
});
