import { CARDS, cardById, escalatedClone, severityOf, type GameCard, type Choice } from "./cards";
import { applyEffects, dueEvents, ignoreWanderChance, IGNORE_DELAY_SEC, isGameOver, qualityOf, resolveIgnore, spawnInterval, stageFor, STAGE_NAMES, type Meters, type Scheduled } from "./engine";

const app = document.getElementById("app")!;

/* ---------- CIO character: appearance evolves with performance ---------- */
function cioSVG(stage: number): string {
  const hair = [
    "M60 78 L38 18 L66 48 L78 6 L96 42 L118 4 L128 46 L156 14 L158 82 Z",
    "M62 76 L46 26 L72 46 L86 16 L102 44 L124 18 L136 52 L152 30 L152 78 Z",
    "M64 74 L56 34 L80 48 L98 28 L116 48 L138 34 L144 74 Z",
    "M66 68 Q105 30 144 68 L144 54 Q105 24 66 54 Z",
    "M66 66 Q105 32 144 66 L144 52 Q105 26 66 52 Z",
    "M66 66 Q105 32 144 66 L144 52 Q105 26 66 52 Z",
  ][stage];
  const eyes = stage <= 1
    ? `<circle cx="84" cy="96" r="11" fill="#fff" stroke="#141414" stroke-width="3"/><circle cx="126" cy="96" r="11" fill="#fff" stroke="#141414" stroke-width="3"/><circle cx="84" cy="96" r="4" fill="red"/><circle cx="126" cy="96" r="4" fill="red"/><path d="M76 90 l16 12 M92 90 l-16 12 M118 90 l16 12 M134 90 l-16 12" stroke="red" stroke-width="1.6"/>`
    : stage === 2
    ? `<circle cx="84" cy="96" r="10" fill="#fff" stroke="#141414" stroke-width="3"/><circle cx="126" cy="96" r="10" fill="#fff" stroke="#141414" stroke-width="3"/><circle cx="84" cy="98" r="4" fill="#141414"/><circle cx="126" cy="98" r="4" fill="#141414"/><path d="M70 82 q14 -8 28 0 M112 82 q14 -8 28 0" stroke="#141414" stroke-width="3" fill="none"/>`
    : stage >= 5
    ? `<rect x="62" y="84" width="86" height="22" rx="11" fill="#141414"/><rect x="70" y="89" width="28" height="7" rx="3" fill="#7ee8ff"/>`
    : `<circle cx="84" cy="96" r="10" fill="#fff" stroke="#141414" stroke-width="3"/><circle cx="126" cy="96" r="10" fill="#fff" stroke="#141414" stroke-width="3"/><circle cx="84" cy="95" r="4" fill="#141414"/><circle cx="126" cy="95" r="4" fill="#141414"/>`;
  const mouth = ["M78 138 l12 -8 l12 8 l12 -8 l12 8", "M80 140 q25 -14 50 0", "M82 138 q23 10 46 0", "M84 132 q21 14 42 0", "M82 130 q23 20 46 0", "M78 128 q27 26 54 0"][stage];
  const shirt = ["#b8b8b8", "#cfd8dc", "#f5f5f5", "#bfe3ff", "#7ee08a", "#ff5f8f"][stage];
  const sweat = stage <= 1 ? `<text x="30" y="90" font-size="26">💧</text><text x="168" y="80" font-size="22">💧</text>` : "";
  const extra = stage === 5
    ? `<circle cx="182" cy="34" r="22" fill="#ffd21f" stroke="#141414" stroke-width="3"/><text x="168" y="178" font-size="30">🍹</text><text x="18" y="180" font-size="26">🌴</text>`
    : stage === 4 ? `<text x="164" y="70" font-size="24">😎</text>` : stage <= 1 ? `<text x="170" y="110" font-size="24">💢</text>` : "";
  const tie = stage <= 3 ? `<path d="M105 168 l10 0 l6 34 l-11 16 l-11 -16 Z" fill="${stage <= 1 ? "#ff3b30" : "#2255cc"}" stroke="#141414" stroke-width="3"/>` : stage === 4 ? "" : `<text x="74" y="196" font-size="20">🌺</text><text x="118" y="206" font-size="20">🌺</text>`;
  return `<svg viewBox="0 0 210 235" class="wobble" role="img" aria-label="The CIO, stage ${stage}">
    ${stage === 5 ? `<rect x="4" y="4" width="202" height="227" rx="18" fill="#8fe3ff" stroke="#141414" stroke-width="3"/>` : ""}
    ${extra}${sweat}
    <path d="M45 235 L60 168 Q105 148 150 168 L165 235 Z" fill="${shirt}" stroke="#141414" stroke-width="4"/>${tie}
    <circle cx="105" cy="105" r="52" fill="#ffd9b3" stroke="#141414" stroke-width="4"/>
    <path d="${hair}" fill="${stage >= 4 ? "#5a3a1a" : "#3a2a1a"}" stroke="#141414" stroke-width="3"/>
    ${eyes}<path d="${mouth}" stroke="#141414" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M58 122 q-12 4 0 16 M152 122 q12 4 0 16" stroke="#141414" stroke-width="3" fill="#ffd9b3"/>
  </svg>`;
}

