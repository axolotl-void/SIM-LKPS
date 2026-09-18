/**
 * Pembangun PDF untuk dokumen LED.
 *
 * Memakai `@react-pdf/renderer` (JS murni) — bukan Playwright/Chromium, yang
 * gagal di Vercel Lambda (lihat RANCANGAN-005).
 *
 * Catatan font: PDF standar tidak menyertakan Arial. Dipakai **Helvetica**,
 * metrik paling dekat dengan Arial, supaya tanpa menanam berkas font ke dalam
 * bundle serverless. Dokumen Word tetap memakai Arial sungguhan.
 */

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { LedBagianData } from "@/components/led/types";
import {
  pecahInline,
  sanitasiTeks,
  susunDokumenLed,
  type Blok,
} from "./led-dokumen";
import type { MetaLed } from "./led-docx";

const A4 = { width: 595.28, height: 841.89 };

const s = StyleSheet.create({
  page: {
    size: "A4",
    paddingTop: 85, // 3 cm ≈ 85 pt
    paddingBottom: 85,
    paddingHorizontal: 85,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.15,
    color: "#111111",
  },
  // ── halaman muka
  muka: { flexGrow: 1, justifyContent: "center", alignItems: "center", textAlign: "center" },
  mukaPt: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  mukaProdi: { fontSize: 12, marginBottom: 48 },
  mukaJudul: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  mukaSub: { fontSize: 12, marginBottom: 40 },
  mukaTa: { fontSize: 12, marginBottom: 4 },
  mukaTgl: { fontSize: 10, color: "#666666" },

  // ── daftar isi
  h1: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 12 },
  diBaris: { fontSize: 10, marginBottom: 2 },

  // ── bab
  babNomor: { fontSize: 16, fontFamily: "Helvetica-Bold", textAlign: "center", marginTop: 24 },
  babJudul: { fontSize: 13, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 24 },
  kelompok: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 18, marginBottom: 10 },
  bagianJudul: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 14, marginBottom: 6 },
  ppepp: { fontSize: 9, color: "#666666", fontStyle: "italic", marginBottom: 6 },
  kosong: { fontSize: 11, color: "#999999", fontStyle: "italic", marginBottom: 8 },

  // ── blok
  p: { textAlign: "justify", marginBottom: 6 },
  pKutipan: { marginLeft: 20, fontStyle: "italic", color: "#444444", marginBottom: 6 },
  pKode: {
    fontFamily: "Courier",
    fontSize: 9,
    backgroundColor: "#F2F2F2",
    padding: 6,
    marginBottom: 6,
  },
  hr: { borderBottomWidth: 0.5, borderBottomColor: "#999999", marginVertical: 8 },
  listBaris: { flexDirection: "row", marginBottom: 3, paddingRight: 8 },
  listBullet: { width: 16, fontSize: 11 },
  listTeks: { flexGrow: 1, textAlign: "justify" },

  // ── heading inline
  h2: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 10, marginBottom: 5 },
  h3: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 8, marginBottom: 4 },
  h4: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 6, marginBottom: 4 },

  // ── header/footer
  header: { fontSize: 8, color: "#888888", textAlign: "right", marginBottom: 12 },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 85,
    right: 85,
    fontSize: 9,
    color: "#666666",
    textAlign: "center",
  },
});

/** Teks inline (bold/italic/kode) → <Text> bersarang. */
function Inline({ teks }: { teks: string }) {
  const potongan = pecahInline(sanitasiTeks(teks));
  return (
    <>
      {potongan.map((p, i) => (
        <Text
          key={i}
          style={{
            ...(p.bold ? { fontFamily: "Helvetica-Bold" } : {}),
            ...(p.italic ? { fontStyle: "italic" } : {}),
            ...(p.kode ? { fontFamily: "Courier", fontSize: 9.5 } : {}),
          }}
        >
          {p.teks}
        </Text>
      ))}
    </>
  );
}

