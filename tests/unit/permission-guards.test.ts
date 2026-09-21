import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";

/**
 * Regression tests — celah izin di server action (2026-09-22)
 *
 * Sebelum perbaikan, beberapa server action hanya memeriksa "sudah login":
 *   - lib/actions/evidence.ts   (5 action, tanpa cek izin sama sekali)
 *   - lib/actions/mahasiswa.ts  (3 action)
 *   - lib/actions/matakuliah.ts (3 action)
 *   - lib/actions/lkps.ts       -> updateDosen, deleteDosen
 *
 * Akibatnya PIMPINAN -- yang menurut matriks izin bersifat read-only -- tetap
 * bisa memanggilnya langsung dari browser, karena sidebar yang menyembunyikan
 * tombol BUKAN pengaman. Server action adalah endpoint POST publik.
 */

const AKAR_REPO = join(__dirname, "..", "..");

/** Semua berkas .ts/.tsx di app/, lib/, components/ (bukan node_modules). */
function berkasSumber(dir: string, keluar: string[] = []): string[] {
  for (const nama of readdirSync(dir)) {
    if (nama === "node_modules" || nama === ".next" || nama.startsWith(".")) continue;
    const jalur = join(dir, nama);
    if (statSync(jalur).isDirectory()) berkasSumber(jalur, keluar);
    else if (/\.(ts|tsx)$/.test(nama)) keluar.push(jalur);
  }
  return keluar;
}

/** Semua literal izin yang diperiksa lewat hasPermission(role, "…"). */
function izinYangDiperiksa(): Map<string, string[]> {
  const ditemukan = new Map<string, string[]>();
  for (const direktori of ["app", "lib", "components"]) {
    for (const berkas of berkasSumber(join(AKAR_REPO, direktori))) {
      const isi = readFileSync(berkas, "utf8");
      for (const cocok of isi.matchAll(/hasPermission\(\s*[^,()]+,\s*"([^"]+)"/g)) {
        const izin = cocok[1]!;
        if (!ditemukan.has(izin)) ditemukan.set(izin, []);
        ditemukan.get(izin)!.push(berkas.replace(AKAR_REPO + "/", ""));
      }
    }
  }
  return ditemukan;
}

describe("Matriks izin — PIMPINAN hanya membaca", () => {
  const izinTulis = [
    "evidence.create",
    "evidence.delete",
    "master_data.create",
    "master_data.update",
    "master_data.delete",
    "master.dosen.create",
    "master.dosen.update",
    "master.dosen.delete",
    "tabel_lkps.create",
    "tabel_lkps.update",
    "tabel_lkps.submit",
    "tabel_lkps.validate",
    "led.update",
    "penilaian.update",
    "penilaian.finalisasi",
    "user.create",
    "user.delete",
  ];

  it.each(izinTulis)("PIMPINAN tidak punya %s", (izin) => {
    expect(hasPermission(Role.PIMPINAN, izin)).toBe(false);
  });

  it("PIMPINAN tetap boleh membaca dan mengekspor", () => {
    expect(hasPermission(Role.PIMPINAN, "dashboard.read")).toBe(true);
    expect(hasPermission(Role.PIMPINAN, "tabel_lkps.read")).toBe(true);
    expect(hasPermission(Role.PIMPINAN, "evidence.read")).toBe(false);
    expect(hasPermission(Role.PIMPINAN, "report.export")).toBe(true);
  });
});

describe("Matriks izin — OPERATOR", () => {
  it("boleh mengelola bukti pendukung, termasuk menghapus", () => {
    expect(hasPermission(Role.OPERATOR, "evidence.create")).toBe(true);
    expect(hasPermission(Role.OPERATOR, "evidence.read")).toBe(true);
    expect(hasPermission(Role.OPERATOR, "evidence.delete")).toBe(true);
  });

  it("menambah dosen boleh, mengubah/menghapus tidak", () => {
    expect(hasPermission(Role.OPERATOR, "master.dosen.create")).toBe(true);
    expect(hasPermission(Role.OPERATOR, "master.dosen.update")).toBe(false);
    expect(hasPermission(Role.OPERATOR, "master.dosen.delete")).toBe(false);
  });

  it("tidak boleh menulis master data mahasiswa / mata kuliah", () => {
    expect(hasPermission(Role.OPERATOR, "master_data.create")).toBe(false);
    expect(hasPermission(Role.OPERATOR, "master_data.update")).toBe(false);
    expect(hasPermission(Role.OPERATOR, "master_data.delete")).toBe(false);
  });
});

