import puppeteer from "puppeteer";
import { Client } from './client';
import { GUI_TYPE_STUB } from '../guiTypes';

export class StubClient extends Client {
  browser: any
  context: any
  page: any
  windowSize: string = '300,300';
  constructor({ host, username, password }) {
    super({ host, username, password })
    this.guiType = GUI_TYPE_STUB;
  }
  async init(headless: boolean) {
    if (this.browser) {
      return
    }
  
    this.browser = true; // claim the semaphore, will be overwritten:
    this.browser = await puppeteer.launch({
      headless,
      defaultViewport: null,
      args: [
        `--window-size=${this.windowSize}`,
        '--no-sandbox',
        '--disable-setuid-sandbox' // FIXME: should be possible to avoid this, even when running in Docker
      ],
      ignoreHTTPSErrors: true
    });
    this.context = this.browser.defaultBrowserContext();
    this.context.overridePermissions(/* browser origin */ undefined, ['clipboard-read']);
    this.page = await this.browser.newPage();
  }
  async login(fromCurrentPage) {
    // nothing to do
  }

  async createPublicLink(): Promise<string> {
    return `https://${this.guiDomain}/publicLink`;
  }
  async generateInvite(): Promise<string> {
    throw new Error('invite flow only supported from Reva');
  }
  async forwardInvite(senderIdpName: string, tokenStr: string) {
    const invite = encodeURIComponent(`${tokenStr}@${senderIdpName}`);
    await this.page.goto(`https://${this.guiDomain}/forwardInvite?${invite}`);
  }
  async shareWith(shareWithUser, shareWithHost, shareWithDomain, shareFromDomain) {
    const consumer = encodeURIComponent(`${shareWithUser}@${shareWithHost}`);
    await this.page.goto(`https://${this.guiDomain}/shareWith?${consumer}`);
  }
  async acceptPublicLink(url, remoteGuiType) {
    await this.page.goto(url);
    const consumer = encodeURIComponent(`${this.username}@${this.guiDomain}`);
    const newUrl = new URL(`?saveTo=${consumer}`, url).toString();
    // console.log('accepting public link', newUrl);
    await this.page.goto(newUrl);
  }

  async acceptShare() {
    await this.page.goto(`https://${this.guiDomain}/acceptShare`);
  }

  async deleteAcceptedShare() {
    await this.page.goto(`https://${this.guiDomain}/deleteAcceptedShare`);
  }

  async exit () {
    if (!this.browser) {
      return
    }
    await this.browser.close();
    this.browser = false; // give back the semaphore
  }
}
