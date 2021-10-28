import puppeteer from "puppeteer";
import { GUI_TYPE_NEXTCLOUD } from "../guiTypes";
import { OwncloudClient } from './owncloud';

export class NextcloudClient extends OwncloudClient {
  constructor({ host, username, password }) {
    super({ host, username, password });
    this.guiType = GUI_TYPE_NEXTCLOUD;
  }
  async login(fromCurrentPage) {
    if (!fromCurrentPage) {
      const loginUrl = `https://${this.host}/login`;
      await this.page.goto(loginUrl);
    }
    await this.type('#user', this.username);
    await this.type('#password', this.password);
    await this.page.click("#submit-form");
    await this.page.waitForSelector('image.app-icon');
    setInterval(async () => {
      const FTU_CLOSE_BUTTON = 'button.action-item.action-item--single.header-close.icon-close.undefined';
      const elt = await this.page.$(FTU_CLOSE_BUTTON);
      if (elt) {
        console.log(`Closing FTU on ${this.host}`)
        await this.page.click(FTU_CLOSE_BUTTON);
      } else {
        console.log('No FTU on ${this.host}')
      }
    }, 5000);
  }

  async createPublicLink() {
    const filesUrl = `https://${this.host}/apps/files/?dir=/&openfile=15`; // select nextcloud.png file
    await this.page.goto(filesUrl);

    await this.page.waitForSelector('image.app-icon');
    await this.go('a#sharing');
    const CREATE_PUBLIC_LINK_BUTTON = 'button.new-share-link';
    const elt = await this.page.$(CREATE_PUBLIC_LINK_BUTTON);
    if (elt) {
      await this.page.click(CREATE_PUBLIC_LINK_BUTTON);
    }
    // await this.go('button.action-item__menutoggle');
    // await this.go('li.new-share-link');

    await this.page.waitForSelector('a.sharing-entry__copy');
    return this.page.evaluate("document.querySelector('a.sharing-entry__copy').getAttribute('href')");
  }
  async shareWith(shareWithUser, shareWithHost) {
    const filesUrl = `https://${this.host}/apps/files`;
    await this.page.goto(filesUrl);
    // FIXME deal with first-time-use splash screen for Nextcloud Hub
    await this.page.waitForSelector('image.app-icon');
    await this.go('a.action-share');
    // Careful that it types into the top multiselect input and not the bottom one:
    // FIXME: Find a nicer way to do this:
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.type('div.multiselect__tags input.multiselect__input', `${shareWithUser}@${shareWithHost}`);
    await this.go('span.option__desc--lineone');
  }
  async acceptPublicLink(url, remoteGuiType) {
    await this.page.goto(url);
    await this.go('button.menutoggle');
    await this.go('button#save-external-share');
    await this.page.type('#remote_address', `${this.username}@${this.host}`);
    await this.page.click('#save-button-confirm');
  }

  async acceptShare() {
    await this.acceptNotifications(
      'div.notifications-button',
      'button.action-button.pull-right.primary',
      'div.icon-notifications-dark'
    );
  }

  async deleteAcceptedShare() {
    await this.deleteShares(
      `https://${this.host}/apps/files/?dir=/&view=sharingin`,
      'a.action-menu',
      'li.action-delete-container',
      'div.icon-shared'
    );
  }
}