/* ---------- Intro: punchy, staged, skippable (full read ≈ 2 min) ---------- */
const SLIDES = [
  { h: "📟 THE BACKSTORY", t: `You are the <b>CIO of a Very Serious Bank</b>. It is Monday. It is 8:59 a.m. Every department has discovered AI at the same time.<br><br>John from Marketing has uploaded <b>all customer data to ChatGPT</b> to make a PowerPoint. Charles wants payroll automated by a mystery SAP plugin. Fred has a security plan called “Mythos” and a cape. Sam is pitching AI concierges to billionaires. Alan is day-trading Bitcoin on Copilot's advice.<br><br>All of it runs on Copilot. All of it costs a fortune. <b>None of it is governed.</b>` },
  { h: "🎯 THE MISSION", t: `Survive the onslaught of request &amp; incident cards. Keep <b>Stress, Risk and Cost</b> below 100, keep <b>Board Confidence</b> above zero, and fill your <b>Chill meter</b> to reach RELAXATION — Hawaiian shirt, shorts, sunglasses, beach.<br><br>Good calls extend your timer and calm the bank. Reach <b>100 Chill</b> for instant beach mode, or survive to the final whistle with the bank intact.` },
  { h: "⚠️ THE TRAP (READ THIS!)", t: `Every card offers 3 strategies — <span class="kbd">INFRA</span> <span class="kbd">NETWORK</span> <span class="kbd">SOFTWARE</span>. The tempting quick win feels AMAZING now: stress melts, everyone's happy…<br><br>…then, 15–25 seconds later: <b>WHAM!</b> The consequence lands — worse than the original problem, often spawning a FOLLOW-UP card. Real CIOs play the long game. So should you.<br><br>Or hit <b>IGNORE</b> (<span class="kbd">0</span>): the requester loiters by your desk, relaxed, foot tapping… 3 seconds later they either get <b>BORED</b> and wander off (free win!) or come back <b>WORSE, with friends</b>. Ignoring 🤪 silly requests is often smart. Ignoring 🚨 serious ones is how sequels happen.<br><br>Your face will tell the story: wild hair &amp; bloodshot eyes when it's bad; smoothie &amp; sunglasses when you win.` },
  { h: "🤝 YOUR PARTNERS", t: `<b>Digital Realty</b> — colocation on PlatformDIGITAL®, high-density AI-ready halls, and ServiceFabric® private interconnection to clouds &amp; partners instead of the wild public internet.<br><b>Oracle</b> — Oracle Cloud Infrastructure (OCI), Autonomous Database, Fusion Applications (ERP/HCM) and OCI AI services: enterprise AI with governance and human approval.<br><b>OEM partners</b> — validated servers &amp; branch kit that arrive configured, not cursed.<br><br>Partner choices are usually the grown-up, long-game move. Click a card, then pick <span class="kbd">1</span> <span class="kbd">2</span> <span class="kbd">3</span> — or just tap. <b>GOOD LUCK. YOU'LL NEED IT.</b>` },
];
let slide = 0; let slideTimer: number | undefined;
function renderIntro() {
  clearInterval(slideTimer);
  slideTimer = window.setInterval(() => { if (slide < SLIDES.length - 1) { slide++; renderIntro(); } }, 30000);
  app.innerHTML = `<div id="intro"><div class="panel intro-box">
    <h1 class="logo">CIO<br>SIMULATOR!</h1>
    <p class="sub">💥 Survive the bank. Calm the chaos. Reach the beach. 💥</p>
    <div class="slide"><h2>${SLIDES[slide].h}</h2><p>${SLIDES[slide].t}</p></div>
    <div class="dots">${SLIDES.map((_, i) => `<i class="${i === slide ? "on" : ""}"></i>`).join("")}</div>
    <p><button class="ghost" id="prev" ${slide === 0 ? "disabled" : ""}>◀ Back</button>
    <button class="ghost" id="next">${slide === SLIDES.length - 1 ? "Re-read ↺" : "Next ▶"}</button></p>
    <button class="bigbtn" id="start">▶ START THE MADNESS!</button>
    <p><small>Full briefing: 4 panels (~2 min to read, auto-advances) — or start instantly. No forced waiting, CIOs are busy people.</small></p>
  </div></div>`;
  document.getElementById("start")!.onclick = () => { clearInterval(slideTimer); startGame(); };
  document.getElementById("next")!.onclick = () => { slide = slide === SLIDES.length - 1 ? 0 : slide + 1; renderIntro(); };
  document.getElementById("prev")!.onclick = () => { if (slide > 0) slide--; renderIntro(); };
}

