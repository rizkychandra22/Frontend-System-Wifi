export default {
  Layouts: {
    nav: {
      home: "Beranda",
      about: "Tentang",
      subscription: "Langganan",
      activity: "Aktivitas",
      contact: "Kontak",
      dashboard: "Dashboard",
      portalLogin: "Portal Login",
      toDashboard: "Menuju Dashboard",
      enterPortal: "Masuk ke Portal",
      toggleMenu: "Buka menu navigasi",
      switchLanguage: "Ganti bahasa",
    },
    footer: {
      brandName: "NetVerse Fiber",
      brandDesc:
        "Penyedia jasa internet broadband terpercaya berbasis fiber optik murni dengan misi menghubungkan setiap ruang hidup demi masa depan digital Indonesia yang cemerlang.",
      quickLinks: "Tautan Navigasi",
      adminAccess: "Akses Admin & Karyawan",
      adminDesc:
        "Aplikasi ini terhubung dengan sistem absensi mandiri karyawan dan pemantauan billing pelanggan WiFi.",
      employeeLogin: "Login Karyawan",
      createdBy: "Dibuat oleh",
      systemSubtitle: "Sistem Informasi & Manajemen Bisnis Wifi.",
      backToTop: "Kembali ke atas",
    },
  },

  HomePage: {
    hero: {
      badge: "100% Serat Optik Murni",
      title_start: "Koneksi Internet ",
      title_gradient: "Cepat, Stabil & Tanpa Batas",
      description:
        "NetVerse Fiber menghadirkan layanan internet rumah super cepat menggunakan kabel serat optik terbaik. Aktivitas streaming, kerja jarak jauh, hingga gaming lancar bebas hambatan dengan harga terjangkau.",
      btnChoosePackage: "Pilih Paket WiFi",
      btnContact: "Hubungi Kami",
      cardAlt: "Infrastruktur Internet NetVerse",
      cardTitle: "Internet Rumah Andalan",
      cardSubtitle: "Kestabilan koneksi up to 99.9% uptime",
    },
    features: {
      feature1: {
        title: "Teknologi Fiber Optic",
        description:
          "Jaringan transmisi kabel optik murni dengan redaman minim untuk koneksi tanpa lag.",
        linkLabel: "Pelajari Tentang Kami",
      },
      feature2: {
        title: "Paket Fleksibel & Terjangkau",
        description:
          "Pilihan kecepatan mulai 15 Mbps hingga 50+ Mbps sesuai kebutuhan keluarga Anda.",
        linkLabel: "Lihat Daftar Paket",
      },
      feature3: {
        title: "Respon Layanan Cepat",
        description:
          "Tim teknisi lapangan dan customer care kami siap membantu pemasangan dan kendala.",
        linkLabel: "Hubungi Bantuan",
      },
    },
  },

  AboutPage: {
    header: {
      title: "Tentang NetVerse Fiber",
      description:
        "Kami adalah penyedia jasa layanan internet broadband terpercaya yang berkomitmen penuh dalam memberikan layanan terbaik bagi keluarga Indonesia. Dengan infrastruktur fiber optik modern, kami menjamin kestabilan dan kecepatan transfer data untuk produktivitas Anda.",
    },
    pillars: {
      pillar1: {
        title: "100% Fiber Optic",
        description:
          "Koneksi internet stabil langsung dari kabel serat optik ke router rumah Anda tanpa gangguan cuaca.",
      },
      pillar2: {
        title: "Kuota Unlimited",
        description:
          "Nikmati berselancar sepuasnya tanpa khawatir kehabisan kuota atau penurunan kecepatan yang drastis.",
      },
      pillar3: {
        title: "Layanan Teknis 24/7",
        description:
          "Tim dukungan teknis profesional kami siap melayani dan mengatasi kendala Anda kapan pun dibutuhkan.",
      },
      pillar4: {
        title: "Koneksi Aman",
        description:
          "Dilengkapi keamanan jaringan mutakhir untuk menjaga lalu lintas data pribadi Anda tetap privat dan aman.",
      },
    },
    banner: {
      title: "Menghubungkan Masa Depan Digital Anda",
      description:
        "Dengan cakupan wilayah perumahan yang terus meluas, NetVerse Fiber hadir memberikan pengalaman berinternet yang bebas hambatan untuk hiburan, pendidikan, maupun bisnis online Anda.",
      btnExplore: "Eksplorasi Paket Layanan",
      btnContact: "Hubungi Layanan Kami",
    },
  },

  SubscriptionPage: {
    header: {
      title: "Pilih Paket Langganan",
      description:
        "Temukan variasi paket kecepatan yang paling sesuai dengan kebutuhan harian rumah Anda. Harga jujur, pas di kantong.",
    },
    card: {
      popularBadge: "Paling Populer",
      period: "/ bulan",
      btnOrder: "Pesan Paket",
      toastRedirect: "Mengalihkan ke formulir pemesanan paket wifi {{name}}.",
    },
    tiers: {
      speed15: {
        desc: "Cocok untuk kebutuhan internet harian ringan seperti browsing, chatting, dan media sosial.",
        features: [
          "Unlimited Quota (FUP Bebas)",
          "Ideal untuk 1 - 3 perangkat",
          "Kecepatan stabil hingga 15 Mbps",
          "Instalasi gratis",
        ],
      },
      speed20: {
        desc: "Pilihan terbaik untuk keluarga kecil dengan aktivitas streaming video HD lancar.",
        features: [
          "Unlimited Quota (FUP Bebas)",
          "Ideal untuk 3 - 5 perangkat",
          "Lancar streaming video HD & gaming",
          "Dukungan teknis prioritas",
          "Instalasi gratis",
        ],
      },
      speed35: {
        desc: "Koneksi kencang untuk kerja remote, streaming 4K, kelas online, dan gaming tanpa hambatan.",
        features: [
          "Unlimited Quota (FUP Bebas)",
          "Ideal untuk 5 - 8 perangkat",
          "Sangat lancar video conference & gaming 4K",
          "Dukungan teknis 24/7",
          "Instalasi gratis",
        ],
      },
      speedHigh: {
        desc: "Super cepat {{speed}} Mbps tanpa hambatan untuk smart home dan bisnis skala kecil.",
        features: [
          "Unlimited Quota (FUP Bebas)",
          "Ideal untuk 8+ perangkat",
          "Tanpa lag untuk gaming berat & download file besar",
          "Prioritas penanganan gangguan utama",
          "Instalasi gratis",
        ],
      },
    },
  },

  ActivityPage: {
    header: {
      title: "Galeri Aktivitas & Kegiatan",
      description:
        "Dokumentasi operasional pemasangan jaringan internet NetVerse beserta tampilan integrasi sistem pembayaran digital resmi kami.",
    },
    categories: {
      all: "Semua",
      infrastruktur: "Infrastruktur",
      tim: "Tim Karyawan",
      pelanggan: "Pelanggan",
    },
    items: {
      item1: {
        title: "Pusat Distribusi Fiber Optik",
        description:
          "Infrastruktur distribusi kabel fiber optik NetVerse yang dirancang untuk menyalurkan internet berkecepatan tinggi ke setiap perumahan.",
      },
      item2: {
        title: "Sentral Server & Pemancar WiFi",
        description:
          "Perangkat server utama dan sistem monitoring wifi yang menjamin kestabilan koneksi uptime hingga 99.9%.",
      },
      item3: {
        title: "Tim Teknis & Lapangan NetVerse",
        description:
          "Karyawan dan tim teknisi ahli NetVerse saat melakukan pemasangan kabel dan konfigurasi router di lapangan.",
      },
      item4: {
        title: "Karyawan & Staff Kantor",
        description:
          "Layanan administrasi, verifikasi pembayaran, serta tim customer support NetVerse yang siap melayani pelanggan.",
      },
      item5: {
        title: "Antarmuka Billing Customer",
        description:
          "Antarmuka dashboard khusus pelanggan untuk memantau status langganan wifi aktif dan riwayat tagihan bulanan.",
      },
      item6: {
        title: "Metode Bayar Mandiri QRIS",
        description:
          "Kemudahan pembayaran wifi tagihan mandiri bagi pelanggan menggunakan kode QRIS terverifikasi otomatis.",
      },
    },
  },

  ContactPage: {
    header: {
      title: "Hubungi Layanan Kami",
      description:
        "Punya pertanyaan mengenai paket internet kami? Butuh bantuan pendaftaran? Kirim pesan langsung di bawah ini.",
    },
    info: {
      title: "Informasi Kontak",
      description:
        "Hubungi kami kapan saja melalui saluran kontak di bawah ini. Kami akan dengan senang hati membantu Anda memasang wifi idaman.",
      phone: {
        title: "Telepon & WhatsApp",
        service2: "(Layanan WA 2)",
      },
      email: {
        title: "Alamat Email",
      },
      office: {
        title: "Alamat Kantor Operasional",
        building: "Gedung NetVerse IT Center, Lt. 3",
        address: "Jl. Jenderal Sudirman No. 45, Jakarta Selatan",
      },
      hours: {
        title: "Jam Operasional Kantor",
        time: "Senin - Sabtu: 08.00 - 17.00 WIB",
        support: "Dukungan teknis darurat via WA aktif 24 jam.",
      },
    },
    form: {
      nameLabel: "Nama Lengkap",
      namePlaceholder: "Masukkan nama Anda",
      phoneLabel: "Nomor Telepon / WA",
      phonePlaceholder: "Contoh: 08123456789",
      emailLabel: "Alamat Email (Opsional)",
      emailPlaceholder: "nama@email.com",
      packageLabel: "Paket yang Diminati (Opsional)",
      packagePlaceholder: "-- Pilih Paket Internet --",
      month: "bulan",
      messageLabel: "Pesan / Pertanyaan",
      messagePlaceholder: "Tulis pesan Anda di sini...",
      submit: "Kirim Pesan Layanan",
      submitting: "Mengirimkan Pesan...",
      validationError: "Nama, Nomor HP, dan Pesan wajib diisi.",
      redirectToast: "Form valid! Mengalihkan ke WhatsApp...",
      defaultPackageMessage:
        "Halo Netverse, saya tertarik untuk berlangganan paket wifi {{package}}. Mohon informasikan jadwal pemasangannya.",
      waGreeting:
        "Halo NetVerse Fiber, saya ingin bertanya/berlangganan. Berikut detail informasi saya:",
      waName: "Nama",
      waPhone: "Nomor HP",
      waEmail: "Email",
      waPackage: "Paket yang Diminati",
      waMessage: "Pesan",
    },
  },
};
