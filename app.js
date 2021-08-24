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
    await createMultipleListings(client, [
      {
        name: "Test name 02",
        summary: "adcdf 02",
        bedrooms: 1,
        bathromms: 1,
      },
      {
        name: "Test name 03",
        summary: "adcdf 03",
        bedrooms: 1,
        bathromms: 1,
      },
    ]);
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
