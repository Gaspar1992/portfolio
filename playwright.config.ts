import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E testing configuration
 * @see https://playwright.dev/docs/test-configuration
 *
 * Browsers:
 * - chromium: siempre ejecuta
 * - firefox: siempre ejecuta
 * - webkit: ejecuta si está disponible (requiere dependencias del sistema en Linux)
 * - Mobile Chrome: siempre ejecuta
 * - Mobile Safari: ejecuta si webkit está disponible
 *
 * Para ejecutar todos los navegadores: PLAYWRIGHT_ALL_BROWSERS=1 npx playwright test
 */

// Detectar si webkit está disponible (en Linux requiere librerías del sistema)
const isWebkitAvailable = (() => {
  if (process.env.PLAYWRIGHT_ALL_BROWSERS === '1') return true;
  if (process.env.CI) return true; // En CI intentamos todos
  // En Linux, webkit a menudo falla sin las dependencias correctas
  if (process.platform === 'linux') {
    // Por defecto, no incluir webkit en Linux a menos que se fuerce
    return process.env.FORCE_WEBKIT === '1';
  }
  return true; // En macOS y Windows webkit suele funcionar
})();

// Configurar proyectos según disponibilidad
const projects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  // Mobile Chrome siempre se ejecuta
  {
    name: 'Mobile Chrome',
    use: { ...devices['Pixel 5'] },
  },
];

// Añadir webkit solo si está disponible
if (isWebkitAvailable) {
  projects.push(
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }
  );
}

export default defineConfig({
  testDir: './e2e',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use */
  reporter: 'html',

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'http://localhost:4200',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects,

  /* Run local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
