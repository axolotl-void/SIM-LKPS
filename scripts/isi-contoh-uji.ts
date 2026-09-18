/**
 * Isi data contoh di DB UJI supaya halaman LED & Matriks Penilaian bisa dilihat
 * dalam keadaan "nyata" (bukan kosong). HANYA untuk DB lokal.
 *
 *   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sim_lkps_uji" \
 *     npx tsx scripts/isi-contoh-uji.ts
 */
import { db } from "@/lib/db";

const URL_DB = process.env.DATABASE_URL ?? "";
if (!/@(localhost|127\.0\.0\.1)[:/]/.test(URL_DB)) {
  console.error("DITOLAK: skrip ini hanya boleh jalan di DB lokal, bukan produksi.");
  console.error("Host:", URL_DB.replace(/\/\/[^@]*@/, "//").split("/")[2] ?? "(kosong)");
  process.exit(1);
}

/** Narasi contoh per kode bagian LED. */
const NARASI: Record<string, string> = {
  "BAB1.A": `## Dasar Penyusunan

Laporan Evaluasi Diri (LED) ini disusun sebagai bagian dari proses akreditasi
Program Studi Ilmu Komputer Universitas Bina Bangsa Getsempena.

Penyusunan mengacu pada:

- Peraturan BAN-PT tentang instrumen akreditasi program studi
- Instrumen **LAM INFOKOM 2.1** beserta lampirannya
- Renstra Universitas Bina Bangsa Getsempena 2024–2028

> LED bersifat deskriptif dan analitis — bukan sekadar mengulang angka yang
> sudah ada di LKPS, melainkan menjelaskan *mengapa* angkanya demikian.`,
  "BAB1.B": `## Tim Penyusun dan Tanggung Jawabnya

Tim penyusun LED Program Studi Ilmu Komputer terdiri dari dosen tetap yang
ditunjuk melalui Surat Keputusan Dekan.

| Peran | Tanggung Jawab |
| --- | --- |
| Ketua | Koordinasi, penyusunan kerangka, dan finalisasi |
| Anggota Bidang Akademik | Kriteria 2 dan 4 |
| Anggota Bidang Riset | Kriteria 3 dan 6 |

Waktu penyusunan direncanakan selama delapan minggu dengan rapat koordinasi
mingguan.`,
  "BAB1.C": `## Mekanisme Kerja Penyusunan LED

Alur kerja penyusunan:

1. Pengumpulan data dari unit terkait
2. Verifikasi dan rekonsiliasi dengan LKPS
3. Penulisan draf narasi per kriteria
4. Reviu internal
5. Finalisasi

Setiap tahap dicatat dan didokumentasikan sebagai bukti pendukung.`,
  "BAB2.A": `## Kondisi Eksternal

Analisis lingkungan eksternal dilakukan untuk melihat peluang dan ancaman
yang mempengaruhi penyelenggaraan program studi.

Tren industri digital di Aceh menunjukkan permintaan yang meningkat terhadap
lulusan bidang informatika, seiring pertumbuhan pusat data regional dan
program transformasi digital pemerintah daerah.`,
  "BAB2.B.1": `## Sejarah Unit Pengelola Program Studi

Program Studi Ilmu Komputer diselenggarakan di bawah Fakultas Sains, Teknologi,
dan Ilmu Komputer. Sejak berdiri, program studi telah beberapa kali menyesuaikan
kurikulum mengikuti perkembangan kebutuhan industri.`,
  "BAB2.C.2.1.A": `## Penetapan

Program studi menetapkan kebijakan mutu melalui rapat kerja tahunan yang
melibatkan seluruh dosen dan tenaga kependidikan. Hasil rapat dituangkan dalam
dokumen sasaran mutu yang ditinjau setiap semester.`,
  "BAB2.C.2.1.B": `## Pelaksanaan

Pelaksanaan kebijakan mutu dilakukan melalui mekanisme monitoring pembelajaran
setiap pertengahan semester, dengan kuesioner yang diisi mahasiswa dan
dituangkan dalam laporan kepada ketua program studi.`,
  "BAB2.C.2.2.A": `## Penetapan

Kurikulum ditetapkan berdasarkan profil lulusan yang dirumuskan bersama
pengguna lulusan dan alumni, lalu diturunkan menjadi capaian pembelajaran.`,
  "BAB2.C.6.1.A": `## Penetapan

Program studi memiliki visi, misi, dan tujuan yang unik dan spesifik yang
menjadi pembeda dari program studi lain di universitas yang sama.`,
  "BAB2.D.1": `## Muatan Kurikulum Khas

Muatan kurikulum khas program studi dirancang untuk memberi keunggulan lulusan,
disesuaikan dengan kebutuhan lokal dan perkembangan teknologi terkini.`,
  "BAB3": `## Penutup

Laporan Evaluasi Diri ini menggambarkan kondisi penyelenggaraan program studi
beserta upaya pengembangan yang telah dilakukan.

Pelaksanaan program studi masih memiliki area yang perlu pembenahan, terutama
pada pemutakhiran media pembelajaran digital. Penilaian yang terbuka dari para
pihak akan berpengaruh besar terhadap peningkatan suasana akademik.`,
};

