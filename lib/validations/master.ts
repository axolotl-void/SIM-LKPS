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
export type TendikInput = z.infer<typeof tendikSchema>;
