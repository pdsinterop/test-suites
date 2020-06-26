import fetch from "node-fetch";

const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";

describe("The server's authorize endpoint", () => {
  let authorizeEndpoint
  let params

  beforeAll(async () => {
    const configFetchResult = await fetch(
      `${SERVER_ROOT}/.well-known/openid-configuration`
    );
    const body = await configFetchResult.text();
    const configObj = JSON.parse(body);
    authorizeEndpoint = configObj.authorization_endpoint;
    params = {
      response_type: 'id_token code',
      redirect_uri: 'http://localhost:3001/redirect',
      scope: 'openid profile offline_access',
      client_id: 'coolApp',
      code_challenge_method: 'S256',
      code_challenge: 'M3CBok-0kQFc0GUz2YD90cFee0XzTTru3Eaj0Ubm-oc',
      state: '84ae2b48-eb1b-4000-8782-ac1cd748aeb0'
    };
  });

  test("the authorize endpoint is within the system under test", async () => {
    expect(authorizeEndpoint.startsWith(SERVER_ROOT)).toEqual(true);
  });
});