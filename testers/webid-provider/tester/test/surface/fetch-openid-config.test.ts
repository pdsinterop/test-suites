import fetch from "node-fetch";

const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";

test("/.well-known/openid-configuration is valid JSON", async () => {
  const result = await fetch(
    `${SERVER_ROOT}/.well-known/openid-configuration`
  );
  expect(result.status).toEqual(200);
  const body = await result.text();
  JSON.parse(body);
});
