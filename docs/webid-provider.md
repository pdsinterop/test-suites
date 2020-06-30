# WebID Provider Test Suite

This test suite tests for compliance with the DPop-based, 2020 version of the WebID-OIDC protocol.
It contains 4 parts:
* Fetch openid config
* Fetch webid profile
* authorize endpoint
* token

## Fetch openid config

This one is quite trivial and it should be a quick win for you. Simply make your server expose a https website on port 443, and present a JSON file with a few pointers and parameters at /.well-known/openid-configuration.

## Fetch webid profile

This should be trivial as well; specify an ALICE_WEBID url in env.file (see [example](https://github.com/pdsinterop/test-suites/blob/584531f/servers/node-solid-server/env.list)), and at that URL, [this `text/turtle` document](https://raw.githubusercontent.com/pdsinterop/test-suites/584531f/servers/node-solid-server/data/profile/card%24.ttl) will comply. The https://localhost:3002 trusted app will be used in the authorize endpoint test.

## Authorize endpoint

Make sure that [coolApp1](https://github.com/pdsinterop/test-suites/blob/584531f/servers/node-solid-server/.db/oidc/op/clients/_key_coolApp1.json) and [coolApp2](https://github.com/pdsinterop/test-suites/blob/584531f/servers/node-solid-server/.db/oidc/op/clients/_key_coolApp2.json) are registered OIDC clients with http://localhost:3001/redirect and http://localhost:3002/redirect as the redirect URLs. The test will try:
* authorize endpoint (as announced by your server in /.well-known/openid-configuration) without cookie, should redirect to a login form
* authorize endpoint (as announced by your server in /.well-known/openid-configuration) with cookie, should redirect to a consent form
* if the app is trusted (trusted app coolApp2 at http://localhost:3002), it should automatically give consent and redirect back to the authorize endpoint
* if consent is given, it should redirect back to the app at the app's redirect callback.

## Token
* There should be a `code` and an `id_token` in the result of the authorize flow
* The `id_token` should be a valid JWT with certain values
* Specifically, `id_token.c_hash` should be the RS256 has of `code` (this is used by the client for the DPop system).
* The JWT should be signed with one of the keys from the server's `jwks`, [converted to RSA pem](https://github.com/pdsinterop/test-suites/blob/584531f/testers/webid-provider/tester/test/surface/token.test.ts#L131-L138).

