import fetch from "node-fetch";
const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";

describe("Discovery at /ocm-provider/", () => {
  test("contains service description", async () => {
    const fetched = await fetch(`${SERVER_ROOT}/ocm-provider/`);
    const jsonParsed = await fetched.json();
    expect(jsonParsed.enabled).toEqual(true);
    expect(jsonParsed.apiVersion).toEqual('1.0-proposal1');
    let typesName: string;
    if (jsonParsed.resourceTypes) {
      typesName = 'resource'
      expect(jsonParsed.resourceTypes[0].shareTypes).toEqual([
        'user',
        'group'
      ]);
    } else {
      typesName = 'share'
    }
    expect(jsonParsed[`${typesName}Types`].length).toEqual(1);
    expect(jsonParsed[`${typesName}Types`][0].name).toEqual('file');
    expect(jsonParsed[`${typesName}Types`][0].protocols).toEqual({
      "webdav":"/public.php/webdav/"
    });
  });
});
