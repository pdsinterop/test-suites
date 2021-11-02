import puppeteer from "puppeteer";
import { Client } from "./clients/client";
import { NextcloudClient } from "./clients/nextcloud";
import { OwncloudClient } from "./clients/owncloud";
import { GUI_TYPE_STUB,
  GUI_TYPE_OWNCLOUD,
  GUI_TYPE_NEXTCLOUD,
  GUI_TYPE_SEAFILE,
  GUI_TYPE_REVA,
} from './guiTypes';
const { params } = (process.env.LIVE ? require("./params-live") : require("./params-docker"));

import { RevaClient } from "./clients/reva";
import { StubClient } from "./clients/stub";

const FLOW_PUBLIC_LOG_IN_FIRST = 'Public link flow, log in first';
const FLOW_PUBLIC_LOG_IN_AFTER = 'Public link flow, log in after';
const FLOW_SHARE_WITH = 'Share-with flow';
const FLOW_INVITE = 'Invite flow';

const IMPL_NEXTCLOUD = 'Nextcloud';
const IMPL_OWNCLOUD = 'ownCloud';
// const IMPL_SEAFILE = 'Seafile';
const IMPL_REVA = 'Reva';
const IMPL_STUB = 'Stub';

const JEST_TIMEOUT = 60000;
const HEADLESS = !!process.env.HEADLESS;
console.log({ HEADLESS });

const flows = {
  // [ FLOW_PUBLIC_LOG_IN_FIRST ]: {
  //   from: [IMPL_NEXTCLOUD, /* IMPL_OWNCLOUD, */ IMPL_STUB],
  //   to: [IMPL_NEXTCLOUD, IMPL_OWNCLOUD, IMPL_STUB]
  // },
  // [ FLOW_PUBLIC_LOG_IN_AFTER ]: {
  //   from: [IMPL_NEXTCLOUD, /* IMPL_OWNCLOUD, */ IMPL_STUB],
  //   to: [IMPL_NEXTCLOUD, IMPL_OWNCLOUD, IMPL_STUB]
  // },
  [ FLOW_SHARE_WITH ]: {
    from: [/* IMPL_OWNCLOUD, IMPL_NEXTCLOUD, */ IMPL_REVA, IMPL_STUB],
    to: [/* IMPL_NEXTCLOUD, IMPL_OWNCLOUD, */ IMPL_REVA, IMPL_STUB ]
  },
  [ FLOW_INVITE ]: {
    from: [IMPL_REVA, /* IMPL_STUB */],
    to: [IMPL_REVA, IMPL_STUB]
  },
};

const CLIENT_TYPES = {
  [GUI_TYPE_OWNCLOUD]: OwncloudClient,
  [GUI_TYPE_NEXTCLOUD]: NextcloudClient,
  [GUI_TYPE_REVA]: RevaClient,
  [GUI_TYPE_STUB]: StubClient,
};

Object.keys(flows).forEach((flow: string) => {
  describe(flow, () => {
    flows[flow].from.forEach((from: string) => {
      describe(`From ${from}`, () => {
        flows[flow].to.forEach((to: string) => {
          let fromUser: Client;
          let toUser: Client;
          beforeEach(async () => {
            console.log('setting up', from, to, Object.keys(params));
            toUser = new CLIENT_TYPES[params[`To ${to}`].guiType](params[`To ${to}`]);
            console.log('init to', flow, from, to);
            await toUser.init(HEADLESS);
            fromUser = new CLIENT_TYPES[params[`From ${from}`].guiType](params[`From ${from}`]);
            console.log('init from', flow, from, to);
            await fromUser.init(HEADLESS);
	    console.log('inited');
          }, JEST_TIMEOUT);
          afterEach(async () => {
            console.log('exit from', flow, from, to);
            await fromUser.exit();
            console.log('exit to', flow, from, to);
            await toUser.exit();
	    console.log('exited');
          }, JEST_TIMEOUT);
          // afterAll(async (done) => {
          //   if (!process.stdout.write('')) {
          //     process.stdout.once('drain', () => { done(); });
          //   }
          // }, JEST_TIMEOUT);

          it(`To ${to}`, async () => {
            if (flow === 'Share-with flow') {
              console.log('fromUser.login', fromUser.host, fromUser.username, fromUser.password);
              await fromUser.login(false);
              console.log('fromUser.shareWith');
              await fromUser.shareWith(params[`To ${to}`].username, params[`To ${to}`].host, params[`To ${to}`].domain, params[`From ${from}`].domain);
              console.log('toUser.login');
              await toUser.login(false);
              console.log('toUser.acceptShare');
              await toUser.acceptShare();
              console.log('toUser.deleteAcceptedShare');
              await toUser.deleteAcceptedShare();
              console.log('done');
            } else if (flow === 'Invite flow') {
              console.log('fromUser.login');
              await fromUser.login(false);
              console.log('fromUser.generateInvite');
              const inviteToken = await fromUser.generateInvite();
              console.log('toUser.login', toUser.host, toUser.username, toUser.password);
              await toUser.login(false);
              console.log('toUser.forwardInvite', params[`From ${from}`].domain, inviteToken);
              await toUser.forwardInvite(params[`From ${from}`].domain, inviteToken);
              console.log('fromUser.shareWith', inviteToken, params[`To ${to}`].host, params[`To ${to}`].domain, params[`From ${from}`].domain);
              await fromUser.shareWith(params[`To ${to}`].username, params[`To ${to}`].host, params[`To ${to}`].domain, params[`From ${from}`].domain);
              console.log('toUser.acceptShare');
              await toUser.acceptShare();
              console.log('toUser.deleteAcceptedShare');
              await toUser.deleteAcceptedShare();
              console.log('done');
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
        });
      });
    });
  });
});
