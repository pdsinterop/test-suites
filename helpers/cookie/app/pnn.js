const puppeteer = require("puppeteer");

async function getBrowser() {
  const browser = await puppeteer.launch({ headless: false });
  const context = browser.defaultBrowserContext();
  context.overridePermissions(/* browser origin */ undefined, ['clipboard-read']);
  return browser;
}
async function loginO(page, serverRoot, username, password) {
  const loginUrl = `${serverRoot}/login`;
  await page.goto(loginUrl);
  console.log('on', loginUrl);
  await page.type("#user", username);
  await page.type("#password", password);
  await page.click("input.login");
}

async function goPO_(serverRoot, username, password, shareWithUser, shareWithHost) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  async function go(selector) {
    await page.waitForSelector(selector);
    console.log(`Found ${selector}, clicking`);
    await page.click(selector);
  }
  async function goCopy(selector) {
    await page.waitForSelector(selector);
    console.log(`Found ${selector}, clicking`);
    await page.click(selector);
    const newUrl = await page.evaluate(() => navigator.clipboard.readText());
    console.log(`Copied ${newUrl} to clipboard`);
    await page.goto(newUrl);
  }

  await loginO(page, serverRoot, username, password);
  // FIXME: create public share for the first time
  await go('span.icon-public');
  await go('li.subtab-publicshare');
  await goCopy('span.icon-clippy-dark');
  await go('button#save-button');
  await page.type('#remote_address', shareWithHost);
  await page.click('#save-button-confirm');
  console.log('waiting for bit ...');
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await browser.close();
}

async function loginN(page, serverRoot, username, password) {
  const loginUrl = `${serverRoot}/login`;
  const filesUrl = `${serverRoot}/apps/files`;
  await page.goto(loginUrl);
  console.log('on', loginUrl);
  await page.type("#user", username);
  await page.type("#password", password);
  await page.click("#submit-form");
  await page.waitForSelector('image.app-icon');
  console.log('logged in');
  await page.goto(filesUrl);
  // FIXME deal with first-time-use splash screen for Nextcloud Hub
  await page.waitForSelector('image.app-icon');
  console.log('on', filesUrl);
}

async function goPN_(serverRoot, username, password, shareWithUser, shareWithHost) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  async function go(selector) {
    await page.waitForSelector(selector);
    console.log(`Found ${selector}, clicking`);
    await page.click(selector);
  }

  await loginN(page, serverRoot, username, password);

  await go('a.action-share');

  // FIXME: create public share for the first time
  // await go('button.action-item__menutoggle');
  // await go('li.new-share-link');

  await page.waitForSelector('a.sharing-entry__copy');
  console.log('Found a.sharing-entry__copy');
  const link = await page.evaluate("document.querySelector('a.sharing-entry__copy').getAttribute('href')");
  console.log({ link });
  await page.goto(link);

  await go('button.menutoggle');
  await go('button#save-external-share');
  await page.type('#remote_address', `${shareWithUser}@${shareWithHost}`);
  await page.click('#save-button-confirm');
  console.log('waiting for bit ...');
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await browser.close();
}

async function goP_O(serverRoot, username, password) {
  const sharedWithYouUrl = `${serverRoot}/apps/files/?dir=/&view=sharingin`;
  const browser = await getBrowser();
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

  await loginO(page, serverRoot, username, password);

  // FIXME: avoid hard-coded timer here:
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // go to 'shared with you'
  await page.goto(sharedWithYouUrl);
  await go('a.action-accept');

  // remove the share so the test can be run again
  // TODO:
  // click ...
  // click Unshare

  console.log('waiting before closing');
  await new Promise((resolve) => setTimeout(resolve, 20000));
  await browser.close();
}

async function goP_N(serverRoot, username, password) {
  const sharedWithYouUrl = `${serverRoot}/apps/files/?dir=/&view=sharingin`;
  const browser = await getBrowser();
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

  await loginN(page, serverRoot, username, password);
  await go('div.notifications-button');
  await go('button.action-button.pull-right.primary');
  // go to 'shared with you'
  await page.goto(sharedWithYouUrl);
  // FIXME: avoid hard-coded timer here:
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // remove the share so the test can be run again
  await go('a.action-menu');
  await go('li.action-delete-container');

  console.log('waiting before closing');
  await new Promise((resolve) => setTimeout(resolve, 20000));  
  await browser.close();
}

async function run () {
  // await goPO_('https://oc1.pdsinterop.net', 'admin', 'admin', 'admin', 'oc2.pdsinterop.net');
  // await goPN_('https://nc1.pdsinterop.net', 'alice', 'alice123', 'admin', 'oc2.pdsinterop.net');
  await goPN_('https://nc1.pdsinterop.net', 'alice', 'alice123', 'alice', 'nc2.pdsinterop.net');
  // await goP_O('https://oc2.pdsinterop.net', 'admin', 'admin');
  await goP_N('https://nc2.pdsinterop.net', 'alice', 'alice123');
}

// ..
run();
