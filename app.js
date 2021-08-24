const { MongoClient } = require("mongodb");

async function main() {
  const uri =
    "mongodb+srv://dbUser:dbUser123@cluster0.ozpkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  try {
    await client.connect();
    //await listDatabases(client);
    await createListing(client, {
      name: "CUCEA",
      summary: "es universidad",
      bedrooms: 5,
      bathromms: 2,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

async function listDatabases(client) {
  let databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
}

async function createListing(client, newListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingAndReviews")
    .insertOne(newListing);

  console.log(result);
}
