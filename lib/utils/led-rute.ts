/**
 * Pemetaan kode bagian LED → rute halaman editornya.
 *
 * Dipakai untuk menautkan daftar bagian kosong di dialog export ke tempat
 * pengisiannya, tanpa harus menyimpan rute di DB.
 */
export function ruteBagianLed(kode: string): string {
  if (kode === "BAB1.A" || kode === "BAB1.B" || kode === "BAB1.C") return "/led/bab-1";
  if (kode === "BAB3") return "/led/bab-3";
  if (kode === "BAB2.A") return "/led/bab-2/kondisi-eksternal";
  if (kode.startsWith("BAB2.B")) return "/led/bab-2/profil";
  if (kode.startsWith("BAB2.D")) return "/led/bab-2/suplemen";

  const c = /^BAB2\.C\.(\d)/.exec(kode);
  if (c?.[1]) return `/led/bab-2/kriteria/${c[1]}`;

  return "/led";
}
