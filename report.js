// report.js – Issue reporting page logic

const catLabels = {
  road: '🚧 Broken Road',
  garbage: '🗑 Garbage',
  water: '💧 Water Leakage',
  electric: '⚡ Electricity',
  streetlight: '💡 Street Light',
  other: '📌 Other'
};

const autoCatRoutes = {
  road: 'PWD – Roads Department → Sector Engineer',
  garbage: 'Municipal Sanitation Wing → Ward Officer',
  water: 'Water Supply Authority → Maintenance Cell',
  electric: 'CESC / WBSEDCL → Field Supervisor',
  streetlight: 'Urban Lighting Dept. → Zone Controller',
  other: 'General Services → Civic Helpdesk'
};

// ── IMAGE UPLOAD ──
const uploadZone = document.getElementById('uploadZone');
const fileInput  = document.getElementById('fileInput');
const previewImg = document.getElementById('previewImg');
const uploadInner= document.getElementById('uploadInner');
const removeBtn  = document.getElementById('removeImg');

function showPreview(file) {
  const reader = new FileReader();
  reader.onload = e => {
    previewImg.src = e.target.result;
    previewImg.classList.remove('hidden');
    uploadInner.classList.add('hidden');
    removeBtn.classList.remove('hidden');

    // Update live preview
    const prevPhotoBox = document.getElementById('prevPhotoBox');
    prevPhotoBox.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;"/>`;
  };
  reader.readAsDataURL(file);
}

uploadZone.addEventListener('click', (e) => {
  if (e.target !== removeBtn) fileInput.click();
});
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) showPreview(fileInput.files[0]);
});

// Drag & drop
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault(); uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) showPreview(file);
});

removeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  previewImg.classList.add('hidden');
  uploadInner.classList.remove('hidden');
  removeBtn.classList.add('hidden');
  fileInput.value = '';
  document.getElementById('prevPhotoBox').innerHTML = '<span>📷 Photo preview</span>';
});

// ── CATEGORY SELECTION ──
document.querySelectorAll('.cat-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    const cat = opt.dataset.cat;
    document.getElementById('selectedCat').value = cat;
    document.getElementById('prevCat').textContent = catLabels[cat];

    // Update auto-cat box
    const box = document.getElementById('autoCatBox');
    box.innerHTML = `
      <div class="auto-cat-label">🤖 Auto-Routing</div>
      <p style="color:var(--green);font-weight:600;margin-top:.4rem;">${catLabels[cat]}</p>
      <p style="margin-top:.4rem;">${autoCatRoutes[cat]}</p>
    `;
  });
});

// ── LOCATION ──
const locationInput = document.getElementById('locationInput');
locationInput.addEventListener('input', () => {
  document.getElementById('prevLoc').textContent = locationInput.value || '—';
});

document.getElementById('locateBtn').addEventListener('click', () => {
  const btn = document.getElementById('locateBtn');
  btn.textContent = '📍 Locating...';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const loc = `${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`;
      locationInput.value = loc;
      document.getElementById('prevLoc').textContent = loc;
      btn.textContent = '📍 Located ✓';
      btn.style.color = 'var(--green)';

      // Animate map pin
      const pin = document.getElementById('mapPin');
      pin.style.transform = 'scale(1.4)';
      setTimeout(() => pin.style.transform = 'scale(1)', 400);
    }, () => {
      locationInput.value = 'Salt Lake, Sector V, Kolkata';
      document.getElementById('prevLoc').textContent = locationInput.value;
      btn.textContent = '📍 Pinned ✓';
    });
  } else {
    locationInput.value = 'Salt Lake, Sector V, Kolkata';
    btn.textContent = '📍 Done ✓';
  }
});

// Map click
document.getElementById('mapBox').addEventListener('click', (e) => {
  const pin = document.getElementById('mapPin');
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(0);
  const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(0);
  pin.style.position = 'absolute';
  pin.style.left = x + '%';
  pin.style.top = y + '%';
  pin.style.transform = 'translate(-50%, -50%) scale(1.3)';
  setTimeout(() => pin.style.transform = 'translate(-50%, -50%) scale(1)', 400);
  document.querySelector('.map-label').textContent = `Pin at ${x}%, ${y}%`;
});

// ── ID GENERATION ──
function genId() {
  return '#CC-' + Math.floor(1000 + Math.random() * 9000);
}
const previewId = genId();
document.getElementById('prevId').textContent = previewId;

// ── FORM SUBMIT ──
document.getElementById('reportForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.textContent = '⏳ Submitting...';
  btn.disabled = true;

  setTimeout(() => {
    const id = genId();
    document.getElementById('modalId').textContent = id;
    document.getElementById('successModal').classList.remove('hidden');
    btn.textContent = 'Submit Report →';
    btn.disabled = false;
  }, 1200);
});

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('successModal').classList.add('hidden');
  document.getElementById('reportForm').reset();
  // Reset UI state
  document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected'));
  previewImg.classList.add('hidden');
  uploadInner.classList.remove('hidden');
  removeBtn.classList.add('hidden');
  document.getElementById('prevPhotoBox').innerHTML = '<span>📷 Photo preview</span>';
  document.getElementById('prevCat').textContent = '—';
  document.getElementById('prevLoc').textContent = '—';
});
