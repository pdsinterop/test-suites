const puppeteer = require('puppeteer');

async function test () {
	const browser = await puppeteer.launch({
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
		ignoreHTTPSErrors: true
	});
	const context = browser.defaultBrowserContext();
	context.overridePermissions(undefined, ['clipboard-read']);
	page = await browser.newPage();
	await page.goto('https://oc1.docker/index.php/login');
	await page.waitForSelector('#user');
	await page.type('#user', 'alice');
	await page.waitForSelector('#password');
	await page.type('#password', 'alice123');
  await page.waitForSelector('.login-button');
  await page.click('.login-button');
  await page.waitForSelector('#close-wizard');
  await page.click('#close-wizard');
} 

// ...
test();