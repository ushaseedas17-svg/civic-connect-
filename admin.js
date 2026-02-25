// admin.js – Admin Dashboard Logic

const DATA = [
  { id: 'CC-2847', title: 'Broken Road – NH-12 Junction', cat: 'road', catLabel: '🚧 Road', loc: 'Salt Lake, Sec V', date: 'Feb 20', status: 'inprogress' },
  { id: 'CC-1031', title: 'Garbage Overflow – Market Area', cat: 'garbage', catLabel: '🗑 Garbage', loc: 'Tollygunge', date: 'Feb 18', status: 'resolved' },
  { id: 'CC-0094', title: 'Street Light Out – MG Road', cat: 'streetlight', catLabel: '💡 Street Light', loc: 'Park Street', date: 'Feb 22', status: 'new' },
  { id: 'CC-3210', title: 'Water Pipe Burst – Lake View', cat: 'water', catLabel: '💧 Water', loc: 'Jadavpur', date: 'Feb 17', status: 'resolved' },
  { id: 'CC-4451', title: 'Pothole Cluster – EM Bypass', cat: 'road', catLabel: '🚧 Road', loc: 'Kasba', date: 'Feb 21', status: 'inprogress' },
  { id: 'CC-5500', title: 'Overflowing Drain – Behala', cat: 'garbage', catLabel: '🗑 Garbage', loc: 'Behala', date: 'Feb 23', status: 'new' },
  { id: 'CC-6711', title: 'Power Outage – Residential Block', cat: 'electric', catLabel: '⚡ Electric', loc: 'New Town', date: 'Feb 22', status: 'new' },
  { id: 'CC-7832', title: 'Water Logging – Main Road', cat: 'water', catLabel: '💧 Water', loc: 'Garia', date: 'Feb 19', status: 'resolved' },
  { id: 'CC-8900', title: 'Damaged Footpath – City Center', cat: 'road', catLabel: '🚧 Road', loc: 'Esplanade', date: 'Feb 24', status: 'inprogress' },
];

let activeFilter = 'all';
let activeStatus = 'all';
let searchQ = '';
let currentEditId = null;

function statusLabel(s) {
  return { new: 'New', inprogress: 'In Progress', resolved: 'Resolved' }[s] || s;
}

function filtered() {
  return DATA.filter(d => {
    const catOk = activeFilter === 'all' || d.cat === activeFilter;
    const statusOk = activeStatus === 'all' || d.status === activeStatus;
    const q = searchQ.toLowerCase();
    const searchOk = !q || d.id.toLowerCase().includes(q) || d.title.toLowerCase().includes(q) || d.loc.toLowerCase().includes(q);
    return catOk && statusOk && searchOk;
  });
}

function renderTable() {
  const rows = filtered();
  const tbody = document.getElementById('adminTableBody');
  tbody.innerHTML = rows.map(d => `
    <tr>
      <td><span class="table-id">#${d.id}</span></td>
      <td>${d.title}</td>
      <td>${d.catLabel}</td>
      <td>${d.loc}</td>
      <td>${d.date}</td>
      <td><span class="table-status ${d.status}">${statusLabel(d.status)}</span></td>
      <td><button class="table-action-btn" data-id="${d.id}">Update ↗</button></td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.table-action-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.id));
  });
}

function renderKPIs() {
  const all = DATA;
  document.getElementById('kpiTotal').textContent = all.length;
  document.getElementById('kpiNew').textContent = all.filter(d => d.status === 'new').length;
  document.getElementById('kpiProgress').textContent = all.filter(d => d.status === 'inprogress').length;
  document.getElementById('kpiResolved').textContent = all.filter(d => d.status === 'resolved').length;
}

function renderBarChart() {
  const cats = {
    '🚧 Road': DATA.filter(d => d.cat === 'road').length,
    '🗑 Garbage': DATA.filter(d => d.cat === 'garbage').length,
    '💧 Water': DATA.filter(d => d.cat === 'water').length,
    '⚡ Electric': DATA.filter(d => d.cat === 'electric').length,
    '💡 Lights': DATA.filter(d => d.cat === 'streetlight').length,
  };
  const max = Math.max(...Object.values(cats));
  document.getElementById('barChart').innerHTML = Object.entries(cats).map(([label, count]) => `
    <div class="bar-row">
      <span class="bar-label">${label}</span>
      <div class="bar-track">
        <div class="bar-fill-inner" style="width:${(count/max*100)}%"></div>
      </div>
      <span class="bar-count">${count}</span>
    </div>
  `).join('');
}

// Sidebar filters
document.querySelectorAll('.sidebar-item[data-filter]').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-item[data-filter]').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    activeFilter = item.dataset.filter;
    renderTable();
  });
});
document.querySelectorAll('.sidebar-item[data-status]').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-item[data-status]').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    activeStatus = item.dataset.status;
    renderTable();
  });
});

// Search
document.getElementById('adminSearch').addEventListener('input', e => {
  searchQ = e.target.value;
  renderTable();
});

// Modal
function openModal(id) {
  currentEditId = id;
  document.getElementById('modalComplaintId').textContent = '#' + id;
  document.getElementById('statusModal').classList.remove('hidden');
}
document.getElementById('closeStatusModal').addEventListener('click', () => {
  document.getElementById('statusModal').classList.add('hidden');
});
document.querySelectorAll('.status-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const newStatus = btn.dataset.status;
    const item = DATA.find(d => d.id === currentEditId);
    if (item) {
      item.status = newStatus;
      renderTable();
      renderKPIs();
    }
    document.getElementById('statusModal').classList.add('hidden');
  });
});

// Init
renderKPIs();
renderTable();
renderBarChart();

// Animate bars in
setTimeout(() => {
  document.querySelectorAll('.bar-fill-inner').forEach(bar => {
    const target = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => bar.style.width = target, 100);
  });
}, 300);

// Animate KPI counts
function animateCount(el, target) {
  let start = 0;
  const dur = 1000;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor(p * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
setTimeout(() => {
  animateCount(document.getElementById('kpiTotal'), DATA.length);
  animateCount(document.getElementById('kpiNew'), DATA.filter(d=>d.status==='new').length);
  animateCount(document.getElementById('kpiProgress'), DATA.filter(d=>d.status==='inprogress').length);
  animateCount(document.getElementById('kpiResolved'), DATA.filter(d=>d.status==='resolved').length);
}, 200);
