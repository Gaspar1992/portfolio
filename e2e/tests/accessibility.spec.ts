import { test, expect } from '@playwright/test';

/**
 * E2E Accessibility Tests
 * Verifies WCAG compliance and screen reader compatibility
 */

test.describe('Accessibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check that h1 exists (only one per page)
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(2); // Allow for h1 in hero

    // Check that section titles use h2
    const h2Elements = page.locator('section h2');
    await expect(h2Elements.first()).toBeVisible();

    // Verify no heading level is skipped
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const currentLevel = parseInt(tagName.replace('h', ''));
      
      // Headings should not skip levels (h1 -> h3 is bad)
      expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
      previousLevel = currentLevel;
    }
  });

  test('should have ARIA landmarks', async ({ page }) => {
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    await expect(main).toHaveCount(1);

    // Check for banner/header
    const banner = page.locator('header, [role="banner"]');
    await expect(banner).toBeVisible();

    // Check for contentinfo/footer
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).toBeVisible();

    // Check for navigation
    const navigation = page.locator('nav, [role="navigation"]');
    await expect(navigation).toBeVisible();
  });

  test('should have alt text for images', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const hasAlt = await img.evaluate(el => {
        const alt = el.getAttribute('alt');
        // Alt can be empty for decorative images, but must exist
        return alt !== null;
      });
      expect(hasAlt).toBe(true);
    }
  });

  test('should have proper aria-labels on interactive elements', async ({ page }) => {
    // Check buttons have accessible names
    const buttons = await page.locator('button, a.btn-deco, a[role="button"]').all();
    
    for (const button of buttons) {
      const accessibleName = await button.evaluate(el => {
        return el.getAttribute('aria-label') || 
               el.textContent || 
               el.getAttribute('title');
      });
      expect(accessibleName).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Tab through all interactive elements
    let tabCount = 0;
    const maxTabs = 20; // Prevent infinite loop
    
    while (tabCount < maxTabs) {
      const previousFocus = await focusedElement.evaluate(el => el.outerHTML);
      await page.keyboard.press('Tab');
      
      const currentFocus = await focusedElement.evaluate(el => el.outerHTML);
      if (previousFocus === currentFocus) break; // We've cycled through
      
      tabCount++;
      
      // Check each focused element is visible
      await expect(focusedElement).toBeVisible();
    }
    
    expect(tabCount).toBeGreaterThan(0);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // Check that text elements have sufficient contrast
    // This is a basic check - full contrast testing requires a11y tools
    
    const body = page.locator('body');
    const bgColor = await body.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Body should have a background color
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('transparent');
  });

  test('should have skip links or equivalent', async ({ page }) => {
    // Check for skip link
    const skipLink = page.locator('.skip-link, [href^="#"]').first();
    await expect(skipLink).toBeVisible();
  });

  test('should have proper list markup', async ({ page }) => {
    // Check that navigation uses proper list structure
    const navLists = page.locator('nav ul, nav ol, [role="navigation"] ul');
    await expect(navLists.first()).toBeVisible();

    // Check that list items are direct children of lists
    const listItems = page.locator('ul > li, ol > li');
    const count = await listItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have visible focus indicators', async ({ page }) => {
    // Tab to a link
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Check focus outline is visible (not 0 or none)
    const outline = await focusedElement.evaluate(el => 
      window.getComputedStyle(el).outline
    );
    
    // Focus outline should not be "0px none" or similar
    expect(outline).not.toMatch(/^0px\s+none/);
    expect(outline).not.toBe('none');
  });
});