describe("Matriks izin — ADMIN", () => {
  it("boleh semuanya yang dipakai kode", () => {
    for (const izin of izinYangDiperiksa().keys()) {
      expect(hasPermission(Role.ADMIN, izin), `ADMIN harus punya ${izin}`).toBe(true);
    }
  });
});

/**
 * Inti perbaikan: setiap action yang MENGUBAH data wajib memanggil
 * hasPermission(). Uji ini membaca berkas sumbernya langsung, jadi ia gagal
 * kalau ada yang menghapus pemeriksaan itu di kemudian hari.
 */
describe("Setiap action yang mengubah data memanggil hasPermission()", () => {
  const WAJIB: Array<[string, string, string]> = [
    ["lib/actions/evidence.ts", "uploadEvidence", "evidence.create"],
    ["lib/actions/evidence.ts", "getEvidenceList", "evidence.read"],
    ["lib/actions/evidence.ts", "deleteEvidence", "evidence.delete"],
    ["lib/actions/evidence.ts", "addEvidenceLink", "evidence.create"],
    ["lib/actions/mahasiswa.ts", "createMahasiswa", "master_data.create"],
    ["lib/actions/mahasiswa.ts", "updateMahasiswa", "master_data.update"],
    ["lib/actions/mahasiswa.ts", "deleteMahasiswa", "master_data.delete"],
    ["lib/actions/matakuliah.ts", "createMatakuliah", "master_data.create"],
    ["lib/actions/matakuliah.ts", "updateMatakuliah", "master_data.update"],
    ["lib/actions/matakuliah.ts", "deleteMatakuliah", "master_data.delete"],
    ["lib/actions/lkps.ts", "createDosen", "master.dosen.create"],
    ["lib/actions/lkps.ts", "updateDosen", "master.dosen.update"],
    ["lib/actions/lkps.ts", "deleteDosen", "master.dosen.delete"],
  ];

  it.each(WAJIB)("%s → %s memeriksa izin %s", (berkas, fungsi, izin) => {
    const isi = readFileSync(join(AKAR_REPO, berkas), "utf8");
    const awal = isi.indexOf(`export async function ${fungsi}`);
    expect(awal, `${fungsi} tidak ditemukan di ${berkas}`).toBeGreaterThan(-1);

    // Badan fungsi = sampai deklarasi export berikutnya (atau akhir berkas).
    const sisa = isi.slice(awal + 1);
    const akhirBerikutnya = sisa.indexOf("\nexport async function");
    const badan = akhirBerikutnya === -1 ? sisa : sisa.slice(0, akhirBerikutnya);

    expect(
      badan.includes(`hasPermission(role, "${izin}")`),
      `${berkas} → ${fungsi} TIDAK memeriksa ${izin}`
    ).toBe(true);
  });

  it("lib/actions/notification.ts tidak lagi mengekspor createNotification sebagai server action", () => {
    const isi = readFileSync(join(AKAR_REPO, "lib/actions/notification.ts"), "utf8");
    expect(isi).toContain('"use server"');
    // Kalau baris ini kembali, siapa pun yang login bisa mengirim notifikasi
    // ke user mana pun lewat `userId` bebas.
    expect(isi).not.toMatch(/export async function createNotification/);
    expect(isi).not.toMatch(/export async function notifyMutation/);
  });
});

describe("Penjaga regresi — izin yang diperiksa harus dimiliki minimal satu peran", () => {
  it("tidak ada hasPermission() dengan izin yang tidak dimiliki siapa pun", () => {
    const yatim: string[] = [];
    for (const [izin, pemakai] of izinYangDiperiksa()) {
      const adaYangPunya = (Object.values(Role) as Role[]).some((peran) =>
        hasPermission(peran, izin)
      );
      if (!adaYangPunya) yatim.push(`${izin} (diperiksa di ${pemakai.join(", ")})`);
    }
    expect(yatim, `izin tanpa pemilik:\n${yatim.join("\n")}`).toEqual([]);
  });

  it("setidaknya menemukan izin yang diperiksa (penjaga agar pemindai tidak diam-diam kosong)", () => {
    expect(izinYangDiperiksa().size).toBeGreaterThan(5);
  });
});