async function main() {
  const ta = await db.tahunAkademik.findFirst({ where: { isActive: true } });
  if (!ta) throw new Error("tidak ada tahun akademik aktif");
  console.log(`tahun akademik: ${ta.tahun} ${ta.semester}`);

  // ── LED: isi beberapa bagian
  let ledTerisi = 0;
  for (const [kode, konten] of Object.entries(NARASI)) {
    const bg = await db.ledBagian.findUnique({ where: { kode } });
    if (!bg) {
      console.log(`  lewat: ${kode} tidak ada di struktur`);
      continue;
    }
    const status = kode === "BAB3" ? "DISETUJUI" : kode === "BAB1.A" ? "LENGKAP" : "DRAFT";
    await db.ledIsian.upsert({
      where: { ledBagianId_tahunAkademikId: { ledBagianId: bg.id, tahunAkademikId: ta.id } },
      create: {
        ledBagianId: bg.id,
        tahunAkademikId: ta.id,
        konten,
        status,
        jumlahKarakter: konten.length,
      },
      update: { konten, status, jumlahKarakter: konten.length },
    });
    ledTerisi++;
  }
  console.log(`LED terisi: ${ledTerisi} bagian`);

  // bukti pendukung contoh
  const bgBukti = await db.ledBagian.findUnique({ where: { kode: "BAB1.A" } });
  const isianBukti = bgBukti
    ? await db.ledIsian.findUnique({
        where: { ledBagianId_tahunAkademikId: { ledBagianId: bgBukti.id, tahunAkademikId: ta.id } },
      })
    : null;
  if (isianBukti) {
    const admin = await db.user.findFirst({ where: { role: "ADMIN" } });
    if (!admin) throw new Error("tidak ada user ADMIN untuk kolom uploadedById");
    await db.ledEvidence.deleteMany({ where: { ledIsianId: isianBukti.id } });
    await db.ledEvidence.createMany({
      data: [
        {
          ledIsianId: isianBukti.id,
          uploadedById: admin.id,
          filename: "SK-Tim-Penyusun-LED.pdf",
          linkUrl: "https://drive.google.com/file/d/xxxx",
          keterangan: "SK penetapan tim penyusun LED",
        },
        {
          ledIsianId: isianBukti.id,
          uploadedById: admin.id,
          filename: "Undangan-Rapat-Koordinasi.pdf",
          linkUrl: null,
          keterangan: "Bukti rapat koordinasi mingguan",
        },
      ],
    });
    console.log("bukti pendukung: 2 buah");
  }

  // ── Matriks Penilaian: skor campuran supaya progres & prediksi terlihat nyata
  let sesi = await db.penilaianSesi.findFirst({ where: { tahunAkademikId: ta.id } });
  if (!sesi) sesi = await db.penilaianSesi.create({ data: { tahunAkademikId: ta.id } });

  await db.skorPenilaian.deleteMany({ where: { penilaianSesiId: sesi.id } });
  const butir = await db.butirPenilaian.findMany({
    select: { id: true, kode: true, kriteria: true, bobot: true },
    orderBy: { kode: "asc" },
  });

  // Pola skor: kriteria kunci (C1-C3) tinggi, sisanya bervariasi.
  // Deterministik supaya hasilnya sama tiap kali dijalankan.
  let n = 0;
  const data = butir.map((b) => {
    n++;
    let skor: number;
    if (b.kriteria === "C1" || b.kriteria === "C2") skor = n % 5 === 0 ? 3 : 4;
    else if (b.kriteria === "C3") skor = n % 4 === 0 ? 3 : 4;
    else skor = 3 + (n % 3 === 0 ? 1 : 0);
    return { penilaianSesiId: sesi!.id, butirPenilaianId: b.id, skor };
  });
  await db.skorPenilaian.createMany({ data });

  const total = data.reduce((a, b) => a + b.skor, 0);
  const rata = (total / butir.length).toFixed(2);
  console.log(`penilaian: ${butir.length} butir terisi, rata-rata skor ${rata}`);
  console.log(`nilai akhir (perkiraan): ${(data.reduce((a, b, i) => a + b.skor * (butir[i]?.bobot ?? 0), 0) / 4).toFixed(1)}`);

  await db.$disconnect();
}

main().catch(async (e) => {
  console.error("GAGAL:", e);
  await db.$disconnect();
  process.exit(1);
});
