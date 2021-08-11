const RevaClient = require('./reva-client');

const client = new RevaClient('localhost:17000', 'marie', 'radioactivity');

client.listReceivedOCMShares();