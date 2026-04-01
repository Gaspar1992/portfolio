import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  private readonly keyboardNav = inject(KeyboardNavigationService);

  readonly mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  navigateToSection(sectionId: string): void {
    const sections = this.keyboardNav.getAllSections();
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index !== -1) {
      this.keyboardNav.navigateToSection(index);
    }
    this.mobileMenuOpen.set(false);
  }
}
