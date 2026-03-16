import { Component, signal, inject, type OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ProfileService } from "./services/profile.service";
import type { LinkedInProfile } from "./services/profile.service";
import { HeroComponent } from "./components/hero/hero.component";
import { AboutComponent } from "./components/about/about.component";
import { ExperienceComponent } from "./components/experience/experience.component";
import { SkillsComponent } from "./components/skills/skills.component";
import { EducationComponent } from "./components/education/education.component";
import { ProjectsComponent } from "./components/projects/projects.component";
import { CertificationsComponent } from "./components/certifications/certifications.component";
import { ContactComponent } from "./components/contact/contact.component";

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    SkillsComponent,
    EducationComponent,
    ProjectsComponent,
    CertificationsComponent,
    ContactComponent
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App implements OnInit {
  protected readonly title = signal("portfolio");
  protected profileService = inject(ProfileService);
  protected profile = signal<LinkedInProfile | null>(null);
  protected loading = signal(true);

  async ngOnInit() {
    try {
      const data = await this.profileService.loadProfile();
      this.profile.set(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      this.loading.set(false);
    }
  }
}
