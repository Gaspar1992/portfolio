import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KeyboardNavigationService } from './keyboard-navigation.service';

describe('KeyboardNavigationService', () => {
  let service: KeyboardNavigationService;

  beforeEach(() => {
    // Mock IntersectionObserver
    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    // Mock MutationObserver
    class MockMutationObserver {
      observe = vi.fn();
      disconnect = vi.fn();
    }
    vi.stubGlobal('MutationObserver', MockMutationObserver);

    TestBed.configureTestingModule({});

    vi.stubGlobal('window', {
      ...window,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      innerHeight: 1000,
    });

    service = TestBed.inject(KeyboardNavigationService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all sections', () => {
    const sections = service.getAllSections();
    expect(sections.length).toBe(8);
    expect(sections[0].id).toBe('hero');
  });

  it('should return current section', () => {
    service.currentSectionIndex.set(1);
    const section = service.getCurrentSection();
    expect(section?.id).toBe('about');
  });

  it('should navigate to next section', () => {
    service.currentSectionIndex.set(0);
    const mockElement = { scrollIntoView: vi.fn() };
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as unknown as HTMLElement);

    service.navigateToNext();

    expect(service.currentSectionIndex()).toBe(1);
    expect(document.getElementById).toHaveBeenCalledWith('about');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('should navigate to previous section', () => {
    service.currentSectionIndex.set(2);
    const mockElement = { scrollIntoView: vi.fn() };
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as unknown as HTMLElement);

    service.navigateToPrevious();

    expect(service.currentSectionIndex()).toBe(1);
    expect(document.getElementById).toHaveBeenCalledWith('about');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('should not navigate past bounds', () => {
    service.currentSectionIndex.set(0);
    service.navigateToPrevious();
    expect(service.currentSectionIndex()).toBe(0);

    service.currentSectionIndex.set(7);
    service.navigateToNext();
    expect(service.currentSectionIndex()).toBe(7);
  });

  it('should get total sections', () => {
    expect(service.getTotalSections()).toBe(8);
  });

  it('should get current index', () => {
    service.currentSectionIndex.set(3);
    expect(service.getCurrentIndex()).toBe(3);
  });

  it('should update current section from focus', () => {
    const mockActiveElement = {};
    vi.spyOn(document, 'activeElement', 'get').mockReturnValue(
      mockActiveElement as unknown as HTMLElement
    );
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'experience') {
        return { contains: (el: unknown) => el === mockActiveElement } as unknown as HTMLElement;
      }
      return { contains: () => false } as unknown as HTMLElement;
    });

    service.updateCurrentSectionFromFocus();

    expect(service.currentSectionIndex()).toBe(2); // 'experience'
  });
});
