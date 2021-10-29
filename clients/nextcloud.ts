import puppeteer from "puppeteer";
import { GUI_TYPE_NEXTCLOUD } from "../guiTypes";
import { OwncloudClient } from './owncloud';

export class NextcloudClient extends OwncloudClient {
  FTU_CLOSE_BUTTON: string =  'button.action-item.action-item--single.header-close.icon-close.undefined';
  notificationDoneSelector: string  = 'div.icon-notifications-dark';
  contextMenuSelector: string = 'a.action-menu';
  unshareSelector: string = 'li.action-delete-container';

  constructor({ host, username, password }) {
    super({ host, username, password });
    this.guiType = GUI_TYPE_NEXTCLOUD;
  }
  async clickLogin() {
    await this.page.click("#submit-form");
    await this.page.waitForSelector('image.app-icon');
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
}
