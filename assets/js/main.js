// ---------- helpers ----------
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

/* ---------- year ---------- */
$("#year").textContent = new Date().getFullYear();

/* ---------- mobile menu ---------- */
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");

menuBtn.addEventListener("click", () => {
  const open = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", String(!open));
  mobileMenu.hidden = open;
});

mobileMenu.addEventListener("click", (e) => {
  if (e.target.classList.contains("navlink")) {
    menuBtn.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  }
});

/* ---------- theme toggle (persist) ---------- */
const themeBtn = $("#themeBtn");
const themeIcon = themeBtn.querySelector(".icon");

function applyTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  themeIcon.textContent = mode === "light" ? "☀" : "☾";
  localStorage.setItem("theme", mode);
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  applyTheme(savedTheme);
} else {
  applyTheme("dark");
}

themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ---------- typing effect ---------- */
const typingEl = $("#typing");
const roles = [
  "data engineering",
  "machine learning workflows",
  "SQL + databases",
  "analytics & reporting"
];

let roleIdx = 0;
let charIdx = 0;
let deleting = false;

function tick() {
  const word = roles[roleIdx];
  const speed = deleting ? 30 : 55;

  typingEl.textContent = word.slice(0, charIdx);

  if (!deleting && charIdx < word.length) {
    charIdx++;
  } else if (!deleting && charIdx === word.length) {
    deleting = true;
    setTimeout(tick, 700);
    return;
  } else if (deleting && charIdx > 0) {
    charIdx--;
  } else {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
  }

  setTimeout(tick, speed);
}
tick();

/* ---------- scroll reveal ---------- */
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  for (const ent of entries) {
    if (ent.isIntersecting) ent.target.classList.add("show");
  }
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

/* ---------- active nav highlight ---------- */
const sections = ["about", "work", "skills", "contact"].map(id => document.getElementById(id));
const navLinks = $$(".navlink");

function setActive(id) {
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
}

const ioNav = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting) setActive(ent.target.id);
  });
}, { threshold: 0.35 });

sections.forEach(s => ioNav.observe(s));

/* ---------- project filters ---------- */
const filterBtns = $$(".pill");
const cards = $$(".grid.cards .card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const f = btn.dataset.filter;

    cards.forEach(c => {
      const tags = (c.dataset.tags || "").split(" ");
      const show = f === "all" || tags.includes(f);
      c.style.display = show ? "" : "none";
    });
  });
});

/* ---------- modals ---------- */
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add("show");
  m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(m) {
  m.classList.remove("show");
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$$(".card-open").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.modal));
});

$$(".modal").forEach(m => {
  m.addEventListener("click", (e) => {
    const close = e.target.matches("[data-close]") || e.target.classList.contains("modal");
    if (close) closeModal(m);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $$(".modal.show").forEach(m => closeModal(m));
  }
});

/* ---------- back to top ---------- */
const topBtn = $("#topBtn");
window.addEventListener("scroll", () => {
  topBtn.classList.toggle("show", window.scrollY > 500);
});
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- contact form: mailto ---------- */
window.sendMail = function (e) {
  e.preventDefault();
  const name = $("#fName").value.trim();
  const email = $("#fEmail").value.trim();
  const msg = $("#fMsg").value.trim();

  const subject = encodeURIComponent(`Website message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
  window.location.href = `mailto:Sai.Krishna.Bharadwaj.Burra-1@ou.edu?subject=${subject}&body=${body}`;
  return false;
};

/* ---------- particles (subtle) ---------- */
const canvas = $("#fx");
const ctx = canvas.getContext("2d");
let w, h, particles;

function resize() {
  w = canvas.width = window.innerWidth * devicePixelRatio;
  h = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  init();
}

function init() {
  const count = Math.min(90, Math.floor(window.innerWidth / 14));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: (Math.random() * 1.2 + 0.6) * devicePixelRatio,
    vx: (Math.random() - 0.5) * 0.15 * devicePixelRatio,
    vy: (Math.random() - 0.5) * 0.15 * devicePixelRatio,
    a: Math.random() * 0.5 + 0.15
  }));
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  // color adapts to theme
  const theme = document.documentElement.getAttribute("data-theme") || "dark";
  const dot = theme === "light" ? "rgba(20,30,50," : "rgba(200,220,255,";

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -20) p.x = w + 20;
    if (p.x > w + 20) p.x = -20;
    if (p.y < -20) p.y = h + 20;
    if (p.y > h + 20) p.y = -20;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `${dot}${p.a})`;
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
draw();
