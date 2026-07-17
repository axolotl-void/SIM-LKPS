import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <ShieldAlert className="mb-4 h-16 w-16 text-red-400" />
      <h1 className="text-2xl font-bold text-gray-900">Akses Ditolak</h1>
      <p className="mt-2 text-gray-500">
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
