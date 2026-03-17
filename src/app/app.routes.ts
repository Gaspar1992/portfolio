import type { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { HeroComponent } from './components/hero/hero.component';
import { ProjectsComponent } from './components/projects/projects.component';

export const routes: Routes = [
  { path: '', component: HeroComponent, title: 'Home' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'projects', component: ProjectsComponent, title: 'Projects' },
  { path: 'contact', component: ContactComponent, title: 'Contact' },
  { path: '**', redirectTo: '' },
];
