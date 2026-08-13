# Gempala Menfess — UI/UX Design Specification

## 1. Design Direction

### Brand feeling

Gempala Menfess harus terasa:

- fun
- friendly
- youthful
- sedikit playful
- clean
- personal
- cocok dibagikan ke Instagram

Bukan:
- dashboard enterprise
- form pemerintahan
- aplikasi corporate
- terlalu ramai
- terlalu banyak gradient/effect

### Core idea

> **“Tempat kecil untuk menyampaikan sesuatu yang ingin dikirim.”**

UI harus membuat orang langsung paham dalam 3 detik:

**Tulis → Kirim → Selesai.**

---

## 2. Target Device

Prioritas:

1. Mobile portrait
2. Tablet
3. Desktop

Karena link kemungkinan dibuka melalui Instagram, desain harus **mobile-first**.

Target minimum:
- 320px width
- nyaman sampai 430px width
- desktop tetap memiliki max-width agar tidak terasa kosong

---

## 3. Visual Language

### Layout

Gunakan:
- rounded corners
- whitespace cukup
- card besar
- hierarchy typography jelas
- section pendek

Hindari:
- border berlebihan
- shadow terlalu gelap
- terlalu banyak komponen sekaligus

### Shape

Rekomendasi:
- card radius: 24–32px
- input radius: 14–18px
- button radius: 999px atau 16px
- badge radius: 999px

---

## 4. Color System

Warna utama harus mengikuti identitas Gempala jika sudah tersedia.

Jika belum ada brand guideline, gunakan basis:

```text
Background       #F8F6F1
Surface           #FFFFFF
Text Primary     #171717
Text Secondary   #6F6F6F
Border            #E7E3DB
Accent            #FF6B5F
Accent Soft      #FFF0ED
Success           #3A8F6B
Danger            #D84A4A
```

Jangan menggunakan terlalu banyak warna.

Target:
- 1 primary accent
- 1 dark text
- 1 neutral background
- semantic colors untuk success/error

---

## 5. Typography

Gunakan satu font family utama agar konsisten.

Karakter:
- rounded / contemporary sans-serif
- sangat readable di mobile

Hierarchy:

```text
Display        40–52px
H1             32–40px
H2             24–28px
Body           16px
Small          13–14px
Button         15–16px / semibold
```

Line-height:
- heading: 1.05–1.2
- body: 1.45–1.6

---

## 6. Public Page — `/`

### Goal

User harus langsung mengerti bahwa halaman ini untuk mengirim menfess.

### Struktur

```text
┌─────────────────────────────────┐
│                                 │
│            GEMPALA              │
│            menfess              │
│                                 │
│  kirim sesuatu yang ingin       │
│  kamu sampaikan ✨              │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ FROM                        │ │
│ │ @ username / nama           │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ TO                          │ │
│ │ @ username / nama           │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ PESAN                       │ │
│ │                             │ │
│ │ Tulis pesanmu di sini...    │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ [ ] Kirim sebagai anonim        │
│                                 │
│ [       KIRIM MENFESS ✨      ] │
│                                 │
│ Pesan akan dilihat admin        │
│ sebelum diposting.              │
└─────────────────────────────────┘
```

---

## 7. Public Form UX

### From

Label:
`FROM`

Placeholder:
`Nama atau @username`

Optional.

### To

Label:
`TO`

Placeholder:
`Nama atau @username`

Required.

### Message

Label:
`PESAN`

Placeholder:
`Tulis sesuatu...`

Required.

Character counter:

```text
0 / 600
```

Letakkan di kanan bawah textarea.

### Anonymous

Copy:

`Kirim sebagai anonim`

Saat aktif:
- hide/disable identity fields jika sesuai desain;
- kartu menggunakan `ANONYMOUS`.

---

## 8. Submit Button

Default:

`KIRIM MENFESS ✨`

Loading:

`MENGIRIM...`

Success:
- disable button sementara;
- tampilkan success state;
- redirect ke `/success`.

Error:
- jangan menghapus isi form;
- tampilkan pesan error dekat tombol.

Contoh:

> Belum terkirim. Coba lagi sebentar.

---

## 9. Success Page

