import { describe, expect, it } from "vitest";
import {
  parseMarkdownBlok,
  pecahInline,
  sanitasiTeks,
  susunDokumenLed,
  labelBagian,
  periksaPraExport,
  namaBerkasLed,
  ringkasBlok,
} from "@/lib/export/led-dokumen";
import type { LedBagianData } from "@/components/led/types";

/** Bagian LED tiruan dengan nilai default yang masuk akal. */
function bagian(isi: Partial<LedBagianData> & { kode: string }): LedBagianData {
  return {
    id: isi.kode,
    kode: isi.kode,
    judul: isi.judul ?? "Judul",
    petunjuk: null,
    tahapPpepp: isi.tahapPpepp ?? null,
    subButir: null,
    kriteria: isi.kriteria ?? null,
    batasHalaman: isi.batasHalaman ?? null,
    isian:
      isi.isian === undefined
        ? null
        : isi.isian,
  };
}

function isian(konten: string) {
  return {
    id: "i1",
    konten,
    status: "DRAFT" as const,
    jumlahKarakter: konten.length,
    updatedAt: new Date().toISOString(),
    evidence: [],
  };
}

describe("parseMarkdownBlok", () => {
  it("memisahkan heading, paragraf, dan list", () => {
    const blok = parseMarkdownBlok(
      "## Judul\n\nParagraf pertama.\n\n- satu\n- dua\n\n1. nomor satu\n2. nomor dua",
    );

    expect(blok).toEqual([
      { tipe: "heading", level: 2, teks: "Judul" },
      { tipe: "paragraf", teks: "Paragraf pertama." },
      { tipe: "list", ordered: false, item: ["satu", "dua"] },
      { tipe: "list", ordered: true, item: ["nomor satu", "nomor dua"] },
    ]);
  });

  it("menggabung baris berlanjut jadi satu paragraf", () => {
    const blok = parseMarkdownBlok("baris satu\nbaris dua\n\nparagraf kedua");
    expect(blok).toEqual([
      { tipe: "paragraf", teks: "baris satu baris dua" },
      { tipe: "paragraf", teks: "paragraf kedua" },
    ]);
  });

  it("mengenali code fence, blockquote, dan garis pemisah", () => {
    const blok = parseMarkdownBlok("```\nkode di sini\n```\n\n> kutipan\n\n---");
    expect(blok[0]).toEqual({ tipe: "code", teks: "kode di sini" });
    expect(blok[1]).toEqual({ tipe: "quote", teks: "kutipan" });
    expect(blok[2]).toEqual({ tipe: "hr" });
  });

  it("menggabung baris lanjutan item list", () => {
    const blok = parseMarkdownBlok("- item pertama\n  lanjutannya\n- item kedua");
    expect(blok).toEqual([
      { tipe: "list", ordered: false, item: ["item pertama lanjutannya", "item kedua"] },
    ]);
  });

  it("mengembalikan daftar kosong untuk teks kosong", () => {
    expect(parseMarkdownBlok("")).toEqual([]);
    expect(parseMarkdownBlok("   \n\n  ")).toEqual([]);
  });
});

describe("pecahInline", () => {
  it("menandai bold, italic, dan kode", () => {
    expect(pecahInline("teks **tebal** dan *miring* dan `kode`")).toEqual([
      { teks: "teks " },
      { teks: "tebal", bold: true },
      { teks: " dan " },
      { teks: "miring", italic: true },
      { teks: " dan " },
      { teks: "kode", kode: true },
    ]);
  });

  it("menghilangkan penanda coret tanpa memformat", () => {
    expect(pecahInline("~~dihapus~~")).toEqual([{ teks: "dihapus" }]);
  });

  it("teks tanpa penanda tetap satu potongan", () => {
    expect(pecahInline("apa adanya")).toEqual([{ teks: "apa adanya" }]);
  });
});

describe("sanitasiTeks", () => {
  it("menormalkan tanda kutip dan strip tipografis", () => {
    expect(sanitasiTeks("\u2018a\u2019 \u201Cb\u201D \u2013 \u2014 \u2026")).toBe(
      "'a' \"b\" - - ...",
    );
  });

  it("membuang zero-width dan variation selector", () => {
    expect(sanitasiTeks("a\u200Bb\uFE0Fc")).toBe("abc");
  });
});

