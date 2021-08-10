const grpc = require('grpc');
const { GatewayAPIClient } = require('@cs3org/node-cs3apis/cs3/gateway/v1beta1/gateway_api_grpc_pb');
const { AuthenticateRequest } = require('@cs3org/node-cs3apis/cs3/gateway/v1beta1/gateway_api_pb');
const { ListReceivedOCMSharesRequest } = require('@cs3org/node-cs3apis/cs3/sharing/ocm/v1beta1/ocm_api_pb');
 


const TARGET = process.env.TARGET || 'localhost:19000';

const client = new GatewayAPIClient(TARGET, grpc.credentials.createInsecure());

function authenticate(authType, clientId, clientSecret) {
  const req = new AuthenticateRequest();
  req.setType(authType);
  req.setClientId(clientId);
  req.setClientSecret(clientSecret);
  return new Promise((resolve, reject) => {
    client.authenticate(req, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

function ocmShareListReceived() {
  const req = new ListReceivedOCMSharesRequest();
  return new Promise((resolve, reject) => {
    client.listReceivedOCMShares(req, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}


async function example() {
  try {
    const res = await authenticate('basic', 'einstein', 'relativity');
    // See:
    // * AuthenticateResponse https://github.com/cs3org/cs3apis/blob/a86e5cb6ac360/cs3/gateway/v1beta1/gateway_api.proto#L415
    // * User https://github.com/cs3org/cs3apis/blob/a86e5cb6ac360/cs3/identity/user/v1beta1/resources.proto#L53
    console.log(res.getUser().getDisplayName());
    const shares = await ocmShareListReceived();
    console.log(shares);
  } catch (e) {
    console.error(e);
  }
}

// ...
example();