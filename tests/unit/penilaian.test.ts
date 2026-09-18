import { describe, it, expect } from "vitest";
import {
  hitungPenilaian, prediksiStatus, rerataKriteria, nilaiAkhir, nilaiBerbobot,
  semuaButirAman, persenTerisi, bulatkan, bobotValid, warnaRerata,
  BOBOT_TOTAL, BOBOT_KRITERIA, KRITERIA_KUNCI, AMBANG,
  type ButirHitung,
} from "@/lib/utils/penilaian";

// ──────────────────────────────────────────────
// Bantu: bangun set butir tiruan
// ──────────────────────────────────────────────

/** Set butir: setiap kriteria dipecah jadi `n` butir berbobot sama. */
function butirSet(skorDefault: number | null, jumlahPerKriteria = 4): ButirHitung[] {
  const out: ButirHitung[] = [];
  for (const [kriteria, bobot] of Object.entries(BOBOT_KRITERIA)) {
    for (let i = 0; i < jumlahPerKriteria; i++) {
      out.push({
        kode: `${kriteria}.${i + 1}`,
        kriteria,
        bobot: bulatkan(bobot / jumlahPerKriteria),
        skor: skorDefault,
      });
    }
  }
  return out;
}

/** Set semua bobot 1 per butir dalam satu kriteria — memudahkan hitung tangan. */
function butirSederhana(skor: (number | null)[], kriteria = "C2"): ButirHitung[] {
  return skor.map((s, i) => ({ kode: `${kriteria}.${i + 1}`, kriteria, bobot: 1, skor: s }));
}

describe("struktur bobot resmi (PDF §III/§IV)", () => {
  it("total bobot 400", () => {
    expect(bulatkan(Object.values(BOBOT_KRITERIA).reduce((a, b) => a + b, 0))).toBe(BOBOT_TOTAL);
  });

  it("rincian bobot per kriteria sama dengan PDF", () => {
    expect(BOBOT_KRITERIA).toMatchObject({
      KE: 4, PU: 4, C1: 40, C2: 120, C3: 72, C4: 60, C5: 40, C6: 40, SUP: 20,
    });
  });

  it("ambang sesuai PDF §V", () => {
    expect(AMBANG).toEqual({ tidakTerakreditasi: 200, unggul3Th: 321, unggul5Th: 361 });
  });

  it("kriteria kunci = C1, C2, C3", () => {
    expect([...KRITERIA_KUNCI]).toEqual(["C1", "C2", "C3"]);
  });

  it("bobotValid menolak set yang totalnya bukan 400", () => {
    expect(bobotValid(butirSet(4))).toBe(true);
    expect(bobotValid(butirSederhana([4, 4]))).toBe(false);
  });
});

describe("kalkulasi dasar", () => {
  it("nilaiBerbobot = Σ(skor × bobot), butir kosong dihitung 0", () => {
    const butir: ButirHitung[] = [
      { kode: "a", kriteria: "C1", bobot: 10, skor: 4 },
      { kode: "b", kriteria: "C1", bobot: 5, skor: 2 },
      { kode: "c", kriteria: "C1", bobot: 5, skor: null },
    ];
    expect(nilaiBerbobot(butir)).toBe(50); // 40 + 10 + 0
  });

  it("nilaiAkhir skala 0–400: Σ(skor × bobot) / 4", () => {
    // bobot 100, skor 4 → 400
    expect(nilaiAkhir([{ kode: "a", kriteria: "C2", bobot: 100, skor: 4 }])).toBe(100);
    // bobot 400 skor 4 = 1600 → 400
    expect(nilaiAkhir(butirSet(4))).toBe(400);
  });

  it("rerata tertimbang, bukan rerata skor sederhana", () => {
    // (4×30 + 2×10) / 40 = 3,5  — rerata skor sederhana = 3,0
    const butir: ButirHitung[] = [
      { kode: "a", kriteria: "C2", bobot: 30, skor: 4 },
      { kode: "b", kriteria: "C2", bobot: 10, skor: 2 },
    ];
    expect(rerataKriteria(butir)).toBe(3.5);
  });

  it("rerata null kalau belum ada butir dinilai", () => {
    expect(rerataKriteria(butirSederhana([null, null]))).toBeNull();
  });

  it("semuaButirAman: butir kosong berarti belum aman", () => {
    expect(semuaButirAman(butirSederhana([3, 4, null]))).toBe(false);
    expect(semuaButirAman(butirSederhana([3, 4, 2.9]))).toBe(false);
    expect(semuaButirAman(butirSederhana([3, 4, 3]))).toBe(true);
  });

  it("bulatkan menghindari 60,49999999", () => {
    expect(bulatkan(60.499999999)).toBe(60.5);
  });

  it("persenTerisi aman saat total 0", () => {
    expect(persenTerisi(0, 0)).toBe(0);
    expect(persenTerisi(3, 4)).toBe(75);
  });

  it("warnaRerata sesuai ambang merah/amber/hijau", () => {
    expect(warnaRerata(null)).toBe("abu");
    expect(warnaRerata(2.99)).toBe("merah");
    expect(warnaRerata(3.0)).toBe("amber");
    expect(warnaRerata(3.19)).toBe("amber");
    expect(warnaRerata(3.2)).toBe("hijau");
  });
});