describe("susunDokumenLed", () => {
  it("menyisipkan simpul BAB dan kelompok dengan urutan benar", () => {
    const simpul = susunDokumenLed([
      bagian({ kode: "BAB1.A", judul: "Dasar Penyusunan" }),
      bagian({ kode: "BAB2.A", judul: "Kondisi Eksternal" }),
      bagian({ kode: "BAB2.B.1", judul: "Sejarah" }),
      bagian({ kode: "BAB2.C.1.1.A", judul: "Butir 1" }),
      bagian({ kode: "BAB2.D.1", judul: "Suplemen 1" }),
      bagian({ kode: "BAB3", judul: "Penutup" }),
    ]);

    const peta = simpul.map((s) =>
      s.tipe === "bab" ? `BAB:${s.nomor}` : s.tipe === "kelompok" ? `KEL:${s.kode}` : `BAG:${s.kode}`,
    );

    expect(peta).toEqual([
      "BAB:I",
      "BAG:BAB1.A",
      "BAB:II",
      "KEL:BAB2.A",
      "BAG:BAB2.A",
      "KEL:BAB2.B",
      "BAG:BAB2.B.1",
      "KEL:BAB2.C",
      "BAG:BAB2.C.1.1.A",
      "KEL:BAB2.D",
      "BAG:BAB2.D.1",
      "BAB:III",
      "BAG:BAB3",
    ]);
  });

  it("menandai bagian kosong dan menghitung karakternya", () => {
    const simpul = susunDokumenLed([
      bagian({ kode: "BAB1.A", isian: null }),
      bagian({ kode: "BAB1.B", isian: isian("  ") }),
      bagian({ kode: "BAB1.C", isian: isian("Isi nyata.") }),
    ]);

    const isi = simpul.filter((s) => s.tipe === "bagian");
    expect(isi.map((s) => s.tipe === "bagian" && s.kosong)).toEqual([true, true, false]);
    expect(isi[2]?.tipe === "bagian" && isi[2].karakter).toBe(10);
  });

  it("judul BAB diberi nama yang enak dibaca", () => {
    const simpul = susunDokumenLed([bagian({ kode: "BAB2.A" })]);
    const bab = simpul[0];
    expect(bab?.tipe === "bab" && bab.judul).toBe("Laporan Evaluasi Diri");
  });

  it("daftar kosong menghasilkan simpul kosong", () => {
    expect(susunDokumenLed([])).toEqual([]);
  });
});

describe("labelBagian", () => {
  it("membuang awalan BAB", () => {
    expect(labelBagian({ kode: "BAB2.C.2.1.A" })).toBe("C.2.1.A");
    expect(labelBagian({ kode: "BAB1.A" })).toBe("A");
  });
});

describe("periksaPraExport", () => {
  const banyak = (n: number, konten: string) =>
    Array.from({ length: n }, (_, i) =>
      bagian({ kode: `BAB2.C.1.${i + 1}.A`, isian: isian(konten) }),
    );

  it("melaporkan bagian kosong", () => {
    const hasil = periksaPraExport([
      bagian({ kode: "BAB1.A", judul: "Satu", isian: isian("ada") }),
      bagian({ kode: "BAB1.B", judul: "Dua", isian: null }),
    ]);

    expect(hasil.jumlahBagian).toBe(2);
    expect(hasil.jumlahKosong).toBe(1);
    expect(hasil.kosong).toEqual([{ kode: "BAB1.B", judul: "Dua" }]);
    expect(hasil.siap).toBe(false);
  });

  it("menghitung estimasi halaman dari total karakter", () => {
    const hasil = periksaPraExport(banyak(3, "x".repeat(3000)), {
      karakterPerHalaman: 3000,
    });
    expect(hasil.totalKarakter).toBe(9000);
    expect(hasil.estimasiHalaman).toBe(3);
    expect(hasil.lebihBatas).toBe(false);
    expect(hasil.siap).toBe(true);
  });

  it("menandai lebihBatas kalau estimasi melewati batas", () => {
    const hasil = periksaPraExport(banyak(2, "x".repeat(3000)), {
      karakterPerHalaman: 3000,
      batasHalaman: 1,
    });
    expect(hasil.estimasiHalaman).toBe(2);
    expect(hasil.lebihBatas).toBe(true);
    expect(hasil.siap).toBe(false);
  });

  it("pakai batas 150 halaman secara default", () => {
    const hasil = periksaPraExport(banyak(1, "x".repeat(100)));
    expect(hasil.batasHalaman).toBe(150);
    expect(hasil.estimasiHalaman).toBe(1);
  });
});

describe("namaBerkasLed", () => {
  it("membersihkan nama prodi dan memakai tanggal", () => {
    const nama = namaBerkasLed(
      "Ilmu Komputer",
      "2024/2025",
      "Ganjil",
      "docx",
      new Date("2026-09-18T00:00:00Z"),
    );
    expect(nama).toBe("LED_Ilmu-Komputer_2024-2025-Ganjil_2026-09-18.docx");
  });

  it("membuang karakter yang tidak aman untuk nama berkas", () => {
    const nama = namaBerkasLed(
      "S1 / Teknik: Informatika",
      "2025/2026",
      "Genap",
      "pdf",
      new Date("2026-01-02T00:00:00Z"),
    );
    expect(nama).not.toMatch(/[/:\\]/);
    expect(nama.endsWith(".pdf")).toBe(true);
  });
});

describe("ringkasBlok", () => {
  it("mengambil paragraf pertama", () => {
    const blok = parseMarkdownBlok("## Judul\n\nKalimat ringkasannya.\n\nLain.");
    expect(ringkasBlok(blok)).toBe("Kalimat ringkasannya.");
  });

  it("memotong teks panjang dengan elipsis", () => {
    const blok = parseMarkdownBlok("x".repeat(300));
    const hasil = ringkasBlok(blok, 50);
    expect(hasil.length).toBe(50);
    expect(hasil.endsWith("...")).toBe(true);
  });

  it("mengembalikan string kosong kalau tak ada paragraf", () => {
    expect(ringkasBlok(parseMarkdownBlok("## Judul saja"))).toBe("");
  });
});
