import { expect, test } from '@playwright/test';

/**
 * E2E Responsive Design Tests
 * Verifies mobile and desktop layouts work correctly
 */

test.describe('Responsive Design E2E Tests', () => {
  test('hero section should adapt to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    // Hero section should be visible using data-testid
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();

    // Title should still be readable
    const title = page.locator('h1');
    await expect(title).toBeVisible();

    // Buttons should be accessible using data-testid
    const buttons = page.locator('[data-testid="hero-actions"] button');
    await expect(buttons.first()).toBeVisible();
  });

  test('grid layouts should stack on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#projects');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for lazy loading

    // Project grid should be visible using data-testid
    const projectsSection = page.locator('[data-testid="projects-section"]');
    await expect(projectsSection).toBeVisible();

    // Check that grid adapts (cards should still be visible) using data-testid
    const projectCards = page.locator('[data-testid="project-card"]');
    await expect(projectCards.first()).toBeVisible();
  });

  test('navigation should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');

    // All sections should be navigable
    for (const sectionId of [
      'about',
      'experience',
      'skills',
      'projects',
      'education',
      'certifications',
      'contact',
    ]) {
      const link = page.locator(`a[href="#${sectionId}"]:not(.skip-link)`).first();
      if (await link.isVisible().catch(() => false)) {
        await link.click();
        await expect(page.locator(`section#${sectionId}`)).toBeInViewport();
      }
    }
  });

  test('desktop layout should show full navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 }); // Desktop
    await page.goto('/');

    // Hero section should be visible
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();

    // Navigation should be visible
    const mainNav = page.locator('.main-nav, nav');
    await expect(mainNav).toBeVisible();

    // Content should use full width
    const container = page.locator('.container').first();
    const width = await container.evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(740);
  });

  test('skills grid should be responsive', async ({ page }) => {
    // Mobile: 1 column
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#skills');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for lazy loading

    let skillsSection = page.locator('[data-testid="skills-section"]');
    await expect(skillsSection).toBeVisible();

    // Wait for skills to load
    await page.waitForSelector('[data-testid="skill-item"]', { timeout: 5000 });

    const mobileSkillItems = await page.locator('[data-testid="skill-item"]').count();
    expect(mobileSkillItems).toBeGreaterThan(0);

    // Desktop: 3 columns
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    skillsSection = page.locator('[data-testid="skills-section"]');
    await expect(skillsSection).toBeVisible();

    const desktopSkillItems = await page.locator('[data-testid="skill-item"]').count();
    expect(desktopSkillItems).toBeGreaterThan(0);
  });

  test('education grid should adapt to viewport', async ({ page }) => {
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#education');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for lazy loading

    const educationSection = page.locator('[data-testid="education-section"]');
    await expect(educationSection).toBeVisible();

    // Check education cards are visible using data-testid
    const eduCards = page.locator('[data-testid="education-card"]');
    await expect(eduCards.first()).toBeVisible();

    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.locator('[data-testid="education-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="education-card"]').first()).toBeVisible();
  });

  test('footer should be visible on all viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1280, height: 720, name: 'desktop' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/#contact');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Scroll to bottom to ensure footer is visible
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Use data-testid for footer
      const footer = page.locator('[data-testid="footer"]');
      await expect(footer).toBeVisible();
      await expect(footer).toContainText('THE END');
    }
  });

  test('images should be responsive', async ({ page }) => {
    await page.goto('/#about');

    // Use data-testid for portrait image
    const portraitImage = page.locator(
      '[data-testid="about-portrait-image"], [data-testid="about-portrait-placeholder"]'
    );

    // Check if image exists and is responsive
    if (await portraitImage.isVisible().catch(() => false)) {
      const mobileViewport = { width: 375, height: 667 };
      const desktopViewport = { width: 1280, height: 720 };

      // Mobile size
      await page.setViewportSize(mobileViewport);
      await page.reload();
      await page.waitForLoadState('networkidle');

      const mobileWidth = await portraitImage.evaluate((el) => el.getBoundingClientRect().width);
      expect(mobileWidth).toBeLessThanOrEqual(375);

      // Desktop size
      await page.setViewportSize(desktopViewport);
      await page.reload();
      await page.waitForLoadState('networkidle');

      const desktopWidth = await portraitImage.evaluate((el) => el.getBoundingClientRect().width);
      expect(desktopWidth).toBeGreaterThan(100);
    }
  });
});
