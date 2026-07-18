// ============================================================
// DATA
// ============================================================

const personas = {
  oreo: {
    name: "Andrey Oreo",
    initials: "AO",
    role: "Junior Moderator · LIVE RUSSIA — Севастополь",
    desc: "Действующий позывной. Служба начата 07.07.2026 в Севастополе, после закрытия личного дела Frank Zetix.",
    archive: false,
    since: "07.07.2026",
    cities: {
      "Севастополь": [
        { title: "Support", from: "07.07.2026", to: "12.07.2026", status: "left", note: "" },
        { title: "Junior Moderator", from: "12.07.2026", to: null, status: "current", note: "" },
      ]
    }
  },
  zetix: {
    name: "Frank Zetix",
    initials: "FZ",
    role: "Архивное личное дело · закрыто 01.07.2026",
    desc: "Прежний позывной. Прошёл путь от Support до Administrator в трёх городах проекта: Москва → Ялта → Севастополь.",
    archive: true,
    since: "13.08.2025",
    cities: {
      "Москва": [
        { title: "Support", from: "13.08.2025", to: "06.09.2025", status: "left", note: "" },
        { title: "Junior Moderator", from: "06.09.2025", to: "15.09.2026", status: "left", note: "" },
        { title: "Moderator", from: "15.09.2026", to: "21.10.2026", status: "left", note: "" },
        { title: "Administrator", from: "21.10.2025", to: "12.11.2025", status: "left", note: "" },
        { title: "ZGS GOSS", from: "12.11.2025", to: "17.12.2025", status: "transfer", note: "Перевод на Ялту" },
      ],
      "Ялта": [
        { title: "Administrator", from: "20.12.2025", to: "06.01.2026", status: "left", note: "" },
        { title: "Senior Administrator", from: "06.01.2026", to: "27.04.2026", status: "left", note: "По собственному желанию" },
      ],
      "Севастополь": [
        { title: "Deputy Chief Physician of the NRB", from: "28.05.2026", to: "05.06.2026", status: "left", note: "" },
        { title: "Support", from: "01.06.2026", to: "05.06.2026", status: "left", note: "" },
        { title: "Junior Moderator", from: "05.06.2026", to: "11.06.2026", status: "left", note: "" },
        { title: "Moderator", from: "11.06.2026", to: "24.06.2026", status: "left", note: "" },
        { title: "Administrator", from: "24.06.2026", to: "01.07.2026", status: "removed", note: "Снят решением спецадминистрации проекта" },
      ]
    }
  }
};

const statusLabel = {
  current: "по наст. время",
  transfer: "перевод",
  removed: "снят",
  left: "",
};

// small inline "server" glyph — three racked units with a live LED
function serverIcon(){
  return `
  <svg class="server-icon" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="3"  width="20" height="5" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <rect x="2" y="9.5" width="20" height="5" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <rect x="2" y="16" width="20" height="5" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <circle cx="6" cy="5.5" r="0.9" fill="currentColor"/>
    <circle cx="6" cy="12" r="0.9" fill="currentColor"/>
    <circle cx="6" cy="18.5" r="0.9" fill="currentColor"/>
  </svg>`;
}

// ============================================================
// RENDER: ID CARD
// ============================================================

function renderIdCard(key){
  const p = personas[key];
  const card = document.getElementById('idcard');

  card.innerHTML = `
    <div class="idcard__face ${p.archive ? 'is-archive' : ''}">
      <div class="idcard__badge ${p.archive ? 'idcard__badge--archive' : ''}">
        <img src="assets/emblem-256.png" alt="Эмблема ${p.name}">
      </div>
      <div>
        <h3 class="idcard__name">${p.name}</h3>
        <p class="idcard__role">${p.role}</p>
        <p class="idcard__desc">${p.desc}</p>
        <div class="idcard__meta">
          <span>Начало службы: <b>${p.since}</b></span>
          <span>Статус: <b>${p.archive ? 'архив' : 'действующее дело'}</b></span>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// RENDER: SERVICE RECORD (both personas shown, grouped)
// ============================================================

function renderRecord(){
  const body = document.getElementById('recordBody');
  let html = '';

  Object.entries(personas).forEach(([key, p]) => {
    html += `<div class="persona-record" data-persona-record="${key}">`;
    html += `<p class="section-label persona-record__label">${p.name}${p.archive ? ' — архив' : ' — действующее'}</p>`;

    Object.entries(p.cities).forEach(([server, ranks]) => {
      const isOnline = ranks.some(r => r.status === 'current');
      html += `
        <div class="server-card">
          <div class="server-card__header">
            <span class="server-card__icon">${serverIcon()}</span>
            <span class="server-card__name">Сервер «${server}»</span>
            <span class="server-card__status ${isOnline ? 'is-online' : 'is-offline'}">
              <span class="server-card__blip"></span>${isOnline ? 'на линии' : 'архив'}
            </span>
          </div>
          <div class="server-card__body">`;
      ranks.forEach(r => {
        const toLabel = r.to ? r.to : 'наст. время';
        const statusClass = `rank-row__status--${r.status}`;
        html += `
          <div class="rank-row">
            <span class="rank-row__dates">${r.from} — ${toLabel}</span>
            <span>
              <span class="rank-row__title">${r.title}</span>
              ${r.note ? `<span class="rank-row__note">${r.note}</span>` : ''}
            </span>
            <span class="rank-row__status ${statusClass}">${statusLabel[r.status]}</span>
          </div>
        `;
      });
      html += `</div></div>`;
    });

    html += `</div>`;
  });

  body.innerHTML = html;
}

// ============================================================
// INTERACTIONS
// ============================================================

document.querySelectorAll('.idcard-switch__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.idcard-switch__btn').forEach(b => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    renderIdCard(btn.dataset.persona);
  });
});

renderIdCard('oreo');
renderRecord();

// subtle 3D tilt on the id card (disabled for touch / reduced-motion)
const idcardWrap = document.getElementById('idcard');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

if(!prefersReduced && !isTouch){
  idcardWrap.addEventListener('mousemove', (e) => {
    const face = idcardWrap.querySelector('.idcard__face');
    if(!face) return;
    const rect = face.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    face.style.transform = `rotateY(${x * 4}deg) rotateX(${y * -4}deg) translateZ(0)`;
  });
  idcardWrap.addEventListener('mouseleave', () => {
    const face = idcardWrap.querySelector('.idcard__face');
    if(face) face.style.transform = '';
  });
}

// scroll reveal for rank rows
const rows = document.querySelectorAll('.rank-row');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if(entry.isIntersecting){
      setTimeout(() => entry.target.classList.add('is-visible'), i * 30);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
rows.forEach(row => io.observe(row));

// scroll reveal for section headings
const revealEls = document.querySelectorAll('.reveal');
const ioReveal = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      ioReveal.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
revealEls.forEach(el => ioReveal.observe(el));
