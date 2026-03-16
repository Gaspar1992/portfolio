import { Component, computed, inject } from '@angular/core';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';

@Component({
  selector: 'app-section-indicator',
  standalone: true,
  templateUrl: './section-indicator.component.html',
  styleUrls: ['./section-indicator.component.scss'],
})
export class SectionIndicatorComponent {
  private readonly keyboardNav = inject(KeyboardNavigationService);

  currentIndex = this.keyboardNav.currentSectionIndex;
  totalSections = computed(() => this.keyboardNav.getTotalSections());
  isVisible = computed(
    () => this.keyboardNav.isNavigatingWithKeyboard() && !this.keyboardNav.isKeyboardPanelOpen()
  );

  currentSectionLabel = computed(() => {
    const index = this.currentIndex();
    return this.keyboardNav.getAllSections()[index]?.label ?? '';
  });
}
