/**
 * Retry untuk operasi database yang gagal karena gangguan koneksi sesaat.
 *
 * Database produksi ada di Neon (serverless). Compute-nya bisa "tidur" dan
 * bangun lagi saat ada request, dan proses bangun itu kadang gagal di
 * percobaan pertama. Tanpa retry, kegagalan sesaat ini sampai ke pengguna
 * sebagai error yang menyesatkan (mis. "kredensial salah" padahal bukan).
 */

const KODE_TRANSIENT = new Set([
  "P1001", // Can't reach database server
  "P1002", // Database server timed out
  "P1008", // Operations timed out
  "P1017", // Server has closed the connection
  "P2024", // Timed out fetching a connection from the pool
]);

function pesanError(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

/** Apakah error ini termasuk gangguan koneksi yang layak dicoba ulang? */
export function isTransientDbError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const nama = (e as { name?: string }).name ?? "";
  const kode = (e as { code?: string }).code;

  if (nama === "PrismaClientInitializationError") return true;
  if (kode && KODE_TRANSIENT.has(kode)) return true;

  const pesan = pesanError(e).toLowerCase();
  return (
    pesan.includes("can't reach database server") ||
    pesan.includes("connection closed") ||
    pesan.includes("closed the connection") ||
    pesan.includes("connection reset") ||
    pesan.includes("timed out") ||
    pesan.includes("econnreset") ||
    pesan.includes("etimedout")
  );
}

/**
 * Jalankan `fn`, ulangi kalau gagal karena gangguan koneksi.
 * Error selain gangguan koneksi langsung dilempar (tidak diulang).
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  { attempts = 3, baseDelayMs = 250, label = "operasi db" }: { attempts?: number; baseDelayMs?: number; label?: string } = {}
): Promise<T> {
  let terakhir: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      terakhir = e;
      if (!isTransientDbError(e) || i === attempts) throw e;
      console.warn(`[db-retry] ${label} gagal (percobaan ${i}/${attempts}), mencoba lagi: ${pesanError(e)}`);
      await new Promise((r) => setTimeout(r, baseDelayMs * i));
    }
  }
  throw terakhir;
}
