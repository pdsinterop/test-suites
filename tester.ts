import { RevaClient } from './reva-client';

async function tester (senderHost: string, senderUsername: string, senderPassword: string,
                        receiverUsername: string, receiverHost: string, receiverPassword: string) {
  const sender = new RevaClient(senderHost);
  await sender.ensureConnected();
  console.log("Logging in sender", senderHost, senderUsername, senderPassword);
  await sender.login(senderUsername, senderPassword);
  console.log('createOCMShare start');
  await sender.createOCMShare(receiverUsername, receiverHost);

  const receiver = new RevaClient(receiverHost);
  await receiver.ensureConnected();
  console.log("Logging in receiver", receiverHost, receiverUsername, receiverPassword);
  await sender.login(receiverUsername, receiverPassword);
  console.log('createOCMShare start');
  await receiver.acceptShare();
}

// ...
tester('localhost:19000', 'einstein', 'relativity', 'localhost:17000', 'marie', 'radioactivity');