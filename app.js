const { MongoClient } = require("mongodb");

async function main() {
  const uri =
    "mongodb+srv://dbUser:dbUser123@cluster0.ozpkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  try {
    await client.connect();
    //await listDatabases(client);
    // await createListing(client, {
    //   name: "CUCEA",
    //   summary: "es universidad",
    //   bedrooms: 5,
    //   bathromms: 2,
    // });
    // await createMultipleListings(client, [
    //   {
    //     name: "aula 02",
    //     summary: "des 01",
    //     bedrooms: 1,
    //     bathromms: 1,
    //   },
    //   {
    //     name: "aula 03",
    //     summary: "des 02",
    //     bedrooms: 1,
    //     bathromms: 1,
    //   },
    // ]);
    await findOneListingByName(client, "zacatecas");
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

/**
 * INSERT ONE
 */
async function createListing(client, newListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingAndReviews")
    .insertOne(newListing);

  console.log(result);
}

/**
 * INSERT MANY
 */
async function createMultipleListings(client, newListings) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingAndReviews")
    .insertMany(newListings);

  console.log(`n: ${result.insertedCount}`);
  console.log(result.insertedIds);
}

/**
 * FIND ONE
 */

async function findOneListingByName(client, name) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingAndReviews")
    .findOne({ name });

  if (result) {
    console.log(result);
  } else {
    console.log("no result");
  }
}
