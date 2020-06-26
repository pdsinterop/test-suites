import fetch from "node-fetch";

const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";

test("/.well-known/openid-configuration is valid JSON", async () => {
  const fetchResult = await fetch(
    `${SERVER_ROOT}/.well-known/openid-configuration`
  );
  expect(fetchResult.status).toEqual(200);
  const body = await fetchResult.text();
  JSON.parse(body);
});

describe("The server's openid configuration", () => {
  let fetchResult
  let configObj

  beforeAll(async () => {
    fetchResult = await fetch(
      `${SERVER_ROOT}/.well-known/openid-configuration`
    );
    const body = await fetchResult.text();
    configObj = JSON.parse(body);
  });

  test("has the server root as the issuer", async () => {
    expect(configObj.issuer).toEqual(SERVER_ROOT);
  });

  test("announces a jwks_uri", async () => {
    expect(configObj.jwks_uri.startsWith("https://")).toEqual(true);
  });

  test("announces support for the 'id_token code' response type", async () => {
    expect(configObj.response_types_supported.indexOf("id_token code")).not.toEqual(-1);
  });

  test("announces support for the 'dpop' token type", async () => {
    expect(configObj.token_types_supported.indexOf("dpop")).not.toEqual(-1);
  });

  test("announces support for the 'fragment' response mode", async () => {
    expect(configObj.response_modes_supported.indexOf("fragment")).not.toEqual(-1);
  });

  test.skip("announces support for the (some?) grant type", async () => {
    expect(configObj.grant_types_supported.indexOf("which one should we require?")).not.toEqual(-1);
  });

  test("announces support for 'public' subject type", async () => {
    expect(configObj.subject_types_supported.indexOf("public")).not.toEqual(-1);
  });

  test("announces support for 'RS256' id-token signing algorithm", async () => {
    expect(configObj.id_token_signing_alg_values_supported.indexOf("RS256")).not.toEqual(-1);
  });

  test("announces support for 'client_secret_basic' token-endpoint auth method", async () => {
    expect(configObj.token_endpoint_auth_methods_supported.indexOf("client_secret_basic")).not.toEqual(-1);
  });

  test("announces support for 'RS256' token-endpoint auth signing algorithm", async () => {
    expect(configObj.token_endpoint_auth_signing_alg_values_supported.indexOf("RS256")).not.toEqual(-1);
  });

  // display_values_supported: [],
  // claim_types_supported: [ 'normal' ],
  // claims_supported: [],
  // claims_parameter_supported: false,
  // request_parameter_supported: true,
  // request_uri_parameter_supported: false,
  // require_request_uri_registration: false,
  test("announces a check-session iframe", async () => {
    expect(configObj.check_session_iframe.startsWith("https://")).toEqual(true);
  });

  test("announces an end-session endpoint", async () => {
    expect(configObj.end_session_endpoint.startsWith("https://")).toEqual(true);
  });

  test("announces an authorization endpoint", async () => {
    expect(configObj.authorization_endpoint.startsWith("https://")).toEqual(true);
  });

  test("announces a token endpoint", async () => {
    expect(configObj.token_endpoint.startsWith("https://")).toEqual(true);
  });

  test("announces an user-info endpoint", async () => {
    expect(configObj.userinfo_endpoint.startsWith("https://")).toEqual(true);
  });

  test("announces a registration endpoint", async () => {
    expect(configObj.registration_endpoint.startsWith("https://")).toEqual(true);
  });

  // check_session_iframe: 'https://localhost:8443/session',
  // end_session_endpoint: 'https://localhost:8443/logout',
  // authorization_endpoint: 'https://localhost:8443/authorize',
  // token_endpoint: 'https://localhost:8443/token',
  // userinfo_endpoint: 'https://localhost:8443/userinfo',
  // registration_endpoint: 'https://localhost:8443/register',
  // keys: {
  //   descriptor: {
  //     id_token: [Object],
  //     token: [Object],
  //     userinfo: [Object],
  //     register: [Object]
  //   },
  //   jwks: { keys: [Array] },
  //   id_token: { signing: [Object], encryption: {} },
  //   token: { signing: [Object], encryption: {} },
  //   userinfo: { encryption: {} },
  //   register: { signing: [Object] },
  //   jwkSet: '{
});