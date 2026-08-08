# Save Session & Git Push

## Trigger
Diaktifkan ketika kamu bilang: "saya mau off", "off", "save and push", "/off"

## Actions

### 1. Generate Session Summary
Baca semua conversation → generate ringkasan:
- Task yang dikerjakan
- Files yang diubah
- Progress saat ini
- Next steps
- Blockers (jika ada)

### 2. Save to Vault
Simpan ringkasan ke:
```
SIM-LKPS/Sessions/YYYY-MM-DD-HHMM.md
```

Format filename pakai timestamp biar unique.

### 3. Git Commit & Push
```bash
cd /Users/yogiprasetyasadewa/Documents/03_Proyek/SIM-LKPS/ai-company/output/sim-lkps

# Git add all
git add -A

# Commit dengan message timestamp
git commit -m "Session: YYYY-MM-DD HH:MM - [brief summary]"

# Push ke remote
git push
```

### 4. Konfirmasi
Tampilkan:
- File summary yang disimpan
- Commit SHA
- Remote branch yang di-push
- "Sesi disimpan. Sampai jumpa!"

---

## Output Format

```markdown
---
description: "Ringkasan session Claude Code"
tags: [session, sim-lkps]
created: YYYY-MM-DD
---

# Session: YYYY-MM-DD HH:MM - HH:MM

## Durasi
6 jam (18:00 - 00:00)

## Task yang Dikerjakan
1. Task 1
2. Task 2
3. ...

## Files Diubah
- `file1.ts`
- `file2.ts`
- ...

## Progress
- [x] Feature A
- [ ] Feature B (next)

## Next Steps
1. ...
2. ...

## Blockers
- None / [ blocker description ]

---
Generated: YYYY-MM-DD HH:MM
```
