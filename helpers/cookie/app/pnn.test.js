const puppeteer = require("puppeteer");

const GUI_TYPE_OWNCLOUD = 'GUI ownCloud';
const GUI_TYPE_NEXTCLOUD = 'GUI Nextloud';
const GUI_TYPE_SEAFILE = 'GUI Seafile';

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
      // FIXME, work around https://github.com/michielbdejong/ocm-test-suite/issues/16 :
      await new Promise((resolve) => setTimeout(resolve, 5000));
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
  async shareWith(shareWithUser, shareWithHost) {
    if (this.guiType === GUI_TYPE_OWNCLOUD) {
      // FIXME: create public share for the first time
      await this.go('span.icon-public');
      await this.go('li.subtab-localshare'); // sic
      await this.type('input.shareWithField', `${shareWithUser}@${shareWithHost}`);
      await this.go('div.share-autocomplete-item');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } else if (this.guiType === GUI_TYPE_NEXTCLOUD) {
      const filesUrl = `${this.serverRoot}/apps/files`;
      await this.page.goto(filesUrl);
      // FIXME deal with first-time-use splash screen for Nextcloud Hub
      await this.page.waitForSelector('image.app-icon');
      console.log('on', this.page.url());
      await this.go('a.action-share');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log('will type into', 'div.multiselect__tags input.multiselect__input', `${shareWithUser}@${shareWithHost}`);
      await this.type('div.multiselect__tags input.multiselect__input', `${shareWithUser}@${shareWithHost}`);
      await this.go('span.option__desc--lineone');
      await new Promise((resolve) => setTimeout(resolve, 5000));
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
      // FIXME: avoid hard-coded timer here:
      await new Promise((resolve) => setTimeout(resolve, 5000));
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
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log('at', sharedWithYouUrl);
      await this.go('span.icon-more');
      // FIXME: avoid hard-coded timer here:
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      await this.go('a.action-delete');
    } else if (this.guiType === GUI_TYPE_NEXTCLOUD) {
      const sharedWithYouUrl = `${this.serverRoot}/apps/files/?dir=/&view=sharingin`;
        // go to 'shared with you'
        await this.page.goto(sharedWithYouUrl);
        // FIXME: avoid hard-coded timer here:
        // await new Promise((resolve) => setTimeout(resolve, 5000));
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
    // console.log('waiting for bit ...');
    // await new Promise((resolve) => setTimeout(resolve, 10000));  
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
async function runShareWith(params, shareWithUser, shareWithHost) {
  console.log('1.1');

  const user = new User(params);
  console.log('1.1');
  await user.init();
  console.log('1.2');
  await user.login(false);
  console.log('1.3');
  await user.shareWith(shareWithUser, shareWithHost);
  console.log('1.4');
  await user.exit();
  console.log('1.5');
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
async function receiveShare(params) {
  console.log('2.1');
  const user = new User(params);
  console.log('2.2');
  await user.init();
  console.log('2.3');
  await user.login(false);
  console.log('2.4');
  await user.acceptShare();
  console.log('2.5');
  await user.deleteAcceptedShare();
  console.log('2.6');
  await user.exit();
  console.log('2.7');
}

// ...
[true, false].forEach((loginFirst) => {
  describe(`Public link flow, ${(loginFirst ? 'log in first' : 'log in after')}`, async () => {
    // Known not to work, uses OCS instead of OCM:
    describe.skip('From ownCloud', () => {
      let publicLink;
      let remoteGuiType;
      beforeAll(async () => {
        publicLink = await runCreatePublicLink(params.oc1);
        // publicLink = 'https://oc1.pdsinterop.net/s/XZLUoeka49SgFss';
        remoteGuiType = GUI_TYPE_OWNCLOUD;
      }, 30000);
      it('To ownCloud', async () => {
        await receivePublicLink(params.oc2, publicLink, remoteGuiType, loginFirst);
      }, 30000);
      it('To Nextcloud', async () => {
        await receivePublicLink(params.nc2, publicLink, remoteGuiType, loginFirst);
      }, 30000);
    });

    describe('From Nextcloud', async () => {
      let publicLink;
      let remoteGuiType;
      beforeAll(async () => {
        publicLink = await runCreatePublicLink(params.nc1);
        // publicLink = 'https://nc1.pdsinterop.net/s/fq4fWk4xyfqcopZ';
        remoteGuiType = GUI_TYPE_NEXTCLOUD;
      }, 30000);
      it('To ownCloud', async () => {
        await receivePublicLink(params.oc2, publicLink, remoteGuiType, loginFirst);
      }, 60000);
      it('To Nextcloud', async () => {
        await receivePublicLink(params.nc2, publicLink, remoteGuiType, loginFirst);
      }, 30000);
    });
  });
});

describe('Share With flow', async () => {
  describe('From ownCloud', async () => {
    it('To ownCloud', async () => {
      await runShareWith(params.oc1, params.oc2.username, params.oc2.serverRoot);
      await receiveShare(params.oc2);
      // Not sure why this is necessary (is there an 'await' missing somewhere?):
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }, 60000);
    it('To Nextcloud', async () => {
      await runShareWith(params.oc1, params.nc2.username, params.nc2.serverRoot);
      await receiveShare(params.nc2);
      // Not sure why this is necessary (is there an 'await' missing somewhere?):
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }, 60000);
  });
  describe('From Nextcloud', async () => {
    it('To ownCloud', async () => {
      await runShareWith(params.nc1, params.oc2.username, params.oc2.serverRoot);
      await receiveShare(params.oc2);
      // Not sure why this is necessary (is there an 'await' missing somewhere?):
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }, 60000);
    it('To Nextcloud', async () => {
      await runShareWith(params.nc1, params.nc2.username, params.nc2.serverRoot);
      console.log('runShareWith done');
      await receiveShare(params.nc2);
      console.log('receiveShare done');
      // Not sure why this is necessary (is there an 'await' missing somewhere?):
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }, 60000);
  });
});