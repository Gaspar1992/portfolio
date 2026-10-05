import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { KeyboardNavigationService } from '@core';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  const mockKeyboardNav = {
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
    navigateToSection: vi.fn(),
  };

  beforeEach(async () => {
    mockKeyboardNav.navigateToSection.mockClear();

    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        { provide: KeyboardNavigationService, useValue: mockKeyboardNav },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle mobile menu open and closed', () => {
    expect(component.mobileMenuOpen()).toBe(false);

    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBe(true);

    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBe(false);
  });

  it('should toggle mobile menu when toggle button is clicked', () => {
    const button = fixture.nativeElement.querySelector('.mobile-menu-toggle');
    expect(button).toBeTruthy();

    button.click();
    fixture.detectChanges();
    expect(component.mobileMenuOpen()).toBe(true);

    button.click();
    fixture.detectChanges();
    expect(component.mobileMenuOpen()).toBe(false);
  });

  it('should navigate to section and close mobile menu', () => {
    component.mobileMenuOpen.set(true);

    component.navigateToSection('experience');

    expect(mockKeyboardNav.navigateToSection).toHaveBeenCalledWith(2);
    expect(component.mobileMenuOpen()).toBe(false);
  });

  it('should handle non-existent section gracefully', () => {
    component.navigateToSection('unknown-section');
    expect(mockKeyboardNav.navigateToSection).not.toHaveBeenCalled();
  });
});
