import fetch from "node-fetch";

const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";
const LOGIN_URL = `${SERVER_ROOT}/login/password`;

async function getCookie() {
  const result = await fetch("https://localhost/login/password", {
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    },
    "body": "username=alice&password=123",
    "method": "POST",
    "redirect": "manual"
  });
  return result.headers.get('set-cookie');
}

describe("The server's authorize endpoint", () => {
  let authorizeUrl

  beforeAll(async () => {
    const configFetchResult = await fetch(
      `${SERVER_ROOT}/.well-known/openid-configuration`
    );
    const body = await configFetchResult.text();
    const configObj = JSON.parse(body);
    const authorizeEndpoint = configObj.authorization_endpoint;
    const params = [
      [ 'response_type', 'id_token code'],
      [ 'redirect_uri', 'http://localhost:3001/redirect'],
      [ 'scope', 'openid profile offline_access'],
      [ 'client_id', 'coolApp'],
      [ 'code_challenge_method', 'S256'],
      [ 'code_challenge', 'M3CBok-0kQFc0GUz2YD90cFee0XzTTru3Eaj0Ubm-oc'],
      [ 'state', '84ae2b48-eb1b-4000-8782-ac1cd748aeb0']
    ];
    const paramsStr = params.map(arr => `${encodeURIComponent(arr[0])}=${encodeURIComponent(arr[1])}`).join('&');
    authorizeUrl = `${authorizeEndpoint}?${paramsStr}`;
    const loginParams = {
      
    };
  });

  test("the authorize endpoint is within the system under test", async () => {
    expect(authorizeUrl.startsWith(SERVER_ROOT)).toEqual(true);
  });

  test.skip("the authorize URL without cookie presents a login form", async () => {
    const fetchResult = await fetch(authorizeUrl);
    expect(fetchResult.status).toEqual(200);
    const body = await fetchResult.text();
    expect(body.indexOf("form")).not.toEqual(-1);
  });

  test("the authorize URL without cookie presents a login form", async () => {
    const fetchResult = await fetch(authorizeUrl);
    expect(fetchResult.status).toEqual(200);
    const body = await fetchResult.text();
    expect(body.indexOf("form")).not.toEqual(-1);
  });
});