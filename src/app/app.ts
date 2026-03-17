import { Component, inject, type OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AboutComponent } from './components/about/about.component';
import { CertificationsComponent } from './components/certifications/certifications.component';
import { ContactComponent } from './components/contact/contact.component';
import { EducationComponent } from './components/education/education.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { HeroComponent } from './components/hero/hero.component';
import { KeyboardShortcutsComponent } from './components/keyboard-shortcuts/keyboard-shortcuts.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SectionIndicatorComponent } from './components/section-indicator/section-indicator.component';
import { SkillsComponent } from './components/skills/skills.component';
import { KeyboardNavigationService } from './services/keyboard-navigation.service';
import type { LinkedInProfile } from './services/profile.service';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  imports: [
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    SkillsComponent,
    EducationComponent,
    ProjectsComponent,
    CertificationsComponent,
    ContactComponent,
    SectionIndicatorComponent,
    KeyboardShortcutsComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('portfolio');
  protected profileService = inject(ProfileService);
  protected profile = signal<LinkedInProfile | null>(null);
  protected loading = signal(true);
  private keyboardNav = inject(KeyboardNavigationService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  async ngOnInit() {
    try {
      const data = await this.profileService.loadProfile();
      this.profile.set(data);
      this.updatePageMetadata(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private updatePageMetadata(profile: LinkedInProfile): void {
    const name = profile.fullName;
    const headline = profile.headline || 'Developer';

    // Update title
    this.titleService.setTitle(`${name} | ${headline}`);

    // Update meta description
    const description = `Portfolio of ${name} - ${headline} with a passion for building exceptional digital experiences`;
    this.metaService.updateTag({ name: 'description', content: description });
  }

  navigateToSection(sectionId: string): void {
    const sections = this.keyboardNav.getAllSections();
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index !== -1) {
      this.keyboardNav.navigateToSection(index);
    }
  }
}
