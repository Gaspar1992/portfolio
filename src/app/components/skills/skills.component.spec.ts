import { signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { type LinkedInProfile, ProfileService } from '../../services/profile.service';
import { SkillsComponent } from './skills.component';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;
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
    education: [],
    skills: [
      { name: 'Angular', expert: true },
      { name: 'TypeScript', expert: true },
      { name: 'Node.js', expert: true },
      { name: 'React', expert: true },
      { name: 'Python', expert: true },
      { name: 'AWS', expert: false },
      { name: 'Docker', expert: false },
      { name: 'Kubernetes', expert: false },
      { name: 'GraphQL', expert: false },
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
      imports: [SkillsComponent],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            profile: signal<LinkedInProfile | null>(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should separate expert and additional skills', () => {
    profileService.profile.set(mockProfile);
    const expertSkills = component.getExpertSkills();
    const additionalSkills = component.getAdditionalSkills();

    expect(expertSkills.length).toBe(5);
    expect(expertSkills.every((s) => s.isExpert)).toBe(true);
    expect(additionalSkills.length).toBe(4);
    expect(additionalSkills.every((s) => !s.isExpert)).toBe(true);
  });

  it('should handle empty skills array', () => {
    const profileNoSkills = { ...mockProfile, skills: [] };
    profileService.profile.set(profileNoSkills);

    expect(component.getExpertSkills()).toEqual([]);
    expect(component.getAdditionalSkills()).toEqual([]);
  });

  it('should handle null profile', () => {
    profileService.profile.set(null);

    expect(component.getExpertSkills()).toEqual([]);
    expect(component.getAdditionalSkills()).toEqual([]);
  });

  it('should render expert skills', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const expertItems = fixture.nativeElement.querySelectorAll('[data-testid="skill-item-expert"]');
    expect(expertItems.length).toBe(5);
  });

  it('should render additional skills', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const additionalItems = fixture.nativeElement.querySelectorAll(
      '[data-testid="additional-skills-list"] li'
    );
    expect(additionalItems.length).toBe(4);
  });

  it('should have correct section id for navigation', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('id')).toBe('skills');
  });

  it('should render skills group subtitles', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const subtitles = fixture.nativeElement.querySelectorAll('.skills-subtitle');
    expect(subtitles.length).toBe(2);

    const subtitleTexts = Array.from(subtitles).map((el) =>
      (el as HTMLElement).textContent?.trim()
    );
    expect(subtitleTexts).toContain('STARRING');
    expect(subtitleTexts).toContain('ALSO FEATURING');
  });

  describe('dynamic scoring from experience', () => {
    const currentYear = new Date().getFullYear();

    const profileWithExperience: LinkedInProfile = {
      ...mockProfile,
      skills: [
        { name: 'Angular', expert: true },
        { name: 'TypeScript', expert: true },
        { name: 'Node.js', expert: true },
        { name: 'Java', expert: true },
        { name: 'PHP', expert: true },
        { name: 'RxJS', expert: false },
      ],
      experience: [
        {
          id: 'e1',
          title: 'Frontend Architect',
          company: 'Current Co',
          companyLogoUrl: null,
          location: null,
          employmentType: 'Full-time',
          startDate: `${currentYear - 3}-01-01`,
          endDate: null,
          isCurrent: true,
          description: null,
          skills: ['Angular', 'TypeScript'],
        },
        {
          id: 'e2',
          title: 'Senior Dev',
          company: 'Mid Co',
          companyLogoUrl: null,
          location: null,
          employmentType: 'Full-time',
          startDate: `${currentYear - 5}-01-01`,
          endDate: `${currentYear - 3}-01-01`,
          isCurrent: false,
          description: null,
          skills: ['Angular', 'TypeScript'],
        },
        {
          id: 'e3',
          title: 'Junior Dev',
          company: 'Old Co',
          companyLogoUrl: null,
          location: null,
          employmentType: 'Full-time',
          startDate: `${currentYear - 10}-01-01`,
          endDate: `${currentYear - 7}-01-01`,
          isCurrent: false,
          description: null,
          skills: ['Java', 'PHP', 'Angular'],
        },
      ],
    };

    it('should demote skills that were not used recently to additional', () => {
      profileService.profile.set(profileWithExperience);

      const additional = component.getAdditionalSkills().map((s) => s.name);
      expect(additional).toContain('Java');
      expect(additional).toContain('PHP');
      expect(additional).not.toContain('Angular');
      expect(additional).not.toContain('TypeScript');
    });

    it('should keep skills as expert when present in current or recent experience', () => {
      profileService.profile.set(profileWithExperience);

      const expert = component.getExpertSkills().map((s) => s.name);
      expect(expert).toContain('Angular');
      expect(expert).toContain('TypeScript');
    });

    it('should keep skills as expert via JSON fallback when no experience evidence', () => {
      profileService.profile.set(profileWithExperience);

      const expert = component.getExpertSkills().map((s) => s.name);
      // Node.js no aparece en experiencias → fallback al flag del JSON (expert:true)
      expect(expert).toContain('Node.js');
    });

    it('should select top 3 headliners sorted by count and total years', () => {
      profileService.profile.set(profileWithExperience);

      const headliners = component.headlinerSkills();
      // Angular aparece en 3 experiencias con isCurrent → lidera
      // TypeScript aparece en 2 experiencias con isCurrent → segunda
      // No hay terceros candidatos con isCurrent → 2 headliners (no 3)
      expect(headliners.length).toBe(2);
      expect(headliners[0].name).toBe('Angular');
      expect(headliners[1].name).toBe('TypeScript');
      expect(headliners.every((s) => s.isHeadliner)).toBe(true);
      expect(headliners.every((s) => s.isCurrent)).toBe(true);
    });

    it('should not include headliners in expertSkills signal', () => {
      profileService.profile.set(profileWithExperience);

      const headlinerNames = component.headlinerSkills().map((s) => s.name);
      const expertOnly = component.expertSkills().map((s) => s.name);
      for (const name of headlinerNames) {
        expect(expertOnly).not.toContain(name);
      }
    });

    it('should render the LEADING ROLES group when there are headliners', () => {
      profileService.profile.set(profileWithExperience);
      fixture.detectChanges();

      const headlinerItems = fixture.nativeElement.querySelectorAll(
        '[data-testid="skill-item-headliner"]'
      );
      expect(headlinerItems.length).toBe(2);

      const subtitles = Array.from(fixture.nativeElement.querySelectorAll('.skills-subtitle')).map(
        (el) => (el as HTMLElement).textContent?.trim()
      );
      expect(subtitles).toContain('LEADING ROLES');
    });
  });
});
