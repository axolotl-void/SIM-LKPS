import { describe, it, expect } from "vitest";
import { isTransientDbError, withDbRetry } from "@/lib/utils/db-retry";

/** Tiruan error Prisma saat koneksi bermasalah. */
function errDb(msg: string, code?: string, name = "PrismaClientInitializationError") {
  const e = new Error(msg) as Error & { code?: string };
  e.name = name;
  if (code) e.code = code;
  return e;
}

describe("isTransientDbError", () => {
  it("mengenali error 'Can't reach database server'", () => {
    expect(isTransientDbError(errDb("Can't reach database server at `x.neon.tech:5432`"))).toBe(true);
  });

  it("mengenali kode Prisma yang bersifat sesaat", () => {
    for (const kode of ["P1001", "P1002", "P1008", "P1017", "P2024"]) {
      expect(isTransientDbError(errDb("gagal", kode))).toBe(true);
    }
  });

  it("mengenali koneksi putus / timeout", () => {
    expect(isTransientDbError(new Error("read ECONNRESET"))).toBe(true);
    expect(isTransientDbError(new Error("connect ETIMEDOUT"))).toBe(true);
    expect(isTransientDbError(new Error("Server has closed the connection"))).toBe(true);
  });

  it("TIDAK menganggap error biasa sebagai gangguan koneksi", () => {
    // Ini yang penting: password salah / bug kode tidak boleh di-retry
    expect(isTransientDbError(new Error("Invalid `db.user.findUnique()` invocation"))).toBe(false);
    expect(isTransientDbError(new Error("Unique constraint failed"))).toBe(false);
    expect(isTransientDbError(null)).toBe(false);
    expect(isTransientDbError(undefined)).toBe(false);
    expect(isTransientDbError("bukan error")).toBe(false);
  });
});

describe("withDbRetry", () => {
  it("mengembalikan hasil kalau sukses di percobaan pertama", async () => {
    let panggil = 0;
    const hasil = await withDbRetry(async () => { panggil++; return "ok"; });
    expect(hasil).toBe("ok");
    expect(panggil).toBe(1);
  });

  it("mencoba ulang lalu berhasil (kasus Neon bangun)", async () => {
    let panggil = 0;
    const hasil = await withDbRetry(
      async () => {
        panggil++;
        if (panggil < 3) throw errDb("Can't reach database server");
        return "pulih";
      },
      { baseDelayMs: 5 }
    );
    expect(hasil).toBe("pulih");
    expect(panggil).toBe(3);
  });

  it("menyerah setelah percobaan habis dan melempar error terakhir", async () => {
    let panggil = 0;
    await expect(
      withDbRetry(async () => { panggil++; throw errDb("Can't reach database server"); }, { attempts: 3, baseDelayMs: 5 })
    ).rejects.toThrow(/Can't reach database server/);
    expect(panggil).toBe(3);
  });

  it("TIDAK mengulang error yang bukan gangguan koneksi", async () => {
    let panggil = 0;
    await expect(
      withDbRetry(async () => { panggil++; throw new Error("Unique constraint failed"); }, { baseDelayMs: 5 })
    ).rejects.toThrow("Unique constraint failed");
    expect(panggil, "harus langsung gagal, tanpa retry").toBe(1);
  });
});
