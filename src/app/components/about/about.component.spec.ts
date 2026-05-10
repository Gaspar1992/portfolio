import { signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProfileService, type LinkedInProfile } from '../../services/profile.service';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let profileService: ProfileService;

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
    profilePictureUrl: 'https://example.com/photo.jpg',
    location: {
      city: 'Madrid',
      country: 'Spain',
      countryCode: 'ES',
    },
    summary:
      'First paragraph of summary.\n\nSecond paragraph with more details.\n\nThird paragraph.',
    industry: 'Technology',
    experience: [],
    education: [],
    skills: [
      { name: 'Angular', expert: true },
      { name: 'TypeScript', expert: true },
      { name: 'Node.js', expert: true },
      { name: 'React', expert: true },
      { name: 'Python', expert: true },
      { name: 'AWS', expert: false },
      { name: 'Docker', expert: false },
    ],
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
      imports: [AboutComponent],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            profile: signal<LinkedInProfile | null>(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get initials from full name', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
    expect(component.getInitials('John Michael Doe')).toBe('JMD');
    expect(component.getInitials('')).toBe('');
    expect(component.getInitials(undefined)).toBe('');
  });

  it('should extract first paragraph from summary', () => {
    profileService.profile.set(mockProfile);
    expect(component.getFirstParagraph()).toBe('First paragraph of summary.');
  });

  it('should extract remaining paragraphs from summary', () => {
    profileService.profile.set(mockProfile);
    const paragraphs = component.getSummaryParagraphs();
    expect(paragraphs.length).toBe(2);
    expect(paragraphs[0]).toBe('Second paragraph with more details.');
    expect(paragraphs[1]).toBe('Third paragraph.');
  });

  it('should get top 6 skills', () => {
    profileService.profile.set(mockProfile);
    const topSkills = component.getTopSkills();
    expect(topSkills.length).toBe(6);
    expect(topSkills[0].name).toBe('Angular');
    expect(topSkills[5].name).toBe('AWS');
  });

  it('should display profile image when available', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('.portrait-image');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/photo.jpg');
    expect(img.getAttribute('alt')).toContain('John Doe');
  });

  it('should display placeholder when no profile image', () => {
    const profileWithoutImage = { ...mockProfile, profilePictureUrl: null };
    profileService.profile.set(profileWithoutImage);
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector('.portrait-placeholder');
    expect(placeholder).toBeTruthy();
    expect(placeholder.textContent).toContain('JD');
  });

  it('should have correct section id for navigation', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('id')).toBe('about');
  });
});
