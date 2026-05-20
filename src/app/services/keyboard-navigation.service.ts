import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject, NgZone, signal } from '@angular/core';

export interface Section {
  id: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class KeyboardNavigationService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private readonly observedSectionIds = new Set<string>();

  private readonly sections: Section[] = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' },
  ];

  currentSectionIndex = signal(0);
  isNavigatingWithKeyboard = signal(false);
  isKeyboardPanelOpen = signal(false);

  constructor() {
    this.setupKeyboardNavigation();
    this.setupScrollObserver();
    this.setupKeyboardIndicator();
  }

  private setupKeyboardNavigation(): void {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      // Handle arrow keys for section navigation (when not in input)
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }

        event.preventDefault();

        // We re-enter the zone only when we actually update state if needed,
        // but with Signals it's safe to update outside the zone!
        this.isNavigatingWithKeyboard.set(true);

        if (event.key === 'ArrowDown') {
          this.navigateToNext();
        } else {
          this.navigateToPrevious();
        }

        setTimeout(() => {
          this.isNavigatingWithKeyboard.set(false);
        }, 1000);
        return;
      }

      // Handle Tab for intra-section navigation
      if (event.key === 'Tab') {
        this.isNavigatingWithKeyboard.set(true);
        // Let default Tab behavior work, but show indicator
        setTimeout(() => {
          this.updateCurrentSectionFromFocus();
        }, 0);

        setTimeout(() => {
          this.isNavigatingWithKeyboard.set(false);
        }, 500);
      }
    };

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('keydown', handleKeyDown);
    });

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('keydown', handleKeyDown);
    });
  }

  private setupScrollObserver(): void {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      () => {
        // Only update if not currently navigating with keyboard
        if (this.isNavigatingWithKeyboard()) return;

        this.updateCurrentSectionFromViewportMiddle();
      },
      {
        threshold: 0,
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    this.observeAvailableSections(observer);

    if (this.observedSectionIds.size >= this.sections.length) {
      this.destroyRef.onDestroy(() => observer.disconnect());
      return;
    }

    const mutationObserver = new MutationObserver(() => {
      this.observeAvailableSections(observer);

      if (this.observedSectionIds.size >= this.sections.length) {
        mutationObserver.disconnect();
      }
    });

    mutationObserver.observe(this.document.body, {
      childList: true,
      subtree: true,
    });

    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      mutationObserver.disconnect();
    });
  }

  private observeAvailableSections(observer: IntersectionObserver): void {
    this.sections.forEach((section) => {
      if (this.observedSectionIds.has(section.id)) {
        return;
      }

      const element = this.document.getElementById(section.id);
      if (!element) {
        return;
      }

      observer.observe(element);
      this.observedSectionIds.add(section.id);
    });
  }

  private setupKeyboardIndicator(): void {
    if (typeof window === 'undefined') return;

    const handleKeyDown = () => {
      this.showIndicator();
    };

    const handleScroll = () => {
      if (!this.isNavigatingWithKeyboard()) {
        this.hideIndicator();
        this.updateCurrentSectionFromViewportMiddle();
      }
    };

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('scroll', handleScroll, { passive: true });
    });

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    });
  }

  private updateCurrentSectionFromViewportMiddle(): void {
    if (typeof window === 'undefined') return;

    const viewportMiddle = window.innerHeight / 2;

    for (let i = 0; i < this.sections.length; i++) {
      const sectionElement = this.document.getElementById(this.sections[i].id);
      if (!sectionElement) continue;

      const rect = sectionElement.getBoundingClientRect();
      if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
        if (i !== this.currentSectionIndex()) {
          this.currentSectionIndex.set(i);
        }
        return;
      }
    }

    let closestIndex = this.currentSectionIndex();
    let minDistance = Number.POSITIVE_INFINITY;

    this.sections.forEach((section, index) => {
      const sectionElement = this.document.getElementById(section.id);
      if (!sectionElement) return;

      const rect = sectionElement.getBoundingClientRect();
      const sectionMiddle = rect.top + rect.height / 2;
      const distance = Math.abs(sectionMiddle - viewportMiddle);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== this.currentSectionIndex()) {
      this.currentSectionIndex.set(closestIndex);
    }
  }

  private showIndicator(): void {
    const indicator = this.document.querySelector('.section-indicator');
    if (indicator) {
      indicator.classList.add('visible');
    }
  }

  private hideIndicator(): void {
    const indicator = this.document.querySelector('.section-indicator');
    if (indicator) {
      indicator.classList.remove('visible');
    }
  }

  navigateToNext(): void {
    const nextIndex = Math.min(this.currentSectionIndex() + 1, this.sections.length - 1);
    this.navigateToSection(nextIndex);
  }

  navigateToPrevious(): void {
    const prevIndex = Math.max(this.currentSectionIndex() - 1, 0);
    this.navigateToSection(prevIndex);
  }

  navigateToSection(index: number): void {
    if (index < 0 || index >= this.sections.length) return;

    this.currentSectionIndex.set(index);
    const section = this.sections[index];
    const element = this.document.getElementById(section.id);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getCurrentSection(): Section | undefined {
    return this.sections[this.currentSectionIndex()];
  }

  getAllSections(): Section[] {
    return this.sections;
  }

  getCurrentIndex(): number {
    return this.currentSectionIndex();
  }

  getTotalSections(): number {
    return this.sections.length;
  }

  updateCurrentSectionFromFocus(): void {
    const activeElement = this.document.activeElement;
    if (!activeElement) return;

    // Find which section contains the focused element
    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      const sectionElement = this.document.getElementById(section.id);
      if (sectionElement?.contains(activeElement)) {
        this.currentSectionIndex.set(i);
        break;
      }
    }
  }
}
