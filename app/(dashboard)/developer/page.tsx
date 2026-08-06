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
  bio: "Mahasiswa Program Studi Ilmu Komputer, Universitas Bina Bangsa Getsempena. Pengembang utama sistem SIM-LKPS untuk akreditasi BAN-PT.",
  photoUrl: "/img/profile-DzHoYrRg.png",
  repoUrl: "https://github.com/axolotl-void/SIM-LKPS.git",
  stats: {
    tables: 31,
    roles: 4,
    stack: "Next.js 15",
  },
  message:
    "Jika Anda memerlukan bantuan teknis, menemukan bug, atau ingin berdiskusi terkait pengembangan sistem ini, silakan hubungi saya melalui salah satu kanal di bawah ini.",
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
      value: "portofolio-r6to.vercel.app",
      href: "https://portofolio-r6to.vercel.app",
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