// ──────────────────────────────────────────────
// Ambang status (Test Plan §9 RANCANGAN-012)
// ──────────────────────────────────────────────

describe("prediksiStatus — ambang nilai", () => {
  it("100 → Tidak Terakreditasi", () => {
    expect(prediksiStatus(100, true, true)).toBe("TIDAK_TERAKREDITASI");
  });

  it("199,99 → Tidak Terakreditasi; 200 → Terakreditasi (batas bawah)", () => {
    expect(prediksiStatus(199.99, true, true)).toBe("TIDAK_TERAKREDITASI");
    expect(prediksiStatus(200, true, true)).toBe("TERAKREDITASI");
  });

  it("320 → Terakreditasi; 321 → Unggul 3 tahun (kalau syarat penuh)", () => {
    expect(prediksiStatus(320, true, true)).toBe("TERAKREDITASI");
    expect(prediksiStatus(321, true, true)).toBe("UNGGUL_3TH");
  });

  it("360 → Unggul 3 tahun; 361 → Unggul 5 tahun", () => {
    expect(prediksiStatus(360, true, true)).toBe("UNGGUL_3TH");
    expect(prediksiStatus(361, true, true)).toBe("UNGGUL_5TH");
  });
});

describe("prediksiStatus — syarat Unggul", () => {
  it("nilai ≥361 tanpa rerata kunci → Terakreditasi", () => {
    expect(prediksiStatus(380, false, true)).toBe("TERAKREDITASI");
  });

  it("nilai ≥361 tanpa semua butir ≥3,00 → Terakreditasi", () => {
    expect(prediksiStatus(380, true, false)).toBe("TERAKREDITASI");
  });

  it("nilai 321–360 dengan syarat lengkap → Unggul 3 tahun", () => {
    expect(prediksiStatus(340, true, true)).toBe("UNGGUL_3TH");
  });
});

// ──────────────────────────────────────────────
// Kasus uji wajib dari Test Plan §9
// ──────────────────────────────────────────────

describe("hitungPenilaian — kasus test plan", () => {
  it("1. semua skor 4 → nilai 400, UNGGUL_5TH", () => {
    const h = hitungPenilaian(butirSet(4));
    expect(h.nilaiAkhir).toBe(400);
    expect(h.status).toBe("UNGGUL_5TH");
    expect(h.lengkap).toBe(true);
    expect(h.jumlahKosong).toBe(0);
  });

  it("2. semua skor 3 → nilai 300, TERAKREDITASI", () => {
    const h = hitungPenilaian(butirSet(3));
    expect(h.nilaiAkhir).toBe(300);
    expect(h.status).toBe("TERAKREDITASI");
  });

  it("3. semua skor 2 → nilai 200, TERAKREDITASI (batas bawah)", () => {
    const h = hitungPenilaian(butirSet(2));
    expect(h.nilaiAkhir).toBe(200);
    expect(h.status).toBe("TERAKREDITASI");
  });

  it("4. semua skor 1 → nilai 100, TIDAK_TERAKREDITASI", () => {
    const h = hitungPenilaian(butirSet(1));
    expect(h.nilaiAkhir).toBe(100);
    expect(h.status).toBe("TIDAK_TERAKREDITASI");
  });

  it("5. nilai ≥361 tapi ada butir C1 = 2,9 → TERAKREDITASI, bukan Unggul", () => {
    const butir = butirSet(4);
    const idx = butir.findIndex((b) => b.kriteria === "C1");
    butir[idx] = { ...butir[idx]!, skor: 2.9 };

    const h = hitungPenilaian(butir);
    expect(h.nilaiAkhir).toBeGreaterThanOrEqual(361);
    expect(h.semuaButirOk).toBe(false);
    expect(h.butirPenghambat.map((b) => b.kode)).toContain("C1.1");
    expect(h.status).toBe("TERAKREDITASI");
  });

  it("6. nilai ≥361, semua butir C1–C3 ≥3,00, tapi rerata C2 = 3,15 → TERAKREDITASI", () => {
    // 4 butir C2 berbobot sama: 3; 3; 3; 3,6 → rerata = 15,6/4 = 3,9? tidak.
    // pakai nilai agar rerata tepat 3,15: 3,15 seragam tapi satu butir dinaikkan sedikit
    const butir = butirSet(4);
    const idxC2 = butir.map((b, i) => (b.kriteria === "C2" ? i : -1)).filter((i) => i >= 0);
    const nilaiC2 = [3, 3, 3, 3.6];
    idxC2.forEach((i, n) => {
      butir[i] = { ...butir[i]!, skor: nilaiC2[n]! };
    });

    const h = hitungPenilaian(butir);
    // (3+3+3+3,6)/4 = 3,15
    expect(h.rerataKunci.C2).toBeCloseTo(3.15, 2);
    expect(h.rerataKunciOk).toBe(false);
    expect(h.semuaButirOk).toBe(true);
    expect(h.nilaiAkhir).toBeGreaterThanOrEqual(361);
    expect(h.status).toBe("TERAKREDITASI");
  });

  it("7. nilai ≥361 dan syarat lengkap → UNGGUL_5TH", () => {
    const h = hitungPenilaian(butirSet(4));
    expect(h.rerataKunciOk).toBe(true);
    expect(h.semuaButirOk).toBe(true);
    expect(h.status).toBe("UNGGUL_5TH");
  });

  it("8. nilai 321–360 dan syarat lengkap → UNGGUL_3TH", () => {
    const h = hitungPenilaian(butirSet(3.5)); // 350
    expect(h.nilaiAkhir).toBe(350);
    expect(h.status).toBe("UNGGUL_3TH");
  });

  it("9. rerata & bobot tiap kriteria sesuai PDF", () => {
    const h = hitungPenilaian(butirSet(4));
    for (const k of Object.keys(BOBOT_KRITERIA)) {
      const p = h.perKriteria.find((x) => x.kriteria === k);
      expect(p, `kriteria ${k} hilang`).toBeDefined();
      expect(p!.bobot).toBeCloseTo(BOBOT_KRITERIA[k]!, 2);
      expect(p!.rerata).toBe(4);
      expect(p!.semuaButirAman).toBe(true);
    }
  });

  it("jumlah nilai per kriteria dijumlahkan = nilai akhir", () => {
    const h = hitungPenilaian(butirSet(3.5));
    const jumlah = bulatkan(h.perKriteria.reduce((a, p) => a + p.nilai, 0));
    expect(jumlah).toBe(h.nilaiAkhir);
  });
});

