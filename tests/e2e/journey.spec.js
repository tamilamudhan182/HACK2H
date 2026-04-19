import { test, expect } from '@playwright/test';

test.describe('Smart Event Companion User Journey', () => {
  test('should load the app and navigate through core features', async ({ page }) => {
    // 1. Visit the app
    await page.goto('/');

    // 2. Check for the login screen (stub mode)
    // Since we initialized Firebase with stubs, the AuthGuard will show the login prompt if not authenticated
    const loginButton = page.locator('button:has-text("Continue with Google")');
    await expect(loginButton).toBeVisible();
    
    // 3. Perform login
    await loginButton.click();

    // 4. Verify main tab visibility
    await expect(page.getByRole('heading', { name: /Hi, .*/ })).toBeVisible();

    // 5. Navigate to Heatmap
    await page.click('a[aria-label="Heatmap"]');
    await expect(page).toHaveURL(/.*heatmap/);
    await expect(page.getByRole('heading', { name: 'Live Stadium Heatmap' })).toBeVisible();

    // 6. Navigate to Wallet
    await page.click('a[aria-label="Wallet"]');
    await expect(page).toHaveURL(/.*wallet/);
    await expect(page.getByText('Digital Access Pass')).toBeVisible();

    // 7. Verify Demo Banner
    await expect(page.locator('div[role="banner"]')).toContainText('⚡ DEMO MODE');
  });
});
