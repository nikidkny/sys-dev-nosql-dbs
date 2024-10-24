import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';
import { insertDocumentDatabaseData } from './dummyDataDCDB.js';
import { insertERDiagramsData } from './dummyDataERD.js';
import { insertDatabaseConnectionData } from './dummyDataFrontend.js';

const TOPICS = [
  {
    name: 'Document Databases',
    description:
      'A document database (also known as a document-oriented database or a document store) is a database that stores information in documents',
  },
  {
    name: 'Normalization',
    description:
      'Database normalization is the process of organizing data into tables in such a way that the results of using the database are always unambiguous and as intended. Such normalization is intrinsic to relational database theory.',
  },
  {
    name: 'ER Diagrams',
    description:
      'An entity-relationship model describes interrelated things of interest in a specific domain of knowledge. A basic ER model is composed of entity types and specifies relationships that can exist between entities.',
  },
  {
    name: 'Document Databases CRUD methods',
    description: 'Create, Read, Update, Delete',
  },
  {
    name: 'Database Connection to Frontend',
    description: 'How to connect a document database to a web front-end page',
  },
];

const client = new MongoClient(process.env.DATABASE_CONNECTION_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function createIndexes(database) {
  await database.collection('student_activity_join').createIndex({ student_id: 1, activity_id: 1 });
  await database.collection('activity').createIndex({ topic_id: 1 });
  await database.collection('topic').createIndex({ name: 1 });
  await database.collection('student').createIndex({ email: 1 }, { unique: true });
  console.log('Indexes created successfully');
}

async function initializeDatabase() {
  try {
    await client.connect();

    const database = client.db(process.env.DATABASE_NAME);

    // Drop database if it already exists to prevent duplicates
    if ((await database.collections()).length > 0) {
      await database.dropDatabase();
    }

    await database.createCollection('topic', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'Topic Object Validation',
          required: ['name', 'description'],
          properties: {
            name: {
              bsonType: 'string',
              description: "'name' must be a string and is required",
            },
            description: {
              bsonType: 'string',
              description: "'description' must be a string and is required",
            },
          },
        },
      },
    });

    await database.createCollection('activity', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'Activity Object Validation',
          required: ['topic_id', 'name', 'type'],
          properties: {
            topic_id: {
              bsonType: 'objectId',
              description: "'topic_id' must be a string and is required",
            },
            name: {
              bsonType: 'string',
              description: "'name' must be a string and is required",
            },
            type: {
              bsonType: 'string',
              description: "'type' must be a string and is required",
            },
          },
        },
      },
    });

    await database.createCollection('student', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'Student Object Validation',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              bsonType: 'string',
              description: "'name' must be a string and is required",
            },
            email: {
              bsonType: 'string',
              description: "'email' must be a string and is required",
            },
            password: {
              bsonType: 'string',
              description: "'password' must be a string and is required",
            },
          },
        },
      },
    });

    await database.createCollection('student_activity_join', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'Student Activity Join Object Validation',
          required: ['student_id', 'activity_id', 'is_completed'],
          properties: {
            student_id: {
              bsonType: 'objectId',
              description: "'student_id' must be a string and is required",
            },
            activity_id: {
              bsonType: 'objectId',
              description: "'activity_id' must be a string and is required",
            },
            is_completed: {
              bsonType: 'bool',
              description: "'is_completed' must be a boolean and is required",
            },
          },
        },
      },
    });

    // Indexes
    await createIndexes(database);

    // Dummy data
    await database.collection('topic').insertMany(TOPICS);
    await insertERDiagramsData(database);
    await insertDatabaseConnectionData(database);
    await insertDocumentDatabaseData(database);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

initializeDatabase();
