const puppeteer = require("puppeteer");
const { GUI_TYPE_STUB,
  GUI_TYPE_OWNCLOUD,
  GUI_TYPE_NEXTCLOUD,
  GUI_TYPE_SEAFILE,
  params } = (process.env.LIVE ? require("./params-live") : require("./params-docker"));

const JEST_TIMEOUT = 60000;
const HEADLESS = !!process.env.HEADLESS;
console.log({ HEADLESS });

const flows = [
  'Public link flow, log in first',
  'Public link flow, log in after',
  'Share-with flow'
];
const froms = [
  'From Stub',
  'From ownCloud',
  'From Nextcloud',
  'From Seafile',
];
const tos = [
  'To Stub',
  'To ownCloud',
  'To Nextcloud',
  'To Seafile',
];

class User {
  constructor({ host, guiType, username, password }) {
    this.host = host;
    this.guiType = guiType;
    this.username = username;
    this.password = password;
  }
  async init() {
    if (this.browser) {
      return
    }
    this.browser = true; // claim the semaphore, will be overwritten:
    this.browser = await puppeteer.launch({ headless: HEADLESS, ignoreHTTPSErrors: true });
    this.context = this.browser.defaultBrowserContext();
    this.context.overridePermissions(/* browser origin */ undefined, ['clipboard-read']);
    this.page = await this.browser.newPage();
  }
  async login(fromCurrentPage) {
    const commonSteps = async ()=> {
      if (!fromCurrentPage) {
        const loginUrl = `https://${this.host}/login`;
        await this.page.goto(loginUrl);
      }
      await this.type('#user', this.username);
      await this.type('#password', this.password);
    };

    if (this.guiType === GUI_TYPE_STUB) {
      // nothing to do
    } else if (this.guiType === GUI_TYPE_OWNCLOUD) {
      await commonSteps();
      await this.go('input.login');
      await this.page.waitForNavigation();
    } else if (this.guiType === GUI_TYPE_NEXTCLOUD) {
      await commonSteps();
      await this.page.click("#submit-form");
      await this.page.waitForSelector('image.app-icon');
    } else if (this.guiType === GUI_TYPE_SEAFILE) {
      throw new Error('FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/4');
    } else {
      throw new Error(`GUI type "${this.guiType}" not recognized`);
    }
  }

