import { z } from "zod";

export const tahunAkademikSchema = z.object({
  tahun: z.string().regex(/^\d{4}\/\d{4}$/, "Format: 2024/2025"),
  semester: z.enum(["Ganjil", "Genap"], { required_error: "Semester wajib dipilih" }),
  isActive: z.boolean().default(false),
});

export const dosenSchema = z.object({
  nidn: z.string().min(1, "NIDN wajib diisi"),
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  jabatanFungsional: z.string().optional(),
  pendidikanTerakhir: z.enum(["S1", "S2", "S3", "Profesi"], {
    required_error: "Pendidikan terakhir wajib dipilih",
  }),
  bidangKeahlian: z.string().optional(),
  status: z.enum(["Tetap", "Tidak Tetap"]).default("Tetap"),
  jenisKelamin: z.enum(["L", "P"], { required_error: "Jenis kelamin wajib dipilih" }),
});

export const mahasiswaSchema = z.object({
  nim: z.string().min(1, "NIM wajib diisi"),
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  angkatan: z.number().int().min(2000).max(2100),
  status: z.enum(["Aktif", "Cuti", "Lulus", "DO"]).default("Aktif"),
  jenisKelamin: z.enum(["L", "P"], { required_error: "Jenis kelamin wajib dipilih" }),
});

export const mataKuliahSchema = z.object({
  kode: z.string().min(1, "Kode MK wajib diisi"),
  nama: z.string().min(2, "Nama MK minimal 2 karakter"),
  sks: z.number().int().min(1, "SKS minimal 1").max(6, "SKS maksimal 6"),
  semester: z.number().int().min(1).max(8),
  kategori: z.enum(["Wajib", "Pilihan"]).optional(),
});

export const tendikSchema = z.object({
  nip: z.string().min(1, "NIP wajib diisi"),
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  jabatan: z.string().optional(),
  pendidikanTerakhir: z.string().min(1, "Pendidikan terakhir wajib diisi"),
  status: z.string().default("Aktif"),
  jenisKelamin: z.enum(["L", "P"], { required_error: "Jenis kelamin wajib dipilih" }),
});

export type TahunAkademikInput = z.infer<typeof tahunAkademikSchema>;
export type DosenInput = z.infer<typeof dosenSchema>;
export type MahasiswaInput = z.infer<typeof mahasiswaSchema>;
export type MataKuliahInput = z.infer<typeof mataKuliahSchema>;
export type TendikInput = z.infer<typeof tendikSchema>;
