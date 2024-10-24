export async function insertDatabaseConnectionData(database) {
  try {
    const topicCollection = database.collection('topic');
    const activityCollection = database.collection('activity');
    const studentActivityJoinCollection = database.collection('student_activity_join');

    const student = await database.collection('student').findOne({ email: 'john@example.com' });
    if (!student) {
      throw new Error('Student not found');
    }

    const dbConnectionTopic = await topicCollection.findOne({
      name: 'Database Connection to Frontend',
    });

    if (!dbConnectionTopic) {
      throw new Error('Database Connection to Frontend topic not found');
    }

    const activities = [
      {
        topic_id: dbConnectionTopic._id,
        name: 'Database Connection Quiz 1',
        type: 'quiz',
      },
      {
        topic_id: dbConnectionTopic._id,
        name: 'Database Connection Quiz 2',
        type: 'quiz',
      },
      {
        topic_id: dbConnectionTopic._id,
        name: 'Database Connection Quiz 3',
        type: 'quiz',
      },
      {
        topic_id: dbConnectionTopic._id,
        name: 'Database Connection Quiz 4',
        type: 'quiz',
      },
    ];

    const activityResult = await activityCollection.insertMany(activities);
    console.log('Inserted activities:', activityResult.insertedIds);

    const studentActivities = [
      { student_id: student._id, activity_id: activities[0]._id, is_completed: false },
      { student_id: student._id, activity_id: activities[1]._id, is_completed: true },
      { student_id: student._id, activity_id: activities[2]._id, is_completed: false },
      { student_id: student._id, activity_id: activities[3]._id, is_completed: true },
    ];

    const joinResult = await studentActivityJoinCollection.insertMany(studentActivities);
    console.log('Inserted student activities for Database Connection:', joinResult.insertedIds);
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}
