# Gempala Menfess — Architecture Blueprint

## 1. Tujuan

Gempala Menfess adalah web publik ringan untuk:
- publik/followers Instagram mengirim menfess melalui link;
- admin membaca dan memoderasi kiriman;
- admin membuat kartu menfess dalam format Instagram Story;
- admin mengunduh kartu sebagai PNG dan membagikannya ke Instagram.

Target awal: **fun project / personal non-commercial**, low traffic, biaya serendah mungkin.

---

## 2. Arsitektur yang Dipilih

### Stack

| Layer | Teknologi | Peran |
|---|---|---|
| Frontend | React + Vite | UI publik + admin |
| Styling | Tailwind CSS | Design system |
| Hosting | Vercel Hobby | Static frontend + API routes/functions |
| Database | Supabase Free | Penyimpanan menfess |
| Auth admin | Supabase Auth | Login admin |
| Image generation | Browser Canvas / html-to-image | Generate Story PNG |
| Source control | GitHub | Repository + deployment trigger |

### Diagram

```text
Instagram Bio / Link
        |
        v
+-------------------------+
|       Vercel App        |
|                         |
|  /                     |---- Public submit form
|  /success              |---- Submission result
|  /admin/login          |---- Admin login
|  /admin                |---- Moderation dashboard
|  /admin/menfess/:id    |---- Detail + card generator
|  /api/*                |---- Server-side API layer
+------------+------------+
             |
             v
+-------------------------+
|     Supabase Free       |
|                         |
| PostgreSQL              |
| Auth                    |
| Row Level Security      |
+-------------------------+

Admin browser
     |
     v
Story Card Generator
     |
     v
1080 x 1920 PNG
     |
     +--> Download
     +--> Native Share Sheet (mobile, where supported)
```

---

## 3. Prinsip Arsitektur

1. **Simple first** — jangan membuat backend kompleks untuk MVP.
2. **Public form harus mudah dibuka dari Instagram.**
3. **Database menjadi source of truth** untuk seluruh submission.
4. **Admin-only operations harus terlindungi authentication + authorization.**
5. **Image generation dilakukan di browser**, bukan server, agar murah dan cepat.
6. **Tidak menyimpan image hasil generate** kecuali nanti memang dibutuhkan.
7. Semua rahasia seperti service-role key tidak boleh masuk client bundle.
8. Gunakan environment variables di Vercel.

---

## 4. Struktur Repository

```text
gempala-menfess/
├── public/
│   ├── favicon.svg
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── menfess/
│   │   ├── admin/
│   │   └── story/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Success/
│   │   ├── AdminLogin/
│   │   ├── AdminDashboard/
│   │   └── MenfessDetail/
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── validation.ts
│   │   └── image.ts
│   │
│   ├── hooks/
│   ├── types/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
│
├── api/
│   └── ...                 # jika memakai Vercel API routes
│
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 5. Data Model

### Table: `menfess`

```sql
create table menfess (
  id uuid primary key default gen_random_uuid(),

  from_name text,
  from_username text,

  to_name text not null,
  to_username text,

  message text not null,

  is_anonymous boolean not null default false,

  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),

  admin_note text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
```

### MVP fields

Wajib:
- `to_name`
- `message`

Opsional:
- `from_name`
- `from_username`
- `to_username`

Kontrol:
- `is_anonymous`
- `status`
- `admin_note`
- timestamps

---

## 6. Status Flow

```text
                 +-----------+
                 |  PENDING  |
                 +-----+-----+
                       |
              +--------+--------+
              |                 |
              v                 v
        +-----------+     +-----------+
        | APPROVED  |     | REJECTED  |
        +-----------+     +-----------+
              |
              v
        Generate Story
```

### Aturan

- Submission publik selalu masuk `pending`.
- Admin dapat approve/reject.
- Hanya `approved` yang dapat dipakai sebagai konten publik.
- Generate card tidak otomatis berarti status berubah.
- Admin boleh generate ulang card berkali-kali.

---

## 7. Authentication

Gunakan Supabase Auth.

### Admin

- Login dengan email/password.
- Tidak ada registrasi publik.
- Admin account dibuat manual.
- Dashboard hanya dapat diakses authenticated admin.

Untuk MVP satu admin sudah cukup.

Jika nanti lebih dari satu admin, tambahkan table `admin_profiles` dan role.

---

## 8. Row Level Security

### Public

Publik hanya boleh:
- INSERT submission baru.

Publik tidak boleh:
- SELECT semua menfess.
- UPDATE.
- DELETE.
- membaca data admin.

### Admin

Admin boleh:
- SELECT menfess.
- UPDATE status.
- UPDATE admin note.
- DELETE jika memang diperlukan.

Jangan pernah menaruh Supabase service-role key di browser.

---

## 9. Anti-Spam MVP

Karena form terbuka untuk publik, tambahkan minimal:

### Honeypot

Field tersembunyi:

```text
website
```

Jika terisi → reject.

### Rate limiting

Batasi submission dari IP/session secara sederhana melalui server-side endpoint jika diperlukan.

### Input limits

Rekomendasi:
- From name: 80 karakter
- Username: 50 karakter
- To name: 80 karakter
- Message: 500–800 karakter

Tujuan utamanya bukan security tingkat enterprise, tetapi mencegah spam dan abuse sederhana.

---

## 10. Public Flow

### `/`

1. User membuka link Instagram.
2. User melihat branding Gempala Menfess.
3. User mengisi From, To, Pesan.
4. User memilih anonim jika tersedia.
5. User menyetujui aturan singkat.
6. Submit.
7. Server melakukan validasi.
8. Data masuk `menfess`.
9. Redirect `/success`.

### `/success`

Tampilkan:

```text
Menfess terkirim ✨

