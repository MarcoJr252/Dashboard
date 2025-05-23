
const baseUrl = 'https://bolder-temporal-palladium.glitch.me';

const serviceEndpoints = [
  'blood', 'aid', 'animal', 'orphan-support', 'elderly-care', 'literacy-programs'
];
const eventEndpoints = [
  'blood', 'aid', 'house-renovation', 'animal-welfare', 'orphan-support', 'elderly-care', 'literacy-programs', 'road'
];

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => {
    s.style.opacity = 0;
    s.style.transition = 'opacity 0.4s';
    setTimeout(() => (s.style.display = 'none'), 400);
  });
  setTimeout(() => {
    const target = document.getElementById(id);
    target.style.display = 'block';
    setTimeout(() => (target.style.opacity = 1), 10);
  }, 400);
}

document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href').substring(1);
    showSection(target);
  });
});

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

function showModal(data) {
  document.getElementById('modalTitle').textContent = data.title || data.name || 'Untitled';
  document.getElementById('modalDescription').textContent = data.description || '-';
  document.getElementById('modalLocation').textContent = data.location || '-';
  document.getElementById('modalDate').textContent = data.date || '-';
  document.getElementById('modalTime').textContent = data.time || '-';
  document.getElementById('modalContact').textContent = data.contactNumber || '-';
  document.getElementById('detailModal').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.close-btn').onclick = () => {
    document.getElementById('detailModal').classList.add('hidden');
  };
});

async function loadServices() {
  const list = document.getElementById('serviceList');
  list.innerHTML = '';
  let count = 0;

  for (const type of serviceEndpoints) {
    const res = await fetch(`${baseUrl}/api/${type}/locations`);
    const data = await res.json();
    count += data.length;

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.textContent = item.title || item.name || 'Untitled';
      card.onclick = () => showModal(item);
      list.appendChild(card);
    });
  }

  document.getElementById('totalServices').textContent = count;
}

async function loadEvents() {
  const list = document.getElementById('eventList');
  list.innerHTML = '';
  let count = 0;

  for (const type of eventEndpoints) {
    const res = await fetch(`${baseUrl}/api/${type}/events`);
    const data = await res.json();
    count += data.length;

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.textContent = item.title || 'Untitled';
      card.onclick = () => showModal(item);
      list.appendChild(card);
    });
  }

  document.getElementById('totalEvents').textContent = count;
}

document.getElementById('serviceForm').addEventListener('submit', async e => {
  e.preventDefault();
  const type = document.getElementById('serviceType').value;
  const name = document.getElementById('serviceName').value;
  const description = document.getElementById('serviceDescription').value;
  const location = document.getElementById('serviceLocation').value;
  const date = document.getElementById('serviceDate').value;
  const time = document.getElementById('serviceTime').value;
  const contact = document.getElementById('serviceContact').value;

  const res = await fetch(`${baseUrl}/api/${type}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: name, description, location, date, time, contactNumber: contact })
  });

  if (res.ok) {
    showToast('Service added', 'success');
    e.target.reset();
    loadServices();
  }
});

document.getElementById('eventForm').addEventListener('submit', async e => {
  e.preventDefault();
  const type = document.getElementById('eventType').value;
  const title = document.getElementById('eventTitle').value;
  const date = document.getElementById('eventDate').value;
  const description = document.getElementById('eventDescription').value;
  const location = document.getElementById('eventLocation').value;
  const time = document.getElementById('eventTime').value;
  const contact = document.getElementById('eventContact').value;

  const res = await fetch(`${baseUrl}/api/${type}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, location, date, time, contactNumber: contact })
  });

  if (res.ok) {
    showToast('Event added', 'success');
    e.target.reset();
    loadEvents();
  }
});

loadServices();
loadEvents();
showSection('services');
