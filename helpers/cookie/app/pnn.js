const puppeteer = require("puppeteer");

const GUI_TYPE_OWNCLOUD = 'GUI ownCloud';
const GUI_TYPE_NEXTCLOUD = 'GUI Nextloud';
const GUI_TYPE_SEAFILE = 'GUI Seafile';

class User {
  constructor({ serverRoot, guiType, username, password }) {
    this.serverRoot = serverRoot;
    this.guiType = guiType;
    this.username = username;
    this.password = password;
  }
  async init() {
    this.browser = await puppeteer.launch({ headless: false });
    this.context = this.browser.defaultBrowserContext();
    this.context.overridePermissions(/* browser origin */ undefined, ['clipboard-read']);
    this.page = await this.browser.newPage();
  }
  async login(fromCurrentPage) {
    const commonSteps = async ()=> {
      if (!fromCurrentPage) {
        const loginUrl = `${this.serverRoot}/login`;
        await this.page.goto(loginUrl);
      }
      console.log('on', this.page.url());
      await this.type('#user', this.username);
      await this.type('#password', this.password);
    };

    if (this.guiType === GUI_TYPE_OWNCLOUD) {
      await commonSteps();
      await this.go('input.login');
    } else if (this.guiType === GUI_TYPE_NEXTCLOUD) {
      await commonSteps();
      await this.page.click("#submit-form");
      await this.page.waitForSelector('image.app-icon');
      console.log('logged in');
    } else if (this.guiType === GUI_TYPE_SEAFILE) {
      throw new Error('FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/4');
    } else {
      throw new Error(`GUI type "${this.guiType}" not recognized`);
    }
  }

  async go(selector) {
    await this.page.waitForSelector(selector);
    console.log(`Found ${selector}, clicking`);
    await this.page.click(selector);
  }
  async type(selector, text) {
    await this.page.waitForSelector(selector);
    console.log(`Found ${selector}, typing "${text}"`);
    await this.page.type(selector, text);
  }
  async createPublicLink() {
    if (this.guiType === GUI_TYPE_OWNCLOUD) {
      // FIXME: create public share for the first time
      await this.go('span.icon-public');
      await this.go('li.subtab-publicshare');
      await this.go('span.icon-clippy-dark');
      return this.page.evaluate(() => navigator.clipboard.readText());
    } else if (this.guiType === GUI_TYPE_NEXTCLOUD) {
      const filesUrl = `${this.serverRoot}/apps/files`;
      await this.page.goto(filesUrl);
      // FIXME deal with first-time-use splash screen for Nextcloud Hub
      await this.page.waitForSelector('image.app-icon');
      console.log('on', this.page.url());
      await this.go('a.action-share');

      // FIXME: create public share for the first time
      // await this.go('button.action-item__menutoggle');
      // await this.go('li.new-share-link');
    
      await this.page.waitForSelector('a.sharing-entry__copy');
      console.log('Found a.sharing-entry__copy');
      return this.page.evaluate("document.querySelector('a.sharing-entry__copy').getAttribute('href')");
    } else if (this.guiType === GUI_TYPE_SEAFILE) {
      throw new Error('FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/4');
    } else {
      throw new Error(`GUI type "${this.guiType}" not recognized`);
    }
  }
  async acceptPublicLink(url, remoteGuiType) {
    await this.page.goto(url);
    if (remoteGuiType === GUI_TYPE_OWNCLOUD) {
      await this.go('button#save-button');
      await this.page.type('#remote_address', this.serverRoot);
      await this.page.click('#save-button-confirm');
      console.log('Saved public link (from ownCloud GUI), now at', this.page.url());
    } else if (remoteGuiType === GUI_TYPE_NEXTCLOUD) {
      await this.go('button.menutoggle');
      await this.go('button#save-external-share');
      await this.page.type('#remote_address', `${this.username}@${this.serverRoot}`);
      await this.page.click('#save-button-confirm');
      console.log('Saved public link (from Nextcloud GUI), now at', this.page.url());
    } else if (remoteGuiType === GUI_TYPE_SEAFILE) {
      throw new Error('FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/4');
    } else {
      throw new Error(`Remote GUI type "${remoteGuiType}" not recognized`);
    }
  }
  async acceptShare() {
    if (this.guiType === GUI_TYPE_OWNCLOUD) {
      const sharedWithYouUrl = `${this.serverRoot}/apps/files/?dir=/&view=sharingin`;
      // go to 'shared with you'
      await this.page.goto(sharedWithYouUrl);
      // FIXME: avoid hard-coded timer here:
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log('at', sharedWithYouUrl);
      await this.go('a.action-accept'); 
    } else if (this.guiType === GUI_TYPE_NEXTCLOUD) {
      await this.go('div.notifications-button');
      await this.go('button.action-button.pull-right.primary');    
    } else if (this.guiType === GUI_TYPE_SEAFILE) {
      throw new Error('FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/4');
    } else {
      throw new Error(`GUI type "${this.guiType}" not recognized`);
    }
  }
  async deleteAcceptedShare() {
    if (this.guiType === GUI_TYPE_OWNCLOUD) {
      const sharedWithYouUrl = `${this.serverRoot}/apps/files/?dir=/&view=sharingin`;
      // go to 'shared with you'
      await this.page.goto(sharedWithYouUrl);
      // FIXME: avoid hard-coded timer here:
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log('at', sharedWithYouUrl);
      await this.go('span.icon-more');
      // FIXME: avoid hard-coded timer here:
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await this.go('span.icon-delete');
    } else if (this.guiType === GUI_TYPE_NEXTCLOUD) {
      const sharedWithYouUrl = `${this.serverRoot}/apps/files/?dir=/&view=sharingin`;
        // go to 'shared with you'
        await this.page.goto(sharedWithYouUrl);
        // FIXME: avoid hard-coded timer here:
        await new Promise((resolve) => setTimeout(resolve, 5000));
        // remove the share so the test can be run again
        await this.go('a.action-menu');
        await this.go('li.action-delete-container');
    } else if (this.guiType === GUI_TYPE_SEAFILE) {
      throw new Error('FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/4');
    } else {
      throw new Error(`GUI type "${this.guiType}" not recognized`);
    }
  }

