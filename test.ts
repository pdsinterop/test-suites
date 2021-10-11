import { cs3 } from './cs3';
import { makeGenericClientConstructor, credentials, Metadata } from '@grpc/grpc-js';

// Specifies the name of the Reva access token used during requests.
// Align this string with the server expects, in the case of revad see:
// https://github.com/cs3org/reva/blob/v1.11.0/pkg/token/token.go#L30
const TOKEN_HEADER = 'x-access-token';

// const Opaque = cs3.types.v1beta1.Opaque;
// const OpaqueEntry = cs3.types.v1beta1.OpaqueEntry;

// const a = new Opaque();
// const foo = new OpaqueEntry();
// const enc = new TextEncoder(); // always utf-8
// foo.value = enc.encode("bar");
// a.map = { foo };

// console.log(a);

class RevaClient {
  client: cs3.gateway.v1beta1.GatewayAPI;
  metadata: Metadata;
  token: string;
  constructor(host: string) {
    const GrpcClient = makeGenericClientConstructor({}, 'reva');
    const grpcClient = new GrpcClient(
      host,
      credentials.createInsecure()
    )

    const rpcImpl = function(method: any, requestData: any, callback: any): any {
      grpcClient.makeUnaryRequest(
        method.name,
        arg => arg,
        arg => arg,
        requestData,
        callback
      )
    }
    this.metadata = new Metadata();
    this.client = cs3.gateway.v1beta1.GatewayAPI.create(/* see above */ rpcImpl, /* request delimited? */ false, /* response delimited? */ false);
    this.token = "";
  }

  async authenticate(username: string, password: string) {
    const req = new cs3.auth.provider.v1beta1.AuthenticateRequest();
    req.clientId = username;
    req.clientSecret = password;
    const res = await this.client.authenticate(req);

    // See AuthenticateResponse https://github.com/cs3org/cs3apis/blob/a86e5cb6ac360/cs3/gateway/v1beta1/gateway_api.proto#L415
    // * User https://github.com/cs3org/cs3apis/blob/a86e5cb6ac360/cs3/identity/user/v1beta1/resources.proto#L53
    console.log('DisplayName from AuthenticateResponse:', res.user?.displayName);

    // add the token to the metadata for subsequent client calls
    this.metadata.add(TOKEN_HEADER, res.token);
    // one exception is the 'WhoAmI' method, which takes the token as a request parameter
    this.token = res.token;
  }

  async whoAmI(token: string) {
    const req = new cs3.gateway.v1beta1.WhoAmIRequest();
    req.token = this.token;
    const res = await this.client.whoAmI(req /* , this.metadata */);
    console.log('DisplayName from WhoAmIResponse:', res.user?.displayName);
  }
  
  async listReceivedOCMShares() {
    const req = new cs3.sharing.ocm.v1beta1.ListReceivedOCMSharesRequest();
    const res = await this.client.listReceivedOCMShares(req);
    console.log('SharesList from ListReceivedOCMSharesResponse:', res.shares);
  }
}


async function test() {
  const client = new RevaClient('localhost:19000');
  client.authenticate('einstein', 'relativity');
  await client.whoAmI(client.token);
}

// ...
test();
