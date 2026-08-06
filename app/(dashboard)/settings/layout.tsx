import type { Metadata } from "next";
import { SettingsShell } from "./SettingsShell";

export const metadata: Metadata = {
  title: "Pengaturan",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsShell>{children}</SettingsShell>;
}
