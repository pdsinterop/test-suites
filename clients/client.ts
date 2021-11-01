export abstract class Client {
  guiType: string;
  host: string
  username: string
  password: string
  constructor({ host, username, password }) {
    this.host = host;
    this.username = username;
    this.password = password;
  }
  abstract init(headless: boolean): Promise<void>
  abstract login(fromCurrentPage: boolean): Promise<void>
  abstract createPublicLink(): Promise<string>
  abstract generateInvite(): Promise<string>
  abstract forwardInvite(senderIdpName: string, tokenStr: string): Promise<void>
  abstract shareWith(shareWithUser: string, shareWithHost: string, shareWithDomain: string, shareFromDomain: string): Promise<void>
  abstract acceptPublicLink(url: string, remoteGuiType: string): Promise<void>
  abstract acceptShare() : Promise<void>
  abstract deleteAcceptedShare() : Promise<void>
  abstract exit () : Promise<void>
}