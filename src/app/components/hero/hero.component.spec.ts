import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { LinkedInProfile } from '../../services/profile.service';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  const mockProfile: LinkedInProfile = {
    _meta: {
      source: 'linkedin',
      syncedAt: '2024-01-15T10:00:00Z',
      profileId: 'test-id',
    },
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    headline: 'Senior Full Stack Developer',
    email: 'john@example.com',
    linkedInUrl: 'https://linkedin.com/in/johndoe',
    vanityName: 'johndoe',
    profilePictureUrl: null,
    location: {
      city: 'Madrid',
      country: 'Spain',
      countryCode: 'ES',
    },
    summary: 'Experienced developer',
    industry: 'Technology',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
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
      imports: [HeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display profile name in uppercase', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const titleLines = fixture.nativeElement.querySelectorAll('.title-line');
    expect(titleLines[0].textContent).toContain('JOHN');
    expect(titleLines[1].textContent).toContain('DOE');
  });

  it('should display headline as subtitle', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const subtitle = fixture.nativeElement.querySelector('.hero-subtitle');
    expect(subtitle.textContent).toContain('Senior Full Stack Developer');
  });

  it('should display location', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const location = fixture.nativeElement.querySelector('.hero-location');
    expect(location.textContent).toContain('Madrid');
    expect(location.textContent).toContain('Spain');
  });

  it('should have correct accessibility attributes', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('aria-label')).toBe('Main presentation');
    expect(section.getAttribute('role')).toBe('banner');
  });

  it('should render experience and contact action buttons', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.hero-actions button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('View Experience');
    expect(buttons[1].textContent).toContain('Get In Touch');
  });

  it('should handle null profile gracefully', () => {
    fixture.componentRef.setInput('profile', null);
    fixture.detectChanges();

    const componentElement = fixture.nativeElement;
    expect(componentElement.querySelector('.hero-section')).toBeTruthy();
  });
});
