import fetch from "node-fetch";
import { fetchDocument } from "tripledoc";
import { ldp } from "rdf-namespaces";

const ALICE_WEBID = process.env.ALICE_WEBID;
const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";

test("/.well-known/openid-configuration is valid JSON", async () => {
  const doc = await fetchDocument(ALICE_WEBID);
  const sub = doc.getSubject(ALICE_WEBID);
  expect(sub.getRef(ldp.inbox).startsWith("https://")).toEqual(true);
});
