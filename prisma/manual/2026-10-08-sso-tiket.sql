-- Tabel tiket SSO (RANCANGAN-014). Idempoten: aman dijalankan berulang.
-- Dibuat lewat SQL langsung, BUKAN `prisma db push`, supaya database produksi
-- tidak ikut "dirapikan" (push bisa mencoba menghapus nilai enum Role lama).
CREATE TABLE IF NOT EXISTS "sso_tiket" (
    "jti" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "peran" TEXT NOT NULL,
    "dipakai_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sso_tiket_pkey" PRIMARY KEY ("jti")
);

CREATE INDEX IF NOT EXISTS "sso_tiket_email_idx" ON "sso_tiket"("email");
