import { signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { type LinkedInProfile, ProfileService } from '../../services/profile.service';
import { EducationComponent } from './education.component';

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;
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
    experience: [],
    education: [
      {
        id: 'edu1',
        school: 'MIT',
        degree: 'Master of Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2018-09-01',
        endDate: '2020-06-30',
        grade: '3.9 GPA',
        activities: 'Research Assistant',
      },
      {
        id: 'edu2',
        school: 'Stanford University',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Software Engineering',
        startDate: '2014-09-01',
        endDate: '2018-06-30',
        grade: null,
        activities: null,
      },
    ],
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
      imports: [EducationComponent],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            profile: signal<LinkedInProfile | null>(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display education cards', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const educationCards = fixture.nativeElement.querySelectorAll('.diploma');
    expect(educationCards.length).toBe(2);
  });

  it('should display degree and school information', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const firstCard = fixture.nativeElement.querySelector('.diploma');
    expect(firstCard.textContent).toContain('Master of Science');
    expect(firstCard.textContent).toContain('MIT');
    expect(firstCard.textContent).toContain('Computer Science');
  });

  it('should display grade when available', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.diploma');
    const firstCardGrade = cards[0].querySelector('.diploma-grade');
    expect(firstCardGrade.textContent).toContain('3.9 GPA');

    const secondCardGrade = cards[1].querySelector('.diploma-grade');
    expect(secondCardGrade).toBeNull();
  });

  it('should show empty state when no education', () => {
    const profileNoEducation = { ...mockProfile, education: [] };
    profileService.profile.set(profileNoEducation);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('[role="status"]');
    expect(emptyState.textContent).toContain('No education information available');
  });

  it('should have correct section id for navigation', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('id')).toBe('education');
  });
});
