async function bootstrap() {
  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    await import('@angular/compiler');
  }
  const { bootstrapApplication } = await import('@angular/platform-browser');
  const { App } = await import('./app/app');
  const { appConfig } = await import('./app/app.config');

  // GitHub Pages SPA redirect handling
  const redirect = sessionStorage.getItem('redirect');
  if (redirect) {
    sessionStorage.removeItem('redirect');
    const url = new URL(redirect);
    if (url.pathname !== '/') {
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  }

  await bootstrapApplication(App, appConfig);
}

bootstrap().catch((err) => console.error(err));
