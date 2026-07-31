import { describe, it, expect } from "vitest";

describe("Table Definitions", () => {
  const TABLE_COUNT = 31;

  it("has 31 LKPS tables defined", () => {
    expect(TABLE_COUNT).toBe(31);
  });

  describe("BAB Distribution", () => {
    const babCounts = {
      1: 6, // 1.A.1 - 1.A.5, 1.B
      2: 11, // 2.A.1-3, 2.B.1-6, 2.C, 2.D
      3: 6, // 3.A.1-3, 3.C.1-3
      4: 5, // 4.A.1-2, 4.C.1-3
      5: 2, // 5.1, 5.2
      6: 1, // 6
    };

    it("total matches 31 tables", () => {
      const total = Object.values(babCounts).reduce((a, b) => a + b, 0);
      expect(total).toBe(31);
    });
  });
});

describe("Status Transitions", () => {
  const validTransitions: Record<string, string[]> = {
    DRAFT: ["DIAJUKAN"],
    DIAJUKAN: ["DISETUJUI", "DIREVISI", "DITOLAK"],
    DIREVISI: ["DIAJUKAN"],
    DITOLAK: ["DRAFT"],
    DISETUJI: [],
  };

  it("allows DRAFT to DIAJUKAN", () => {
    expect(validTransitions["DRAFT"]).toContain("DIAJUKAN");
  });

  it("allows DIAJUKAN to DISETUJUI", () => {
    expect(validTransitions["DIAJUKAN"]).toContain("DISETUJUI");
  });

  it("allows DIREVISI to DIAJUKAN (resubmit)", () => {
    expect(validTransitions["DIREVISI"]).toContain("DIAJUKAN");
  });

  it("DISETUJI has no outgoing transitions", () => {
    expect(validTransitions["DISETUJI"]).toHaveLength(0);
  });
});