/** Blok Markdown → elemen react-pdf. */
function BlokPdf({ blok }: { blok: Blok[] }) {
  return (
    <>
      {blok.map((b, i) => {
        switch (b.tipe) {
          case "heading":
            return (
              <Text
                key={i}
                style={b.level <= 1 ? s.h2 : b.level === 2 ? s.h3 : s.h4}
                break={false}
              >
                {sanitasiTeks(b.teks)}
              </Text>
            );
          case "paragraf":
            return (
              <Text key={i} style={s.p}>
                <Inline teks={b.teks} />
              </Text>
            );
          case "list":
            return (
              <View key={i}>
                {b.item.map((it, j) => (
                  <View key={j} style={s.listBaris} wrap={false}>
                    <Text style={s.listBullet}>{b.ordered ? `${j + 1}.` : "-"}</Text>
                    <Text style={s.listTeks}>
                      <Inline teks={it} />
                    </Text>
                  </View>
                ))}
              </View>
            );
          case "quote":
            return (
              <Text key={i} style={s.pKutipan}>
                <Inline teks={b.teks} />
              </Text>
            );
          case "hr":
            return <View key={i} style={s.hr} />;
          case "code":
            return (
              <Text key={i} style={s.pKode}>
                {sanitasiTeks(b.teks)}
              </Text>
            );
        }
      })}
    </>
  );
}

export type { MetaLed };

/** Bangun dokumen PDF LED. Mengembalikan Buffer siap kirim. */
export async function buildLedPdf(
  bagian: LedBagianData[],
  meta: MetaLed,
): Promise<Buffer> {
  const simpul = susunDokumenLed(bagian);
  const tanggal = (meta.tanggal ?? new Date()).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const doc = (
    <Document
      title={`Laporan Evaluasi Diri — ${meta.prodi}`}
      author="SIM-LKPS"
      subject={`LED ${meta.prodi} ${meta.tahun} ${meta.semester}`}
      creator="SIM-LKPS"
    >
      {/* ── Halaman muka */}
      <Page size="A4" style={s.page}>
        <View style={s.muka}>
          <Text style={s.mukaPt}>{sanitasiTeks(meta.perguruanTinggi.toUpperCase())}</Text>
          <Text style={s.mukaProdi}>
            {sanitasiTeks(`${meta.prodi} (${meta.jenjang})`)}
          </Text>
          <Text style={s.mukaJudul}>LAPORAN EVALUASI DIRI</Text>
          <Text style={s.mukaSub}>Akreditasi Program Studi — LAM INFOKOM 2.1</Text>
          <Text style={s.mukaTa}>
            {sanitasiTeks(`Tahun Akademik ${meta.tahun} — ${meta.semester}`)}
          </Text>
          <Text style={s.mukaTgl}>{sanitasiTeks(`Dicetak: ${tanggal}`)}</Text>
        </View>
      </Page>

      {/* ── Daftar isi */}
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>Daftar Isi</Text>
        {bagian.map((b) => (
          <Text key={b.id} style={s.diBaris}>
            {sanitasiTeks(`${b.kode.replace(/^BAB/, "BAB ")}  ${b.judul}`)}
          </Text>
        ))}
      </Page>

      {/* ── Isi */}
      <Page size="A4" style={s.page}>
        <Text
          style={s.header}
          fixed
        >{sanitasiTeks(`LED ${meta.prodi} — ${meta.tahun} ${meta.semester}`)}</Text>

        {simpul.map((n, i) => {
          if (n.tipe === "bab") {
            return (
              <View key={i} break={i > 0}>
                <Text style={s.babNomor}>{sanitasiTeks(`BAB ${n.nomor}`)}</Text>
                <Text style={s.babJudul}>{sanitasiTeks(n.judul)}</Text>
              </View>
            );
          }

          if (n.tipe === "kelompok") {
            return (
              <Text key={i} style={s.kelompok}>
                {sanitasiTeks(n.judul)}
              </Text>
            );
          }

          return (
            <View key={i} wrap={false}>
              <Text style={s.bagianJudul}>
                {sanitasiTeks(`${n.label}  ${n.judul}`)}
              </Text>
              {n.tahapPpepp ? (
                <Text style={s.ppepp}>
                  {sanitasiTeks(`Tahap PPEPP: ${n.tahapPpepp}`)}
                </Text>
              ) : null}
              {n.kosong ? (
                <Text style={s.kosong}>[belum diisi]</Text>
              ) : (
                <BlokPdf blok={n.blok} />
              )}
            </View>
          );
        })}

        <Text
          style={s.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            `Halaman ${pageNumber} dari ${totalPages}`
          }
        />
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
