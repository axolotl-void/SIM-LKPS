import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pengaturan",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <nav className="flex gap-1 border-b">
        <Link
          href="/settings/users"
          className="border-b-2 border-blue-600 px-4 py-2 text-sm font-medium text-blue-600"
        >
          Manajemen User
        </Link>
        <Link
          href="/settings/audit-log"
          className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          Audit Log
        </Link>
      </nav>

      {children}
    </div>
  );
}
