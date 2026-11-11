import { describe, expect, it } from "vitest";
import { applyEffects, calmScore, clicheAt, doubleSpawnChance, dueEvents, ignoreWanderChance, IGNORE_DELAY_SEC, isGameOver, IT_CLICHES, newTally, pressureLevel, qualityOf, resolveIgnore, spawnInterval, stageFor, tallyChoice, tallyConsequence, tallyIgnore, tallyTotal } from "./engine";
import { CARDS, cardById, escalatedClone, severityOf } from "./cards";

const base = { stress: 50, risk: 50, cost: 50, confidence: 50, chill: 50 };
describe("engine", () => {
  it("clamps meters to 0..100", () => {
    const m = applyEffects(base, { stress: 999, confidence: -999 });
    expect(m.stress).toBe(100); expect(m.confidence).toBe(0);
  });
  it("stage improves as things calm down", () => {
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
describe("IT-desk clichés", () => {
  it("includes the classics and cycles over time", () => {
    expect(IT_CLICHES).toContain("Did you try restarting?");
    expect(IT_CLICHES).toContain("Did you update to the latest version?");
    expect(IT_CLICHES).toContain("Can you please raise a ticket?");
    expect(IT_CLICHES.length).toBeGreaterThanOrEqual(6);
    expect(clicheAt(0)).toBe(IT_CLICHES[0]);
    expect(clicheAt(4)).toBe(IT_CLICHES[1]);
    expect(clicheAt(4 * IT_CLICHES.length)).toBe(IT_CLICHES[0]); // wraps around
  });
});
describe("escalating intensity", () => {
  it("pressure rises over time and spawns accelerate with a floor", () => {
    expect(pressureLevel(0)).toBe(0); expect(pressureLevel(50)).toBe(2); expect(pressureLevel(999)).toBe(5);
    expect(spawnInterval(120)).toBeLessThan(spawnInterval(0));
    expect(spawnInterval(9999)).toBeGreaterThanOrEqual(1.4);
  });
  it("double requests only appear once pressure is on", () => {
    expect(doubleSpawnChance(10)).toBe(0);
    expect(doubleSpawnChance(75)).toBeGreaterThan(0.2);
  });
  it("ignore heat drags wander odds down but never below 5%", () => {
    expect(ignoreWanderChance(1, 3)).toBeLessThan(ignoreWanderChance(1, 0));
    expect(ignoreWanderChance(3, 99)).toBe(0.05);
    // a roll that would wander at zero heat escalates when the heat is on
    expect(resolveIgnore(2, 0.5, 0).outcome).toBe("wander");
    expect(resolveIgnore(2, 0.5, 4).outcome).toBe("escalate");
  });
});
describe("points tally", () => {
  it("starts empty and totals choice + ignore points", () => {
    expect(tallyTotal(newTally())).toBe(0);
    let t = tallyChoice(newTally(), 120, "good", false);
    t = tallyIgnore(t, "wander", 40);
    expect(tallyTotal(t)).toBe(160);
    expect(t).toMatchObject({ choicesMade: 1, goodCalls: 1, ignoresTried: 1, ignoresWorked: 1 });
  });
  it("counts traps, escalated ignores and landed consequences without awarding ignore-escalation points", () => {
    let t = tallyChoice(newTally(), 80, "bad", true);
    t = tallyIgnore(t, "escalate", 0);
    t = tallyConsequence(tallyConsequence(t));
    expect(t).toMatchObject({ trapsTaken: 1, goodCalls: 0, ignoresTried: 1, ignoresEscalated: 1, consequencesHit: 2, pointsFromIgnores: 0 });
    expect(tallyTotal(t)).toBe(80);
  });
  it("is immutable — tallying returns a new tally", () => {
    const t0 = newTally();
    tallyChoice(t0, 50, "good", false);
    expect(t0.choicesMade).toBe(0);
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
  it("interconnection choices carry Token Quest-mined specifics (generic form)", () => {
    const all = CARDS.flatMap((x) => x.choices.map((y) => `${y.label} ${y.detail} ${y.partner ?? ""}`)).join(" ");
    // Specifics mined from punkrockquantum/JRRToken (cursor/token-quest-datacenter-game), reworded generically
    expect(all).toContain("agent-configuration server");
    expect(all).toContain("Cross Connect");
    expect(all).toContain("150 kW");
    expect(all).toContain("50 Mbps–100 Gbps");
    expect(cardById("fabric-mcp")).toBeTruthy();
    expect(cardById("metro-choice")).toBeTruthy();
  });
  it("partner choices name generic colocation / cloud / OEM options", () => {
    const partners = CARDS.flatMap((x) => x.choices.map((y) => y.partner ?? "")).join(" ");
    expect(partners).toContain("Colocation partner"); expect(partners).toContain("Cloud partner"); expect(partners).toContain("OEM");
  });
  it("no bank or vendor-brand references anywhere in the deck", () => {
    const all = CARDS.map((x) => `${x.person} ${x.dept} ${x.title} ${x.body} ${x.choices.map((y) => `${y.label} ${y.detail} ${y.partner ?? ""} ${y.delayed?.text ?? ""}`).join(" ")}`).join(" ");
    expect(all).not.toMatch(/digital realty|oracle|platformdigital|servicefabric|\boci\b|fusion|\bbank\b|banking/i);
  });
});