/* ---------- Game state ---------- */
interface Live { uid: number; card: GameCard; loiterUntil?: number }
const waiting = () => inbox.filter((x) => x.loiterUntil === undefined);
const loitering = () => inbox.filter((x) => x.loiterUntil !== undefined);
let meters: Meters, timeLeft = 75, elapsed = 0, score = 0, combo = 0, bestCombo = 0;
let inbox: Live[] = [], selectedUid = 0, uidSeq = 1, deck: GameCard[] = [], consequences: Scheduled[] = [];
let log: string[] = [], over = false, timerId: number | undefined, lastSpawn = 0;

function shuffledDeck() { deck = CARDS.filter((x) => !x.followUp).sort(() => Math.random() - 0.5); }
function spawn(card?: GameCard) {
  if (!deck.length) shuffledDeck();
  const c = card ?? deck.pop()!;
  inbox.push({ uid: uidSeq++, card: c });
  if (!waiting().some((x) => x.uid === selectedUid)) selectedUid = waiting()[0]?.uid ?? 0;
  if (waiting().length > 5) { meters = applyEffects(meters, { stress: 5 }); burst("INBOX OVERFLOW!"); log.unshift("📥 Inbox overflow! +5 Stress — answer cards faster (or Ignore the silly ones)!"); }
}
function startGame() {
  meters = { stress: 45, risk: 40, cost: 30, confidence: 55, chill: 20 };
  timeLeft = 75; elapsed = 0; score = 0; combo = 0; bestCombo = 0; inbox = []; consequences = []; log = ["☎️ The phones begin to ring…"]; over = false; lastSpawn = 0; uidSeq = 1; selectedUid = 0;
  shuffledDeck();
  // Guarantee the five signature incidents appear early
  for (const id of ["john-chatgpt", "charles-payroll", "fred-mythos", "sam-hnw", "alan-bitcoin"]) { const c = cardById(id)!; deck = deck.filter((x) => x.id !== id); deck.push(c); }
  spawn(); spawn();
  selectedUid = inbox[0].uid;
  clearInterval(timerId); timerId = window.setInterval(tick, 200);
  render();
}
function burst(text: string) {
  const el = document.createElement("div"); el.className = "sfx"; el.textContent = text; document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}
