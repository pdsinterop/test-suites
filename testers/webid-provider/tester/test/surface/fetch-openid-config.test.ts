import fetch from "node-fetch";

test("/.well-known/openid-configuration is valid JSON", async () => {
  const result = await fetch(
    "https://server/.well-known/openid-configuration"
  );
  expect(result.status).toEqual(200);
  const body = await result.text();
  JSON.parse(body);
});
