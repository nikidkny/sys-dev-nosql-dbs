import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

if (process.env.DATABASE_CONNECTION_STRING == null) {
  throw new Error('Connection string is not defined');
} else if (process.env.DATABASE_NAME == null) {
  throw new Error('Database name is not defined');
}

const client = new MongoClient(process.env.DATABASE_CONNECTION_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

await client.connect();

const database = client.db(process.env.DATABASE_NAME);

export { database };
