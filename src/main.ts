import { CARDS, cardById, escalatedClone, severityOf, type GameCard, type Choice } from "./cards";
import { applyEffects, clicheAt, dueEvents, ignoreWanderChance, IGNORE_DELAY_SEC, isGameOver, qualityOf, resolveIgnore, spawnInterval, stageFor, STAGE_NAMES, type Meters, type Scheduled } from "./engine";

const app = document.getElementById("app")!;

/* ---------- CIO character: appearance evolves with performance ---------- */
function cioSVG(stage: number): string {
  const skin = "#ffcf4d", skinShade = "#f0a832", muzzle = "#ffe29a";
  const wild = stage <= 1, frazzled = stage <= 2;
  /* --- hair: wilder and taller the worse it gets --- */
  const hairPath = [
    "M62 96 L44 22 L76 58 L84 4 L108 50 L128 -2 L142 48 L172 6 L178 56 L206 22 L202 100 Q130 58 62 96 Z",
    "M64 94 L52 34 L82 58 L96 14 L116 52 L138 18 L152 56 L182 30 L188 96 Q130 62 64 94 Z",
    "M66 92 L60 44 L88 58 L106 30 L126 54 L148 32 L164 58 L184 46 L186 92 Q130 64 66 92 Z",
    "M68 88 Q76 38 130 36 Q184 38 192 88 Q160 58 130 60 Q100 58 68 88 Z",
    "M68 88 Q78 40 130 38 Q182 40 192 88 Q158 60 130 62 Q102 60 68 88 Z",
    "M68 88 Q78 40 130 38 Q182 40 192 88 Q158 60 130 62 Q102 60 68 88 Z",
  ][stage];
  const flyaways = wild ? `<path d="M52 40 q-18 -14 -26 -4 M208 44 q16 -16 26 -8 M126 2 q-2 -14 -12 -20" stroke="#5a3a1a" stroke-width="4" fill="none" stroke-linecap="round"/>` : "";
  const hairLines = stage >= 3 ? `<path d="M84 66 q40 -22 88 -4 M92 52 q36 -14 72 0" stroke="#5a3a1a" stroke-width="3" fill="none" opacity=".55"/>` : `<path d="M78 70 l14 -18 M104 56 l8 -20 M150 54 l12 -16 M176 72 l14 -12" stroke="#3a2410" stroke-width="3" stroke-linecap="round"/>`;
  /* --- eyes: big white cartoon eyes, pupils, veins when bloodshot --- */
  const pupilOff = stage === 0 ? [-5, -6] : stage === 1 ? [4, 3] : stage === 2 ? [0, 5] : [0, 0];
  const veins = stage <= 1 ? `<path d="M84 92 l14 8 M98 84 l-6 14 M150 86 l12 10 M164 94 l-12 8" stroke="#e33" stroke-width="2" fill="none"/>` : "";
  const bags = frazzled ? `<path d="M82 138 q18 8 36 2 M142 140 q18 6 34 -2" stroke="${skinShade}" stroke-width="3" fill="none"/>` : "";
  const brows = frazzled
    ? `<path d="M80 74 l36 10 M176 74 l-36 10" stroke="#3a2410" stroke-width="6" stroke-linecap="round"/>`
    : `<path d="M82 72 q16 -10 34 -4 M144 68 q18 -6 34 4" stroke="#3a2410" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const eyes = stage === 5
    ? `<rect x="76" y="88" width="108" height="30" rx="15" fill="#141414"/><rect x="84" y="94" width="38" height="9" rx="4" fill="#8fe3ff"/><rect x="140" y="94" width="34" height="9" rx="4" fill="#8fe3ff"/><path d="M76 100 L58 92 M184 100 L202 92" stroke="#141414" stroke-width="5" stroke-linecap="round"/>`
    : `<ellipse cx="98" cy="106" rx="17" ry="21" fill="#fff" stroke="#141414" stroke-width="3.5"/><ellipse cx="162" cy="106" rx="17" ry="21" fill="#fff" stroke="#141414" stroke-width="3.5"/>${veins}<circle cx="${98 + pupilOff[0]}" cy="${106 + pupilOff[1]}" r="5.5" fill="#141414"/><circle cx="${162 + pupilOff[0]}" cy="${106 + pupilOff[1]}" r="5.5" fill="#141414"/><circle cx="${100 + pupilOff[0]}" cy="${103 + pupilOff[1]}" r="1.8" fill="#fff"/><circle cx="${164 + pupilOff[0]}" cy="${103 + pupilOff[1]}" r="1.8" fill="#fff"/>`;
  const shadesOnHead = stage === 3 || stage === 4 ? `<rect x="84" y="34" width="92" height="20" rx="10" fill="#141414" transform="rotate(-5 130 44)"/>` : "";
  /* --- mouth on a lighter muzzle, overbite-ish expressive shapes --- */
  const mouth = [
    `<rect x="100" y="146" width="60" height="18" rx="5" fill="#fff" stroke="#141414" stroke-width="3"/><path d="M115 146 v18 M130 146 v18 M145 146 v18 M100 155 h60" stroke="#141414" stroke-width="2"/>`,
    `<path d="M98 156 q10 -10 20 0 q10 10 20 0 q10 -10 22 0" stroke="#141414" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    `<path d="M104 162 q26 -14 52 0" stroke="#141414" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    `<path d="M106 150 q24 16 48 0" stroke="#141414" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    `<path d="M102 148 q28 24 56 0 l-4 14 q-24 12 -48 0 Z" fill="#fff" stroke="#141414" stroke-width="3"/>`,
    `<path d="M98 146 q32 30 64 0 l-6 20 q-26 14 -52 0 Z" fill="#7a1f1f" stroke="#141414" stroke-width="3"/><ellipse cx="130" cy="164" rx="14" ry="6" fill="#ff7d9c"/>`,
  ][stage];
  const stubble = stage <= 1 ? `<g fill="#8a6a3a"><circle cx="106" cy="138" r="1.6"/><circle cx="122" cy="142" r="1.6"/><circle cx="140" cy="140" r="1.6"/><circle cx="154" cy="136" r="1.6"/><circle cx="114" cy="132" r="1.6"/><circle cx="148" cy="146" r="1.6"/></g>` : "";
  const sweat = stage === 0 ? `<path d="M52 84 q-10 16 0 22 q10 -6 0 -22 M208 78 q-10 16 0 22 q10 -6 0 -22 M66 128 q-8 13 0 18 q8 -5 0 -18" fill="#7ecbff" stroke="#141414" stroke-width="2.5"/>` : stage === 1 ? `<path d="M54 86 q-10 16 0 22 q10 -6 0 -22 M206 82 q-10 16 0 22 q10 -6 0 -22" fill="#7ecbff" stroke="#141414" stroke-width="2.5"/>` : stage === 2 ? `<path d="M56 90 q-9 14 0 19 q9 -5 0 -19" fill="#7ecbff" stroke="#141414" stroke-width="2.5"/>` : "";
  const anger = stage === 0 ? `<path d="M196 66 q10 -12 20 -2 M206 56 q2 12 -6 20" stroke="#e33" stroke-width="4" fill="none" stroke-linecap="round"/>` : "";
  /* --- clothing --- */
  const flowers = `<g><g fill="#fff"><circle cx="86" cy="238" r="6"/><circle cx="98" cy="230" r="6"/><circle cx="98" cy="246" r="6"/><circle cx="110" cy="238" r="6"/></g><circle cx="98" cy="238" r="4" fill="#ffd21f"/><g fill="#ffd21f"><circle cx="164" cy="262" r="6"/><circle cx="176" cy="254" r="6"/><circle cx="176" cy="270" r="6"/><circle cx="188" cy="262" r="6"/></g><circle cx="176" cy="262" r="4" fill="#ff4f9a"/><g fill="#7ee08a"><circle cx="112" cy="282" r="5"/><circle cx="122" cy="276" r="5"/><circle cx="122" cy="288" r="5"/><circle cx="132" cy="282" r="5"/></g><circle cx="122" cy="282" r="3.5" fill="#fff"/></g>`;
  const suitCol = ["#6b7280", "#7a8699", "#8fa3bf", "#3366aa", "#37b24d", "#ff5f8f"][stage];
  const tieRot = stage === 0 ? "rotate(18 130 196)" : stage === 1 ? "rotate(-11 130 196)" : stage === 2 ? "rotate(5 130 196)" : "";
  const tie = stage <= 2 ? `<g transform="${tieRot}"><path d="M122 182 h16 l4 14 l-12 38 l-12 -38 Z" fill="${stage <= 1 ? "#d92626" : "#c2255c"}" stroke="#141414" stroke-width="3"/></g><path d="M130 176 l-14 8 l14 22 l14 -22 Z" fill="#fff" stroke="#141414" stroke-width="3"/>` : "";
  const folds = stage <= 3 ? `<path d="M76 236 q10 30 4 62 M184 236 q-10 30 -4 62 M96 214 q-6 20 0 40 M164 214 q6 20 0 40" stroke="#00000033" stroke-width="4" fill="none"/>` : `<path d="M84 232 q6 26 0 52 M176 232 q-6 26 0 52" stroke="#0000002b" stroke-width="4" fill="none"/>`;
  const torso = stage === 5
    ? `<path d="M66 290 L192 290 L198 334 L158 334 L130 304 L102 334 L60 334 Z" fill="#2f6fd0" stroke="#141414" stroke-width="4"/><path d="M72 216 Q130 192 188 216 L192 302 L156 302 L130 238 L104 302 L68 302 Z" fill="${suitCol}" stroke="#141414" stroke-width="4"/><path d="M104 302 L130 238 L156 302 L144 302 L130 262 L116 302 Z" fill="${muzzle}" stroke="#141414" stroke-width="3"/>${flowers}`
    : stage === 4
    ? `<path d="M66 356 L74 214 Q130 192 186 214 L194 356 Z" fill="#4a5568" stroke="#141414" stroke-width="4"/><path d="M74 214 Q130 192 186 214 L190 306 L70 306 Z" fill="#ff5f8f" stroke="#141414" stroke-width="4"/><path d="M108 198 l22 20 l22 -20 l-8 30 h-28 Z" fill="#ffe29a" stroke="#141414" stroke-width="3"/><circle cx="130" cy="240" r="3.5" fill="#141414"/><circle cx="130" cy="258" r="3.5" fill="#141414"/><circle cx="130" cy="276" r="3.5" fill="#141414"/>${flowers}`
    : `<path d="M66 356 L74 214 Q130 192 186 214 L194 356 Z" fill="#3d4b63" stroke="#141414" stroke-width="4"/><path d="M74 214 Q130 192 186 214 L190 310 L70 310 Z" fill="${suitCol}" stroke="#141414" stroke-width="4"/><path d="M98 198 L130 252 L162 198 L172 214 L130 300 L88 214 Z" fill="#26314a" stroke="#141414" stroke-width="3"/><path d="M112 202 L130 226 L148 202 L142 250 L130 262 L118 250 Z" fill="#fff" stroke="#141414" stroke-width="2.5"/>${tie}${stage === 3 ? `<g fill="#ff8fb3"><circle cx="90" cy="240" r="5"/><circle cx="100" cy="234" r="5"/><circle cx="100" cy="246" r="5"/><circle cx="110" cy="240" r="5"/></g><circle cx="100" cy="240" r="3" fill="#ffd21f"/>` : ""}`;
  const legs = stage === 5
    ? `<path d="M102 324 v27 M158 324 v27" stroke="${skin}" stroke-width="16" stroke-linecap="round"/><path d="M84 350 h36 l5 9 H80 Z M142 350 h36 l5 9 h-44 Z" fill="#a9713a" stroke="#141414" stroke-width="3"/><path d="M88 352 q14 -8 28 0 M146 352 q14 -8 28 0" stroke="#141414" stroke-width="3" fill="none"/>`
    : `<path d="M88 330 h34 v14 H84 Z M138 330 h34 v14 h-38 Z" fill="#222" stroke="#141414" stroke-width="3"/>`;
  const cocktail = stage === 5 ? `<g><path d="M209 308 l13 -26 M222 282 l-5 20 h22 Z" fill="#bfefff" stroke="#141414" stroke-width="3"/><path d="M213 292 h19" stroke="#ff4f9a" stroke-width="5"/><path d="M229 270 l17 -13 l-3 19 Z" fill="#37d35a" stroke="#141414" stroke-width="2.5"/><circle cx="230" cy="274" r="4" fill="#ffd21f" stroke="#141414" stroke-width="2"/></g>` : "";
  const hand = (x: number, y: number) => `<g><ellipse cx="${x}" cy="${y}" rx="13" ry="16" fill="${skin}" stroke="#141414" stroke-width="3"/><path d="M${x - 8} ${y + 2} q3 8 1 14 M${x} ${y + 4} q1 9 -1 15 M${x + 8} ${y + 2} q-2 8 -1 13" stroke="#141414" stroke-width="2" fill="none"/></g>`;
  return `<svg viewBox="0 0 260 360" class="wobble" role="img" aria-label="The CIO, stage ${stage}">
    ${stage === 4 ? `<rect x="3" y="3" width="254" height="354" rx="20" fill="#dff6ff" stroke="#141414" stroke-width="3"/><circle cx="226" cy="38" r="17" fill="#ffd21f" stroke="#141414" stroke-width="3"/>` : stage === 5 ? `<rect x="3" y="3" width="254" height="354" rx="20" fill="#8fe3ff" stroke="#141414" stroke-width="3"/><circle cx="224" cy="42" r="24" fill="#ffd21f" stroke="#141414" stroke-width="3"/><path d="M14 78 q2 -30 16 -44 M15 76 q-8 -24 -6 -40 M17 78 q16 -20 32 -24" stroke="#2f9e44" stroke-width="6" fill="none" stroke-linecap="round"/>` : ""}
    ${stage >= 4 ? "" : ""}${sweat}${anger}
    ${torso}${legs}
    <path d="M72 222 q-26 34 -18 76 M188 222 q26 34 18 76" stroke="${stage >= 4 ? skin : suitCol}" stroke-width="19" fill="none" stroke-linecap="round"/>
    ${hand(52, 306)}${hand(208, 306)}${cocktail}
    <rect x="116" y="162" width="28" height="26" fill="${skin}" stroke="#141414" stroke-width="3"/>
    <circle cx="66" cy="116" r="13" fill="${skin}" stroke="#141414" stroke-width="3.5"/><circle cx="194" cy="116" r="13" fill="${skin}" stroke="#141414" stroke-width="3.5"/>
    <path d="M64 114 q6 -6 10 2 M196 114 q-6 -6 -10 2" stroke="${skinShade}" stroke-width="3" fill="none"/>
    <ellipse cx="130" cy="108" rx="64" ry="60" fill="${skin}" stroke="#141414" stroke-width="4"/>
    <path d="${hairPath}" fill="#6b4423" stroke="#141414" stroke-width="3.5"/>${flyaways}${hairLines}${shadesOnHead}
    ${brows}${eyes}${bags}
    <path d="M132 104 q16 20 4 30 q-7 6 -17 2" fill="none" stroke="#141414" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="130" cy="152" rx="36" ry="22" fill="${muzzle}" opacity=".85"/>
    ${stubble}${mouth}
  </svg>`;
}

