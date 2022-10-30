const { MongoClient, ObjectId } = require("mongodb")

const uri = "mongodb://root:example@db/sopaipilleros?authSource=admin"
const client = new MongoClient(uri);

const conn = async () => {
    await client.connect();
}


export { client, ObjectId };