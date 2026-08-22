# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | Yes                |
| < 0.1   | No                 |

## Reporting a Vulnerability

Untuk dosen atau calon user yang menemukan bug atau vulnerability:

1. **Email**: yogiprasetya@ubbg.ac.id
2. **GitHub Issue** (non-security bugs only): https://github.com/axolotl-void/SIM-LKPS/issues

Response time: 1 sampai 3 hari kerja.

## Security Best Practices

- Ganti `ADMIN_PASSWORD` setelah first login
- Jangan pernah share `AUTH_SECRET` atau `R2_SECRET_ACCESS_KEY`
- Gunakan HTTPS (Vercel otomatis setup)
- Backup database Neon mingguan via dashboard
- Rotate `AUTH_SECRET` setiap 90 hari di production

## Credential Hygiene

- Semua credential di `.env` (file ini di-gitignore, jangan di-commit)
- `.env.example` hanya berisi placeholder, tidak ada credential asli
- GitHub secret scanning aktif untuk monitoring accidental commit