  async go(selector) {
    await this.page.waitForSelector(selector);
    // console.log('clicking', selector, await this.page.$(selector));
    try {
      await this.page.click(selector);
    } catch (e) {
      // console.error('Could not click!', selector);
    }
  }
  async type(selector, text) {
    await this.page.waitForSelector(selector);
    await this.page.type(selector, text);
  }
  async createPublicLink() {
    if (this.guiType === GUI_TYPE_STUB) {
      return `https://${this.host}/publicLink`;
    } else if (this.guiType === GUI_TYPE_OWNCLOUD) {
      // FIXME: create public share for the first time
      await this.go('span.icon-public');
      await this.go('li.subtab-publicshare');
      await this.go('span.icon-clippy-dark');
      return this.page.evaluate(() => navigator.clipboard.readText());
    } else if (this.guiType === GUI_TYPE_NEXTCLOUD) {
      const filesUrl = `https://${this.host}/apps/files`;
      await this.page.goto(filesUrl);
      // FIXME deal with first-time-use splash screen for Nextcloud Hub
      await this.page.waitForSelector('image.app-icon');
      await this.go('a.action-share');

      // FIXME: create public share for the first time
      // await this.go('button.action-item__menutoggle');
      // await this.go('li.new-share-link');

      await this.page.waitForSelector('a.sharing-entry__copy');
      return this.page.evaluate("document.querySelector('a.sharing-entry__copy').getAttribute('href')");
    } else if (this.guiType === GUI_TYPE_SEAFILE) {
      throw new Error('FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/4');
    } else {
      throw new Error(`GUI type "${this.guiType}" not recognized`);
    }
  }
  async shareWith(shareWithUser, shareWithHost) {
    if (this.guiType === GUI_TYPE_STUB) {
      const consumer = encodeURIComponent(`${shareWithUser}@${shareWithHost}`);
      await this.page.goto(`https://${this.host}/shareWith?${consumer}`);
    } else if (this.guiType === GUI_TYPE_OWNCLOUD) {
      await this.go('span.icon-public');
      await this.go('li.subtab-localshare'); // sic
      await this.type('input.shareWithField', `${shareWithUser}@${shareWithHost}`);
      const exists = await this.page.$(`li[data-share-with=\'${shareWithUser}@${shareWithHost}\']`);
      // console.log({ exists });
      if (exists === null) {
        await this.go('div.share-autocomplete-item');
        await this.page.waitForSelector(`li[data-share-with=\'${shareWithUser}@${shareWithHost}\']`);
      }
    } else if (this.guiType === GUI_TYPE_NEXTCLOUD) {
      const filesUrl = `https://${this.host}/apps/files`;
      await this.page.goto(filesUrl);
      // FIXME deal with first-time-use splash screen for Nextcloud Hub
      await this.page.waitForSelector('image.app-icon');
      await this.go('a.action-share');
      // Careful that it types into the top multiselect input and not the bottom one:
      // FIXME: Find a nicer way to do this:
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await this.type('div.multiselect__tags input.multiselect__input', `${shareWithUser}@https://${shareWithHost}`);
      await this.go('span.option__desc--lineone');
    } else if (this.guiType === GUI_TYPE_SEAFILE) {
      throw new Error('FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/4');
    } else {
      throw new Error(`GUI type "${this.guiType}" not recognized`);
    }
  }
  async acceptPublicLink(url, remoteGuiType) {
    await this.page.goto(url);
    if (remoteGuiType === GUI_TYPE_STUB) {
      const consumer = encodeURIComponent(`${this.username}@https://${this.host}`);
      const newUrl = new URL(`?saveTo=${consumer}`, url).toString();
      // console.log('accepting public link', newUrl);
      await this.page.goto(newUrl);
    } else if (remoteGuiType === GUI_TYPE_OWNCLOUD) {
      await this.go('button#save-button');
      await this.page.type('#remote_address', this.host);
      await this.page.click('#save-button-confirm');
    } else if (remoteGuiType === GUI_TYPE_NEXTCLOUD) {
      await this.go('button.menutoggle');
      await this.go('button#save-external-share');
      await this.page.type('#remote_address', `${this.username}@https://${this.host}`);
      await this.page.click('#save-button-confirm');
    } else if (remoteGuiType === GUI_TYPE_SEAFILE) {
      throw new Error('FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/4');
    } else {
      throw new Error(`Remote GUI type "${remoteGuiType}" not recognized`);
    }
  }

  // Common GUI flow between ownCloud and Nextcloud:
  async acceptNotifications(notifsSelector, buttonSelector, doneSelector) {
    // console.log('clicking notifications');
    await this.go(notifsSelector);
    // console.log('waiting for accept button');
    await this.page.waitForSelector(buttonSelector);
    let buttonsLeft;
    do {
      try {
        await this.page.click(buttonSelector);
      } catch (e) {
        // console.error('Could not click', buttonSelector, await this.page.$(buttonSelector));
      }
      buttonsLeft = await this.page.$(buttonSelector);
      // console.log({ buttonsLeft });
    } while (false); //buttonsLeft !== null);
    // console.log('waiting for empty notifications');
    await this.page.waitForSelector(doneSelector);
    // console.log('acceptNotifications done');
  }

  async acceptShare() {
    if (this.guiType === GUI_TYPE_STUB) {
      await this.page.goto(`https://${this.host}/acceptShare`);
    } else if (this.guiType === GUI_TYPE_OWNCLOUD) {
      // In ownCloud GUI, there are two ways to accept a share, from the shared-with-you page: ...
      // const sharedWithYouUrl = `https://${this.host}/apps/files/?dir=/&view=sharingin`;
      // await this.page.goto(sharedWithYouUrl);
      // await this.go('a.action-accept');
      // ... or from the notifications:
      await this.acceptNotifications(
        'div.notifications-button',
        'button.notification-action-button.primary',
        'a.nav-icon-sharingin'
      );
    } else if (this.guiType === GUI_TYPE_NEXTCLOUD) {
      await this.acceptNotifications(
        'div.notifications-button',
        'button.action-button.pull-right.primary',
        'div.icon-notifications-dark'
      );
    } else if (this.guiType === GUI_TYPE_SEAFILE) {
      throw new Error('FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/4');
    } else {
      throw new Error(`GUI type "${this.guiType}" not recognized`);
    }
  }

