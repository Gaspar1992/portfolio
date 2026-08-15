import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
} from '@angular/core';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';

@Component({
  selector: 'app-keyboard-shortcuts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './keyboard-shortcuts.component.html',
  styleUrls: ['./keyboard-shortcuts.component.scss'],
})
export class KeyboardShortcutsComponent {
  private readonly keyboardNav = inject(KeyboardNavigationService);

  // Reactive state linked with service state, eliminating manual effect() side-effects
  isPanelOpen = linkedSignal({
    source: () => this.keyboardNav.isKeyboardPanelOpen(),
    computation: (source) => source,
  });

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
    const next = !this.isPanelOpen();
    this.isPanelOpen.set(next);
    this.keyboardNav.isKeyboardPanelOpen.set(next);
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
    this.keyboardNav.isKeyboardPanelOpen.set(false);
  }
}
