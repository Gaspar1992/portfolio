import { expect, test } from '@playwright/test';

/**
 * E2E Test: Portfolio Navigation and Content
 * Tests full user journey through the portfolio website
 */

test.describe('Portfolio E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage with hero section', async ({ page }) => {
    // Verify hero section is visible
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();

    // Check main title is present
    const title = page.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    // Verify navigation buttons using data-testid
    const experienceButton = page.locator('[data-testid="hero-experience-link"]');
    const contactButton = page.locator('[data-testid="hero-contact-link"]');
    await expect(experienceButton).toBeVisible();
    await expect(contactButton).toBeVisible();
  });

  test('should navigate to all sections via anchor links', async ({ page }) => {
    const sections = [
      'about',
      'experience',
      'skills',
      'projects',
      'education',
      'certifications',
      'contact',
    ];

    for (const sectionId of sections) {
      // Scroll to top to access navigation
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);

      // Find and click the navigation link (exclude skip-links)
      const link = page.locator(`a[href="#${sectionId}"]:not(.skip-link)`).first();
      await link.click({ force: true });

      // Wait for scroll animation
      await page.waitForTimeout(500);

      // Verify section is in viewport
      const section = page.locator(`section#${sectionId}`);
      await expect(section).toBeVisible();
    }
  });

  test('should display all major content sections', async ({ page }) => {
    // Scroll through each section and verify content using data-testid
    const sections = [
      { testid: 'about-section', title: 'The Artist' },
      { testid: 'experience-section', title: 'Motion Picture Credits' },
      { testid: 'skills-section', title: 'Technical Repertoire' },
      { testid: 'projects-section', title: 'Featured Productions' },
      { testid: 'education-section', title: 'Academy Training' },
      { testid: 'certifications-section', title: 'Credentials' },
      { testid: 'contact-section', title: 'Get In Touch' },
    ];

    for (const section of sections) {
      const sectionElement = page.locator(`[data-testid="${section.testid}"]`);
      await expect(sectionElement).toBeVisible();

      const sectionTitle = sectionElement.locator('h2');
      await expect(sectionTitle).toContainText(section.title);
    }
  });

  test('should have working contact links', async ({ page }) => {
    // Navigate to contact section
    await page.goto('/#contact');
    await page.waitForLoadState('networkidle');

    // Check email link
    const emailLink = page.locator('a[href^="mailto:"]').first();
    if (await emailLink.isVisible().catch(() => false)) {
      await expect(emailLink).toHaveAttribute('href', /^mailto:/);
    }

    // Check LinkedIn link
    const linkedinLink = page.locator('a[href*="linkedin.com"]').first();
    if (await linkedinLink.isVisible().catch(() => false)) {
      await expect(linkedinLink).toHaveAttribute('target', '_blank');
      await expect(linkedinLink).toHaveAttribute('rel', /noopener/);
    }

    // Check GitHub link
    const githubLink = page.locator('a[href*="github.com"]').first();
    if (await githubLink.isVisible().catch(() => false)) {
      await expect(githubLink).toHaveAttribute('target', '_blank');
    }
  });

  test('should have proper footer content', async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('THE END');
  });

  test('should maintain Art Deco styling throughout', async ({ page }) => {
    // Check for Art Deco color scheme - gold accent color
    const goldElement = page.locator('.divider-icon, .btn-deco').first();
    await expect(goldElement).toBeVisible();

    // Check for decorative elements
    const decoElements = page.locator('.card-deco, .divider-deco, .corner-deco');
    await expect(decoElements.first()).toBeVisible();
  });
});
