const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Dosen Tetap...");

  const dosenList = [
    { nidn: "0102030401", nama: "Rossiana Br Ginting, S.Kom, M.Pd", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "P" },
    { nidn: "0102030402", nama: "Mukhroji, S.ST., M.T.", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
    { nidn: "0102030403", nama: "Ully Muzakir, MT", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
    { nidn: "0102030404", nama: "Khairuman, S.Kom, M.Kom", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
    { nidn: "0102030405", nama: "Mohd. Iqbal Muttaqin", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
    { nidn: "0102030406", nama: "Bakruddin, S.Si. M.T", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
    { nidn: "0102030407", nama: "Miftahul Jannah, M.Pd", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "P" },
    { nidn: "0102030408", nama: "Muhajir, M.T", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
    { nidn: "0102030409", nama: "Ir. Muhibul Jamal, S.T., M.T.", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
    { nidn: "0102030410", nama: "Mulyati, S.Si, M.Kom", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "P" },
    { nidn: "0102030411", nama: "Nazuarsyah, ST, MT", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
    { nidn: "0102030412", nama: "Oktalia Triananda Lovita, S.ST. MT", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "P" }
  ];

  for (const d of dosenList) {
    await db.dosen.upsert({
      where: { nidn: d.nidn },
      update: { nama: d.nama, status: d.status, pendidikanTerakhir: d.pendidikanTerakhir },
      create: d,
    });
  }

  console.log(`✅ Seeding complete. Seeded ${dosenList.length} Dosen.`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await db.$disconnect());
