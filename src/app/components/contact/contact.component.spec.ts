import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { LinkedInProfile } from '../../services/profile.service';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

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
    certifications: [],
    projects: [],
    languages: [],
    contactInfo: {
      email: 'john.doe@example.com',
      website: 'https://johndoe.com',
      github: 'https://github.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
    },
    interests: [],
    honors: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display email contact link when email is available', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const emailLink = fixture.nativeElement.querySelector('a[href^="mailto:"]');
    expect(emailLink).toBeTruthy();
    expect(emailLink.getAttribute('href')).toBe('mailto:john.doe@example.com');
  });

  it('should not display email link when email is not available', () => {
    const profileNoEmail = {
      ...mockProfile,
      contactInfo: { ...mockProfile.contactInfo, email: null },
    };
    fixture.componentRef.setInput('profile', profileNoEmail);
    fixture.detectChanges();

    const emailLink = fixture.nativeElement.querySelector('a[href^="mailto:"]');
    expect(emailLink).toBeNull();
  });

  it('should display LinkedIn link when URL is available', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const linkedInLink = fixture.nativeElement.querySelector(
      'a[href="https://linkedin.com/in/johndoe"]'
    );
    expect(linkedInLink).toBeTruthy();
    expect(linkedInLink.getAttribute('target')).toBe('_blank');
  });

  it('should display GitHub link when available', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const githubLink = fixture.nativeElement.querySelector('a[href="https://github.com/johndoe"]');
    expect(githubLink).toBeTruthy();
    expect(githubLink.textContent).toContain('GitHub');
  });

  it('should have correct section id for navigation', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('id')).toBe('contact');
  });

  it('should display footer with full name in uppercase', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const footerName = fixture.nativeElement.querySelector('.footer-name');
    expect(footerName.textContent).toContain('JOHN DOE');
  });

  it('should display location in footer', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const footerYear = fixture.nativeElement.querySelector('.footer-year');
    expect(footerYear.textContent).toContain('Madrid');
    expect(footerYear.textContent).toContain('Spain');
  });

  it('should display THE END in footer', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const footerFilm = fixture.nativeElement.querySelector('.footer-film');
    expect(footerFilm.textContent).toContain('THE END');
  });

  it('should have footer with contentinfo role', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('footer');
    expect(footer.getAttribute('role')).toBe('contentinfo');
  });

  it('should use native ul and li elements for contact methods', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const contactList = fixture.nativeElement.querySelector('ul.contact-methods');
    expect(contactList).toBeTruthy();

    const contactItems = fixture.nativeElement.querySelectorAll('li.contact-method-item');
    expect(contactItems.length).toBeGreaterThan(0);
  });

  it('should have proper data-testid attributes on contact elements', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const contactSection = fixture.nativeElement.querySelector('[data-testid="contact-section"]');
    expect(contactSection).toBeTruthy();

    const footer = fixture.nativeElement.querySelector('[data-testid="footer"]');
    expect(footer).toBeTruthy();

    const footerEnd = fixture.nativeElement.querySelector('[data-testid="footer-end"]');
    expect(footerEnd).toBeTruthy();
    expect(footerEnd.textContent).toContain('THE END');
  });
});