  // Common GUI flow between ownCloud and Nextcloud:
  async deleteShares(sharedWithYouUrl, contextMenuSelector, unshareSelector, doneSelector) {
    await this.page.goto(sharedWithYouUrl);
    // FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/20
    await new Promise(resolve => setTimeout(resolve, 3000));
    while (await this.page.$(contextMenuSelector) !== null) {
      await this.go(contextMenuSelector);
      await this.go(unshareSelector);
      await this.page.waitForSelector(doneSelector);
      await this.page.goto(sharedWithYouUrl);
      // FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/20
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  async deleteAcceptedShare() {
    if (this.guiType === GUI_TYPE_STUB) {
      await this.page.goto(`https://${this.host}/deleteAcceptedShare`);
    } else if (this.guiType === GUI_TYPE_OWNCLOUD) {
      await this.deleteShares(
        `https://${this.host}/apps/files/?dir=/&view=sharingin`,
        'span.icon-more',
        'a.action-delete',
        'div.icon-shared'
      );
    } else if (this.guiType === GUI_TYPE_NEXTCLOUD) {
      await this.deleteShares(
        `https://${this.host}/apps/files/?dir=/&view=sharingin`,
        'a.action-menu',
        'li.action-delete-container',
        'div.icon-shared'
      );
    } else if (this.guiType === GUI_TYPE_SEAFILE) {
      throw new Error('FIXME: https://github.com/michielbdejong/ocm-test-suite/issues/4');
    } else {
      throw new Error(`GUI type "${this.guiType}" not recognized`);
    }
  }

  async exit () {
    if (!this.browser) {
      return
    }
    await this.browser.close();
    this.browser = false; // give back the semaphore
  }
}


flows.forEach((flow) => {
  describe(flow, () => {
    froms.forEach((from) => {
      const tester = () => {
        tos.forEach((to) => {
          if (to === 'To Seafile') {
            // Coming soon
            it.skip(to, () => {});
          } else {
            let fromUser;
            let toUser;
            beforeEach(async () => {
              fromUser = new User(params[from]);
              toUser = new User(params[to]);
              // console.log('init from', flow, from, to);
              await fromUser.init();
              // console.log('init to', flow, from, to);
              await toUser.init();
            }, JEST_TIMEOUT);
            afterEach(async () => {
              // console.log('exit from', flow, from, to);
              await fromUser.exit();
              // console.log('exit to', flow, from, to);
              await toUser.exit();
            }, JEST_TIMEOUT);

            it(to, async () => {
              if (flow === 'Share-with flow') {
                await fromUser.login(false);
                await fromUser.shareWith(params[to].username, params[to].host);

                await toUser.login(false);
                await toUser.acceptShare();
                await toUser.deleteAcceptedShare();
              } else {
                await fromUser.login(false);
                const url = await fromUser.createPublicLink();

                // publicLink = 'https://nc1.pdsinterop.net/s/fq4fWk4xyfqcopZ';
                const remoteGuiType = fromUser.guiType;

                if (flow === 'Public link flow, log in first') {
                  await toUser.login(false);
                  await toUser.acceptPublicLink(url, remoteGuiType);
                } else {
                  await toUser.acceptPublicLink(url, remoteGuiType);
                  await toUser.login(true);
                }
                await toUser.acceptShare();
                await toUser.deleteAcceptedShare();
              }
            }, JEST_TIMEOUT);
          }
        });
      }
      if ((flow !== 'Share-with flow') && (from === 'From ownCloud')) {
        // Known not to work, uses OCS instead of OCM:
        describe.skip(from, tester);
      } else if (from === 'From Seafile') {
        // Coming soon:
        describe.skip(from, tester);
      } else {
        describe(from, tester);
      }
    });
  });
});
