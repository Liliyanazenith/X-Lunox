# X-Lunox

Klon tampilan X/Twitter (mode gelap bawaan + mode terang), dengan server tanpa dependensi.

## Menjalankan
    node server.js          # buka http://localhost:3000  (Node 18+, tanpa npm install)
    npm test                # tes smoke: file statis, sintaks, DM real-time (SSE)
    node test/e2e.js        # opsional, butuh paket "playwright": tes semua alur di browser

## Struktur
- `server.js`: server statis + DM real-time (Server-Sent Events), hanya modul bawaan Node
- `public/index.html`, `public/style.css`, `public/app.js`: antarmuka
- `test/`: smoke.js dan e2e.js

## Catatan
- Tampilan memakai Tailwind dan FontAwesome dari CDN, jadi perlu internet saat membuka halaman.
- Post disimpan di memori browser (hilang saat refresh). Profil dan pengaturan disimpan di localStorage.
- DM antar-pengguna jalan lewat server; akun demo (@alex_dev dll) membalas otomatis.
- Belum ada: subtitle otomatis video (butuh mesin speech-to-text), audio Spaces antar-pengguna (butuh WebRTC).
- Ubah password, nonaktifkan dan hapus akun masih demo sampai dihubungkan ke database/backend.
