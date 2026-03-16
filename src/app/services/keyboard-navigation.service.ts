import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export interface Section {
  id: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class KeyboardNavigationService {
  private readonly document = inject(DOCUMENT);

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

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      // Handle arrow keys for section navigation (when not in input)
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }

        event.preventDefault();
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
    });
  }

  private setupScrollObserver(): void {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Only update if not currently navigating with keyboard
        if (this.isNavigatingWithKeyboard()) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = this.sections.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) {
              this.currentSectionIndex.set(index);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    // Observe all sections
    this.sections.forEach((section) => {
      const element = this.document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });
  }

  private setupKeyboardIndicator(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', () => {
      this.showIndicator();
    });

    window.addEventListener(
      'scroll',
      () => {
        if (!this.isNavigatingWithKeyboard()) {
          this.hideIndicator();
        }
      },
      { passive: true }
    );
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

  getCurrentSection(): Section {
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
      if (sectionElement && sectionElement.contains(activeElement)) {
        this.currentSectionIndex.set(i);
        break;
      }
    }
  }
}
