import React from "react";

/**
 * Renderer Markdown minimal — tanpa dependensi eksternal dan tanpa
 * `dangerouslySetInnerHTML`, jadi HTML mentah dari user tidak pernah
 * dieksekusi. Semua teks di-render sebagai React text node.
 *
 * Yang didukung: heading (#–######), bold, italic, inline code, code block,
 * list berbutir, list bernomor, blockquote, garis pemisah, dan paragraf.
 *
 * Sengaja TIDAK mendukung HTML mentah, tabel, dan gambar — LED itu dokumen
 * naratif, dan permukaan serangan yang lebih kecil lebih penting di sini.
 */

type Blok =
  | { tipe: "heading"; level: number; teks: string }
  | { tipe: "paragraf"; teks: string }
  | { tipe: "list"; ordered: boolean; item: string[] }
  | { tipe: "quote"; teks: string }
  | { tipe: "hr" }
  | { tipe: "code"; teks: string };

const RE_BULLET = /^\s*[-*+]\s+(.*)$/;
const RE_NOMOR = /^\s*\d+[.)]\s+(.*)$/;

function parseBlok(md: string): Blok[] {
  const baris = md.replace(/\r\n/g, "\n").split("\n");
  const hasil: Blok[] = [];
  let i = 0;

  while (i < baris.length) {
    const b = baris[i] ?? "";

    // code fence
    if (b.trimStart().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < baris.length && !(baris[i] ?? "").trimStart().startsWith("```")) {
        buf.push(baris[i] ?? "");
        i++;
      }
      i++; // tutup fence
      hasil.push({ tipe: "code", teks: buf.join("\n") });
      continue;
    }

    if (!b.trim()) {
      i++;
      continue;
    }

    // garis pemisah
    if (/^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/.test(b)) {
      hasil.push({ tipe: "hr" });
      i++;
      continue;
    }

    // heading
    const h = /^(#{1,6})\s+(.*)$/.exec(b);
    if (h) {
      hasil.push({ tipe: "heading", level: (h[1] ?? "#").length, teks: (h[2] ?? "").trim() });
      i++;
      continue;
    }

    // blockquote
    if (/^\s*>\s?/.test(b)) {
      const buf: string[] = [];
      while (i < baris.length && /^\s*>\s?/.test(baris[i] ?? "")) {
        buf.push((baris[i] ?? "").replace(/^\s*>\s?/, ""));
        i++;
      }
      hasil.push({ tipe: "quote", teks: buf.join(" ") });
      continue;
    }

    // list
    const isBullet = RE_BULLET.test(b);
    const isNomor = RE_NOMOR.test(b);
    if (isBullet || isNomor) {
      const re = isNomor ? RE_NOMOR : RE_BULLET;
      const item: string[] = [];
      while (i < baris.length) {
        const cur = baris[i] ?? "";
        const m = re.exec(cur);
        if (m) {
          item.push((m[1] ?? "").trim());
          i++;
        } else if (cur.trim() && /^\s{2,}/.test(cur) && item.length) {
          // lanjutan baris item sebelumnya
          item[item.length - 1] = `${item[item.length - 1]} ${cur.trim()}`;
          i++;
        } else {
          break;
        }
      }
      hasil.push({ tipe: "list", ordered: isNomor, item });
      continue;
    }

    // paragraf — gabung sampai baris kosong / blok lain
    const buf: string[] = [];
    while (i < baris.length) {
      const cur = baris[i] ?? "";
      if (
        !cur.trim() ||
        /^(#{1,6})\s/.test(cur) ||
        RE_BULLET.test(cur) ||
        RE_NOMOR.test(cur) ||
        /^\s*>\s?/.test(cur) ||
        cur.trimStart().startsWith("```")
      ) {
        break;
      }
      buf.push(cur.trim());
      i++;
    }
    if (buf.length) hasil.push({ tipe: "paragraf", teks: buf.join(" ") });
  }

  return hasil;
}

/** Inline: `code`, **bold**, *italic*, ~~strike~~. */
function inline(teks: string, kunci: string): React.ReactNode[] {
  const pola = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|~~[^~]+~~)/g;
  const bagian = teks.split(pola).filter((s) => s !== "");
  return bagian.map((s, idx) => {
    const k = `${kunci}-${idx}`;
    if (s.length > 2 && s.startsWith("`") && s.endsWith("`")) {
      return (
        <code key={k} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[0.85em]">
          {s.slice(1, -1)}
        </code>
      );
    }
    if (s.length > 4 && ((s.startsWith("**") && s.endsWith("**")) || (s.startsWith("__") && s.endsWith("__")))) {
      return (
        <strong key={k} className="font-bold text-slate-900">
          {s.slice(2, -2)}
        </strong>
      );
    }
    if (s.length > 4 && s.startsWith("~~") && s.endsWith("~~")) {
      return (
        <del key={k} className="text-slate-400">
          {s.slice(2, -2)}
        </del>
      );
    }
    if (s.length > 2 && ((s.startsWith("*") && s.endsWith("*")) || (s.startsWith("_") && s.endsWith("_")))) {
      return (
        <em key={k} className="italic">
          {s.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={k}>{s}</React.Fragment>;
  });
}

const HEADING_KELAS: Record<number, string> = {
  1: "text-xl font-black text-slate-900 mt-6 mb-3",
  2: "text-lg font-bold text-slate-900 mt-5 mb-2",
  3: "text-base font-bold text-slate-800 mt-4 mb-2",
  4: "text-sm font-bold text-slate-800 mt-3 mb-1",
  5: "text-sm font-semibold text-slate-700 mt-3 mb-1",
  6: "text-xs font-semibold text-slate-700 mt-2 mb-1",
};

export function renderMarkdown(md: string): React.ReactNode {
  if (!md.trim()) return null;
  const blok = parseBlok(md);

  return (
    <div className="text-sm leading-relaxed text-slate-700">
      {blok.map((b, i) => {
        const k = `b-${i}`;
        switch (b.tipe) {
          case "heading": {
            const Tag = `h${Math.min(b.level + 1, 6)}` as "h2";
            return (
              <Tag key={k} className={HEADING_KELAS[b.level] ?? HEADING_KELAS[6]}>
                {inline(b.teks, k)}
              </Tag>
            );
          }
          case "paragraf":
            return (
              <p key={k} className="mb-3">
                {inline(b.teks, k)}
              </p>
            );
          case "list":
            return b.ordered ? (
              <ol key={k} className="list-decimal pl-5 mb-3 space-y-1">
                {b.item.map((it, j) => (
                  <li key={`${k}-${j}`}>{inline(it, `${k}-${j}`)}</li>
                ))}
              </ol>
            ) : (
              <ul key={k} className="list-disc pl-5 mb-3 space-y-1">
                {b.item.map((it, j) => (
                  <li key={`${k}-${j}`}>{inline(it, `${k}-${j}`)}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={k}
                className="border-l-4 border-violet-200 bg-violet-50/50 pl-3 py-2 my-3 italic text-slate-600"
              >
                {inline(b.teks, k)}
              </blockquote>
            );
          case "hr":
            return <hr key={k} className="my-4 border-slate-200" />;
          case "code":
            return (
              <pre key={k} className="my-3 p-3 rounded-lg bg-slate-900 text-slate-100 text-xs overflow-x-auto">
                <code>{b.teks}</code>
              </pre>
            );
        }
      })}
    </div>
  );
}
