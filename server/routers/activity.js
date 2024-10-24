import { Router } from 'express';
import { database } from '../database/connection.js';

const router = Router();

router.get('/activity', async (req, res) => {
  try {
    return res.status(200).send({});
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e });
  }
});

router.get('/activity/:name', async (req, res) => {
  try {
    return res.status(200).send({});
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e });
  }
});

router.get('/activity/incomplete/:name', async (req, res) => {
  const topicName = decodeURIComponent(req.params.name);
  const userEmail = 'john@example.com';

  try {
    const student = await database.collection('student').findOne({ email: userEmail });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const incompleteActivities = await database
      .collection('student_activity_join')
      .aggregate([
        {
          $lookup: {
            from: 'activity',
            localField: 'activity_id',
            foreignField: '_id',
            as: 'activity_details',
          },
        },
        {
          $lookup: {
            from: 'topic',
            localField: 'activity_details.topic_id',
            foreignField: '_id',
            as: 'topic_details',
          },
        },
        {
          $match: {
            student_id: student._id,
            is_completed: false,
            'topic_details.name': topicName,
          },
        },
        {
          $project: {
            'activity_details.name': 1,
            'activity_details.type': 1,
            is_completed: 1,
          },
        },
      ])
      .toArray();

    return res.status(200).json(incompleteActivities);
  } catch (e) {
    console.error('Error fetching incomplete activities:', e);
    return res.status(500).json({ error: 'Failed to fetch activities', details: e });
  }
});

router.get('/activity/quizzes/:topicname', async (req, res) => {
  const topicName = decodeURIComponent(req.params.topicname);
  const userEmail = 'john@example.com';

  try {
    const student = await database.collection('student').findOne({ email: userEmail });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const quizzes = await database
      .collection('student_activity_join')
      .aggregate([
        {
          $lookup: {
            from: 'activity',
            localField: 'activity_id',
            foreignField: '_id',
            as: 'activity_details',
          },
        },
        {
          $lookup: {
            from: 'topic',
            localField: 'activity_details.topic_id',
            foreignField: '_id',
            as: 'topic_details',
          },
        },
        {
          $match: {
            student_id: student._id,
            'topic_details.name': topicName,
            activity_details: { $elemMatch: { type: 'quiz' } },
          },
        },
        {
          $project: {
            'activity_details.name': 1,
            'activity_details.type': 1,
            is_completed: 1,
          },
        },
      ])
      .toArray();

    return res.status(200).json(quizzes);
  } catch (e) {
    console.error('Error fetching quizzes:', e);
    return res.status(500).json({ error: 'Failed to fetch quizzes', details: e });
  }
});

export default router;