describe("hitungPenilaian — syarat Unggul hanya untuk C1–C3", () => {
  it("butir C4 bernilai 2,9 TIDAK menghalangi Unggul (§V hanya menyebut C1–C3)", () => {
    const butir = butirSet(4);
    const idx = butir.findIndex((b) => b.kriteria === "C4");
    butir[idx] = { ...butir[idx]!, skor: 2.9 };

    const h = hitungPenilaian(butir);
    expect(h.semuaButirOk).toBe(true);
    expect(h.butirPenghambat).toHaveLength(0);
    expect(h.status).toBe("UNGGUL_5TH");
  });

  it("butir C1–C3 yang belum dinilai dianggap menghambat", () => {
    const butir = butirSet(4);
    const idx = butir.findIndex((b) => b.kriteria === "C3");
    butir[idx] = { ...butir[idx]!, skor: null };

    const h = hitungPenilaian(butir);
    expect(h.semuaButirOk).toBe(false);
    expect(h.butirPenghambat).toHaveLength(1);
    expect(h.status).toBe("TERAKREDITASI");
  });
});

describe("hitungPenilaian — keadaan belum lengkap", () => {
  it("butir kosong dihitung 0 dan ditandai, nilai akhir sementara", () => {
    const butir = butirSet(null);
    const setengah = Math.floor(butir.length / 2);
    for (let i = 0; i < setengah; i++) butir[i] = { ...butir[i]!, skor: 4 };

    const h = hitungPenilaian(butir);
    expect(h.lengkap).toBe(false);
    expect(h.jumlahKosong).toBe(butir.length - setengah);
    expect(h.nilaiAkhir).toBeLessThan(BOBOT_TOTAL);
    expect(h.nilaiAkhir).toBeGreaterThan(0);
  });

  it("tanpa butir sama sekali → lengkap false, tidak meledak", () => {
    const h = hitungPenilaian([]);
    expect(h.totalButir).toBe(0);
    expect(h.lengkap).toBe(false);
    expect(h.skorTerendah).toBeNull();
    expect(h.status).toBe("TIDAK_TERAKREDITASI");
  });

  it("rerata kunci null kalau kriteria kunci belum dinilai", () => {
    const h = hitungPenilaian([{ kode: "C4.1", kriteria: "C4", bobot: 60, skor: 4 }]);
    expect(h.rerataKunci.C1).toBeNull();
    expect(h.rerataKunciOk).toBe(false);
  });

  it("skorTerendah melaporkan nilai terkecil yang sudah dinilai", () => {
    const h = hitungPenilaian(butirSederhana([4, 3, 2, null]));
    expect(h.skorTerendah).toBe(2);
  });
});
