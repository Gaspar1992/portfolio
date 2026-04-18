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

  it('should get top 12 skills', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    const topSkills = component.getTopSkills();

    expect(topSkills.length).toBeLessThanOrEqual(12);
    expect(topSkills[0].name).toBe('Angular');
    expect(topSkills[topSkills.length - 1].name).toBe('GraphQL');
  });

  it('should handle empty skills array', () => {
    const profileNoSkills = { ...mockProfile, skills: [] };
    fixture.componentRef.setInput('profile', profileNoSkills);

    expect(component.getTopSkills()).toEqual([]);
  });

  it('should handle null profile', () => {
    fixture.componentRef.setInput('profile', null);

    expect(component.getTopSkills()).toEqual([]);
  });

  it('should have correct section id for navigation', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('id')).toBe('skills');
  });

  it('should use native ul and li elements for skills list', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const skillsList = fixture.nativeElement.querySelector('ul.skills-grid');
    expect(skillsList).toBeTruthy();

    const skillItems = fixture.nativeElement.querySelectorAll('li.skill-item');
    expect(skillItems.length).toBeGreaterThan(0);
  });

  it('should have proper ARIA attributes on skill items', () => {
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();

    const skillItems = fixture.nativeElement.querySelectorAll('li.skill-item');
    expect(skillItems.length).toBeGreaterThan(0);

    // Check first skill item has aria-label
    const firstItem = skillItems[0];
    expect(firstItem.getAttribute('aria-label')).toBeTruthy();
    expect(firstItem.getAttribute('data-testid')).toBe('skill-item');
  });
});
