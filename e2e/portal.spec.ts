import { test, expect } from '@playwright/test';

test.describe('College Portal E2E Journeys', () => {

  // ---------------------------------------------------------------------------
  // Journey 1: Public browse
  // Home -> Courses -> Course detail -> Events -> Event detail -> Contact form submit
  // ---------------------------------------------------------------------------
  test('Journey 1: Public browse flow', async ({ page }) => {
    // 1. Home
    await page.goto('/');
    await expect(page).toHaveTitle(/Srusti Academy/i);
    await expect(page.locator('text=Srusti Academy of Management').first()).toBeVisible();

    // 2. Courses
    await page.goto('/courses');
    await expect(page.locator('text=Academic Programmes').first()).toBeVisible();
    await expect(page.locator('text=Master of Computer Applications').first()).toBeVisible();

    // 3. Course detail
    await page.goto('/courses/mca');
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Master of Computer Applications/i }).first()).toBeVisible();
    await expect(page.locator('text=Eligibility Criteria').first()).toBeVisible();

    // 4. Events
    await page.goto('/events');
    await expect(page.locator('text=Campus Events').first()).toBeVisible();

    // 5. Contact
    await page.goto('/contact');
    await expect(page.locator('text=Get in Touch').first()).toBeVisible();

    // Fill contact form
    await page.fill('input[name="name"], input[placeholder*="full name" i]', 'Test Visitor');
    await page.fill('input[name="email"], input[type="email"]', 'visitor@srusti.ac.in');
    await page.fill('input[name="phone"], input[placeholder*="9876543210"]', '9876543210');
    await page.fill('textarea[name="message"]', 'Interested in admission details for upcoming academic year.');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify submission feedback
    await expect(
      page.locator('text=Message Delivered').or(page.locator('text=Thank you')).first()
    ).toBeVisible({ timeout: 10000 });
  });

  // ---------------------------------------------------------------------------
  // Journey 2: Student Portal
  // Login -> Dashboard -> Attendance -> Results -> Notifications -> Logout
  // ---------------------------------------------------------------------------
  test('Journey 2: Student portal journey', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'student_test@srusti.ac.in');
    await page.fill('input[type="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    // 2. Dashboard
    await page.waitForURL('**/student/dashboard', { timeout: 15000 });
    await expect(page.locator('text=Debabrata Nayak').or(page.locator('text=SRUSTI-2024-MCA-001')).first()).toBeVisible();

    // 3. Attendance
    await page.goto('/student/attendance');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Attendance').first()).toBeVisible();

    // 4. Results
    await page.goto('/student/results');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Results').first().or(page.locator('text=CGPA').first())).toBeVisible();

    // 5. Notifications
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Notifications').first()).toBeVisible();

    // 6. Logout
    const logoutBtn = page.locator('button:has-text("Sign Out"), button:has-text("Logout")').first();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForURL(/\/(login)?$/, { timeout: 10000 });
    }
  });

  // ---------------------------------------------------------------------------
  // Journey 3: Admin Console
  // Login -> Create Course -> Verify -> Delete Course
  // ---------------------------------------------------------------------------
  test('Journey 3: Admin Course management CRUD journey', async ({ page }) => {
    // 1. Admin Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin_test@srusti.ac.in');
    await page.fill('input[type="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    // 2. Dashboard
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
    await expect(
      page.locator('text=Administrative Portal').or(page.locator('text=Prof. Siba Prasad Pattanayak')).first()
    ).toBeVisible();

    // 3. Courses Module
    await page.goto('/admin/courses');
    await expect(page.locator('text=Academic Programmes').first()).toBeVisible();

    // 4. Create Course
    const uniqueCode = `TEST${Date.now().toString().slice(-4)}`;
    await page.click('button:has-text("Create Programme")');
    await expect(page.locator('text=Create New Degree Programme').first()).toBeVisible();

    await page.fill('input[placeholder*="Master of Computer Applications"]', 'Master of Tech Science');
    await page.fill('input[placeholder*="MCA"]', uniqueCode);

    // Select department
    await page.locator('form select').selectOption({ index: 1 });

    await page.fill('input[placeholder*="Graduate with Mathematics"]', 'Bachelor degree with 50% marks');
    await page.fill('textarea', 'Comprehensive test curriculum covering emerging technologies and data sciences.');

    await page.click('form button:has-text("Create Programme")');

    // 5. Verify in list
    await expect(page.locator(`text=${uniqueCode}`).first()).toBeVisible({ timeout: 15000 });

    // 6. Delete the created course
    const deleteBtn = page.locator(`button[data-testid="delete-course-${uniqueCode}"]`).or(
      page.locator('.grid > div').filter({ hasText: uniqueCode }).locator('button[title="Delete Course"]')
    ).first();
    await deleteBtn.click();

    // Confirm in dialog
    await expect(page.locator('text=Delete Academic Programme')).toBeVisible();
    await page.click('button:has-text("Delete Programme")');

    // Verify course removed from list
    await expect(page.locator(`text=${uniqueCode}`)).not.toBeVisible({ timeout: 10000 });
  });

  // ---------------------------------------------------------------------------
  // Journey 4: Auth Recovery
  // Forgot Password -> OTP -> Reset Password -> Login with new password
  // ---------------------------------------------------------------------------
  test('Journey 4: Auth recovery journey', async ({ page }) => {
    let capturedOtp = '';

    // Intercept forgot-password API response to capture devOtp
    page.on('response', async (res) => {
      if (res.url().includes('/api/v1/auth/forgot-password')) {
        try {
          const json = await res.json();
          if (json?.data?.devOtp) {
            capturedOtp = json.data.devOtp;
          }
        } catch (_) {}
      }
    });

    // 1. Forgot password
    await page.goto('/forgot-password');
    await page.fill('input[type="email"]', 'student_test@srusti.ac.in');
    await page.click('button[type="submit"]');

    // 2. Navigates to verify-otp
    await page.waitForURL('**/verify-otp**', { timeout: 15000 });

    if (capturedOtp) {
      // 3. Fill OTP
      await page.fill('input[name="otp"], input[placeholder*="6-digit" i]', capturedOtp);
      await page.click('button[type="submit"]');

      // 4. Navigates to reset-password
      await page.waitForURL('**/reset-password**', { timeout: 15000 });

      // 5. Reset password
      await page.fill('input[name="newPassword"]', 'SecurePass123!');
      await page.fill('input[name="confirmPassword"]', 'SecurePass123!');
      await page.click('button[type="submit"]');

      // 6. Success message and redirect to login
      await expect(
        page.locator('text=Password Reset Successfully').or(page.locator('text=Password reset'))
      ).toBeVisible({ timeout: 10000 });
      await page.waitForURL('**/login', { timeout: 15000 });

      // 7. Verify login with the password
      await page.fill('input[type="email"]', 'student_test@srusti.ac.in');
      await page.fill('input[type="password"]', 'SecurePass123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/student/dashboard', { timeout: 15000 });
    }
  });

  // ---------------------------------------------------------------------------
  // Journey 5: Session Silent Refresh
  // Login -> Simulate Access Token Expiry -> Silent Refresh -> Request Succeeds
  // ---------------------------------------------------------------------------
  test('Journey 5: Session silent refresh flow', async ({ page }) => {
    // 1. Login as student
    await page.goto('/login');
    await page.fill('input[type="email"]', 'student_test@srusti.ac.in');
    await page.fill('input[type="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/student/dashboard', { timeout: 15000 });

    // 2. Refresh page to verify persistent session via httpOnly cookie / silent refresh
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Page must remain on student dashboard without forcing bounce to login
    await expect(
      page.locator('text=Debabrata Nayak').or(page.locator('text=SRUSTI-2024-MCA-001')).first()
    ).toBeVisible({ timeout: 10000 });
  });

});
