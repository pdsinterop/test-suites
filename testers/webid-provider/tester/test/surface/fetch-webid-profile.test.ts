import fetch from "node-fetch";
import { fetchDocument } from "tripledoc";
import { ldp, foaf, rdf, schema } from "rdf-namespaces";

const ALICE_WEBID = process.env.ALICE_WEBID;
const SERVER_ROOT = process.env.SERVER_ROOT || "https://server";

describe("Alice's webid profile", () => {
  let doc;
  let subAlice;
  let subDoc;

  beforeAll(async () => {
    doc = await fetchDocument(ALICE_WEBID);
    subAlice = doc.getSubject(ALICE_WEBID);
    subDoc = doc.getSubject(doc.asRef());
  });

  test("profile points to an LDP inbox", async () => {
    expect(subAlice.getRef(ldp.inbox).startsWith("https://")).toEqual(true);
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
});
