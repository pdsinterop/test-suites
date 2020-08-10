import fetch from "node-fetch";
const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";

describe("Discovery at /ocm-provider/", () => {
  test("contains service description", async () => {
    const fetched = await fetch(`${SERVER_ROOT}/ocm-provider/`);
    const jsonParsed = await fetched.json();
    expect(jsonParsed).toEqual({
      "enabled":true,
      "apiVersion":"1.0-proposal1",
      "endPoint":"https://localhost/ocm",
      "resourceTypes": [
        {
          "name": "file",
          "shareTypes": ["user", "group"],
          "protocols": {
            "webdav":"/public.php/webdav/"
          }
        }
      ],
    });
  });
});
