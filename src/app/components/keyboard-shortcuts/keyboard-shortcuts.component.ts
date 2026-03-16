import { Component, computed, effect, inject, signal } from '@angular/core';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';

@Component({
  selector: 'app-keyboard-shortcuts',
  standalone: true,
  template: `
    <!-- Toggle button - hidden when panel is open -->
    <button 
      class="keyboard-toggle"
      [class.hidden]="isPanelOpen()"
      (click)="togglePanel()"
      [attr.aria-label]="isPanelOpen() ? 'Hide keyboard shortcuts' : 'Show keyboard shortcuts'"
      aria-controls="keyboard-panel"
      [attr.aria-expanded]="isPanelOpen()">
      <span class="toggle-icon">⌨️</span>
    </button>

    <!-- Keyboard shortcuts panel -->
    <div 
      id="keyboard-panel"
      class="keyboard-shortcuts" 
      [class.visible]="isVisible()"
      [class.hidden]="!isPanelOpen()"
      role="complementary"
      aria-label="Keyboard shortcuts">
      <div class="shortcuts-header">
        <span class="shortcuts-title">Keyboard</span>
        <button 
          class="close-btn"
          (click)="closePanel()"
          aria-label="Close keyboard shortcuts">
          ×
        </button>
      </div>
      
      <div class="shortcuts-list">
        <div class="shortcut-item">
          <div class="shortcut-keys">
            <kbd>↑</kbd>
            <kbd>↓</kbd>
          </div>
          <span class="shortcut-desc">Sections</span>
        </div>
        
        <div class="shortcut-item">
          <div class="shortcut-keys">
            <kbd>Tab</kbd>
          </div>
          <span class="shortcut-desc">Focus items</span>
        </div>
        
        <div class="shortcut-item">
          <div class="shortcut-keys">
            <kbd>Enter</kbd>
          </div>
          <span class="shortcut-desc">Activate</span>
        </div>
        
        <div class="shortcut-item">
          <div class="shortcut-keys">
            <kbd>Esc</kbd>
          </div>
          <span class="shortcut-desc">Close panel</span>
        </div>
      </div>
      
      <div class="shortcut-section-indicator">
        <span class="current-section">{{ currentSectionLabel() }}</span>
        <span class="section-progress">{{ currentIndex() + 1 }} / {{ totalSections() }}</span>
      </div>
    </div>
  `,
  styles: [
    `
    :host {
      position: fixed;
      top: 50%;
      right: 2rem;
      transform: translateY(-50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .keyboard-toggle {
      background: var(--color-black);
      border: 2px solid var(--color-gold);
      border-radius: 8px;
      padding: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .keyboard-toggle:hover {
      background: var(--color-gold);
      transform: scale(1.05);
    }

    .toggle-icon {
      font-size: 1.25rem;
    }

    .keyboard-shortcuts {
      background: var(--color-black);
      border: 2px solid var(--color-gold);
      border-radius: 8px;
      padding: 1.25rem;
      font-family: var(--font-body);
      font-size: 0.85rem;
      color: var(--color-cream);
      opacity: 0;
      transform: translateX(20px);
      transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
      min-width: 140px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      visibility: hidden;
    }

    .keyboard-shortcuts.visible {
      opacity: 1;
      transform: translateX(0);
      visibility: visible;
    }

    .keyboard-shortcuts.hidden {
      display: none;
    }

    .keyboard-toggle.hidden {
      display: none;
    }

    .keyboard-shortcuts:hover {
      opacity: 1;
    }

    .shortcuts-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--color-gold);
    }

    .shortcuts-title {
      font-family: var(--font-display);
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-gold);
      font-weight: 600;
    }

    .shortcuts-icon {
      font-size: 1rem;
    }

    .shortcuts-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .shortcut-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .shortcut-keys {
      display: flex;
      gap: 0.25rem;
    }

    kbd {
      background: var(--color-cream-dark);
      border: 1px solid var(--color-gold);
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      font-family: var(--font-mono, monospace);
      font-size: 0.75rem;
      color: var(--color-gold);
      min-width: 24px;
      text-align: center;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .shortcut-desc {
      font-size: 0.8rem;
      color: var(--color-cream);
      text-align: right;
    }

    .shortcut-section-indicator {
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-gold);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      text-align: center;
    }

    .current-section {
      font-family: var(--font-display);
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-gold);
    }

    .section-progress {
      font-size: 0.7rem;
      color: var(--color-bronze);
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--color-cream);
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    }

    .close-btn:hover {
      color: var(--color-gold);
    }

    @media (max-width: 768px) {
      :host {
        display: none;
      }
    }
  `,
export class KeyboardShortcutsComponent {
  private readonly keyboardNav = inject(KeyboardNavigationService);

  // Local state for panel visibility - sync with service
  isPanelOpen = signal(true);

  currentIndex = this.keyboardNav.currentSectionIndex;
  isNavigating = this.keyboardNav.isNavigatingWithKeyboard;
  totalSections = computed(() => this.keyboardNav.getTotalSections());

  // Combined visibility: visible if panel is open AND user is navigating with keyboard
  isVisible = computed(() => this.isPanelOpen() && (this.isNavigating() || this.currentIndex() >= 0));

  currentSectionLabel = computed(() => {
    const index = this.currentIndex();
    return this.keyboardNav.getAllSections()[index]?.label ?? '';
  });

  constructor() {
    this.setupEscapeKey();
    // Sync local state with service
    effect(() => {
      this.keyboardNav.isKeyboardPanelOpen.set(this.isPanelOpen());
    });
  }

  private setupEscapeKey(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.isPanelOpen()) {
        this.closePanel();
      }
    });
  }

  togglePanel(): void {
    this.isPanelOpen.update((open) => !open);
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
  }
}
