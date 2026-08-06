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
  icon: "whatsapp" | "email" | "github" | "instagram";
  external: boolean;
}

const DEVELOPER = {
  name: "Yogi Prasetya Sadewa",
  role: "Full-Stack Developer",
  project: "SIM-LKPS",
  institution: "Universitas Bina Bangsa Getsempena",
  message:
    "Jika Anda memerlukan bantuan teknis, menemukan bug, atau ingin berdiskusi terkait pengembangan sistem ini, silakan hubungi saya melalui salah satu kanal di bawah ini.",
  contacts: [
    {
      label: "WhatsApp",
      value: "+62 812-3456-7890",
      href: "https://wa.me/6281234567890",
      icon: "whatsapp",
      external: true,
    },
    {
      label: "Email",
      value: "developer@example.com",
      href: "mailto:developer@example.com",
      icon: "email",
      external: true,
    },
    {
      label: "GitHub",
      value: "github.com/developer",
      href: "https://github.com/developer",
      icon: "github",
      external: true,
    },
    {
      label: "Instagram",
      value: "@developer",
      href: "https://instagram.com/developer",
      icon: "instagram",
      external: true,
    },
  ] satisfies ContactLink[],
};

export default async function DeveloperPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <DeveloperClient developer={DEVELOPER} />;
}
