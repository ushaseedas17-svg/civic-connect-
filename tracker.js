// tracker.js – Complaint tracking logic

const complaints = {
  'CC-2847': {
    id: '#CC-2847', title: 'Broken Road – NH-12 Junction',
    cat: 'Road Damage', loc: 'Salt Lake, Sector V, Kolkata',
    date: 'Feb 20, 2026', dept: 'PWD – Roads Department',
    status: 'inprogress', progress: 60,
    timeline: [
      { label: 'Complaint Registered', date: 'Feb 20, 8:14 AM', desc: 'Your report was received and logged.', state: 'done' },
      { label: 'Auto-Categorized & Assigned', date: 'Feb 20, 8:15 AM', desc: 'Routed to PWD Roads Dept. – Sector V Engineer.', state: 'done' },
      { label: 'Field Inspection Scheduled', date: 'Feb 21, 10:30 AM', desc: 'Site visit booked for Feb 22.', state: 'done' },
      { label: 'Repair Work In Progress', date: 'Feb 23, 9:00 AM', desc: 'Crew on site. Estimated 2 days.', state: 'active' },
      { label: 'Resolved & Verified', date: 'Pending', desc: 'Awaiting completion sign-off.', state: 'pending' },
    ]
  },
  'CC-1031': {
    id: '#CC-1031', title: 'Garbage Overflow – Market Area',
    cat: 'Sanitation', loc: 'Tollygunge, Kolkata',
    date: 'Feb 18, 2026', dept: 'Municipal Sanitation Wing',
    status: 'resolved', progress: 100,
    timeline: [
      { label: 'Complaint Registered', date: 'Feb 18, 7:02 AM', desc: 'Received and logged.', state: 'done' },
      { label: 'Assigned to Sanitation', date: 'Feb 18, 7:03 AM', desc: 'Ward Officer notified.', state: 'done' },
      { label: 'Cleanup Initiated', date: 'Feb 18, 11:00 AM', desc: 'Team dispatched.', state: 'done' },
      { label: 'Resolved & Verified', date: 'Feb 18, 3:30 PM', desc: 'Area cleaned and photographed.', state: 'done' },
    ]
  },
  'CC-0094': {
    id: '#CC-0094', title: 'Street Light Out – MG Road',
    cat: 'Street Lights', loc: 'Park Street, Kolkata',
    date: 'Feb 22, 2026', dept: 'Urban Lighting Dept.',
    status: 'new', progress: 10,
    timeline: [
      { label: 'Complaint Registered', date: 'Feb 22, 6:45 PM', desc: 'Your report was received.', state: 'done' },
      { label: 'Pending Assignment', date: '—', desc: 'Awaiting department routing.', state: 'active' },
      { label: 'Field Repair', date: 'Pending', desc: '', state: 'pending' },
      { label: 'Resolved', date: 'Pending', desc: '', state: 'pending' },
    ]
  }
};

const allComplaints = [
  { id: '#CC-2847', title: 'Broken Road – NH-12 Junction', cat: '🚧 Road', status: 'inprogress' },
  { id: '#CC-1031', title: 'Garbage Overflow – Market Area', cat: '🗑 Sanitation', status: 'resolved' },
  { id: '#CC-0094', title: 'Street Light Out – MG Road', cat: '💡 Street Light', status: 'new' },
  { id: '#CC-3210', title: 'Water Pipe Burst – Lake View', cat: '💧 Water', status: 'resolved' },
  { id: '#CC-4451', title: 'Pothole – EM Bypass', cat: '🚧 Road', status: 'inprogress' },
  { id: '#CC-5500', title: 'Overflowing Drain – Behala', cat: '🗑 Sanitation', status: 'new' },
];

// Render complaint list
function renderList() {
  const container = document.getElementById('complaintsList');
  container.innerHTML = allComplaints.map(c => `
    <div class="complaint-row" data-id="${c.id.replace('#','')}">
      <span class="cr-id">${c.id}</span>
      <span class="cr-title">${c.title}</span>
      <span class="cr-cat">${c.cat}</span>
      <span class="cr-status ${c.status}">${statusLabel(c.status)}</span>
    </div>
  `).join('');

  container.querySelectorAll('.complaint-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      document.getElementById('trackInput').value = id;
      doTrack(id);
    });
  });
}

function statusLabel(s) {
  return { new: 'New', inprogress: 'In Progress', resolved: 'Resolved' }[s] || s;
}

function doTrack(rawId) {
  const id = rawId.replace('#', '').toUpperCase();
  const data = complaints[id];
  const result = document.getElementById('trackResult');

  if (!data) {
    result.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--muted);">No complaint found for <strong style="color:var(--green)">#${id}</strong>. Try CC-2847, CC-1031, or CC-0094.</div>`;
    result.classList.remove('hidden');
    return;
  }

  document.getElementById('resId').textContent = data.id;
  document.getElementById('resTitle').textContent = data.title;
  document.getElementById('resLoc').textContent = data.loc;
  document.getElementById('resCat').textContent = data.cat;
  document.getElementById('resDate').textContent = 'Reported: ' + data.date;
  document.getElementById('resDept').textContent = data.dept;

  const badge = document.getElementById('resBadge');
  badge.textContent = statusLabel(data.status);
  badge.className = 'result-status-badge ' + data.status;

  // Timeline
  const tl = document.getElementById('timeline');
  tl.innerHTML = data.timeline.map(item => `
    <div class="tl-item">
      <div class="tl-left">
        <div class="tl-dot ${item.state}"></div>
        <div class="tl-line"></div>
      </div>
      <div class="tl-body">
        <div class="tl-label">${item.label}</div>
        <div class="tl-date">${item.date}</div>
        ${item.desc ? `<div class="tl-desc">${item.desc}</div>` : ''}
      </div>
    </div>
  `).join('');

  // Progress bar
  document.getElementById('progressPct').textContent = data.progress + '%';
  const fill = document.getElementById('progressFill');
  fill.style.width = '0%';
  setTimeout(() => fill.style.width = data.progress + '%', 200);

  result.classList.remove('hidden');
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// TRACK BUTTON
document.getElementById('trackBtn').addEventListener('click', () => {
  doTrack(document.getElementById('trackInput').value.trim());
});
document.getElementById('trackInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') doTrack(document.getElementById('trackInput').value.trim());
});

// DEMO IDS
document.querySelectorAll('.demo-id').forEach(el => {
  el.addEventListener('click', () => {
    document.getElementById('trackInput').value = el.dataset.id;
    doTrack(el.dataset.id);
  });
});

renderList();
