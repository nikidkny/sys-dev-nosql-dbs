import { Router } from 'express';
import { database } from '../database/connection.js';
import { BSON } from 'mongodb';

const router = Router();
const topicsCollection = database.collection('topic');

router.get('/topic', async (_req, res) => {
  try {
    const topics = await topicsCollection.find({}).toArray();
    return res.status(200).send(topics);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e });
  }
});

// GET a specific topic by id
router.get('/topic/:id', async (req, res) => {
  try {
    const id = new BSON.ObjectId(decodeURIComponent(req.params.id));
    const topicData = await topicsCollection.findOne({ _id: id });

    if (!topicData) {
      return res.status(404).json({ message: 'topic not found' });
    }

    return res.json(topicData);
  } catch (error) {
    console.error('Error fetching topic:', error);
    return res.status(500).json({ message: 'Failed to fetch topic' });
  }
});

// POST create a new topic
router.post('/topic', async (req, res) => {
  try {
    const newTopic = req.body;
    if (!newTopic) {
      return res.status(400).json({ message: 'topic data is required' });
    }

    const newTopicData = await topicsCollection.insertOne(newTopic);

    return res.status(201).json(newTopicData);
  } catch (error) {
    console.error('Error creating topic:', error);
    return res.status(500).json({ message: 'Failed to create topic' });
  }
});

// PUT update a topic by ID
router.put('/topic/:id', async (req, res) => {
  try {
    const id = new BSON.ObjectId(req.params.id);
    const updatedTopic = req.body;

    const filter = { _id: id };
    const update = { $set: updatedTopic };

    const result = await topicsCollection.updateOne(filter, update);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'topic not found' });
    }

    const newTopicData = await topicsCollection.findOne(filter);
    return res.json(newTopicData);
  } catch (error) {
    console.error('Error updating topic:', error);
    return res.status(500).json({ message: 'Failed to update topic' });
  }
});

// DELETE remove a topic by ID
router.delete('/topic/:id', async (req, res) => {
  try {
    const id = new BSON.ObjectId(req.params.id);

    const filter = { _id: id };
    const result = await topicsCollection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'topic not found' });
    }

    return res.json({ message: 'topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return res.status(500).json({ message: 'Failed to delete topic' });
  }
});

export default router;
