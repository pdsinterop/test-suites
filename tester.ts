import { RevaClient } from './reva-client';
const SENDER = {
  idp: 'cernbox.cern.ch',
  // host: 'localhost:19000',
  host: 'revad1.docker',
  username: 'einstein',
  password: 'relativity',
};

const RECEIVER = {
  idp: 'cesnet.cz',
  // host: 'localhost:17000',
  host: 'stub2.docker',
  username: 'marie',
  password: 'radioactivity',
};

async function tester () {
  const sender = new RevaClient(SENDER.host);
  // await sender.ensureConnected();
  console.log("Logging in sender", SENDER.host, SENDER.username, SENDER.password);
  await sender.login(SENDER.username, SENDER.password);

  // const receiver = new RevaClient(RECEIVER.host);
  // await receiver.ensureConnected();
  // console.log("Logging in receiver", RECEIVER.host, RECEIVER.username, RECEIVER.password);
  // await receiver.login(RECEIVER.username, RECEIVER.password);

  // const inviteToken = await sender.generateInviteToken();
  // console.log({ inviteToken });
  // await receiver.forwardInviteToken(SENDER.idp, inviteToken);
  // console.log('token forwarded');
  // await receiver.acceptInviteToken(SENDER.host, SENDER.username, inviteToken);
  // console.log('token accepted');

  const acceptedUsers = await sender.findAcceptedUsers();
  if (acceptedUsers.length !== 1) {
    console.log("acceptedUsers.length", acceptedUsers.length);
    return
  }
  const shareWithUser = acceptedUsers[0].id.opaqueId;
  const shareWithHost = acceptedUsers[0].id.idp;
  // console.log(JSON.stringify(acceptedUsers, null, 2));
  

  // console.log('listReceivedOCMShares start');
  // const senderList = await sender.listReceivedOCMShares();
  // console.log('listReceivedOCMShares finish', senderList);

  console.log('createOCMShare start');
  await sender.createOCMShare(shareWithUser, shareWithHost, '/home', SENDER.idp);
  console.log('createOCMShare finish');


  // console.log('listReceivedOCMShares start');
  // const receiverList1 = await receiver.listReceivedOCMShares();
  // console.log('listReceivedOCMShares finish', receiverList1);

  // console.log('acceptShare start');
  // await receiver.acceptShare();
  // console.log('acceptShare finish');

  // console.log('listReceivedOCMShares start');
  // const receiverList2 = await receiver.listReceivedOCMShares();
  // console.log('listReceivedOCMShares finish', receiverList1);


}

// ...
tester();