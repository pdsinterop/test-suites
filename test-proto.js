const util = require('util');
const grpc = require('grpc');
const { GatewayAPIClient } = require('@cs3org/node-cs3apis/cs3/gateway/v1beta1/gateway_api_grpc_pb');
const { AuthenticateRequest, WhoAmIRequest } = require('@cs3org/node-cs3apis/cs3/gateway/v1beta1/gateway_api_pb');
const { ListReceivedOCMSharesRequest } = require('@cs3org/node-cs3apis/cs3/sharing/ocm/v1beta1/ocm_api_pb');

// Specifies the name of the Reva access token used during requests.
// Align this string with the server expects, in the case of revad see:
// https://github.com/cs3org/reva/blob/v1.11.0/pkg/token/token.go#L30
const TOKEN_HEADER = 'x-access-token';

const TARGET = process.env.TARGET || 'localhost:19000';

function promisifyMethods(instance, methodNames) {
  const result = {};
  methodNames.forEach(methodName => {
    result[methodName] = util.promisify(instance[methodName].bind(instance));
  });
  return result;
}

const client = promisifyMethods(new GatewayAPIClient(TARGET, grpc.credentials.createInsecure()), [
  'authenticate',
  'listReceivedOCMShares',
  'whoAmI'
]);

let metadata = new grpc.Metadata();

async function authenticate() {
  const req = new AuthenticateRequest();
  req.setType('basic');
  req.setClientId('einstein');
  req.setClientSecret('relativity');
  const res = await client.authenticate(req);

  // See AuthenticateResponse https://github.com/cs3org/cs3apis/blob/a86e5cb6ac360/cs3/gateway/v1beta1/gateway_api.proto#L415
  const user = res.getUser();
  // * User https://github.com/cs3org/cs3apis/blob/a86e5cb6ac360/cs3/identity/user/v1beta1/resources.proto#L53
  const displayName = user.getDisplayName();
  console.log('DisplayName from AuthenticateResponse:', displayName);

  // add the token to the metadata for subsequent client calls
  const token = res.getToken();
  metadata.add(TOKEN_HEADER, token);
  // one exception is the 'WhoAmI' method, which takes the token as a request parameter
  return token;
}

async function whoAmI(token) {
  const req = new WhoAmIRequest();
  req.setToken(token);
  const res = await client.whoAmI(req /* , metadata */);
  console.log('DisplayName from WhoAmIResponse:', res.getUser().getDisplayName());
}

async function listReceivedOCMShares() {
  const req = new ListReceivedOCMSharesRequest();
  // req.setToken(token);
  const shares = await client.listReceivedOCMShares(req, metadata);
  console.log('SharesList from ListReceivedOCMSharesResponse:', shares.getSharesList());
}

async function example() {
  const token = await authenticate();
  await whoAmI(token);
  await listReceivedOCMShares();
}

// ...
example();