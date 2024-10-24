const query = await fetch('http://localhost:8080/api/v1/topic');
const topics = await query.json();

const dropdown = document.getElementById('dropdown-content');
const fetchBtn = document.getElementById('fetch-incomplete-activities-btn');
const activityTable = document.getElementById('activity-table');
const activityTbody = document.getElementById('activity-tbody');

topics.forEach((topic) => {
  const path = topic.name.toLowerCase().split(' ').join('-');
  const link = document.createElement('a');
  link.textContent = topic.name;
  link.setAttribute('href', `/pages/${path}/index.html`);
  dropdown.appendChild(link);
});

let isTableVisible = false;

fetchBtn.addEventListener('click', async () => {
  if (isTableVisible) {
    activityTable.style.display = 'none';
    isTableVisible = false;
    return;
  }

  try {
    const topicName = encodeURIComponent('ER Diagrams');
    const activityQuery = await fetch(
      'http://localhost:8080/api/v1/activity/incomplete/' + topicName,
    );
    const activities = await activityQuery.json();

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
