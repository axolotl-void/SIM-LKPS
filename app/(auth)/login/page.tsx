import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="rounded-xl border bg-white p-8 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">SIM-LKPS</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sistem Informasi Manajemen Laporan Kinerja Program Studi
        </p>
      </div>
      <LoginForm />
      <p className="mt-4 text-center text-xs text-gray-400">
        Program Studi Ilmu Komputer — UBBG
      </p>
    </div>
  );
}
