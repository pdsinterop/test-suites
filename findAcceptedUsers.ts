import { RevaClient } from './reva-client';

async function tester (senderHost: string, senderUsername: string, senderPassword: string) {
  const sender = new RevaClient(senderHost);
  await sender.login(senderUsername, senderPassword);

  const acceptedUsers = await sender.findAcceptedUsers();
  console.log({ acceptedUsers });
}

// ...
tester('localhost:19000', 'einstein', 'relativity');