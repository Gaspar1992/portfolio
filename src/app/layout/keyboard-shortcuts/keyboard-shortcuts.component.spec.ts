import { signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { KeyboardNavigationService } from '@core';
import { KeyboardShortcutsComponent } from './keyboard-shortcuts.component';

describe('KeyboardShortcutsComponent', () => {
  let component: KeyboardShortcutsComponent;
  let fixture: ComponentFixture<KeyboardShortcutsComponent>;

  const mockKeyboardNav = {
    isKeyboardPanelOpen: signal(false),
    currentSectionIndex: signal(0),
    isNavigatingWithKeyboard: signal(false),
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
  };

  beforeEach(async () => {
    mockKeyboardNav.isKeyboardPanelOpen.set(false);
    mockKeyboardNav.currentSectionIndex.set(0);
    mockKeyboardNav.isNavigatingWithKeyboard.set(false);

    await TestBed.configureTestingModule({
      imports: [KeyboardShortcutsComponent],
      providers: [
        { provide: KeyboardNavigationService, useValue: mockKeyboardNav },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyboardShortcutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle panel open and closed', () => {
    expect(component.isPanelOpen()).toBe(false);

    component.togglePanel();
    expect(component.isPanelOpen()).toBe(true);
    expect(mockKeyboardNav.isKeyboardPanelOpen()).toBe(true);

    component.togglePanel();
    expect(component.isPanelOpen()).toBe(false);
    expect(mockKeyboardNav.isKeyboardPanelOpen()).toBe(false);
  });

  it('should close panel explicitly', () => {
    component.isPanelOpen.set(true);
    mockKeyboardNav.isKeyboardPanelOpen.set(true);

    component.closePanel();
    expect(component.isPanelOpen()).toBe(false);
    expect(mockKeyboardNav.isKeyboardPanelOpen()).toBe(false);
  });

  it('should compute current section label', () => {
    mockKeyboardNav.currentSectionIndex.set(1);
    expect(component.currentSectionLabel()).toBe('About');

    mockKeyboardNav.currentSectionIndex.set(3);
    expect(component.currentSectionLabel()).toBe('Skills');
  });

  it('should close panel when Escape key is pressed', () => {
    component.isPanelOpen.set(true);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component.isPanelOpen()).toBe(false);
  });
});
