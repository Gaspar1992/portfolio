import { test, expect } from '@playwright/test';

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
    const heroSection = page.locator('.hero-section');
    await expect(heroSection).toBeVisible();

    // Check main title is present
    const title = page.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    // Verify navigation buttons
    const experienceButton = page.locator('a[href="#experience"]').first();
    const contactButton = page.locator('a[href="#contact"]').first();
    await expect(experienceButton).toBeVisible();
    await expect(contactButton).toBeVisible();
  });

  test('should navigate to all sections via anchor links', async ({ page }) => {
    // Test About section navigation
    await page.click('a[href="#about"]');
    await expect(page.locator('#about')).toBeInViewport();

    // Test Experience section navigation
    await page.click('a[href="#experience"]');
    await expect(page.locator('#experience')).toBeInViewport();

    // Test Skills section navigation
    await page.click('a[href="#skills"]');
    await expect(page.locator('#skills')).toBeInViewport();

    // Test Projects section navigation
    await page.click('a[href="#projects"]');
    await expect(page.locator('#projects')).toBeInViewport();

    // Test Education section navigation
    await page.click('a[href="#education"]');
    await expect(page.locator('#education')).toBeInViewport();

    // Test Certifications section navigation
    await page.click('a[href="#certifications"]');
    await expect(page.locator('#certifications')).toBeInViewport();

    // Test Contact section navigation
    await page.click('a[href="#contact"]');
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('should display all major content sections', async ({ page }) => {
    // Scroll through each section and verify content
    const sections = [
      { id: 'about', title: 'The Artist' },
      { id: 'experience', title: 'Motion Picture Credits' },
      { id: 'skills', title: 'Technical Repertoire' },
      { id: 'projects', title: 'Featured Productions' },
      { id: 'education', title: 'Academy Training' },
      { id: 'certifications', title: 'Credentials' },
      { id: 'contact', title: 'Get In Touch' },
    ];

    for (const section of sections) {
      const sectionElement = page.locator(`#${section.id}`);
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
    const footer = page.locator('footer');
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
