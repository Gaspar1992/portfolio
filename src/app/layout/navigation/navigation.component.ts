import { Component, inject, signal } from '@angular/core';
import { KeyboardNavigationService, ViewModeService } from '@core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  private readonly keyboardNav = inject(KeyboardNavigationService);
  protected readonly viewModeService = inject(ViewModeService);

  readonly mobileMenuOpen = signal(false);

  toggleViewMode(): void {
    this.viewModeService.toggleMode();
  }

  isCinemaMode(): boolean {
    return this.viewModeService.isCinema();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  navigateToSection(sectionId: string, event?: Event): void {
    event?.preventDefault();
    const sections = this.keyboardNav.getAllSections();
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index !== -1) {
      this.keyboardNav.navigateToSection(index);
    }
    this.mobileMenuOpen.set(false);
  }
}
