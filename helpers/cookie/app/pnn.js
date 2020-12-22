const puppeteer = require("puppeteer");

async function goPN_(serverRoot, username, password, shareWith) {
  const loginUrl = `${serverRoot}/login`;
  const filesUrl = `${serverRoot}/apps/files`;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  async function go(selector) {
    await page.waitForSelector(selector);
    console.log(`Found ${selector}, clicking`);
    await page.click(selector);
  }

  await page.goto(loginUrl);
  console.log('on', loginUrl);
  await page.type("#user", username);
  await page.type("#password", password);
  await page.click("#submit-form");
  await page.waitForSelector('image.app-icon');
  console.log('logged in');
  await page.goto(filesUrl);
  await page.waitForSelector('image.app-icon');
  console.log('on', filesUrl);

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
  await page.type('#remote_address', shareWith);
  await page.click('#save-button-confirm');
  console.log('waiting for bit ...');
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await browser.close();
}

async function goP_N(serverRoot, username, password) {
  const loginUrl = `${serverRoot}/login`;
  const sharedWithYouUrl = `${serverRoot}/apps/files/?dir=/&view=sharingin`;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  async function go(selector, hover = false) {
    await page.waitForSelector(selector);
    console.log(`Found ${selector}, clicking`);
    if (hover) {
      console.log('Hover start', selector);
      await page.hover(selector);
      console.log('Hover OK', selector);
    }
    await page.click(selector);
  }

  await page.goto(loginUrl);
  console.log('on', loginUrl);
  await page.type("#user", username);
  await page.type("#password", password);
  await page.click("#submit-form");
  await page.waitForSelector('image.app-icon');
  console.log('logged in');
  await go('div.notifications-button');
  await go('button.action-button.pull-right.primary');
  await page.goto(sharedWithYouUrl);
  // FIXME: avoid hard-coded timer here:
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await go('a.action-menu');
  await go('li.action-delete-container');
  
  // go to 'shared with you'
  // remove the share so the test can be run again

  console.log('waiting before closing');
  await new Promise((resolve) => setTimeout(resolve, 20000));  
  await browser.close();
}

async function run () {
  await goPN_('https://nc2.pdsinterop.net', 'alice', 'alice123', 'alice@nc1.pdsinterop.net');
  await goP_N('https://nc1.pdsinterop.net', 'alice', 'alice123');
}

// ..
run();
