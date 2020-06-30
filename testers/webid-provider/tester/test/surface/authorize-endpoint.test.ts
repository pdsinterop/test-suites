import fetch from "node-fetch";
import { hasUncaughtExceptionCaptureCallback } from "process";

const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";
const LOGIN_URL = `${SERVER_ROOT}/login/password`;
const query = "?response_type=id_token%20code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fredirect&scope=openid%20profile%20offline_access&client_id=coolApp&code_challenge_method=S256&code_challenge=M3CBok-0kQFc0GUz2YD90cFee0XzTTru3Eaj0Ubm-oc&state=84ae2b48-eb1b-4000-8782-ac1cd748aeb0";

async function getCookie() {
  const result = await fetch("https://localhost/login/password", {
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: "username=alice&password=123",
    method: "POST",
    redirect: "manual"
  });
  return result.headers.get('set-cookie');
}

describe("The server's authorize endpoint", () => {
  let authorizationEndpoint
  let cookie

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
    console.log(configObj);
    authorizationEndpoint = configObj.authorization_endpoint;
    cookie = await getCookie();
  });

  test("the authorize endpoint is within the system under test", async () => {
    expect(authorizationEndpoint.startsWith(SERVER_ROOT)).toEqual(true);
  });

  test("the authorize URL without cookie sends you to login", async () => {
    const fetchResult = await fetch(authorizationEndpoint + query, {
      redirect: "manual"
    });
    expect(fetchResult.status).toEqual(302);
    expect(fetchResult.headers.get('location')).toEqual("https://localhost:443/login" + query);
  });

  test("when redirected to login, you see a html form", async () => {
    const fetchResult = await fetch(authorizationEndpoint + query, {
      redirect: "follow"
    });
    expect(fetchResult.status).toEqual(200);
    const body = await fetchResult.text();
    expect(body.indexOf("form")).not.toEqual(-1);
  });

  test("the authorize URL with cookie sends you to consent", async () => {
    const fetchResult = await fetch(authorizationEndpoint + query, {
      headers: {
        cookie
      },
      redirect: "manual"
    });
    expect(fetchResult.status).toEqual(302);
    expect(fetchResult.headers.get('location')).toEqual("https://localhost:443/sharing" + query);
    const body = await fetchResult.text();
    console.log(body);
  });

  test("when redirected to consent, there is a html form", async () => {
    const fetchResult = await fetch(authorizationEndpoint + query, {
      headers: {
        cookie
      },
      redirect: "follow"
    });
    expect(fetchResult.status).toEqual(200);
    const body = await fetchResult.text();
    expect(body.indexOf("form")).not.toEqual(-1);
  });

});