import { decode } from "jsonwebtoken";
import Debug from "debug";
import fetch, { Response } from "node-fetch";
import RSA from "node-rsa";
import { URL } from "url";


const debug = Debug('token tests');

const ALICE_WEBID = process.env.ALICE_WEBID;
const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";
const LOGIN_URL = `${SERVER_ROOT}/login/password`;
const query2 = "?response_type=id_token%20code&redirect_uri=http%3A%2F%2Flocalhost%3A3002%2Fredirect&scope=openid%20profile%20offline_access&client_id=coolApp2&code_challenge_method=S256&code_challenge=M3CBok-0kQFc0GUz2YD90cFee0XzTTru3Eaj0Ubm-oc&state=84ae2b48-eb1b-4000-8782-ac1cd748aeb0";

async function getCookie() {
  const result = await fetch(`${SERVER_ROOT}/login/password`, {
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: "username=alice&password=123",
    method: "POST",
    redirect: "manual"
  });
  return result.headers.get('set-cookie');
}

describe("The IODC token", () => {
  let code
  let idTokenJwt
  let idTokenObj
  let jwks
  beforeAll(async () => {
    const configFetchResult = await fetch(
      `${SERVER_ROOT}/.well-known/openid-configuration`
    );
    const body = await configFetchResult.text();
    const configObj = JSON.parse(body);
    const jwksResponse = await fetch(configObj.jwks_uri)
    jwks = await jwksResponse.json()
    debug('jwks', jwks)
  
    const authorizationEndpoint = configObj.authorization_endpoint;
    const cookie = await getCookie();
    const authorizeFetchResult1 = await fetch(`${authorizationEndpoint}?response_type=id_token%20code&display=&scope=openid%20profile%20offline_access&client_id=coolApp2&redirect_uri=http%3A%2F%2Flocalhost%3A3002%2Fredirect&state=84ae2b48-eb1b-4000-8782-ac1cd748aeb0&nonce=&request=`, {
      "headers": {
        cookie
      },
      redirect: "manual"
    });
    expect(authorizeFetchResult1.status).toEqual(302);
    const authorizeFetchResult2 = await fetch(authorizeFetchResult1.headers.get('location'), {
      "headers": {
        cookie
      },
      redirect: "manual"
    });
    expect(authorizeFetchResult2.status).toEqual(302);
    const authorizeFetchResult3 = await fetch(authorizeFetchResult2.headers.get('location'), {
      "headers": {
        cookie
      },
      redirect: "manual"
    });
    expect(authorizeFetchResult3.status).toEqual(302);
    const callbackParams = authorizeFetchResult3.headers.get('location').substring('http://localhost:3002/redirect?'.length).split('&');
    code = callbackParams[0].substring('code='.length);
    idTokenJwt = callbackParams[1].substring('id_token='.length);
    idTokenObj = decode(idTokenJwt);
  });

  test("Callback redirect receives a code", async () => {
    console.log({ code });
    expect(code.length > 0).toEqual(true);
  });

  test("Callback redirect receives an id token", async () => {
    console.log({ idTokenJwt });
    expect(idTokenJwt.length > 0).toEqual(true);
  });

  test("id token has the right issuer", async () => {
    expect(idTokenObj.iss).toEqual(SERVER_ROOT);
  });

  test.skip("id token has the right audience", async () => {
    expect(idTokenObj.aud).toEqual("coolApp2");
  });
  test.skip("id token has the right authorized party", async () => {
    expect(idTokenObj.azp).toEqual("coolApp2");
  });
  test("id token has the right subject", async () => {
    expect(idTokenObj.sub).toEqual(ALICE_WEBID);
  });
  test("id token has an expiry time a few weeks in the future", async () => {
    const futureWeeks = (idTokenObj.exp * 1000 - new Date().getTime()) / (7 * 24 * 3600 * 1000);
    expect(futureWeeks).toBeGreaterThan(1);
    expect(futureWeeks).toBeLessThan(5);
  });
  test("id token has an issued-at time a few seconds in the past", async () => {
    const pastMilliSeconds = (new Date().getTime() - idTokenObj.iat * 1000);
    expect(pastMilliSeconds).toBeLessThan(60 * 1000);
    expect(pastMilliSeconds).toBeGreaterThan(0);
  });
  test("id token has a JWT ID", async () => {
    expect(typeof idTokenObj.jti).toEqual("string");
  });
  test("id token has a code hash", async () => {
    console.log(idTokenObj);
    expect(typeof idTokenObj.c_hash).toEqual("string");
  });
});