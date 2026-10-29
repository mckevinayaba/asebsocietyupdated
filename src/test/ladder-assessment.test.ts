import { describe, it, expect } from "vitest";
import { recommendStep } from "@/lib/ladder-assessment";

describe("recommendStep", () => {
  it("without evidence, starts at Member", () => {
    expect(recommendStep({ years: 3, evidence: 0, training: 2, leadership: 2 })).toBe(0);
  });
  it("evidence but no training suggests Verified", () => {
    expect(recommendStep({ years: 1, evidence: 1, training: 0, leadership: 0 })).toBe(1);
  });
  it("short courses with evidence suggests Associate", () => {
    expect(recommendStep({ years: 1, evidence: 1, training: 1, leadership: 0 })).toBe(2);
  });
  it("senior field leaders suggest Fellow", () => {
    expect(recommendStep({ years: 3, evidence: 2, training: 2, leadership: 2 })).toBe(4);
  });
});