function tick() {
  if (over) return;
  const dt = 0.2; elapsed += dt; timeLeft -= dt;
  if (elapsed - lastSpawn >= spawnInterval(elapsed)) { lastSpawn = elapsed; spawn(); }
  const { due, pending } = dueEvents(consequences, elapsed); consequences = pending;
  for (const ev of due) {
    meters = applyEffects(meters, ev.fx); burst(ev.sfx); log.unshift(`⏰ CONSEQUENCE! ${ev.text}`); combo = 0;
    if (ev.followUpId) spawn(cardById(ev.followUpId));
  }
  // Ignored requesters finish loitering (~3s): bored & gone, or back and WORSE.
  for (const live of loitering().filter((x) => x.loiterUntil! <= elapsed)) {
    inbox = inbox.filter((x) => x.uid !== live.uid);
    const sev = severityOf(live.card);
    const r = resolveIgnore(sev, Math.random());
    meters = applyEffects(meters, r.fx); score += r.fx.score ?? 0; burst(r.sfx);
    if (r.outcome === "wander") {
      log.unshift(`🥱 BORED… ${live.card.person} wandered off. Ignoring worked — this time. (+${r.fx.score} pts)`);
    } else {
      combo = 0;
      log.unshift(`😱 UH OH! Ignoring ${live.card.person} made it WORSE — Stress/Risk up, and it's back, escalated!`);
      spawn(escalatedClone(live.card));
      if (sev === 3) { spawn(); log.unshift("📚 …and it brought MORE requests with it. Classic."); }
    }
  }
  checkEnd();
  if (!over) render();
}
function checkEnd() {
  const reason = isGameOver(meters);
  if (reason) return end(false, reason);
  if (meters.chill >= 100) return end(true, "CHILL HIT 100! You didn't just survive the bank — you tamed it. Sunglasses on. Out-of-office: FOREVER (well, two weeks).");
  if (timeLeft <= 0) {
    const st = stageFor(meters);
    if (st >= 3) return end(true, "THE FINAL WHISTLE! The bank is calm, the board is smiling, and someone is booking you a flight with a little umbrella in the itinerary.");
    return end(false, "The clock ran out with the bank still wobbling like jelly in an earthquake. So close! The beach remains… theoretical.");
  }
}
function ignoreSelected() {
  if (over) return;
  const live = waiting().find((x) => x.uid === selectedUid);
  if (!live) return;
  live.loiterUntil = elapsed + IGNORE_DELAY_SEC;
  selectedUid = waiting().find((x) => x.uid !== live.uid)?.uid ?? 0;
  burst("🙈 IGNORED!");
  log.unshift(`🙈 You ignored ${live.card.person} (${live.card.dept}). They look… relaxed? They'll loiter for ${IGNORE_DELAY_SEC}s — bored, or brewing?`);
  render();
}
function choose(choice: Choice) {
  if (over) return;
  const q = qualityOf({ ...choice.fx, ...(choice.delayed ? { stress: 10, risk: 10 } : {}) });
  meters = applyEffects(meters, choice.fx);
  timeLeft += choice.fx.time ?? 0;
  if (q === "good") { combo++; bestCombo = Math.max(bestCombo, combo); } else if (q === "bad") combo = 0;
  const gained = Math.round((choice.fx.score ?? 50) * (1 + combo * 0.15));
  score += gained;
  log.unshift(`${choice.fx.score && q === "good" ? "✅" : "🎲"} ${choice.label} (+${gained} pts${combo > 1 ? `, combo ×${combo}` : ""})`);
  if (choice.delayed) {
    consequences.push({ at: elapsed + choice.delayed.afterSec, text: choice.delayed.text, fx: choice.delayed.fx, followUpId: choice.delayed.followUpId, sfx: choice.delayed.sfx });
    log.unshift(`🫣 Quick win taken… something is ticking (${choice.delayed.afterSec}s).`);
  }
  if (q === "good") burst(combo >= 3 ? `COMBO ×${combo}!` : "NICE!");
  inbox = inbox.filter((x) => x.uid !== selectedUid);
  selectedUid = waiting()[0]?.uid ?? 0;
  if (!waiting().length && !loitering().length) spawn();
  checkEnd();
  if (!over) render();
}
function end(won: boolean, reason: string) {
  over = true; clearInterval(timerId);
  const st = stageFor(meters);
  app.innerHTML = `<div class="end"><div class="panel end-box">
    <h1 class="logo" style="font-size:52px">${won ? "🏖️ RELAXATION!" : "💥 GAME OVER!"}</h1>
    <div style="max-width:240px;margin:0 auto">${cioSVG(won ? 5 : Math.min(st, 1))}</div>
    <p class="stage-name">${won ? "BEACH MODE 🏖️" : STAGE_NAMES[st]}</p>
    <p style="font-size:18px;line-height:1.5">${reason}</p>
    <p class="scorebox">SCORE: ${score} &nbsp;·&nbsp; BEST COMBO: ×${bestCombo} &nbsp;·&nbsp; SURVIVED: ${Math.floor(elapsed)}s</p>
    <p>Stress ${meters.stress} · Risk ${meters.risk} · Cost ${meters.cost} · Board Confidence ${meters.confidence} · Chill ${meters.chill}</p>
    <button class="bigbtn" id="again">↺ PLAY AGAIN!</button>
    <div class="log">${log.slice(0, 12).map((l) => `<div>${l}</div>`).join("")}</div>
  </div></div>`;
  document.getElementById("again")!.onclick = () => renderIntro();
}

