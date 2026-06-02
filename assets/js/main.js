/* =========================================================
   BOOSTER ($BOOST) — site logic
   Edit CONFIG below once the token is live on BASE.
   ========================================================= */

const CONFIG = {
  // ---- Token (fill these in after deploy on BASE) ----
  tokenAddress: "",   // e.g. "0xabc...def" (ERC-20 contract on BASE)
  pairAddress:  "",   // DexScreener pair address on BASE (for live stats)
  chain:        "base",

  // ---- Links ----
  links: {
    live:  "#",                       // Twitch / YouTube / Kick stream
    dex:   "https://aerodrome.finance/swap",   // buy link (set ?to=<token> after launch)
    chart: "https://dexscreener.com/base",     // becomes /base/<pair> after launch
    x:     "https://x.com/",          // your X / Twitter
    tg:    "https://t.me/",           // Telegram
    dc:    "https://discord.gg/",     // Discord
  },
};

/* ---------- helpers ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function fmtUsd(n) {
  if (n == null || isNaN(n)) return "—";
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  if (n < 1)    return "$" + n.toPrecision(3);
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/* ---------- year ---------- */
const yearEl = $("#year");
if (yearEl) {
  // Avoid hard-coding: derive from document if available, else leave default.
  try { yearEl.textContent = new Date().getFullYear(); } catch (_) {}
}

/* ---------- wire up links from CONFIG ---------- */
function applyLinks() {
  $$("[data-social]").forEach((a) => {
    const key = a.dataset.social;
    if (CONFIG.links[key]) {
      a.href = CONFIG.links[key];
      if (a.href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
    }
  });
  $$("[data-buy]").forEach((a) => {
    const key = a.dataset.buy;
    if (CONFIG.links[key]) {
      a.href = CONFIG.links[key];
      a.target = "_blank"; a.rel = "noopener";
    }
  });
}
applyLinks();

/* ---------- contract address ---------- */
function applyContract() {
  const display = CONFIG.tokenAddress || "TBA — launching soon";
  $$(".ca__value").forEach((el) => (el.textContent = CONFIG.tokenAddress
    ? CONFIG.tokenAddress.slice(0, 6) + "…" + CONFIG.tokenAddress.slice(-4)
    : display));
}
applyContract();

function copyContract(btn) {
  if (!CONFIG.tokenAddress) return;
  navigator.clipboard?.writeText(CONFIG.tokenAddress).then(() => {
    const tag = $(".ca__copy", btn);
    if (!tag) return;
    const prev = tag.textContent;
    tag.textContent = "Copied!";
    setTimeout(() => (tag.textContent = prev), 1400);
  });
}
["#copyCa", "#copyCa2"].forEach((id) => {
  const el = $(id);
  if (el) el.addEventListener("click", () => copyContract(el));
});

/* ---------- mobile nav ---------- */
const burger = $("#burger");
const navLinks = $(".nav__links");
if (burger && navLinks) {
  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $$(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---------- reveal on scroll ---------- */
const reveals = $$(".reveal");
if ("IntersectionObserver" in window && reveals.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          // small stagger for siblings
          setTimeout(() => e.target.classList.add("in"), (i % 4) * 70);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

/* ---------- live stats from DexScreener ---------- */
async function loadStats() {
  if (!CONFIG.pairAddress) return; // no pool yet → keep placeholders
  const url = `https://api.dexscreener.com/latest/dex/pairs/${CONFIG.chain}/${CONFIG.pairAddress}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    const p = data?.pairs?.[0] || data?.pair;
    if (!p) return;

    const set = (key, val) => {
      const el = $(`[data-stat="${key}"]`);
      if (el && val != null) el.textContent = val;
    };
    set("price", p.priceUsd ? fmtUsd(Number(p.priceUsd)) : "—");
    set("mcap",  fmtUsd(p.marketCap ?? p.fdv));
    set("liq",   fmtUsd(p.liquidity?.usd));

    // keep chart link pointing at the real pair
    $$('[data-buy="chart"]').forEach((a) => (a.href = p.url || a.href));
  } catch (_) {
    /* offline / blocked — placeholders stay */
  }
}
loadStats();
