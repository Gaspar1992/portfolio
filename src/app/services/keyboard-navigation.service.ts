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

  constructor() {
    this.setupKeyboardNavigation();
    this.setupScrollObserver();
    this.setupKeyboardIndicator();
  }

  private setupKeyboardNavigation(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      // Only handle arrow keys when not in an input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.isNavigatingWithKeyboard.set(true);

        if (event.key === 'ArrowDown') {
          this.navigateToNext();
        } else {
          this.navigateToPrevious();
        }

        // Reset keyboard navigation flag after animation
        setTimeout(() => {
          this.isNavigatingWithKeyboard.set(false);
        }, 1000);
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
}
