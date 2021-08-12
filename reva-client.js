const util = require('util');
const grpc = require('grpc');
const { GatewayAPIClient } = require('@cs3org/node-cs3apis/cs3/gateway/v1beta1/gateway_api_grpc_pb');
const { AuthenticateRequest, WhoAmIRequest } = require('@cs3org/node-cs3apis/cs3/gateway/v1beta1/gateway_api_pb');
const { ListReceivedOCMSharesRequest } = require('@cs3org/node-cs3apis/cs3/sharing/ocm/v1beta1/ocm_api_pb');
const { GranteeType } = require('@cs3org/node-cs3apis/cs3/storage/provider/v1beta1/resources_pb');

// Specifies the name of the Reva access token used during requests.
// Align this string with the server expects, in the case of revad see:
// https://github.com/cs3org/reva/blob/v1.11.0/pkg/token/token.go#L30
const TOKEN_HEADER = 'x-access-token';

function promisifyMethods(instance, methodNames) {
  const result = {};
  methodNames.forEach(methodName => {
    result[methodName] = util.promisify(instance[methodName].bind(instance));
  });
  return result;
}

module.exports = class RevaClient {
  grpcClient
  metadata
  host
  username
  password
  constructor(host, username, password) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.authenticated = false;
  }

  async ensureConnected() {
    if (this.grpcClient) {
      return
    }
    this.grpcClient = promisifyMethods(new GatewayAPIClient(this.host, grpc.credentials.createInsecure()), [
      'authenticate',
      'listReceivedOCMShares',
      'whoAmI'
    ]);
    this.metadata = new grpc.Metadata();
    const req = new AuthenticateRequest();
    req.setType('basic');
    req.setClientId(this.username);
    req.setClientSecret(this.password);
    const res = await this.grpcClient.authenticate(req);
  
    // See AuthenticateResponse https://github.com/cs3org/cs3apis/blob/a86e5cb6ac360/cs3/gateway/v1beta1/gateway_api.proto#L415
    const user = res.getUser();
    // * User https://github.com/cs3org/cs3apis/blob/a86e5cb6ac360/cs3/identity/user/v1beta1/resources.proto#L53
    const displayName = user.getDisplayName();
    console.log('DisplayName from AuthenticateResponse:', displayName);
  
    // add the token to the metadata for subsequent client calls
    const token = res.getToken();
    this.metadata.add(TOKEN_HEADER, token);
  }

  async listReceivedOCMShares() {
    await this.ensureConnected();
    const req = new ListReceivedOCMSharesRequest();
    // req.setToken(token);
    const shares = await this.grpcClient.listReceivedOCMShares(req, this.metadata);
    shares.getSharesList().forEach(share => {
      let idp, opaque;
      if (share.getShare().getGrantee().getType() == GranteeType.GRANTEE_TYPE_USER) {
        // console.log(share);

        idp, opaque = share.getShare().getGrantee().getUserId().getIdp(), share.getShare().getGrantee().getUserId().getOpaqueId();
      } else if (share.getShare().getGrantee().getType() == GranteeType.GRANTEE_TYPE_GROUP) {
        idp, opaque = share.getShare().getGrantee().getGroupId().getIdp(), share.getShare().getGrantee().getGroupId().getOpaqueId();
      }
      console.log('share', [
        share.getShare().getId().getOpaqueId(),
        share.getShare().getOwner().getIdp(),
        share.getShare().getOwner().getOpaqueId(),
        share.getShare().getResourceId().getOpaqueId(),
        share.getShare().getResourceId().getStorageId(),
        share.getShare().getPermissions().getReshare(),
        share.getShare().getGrantee().getType(),
        idp,
        opaque,
        new Date(share.getShare().getCtime().getSeconds()),
        new Date(share.getShare().getMtime().getSeconds()),
        share.getState()
        ]);  
    });
  }
  
  async updateReceivedOCMShares(shareReference, newState) {
    await this.ensureConnected();
    const req = new UpdateReceivedOCMSharesRequest();
    req.setShareReference(shareReference);
    req.setState(newState);

    const res = await this.grpcClient.updateReceivedOCMShare(req, this.metadata);
    // console.log('updated', res);
  }
}


// const permFuncs = [
  // 'getAddGrant',
  // 'getCreateContainer',
  // 'getDelete',
  // 'getGetPath',
  // 'getGetQuota',
  // 'getInitiateFileDownload',
  // 'getInitiateFileUpload',
  // 'getListGrants',
  // 'getListContainer',
  // 'getListFileVersions',
  // 'getMove',
  // 'getRemoveGrant',
  // 'getPurgeRecycle',
  // 'getRestoreFileVersion',
  // 'getRestoreRecycleItem',
  // 'getStat',
  // 'getUpdateGrant',
  // 'getDenyGrant'
// ];