Pesanmu sudah diterima dan akan
dilihat oleh admin.

[ Kirim Menfess Lagi ]
```

Jangan menampilkan ID database ke user kecuali memang dibutuhkan.

---

## 11. Admin Flow

### `/admin/login`

- Email
- Password
- Login

### `/admin`

Dashboard berisi:

- Pending count
- Approved count
- Rejected count
- List menfess terbaru
- Filter status
- Search sederhana

### Detail

Admin dapat:

- melihat From
- melihat To
- melihat pesan
- melihat timestamp
- approve
- reject
- edit sebelum publish jika diperlukan
- generate Story

---

## 12. Story Generator

### Output

Default:
- 1080 × 1920 px
- PNG
- 9:16

### Data yang ditampilkan

```text
GEMPALA
MENFESS

FROM
@username

TO
@username

"Isi pesan menfess"

@gempala
```

Jika anonymous:

```text
FROM
ANONYMOUS
```

### Generator

Render template ke:
- HTML/CSS hidden render area, atau
- Canvas.

Kemudian:

```text
render
  ↓
canvas.toBlob()
  ↓
PNG Blob
  ↓
download / navigator.share()
```

### Mobile sharing

Gunakan Web Share API jika browser mendukung.

Fallback:
- Download PNG.
- User upload/share ke Instagram secara manual.

Jangan menjanjikan direct-post ke Instagram karena itu bergantung pada dukungan OS/browser/API Instagram.

---

## 13. Template System

Jangan hardcode satu template.

Buat interface:

```ts
type StoryTemplate = {
  id: string;
  name: string;
  description: string;
  render: (data: StoryData) => HTMLElement;
};
```

MVP:
- `minimal`
- `soft`
- `bold`

Template baru dapat ditambahkan tanpa mengubah database.

---

## 14. API / Server Boundary

Jika client dapat langsung menggunakan Supabase dengan RLS, tidak semua operasi perlu API custom.

Gunakan server-side API/function untuk:
- operasi yang membutuhkan secret;
- rate limiting;
- validasi tambahan;
- future integrations.

Jangan membuat API layer hanya demi kompleksitas.

---

## 15. Environment Variables

Contoh:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Jika ada server-only secret:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

Server-only secrets tidak boleh diawali `VITE_`.

---

## 16. Deployment

### GitHub → Vercel

1. Push repository ke GitHub.
2. Import project ke Vercel.
3. Set framework ke Vite jika auto-detection tidak tepat.
4. Tambahkan environment variables.
5. Deploy.
6. Hubungkan custom domain jika diperlukan.

### Development

```bash
npm install
npm run dev
```

### Production build

```bash
npm run build
npm run preview
```

---

## 17. MVP Scope

### Wajib

- [x] Public form
- [x] Submit ke database
- [x] Admin login
- [x] Admin list
- [x] Admin detail
- [x] Approve/reject
- [x] Story generator 1080×1920
- [x] Download PNG
- [x] Mobile responsive

### Nice to have

- [ ] 3 template Story
- [ ] Search
- [ ] Filter
- [ ] Edit message
- [ ] Web Share API
- [ ] Dark mode

### Jangan dulu

- [ ] User accounts
- [ ] Follower system
- [ ] Notifications
- [ ] Automated Instagram posting
- [ ] Analytics kompleks
- [ ] AI moderation
- [ ] CMS
- [ ] Multi-tenant system

---

## 18. Security Checklist

- [ ] RLS aktif.
- [ ] Service-role key tidak pernah dikirim ke frontend.
- [ ] Admin route membutuhkan authentication.
- [ ] Input divalidasi client + server.
- [ ] Message length dibatasi.
- [ ] Honeypot aktif.
- [ ] Rate limiting dipertimbangkan.
- [ ] Tidak menampilkan data submission publik.
- [ ] Admin action tidak dapat dilakukan anonymous.
- [ ] Production environment variables disimpan di Vercel.

---

## 19. Definition of Done

MVP dianggap selesai jika:

1. User Instagram dapat membuka URL di HP.
2. User dapat mengirim From, To, dan Pesan.
3. Submission masuk database.
4. Admin dapat login.
5. Admin dapat melihat submission baru.
6. Admin dapat approve/reject.
7. Admin dapat membuka submission approved.
8. Admin dapat memilih template.
9. Admin dapat menghasilkan PNG 1080×1920.
10. PNG dapat di-download di HP.
11. Web tetap nyaman digunakan pada layar mobile.
12. Project dapat deploy ke Vercel Hobby.

---

## 20. Prinsip Pengembangan

> **Bikin kecil, bagus, dan gampang dipakai.**

Gempala Menfess bukan perlu menjadi platform besar. Prioritasnya adalah:

**Instagram → isi menfess → admin baca → bikin kartu bagus → Story.**

Semua fitur lain hanya ditambahkan jika benar-benar dibutuhkan.
