import { expect, test } from '@jupyterlab/galata';

/**
 * Don't load JupyterLab webpage before running the tests.
 * This is required to ensure we capture all log messages.
 */
test.use({ autoGoto: false });

test('top bar start-stop transport', async ({ page }) => {
  await page.goto();

  const playButton = page
    .locator('#jp-daw-topbar')
    .getByRole('button', { name: 'start transport' });
  const pauseButton = page
    .locator('#jp-daw-topbar')
    .getByRole('button', { name: 'pause transport' });
  const stopButton = page
    .locator('#jp-daw-topbar')
    .getByRole('button', { name: 'stop transport' });
  const transportPositionInput = page
    .locator('#jp-daw-topbar')
    .getByRole('textbox');

  // initial state
  await expect(transportPositionInput).toHaveValue('0:0:0');
  await expect(transportPositionInput).not.toBeDisabled();

  // play
  await playButton.click();
  await expect(transportPositionInput).toBeDisabled();
  await page.waitForTimeout(500);
  await expect(transportPositionInput).not.toHaveValue('0:0:0');

  // pause
  await pauseButton.click();
  await expect(transportPositionInput).not.toBeDisabled();
  await expect(transportPositionInput).not.toHaveValue('0:0:0');

  // stop
  await stopButton.click();
  await expect(transportPositionInput).not.toBeDisabled();
  await expect(transportPositionInput).toHaveValue('0:0:0');
});
