import { Component, computed, inject } from '@angular/core';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';

@Component({
  selector: 'app-section-indicator',
  standalone: true,
  template: `
    <div 
      class="section-indicator" 
      [class.visible]="isVisible()"
      role="status"
      aria-live="polite"
      aria-label="Current section">
      <span class="current-section">{{ currentSectionLabel() }}</span>
      <span class="section-count">{{ currentIndex() + 1 }} / {{ totalSections() }}</span>
    </div>
  `,
  styles: [
    `
    :host {
      position: fixed;
      bottom: 2rem;
      left: 2rem;
      z-index: 1000;
    }

    .section-indicator {
      background: var(--color-black);
      border: 2px solid var(--color-gold);
      padding: 1rem 1.5rem;
      font-family: var(--font-display);
      font-size: 0.9rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-gold);
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .section-indicator.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .current-section {
      color: var(--color-cream);
      font-weight: 600;
    }

    .section-count {
      color: var(--color-bronze);
      font-size: 0.8rem;
      margin-left: 0.5rem;
    }

    @media (max-width: 768px) {
      :host {
        bottom: 1rem;
        left: 1rem;
      }

      .section-indicator {
        padding: 0.75rem 1rem;
        font-size: 0.8rem;
      }
    }
  `,
  ],
})
export class SectionIndicatorComponent {
  private readonly keyboardNav = inject(KeyboardNavigationService);

  currentIndex = this.keyboardNav.currentSectionIndex;
  totalSections = computed(() => this.keyboardNav.getTotalSections());
  isVisible = this.keyboardNav.isNavigatingWithKeyboard;

  currentSectionLabel = computed(() => {
    const index = this.currentIndex();
    return this.keyboardNav.getAllSections()[index]?.label ?? '';
  });
}
