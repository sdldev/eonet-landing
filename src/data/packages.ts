type Package = {
    name: string;
    price: string;
    speed: string;
    devices: string;
};

type Faq = {
    question: string;
    answer: string;
};

export const packages: Package[] = [
    { name: "Paket Small", price: "179", speed: "20 Mbps", devices: "3-5" },
    { name: "Paket Basic", price: "199", speed: "30 Mbps", devices: "4-7" },
    { name: "Paket Medium", price: "235", speed: "35 Mbps", devices: "5-8" },
    { name: "Paket Office", price: "285", speed: "45 Mbps", devices: "7-10" },
    { name: "Paket Soho", price: "345", speed: "65 Mbps", devices: "8-12" },
    { name: "Paket Enterprise", price: "645", speed: "100 Mbps", devices: "11-14" },
];

export const faqs: Faq[] = [
    {
        question: "Bagaimana cara cek area layanan?",
        answer:
            "Pilih paket dari website, lalu kirim lokasi pemasangan lewat WhatsApp resmi agar tim EONET mengecek ketersediaan area.",
    },
    {
        question: "Apa langkah setelah memilih paket?",
        answer:
            "Setelah membandingkan paket, konsultasikan kebutuhan rumah atau bisnis Anda untuk konfirmasi paket, area, dan jadwal pemasangan.",
    },
    {
        question: "Apakah bisa konsultasi paket dulu?",
        answer:
            "Bisa. Gunakan tombol Konsultasi paket ini pada kartu paket agar percakapan WhatsApp langsung sesuai paket yang Anda lihat.",
    },
    {
        question: "Apakah biaya langsung final di website?",
        answer:
            "Harga paket tampil di website sebagai bahan perbandingan. Detail area, kebutuhan teknis, dan konfirmasi awal tetap dicek sebelum pemasangan.",
    },
];