### Visual

Buat terasa seperti small celebration.

```text
             ✨

       MENFESS TERKIRIM

      pesanmu sudah sampai
      ke admin Gempala.

    ┌──────────────────────┐
    │  KIRIM LAGI 💌       │
    └──────────────────────┘

       kembali ke Gempala
```

Animasi:
- subtle fade + scale
- jangan confetti berlebihan

---

## 10. Admin Login

### Layout

Desktop:
- centered card

Mobile:
- full-width card dengan padding

```text
GEMPALA
ADMIN

Masuk untuk melihat menfess.

Email
[____________________]

Password
[____________________]

[        MASUK        ]
```

Jangan menampilkan admin UI di public navigation.

---

## 11. Admin Dashboard

### Header

```text
GEMPALA MENFESS
Admin

[ Logout ]
```

### Stats

Empat card maksimum:

```text
PENDING       12
APPROVED      84
REJECTED       7
TOTAL        103
```

Mobile:
- horizontal scroll atau 2-column grid.

### Filter

```text
[ All ] [ Pending ] [ Approved ] [ Rejected ]
```

Search:

`Cari nama atau isi pesan...`

---

## 12. Admin List Item

Desktop:

```text
┌──────────────────────────────────────────────┐
│ @andi                         13 Aug, 09:42  │
│ → @salsa                                    │
│                                              │
│ “semoga hari ini kamu bahagia...”            │
│                                              │
│ PENDING                    [ BUKA ]          │
└──────────────────────────────────────────────┘
```

Mobile:

```text
┌─────────────────────────────┐
│ @andi → @salsa              │
│                             │
│ “semoga hari ini kamu...”   │
│                             │
│ PENDING          [ BUKA ]   │
└─────────────────────────────┘
```

---

## 13. Admin Detail

Prioritas utama adalah membaca pesan dengan nyaman.

```text
← Kembali

PENDING

FROM
@andi

TO
@salsa

PESAN
┌─────────────────────────────┐
│ semoga hari ini berjalan    │
│ baik untuk kamu...          │
└─────────────────────────────┘

13 Aug 2026 · 09:42

[ REJECT ]     [ APPROVE ]
```

Setelah approved:

```text
APPROVED ✓

[ BUAT STORY ]
```

---

## 14. Story Generator UI

Generator adalah bagian paling visual dari admin.

### Layout desktop

```text
┌──────────────────────┬────────────────────────┐
│                      │                        │
│   STORY PREVIEW      │  TEMPLATE              │
│                      │                        │
│      1080×1920       │  ○ Minimal             │
│                      │  ○ Soft                │
│                      │  ○ Bold                │
│                      │                        │
│                      │  [ DOWNLOAD PNG ]      │
│                      │  [ SHARE ]             │
│                      │                        │
└──────────────────────┴────────────────────────┘
```

### Mobile

Preview di atas.

Controls di bawah.

```text
┌─────────────────────┐
│                     │
│   STORY PREVIEW     │
│                     │
└─────────────────────┘

TEMPLATE

[ Minimal ] [ Soft ] [ Bold ]

[ DOWNLOAD PNG ]

[ SHARE ]
```

---

## 15. Story Card Design

### Canvas

**1080 × 1920 px**

Safe area:
- top: ~120 px
- bottom: ~160 px
- left/right: ~90 px

### Struktur

```text
GEMPALA
MENFESS

FROM
@andi

TO
@salsa

────────────────

“semoga kamu tahu
ada seseorang yang
selalu mendukungmu.”

────────────────

@gempala
```

### Rules

- Jangan terlalu banyak teks dekoratif.
- Pesan harus menjadi visual utama.
- Nama pengirim/penerima lebih kecil.
- Branding tetap terlihat tetapi tidak mendominasi.
- Text wrapping harus otomatis.
- Long message harus tetap muat atau diberi batas karakter.

---

## 16. Story Templates

### Template 01 — Minimal

Karakter:
- clean
- editorial
- whitespace besar

Komposisi:
- logo kecil di atas
- FROM/TO kecil
- message besar
- handle di bawah

Cocok untuk:
- confession
- pesan serius
- quote pendek

