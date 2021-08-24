const { MongoClient } = require("mongodb");

async function main() {
  const uri =
    "mongodb+srv://dbUser:dbUser123@cluster0.ozpkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  try {
    await client.connect();
    await listDatabases(client);
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
