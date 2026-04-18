import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ProfileService, type LinkedInProfile } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

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
        title: 'Senior Developer',
        company: 'Tech Corp',
        companyLogoUrl: null,
        location: 'Madrid',
        employmentType: 'Full-time',
        startDate: '2022-01-01',
        endDate: null,
        isCurrent: true,
        description: 'Leading development',
        skills: ['Angular', 'Node.js'],
      },
      {
        id: 'exp2',
        title: 'Developer',
        company: 'Startup',
        companyLogoUrl: null,
        location: 'Barcelona',
        employmentType: 'Full-time',
        startDate: '2020-01-01',
        endDate: '2021-12-31',
        isCurrent: false,
        description: 'Full stack development',
        skills: ['React', 'Python'],
      },
    ],
    education: [
      {
        id: 'edu1',
        school: 'MIT',
        degree: 'Master of Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2018-09-01',
        endDate: '2020-06-30',
        grade: '3.9 GPA',
        activities: 'Research',
      },
    ],
    skills: [
      { name: 'Angular', expert: true },
      { name: 'TypeScript', expert: true },
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

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null when profile is not loaded', () => {
    expect(service.getProfile()).toBeNull();
    expect(service.getLastSyncedAt()).toBeNull();
  });

  it('should format experience date for current position', () => {
    const formatted = service.formatExperienceDate('2022-01-01', null, true);
    expect(formatted).toBe('2022 — Present');
  });

  it('should format experience date for past position', () => {
    const formatted = service.formatExperienceDate('2020-01-01', '2021-12-31', false);
    expect(formatted).toBe('2020 — 2021');
  });

  it('should format education date', () => {
    const formatted = service.formatEducationDate('2018-09-01', '2020-06-30');
    expect(formatted).toBe('2018 — 2020');
  });

  it('should format last synced date', async () => {
    // Mock the profile loading by setting the private property directly
    (service as unknown as { profileData: LinkedInProfile }).profileData = mockProfile;

    const syncedAt = service.getLastSyncedAt();
    expect(syncedAt).toContain('2024');
    expect(syncedAt).toContain('enero'); // Spanish locale
  });
});