### Template 02 — Soft

Karakter:
- friendly
- warm
- rounded card
- subtle decorative shapes

Cocok untuk:
- ucapan
- crush
- friendship
- birthday

### Template 03 — Bold

Karakter:
- typography besar
- playful
- high contrast

Cocok untuk:
- pesan lucu
- random
- dramatic confession

---

## 17. Responsive Rules

### Mobile `< 640px`

- page padding: 16–20px
- one-column
- button full width
- textarea minimum 140px
- admin cards stacked
- story preview width ~70–85vw

### Tablet `640–1024px`

- max content width 680–760px
- admin dashboard 1–2 columns

### Desktop `>1024px`

- public form max-width ~620px
- admin content max-width ~1200px
- generator 2-column layout

---

## 18. Interaction & Animation

Gunakan animasi kecil saja.

### Hover

Button:
- slight translate / scale
- 150–200ms

### Focus

Input:
- visible accent ring
- jangan menghilangkan accessibility outline

### Page transition

- fade-in
- 150–250ms

### Submit success

- icon scale-in
- text fade-up

Jangan menggunakan:
- loading screen panjang
- parallax
- excessive bouncing
- animation pada setiap elemen

---

## 19. Accessibility

Minimum:

- semua input punya label.
- keyboard navigation.
- focus state jelas.
- contrast cukup.
- button tidak hanya mengandalkan warna.
- error message terbaca screen reader.
- textarea memiliki character limit.
- image/story generator punya fallback download.
- jangan gunakan placeholder sebagai satu-satunya label.

---

## 20. Empty States

### Admin tanpa pending

```text
✨

Belum ada menfess baru.

Santai dulu.
Nanti kalau ada kiriman baru,
muncul di sini.
```

### Search kosong

```text
Tidak menemukan menfess.

Coba kata kunci lain.
```

---

## 21. Error States

### Network error

```text
Ups, ada masalah.

Menfess belum berhasil dikirim.
Coba lagi sebentar.

[ COBA LAGI ]
```

### Admin unauthorized

```text
Akses ditolak.

Silakan login sebagai admin.
```

### Generate error

```text
Story belum berhasil dibuat.

Coba generate lagi.
```

---

## 22. Content Tone

Copy harus:
- santai
- pendek
- tidak kaku
- sedikit playful

Gunakan:
- “Kirim Menfess ✨”
- “Tulis sesuatu...”
- “Menfess terkirim 💌”
- “Bikin Story”
- “Lihat Menfess”
- “Belum ada kiriman”

Hindari:
- “Submit Form”
- “Data berhasil diproses”
- “Record successfully inserted”
- jargon teknis

---

## 23. Navigation

Public:

```text
GEMPALA
MENFESS
```

Tidak perlu banyak menu.

Admin:

```text
Dashboard
Menfess
Logout
```

Mobile admin dapat memakai simple header + back button.

---

## 24. Component Inventory

### Public

- `Logo`
- `PageContainer`
- `MenfessForm`
- `TextInput`
- `Textarea`
- `AnonymousToggle`
- `CharacterCounter`
- `SubmitButton`
- `SuccessState`

### Admin

- `AdminHeader`
- `StatCard`
- `StatusFilter`
- `SearchInput`
- `MenfessList`
- `MenfessCard`
- `MenfessDetail`
- `StatusBadge`
- `ApproveButton`
- `RejectButton`

### Story

- `StoryPreview`
- `TemplateSelector`
- `TemplateCard`
- `DownloadButton`
- `ShareButton`

---

## 25. UX Priority

Urutan prioritas:

### P0 — harus terasa bagus

1. Public form
2. Submit flow
3. Mobile experience
4. Admin reading experience
5. Story output

### P1

6. Template switching
7. Search/filter
8. Nice animations

### P2

9. Dark mode
10. More templates
11. Advanced moderation

---

## 26. Design Principle

> **The website should disappear and let the message become the star.**

Gempala bukan ingin terlihat seperti aplikasi besar.

Pengalaman ideal:

**Buka link → tulis pesan → kirim → admin baca → jadi Story → selesai.**

Cepat, ringan, lucu, dan enak dilihat.