function meter(label: string, v: number, color: string, invert = false) {
  const danger = invert ? v <= 25 : v >= 75;
  return `<div class="meter"><label><span>${label}</span><span>${v}</span></label><div class="bar"><i style="width:${v}%;background:${danger ? "var(--red)" : color}"></i></div></div>`;
}
const SEV_LABEL = ["", "🤪 SILLY", "😐 MEDIUM", "🚨 SERIOUS"];
function render() {
  const st = stageFor(meters);
  const sel = waiting().find((x) => x.uid === selectedUid) ?? waiting()[0];
  if (sel) selectedUid = sel.uid; else selectedUid = 0;
  app.innerHTML = `<div id="game">
    <div class="topbar">
      <div class="panel title-chip">CIO SIMULATOR!</div>
      <div class="meters">
        ${meter("😱 Stress", meters.stress, "#ff9f1a")}${meter("☣️ Risk", meters.risk, "#c44dff")}${meter("💸 Cost", meters.cost, "#ff4f9a")}
        ${meter("🏛️ Board Confidence", meters.confidence, "#22c7e8", true)}${meter("🏖️ Chill", meters.chill, "#37d35a", true)}
      </div>
      <div class="panel timer">⏱️ ${Math.max(0, Math.ceil(timeLeft))}s<div style="font-size:13px">SCORE ${score} · COMBO ×${combo}</div></div>
    </div>
    <div class="layout">
      <div>
        <div class="panel cio-box">${cioSVG(st)}<div><span class="stage-name">${STAGE_NAMES[st]}</span></div>
        <div class="scorebox">${consequences.length ? `⏳ ${consequences.length} consequence(s) ticking…` : "✨ No ticking time-bombs. Suspicious."}</div>
        <div class="log">${log.slice(0, 7).map((l) => `<div>${l}</div>`).join("")}</div></div>
        <h3>📥 INCOMING! (${waiting().length})</h3>
        <div class="queue">${waiting().map((x) => `<button class="qcard ${x.uid === selectedUid ? "sel" : ""} ${x.card.followUp ? "follow" : ""}" data-uid="${x.uid}">${x.card.emoji} ${x.card.title}<small>${x.card.person} · ${x.card.dept} · ${SEV_LABEL[severityOf(x.card)]}</small></button>`).join("")}</div>
        ${loitering().map((x) => `<div class="loiter"><span class="loiter-face">😌</span><div><b>${x.card.emoji} ${x.card.person} is loitering…</b><br><small>“…fine. FINE. I'll just wait here.” <span class="foot">🦶</span><i>taptaptap</i> — decides in ${Math.max(0, Math.ceil(x.loiterUntil! - elapsed))}s: 🥱 bored &amp; gone, or 😱 WORSE?</small></div></div>`).join("")}
      </div>
      <div class="panel active">
        ${sel ? `<span class="who">${sel.card.emoji} ${sel.card.person}</span> <span class="dept">${sel.card.dept}</span> <span class="dept" style="background:var(--yellow);color:var(--ink)">${SEV_LABEL[severityOf(sel.card)]}</span>
        <h2>${sel.card.title}</h2><p style="font-size:18px;line-height:1.5">${sel.card.body}</p>
        <div class="choices">${sel.card.choices.map((ch, i) => `<button class="choice" data-choice="${i}"><span class="lane">${ch.lane}</span> <b>${i + 1}. ${ch.label}</b> ${ch.partner ? `<span class="partner">★ ${ch.partner}</span>` : ""}<small>${ch.detail}</small></button>`).join("")}</div>
        <button class="ignorebtn" id="ignore">🙈 0 · IGNORE — pretend you're in a meeting <small style="display:block;font-weight:600">They'll loiter ~${IGNORE_DELAY_SEC}s looking relaxed… then 🥱 wander off bored (${Math.round(ignoreWanderChance(severityOf(sel.card)) * 100)}% for ${SEV_LABEL[severityOf(sel.card)]}) or 😱 come back WORSE. Silly requests? Often smart. Serious ones? Brave.</small></button>
        <p><small>Click a card in the inbox to switch · Keys <span class="kbd">1</span> <span class="kbd">2</span> <span class="kbd">3</span> pick a strategy · <span class="kbd">0</span>/<span class="kbd">I</span> ignore · ⚠️ instant relief often means a delayed WHAM!</small></p>`
        : `<h2>📞 …silence…</h2><p>Enjoy it. It won't last.</p>`}
      </div>
    </div></div>`;
  app.querySelectorAll("[data-uid]").forEach((b) => ((b as HTMLElement).onclick = () => { selectedUid = Number((b as HTMLElement).dataset.uid); render(); }));
  app.querySelectorAll("[data-choice]").forEach((b) => ((b as HTMLElement).onclick = () => { if (sel) choose(sel.card.choices[Number((b as HTMLElement).dataset.choice)]); }));
  const ig = document.getElementById("ignore"); if (ig) ig.onclick = () => ignoreSelected();
}
window.addEventListener("keydown", (e) => {
  if (over || !waiting().length) return;
  if (e.key === "0" || e.key.toLowerCase() === "i") return ignoreSelected();
  const n = ["1", "2", "3"].indexOf(e.key);
  const sel = waiting().find((x) => x.uid === selectedUid);
  if (n >= 0 && sel) choose(sel.card.choices[n]);
});
/* Demo hooks for screenshots/QA: ?demo=frazzled or ?demo=beach renders a frozen game at that extreme. */
const demoMode = new URLSearchParams(location.search).get("demo");
if (demoMode === "frazzled" || demoMode === "beach") {
  startGame();
  meters = demoMode === "frazzled"
    ? { stress: 96, risk: 88, cost: 90, confidence: 12, chill: 2 }
    : { stress: 4, risk: 3, cost: 8, confidence: 98, chill: 100 };
  clearInterval(timerId);
  render();
} else {
  renderIntro();
}
