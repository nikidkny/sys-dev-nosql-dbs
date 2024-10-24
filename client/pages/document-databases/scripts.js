const query = await fetch('http://localhost:8080/api/v1/topic');
const topics = await query.json();

const dropdown = document.getElementById('dropdown-content');

topics.forEach((topic) => {
  const path = topic.name.toLowerCase().split(' ').join('-');
  const link = document.createElement('a');
  link.textContent = topic.name;
  link.setAttribute('href', `/pages/${path}/index.html`);
  dropdown.appendChild(link);
});

// Activity section functionality
const fetchBtn = document.getElementById('fetch-incomplete-activities-btn');
const activityTable = document.getElementById('activity-table');
const activityTbody = document.getElementById('activity-tbody');

let isTableVisible = false;

fetchBtn.addEventListener('click', async () => {
  if (isTableVisible) {
    activityTable.style.display = 'none';
    isTableVisible = false;
    return;
  }

  try {
    const topicName = encodeURIComponent('Document Databases');
    console.log('Fetching activities for topic:', topicName);
    const activityQuery = await fetch(
      'http://127.0.0.1:8080/api/v1/activity/incomplete/' + topicName,
    );
    console.log('Activity Query:', activityQuery);
    const activities = await activityQuery.json();

    console.log('Fetched activities:', activities);
    activityTbody.innerHTML = '';

    if (activities.length > 0) {
      activityTable.style.display = 'table';

      activities.forEach((activity) => {
        if (activity.activity_details && activity.activity_details.length > 0) {
          const details = activity.activity_details[0];

          const row = document.createElement('tr');

          const nameCell = document.createElement('td');
          nameCell.textContent = details.name;

          const typeCell = document.createElement('td');
          typeCell.textContent = details.type;

          row.appendChild(nameCell);
          row.appendChild(typeCell);

          activityTbody.appendChild(row);
        }
      });
    } else {
      activityTbody.innerHTML = '<tr><td colspan="2">No unfinished activities found</td></tr>';
      activityTable.style.display = 'table';
    }

    isTableVisible = true;
  } catch (error) {
    console.error('Error fetching activities:', error);
  }
});
// Accordion functionality
const accordionButtons = document.querySelectorAll('.accordion-button');

accordionButtons.forEach((button) => {
  button.addEventListener('click', function () {
    this.classList.toggle('active');

    const panel = this.nextElementSibling;
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'block';
    }
  });
});

//Quiz functionality
document.getElementById('submit-quiz').addEventListener('click', function () {
  const form = document.getElementById('quiz-form');
  const result = document.getElementById('quiz-result');
  const selectedAnswer = form.answer.value;

  if (selectedAnswer === 'correct') {
    result.textContent = 'Correct! Document databases store data as JSON or BSON.';
    result.style.color = 'green';
  } else {
    result.textContent = 'Incorrect. Please try again.';
    result.style.color = 'red';
  }
});

// Diagram functionality
const field1 = document.getElementById('field1');
const field2 = document.getElementById('field2');
const field3 = document.getElementById('field3');
const explanationBox = document.getElementById('explanation-box');

field1.addEventListener('click', () => {
  explanationBox.innerHTML = `
    <h3>Field: Name</h3>
    <p>This field holds a string value, representing the name of a person or entity. For example:</p>
    <code>"name": "John Doe"</code>
  `;
});

field2.addEventListener('click', () => {
  explanationBox.innerHTML = `
    <h3>Field: Age</h3>
    <p>This field stores a numerical value representing the age of a person. For example:</p>
    <code>"age": 28</code>
  `;
});

field3.addEventListener('click', () => {
  explanationBox.innerHTML = `
    <h3>Field: Address (Nested Document)</h3>
    <p>This field contains a nested document. Documents can contain other documents, allowing complex data structures. For example:</p>
    <code>
      "address": {<br />
      &nbsp;&nbsp;"street": "123 Main St",<br />
      &nbsp;&nbsp;"city": "New York",<br />
      &nbsp;&nbsp;"zip": "10001"<br />
      }
    </code>
  `;
});
