export async function insertDocumentDatabaseData(database) {
  console.log('insertDocumentDatabaseData function is being called');
  try {
    const topicCollection = database.collection('topic');
    const activityCollection = database.collection('activity');
    const studentActivityJoinCollection = database.collection('student_activity_join');

    const student = await database.collection('student').findOne({ email: 'john@example.com' });
    if (!student) {
      throw new Error('Student not found');
    }
    // Fetch the Document Databases topic from the database
    const documentDatabaseTopic = await topicCollection.findOne({ name: 'Document Databases' });
    console.log('Fetched Document Databases topic:', documentDatabaseTopic);
    if (!documentDatabaseTopic) {
      throw new Error('Document Databases topic not found');
    }

    // Insert activities for Document Databases topic
    const activities = [
      {
        topic_id: documentDatabaseTopic._id,
        name: 'Document Databases Quiz 1',
        type: 'quiz',
      },
      {
        topic_id: documentDatabaseTopic._id,
        name: 'Document Databases Quiz 2',
        type: 'quiz',
      },
      {
        topic_id: documentDatabaseTopic._id,
        name: 'Document Databases Tutorial',
        type: 'tutorial',
      },
    ];
    console.log('Activities to insert:', activities);
    const activityResult = await activityCollection.insertMany(activities);
    console.log('Inserted activities:', activityResult.insertedIds);

    // Associate the student with the activities
    const studentActivities = [
      { student_id: student._id, activity_id: activities[0]._id, is_completed: false },
      { student_id: student._id, activity_id: activities[1]._id, is_completed: true },
      { student_id: student._id, activity_id: activities[2]._id, is_completed: false },
    ];
    console.log('Student activities to insert:', studentActivities);
    const joinResult = await studentActivityJoinCollection.insertMany(studentActivities);
    console.log('Inserted student activities:', joinResult.insertedIds);
  } catch (error) {
    console.error('Error inserting Document Databases data:', error);
  }
}
