import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AboutComponent } from './components/about/about.component';
import { CertificationsComponent } from './components/certifications/certifications.component';
import { ContactComponent } from './components/contact/contact.component';
import { EducationComponent } from './components/education/education.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { HeroComponent } from './components/hero/hero.component';
import { KeyboardShortcutsComponent } from './components/keyboard-shortcuts/keyboard-shortcuts.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SectionIndicatorComponent } from './components/section-indicator/section-indicator.component';
import { SkillsComponent } from './components/skills/skills.component';
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
    NavigationComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  protected readonly title = signal('portfolio');
  protected profileService = inject(ProfileService);
  protected profile = this.profileService.profile;
  protected loading = signal(true);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  async ngOnInit() {
    try {
      const data = await this.profileService.loadProfile();
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
}