/* ---------- Intro: punchy, staged, skippable (full read ≈ 2 min) ---------- */
const SLIDES = [
  { h: "📟 THE BACKSTORY", t: `You are the <b>CIO of a Very Serious Bank</b>. It is Monday. It is 8:59 a.m. Every department has discovered AI at the same time.<br><br>John from Marketing has uploaded <b>all customer data to ChatGPT</b> to make a PowerPoint. Charles wants payroll automated by a mystery SAP plugin. Fred has a “security plan” involving a magic amulet, three firewalls drawn in crayon, and a cape. Sam is pitching AI concierges to billionaires. Alan is day-trading Bitcoin on Copilot's advice.<br><br>All of it runs on Copilot. All of it costs a fortune. <b>None of it is governed.</b>` },
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
let needsRender = false, lastRenderedSecond = -1, newestUid = 0;

function shuffledDeck() { deck = CARDS.filter((x) => !x.followUp).sort(() => Math.random() - 0.5); }
function spawn(card?: GameCard) {
  if (!deck.length) shuffledDeck();
  const c = card ?? deck.pop()!;
  const live = { uid: uidSeq++, card: c };
  inbox.push(live); newestUid = live.uid; needsRender = true;
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
    needsRender = true;
    meters = applyEffects(meters, ev.fx); burst(ev.sfx); log.unshift(`⏰ CONSEQUENCE! ${ev.text}`); combo = 0;
    if (ev.followUpId) spawn(cardById(ev.followUpId));
  }
  // Ignored requesters finish loitering (~3s): bored & gone, or back and WORSE.
  for (const live of loitering().filter((x) => x.loiterUntil! <= elapsed)) {
    needsRender = true;
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
  // Only repaint when something changed or the displayed second flips.
  // Rebuilding the DOM every 200ms used to eat clicks mid-press.
  if (!over && (needsRender || Math.ceil(timeLeft) !== lastRenderedSecond)) render();
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
    <div style="max-width:310px;margin:0 auto">${cioSVG(won ? 5 : Math.min(st, 1))}</div>
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
  lastRenderedSecond = Math.ceil(timeLeft); needsRender = false;
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
      <div class="panel timer">⏱️ ${Math.max(0, Math.ceil(timeLeft))}s<div style="font-size:13px">SCORE ${score} · COMBO ×${combo}<br>📥 ${waiting().length} WAITING</div></div>
    </div>
    <div class="layout">
      <div>
        <div class="panel cio-box">${cioSVG(st)}<div><span class="stage-name">${STAGE_NAMES[st]}</span></div>
        <div class="scorebox">${consequences.length ? `⏳ ${consequences.length} consequence(s) ticking…` : `💬 IT desk says: “${clicheAt(elapsed)}”`}</div>
        <div class="log">${log.slice(0, 7).map((l) => `<div>${l}</div>`).join("")}</div></div>
        <div class="stackbar ${waiting().length >= 3 ? "hot" : ""}">📥 <b>${waiting().length} new request${waiting().length === 1 ? "" : "s"} stacking up</b>${loitering().length ? ` · 🙈 ${loitering().length} loitering` : ""}<div class="stacktrack"><i style="width:${Math.min(100, (waiting().length / 6) * 100)}%"></i></div><small>${waiting().length >= 4 ? "⚠️ STACKING UP! Answer one or Ignore a silly one — overflow = +Stress!" : waiting().length >= 2 ? "They pile up fast — keep 'em moving, CIO!" : "Inbox under control. Enjoy the silence."}</small></div>
        <h3>📥 INCOMING! (${waiting().length})</h3>
        <div class="queue">${waiting().map((x, i) => `<button class="qcard ${x.uid === selectedUid ? "sel" : ""} ${x.card.followUp ? "follow" : ""}" data-uid="${x.uid}"><b>#${i + 1}</b> ${x.card.emoji} ${x.card.title}${x.uid === newestUid ? ` <span class="newtag">🆕 NEW!</span>` : ""}<small>${x.card.person} · ${x.card.dept} · ${SEV_LABEL[severityOf(x.card)]}</small></button>`).join("")}</div>
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
const stageDemo = demoMode ? /^stage([0-5])$/.exec(demoMode) : null;
if (stageDemo) {
  startGame();
  const presets = [
    { stress: 96, risk: 88, cost: 90, confidence: 12, chill: 2 },
    { stress: 78, risk: 70, cost: 66, confidence: 30, chill: 14 },
    { stress: 58, risk: 50, cost: 48, confidence: 48, chill: 30 },
    { stress: 38, risk: 32, cost: 34, confidence: 64, chill: 48 },
    { stress: 20, risk: 16, cost: 20, confidence: 82, chill: 68 },
    { stress: 4, risk: 3, cost: 8, confidence: 98, chill: 100 },
  ];
  meters = presets[Number(stageDemo[1])];
  clearInterval(timerId);
  render();
} else if (demoMode === "frazzled" || demoMode === "beach") {
  startGame();
  meters = demoMode === "frazzled"
    ? { stress: 96, risk: 88, cost: 90, confidence: 12, chill: 2 }
    : { stress: 4, risk: 3, cost: 8, confidence: 98, chill: 100 };
  clearInterval(timerId);
  render();
} else {
  renderIntro();
}
