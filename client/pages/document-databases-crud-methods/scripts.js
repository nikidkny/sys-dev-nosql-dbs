const query = await fetch('http://localhost:8080/api/v1/topic');
const topics = await query.json();

// DOM elements
const dropdown = document.getElementById('dropdown-content');
const tbody = document.getElementById('topics-body');
const addButton = document.getElementById('add-row');

const apiUrl = 'http://localhost:8080/api/v1/topic';

// Function to fetch and display topics
async function fetchTopics() {
  const response = await fetch(apiUrl);
  const topics = await response.json();
  console.log(topics);

  // Reset dynamic elements
  tbody.innerHTML = '';
  dropdown.innerHTML = '';

  topics.forEach((topic) => {
    // Populate navbar dropdown topics selector
    const path = topic.name.toLowerCase().split(' ').join('-');
    const link = document.createElement('a');
    link.textContent = topic.name;
    link.setAttribute('href', `/pages/${path}/index.html`);
    dropdown.appendChild(link);

    // Populate table row
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" value="${topic.name}" /></td>
      <td><input type="text" value="${topic.description}" /></td>
      <td>
        <button class="btn save-btn" data-id="${topic._id}">Save</button>
        <button class="btn delete-btn" data-id="${topic._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Attach event listeners for save and delete buttons
  document.querySelectorAll('.save-btn').forEach((btn) => {
    btn.addEventListener('click', updateTopic);
  });

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', deleteTopic);
  });
}

// Function to update a topic
async function updateTopic(event) {
  const row = event.target.closest('tr');
  const id = event.target.getAttribute('data-id');
  const updatedTopic = {
    name: row.children[0].querySelector('input').value,
    description: row.children[1].querySelector('input').value,
  };

  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTopic),
  });

  alert('Topic updated!');
  fetchTopics(); // Refresh the table
}

// Function to delete a topic
async function deleteTopic(event) {
  const id = event.target.getAttribute('data-id');

  if (confirm('Are you sure you want to delete this topic?')) {
    await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });

    alert('Topic deleted!');
    fetchTopics(); // Refresh the table
  }
}

// Function to add a new row for topic creation
addButton.addEventListener('click', () => {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td><input type="text" placeholder="New Topic Name" /></td>
    <td><input type="text" placeholder="New Topic Description" /></td>
    <td>
      <button class="btn create-btn">Create</button>
    </td>
  `;

  tbody.appendChild(row);

  // Attach event listener for create button
  row.querySelector('.create-btn').addEventListener('click', createTopic);
});

// Function to create a new topic
async function createTopic(event) {
  const row = event.target.closest('tr');
  const newTopic = {
    name: row.children[0].querySelector('input').value,
    description: row.children[1].querySelector('input').value,
  };

  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTopic),
  });

  alert('New topic created!');
  fetchTopics(); // Refresh the table
}

// Initial fetch of topics when the page loads
window.onload = fetchTopics();
