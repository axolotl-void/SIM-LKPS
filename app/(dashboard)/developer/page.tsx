import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DeveloperClient } from "./DeveloperClient";

export const metadata = {
  title: "Tentang Developer",
};

interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: "whatsapp" | "email" | "github" | "instagram" | "portfolio";
  external: boolean;
}

const DEVELOPER = {
  name: "Yogi Prasetya Sadewa",
  role: "Full-Stack Developer",
  project: "SIM-LKPS",
  institution: "Universitas Bina Bangsa Getsempena",
  bio: "Mahasiswa Program Studi Ilmu Komputer, Universitas Bina Bangsa Getsempena. Pengembang utama sistem SIM-LKPS untuk akreditasi LAM INFOKOM 2.1.",
  photoUrl: "/img/profile.webp",
  repoUrl: "https://github.com/axolotl-void/SIM-LKPS.git",
  stats: {
    tables: 32,
    roles: 3,
    stack: "Next.js 15",
  },
  message:
    "Jika Anda memerlukan bantuan teknis, menemukan bug, atau ingin berdiskusi terkait pengembangan sistem ini, silakan hubungi saya melalui salah satu kanal di bawah ini.",
  handover: {
    intro:
      "Sistem ini diserahkan lengkap dengan dokumentasi, supaya tim TI kampus tetap bisa menambah fitur dan memperbarui sistem meskipun saya sudah tidak lagi di kampus. Tidak perlu menunggu saya — semua sudah dituliskan.",
    highlight:
      "Setiap berkas kode punya halaman penjelasannya sendiri, dan ada buku resep untuk pekerjaan yang paling sering diminta.",
    repoDocsUrl: "https://github.com/axolotl-void/SIM-LKPS/blob/main/docs",
  },
  docs: [
    {
      label: "Panduan Serah Terima",
      desc: "Mulai dari sini — penjelasan sistem dan urutan membacanya",
      href: "https://github.com/axolotl-void/SIM-LKPS/blob/main/docs/handover/00-START-HERE.md",
      tag: "Mulai di sini",
    },
    {
      label: "Cara Menjalankan",
      desc: "Menjalankan aplikasi di komputer sendiri untuk mencoba perubahan",
      href: "https://github.com/axolotl-void/SIM-LKPS/blob/main/docs/handover/01-cara-menjalankan.md",
      tag: "Panduan",
    },
    {
      label: "Arsitektur Sistem",
      desc: "Bagian-bagian sistem dan bagaimana mereka saling berhubungan",
      href: "https://github.com/axolotl-void/SIM-LKPS/blob/main/docs/handover/02-arsitektur.md",
      tag: "Panduan",
    },
    {
      label: "Mau Ubah Fitur Ini?",
      desc: "Buku resep: cari pekerjaan yang ingin diubah, langsung ke berkasnya",
      href: "https://github.com/axolotl-void/SIM-LKPS/blob/main/docs/handover/03-ubah-fitur-ini.md",
      tag: "Paling sering dipakai",
    },
    {
      label: "Basis Data",
      desc: "Susunan data, cara mencadangkan, dan cara memulihkannya",
      href: "https://github.com/axolotl-void/SIM-LKPS/blob/main/docs/handover/04-basis-data.md",
      tag: "Panduan",
    },
    {
      label: "Akun & Keamanan",
      desc: "Peran pengguna, kata sandi, dan cara memindahkan kepemilikan akun ke kampus",
      href: "https://github.com/axolotl-void/SIM-LKPS/blob/main/docs/handover/05-akun-dan-keamanan.md",
      tag: "Penting",
    },
    {
      label: "Operasi Rutin",
      desc: "Perawatan berkala, penanganan gangguan, dan daftar periksa serah terima",
      href: "https://github.com/axolotl-void/SIM-LKPS/blob/main/docs/handover/06-operasi-rutin.md",
      tag: "Panduan",
    },
    {
      label: "Pertanyaan Teknis",
      desc: "Jawaban untuk pertanyaan yang biasanya muncul dari programmer baru",
      href: "https://github.com/axolotl-void/SIM-LKPS/blob/main/docs/handover/07-pertanyaan-lanjutan.md",
      tag: "Panduan",
    },
    {
      label: "Referensi Kode",
      desc: "263 halaman — penjelasan setiap berkas di dalam proyek",
      href: "https://github.com/axolotl-void/SIM-LKPS/tree/main/docs/handover/referensi",
      tag: "Lengkap",
    },
  ],
  contacts: [
    {
      label: "WhatsApp",
      value: "0812-6031-2799",
      href: "https://wa.me/6281260312799",
      icon: "whatsapp",
      external: true,
    },
    {
      label: "Email",
      value: "yogiprasetya907@gmail.com",
      href: "mailto:yogiprasetya907@gmail.com",
      icon: "email",
      external: true,
    },
    {
      label: "GitHub",
      value: "axolotl-void",
      href: "https://github.com/axolotl-void",
      icon: "github",
      external: true,
    },
    {
      label: "Instagram",
      value: "@gik_prasetya",
      href: "https://www.instagram.com/gik_prasetya?igsh=MXg2NHkzYzBxaTZjYg%3D%3D",
      icon: "instagram",
      external: true,
    },
    {
      label: "Portofolio",
      value: "yogi.zegika.com",
      href: "https://yogi.zegika.com",
      icon: "portfolio",
      external: true,
    },
  ] satisfies ContactLink[],
};

export default async function DeveloperPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <DeveloperClient developer={DEVELOPER} />;
}
