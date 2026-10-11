# SIM-LKPS — image mandiri untuk server kampus.
#
# Hasil: image berisi `.next/standalone` (server Node + dependensi yang dipakai saja),
# tanpa source TypeScript, tanpa devDependencies. Jalankan: `node server.js`.
#
# Build (dari AKAR repo, konteksnya harus root supaya skema prisma & public ikut):
#   docker build -f deploy/Dockerfile -t sim-lkps:1.0 .

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    NEXT_TELEMETRY_DISABLED=1
# Versi pnpm dikunci sama dengan yang dipakai di Mac (package.json belum punya
# kolom `packageManager`). Kalau tidak dikunci, corepack bisa menarik pnpm 12.x
# yang mengubah cara deklarasi izin build script → `pnpm install` gagal.
RUN npm install -g pnpm@11.0.8
WORKDIR /app

# ---------------------------------------------------------------- dependensi
FROM base AS deps
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Cache mount: simpan store pnpm di luar lapisan image. Kalau build gagal di
# tengah jalan (mis. tarball prisma timeout), percobaan berikutnya tidak
# mengunduh ulang 600+ paket. Butuh BuildKit (default Docker modern).
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile \
        --fetch-timeout=600000 \
        --fetch-retries=5

# ------------------------------------------------------------------- build
FROM base AS builder
# Prisma butuh openssl untuk mesin querynya saat `generate`.
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# next.config.ts memakai `output: "standalone"` → hasilnya .next/standalone
RUN pnpm prisma generate && pnpm build

# ------------------------------------------------------------------ runtime
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates curl \
 && rm -rf /var/lib/apt/lists/* \
 && groupadd -r nodejs -g 1001 \
 && useradd -r -u 1001 -g nodejs nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma: skema + mesin query, dipakai oleh `prisma db push` / seed dari dalam image.
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
