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
    ///await findOneListingByName(client, "zacatecas");
    // await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
    //   minimumNumberOfBedrooms: 6,
    //   minimumNumberOfBathrooms: 5,
    //   maximumNumberOfResults: 2,
    // });
    // await updateListingByName(client, "Horto flat with small garden", {
    //   bedrooms: 10,
    //   beds: 10,
    // });

    await upsertListingByName(client, "TEUL", {
      name: "Cozy Cottage",
      bedrooms: 2,
      bathrooms: 1,
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

/**
 * FIND
 */

async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(
  client,
  {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER,
  } = {}
) {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find for the find() docs
  const cursor = client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .find({
      bedrooms: { $gte: minimumNumberOfBedrooms },
      bathrooms: { $gte: minimumNumberOfBathrooms },
    })
    .sort({ last_review: -1 })
    .limit(maximumNumberOfResults);

  // Store the results in an array
  const results = await cursor.toArray();

  // Print the results
  if (results.length > 0) {
    console.log(
      `Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`
    );
    results.forEach((result, i) => {
      const date = new Date(result.last_review).toDateString();

      console.log();
      console.log(`${i + 1}. name: ${result.name}`);
      console.log(`   _id: ${result._id}`);
      console.log(`   bedrooms: ${result.bedrooms}`);
      console.log(`   bathrooms: ${result.bathrooms}`);
      console.log(`   most recent review date: ${date}`);
    });
  } else {
    console.log(
      `No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`
    );
  }
}

/**
 * UPDATE ONE
 */

async function updateListingByName(client, nameOfListing, updatedListing) {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateOne for the updateOne() docs
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .updateOne({ name: nameOfListing }, { $set: updatedListing });

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

/**
 * UPSERT
 */

async function upsertListingByName(client, nameOfListing, updatedListing) {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateOne for the updateOne() docs
  const result = await client
    .db("sample_airbnb")
    .collection("listingAndReviews")
    .updateOne(
      { name: nameOfListing },
      { $set: updatedListing },
      { upsert: true }
    );

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);

  if (result.upsertedCount > 0) {
    console.log(
      `One document was inserted with the id ${result.upsertedId._id}`
    );
  } else {
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
}
