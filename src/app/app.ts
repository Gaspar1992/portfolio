import { Component, inject, type OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ProfileService, type LinkedInProfile } from '@core';
import {
  KeyboardShortcutsComponent,
  NavigationComponent,
  SectionIndicatorComponent,
} from '@layout';
import { AboutComponent } from '@sections/about/about.component';
import { CertificationsComponent } from '@sections/certifications/certifications.component';
import { ContactComponent } from '@sections/contact/contact.component';
import { EducationComponent } from '@sections/education/education.component';
import { ExperienceComponent } from '@sections/experience/experience.component';
import { HeroComponent } from '@sections/hero/hero.component';
import { ProjectsComponent } from '@sections/projects/projects.component';
import { SkillsComponent } from '@sections/skills/skills.component';

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
