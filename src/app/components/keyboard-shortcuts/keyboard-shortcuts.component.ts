import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';

@Component({
  selector: 'app-keyboard-shortcuts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './keyboard-shortcuts.component.html',
  styleUrls: ['./keyboard-shortcuts.component.scss'],
})
export class KeyboardShortcutsComponent {
  private readonly keyboardNav = inject(KeyboardNavigationService);

  // Local state for panel visibility - sync with service
  isPanelOpen = signal(true);

  currentIndex = this.keyboardNav.currentSectionIndex;
  isNavigating = this.keyboardNav.isNavigatingWithKeyboard;
  totalSections = computed(() => this.keyboardNav.getTotalSections());

  // Combined visibility: visible if panel is open AND user is navigating with keyboard
  isVisible = computed(
    () => this.isPanelOpen() && (this.isNavigating() || this.currentIndex() >= 0)
  );

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
