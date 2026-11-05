import { describe, expect, it } from "vitest";
import { applyEffects, calmScore, dueEvents, isGameOver, qualityOf, spawnInterval, stageFor } from "./engine";
import { CARDS, cardById } from "./cards";

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
describe("card deck", () => {
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
