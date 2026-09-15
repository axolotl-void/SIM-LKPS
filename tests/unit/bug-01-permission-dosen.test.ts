import { describe, it, expect } from "vitest";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";

/**
 * Regression tests — BUG-01 (2026-09-15)
 *
 * Sebelum perbaikan: permissions.ts mendefinisikan "master_dosen.*" (underscore)
 * sedangkan app/api/master/dosen/route.ts memeriksa "master.dosen.create" (titik).
 * hasPermission() mencocokkan wildcard dengan prefix yang identik, sehingga
 * "master_dosen.*" tidak pernah cocok dengan "master.dosen.create".
 * Akibatnya SEMUA role menerima 403 saat menambah dosen.
 */
describe("BUG-01: izin master.dosen.create harus dimiliki role yang berhak", () => {
  it("ADMIN boleh menambah dosen (lewat wildcard master.dosen.*)", () => {
    expect(hasPermission(Role.ADMIN, "master.dosen.create")).toBe(true);
  });

  it("ADMIN juga boleh update/delete dosen", () => {
    expect(hasPermission(Role.ADMIN, "master.dosen.update")).toBe(true);
    expect(hasPermission(Role.ADMIN, "master.dosen.delete")).toBe(true);
  });

  it("OPERATOR boleh menambah dosen (izin eksplisit)", () => {
    expect(hasPermission(Role.OPERATOR, "master.dosen.create")).toBe(true);
  });

  it("PIMPINAN TIDAK boleh menambah dosen (read-only)", () => {
    expect(hasPermission(Role.PIMPINAN, "master.dosen.create")).toBe(false);
  });

  it("format lama berseparator underscore tidak lagi dipakai", () => {
    // Bila ada yang mengembalikan format lama, uji ini gagal sebagai peringatan.
    expect(hasPermission(Role.ADMIN, "master_dosen.create")).toBe(false);
  });
});