  async exit () {
    console.log('waiting for bit ...');
    await new Promise((resolve) => setTimeout(resolve, 10000));  
    await this.browser.close();
  }
  
}

async function runCreatePublicLink(params) {
  const user = new User(params);
  await user.init();
  await user.login(false);
  const url = await user.createPublicLink();
  await user.exit();
  return url;
}
async function receivePublicLink(params, url, remoteGuiType, logInFirst) {
  const user = new User(params);
  await user.init();
  if (logInFirst) {
    await user.login(false);
    await user.acceptPublicLink(url, remoteGuiType);
  } else {
    await user.acceptPublicLink(url, remoteGuiType);
    await user.login(true);
  }
  await user.acceptShare();
  await user.deleteAcceptedShare();
  await user.exit();  
}

async function run () {
  const params = {
    oc1: {
      serverRoot: 'https://oc1.pdsinterop.net',
      guiType: GUI_TYPE_OWNCLOUD,
      username: 'admin',
      password: 'admin'
    },
    oc2: {
      serverRoot: 'https://oc2.pdsinterop.net',
      guiType: GUI_TYPE_OWNCLOUD,
      username: 'admin',
      password: 'admin'
    },
    nc1: {
      serverRoot: 'https://nc1.pdsinterop.net',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'alice',
      password: 'alice123'
    },
    nc2: {
      serverRoot: 'https://nc2.pdsinterop.net',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'alice',
      password: 'alice123'
    }
  };
  // const oc1Link = await runCreatePublicLink(params.oc1);
  const oc1Link = 'https://oc1.pdsinterop.net/s/XZLUoeka49SgFss';
  // const nc1Link = await runCreatePublicLink(params.nc1);
  const nc1Link = 'https://nc1.pdsinterop.net/s/fq4fWk4xyfqcopZ';

  // console.log('oC -> oC public-link flow, login first');
  // await receivePublicLink(params.oc2, oc1Link, GUI_TYPE_OWNCLOUD, true);
  // console.log('oC-> Nc public-link flow, login first');
  // await receivePublicLink(params.nc2, oc1Link, GUI_TYPE_OWNCLOUD, true);

  // console.log('Nc -> oC public-link flow, login first');
  // await receivePublicLink(params.oc2, nc1Link, GUI_TYPE_NEXTCLOUD, true);

  // console.log('Nc -> Nc public-link flow, login first');
  // await receivePublicLink(params.nc2, nc1Link, GUI_TYPE_NEXTCLOUD, true);

  // FIXME: in oC -> oC it uses OCS instead of OCM and you see a modal where
  // you have to click 'div.oc-dialog button.primary'
  // console.log('oC -> oC public-link flow, login after');
  // await receivePublicLink(params.oc2, oc1Link, GUI_TYPE_OWNCLOUD, false);
  
  // console.log('oC-> Nc public-link flow, login after');
  // await receivePublicLink(params.nc2, oc1Link, GUI_TYPE_OWNCLOUD, false);

  console.log('Nc -> oC public-link flow, login after');
  await receivePublicLink(params.oc2, nc1Link, GUI_TYPE_NEXTCLOUD, false);

  // console.log('Nc -> Nc public-link flow, login after');
  // await receivePublicLink(params.nc2, nc1Link, GUI_TYPE_NEXTCLOUD, false);
}

// ..
run();
