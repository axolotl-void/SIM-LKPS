import crypto from "node:crypto";
import { describe, expect, it } from "vitest";

import { asalPublik, periksaTokenSso, peranUntuk } from "@/lib/utils/sso-spmi";

/**
 * Uji token SSO SPMI ⇄ SIM-LKPS (RANCANGAN-014).
 *
 * Yang diuji di sini bukan "aplikasinya jalan", tapi hal-hal yang kalau salah
 * berakibat serius: token palsu diterima, token kedaluwarsa masih lolos, atau
 * peran naik sendiri. Semua fungsi murni — tidak butuh database atau server.
 */

const RAHASIA = "rahasia-uji-yang-panjangnya-lebih-dari-32-karakter";

function buatToken(
  payload: Record<string, unknown>,
  rahasia = RAHASIA
): string {
  const isi = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const tandaTangan = crypto
    .createHmac("sha256", rahasia)
    .update(isi)
    .digest("base64url");
  return `${isi}.${tandaTangan}`;
}

function payloadSah(ubah: Record<string, unknown> = {}) {
  return {
    e: "dosen@bbg.ac.id",
    n: "Dosen UBBG",
    r: "Auditee",
    j: crypto.randomBytes(16).toString("hex"),
    x: Math.floor(Date.now() / 1000) + 60,
    ...ubah,
  };
}

describe("periksaTokenSso", () => {
  it("menerima token yang ditandatangani dengan benar", () => {
    process.env.SSO_SPMI_SECRET = RAHASIA;
    const hasil = periksaTokenSso(buatToken(payloadSah()));
    expect(hasil.ok).toBe(true);
    if (hasil.ok) expect(hasil.data.e).toBe("dosen@bbg.ac.id");
  });

  it("menolak token yang isinya diubah", () => {
    process.env.SSO_SPMI_SECRET = RAHASIA;
    const token = buatToken(payloadSah());
    const [isi, tandaTangan] = token.split(".");
    // Penyerang mengganti email jadi miliknya, tanda tangan dari token asli
    // tetap dipakai. Inilah serangan yang paling mungkin dicoba.
    const isiPalsu = Buffer.from(
      JSON.stringify(payloadSah({ e: "penyerang@bbg.ac.id" }))
    ).toString("base64url");
    const hasil = periksaTokenSso(`${isiPalsu}.${tandaTangan}`);
    expect(hasil.ok).toBe(false);
    expect(isi).not.toBe(isiPalsu);
  });

  it("menolak token yang ditandatangani rahasia lain", () => {
    process.env.SSO_SPMI_SECRET = RAHASIA;
    const hasil = periksaTokenSso(
      buatToken(payloadSah(), "rahasia-lain-yang-juga-panjang-lebih-32-karakter")
    );
    expect(hasil.ok).toBe(false);
  });

  it("menolak token kedaluwarsa", () => {
    process.env.SSO_SPMI_SECRET = RAHASIA;
    const hasil = periksaTokenSso(
      buatToken(payloadSah({ x: Math.floor(Date.now() / 1000) - 1 }))
    );
    expect(hasil.ok).toBe(false);
  });

  it("menolak token berumur terlalu panjang (jam server melenceng)", () => {
    process.env.SSO_SPMI_SECRET = RAHASIA;
    const hasil = periksaTokenSso(
      buatToken(payloadSah({ x: Math.floor(Date.now() / 1000) + 3600 }))
    );
    expect(hasil.ok).toBe(false);
  });

  it("menolak semuanya kalau rahasia belum diisi", () => {
    delete process.env.SSO_SPMI_SECRET;
    const hasil = periksaTokenSso(buatToken(payloadSah()));
    expect(hasil.ok).toBe(false);
  });

  it("menolak token yang bentuknya tidak lengkap", () => {
    process.env.SSO_SPMI_SECRET = RAHASIA;
    expect(periksaTokenSso("bukan-token").ok).toBe(false);
    expect(periksaTokenSso(".tanda-tangan-saja").ok).toBe(false);
    expect(periksaTokenSso("isi-saja.").ok).toBe(false);
  });
});

describe("asalPublik", () => {
  it("memakai host dari proxy, bukan alamat internal container", () => {
    // Inilah kasus server kampus: Node jalan di 0.0.0.0:3000, Apache di depan.
    const req = new Request("http://0.0.0.0:3000/masuk", {
      headers: {
        host: "0.0.0.0:3000",
        "x-forwarded-host": "lkps.bbg.ac.id",
        "x-forwarded-proto": "https",
      },
    });
    expect(asalPublik(req)).toBe("https://lkps.bbg.ac.id");
  });

  it("memakai host biasa kalau tidak ada header proxy (uji lokal)", () => {
    const req = new Request("http://127.0.0.1:3010/masuk", {
      headers: { host: "127.0.0.1:3010" },
    });
    // Skema mengikuti permintaan (http), bukan dipatok https — kalau dipatok,
    // pengalihan di lokal menunjuk ke alamat yang tidak bisa dibuka.
    expect(asalPublik(req)).toBe("http://127.0.0.1:3010");
  });

  it("jatuh ke AUTH_URL kalau host tidak berguna", () => {
    process.env.AUTH_URL = "https://lkps.bbg.ac.id/";
    const req = new Request("http://0.0.0.0:3000/masuk", {
      headers: { host: "0.0.0.0:3000" },
    });
    expect(asalPublik(req)).toBe("https://lkps.bbg.ac.id");
    delete process.env.AUTH_URL;
  });
});

describe("peranUntuk", () => {
  it("memetakan LPM ke ADMIN (yang mengelola data)", () => {
    expect(peranUntuk("LPM")).toBe("ADMIN");
    expect(peranUntuk("lpm")).toBe("ADMIN");
  });

  it("memetakan auditee ke OPERATOR (yang mengisi)", () => {
    expect(peranUntuk("Auditee")).toBe("OPERATOR");
  });

  it("TIDAK PERNAH memberi ADMIN untuk peran tak dikenal", () => {
    // Salah ketik di sisi SPMI tidak boleh berujung akses admin.
    expect(peranUntuk("superuser")).toBe("OPERATOR");
    expect(peranUntuk("")).toBe("OPERATOR");
    expect(peranUntuk("PIMPINAN")).toBe("OPERATOR");
  });
});
