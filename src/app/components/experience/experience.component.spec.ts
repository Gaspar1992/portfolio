import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ExperienceComponent } from './experience.component';
import { ProfileService, type LinkedInProfile } from '../../services/profile.service';

describe('ExperienceComponent', () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;
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
    profilePictureUrl: null,
    location: {
      city: 'Madrid',
      country: 'Spain',
      countryCode: 'ES',
    },
    summary: 'Developer',
    industry: 'Technology',
    experience: [
      {
        id: 'exp1',
        title: 'Senior Full Stack Developer',
        company: 'Tech Corp',
        companyLogoUrl: null,
        location: 'Madrid, Spain',
        employmentType: 'Full-time',
        startDate: '2022-01-01',
        endDate: null,
        isCurrent: true,
        description: 'Leading development team.\n\n- Implemented microservices architecture\n- Reduced deployment time by 50%\n- Mentored junior developers',
        skills: ['Angular', 'Node.js', 'Docker'],
      },
      {
        id: 'exp2',
        title: 'Full Stack Developer',
        company: 'Startup XYZ',
        companyLogoUrl: null,
        location: 'Barcelona, Spain',
        employmentType: 'Full-time',
        startDate: '2020-06-01',
        endDate: '2021-12-31',
        isCurrent: false,
        description: 'Full stack development.',
        skills: ['React', 'Python'],
      },
    ],
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
      imports: [ExperienceComponent],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            profile: signal<LinkedInProfile | null>(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract achievements from description', () => {
    const description = 'Role summary.\n\n- Achievement 1\n- Achievement 2\n- Achievement 3';
    const achievements = component.getAchievements(description);
    expect(achievements.length).toBe(3);
    expect(achievements[0]).toBe('Achievement 1');
    expect(achievements[1]).toBe('Achievement 2');
    expect(achievements[2]).toBe('Achievement 3');
  });

  it('should return empty array when no achievements in description', () => {
    const description = 'Just a summary without achievements.';
    const achievements = component.getAchievements(description);
    expect(achievements.length).toBe(0);
  });

  it('should return empty array for empty description', () => {
    expect(component.getAchievements('')).toEqual([]);
    expect(component.getAchievements(null as unknown as string)).toEqual([]);
  });

  it('should extract first paragraph from description', () => {
    const description = 'First paragraph.\n\nSecond paragraph.';
    expect(component.getFirstParagraph(description)).toBe('First paragraph.');
  });

  it('should return full description when no paragraph break', () => {
    const description = 'Single paragraph description';
    expect(component.getFirstParagraph(description)).toBe(description);
  });

  it('should display experience items', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const timelineItems = fixture.nativeElement.querySelectorAll('.timeline-item');
    expect(timelineItems.length).toBe(2);
  });

  it('should have correct section id for navigation', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('id')).toBe('experience');
  });
});
