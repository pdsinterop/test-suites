import util from 'util';

import { Metadata, credentials } from '@grpc/grpc-js';

import { GatewayAPIClient } from '@cs3org/node-cs3apis/cs3/gateway/v1beta1/gateway_api_grpc_pb';
import { AuthenticateRequest } from '@cs3org/node-cs3apis/cs3/gateway/v1beta1/gateway_api_pb';
import {
  CreateOCMShareRequest,
  ListReceivedOCMSharesRequest,
  UpdateReceivedOCMShareRequest,
} from '@cs3org/node-cs3apis/cs3/sharing/ocm/v1beta1/ocm_api_pb';
import {
  ShareReference,
  SharePermissions,
  ShareGrant,
  ShareId,
  ReceivedShare,
  Share,
// } from '@cs3org/node-cs3apis/cs3/sharing/collaboration/v1beta1/resources_pb';
} from '@cs3org/node-cs3apis/cs3/sharing/ocm/v1beta1/resources_pb';
import {
  ProviderInfo, Service, ServiceEndpoint, ServiceType,
}  from '@cs3org/node-cs3apis/cs3/ocm/provider/v1beta1/resources_pb';
import {
  Opaque,
  OpaqueEntry,
} from '@cs3org/node-cs3apis/cs3/types/v1beta1/types_pb';
import {
  GranteeType,
  Grantee,
  ResourceId,
  ResourcePermissions,
} from '@cs3org/node-cs3apis/cs3/storage/provider/v1beta1/resources_pb';
import { User, UserId } from '@cs3org/node-cs3apis/cs3/identity/user/v1beta1/resources_pb';
import { Code } from '@cs3org/node-cs3apis/cs3/rpc/v1beta1/code_pb';
import { ShareState } from '@cs3org/node-cs3apis/cs3/sharing/ocm/v1beta1/resources_pb';
import { AcceptInviteRequest, FindAcceptedUsersRequest, ForwardInviteRequest, GenerateInviteTokenRequest, GetAcceptedUserRequest } from '@cs3org/node-cs3apis/cs3/ocm/invite/v1beta1/invite_api_pb';
import { InviteToken } from '@cs3org/node-cs3apis/cs3/ocm/invite/v1beta1/resources_pb';
import { GetInfoByDomainRequest } from '@cs3org/node-cs3apis/cs3/ocm/provider/v1beta1/provider_api_pb';

const GRPC_PORT = 19000;

// Specifies the name of the Reva access token used during requests.
// Align this string with the server expects, in the case of revad see:
// https://github.com/cs3org/reva/blob/v1.11.0/pkg/token/token.go#L30
const TOKEN_HEADER = 'x-access-token';

function promisifyMethods(instance: any, methodNames: string[]) {
  // console.log('promisify', Object.keys(instance));
  const result: { [methodName: string]: any } = {};
  methodNames.forEach((methodName: string) => {
    result[methodName] = util.promisify(instance[methodName].bind(instance));
  });
  return result;
}

export class RevaClient {
  grpcClient: any
  metadata: Metadata
  host: string
  authenticated: boolean
  constructor(host: string) {
    this.host = host;
    this.authenticated = false;
    this.metadata = new Metadata();
  }

