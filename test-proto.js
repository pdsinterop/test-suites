const RevaClient = require('./reva-client');

const client = new RevaClient('localhost:19000', 'einstein', 'relativity');

client.listReceivedOCMShares();