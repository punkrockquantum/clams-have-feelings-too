export interface Effects { stress: number; risk: number; cost: number; confidence: number; chill: number; time: number; score: number }
export interface Meters { stress: number; risk: number; cost: number; confidence: number; chill: number }
export const emptyFx = (): Effects => ({ stress: 0, risk: 0, cost: 0, confidence: 0, chill: 0, time: 0, score: 0 });
const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
export function applyEffects(m: Meters, fx: Partial<Effects>): Meters {
  return {
    stress: clamp(m.stress + (fx.stress ?? 0)),
    risk: clamp(m.risk + (fx.risk ?? 0)),
    cost: clamp(m.cost + (fx.cost ?? 0)),
    confidence: clamp(m.confidence + (fx.confidence ?? 0)),
    chill: clamp(m.chill + (fx.chill ?? 0)),
  };
}
export function calmScore(m: Meters): number {
  return Math.round(((100 - m.stress) + (100 - m.risk) + (100 - m.cost) + m.confidence + m.chill) / 5);
}
/** 0 = total meltdown … 5 = beach mode */
export function stageFor(m: Meters): number {
  const c = calmScore(m);
  if (c >= 82) return 5;
  if (c >= 68) return 4;
  if (c >= 54) return 3;
  if (c >= 40) return 2;
  if (c >= 25) return 1;
  return 0;
}
export const STAGE_NAMES = ["TOTAL MELTDOWN!", "FRAZZLED!", "I NEED A HOLIDAY!", "STEADYING THE SHIP", "SMOOTH OPERATOR", "BEACH MODE 🏖️"];
export function isGameOver(m: Meters): string | null {
  if (m.stress >= 100) return "Stress hit 100 — you face-planted into your keyboard. The board prescribes a long nap.";
  if (m.risk >= 100) return "Risk hit 100 — the regulators arrived with a cartoon-sized magnifying glass.";
  if (m.cost >= 100) return "Cost hit 100 — Finance padlocked the Copilot bill and threw away the key.";
  if (m.confidence <= 0) return "Board Confidence hit zero — you were reassigned to 'special projects' (the basement).";
  return null;
}
export interface Scheduled { at: number; text: string; fx: Partial<Effects>; followUpId?: string; sfx: string }
export function dueEvents(queue: Scheduled[], elapsed: number): { due: Scheduled[]; pending: Scheduled[] } {
  return { due: queue.filter((e) => e.at <= elapsed), pending: queue.filter((e) => e.at > elapsed) };
}
/** Intensity level 0–5, rising every 25 seconds. Drives spawn pressure and double-request bursts. */
export function pressureLevel(elapsed: number): number {
  return Math.min(5, Math.floor(Math.max(0, elapsed) / 25));
}
/** Spawn interval (s) shrinks as intensity rises. */
export function spawnInterval(elapsed: number): number {
  return Math.max(1.4, 5.2 - elapsed * 0.05 - pressureLevel(elapsed) * 0.1);
}
/** Chance a spawn arrives as a DOUBLE REQUEST (two cards at once) once the pressure is on. */
export function doubleSpawnChance(elapsed: number): number {
  const p = pressureLevel(elapsed);
  return p < 2 ? 0 : Math.min(0.5, 0.15 + p * 0.07);
}
/* ---- Ignore mechanic: walk away and hope they get bored ---- */
export type Severity = 1 | 2 | 3; // 1 = silly/low-stakes, 3 = serious
export const IGNORE_DELAY_SEC = 3;
/** Chance the requester gets bored and wanders off. Silly requests are safe to ignore; serious ones are not.
 *  Ignore Heat (recent ignoring) drags the odds down — people notice being ignored. */
export function ignoreWanderChance(severity: Severity, ignoreHeat = 0): number {
  const base = severity === 1 ? 0.85 : severity === 2 ? 0.55 : 0.25;
  return Math.max(0.05, base - ignoreHeat * 0.07);
}
export interface IgnoreResult { outcome: "wander" | "escalate"; fx: Partial<Effects>; sfx: string }
export function resolveIgnore(severity: Severity, rng: number, ignoreHeat = 0): IgnoreResult {
  if (rng < ignoreWanderChance(severity, ignoreHeat)) {
    return { outcome: "wander", sfx: "BORED…", fx: { stress: -3, risk: severity === 3 ? 2 : 0, chill: 3, confidence: 1, score: 40 } };
  }
  return {
    outcome: "escalate", sfx: "UH OH!",
    fx: { stress: 5 + severity * 3, risk: 3 + severity * 2, cost: severity * 2, confidence: -2 - severity * 2, chill: -5, score: 0 },
  };
}
/** Rotating IT-desk clichés shown under the CIO (cycles every 4 seconds of game time). */
export const IT_CLICHES = [
  "Did you try restarting?",
  "Did you update to the latest version?",
  "Can you please raise a ticket?",
  "Have you tried turning it off and on again?",
  "That'll be fixed in the next patch.",
  "Works on my machine.",
  "Have you cleared your cache? Like, ever?",
  "It's not a bug, it's an undocumented feature!",
  "Please hold… your call is important to us. Allegedly.",
] as const;
export function clicheAt(elapsed: number): string {
  return IT_CLICHES[Math.floor(Math.max(0, elapsed) / 4) % IT_CLICHES.length];
}
export function qualityOf(fx: Partial<Effects>): "good" | "bad" | "mixed" {
  const chaos = (fx.stress ?? 0) + (fx.risk ?? 0) + (fx.cost ?? 0) - (fx.confidence ?? 0) - (fx.chill ?? 0);
  if (chaos <= -8) return "good";
  if (chaos >= 8) return "bad";
  return "mixed";
}
