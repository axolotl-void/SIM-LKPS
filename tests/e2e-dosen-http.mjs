/**
 * Uji end-to-end endpoint POST /api/master/dosen lewat HTTP sungguhan.
 *
 * Alur: ambil CSRF -> login kredensial -> POST /api/master/dosen -> verifikasi.
 * Dosen uji memakai NIDN 9999999999. Pembersihan TIDAK lewat HTTP (tidak ada
 * route DELETE), melainkan lewat tests/cleanup-dosen-uji.mjs.
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

const NIDN_UJI = "9999999999";
const NAMA_UJI = "ZZ UJI HAPUS";

const cookieJar = new Map();

function simpanCookie(res) {
  const raw = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const c of raw) {
    const [pair] = c.split(";");
    const idx = pair.indexOf("=");
    const k = pair.slice(0, idx).trim();
    const v = pair.slice(idx + 1).trim();
    if (v === "" || v === "deleted") cookieJar.delete(k);
    else cookieJar.set(k, v);
  }
}

function cookieHeader() {
  return [...cookieJar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, {
    ...opts,
    redirect: "manual",
    headers: { ...(opts.headers || {}), cookie: cookieHeader() },
  });
  simpanCookie(res);
  return res;
}

(async () => {
  const hasil = [];
  const catat = (label, lulus, detail) => {
    hasil.push({ label, lulus, detail });
    console.log(`${lulus ? "  LULUS" : "  GAGAL"}  ${label}\n         ${detail}`);
  };

  const home = await req("/login");
  if (home.status !== 200) {
    console.error(`Server tidak merespons di ${BASE} (status ${home.status})`);
    process.exit(2);
  }
  console.log(`Server aktif di ${BASE}\n`);

  console.log("-- Autentikasi --");
  const csrfRes = await req("/api/auth/csrf");
  const { csrfToken } = await csrfRes.json();

  const body = new URLSearchParams({
    csrfToken,
    email: process.env.UJI_EMAIL,
    password: process.env.UJI_PASSWORD,
    callbackUrl: BASE + "/dashboard",
    json: "true",
  });
  const loginRes = await req("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const sesiAda = [...cookieJar.keys()].some((k) => k.includes("session-token"));
  catat(
    "Login berhasil",
    sesiAda,
    `status ${loginRes.status} (302 = redirect sukses), cookie sesi ${sesiAda ? "ada" : "TIDAK ADA"}`
  );

  const ses = await (await req("/api/auth/session")).json();
  catat(
    "Sesi terbaca",
    !!ses?.user?.email,
    ses?.user ? `${ses.user.email} (${ses.user.role})` : "sesi kosong"
  );

  const daftar0 = await (await req("/api/master/dosen")).json();
  const sebelum = Array.isArray(daftar0) ? daftar0.length : -1;
  if (Array.isArray(daftar0) && daftar0.some((d) => d.nidn === NIDN_UJI)) {
    console.error("\nPERINGATAN: baris uji dari run sebelumnya masih ada.");
    console.error("Jalankan dulu: node --env-file=.env tests/cleanup-dosen-uji.mjs\n");
    process.exit(4);
  }
  console.log(`  (jumlah dosen sebelum uji: ${sebelum})\n`);

  console.log("-- BUG-01: izin menambah dosen --");
  const payload = {
    nidn: NIDN_UJI,
    nama: NAMA_UJI,
    jabatanFungsional: "Lektor Kepala",
    pendidikanTerakhir: "S3",
    bidangKeahlian: "Uji Otomatis",
    status: "Tidak Tetap",
    jenisKelamin: "P",
  };
  const createRes = await req("/api/master/dosen", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const createTxt = await createRes.text();

  catat(
    "POST dosen tidak lagi 403",
    createRes.status === 201,
    `status ${createRes.status} (201 = berhasil | 403 = bug lama) -> ${createTxt.slice(0, 140)}`
  );

  let dibuat = null;
  try {
    dibuat = JSON.parse(createTxt);
  } catch {
    /* null */
  }

  if (dibuat?.id) {
    const daftar1 = await (await req("/api/master/dosen")).json();
    const rec = Array.isArray(daftar1) ? daftar1.find((d) => d.id === dibuat.id) : null;

    console.log("\n-- BUG-02: jabatan fungsional --");
    catat(
      "jabatanFungsional tersimpan (dulu selalu null)",
      rec?.jabatanFungsional === "Lektor Kepala",
      `tersimpan = ${JSON.stringify(rec?.jabatanFungsional)}`
    );

    console.log("\n-- BUG-03: data tidak direkayasa --");
    catat(
      "status dihormati (dulu dipaksa 'Tetap')",
      rec?.status === "Tidak Tetap",
      `tersimpan = ${JSON.stringify(rec?.status)}`
    );
    catat(
      "jenisKelamin dihormati (dulu dipaksa 'L')",
      rec?.jenisKelamin === "P",
      `tersimpan = ${JSON.stringify(rec?.jenisKelamin)}`
    );
    catat(
      "NIDN dipakai apa adanya (dulu acak)",
      rec?.nidn === NIDN_UJI,
      `tersimpan = ${JSON.stringify(rec?.nidn)} | dikirim = ${NIDN_UJI}`
    );

    console.log("\n-- Validasi input --");
    const dup = await req("/api/master/dosen", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, nama: "Duplikat" }),
    });
    catat("NIDN duplikat ditolak 400", dup.status === 400, `status ${dup.status}`);

    const nonAngka = await req("/api/master/dosen", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, nidn: "ABC123" }),
    });
    catat("NIDN non-angka ditolak 400", nonAngka.status === 400, `status ${nonAngka.status}`);

    const tanpaNama = await req("/api/master/dosen", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, nidn: "9999999998", nama: "" }),
    });
    catat("Nama kosong ditolak 400", tanpaNama.status === 400, `status ${tanpaNama.status}`);
  }

  const gagal = hasil.filter((h) => !h.lulus);
  console.log(
    `\n============ ${hasil.length - gagal.length}/${hasil.length} LULUS ============`
  );
  if (dibuat?.id) {
    console.log("JANGAN LUPA bersihkan: node --env-file=.env tests/cleanup-dosen-uji.mjs");
  }
  process.exit(gagal.length === 0 ? 0 : 1);
})().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(3);
});
