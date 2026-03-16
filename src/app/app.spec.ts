import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { App } from './app';
import { KeyboardNavigationService } from './services/keyboard-navigation.service';
import { ProfileService } from './services/profile.service';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  const mockProfileService = {
    loadProfile: vi.fn().mockResolvedValue({
      _meta: { source: 'test', syncedAt: '2024-01-01', profileId: 'test' },
      firstName: 'Test',
      lastName: 'User',
      fullName: 'Test User',
      headline: 'Test Developer',
      email: 'test@example.com',
      linkedInUrl: null,
      vanityName: null,
      profilePictureUrl: null,
      location: { city: 'Madrid', country: 'Spain', countryCode: 'ES' },
      summary: 'Test summary',
      industry: 'Technology',
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      projects: [],
      languages: [],
      contactInfo: { email: 'test@example.com', website: null, github: null, twitter: null },
      interests: [],
      honors: [],
    }),
  };

  const mockKeyboardNavService = {
    currentSectionIndex: vi.fn().mockReturnValue(0),
    isNavigatingWithKeyboard: vi.fn().mockReturnValue(false),
    getTotalSections: vi.fn().mockReturnValue(8),
    getAllSections: vi.fn().mockReturnValue([
      { id: 'hero', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'experience', label: 'Experience' },
      { id: 'skills', label: 'Skills' },
      { id: 'education', label: 'Education' },
      { id: 'projects', label: 'Projects' },
      { id: 'certifications', label: 'Certifications' },
      { id: 'contact', label: 'Contact' },
    ]),
    getCurrentSection: vi.fn().mockReturnValue({ id: 'hero', label: 'Home' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
        { provide: KeyboardNavigationService, useValue: mockKeyboardNavService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect((component as unknown as { title: () => string }).title()).toBe('portfolio');
  });

  it('should load profile on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockProfileService.loadProfile).toHaveBeenCalled();
    expect((component as unknown as { profile: () => unknown }).profile()).not.toBeNull();
  });

  it('should set loading to false after profile loads', async () => {
    fixture.detectChanges();
    expect((component as unknown as { loading: () => boolean }).loading()).toBe(true);
    await fixture.whenStable();
    expect((component as unknown as { loading: () => boolean }).loading()).toBe(false);
  });
});