  async ensureConnected() {
    if (this.grpcClient) {
      return
    }
    this.grpcClient = promisifyMethods(new GatewayAPIClient(`${this.host}:${GRPC_PORT}`, credentials.createInsecure()), [
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
  }
  async login(username: string, password: string) {
    // console.log('in login function');
    await this.ensureConnected();
    // console.log('ensureConnected done');

    const req = new AuthenticateRequest();
    req.setType('basic');
    req.setClientId(username);
    req.setClientSecret(password);
    const res = await this.grpcClient.authenticate(req);
    // console.log('authenticate done');
  
    // See AuthenticateResponse https://github.com/cs3org/cs3apis/blob/a86e5cb6ac360/cs3/gateway/v1beta1/gateway_api.proto#L415
    const user = res.getUser();
    // * User https://github.com/cs3org/cs3apis/blob/a86e5cb6ac360/cs3/identity/user/v1beta1/resources.proto#L53
    // console.log({ host: this.host, username, password });
    const displayName = user.getDisplayName();
    // console.log('DisplayName from AuthenticateResponse:', displayName);
  
    // add the token to the metadata for subsequent client calls
    const token = res.getToken();
    this.metadata.add(TOKEN_HEADER, token);
    // console.log({ username, password, token });
    // console.log(this.grpcClient.prototype);
  }

  async generateInviteToken(): Promise<string> {
    const req = new GenerateInviteTokenRequest();
    const res = await this.grpcClient.generateInviteToken(req, this.metadata);
    const inviteToken = res.getInviteToken();
    return inviteToken.getToken();
  }
  async getInfoByDomain(idpName: string): Promise<ProviderInfo> {
    const req = new GetInfoByDomainRequest();
    req.setDomain(idpName);
    const res = await this.grpcClient.getInfoByDomain(req, this.metadata);
    return res.getProviderInfo();
  }
  
  
  async forwardInviteToken(senderIdpName: string, tokenStr: string): Promise<void> {
    const req = new ForwardInviteRequest();
    const token = new InviteToken();
    token.setToken(tokenStr);
    req.setInviteToken(token);
    const providerInfo = await this.getInfoByDomain(senderIdpName);
    providerInfo.setName(senderIdpName);
    req.setOriginSystemProvider(providerInfo);
    const res = await this.grpcClient.forwardInvite(req, this.metadata);
    console.log(res.toObject());
  }

  async acceptInviteToken(senderHost: string, senderUsername: string, tokenStr: string): Promise<void> {
    const req = new AcceptInviteRequest();
    const token = new InviteToken();
    token.setToken(tokenStr);
    req.setInviteToken(token);
    const userId = new UserId();
    userId.setIdp(senderHost);
    const user = new User();
    user.setUsername(senderUsername);
    req.setRemoteUser(user);
    await this.grpcClient.acceptInvite(req, this.metadata);
  }
  async  findAcceptedUsers(): Promise<any[]> {
    const req = new FindAcceptedUsersRequest();
    const res = await this.grpcClient.findAcceptedUsers(req, this.metadata);
    const userList = await res.getAcceptedUsersList();
    return userList.map((user: any) => user.toObject());
  }

  // async getAccepted(shareWithUser: string, shareWithHost: string): Promise<UserId> {
  //   const userId = new UserId();
  //   userId.setIdp(shareWithHost);
  //   userId.setOpaqueId(shareWithUser);
  //   const req = new GetAcceptedUserRequest();
  //   req.setRemoteUserId(userId);
  //   const res = await this.grpcClient.getAcceptedUser(req, this.metadata);
  //   return res.get...
  // }

  async createOCMShare(shareWithUser: string, shareWithHost: string, filename: string): Promise<void> {
    await this.ensureConnected();
    // https://github.com/cs3org/cs3apis/blob/b33d2760f96a4305e269fda72c91b6f6c5374962/cs3/sharing/ocm/v1beta1/ocm_api.proto#L86-L99

    // For readability, indentation here follow data structure nesting:
    
    const req = new CreateOCMShareRequest();
      var m = new Opaque();
        var permissionsOpaqueEntry = new OpaqueEntry();
        permissionsOpaqueEntry.setDecoder("plain");
        permissionsOpaqueEntry.setValue(Buffer.from("permissions"));
        // see https://stackoverflow.com/a/62709318/680454
        m.getMapMap().set("permissions", permissionsOpaqueEntry);

        var nameOpaqueEntry = new OpaqueEntry();
        nameOpaqueEntry.setDecoder("plain");
        nameOpaqueEntry.setValue(Buffer.from("path/to/the/file/name.txt"));
        m.getMapMap().set("name", nameOpaqueEntry);

        var protocolOpaqueEntry = new OpaqueEntry();
        protocolOpaqueEntry.setDecoder("plain");
        protocolOpaqueEntry.setValue(Buffer.from("normal"));
        m.getMapMap().set("protocol", protocolOpaqueEntry);


        req.setOpaque(m);

        console.log('req.opaque.mapMap', req.toObject()?.opaque?.mapMap);
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
            const resourcePermissions = new ResourcePermissions();
              resourcePermissions.setCreateContainer(true);
          sharePermissions.setPermissions(resourcePermissions);
      shareGrant.setPermissions(sharePermissions);
    req.setGrant(shareGrant);
      // const providerInfo = new ProviderInfo();
      //   providerInfo.setName('cernbox.cern.ch');
      //     const service = new Service();
      //       const endpoint = new ServiceEndpoint();
      //         const serviceType = new ServiceType();
      //         serviceType.setName("OCM");
      //       endpoint.setType(serviceType);
      //       endpoint.setPath("http://localhost:17001/ocm");
      //     service.setEndpoint(endpoint);
      //   providerInfo.setServicesList([ service ]);
      const providerInfo = await this.getInfoByDomain(shareWithHost);
      console.log('recipient mesh provider', providerInfo.toObject());
    req.setRecipientMeshProvider(providerInfo);

    console.log('createOCMShare sending');
    // req.setToken(token);
    const res = await this.grpcClient.createOCMShare(req, this.metadata);
    console.log('createOCMShare sent');
    return res;
  }
  async listReceivedOCMShares() {
    await this.ensureConnected();
    const req = new ListReceivedOCMSharesRequest();
    // req.setToken(token);
    const shares = await this.grpcClient.listReceivedOCMShares(req, this.metadata);
    return shares.getSharesList().map((share: any) => {
      let idp, opaque;
      if (share.getShare().getGrantee().getType() == GranteeType.GRANTEE_TYPE_USER) {
        // console.log(share);

        idp = share.getShare().getGrantee().getUserId().getIdp();
        opaque = share.getShare().getGrantee().getUserId().getOpaqueId();
      } else if (share.getShare().getGrantee().getType() == GranteeType.GRANTEE_TYPE_GROUP) {
        idp = share.getShare().getGrantee().getGroupId().getIdp();
        opaque = share.getShare().getGrantee().getGroupId().getOpaqueId();
      }
      console.log(idp);
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
  
  async updateReceivedOCMShare(opaqueId: string, newState: number) {
    await this.ensureConnected();
    const shareId = new ShareId();
    shareId.setOpaqueId(opaqueId);
    const receivedShare = new ReceivedShare();
      const share = new Share();
      share.setId(shareId);
    receivedShare.setShare(share);
    receivedShare.setState(newState);
    const req = new UpdateReceivedOCMShareRequest();
    req.setShare(receivedShare);

    const res = await this.grpcClient.updateReceivedOCMShare(req, this.metadata);
    const ok = (res.getStatus().getCode() === Code.CODE_OK);
    // console.log({ ok });
    return ok;
  }

  async acceptShare() {
    const ids = await this.listReceivedOCMShares();
    console.log({ ids });
    const promises = ids.map((id: any) => {
      console.log("Accepting share", this.host, id);
      return this.updateReceivedOCMShare(id, ShareState.SHARE_STATE_ACCEPTED);
    });
    return Promise.all(promises);
  }
}


// docker stop revad1.docker ; docker rm revad1.docker ; docker run -d --network=testnet --name=revad1.docker -e HOST=revad1 revad; docker logs -f revad1.docker
// docker stop revad2.docker ; docker rm revad2.docker ; docker run -d --network=testnet --name=revad2.docker -e HOST=revad2 revad; docker logs -f revad2.docker

// docker stop stub1.docker ; docker rm stub1.docker ; docker run -d --network=testnet --name=stub1.docker stub; docker logs -f stub1.docker
// docker stop stub2.docker ; docker rm stub2.docker ; docker run -d --network=testnet --name=stub2.docker stub; docker logs -f stub2.docker


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
