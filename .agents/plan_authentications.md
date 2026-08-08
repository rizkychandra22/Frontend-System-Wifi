# Dokumentasi Implementasi Autentikasi (Frontend)

Dokumen ini mencatat struktur dan logika implementasi fitur **Autentikasi (Login)** pada sistem Frontend (React + Vite).

## 1. Arsitektur Folder (Feature-Based)

Seluruh logika yang berhubungan dengan autentikasi diisolasi di dalam folder `src/features/auth/` agar kode tidak berantakan dan mudah di-maintain.

```text
Frontend-System/src/
├── features/
│   └── auth/
│       ├── api/
│       │   └── login.ts         # Berisi fungsi fetch ke endpoint backend
│       └── components/
│           └── login-form.tsx   # Komponen UI Formulir Login
├── lib/
│   └── auth-utils.ts            # Helper untuk menyimpan/mengambil JWT dari LocalStorage
├── pages/
│   └── auth/
│       └── login.tsx            # Halaman utama login yang membungkus login-form.tsx
└── App.tsx                      # Pengaturan routing utama
```

## 2. Teknologi yang Digunakan

- **React Hook Form**: Untuk mengelola *state* input secara efisien tanpa re-render berlebihan.
- **Zod**: Untuk validasi skema (contoh: nomor HP minimal 10 digit, maksimal 15 digit, dan hanya boleh berisi angka).
- **Shadcn UI**: Menggunakan komponen siap pakai (`Card`, `Form`, `Input`, `Button`, `Label`) untuk mempercepat pembuatan UI yang cantik.
- **Lucide React**: Untuk ikon UI.
- **Sonner**: Untuk menampilkan notifikasi pop-up (Toast) saat sukses atau gagal login.

## 3. Alur Kerja (Workflow) Login

1. **User Input:** Pengguna memasukkan Nomor HP di halaman `/login`.
2. **Validasi (Zod):** Sebelum data dikirim, Zod memvalidasi nomor HP. Jika salah format, muncul *error message* merah secara instan.
3. **API Call:** Fungsi `loginApi()` di `login.ts` dipanggil. Fungsi ini menembak endpoint `POST http://localhost:8080/api/auth/login` menggunakan `fetch`.
4. **Respon Sukses:** 
   - Backend membalas dengan **Token JWT** dan data **Role** (admin, employee, customer).
   - Fungsi `setToken(data.token)` dari `auth-utils.ts` dipanggil untuk menyimpan JWT tersebut ke dalam *Local Storage* browser.
   - Muncul Toast sukses.
   - React Router mengarahkan (redirect) pengguna ke halaman *Dashboard* yang sesuai dengan role-nya.
5. **Keamanan (IP Lock):** Karena sistem backend kita mencatat alamat IP pada login pertama, token ini secara implisit terikat ke IP perangkat yang dipakai saat login.

## 4. Standar Penamaan File
- Menggunakan **kebab-case** (huruf kecil dengan strip) untuk semua penamaan komponen dan file, contoh: `login-form.tsx`.
- Hal ini dilakukan untuk mencegah masalah *case-sensitivity* jika proyek di-*deploy* ke server Linux (seperti Vercel atau Netlify).
