import fetch from "node-fetch";
import { fetchDocument } from "tripledoc";
import { ldp, foaf, rdf, schema, vcard, solid, space } from "rdf-namespaces";

const ALICE_WEBID = process.env.ALICE_WEBID;
const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";

describe("Alice's webid profile", () => {
  let doc;
  let subAlice;
  let subDoc;

  beforeAll(async () => {
    doc = await fetchDocument(ALICE_WEBID);
    // console.log(ALICE_WEBID);
    subAlice = doc.getSubject(ALICE_WEBID);
    subDoc = doc.getSubject(doc.asRef());
  });

  test("Alice has an ldp:inbox", async () => {
    expect(subAlice.getRef(ldp.inbox).startsWith("https://")).toEqual(true);
  });

  test("Alice has a space:storage", async () => {
    expect(subAlice.getRef(space.storage).startsWith("https://")).toEqual(true);
  });

  test("Alice has a space:preferencesFile", async () => {
    expect(subAlice.getRef(space.preferencesFile).startsWith("https://")).toEqual(true);
  });

  test("Alice has a solid:account", async () => {
    expect(subAlice.getRef(solid.account).startsWith("https://")).toEqual(true);
  });

  test("Alice has a space:preferencesFile", async () => {
    expect(subAlice.getRef(space.preferencesFile).startsWith("https://")).toEqual(true);
  });

  test("Alice has a solid:privateTypeIndex", async () => {
    expect(subAlice.getRef(solid.privateTypeIndex).startsWith("https://")).toEqual(true);
  });

  test("Alice has a solid:publicTypeIndex", async () => {
    expect(subAlice.getRef(solid.publicTypeIndex).startsWith("https://")).toEqual(true);
  });

  test("doc itself is a foaf:PersonalProfileDocument", async () => {
    const profileTypes = subDoc.getAllRefs(rdf.type);
    expect(profileTypes.sort()).toEqual([foaf.PersonalProfileDocument].sort());
  });

  test("Alice is the foaf:primaryTopic of the profile doc", async () => {
    const profileTypes = subDoc.getAllRefs(rdf.type);
    expect(subDoc.getRef(foaf.primaryTopic)).toEqual(subAlice.asRef());
  });

  test("Alice is a foaf:Person and a schema:Person", async () => {
    const aliceTypes = subAlice.getAllRefs(rdf.type);
    expect(aliceTypes.sort()).toEqual([foaf.Person, schema.Person].sort());
  });

  test.skip("Alice has a foaf:name", async () => {
    expect(subAlice.getRef(foaf.name).length > 0).toEqual(true);
  });

  test.skip("Alice has a vcard:fn", async () => {
    expect(subAlice.getRef(vcard.fn).length > 0).toEqual(true);
  });

  test.skip("Alice has a vcard:hasPhoto", async () => {
    expect(subAlice.getRef(vcard.hasPhoto).startsWith("https://")).toEqual(true);
  });

});
