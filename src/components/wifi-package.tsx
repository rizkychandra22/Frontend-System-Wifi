import { type WifiPackage } from "@/lib/api/wifi_package";

export interface FormattedWifiPackage {
  id: number;
  name: string;
  price: string;
  period: string;
  speed: string;
  desc: string;
  features: string[];
  popular: boolean;
}

export function formatWifiPackage(pkg: WifiPackage, idx: number): FormattedWifiPackage {
  // Ambil angka Mbps saja dari nama di database
  let speedMbps = 15;
  const speedMatch = pkg.name.match(/(\d+)\s*Mbps/i);
  if (speedMatch) {
    speedMbps = parseInt(speedMatch[1], 10);
  }

  const speed = `${speedMbps} Mbps`;
  
  // Label populer diberikan pada data dengan index 0 (seperti data awal) atau yang bernilai 15 Mbps
  const popular = speedMbps === 15 || idx === 0;

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(pkg.price);

  // Map detail (deskripsi & fitur) berdasarkan nilai Mbps
  const desc = speedMbps <= 15
    ? "Cocok untuk kebutuhan internet harian ringan seperti browsing, chatting, dan media sosial."
    : speedMbps <= 20
    ? "Pilihan terbaik untuk keluarga kecil dengan aktivitas streaming video HD lancar."
    : speedMbps <= 35
    ? "Koneksi kencang untuk kerja remote, streaming 4K, kelas online, dan gaming tanpa hambatan."
    : `Super cepat ${speedMbps} Mbps tanpa hambatan untuk smart home dan bisnis skala kecil.`;

  const features = speedMbps <= 15
    ? ["Unlimited Quota (FUP Bebas)", "Ideal untuk 1 - 3 perangkat", "Kecepatan stabil hingga 15 Mbps", "Instalasi gratis"]
    : speedMbps <= 20
    ? [
        "Unlimited Quota (FUP Bebas)",
        "Ideal untuk 3 - 5 perangkat",
        "Lancar streaming video HD & gaming",
        "Dukungan teknis prioritas",
        "Instalasi gratis"
      ]
    : speedMbps <= 35
    ? [
        "Unlimited Quota (FUP Bebas)",
        "Ideal untuk 5 - 8 perangkat",
        "Sangat lancar video conference & gaming 4K",
        "Dukungan teknis 24/7",
        "Instalasi gratis"
      ]
    : [
        "Unlimited Quota (FUP Bebas)",
        "Ideal untuk 8+ perangkat",
        "Tanpa lag untuk gaming berat & download file besar",
        "Prioritas penanganan gangguan utama",
        "Instalasi gratis"
      ];

  return {
    id: pkg.id,
    name: pkg.name,
    price: formattedPrice,
    period: "/ bulan",
    speed,
    desc,
    features,
    popular,
  };
}

export function formatWifiPackages(packages: WifiPackage[]): FormattedWifiPackage[] {
  return packages.map((pkg, idx) => formatWifiPackage(pkg, idx));
}
