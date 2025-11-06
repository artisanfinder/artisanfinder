import playwright from 'playwright';

async function main() {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5177/');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
}

main();