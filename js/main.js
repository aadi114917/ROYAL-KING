/* ============================================================
   MATKA KING – Main JavaScript
   ============================================================ */

/* ---- Utility: random number between min & max ---- */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ---- Utility: format number to 2-digit string ---- */
function pad2(n) {
  return String(n).padStart(2, '0');
}

/* ---- Generate a realistic matka result string "XX-X-XX" ---- */
function mkResult() {
  const open   = rand(10, 99);
  const openD  = (open % 10 + Math.floor(open / 10)) % 10;
  const close  = rand(10, 99);
  const closeD = (close % 10 + Math.floor(close / 10)) % 10;
  return `${open}-${openD}${closeD}-${close}`;
}

/* ---- Format a Date object to "DD Mon YYYY" ---- */
function formatDate(d) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${pad2(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/* ---- Get day abbreviation ---- */
function dayAbbr(d) {
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
}

/* ============================================================
   LIVE RESULT TABLE
   Shows last 10 days of results (today highlighted)
   ============================================================ */
function buildLiveResults() {
  const tbody = document.getElementById('liveResultBody');
  if (!tbody) return;

  const rows = [];
  const today = new Date();

  for (let i = 9; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const isToday  = i === 0;
    const markets  = ['mumbai', 'goa', 'bengaluru', 'chennai', 'hyderabad'];

    // Future dates → pending
    const cells = markets.map(() => isToday ? mkResult() : mkResult());

    rows.push({
      date:     formatDate(d),
      day:      dayAbbr(d),
      isToday,
      cells
    });
  }

  tbody.innerHTML = rows.map(r => `
    <tr class="${r.isToday ? 'latest-row' : ''}">
      <td>
        <strong>${r.date}</strong>
        <br /><small>${r.day}</small>
        ${r.isToday ? '<span class="latest-tag">LATEST</span>' : ''}
      </td>
      <td>${r.cells[0]}</td>
      <td>${r.cells[1]}</td>
      <td>${r.cells[2]}</td>
      <td>${r.cells[3]}</td>
      <td>${r.cells[4]}</td>
    </tr>
  `).join('');
}

/* ============================================================
   MONTHLY CHART TABLE
   Shows all 31 days for the current month
   ============================================================ */
function buildMonthlyChart() {
  const tbody = document.getElementById('monthlyBody');
  const monthLabel = document.getElementById('currentMonth');
  if (!tbody) return;

  const today   = new Date();
  const year    = today.getFullYear();
  const month   = today.getMonth();
  const todayD  = today.getDate();

  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

  if (monthLabel) monthLabel.textContent = `${months[month]} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = '';
  for (let d = 1; d <= 31; d++) {
    const isValidDay = d <= daysInMonth;
    const isPast     = d <= todayD && isValidDay;
    const isToday    = d === todayD && isValidDay;

    let cells = '';
    for (let m = 0; m < 5; m++) {
      if (!isValidDay) {
        cells += `<td class="no-result">—</td>`;
      } else if (!isPast) {
        cells += `<td class="no-result">○</td>`;
      } else {
        cells += `<td>${mkResult()}</td>`;
      }
    }

    html += `
      <tr class="${isToday ? 'today-row' : ''}">
        <td>${pad2(d)}${isToday ? ' <span class="latest-tag">TODAY</span>' : ''}</td>
        ${cells}
      </tr>
    `;
  }

  tbody.innerHTML = html;
}

/* ============================================================
   RECORD CHART MODAL
   ============================================================ */
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun',
                      'Jul','Aug','Sep','Oct','Nov','Dec'];

function showRecordModal(title, key) {
  const overlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody  = document.getElementById('modalBody');

  if (!overlay || !modalTitle || !modalBody) return;

  modalTitle.textContent = `📊 ${title} – Record Chart`;

  const today = new Date();
  let rows = '';

  for (let i = 11; i >= 0; i--) {
    const d    = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const open = rand(10, 99);
    const close = rand(10, 99);
    const openD  = (open % 10 + Math.floor(open / 10)) % 10;
    const closeD = (close % 10 + Math.floor(close / 10)) % 10;
    const jodi   = `${openD}${closeD}`;

    rows += `
      <tr class="${i === 0 ? 'latest-row' : ''}">
        <td>${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}${i === 0 ? ' <span class="latest-tag">CURR</span>' : ''}</td>
        <td>${open}</td>
        <td>${jodi}</td>
        <td>${close}</td>
      </tr>
    `;
  }

  modalBody.innerHTML = rows;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    // Animate spans
    const spans = btn.querySelectorAll('span');
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close nav when a link is clicked
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('active');
      btn.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });
}

/* ============================================================
   ACTIVE NAV LINK ON SCROLL
   ============================================================ */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   AUTO-REFRESH TICKER with fresh numbers every 30s
   ============================================================ */
function refreshTicker() {
  const content = document.getElementById('tickerContent');
  if (!content) return;

  const markets = ['Mumbai', 'Goa', 'Bengaluru', 'Chennai', 'Hyderabad'];
  let html = '';
  markets.forEach((m, i) => {
    html += `${m}: <span class="tick-num">${mkResult()}</span>`;
    if (i < markets.length - 1) html += ' &nbsp;|&nbsp; ';
  });
  // Duplicate for seamless scroll
  content.innerHTML = html + ' &nbsp;&nbsp;&nbsp; ' + html;
}

/* ============================================================
   LIVE RESULT AUTO-UPDATE (every 60s for today's row)
   ============================================================ */
function scheduleAutoRefresh() {
  setInterval(() => {
    buildLiveResults();
    refreshTicker();
  }, 60000); // every 60 seconds
}

/* ============================================================
   NUMBER COUNT-UP ANIMATION FOR HERO STATS
   ============================================================ */
function countUp(el, target, duration = 1200, suffix = '') {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start) + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

function initCountUp() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const val = el.dataset.val;
        const suf = el.dataset.suffix || '';
        if (val) countUp(el, parseInt(val), 1200, suf);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-val]').forEach(el => observer.observe(el));
}

/* ============================================================
   SMOOTH HIGHLIGHT ON TABLE ROW HOVER (touch devices)
   ============================================================ */
function initTableTouch() {
  document.querySelectorAll('.result-table tbody tr').forEach(row => {
    row.addEventListener('touchstart', function() {
      this.style.background = 'rgba(225,29,72,0.1)';
    }, { passive: true });
    row.addEventListener('touchend', function() {
      setTimeout(() => { this.style.background = ''; }, 400);
    }, { passive: true });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildLiveResults();
  buildMonthlyChart();
  refreshTicker();
  initHamburger();
  initScrollSpy();
  initBackToTop();
  initCountUp();
  scheduleAutoRefresh();

  // Small delay for table touch init (after data rendered)
  setTimeout(initTableTouch, 500);

  // Show today's date in footer
  const footerBottom = document.querySelector('.footer-bottom p');
  if (footerBottom) {
    const yr = new Date().getFullYear();
    footerBottom.innerHTML = `&copy; ${yr} Matka King. All rights reserved. | For informational purposes only.`;
  }
});
