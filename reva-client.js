const util = require('util');
const grpc = require('grpc');
const { GatewayAPIClient } = require('@cs3org/node-cs3apis/cs3/gateway/v1beta1/gateway_api_grpc_pb');
const { AuthenticateRequest } = require('@cs3org/node-cs3apis/cs3/gateway/v1beta1/gateway_api_pb');
const {
  CreateOCMShareRequest,
  ListReceivedOCMSharesRequest,
  UpdateReceivedOCMShareRequest,
  ShareReference,
  SharePermissions,
  ShareGrant,
  ShareId,
} = require('@cs3org/node-cs3apis/cs3/sharing/ocm/v1beta1/ocm_api_pb');
const {
  ProviderInfo,
} = require('@cs3org/node-cs3apis/cs3/ocm/provider/v1beta1/resources_pb');
const {
  GranteeType,
  Grantee,
  ResourceId,
} = require('@cs3org/node-cs3apis/cs3/storage/provider/v1beta1/resources_pb');
const { UserId } = require('@cs3org/node-cs3apis/cs3/identity/user/v1beta1/resources_pb');
const { Code } = require('@cs3org/node-cs3apis/cs3/rpc/v1beta1/code_pb');
const { ShareState } = require('@cs3org/node-cs3apis/cs3/sharing/ocm/v1beta1/resources_pb');

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
      'whoAmI',
      'generateAppPassword',
      'listAppPasswords',
      'invalidateAppPassword',
      'getAppPassword',
      'createContainer',
      'delete',
      'getPath',
      'getQuota',
      'initiateFileDownload',
      'initiateFileUpload',
      'listContainerStream',
      'listContainer',
      'listFileVersions',
      'listRecycleStream',
      'listRecycle',
      'move',
      'purgeRecycle',
      'restoreFileVersion',
      'restoreRecycleItem',
      'stat',
      'createSymlink',
      'setArbitraryMetadata',
      'unsetArbitraryMetadata',
      'createHome',
      'createStorageSpace',
      'listStorageSpaces',
      'updateStorageSpace',
      'deleteStorageSpace',
      'openInApp',
      'createShare',
      'removeShare',
      'getShare',
      'listShares',
      'updateShare',
      'listReceivedShares',
      'updateReceivedShare',
      'getReceivedShare',
      'setKey',
      'getKey',
      'createPublicShare',
      'removePublicShare',
      'getPublicShare',
      'getPublicShareByToken',
      'listPublicShares',
      'updatePublicShare',
      'createOCMShare',
      'removeOCMShare',
      'getOCMShare',
      'listOCMShares',
      'updateOCMShare',
      'listReceivedOCMShares',
      'updateReceivedOCMShare',
      'getReceivedOCMShare',
      'getAppProviders',
      'addAppProvider',
      'listAppProviders',
      'listSupportedMimeTypes',
      'getDefaultAppProviderForMimeType',
      'setDefaultAppProviderForMimeType',
      'getUser',
      'getUserByClaim',
      'getUserGroups',
      'findUsers',
      'getGroup',
      'getGroupByClaim',
      'getMembers',
      'hasMember',
      'findGroups',
      'listAuthProviders',
      'getHome',
      'generateInviteToken',
      'forwardInvite',
      'acceptInvite',
      'getAcceptedUser',
      'findAcceptedUsers',
      'isProviderAllowed',
      'getInfoByDomain',
      'listAllProviders',
      'createOCMCoreShare',
      'createTransfer',
      'getTransferStatus',
      'cancelTransfer'
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
    // console.log(this.grpcClient.prototype);
  }

  async createOCMShare(shareWithUser, shareWithHost) {
    await this.ensureConnected();
    // https://github.com/cs3org/cs3apis/blob/b33d2760f96a4305e269fda72c91b6f6c5374962/cs3/sharing/ocm/v1beta1/ocm_api.proto#L86-L99

    // For readability, indentation here follow data structure nesting:
    const req = new CreateOCMShareRequest();
      const resourceId = new ResourceId();
        resourceId.setStorageId('cernbox.cern.ch');
        resourceId.setOpaqueId('some-file-to-share');
    req.setResourceId(resourceId);
      const shareGrant = new ShareGrant();
        const grantee = new Grantee();
          grantee.setType(GranteeType.GRANTEE_TYPE_USER);
            const userId = new UserId();
              userId.setIdp(shareWithHost);
              userId.setOpaqueId(shareWithUser);
          grantee.setUserId(userId);
      shareGrant.setGrantee(grantee);
        const sharePermissions = new SharePermissions();
      shareGrant.setPermissions(sharePermissions);
    req.setGrant(shareGrant);
      const providerInfo = new ProviderInfo();
        providerInfo.setName('cernbox.cern.ch');
    req.setRecipientMeshProvider(providerInfo);

    // req.setToken(token);
    const res = await this.grpcClient.createOCMShare(req, this.metadata);
    return res;
  }
  async listReceivedOCMShares() {
    await this.ensureConnected();
    const req = new ListReceivedOCMSharesRequest();
    // req.setToken(token);
    const shares = await this.grpcClient.listReceivedOCMShares(req, this.metadata);
    return shares.getSharesList().map(share => {
      let idp, opaque;
      if (share.getShare().getGrantee().getType() == GranteeType.GRANTEE_TYPE_USER) {
        // console.log(share);

        idp, opaque = share.getShare().getGrantee().getUserId().getIdp(), share.getShare().getGrantee().getUserId().getOpaqueId();
      } else if (share.getShare().getGrantee().getType() == GranteeType.GRANTEE_TYPE_GROUP) {
        idp, opaque = share.getShare().getGrantee().getGroupId().getIdp(), share.getShare().getGrantee().getGroupId().getOpaqueId();
      }
      // console.log('share', [
      //   share.getShare().getId().getOpaqueId(),
      //   share.getShare().getOwner().getIdp(),
      //   share.getShare().getOwner().getOpaqueId(),
      //   share.getShare().getResourceId().getOpaqueId(),
      //   share.getShare().getResourceId().getStorageId(),
      //   share.getShare().getPermissions().getReshare(),
      //   share.getShare().getGrantee().getType(),
      //   idp,
      //   opaque,
      //   new Date(share.getShare().getCtime().getSeconds()),
      //   new Date(share.getShare().getMtime().getSeconds()),
      //   share.getState()
      //   ]);
      return share.getShare().getId().getOpaqueId();
    });
  }
  
  async updateReceivedOCMShare(opaqueId, newState) {
    await this.ensureConnected();
    const shareId = new ShareId();
    shareId.setOpaqueId(opaqueId);
    const ref = new ShareReference();
    ref.setId(shareId);
    const field = new UpdateReceivedOCMShareRequest.UpdateField();
    field.setState(newState);
    const req = new UpdateReceivedOCMShareRequest();
    req.setRef(ref);
    req.setField(field);

    const res = await this.grpcClient.updateReceivedOCMShare(req, this.metadata);
    const ok = (res.getStatus().getCode() === Code.CODE_OK);
    // console.log({ ok });
    return ok;
  }

  async acceptShare() {
    const ids = await this.listReceivedOCMShares();
    // console.log({ ids });
    const promises = ids.map(id => {
      return this.updateReceivedOCMShare(id, ShareState.SHARE_STATE_ACCEPTED);
    });
    return Promise.all(promises);
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