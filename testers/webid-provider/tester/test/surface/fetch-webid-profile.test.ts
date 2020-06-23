import fetch from "node-fetch";

const ALICE_WEBID = process.env.ALICE_WEBID;

test("/.well-known/openid-configuration is valid JSON", async () => {
  const result = await fetch(ALICE_WEBID);
  expect(result.status).toEqual(200);
  const body = await result.text();
  console.log(body);
});
