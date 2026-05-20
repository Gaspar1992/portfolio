import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { KeyboardNavigationService } from './keyboard-navigation.service';
import { DOCUMENT } from '@angular/common';

describe('KeyboardNavigationService', () => {
  let service: KeyboardNavigationService;
  let mockDocument: Document;

  beforeEach(() => {
    // Mock IntersectionObserver
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

    // Mock MutationObserver
    const mockMutationObserver = vi.fn();
    mockMutationObserver.mockReturnValue({
      observe: () => null,
      disconnect: () => null
    });
    vi.stubGlobal('MutationObserver', mockMutationObserver);

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
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
    
    service.navigateToNext();
    
    expect(service.currentSectionIndex()).toBe(1);
    expect(document.getElementById).toHaveBeenCalledWith('about');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('should navigate to previous section', () => {
    service.currentSectionIndex.set(2);
    const mockElement = { scrollIntoView: vi.fn() };
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
    
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
    vi.spyOn(document, 'activeElement', 'get').mockReturnValue(mockActiveElement as any);
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'experience') {
        return { contains: (el: any) => el === mockActiveElement } as any;
      }
      return { contains: () => false } as any;
    });

    service.updateCurrentSectionFromFocus();
    
    expect(service.currentSectionIndex()).toBe(2); // 'experience'
  });
});
