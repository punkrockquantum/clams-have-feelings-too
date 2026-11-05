import { describe, expect, it } from "vitest";
import { applyEffects, calmScore, dueEvents, ignoreWanderChance, IGNORE_DELAY_SEC, isGameOver, qualityOf, resolveIgnore, spawnInterval, stageFor } from "./engine";
import { CARDS, cardById, escalatedClone, severityOf } from "./cards";

const base = { stress: 50, risk: 50, cost: 50, confidence: 50, chill: 50 };
describe("engine", () => {
  it("clamps meters to 0..100", () => {
    const m = applyEffects(base, { stress: 999, confidence: -999 });
    expect(m.stress).toBe(100); expect(m.confidence).toBe(0);
  });
  it("stage improves as the bank calms", () => {
    expect(stageFor({ stress: 95, risk: 95, cost: 95, confidence: 5, chill: 0 })).toBeLessThan(stageFor({ stress: 5, risk: 5, cost: 5, confidence: 95, chill: 95 }));
    expect(stageFor({ stress: 0, risk: 0, cost: 0, confidence: 100, chill: 100 })).toBe(5);
  });
  it("detects game over only at extremes", () => {
    expect(isGameOver(base)).toBeNull();
    expect(isGameOver({ ...base, risk: 100 })).toContain("Risk");
  });
  it("fires delayed consequences when due", () => {
    const q = [{ at: 10, text: "boom", fx: {}, sfx: "WHAM!" }, { at: 99, text: "later", fx: {}, sfx: "POW!" }];
    const { due, pending } = dueEvents(q, 12);
    expect(due).toHaveLength(1); expect(pending).toHaveLength(1);
  });
  it("accelerates spawning over time", () => { expect(spawnInterval(100)).toBeLessThan(spawnInterval(0)); });
  it("scores calm choices as good", () => { expect(qualityOf({ stress: -10, risk: -10, chill: 5 })).toBe("good"); expect(calmScore(base)).toBe(50); });
});
describe("ignore mechanic", () => {
  it("waits ~3 seconds before resolving", () => { expect(IGNORE_DELAY_SEC).toBe(3); });
  it("silly requests are usually safe to ignore, serious ones are not", () => {
    expect(ignoreWanderChance(1)).toBeGreaterThan(0.8);
    expect(ignoreWanderChance(2)).toBeGreaterThan(ignoreWanderChance(3));
    expect(ignoreWanderChance(3)).toBeLessThan(0.3);
  });
  it("rng below the wander chance = bored & gone, with tiny relief", () => {
    const r = resolveIgnore(1, 0.01);
    expect(r.outcome).toBe("wander"); expect(r.sfx).toBe("BORED…"); expect((r.fx.stress ?? 0)).toBeLessThan(0);
  });
  it("rng above the wander chance = escalates, worse for serious cards", () => {
    const silly = resolveIgnore(1, 0.999); const serious = resolveIgnore(3, 0.999);
    expect(silly.outcome).toBe("escalate"); expect(serious.sfx).toBe("UH OH!");
    expect((serious.fx.stress ?? 0) + (serious.fx.risk ?? 0)).toBeGreaterThan((silly.fx.stress ?? 0) + (silly.fx.risk ?? 0));
  });
});
describe("card deck", () => {
  it("every card has a severity and serious signature incidents are not silly", () => {
    for (const card of CARDS) expect([1, 2, 3]).toContain(severityOf(card));
    expect(severityOf(cardById("john-chatgpt")!)).toBe(3);
    expect(severityOf(cardById("ransom-note")!)).toBe(3);
    expect(severityOf(cardById("sam-hnw")!)).toBe(1);
  });
  it("ignored cards escalate to a follow-up or a nastier clone", () => {
    expect(escalatedClone(cardById("john-chatgpt")!).id).toBe("legal-fallout");
    const clone = escalatedClone(cardById("sam-hnw")!);
    expect(clone.title).toContain("ESCALATED"); expect(clone.severity).toBe(3);
  });
  it("includes the five signature incidents", () => {
    for (const id of ["john-chatgpt", "charles-payroll", "fred-mythos", "sam-hnw", "alan-bitcoin"]) expect(cardById(id), id).toBeTruthy();
  });
  it("every card has 3 choices covering distinct lanes and at least one tempting trap in signature cards", () => {
    for (const card of CARDS) {
      expect(card.choices).toHaveLength(3);
      expect(new Set(card.choices.map((x) => x.lane)).size).toBe(3);
    }
    expect(cardById("john-chatgpt")!.choices.some((x) => x.delayed?.followUpId === "legal-fallout")).toBe(true);
  });
  it("partner choices name Digital Realty / Oracle / OEM options", () => {
    const partners = CARDS.flatMap((x) => x.choices.map((y) => y.partner ?? "")).join(" ");
    expect(partners).toContain("Digital Realty"); expect(partners).toContain("Oracle"); expect(partners).toContain("OEM");
  });
});
