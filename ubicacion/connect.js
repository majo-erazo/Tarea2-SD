const { MongoClient, ObjectId } = require("mongodb")

const uri = "mongodb://root:example@db/sopaipilleros?authSource=admin"
const client = new MongoClient(uri);
await client.connect();

export { client, ObjectId };