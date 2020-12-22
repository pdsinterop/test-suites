const puppeteer = require("puppeteer");
const solidAuthFetcher = require("solid-auth-fetcher");

const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";
const USERNAME = process.env.USERNAME || "alice";
const PASSWORD = process.env.PASSWORD || "alice123";

async function getCookieNextcloudCompatible() {
  const LOGIN_URL = `${SERVER_ROOT}/login`;
  const FILES_URL = `${SERVER_ROOT}/apps/files`;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(LOGIN_URL);
  console.log('on', LOGIN_URL);
  await page.type("#user", USERNAME);
  await page.type("#password", PASSWORD);
  await page.click("#submit-form");
  await page.waitForSelector('image.app-icon');
  console.log('logged in');
  await page.goto(FILES_URL);
  await page.waitForSelector('image.app-icon');
  console.log('on', FILES_URL);

  async function go(selector) {
    await page.waitForSelector(selector);
    console.log(`Found ${selector}, clicking`);
    await page.click(selector);  
  }
  await go('a.action-share');
  // await go('button.action-item__menutoggle');
  // await go('li.new-share-link');

  await page.waitForSelector('a.sharing-entry__copy');
  console.log('Found a.sharing-entry__copy');
  const link = await page.evaluate("document.querySelector('a.sharing-entry__copy').getAttribute('href')");
  console.log({ link });
  await page.goto(link);

  await go('button.menutoggle');
  await go('button#save-external-share');
  await page.type('#remote_address', 'alice@nc1.pdsinterop.net');
  await page.click('#save-button-confirm');
  await page.waitForSelector('#user');
  await page.type("#user", USERNAME);
  await page.type("#password", PASSWORD);
  await page.click("#submit-form");
  await go('div.notifications-button');
  await go('button.action-button.pull-right.primary');

  await new Promise((resolve) => setTimeout(resolve, 20000));
  const cookies = await page.cookies();
  // console.log(cookies);
  const cookieStr = cookies
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  await browser.close();
  return cookieStr;
}

async function run () {
  let cookie
  if (process.env.SERVER_TYPE === 'nextcloud-server') {
    cookie = await getCookieNextcloudCompatible();
  } else if (process.env.SERVER_TYPE === 'node-solid-server') {
    cookie = await solidAuthFetcher.getNodeSolidServerCookie(SERVER_ROOT, USERNAME, PASSWORD);
  } else if (process.env.SERVER_TYPE === 'php-solid-server') {
    cookie = await solidAuthFetcher.getNodeSolidServerCookie(SERVER_ROOT, USERNAME, PASSWORD);
  }
  console.log(cookie);
}

// ..
run();
