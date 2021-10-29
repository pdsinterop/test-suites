import puppeteer from "puppeteer";
import { GUI_TYPE_OWNCLOUD } from "../guiTypes";
import { StubClient } from './stub';

export class OwncloudClient extends StubClient {
  FTU_CLOSE_BUTTON: string =  '#closeWizard';
  loginPath: string = '/index.php/login';
  notificationDoneSelector: string = 'a.nav-icon-sharingin';
  contextMenuSelector: string = 'span.icon-more';
  unshareSelector: string = 'a.action-delete';

  constructor({ host, username, password }) {
    super({ host, username, password })
    this.guiType = GUI_TYPE_OWNCLOUD;
  }
  async clickLogin() {
    await this.go('.login-button');
    await this.page.waitForNavigation();
  }
  async login(fromCurrentPage) {
    if (!fromCurrentPage) {
      const loginUrl = `https://${this.host}${this.loginPath}`;
      await this.page.goto(loginUrl);
    }
    await this.type('#user', this.username);
    await this.type('#password', this.password);
    await this.clickLogin();
  }
  async go(selector) {
    console.log('awaiting', selector);
    await this.page.waitForSelector(selector);
    console.log('clicking', selector, await this.page.$(selector));
    try {
      await this.page.click(selector);
    } catch (e) {
      console.error('Could not click!', selector);
    }
  }
  async type(selector, text) {
    await this.page.waitForSelector(selector);
    await this.page.type(selector, text);
  }
  async createPublicLink() {
    // FIXME: create public share for the first time
    await this.go('span.icon-public');
    await this.go('li.subtab-publicshare');
    await this.go('span.icon-clippy-dark');
    return this.page.evaluate(() => navigator.clipboard.readText());
  }
  async forwardInvite(senderIdpName: string, tokenStr: string) {
    throw new Error('invite flow only supported to Reva');
  }
  async shareWith(shareWithUser, shareWithHost) {
    await this.go('span.icon.icon-shared');
    await this.go('li.subtab-localshare'); // sic
    await this.type('input.shareWithField', `${shareWithUser}@${shareWithHost}`);
    const exists = await this.page.$(`li[data-share-with=\'${shareWithUser}@${shareWithHost}\']`);
    // console.log({ exists });
    if (exists === null) {
      await this.go('div.share-autocomplete-item');
      await this.page.waitForSelector(`li[data-share-with=\'${shareWithUser}@${shareWithHost}\']`);
    }
  }
  async acceptPublicLink(url, remoteGuiType) {
    await this.page.goto(url);
    await this.go('button#save-button');
    await this.page.type('#remote_address', this.host);
    await this.page.click('#save-button-confirm');
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
    // In ownCloud GUI, there are two ways to accept a share, from the shared-with-you page: ...
    // const sharedWithYouUrl = `https://${this.host}/apps/files/?dir=/&view=sharingin`;
    // await this.page.goto(sharedWithYouUrl);
    // await this.go('a.action-accept');
    // ... or from the notifications:
    await this.acceptNotifications(
      'div.notifications-button',
      'button.notification-action-button.primary',
      this.notificationDoneSelector
    );
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
    await this.deleteShares(
      `https://${this.host}/apps/files/?dir=/&view=sharingin`,
      this.contextMenuSelector,
      this.unshareSelector,
      'div.icon-shared'
    );
  }
}
