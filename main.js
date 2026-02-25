// main.js – Homepage interactions

// Animate stats counting up
function animateCount(el, target) {
  let start = 0;
  const dur = 1600;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / dur, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

// Intersection observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animation = 'fadeUp .7s ease both';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feat-card, .step').forEach(el => observer.observe(el));

// Animate stat numbers on scroll
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const nums = document.querySelectorAll('.stat-num');
      animateCount(nums[0], 2841);
      setTimeout(() => { if(nums[1]) nums[1].textContent = '94%'; }, 800);
      animateCount(nums[2], 12);
      statObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statObserver.observe(statsEl);

// Animate card fill bars
setTimeout(() => {
  document.querySelectorAll('.card-fill').forEach(fill => {
    const target = fill.style.width;
    fill.style.width = '0';
    setTimeout(() => fill.style.width = target, 300);
  });
}, 500);
