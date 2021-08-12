
const { ShareState } = require('@cs3org/node-cs3apis/cs3/sharing/ocm/v1beta1/resources_pb');
const RevaClient = require('./reva-client');

const client = new RevaClient('localhost:17000', 'marie', 'radioactivity');

async function go() {
  const ids = await client.listReceivedOCMShares();
  // console.log({ ids });
  const promises = ids.map(id => {
    return client.updateReceivedOCMShare(id, ShareState.SHARE_STATE_ACCEPTED);
  });
  return Promise.all(promises);
}

// ...
go().then(res => console.log(res));