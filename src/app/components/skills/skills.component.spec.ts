import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { LinkedInProfile } from '../../services/profile.service';
import { SkillsComponent } from './skills.component';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;

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
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should separate expert and additional skills', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    const expertSkills = component.getExpertSkills();
    const additionalSkills = component.getAdditionalSkills();

    expect(expertSkills.length).toBe(5);
    expect(expertSkills.every((s) => s.expert)).toBe(true);
    expect(additionalSkills.length).toBe(4);
    expect(additionalSkills.every((s) => !s.expert)).toBe(true);
  });

  it('should handle empty skills array', () => {
    const profileNoSkills = { ...mockProfile, skills: [] };
    fixture.componentRef.setInput('profile', profileNoSkills);

    expect(component.getExpertSkills()).toEqual([]);
    expect(component.getAdditionalSkills()).toEqual([]);
  });

  it('should handle null profile', () => {
    fixture.componentRef.setInput('profile', null);

    expect(component.getExpertSkills()).toEqual([]);
    expect(component.getAdditionalSkills()).toEqual([]);
  });

  it('should render expert skills with badge', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const expertItems = fixture.nativeElement.querySelectorAll('[data-testid="skill-item-expert"]');
    expect(expertItems.length).toBe(5);

    const firstExpert = expertItems[0];
    expect(firstExpert.querySelector('.expert-badge')).toBeTruthy();
  });

  it('should render additional skills without badge', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const additionalItems = fixture.nativeElement.querySelectorAll(
      '[data-testid="additional-skills-list"] li'
    );
    expect(additionalItems.length).toBe(4);

    const firstAdditional = additionalItems[0];
    expect(firstAdditional.querySelector('.expert-badge')).toBeFalsy();
  });

  it('should have correct section id for navigation', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('id')).toBe('skills');
  });

  it('should render skills group subtitles', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const subtitles = fixture.nativeElement.querySelectorAll('.skills-subtitle');
    expect(subtitles.length).toBe(2);

    const subtitleTexts = Array.from(subtitles).map((el) =>
      (el as HTMLElement).textContent?.trim()
    );
    expect(subtitleTexts).toContain('STARRING');
    expect(subtitleTexts).toContain('ALSO FEATURING');
  });
});
