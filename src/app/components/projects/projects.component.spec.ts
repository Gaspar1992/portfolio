import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { ProfileService, type LinkedInProfile } from '../../services/profile.service';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
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
    skills: [],
    certifications: [],
    projects: [
      {
        id: 'proj1',
        name: 'E-commerce Platform',
        description: 'Full stack e-commerce solution with payment integration.',
        url: 'https://github.com/johndoe/ecommerce',
        technologies: ['Angular', 'Node.js', 'MongoDB', 'Stripe'],
        startDate: '2023-01-01',
        endDate: '2023-06-30',
      },
      {
        id: 'proj2',
        name: 'Task Management App',
        description: 'Real-time collaborative task management application.',
        url: null,
        technologies: ['React', 'Firebase', 'TypeScript'],
        startDate: '2022-06-01',
        endDate: null,
      },
    ],
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
      imports: [ProjectsComponent],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            profile: signal<LinkedInProfile | null>(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display project cards', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const projectCards = fixture.nativeElement.querySelectorAll('.project-card');
    expect(projectCards.length).toBe(2);
  });

  it('should display project name as heading', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const headings = fixture.nativeElement.querySelectorAll('h3');
    expect(headings[0].textContent).toContain('E-commerce Platform');
    expect(headings[1].textContent).toContain('Task Management App');
  });

  it('should display project technologies', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const firstCard = fixture.nativeElement.querySelectorAll('.project-card')[0];
    const projectType = firstCard.querySelector('.project-type');
    expect(projectType.textContent).toContain('Angular');
    expect(projectType.textContent).toContain('Node.js');
  });

  it('should display view project link when URL is available', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const projectLinks = fixture.nativeElement.querySelectorAll('.project-links a');
    expect(projectLinks.length).toBe(1);
    expect(projectLinks[0].getAttribute('href')).toBe('https://github.com/johndoe/ecommerce');
    expect(projectLinks[0].getAttribute('target')).toBe('_blank');
  });

  it('should not display link when project URL is null', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.project-card');
    const secondCardLinks = cards[1].querySelectorAll('.project-links');
    expect(secondCardLinks.length).toBe(0);
  });

  it('should display project tags with technologies', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const firstCard = fixture.nativeElement.querySelector('.project-card');
    const tags = firstCard.querySelectorAll('.tag-deco');
    expect(tags.length).toBeLessThanOrEqual(4);
  });

  it('should show empty state when no projects', () => {
    const profileNoProjects = { ...mockProfile, projects: [] };
    profileService.profile.set(profileNoProjects);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('[role="status"]');
    expect(emptyState.textContent).toContain('No projects available');
  });

  it('should have correct section id for navigation', () => {
    profileService.profile.set(mockProfile);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('id')).toBe('projects');
  });
});
