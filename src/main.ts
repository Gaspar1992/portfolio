import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// GitHub Pages SPA redirect handling
const redirect = sessionStorage.getItem('redirect');
if (redirect) {
  sessionStorage.removeItem('redirect');
  const url = new URL(redirect);
  // Preserve the path for the router to handle
  if (url.pathname !== '/') {
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
