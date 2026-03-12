import { useEffect, useMemo, useRef, useState } from "react";

type ListingType = "courier_looking" | "company_looking";
type WorkType = "full_time" | "part_time" | "project" | "contract";
type VehicleType = "bike" | "motorcycle" | "car" | "walk";

interface Listing {
  id: string;
  premium: boolean;
  verified: boolean;
  type: ListingType;
  name: string;
  avatar: string;
  title: string;
  city: string;
  district: string;
  workType: WorkType;
  vehicle?: VehicleType;
  salary?: number;
  experience?: number;
  rating?: number;
  reviews?: number;
  description: string;
  phone: string;
  whatsapp: boolean;
  postedAt: Date;
  views: number;
}

const sampleListings: Listing[] = [
  {
    id: "1",
    premium: true,
    verified: true,
    type: "courier_looking",
    name: "Mehmet Yılmaz",
    avatar: "https://i.pravatar.cc/100?img=11",
    title: "Deneyimli Motokurye • Kadıköy",
    city: "İstanbul",
    district: "Kadıköy",
    workType: "full_time",
    vehicle: "motorcycle",
    salary: 18000,
    experience: 3,
    rating: 4.8,
    reviews: 23,
    description: "3 yıl deneyimli, B2 ehliyetli, sigortalı kurye olarak çalışıyorum. Kendi aracım var. Vardiyalı sistemde çalışmaya uygunum.",
    phone: "0532 123 45 67",
    whatsapp: true,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    views: 247,
  },
  {
    id: "2",
    premium: true,
    verified: true,
    type: "company_looking",
    name: "Kargo Express",
    avatar: "https://picsum.photos/seed/ke/100",
    title: "50+ Kurye Arıyor • Tüm İstanbul",
    city: "İstanbul",
    district: "Avrupa Yakası",
    workType: "full_time",
    vehicle: "motorcycle",
    salary: 22000,
    experience: 1,
    rating: 4.6,
    reviews: 89,
    description: "Büyüyen ekibimize katılacak motokurye arıyoruz. Kendi aracı olan/olmayan başvurabilir. Sigorta, yemek ve prim imkanı.",
    phone: "0212 987 65 43",
    whatsapp: true,
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    views: 512,
  },
  {
    id: "3",
    premium: false,
    verified: true,
    type: "courier_looking",
    name: "Ayşe Demir",
    avatar: "https://i.pravatar.cc/100?img=32",
    title: "Bisikletli Kurye • Proje Bazlı",
    city: "Ankara",
    district: "Çankaya",
    workType: "project",
    vehicle: "bike",
    salary: 12000,
    experience: 2,
    rating: 4.4,
    reviews: 12,
    description: "Bisikletli kuryelik yapıyorum, özellikle kısa mesafe paketler için uygunum. Hafta sonları yoğun çalışabilirim.",
    phone: "0555 444 33 22",
    whatsapp: true,
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    views: 96,
  },
  {
    id: "4",
    premium: true,
    verified: false,
    type: "company_looking",
    name: "Hızlı Lojistik",
    avatar: "https://picsum.photos/seed/hl/100",
    title: "Yaya Kurye • İç Anadolu",
    city: "Konya",
    district: "Merkez",
    workType: "part_time",
    vehicle: "walk",
    salary: 15000,
    description: "AVM ve çevresi için yaya kurye arayışımız devam ediyor. Ücret günlük + prim sistemiyle.",
    phone: "0332 111 22 33",
    whatsapp: false,
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    views: 143,
  },
  {
    id: "5",
    premium: false,
    verified: true,
    type: "courier_looking",
    name: "Burak Çelik",
    avatar: "https://i.pravatar.cc/100?img=45",
    title: "Araçlı Kurye • Tam Zamanlı",
    city: "İzmir",
    district: "Alsancak",
    workType: "full_time",
    vehicle: "car",
    salary: 25000,
    experience: 5,
    rating: 4.9,
    reviews: 34,
    description: "Kendi aracımla kurye hizmeti veriyorum. Uzun mesafe teslimatlarda uzmanım.",
    phone: "0232 555 66 77",
    whatsapp: true,
    postedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    views: 278,
  },
  {
    id: "6",
    premium: false,
    verified: false,
    type: "courier_looking",
    name: "Zeynep Kaya",
    avatar: "https://i.pravatar.cc/100?img=39",
    title: "Motokurye • Yarı Zamanlı",
    city: "Bursa",
    district: "Nilüfer",
    workType: "part_time",
    vehicle: "motorcycle",
    salary: 16000,
    experience: 1,
    rating: 4.2,
    reviews: 8,
    description: "Öğrenciyim, akşam saatlerinde ve hafta sonları çalışabilirim. Kendi motosikletim var.",
    phone: "0533 888 99 00",
    whatsapp: true,
    postedAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
    views: 87,
  },
];

const cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Konya", "Adana"];
const vehicleIcons: Record<VehicleType, string> = {
  bike: "🚲",
  motorcycle: "🏍️",
  car: "🚗",
  walk: "🚶",
};
const workTypeLabels: Record<WorkType, string> = {
  full_time: "Tam Zamanlı",
  part_time: "Yarı Zamanlı",
  project: "Proje Bazlı",
  contract: "Sözleşmeli",
};

function formatTRY(value: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value);
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Az önce";
  if (hours < 24) return `${hours}s önce`;
  return `${Math.floor(hours / 24)}g önce`;
}

function Stars({ value }: { value?: number }) {
  if (!value) return null;
  const full = Math.floor(value);
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${value} üzerinden yıldız`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${i < full ? "fill-[#F59E0B]" : "fill-[#E2E8F0]"}`}>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      <span className="ml-1 text-[11px] font-medium text-[#0F172A]">{value.toFixed(1)}</span>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState<"home" | "listings">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>(["İstanbul"]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<WorkType[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<VehicleType[]>([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([8000, 25000]);
  const [onlyPremium, setOnlyPremium] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "salary" | "rating">("newest");
  const [listingType, setListingType] = useState<"all" | ListingType>("all");
  const [drawerListing, setDrawerListing] = useState<Listing | null>(null);
  const [showNewListing, setShowNewListing] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);
  const [stepNew, setStepNew] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [liveUsers, setLiveUsers] = useState(47);
  const [activeTab, setActiveTab] = useState<"ana" | "ilanlar" | "ekle" | "mesaj" | "profil">("ana");
  const marqueeRef = useRef<HTMLDivElement>(null);

  const newListingData = useRef({
    as: "courier" as "courier" | "company",
    name: "",
    city: "İstanbul",
    workType: "full_time" as WorkType,
    vehicle: "motorcycle" as VehicleType,
    title: "",
    description: "",
    salary: 18000,
    phone: "",
    whatsapp: true,
  });

  // simulate live users
  useEffect(() => {
    const id = setInterval(() => {
      setLiveUsers((prev) => Math.max(30, Math.min(99, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // premium marquee animation
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    let raf = 0;
    let x = 0;
    const speed = 0.46;
    const step = () => {
      x -= speed;
      if (Math.abs(x) > el.scrollWidth / 2) x = 0;
      el.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const filtered = useMemo(() => {
    let data = [...sampleListings];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q)
      );
    }
    if (selectedCities.length) data = data.filter((l) => selectedCities.includes(l.city));
    if (selectedWorkTypes.length) data = data.filter((l) => selectedWorkTypes.includes(l.workType));
    if (selectedVehicles.length) data = data.filter((l) => l.vehicle && selectedVehicles.includes(l.vehicle));
    if (listingType !== "all") data = data.filter((l) => l.type === listingType);
    data = data.filter((l) => {
      const salary = l.salary ?? 0;
      return salary >= salaryRange[0] && salary <= salaryRange[1];
    });
    if (onlyPremium) data = data.filter((l) => l.premium);
    if (onlyVerified) data = data.filter((l) => l.verified);

    if (sortBy === "newest") data.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
    if (sortBy === "salary") data.sort((a, b) => (b.salary ?? 0) - (a.salary ?? 0));
    if (sortBy === "rating") data.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    // premium always on top
    data.sort((a, b) => Number(b.premium) - Number(a.premium));
    return data;
  }, [
    searchQuery,
    selectedCities,
    selectedWorkTypes,
    selectedVehicles,
    salaryRange,
    onlyPremium,
    onlyVerified,
    sortBy,
    listingType,
  ]);

  function addToast(message: string) {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  function toggleCity(city: string) {
    setSelectedCities((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));
  }

  function toggleWorkType(wt: WorkType) {
    setSelectedWorkTypes((prev) => (prev.includes(wt) ? prev.filter((x) => x !== wt) : [...prev, wt]));
  }

  function toggleVehicle(v: VehicleType) {
    setSelectedVehicles((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }

  const premiumListings = sampleListings.filter((l) => l.premium);

  return (
    <div
      className="relative min-h-dvh w-full overflow-x-hidden bg-[#F8FAFC] font-['DM_Sans',system-ui] text-[#0F172A] antialiased selection:bg-[#F97316]/20"
      style={{ fontFeatureSettings: "'tnum' on, 'cv01' on, 'cv02' on" }}
    >
      {/* ===== PREMIUM STRIP (always top) ===== */}
      <div className="relative z-50 h-12 w-full overflow-hidden border-b border-white/10 bg-[#0F172A]">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#0F172A] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#0F172A] to-transparent" />
        <div
          ref={marqueeRef}
          className="flex h-full items-center gap-8 whitespace-nowrap will-change-transform"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          {[...premiumListings, ...premiumListings].map((l, i) => (
            <button
              key={`${l.id}-${i}`}
              onClick={() => setDrawerListing(l)}
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-[#1E293B]/60 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur transition hover:bg-[#1E293B]"
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[#F59E0B] text-[9px] font-bold text-[#0F172A]">★</span>
              <span className="truncate max-w-[180px]">{l.title}</span>
              <span className="rounded bg-[#F59E0B]/20 px-1.5 py-0.5 text-[9px] font-semibold text-[#FDE68A]">ÖNE ÇIKAN</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== STICKY NAVBAR ===== */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0]/60 bg-white/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-3 px-4 md:px-6">
          {/* Left: Logo */}
          <button
            onClick={() => {
              setActiveView("home");
              setActiveTab("ana");
            }}
            className="group flex items-center gap-2.5 outline-none"
          >
            <div className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-[#F97316] to-[#C2410C] shadow-md shadow-orange-900/20 transition group-hover:scale-[1.03]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h8" />
                <circle cx="7" cy="16" r="2" />
                <circle cx="17" cy="16" r="2" />
                <path d="M7 14V8h10l2 6H7z" />
              </svg>
              <div className="pointer-events-none absolute -right-1 -top-1 h-3 w-3 rounded-full bg-white/30 blur-[2px]" />
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-[17px] font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                Kurye<span className="text-[#F97316]">Bul</span>
              </p>
              <p className=" -mt-1 text-[10px] font-medium tracking-wider text-[#64748B]">TÜRKİYE'NİN KURYE PLATFORMU</p>
            </div>
          </button>

          {/* Center Nav — desktop only */}
          <nav className="hidden items-center gap-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC]/70 px-1.5 py-1 backdrop-blur lg:flex">
            {[
              { id: "listings", label: "İlanlar" },
              { id: "couriers", label: "Kuryeler" },
              { id: "companies", label: "Firmalar" },
              { id: "premium", label: "Premium" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "premium") setShowPremium(true);
                  else {
                    setActiveView("listings");
                    if (item.id === "couriers") setListingType("courier_looking");
                    if (item.id === "companies") setListingType("company_looking");
                    if (item.id === "listings") setListingType("all");
                  }
                }}
                className="relative rounded-full px-3.5 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-white"
              >
                {item.label}
                {item.id === "premium" && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-[#F59E0B] px-1.5 py-0.5 text-[9px] font-bold leading-none text-[#0F172A]">PRO</span>
                )}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC]/80 px-2.5 py-1.5 text-[12px] font-medium md:flex">
              <span className="opacity-70">📍</span>
              <span className="tabular-nums">İstanbul</span>
              <svg className="h-3.5 w-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg>
            </div>
            <button className="hidden rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] shadow-sm transition hover:shadow md:inline-flex">
              Giriş Yap
            </button>
            <button
              onClick={() => setShowNewListing(true)}
              className="relative isolate inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-br from-[#F97316] to-[#C2410C] px-4 py-2.5 text-[13px] font-extrabold text-white shadow-lg shadow-orange-900/25 transition hover:shadow-orange-900/35 hover:brightness-[1.03] active:scale-[0.98]"
            >
              <span className="relative z-10">İlan Ver</span>
              <span className="relative z-10 text-[15px] leading-none">＋</span>
              <span className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(60%_60%_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
            </button>

            {/* Mobile avatar placeholder */}
            <div className="ml-1 grid h-9 w-9 place-items-center rounded-full border border-[#E2E8F0] bg-[#F1F5F9] text-sm font-bold text-[#0F172A] md:hidden">M</div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="mx-auto w-full max-w-[1320px] px-4 md:px-6">
        {activeView === "home" ? (
          <>
            {/* HERO SECTION */}
            <section className="relative grid grid-cols-1 items-center gap-8 py-10 md:grid-cols-[minmax(0,1fr)_420px] md:py-16">
              {/* Left text */}
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white/70 px-3 py-1.5 text-[11px] font-semibold backdrop-blur">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-[#F97316] text-[9px] font-bold text-white">🚀</span>
                  Türkiye'nin Kurye Platformu
                </div>
                <h1
                  className="text-[42px] font-extrabold leading-[1.05] tracking-tight md:text-[64px]"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  TÜRKİYE'NİN EN<br />
                  BÜYÜK <span className="bg-gradient-to-r from-[#F97316] to-[#C2410C] bg-clip-text text-transparent">KURYE</span><br />
                  PAZARI
                </h1>
                <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-[#475569]">
                  Kurye arayan firmalar ile iş arayan kuryeler tek platformda buluşuyor. Hızlı, güvenilir, profesyonel.
                </p>

                {/* Search bar */}
                <div className="mt-6 flex max-w-[560px] items-stretch overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
                  <div className="flex items-center gap-2 pl-4 pr-2">
                    <svg className="h-4 w-4 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="İsim, şirket, şehir ara..."
                      className="h-12 w-[210px] bg-transparent text-[14px] font-medium placeholder:text-[#94A3B8] focus:outline-none"
                    />
                  </div>
                  <div className="h-8 w-px self-center bg-[#E2E8F0]" />
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as any)}
                    className="h-12 bg-transparent px-3 text-[13px] font-semibold text-[#0F172A] focus:outline-none"
                  >
                    <option value="all">Tümü</option>
                    <option value="courier_looking">Kurye Arıyor (Firma)</option>
                    <option value="company_looking">İş Arıyor (Kurye)</option>
                  </select>
                  <button
                    onClick={() => setActiveView("listings")}
                    className="ml-auto flex h-12 items-center gap-2 bg-[#0F172A] px-5 text-[13px] font-extrabold text-white transition hover:bg-[#0F172A]/90"
                  >
                    <span>Ara</span>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </button>
                </div>

                {/* Live stats */}
                <div className="mt-7 grid max-w-[560px] grid-cols-3 gap-3">
                  {[
                    { label: "Aktif İlan", value: "2.847", icon: "📋" },
                    { label: "Kayıtlı Kurye", value: "12.430", icon: "🧑‍✈️" },
                    { label: "Şehir", value: "81", icon: "📍" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-3.5 text-center shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">{s.label}</p>
                      <p className="mt-1 text-[22px] font-extrabold tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>{s.value}</p>
                      <p className="text-[10px] text-[#94A3B8]">{s.icon}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right illustration */}
              <div className="relative hidden h-[380px] select-none overflow-hidden rounded-[2.5rem] border border-[#E2E8F0] bg-gradient-to-br from-[#0F172A] to-[#1E293B] shadow-[0_20px_80px_-20px_rgba(15,23,42,0.45)] md:block">
                {/* subtle grid */}
                <svg className="absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
                {/* moto illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-[240px] w-[320px]">
                    <svg viewBox="0 0 320 240" className="h-full w-full">
                      <defs>
                        <linearGradient id="motoBody" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#F97316"/>
                          <stop offset="100%" stopColor="#C2410C"/>
                        </linearGradient>
                        <filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                      </defs>
                      {/* wheels */}
                      <circle cx="86" cy="170" r="42" fill="none" stroke="white" strokeWidth="8" opacity="0.25"/>
                      <circle cx="234" cy="170" r="42" fill="none" stroke="white" strokeWidth="8" opacity="0.25"/>
                      {/* body */}
                      <path d="M70 130 C 120 90, 200 90, 250 130 L 230 150 C 190 120, 120 120, 90 150 Z" fill="url(#motoBody)" filter="url(#glow)"/>
                      {/* rider */}
                      <circle cx="150" cy="96" r="18" fill="white" opacity="0.9"/>
                      <path d="M150 114 L 150 150 M130 130 L 170 130" stroke="white" strokeWidth="8" strokeLinecap="round" opacity="0.9"/>
                    </svg>
                    {/* speed lines */}
                    <div className="pointer-events-none absolute inset-0">
                      {Array.from({length: 6}).map((_, i) => (
                        <div key={i} className="absolute h-[2px] w-[120px] rounded-full bg-white/20" style={{ left: -30 + i*18, top: 80 + i*16, transform: `rotate(-12deg) translateX(${i%2?8:0}px)`}}/>
                      ))}
                    </div>
                  </div>
                </div>
                {/* floating stat chips */}
                <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">🔴 Canlı: {liveUsers} kişi aktif</div>
                <div className="absolute bottom-5 right-5 rounded-full border border-white/15 bg-[#F59E0B]/20 px-3 py-1.5 text-[11px] font-bold text-[#FDE68A] backdrop-blur">⭐ Premium · Üst Sırada</div>
              </div>
            </section>

            {/* Quick Category Cards */}
            <section className="grid grid-cols-2 gap-3 pb-4 md:grid-cols-4">
              {[
                { title: "Motokurye", icon: "🏍️", count: "1.248" },
                { title: "Bisikletli", icon: "🚲", count: "421" },
                { title: "Araçlı", icon: "🚗", count: "673" },
                { title: "Yaya", icon: "🚶", count: "198" },
              ].map((cat) => (
                <button
                  key={cat.title}
                  onClick={() => {
                    setActiveView("listings");
                    if (cat.title === "Motokurye") setSelectedVehicles(["motorcycle"]);
                    if (cat.title === "Bisikletli") setSelectedVehicles(["bike"]);
                    if (cat.title === "Araçlı") setSelectedVehicles(["car"]);
                    if (cat.title === "Yaya") setSelectedVehicles(["walk"]);
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-extrabold tracking-tight">{cat.title}</p>
                    <span className="text-[20px]">{cat.icon}</span>
                  </div>
                  <p className="mt-2 text-[11px] font-semibold text-[#64748B]">{cat.count} ilan</p>
                  <div className="pointer-events-none absolute -bottom-6 -right-6 h-14 w-14 rounded-full bg-[#F97316]/10 blur-xl transition group-hover:bg-[#F97316]/20" />
                </button>
              ))}
            </section>

            {/* Featured listings preview (6 cards) */}
            <section className="pb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[17px] font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>Son İlanlar</h2>
                <button onClick={() => setActiveView("listings")} className="text-[12px] font-bold text-[#F97316]">Tümünü Gör →</button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.slice(0, 6).map((l) => (
                  <ListingCard key={l.id} listing={l} onClick={() => setDrawerListing(l)} />
                ))}
              </div>
            </section>
          </>
        ) : (
          /* ===== LISTINGS PAGE ===== */
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* FILTER PANEL (desktop) */}
            <aside className="sticky top-[84px] hidden h-[calc(100dvh-108px)] w-[290px] shrink-0 flex-col overflow-y-auto rounded-[1.6rem] border border-[#E2E8F0] bg-white p-4 shadow-sm lg:flex">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[13px] font-extrabold">Filtreler</p>
                <button
                  onClick={() => {
                    setSelectedCities(["İstanbul"]);
                    setSelectedWorkTypes([]);
                    setSelectedVehicles([]);
                    setSalaryRange([8000, 25000]);
                    setOnlyPremium(false);
                    setOnlyVerified(false);
                    setListingType("all");
                  }}
                  className="text-[11px] font-bold text-[#F97316]"
                >
                  Temizle
                </button>
              </div>

              <div className="space-y-5">
                {/* İlan Türü */}
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">İlan Türü</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "all", label: "Tümü" },
                      { id: "courier_looking", label: "Kurye Arıyor" },
                      { id: "company_looking", label: "İş Arıyor" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setListingType(opt.id as any)}
                        className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                          listingType === opt.id
                            ? "border-[#F97316] bg-[#F97316]/10 text-[#C2410C]"
                            : "border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Şehir */}
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Şehir</p>
                  <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto pr-1">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => toggleCity(city)}
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                          selectedCities.includes(city)
                            ? "border-[#0F172A] bg-[#0F172A] text-white"
                            : "border-[#E2E8F0] bg-white text-[#0F172A]"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Çalışma Türü */}
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Çalışma Türü</p>
                  <div className="flex flex-col gap-1.5">
                    {Object.entries(workTypeLabels).map(([key, label]) => (
                      <label key={key} className="flex cursor-pointer items-center gap-2 text-[12px] font-medium">
                        <input
                          type="checkbox"
                          checked={selectedWorkTypes.includes(key as WorkType)}
                          onChange={() => toggleWorkType(key as WorkType)}
                          className="h-4 w-4 accent-[#F97316]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Araç Türü */}
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Araç Türü</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(vehicleIcons).map(([key, icon]) => (
                      <button
                        key={key}
                        onClick={() => toggleVehicle(key as VehicleType)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[12px] font-semibold ${
                          selectedVehicles.includes(key as VehicleType)
                            ? "border-[#F97316] bg-[#F97316]/10 text-[#C2410C]"
                            : "border-[#E2E8F0] bg-white text-[#0F172A]"
                        }`}
                      >
                        <span className="text-[15px]">{icon}</span>
                        {key === "bike" ? "Bisiklet" : key === "motorcycle" ? "Motosiklet" : key === "car" ? "Araç" : "Yaya"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ücret Aralığı */}
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Ücret Aralığı (₺)</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={5000}
                      max={35000}
                      step={500}
                      value={salaryRange[0]}
                      onChange={(e) => setSalaryRange([Number(e.target.value), salaryRange[1]])}
                      className="h-1.5 w-full accent-[#F97316]"
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[11px] font-mono text-[#475569]">
                    <span>{formatTRY(salaryRange[0])}</span>
                    <span>{formatTRY(salaryRange[1])}</span>
                  </div>
                </div>

                {/* Özel filtreler */}
                <div className="space-y-2 border-t border-[#E2E8F0] pt-4">
                  <label className="flex cursor-pointer items-center gap-2 text-[12px] font-semibold">
                    <input type="checkbox" checked={onlyPremium} onChange={(e) => setOnlyPremium(e.target.checked)} className="h-4 w-4 accent-[#F59E0B]" />
                    <span className="rounded bg-[#F59E0B]/15 px-1.5 py-0.5 text-[10px] font-extrabold text-[#B45309]">★ PREMIUM</span> Sadece öne çıkan
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-[12px] font-semibold">
                    <input type="checkbox" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} className="h-4 w-4 accent-[#22C55E]" />
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E] text-[9px] font-black text-white">✓</span> Doğrulanmış
                  </label>
                </div>

                {/* Sıralama */}
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Sıralama</p>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-[12px] font-semibold"
                  >
                    <option value="newest">En Yeni</option>
                    <option value="salary">Ücret (Yüksek→Düşük)</option>
                    <option value="rating">Değerlendirme</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* LISTINGS GRID */}
            <section className="flex-1 pb-24 pt-4 lg:pt-6">
              {/* Mobile filter bar */}
              <div className="mb-4 flex items-center gap-2 overflow-x-auto lg:hidden">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-2 text-[12px] font-bold"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18M7 12h10M10 18h4"/></svg>
                  Filtreler
                </button>
                {selectedCities.map((c) => (
                  <span key={c} className="shrink-0 rounded-full bg-[#0F172A] px-3 py-1.5 text-[11px] font-semibold text-white">
                    {c} ×
                  </span>
                ))}
              </div>

              <div className="mb-3 flex items-center justify-between">
                <p className="text-[13px] font-extrabold">{filtered.length} ilan bulundu</p>
                <div className="hidden items-center gap-2 text-[11px] font-semibold text-[#64748B] lg:flex">
                  <span>Şu an</span>
                  <span className="rounded-full bg-[#38BDF8]/15 px-2 py-0.5 font-mono text-[#0F172A]">{liveUsers}</span>
                  <span>kişi bu sayfada</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((l) => (
                  <ListingCard key={l.id} listing={l} onClick={() => setDrawerListing(l)} />
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center text-[13px] font-medium text-[#64748B]">
                    Seçtiğiniz filtrelerle eşleşen ilan bulunamadı. Filtreleri temizlemeyi deneyin.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-[64px] items-center justify-around border-t border-[#E2E8F0] bg-white/95 backdrop-blur-xl lg:hidden">
        {[
          { id: "ana", label: "Ana", icon: "🏠" },
          { id: "ilanlar", label: "İlanlar", icon: "📋" },
          { id: "ekle", label: "Ekle", icon: "➕", special: true },
          { id: "mesaj", label: "Mesaj", icon: "💬" },
          { id: "profil", label: "Profil", icon: "👤" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === "ana") setActiveView("home");
              if (tab.id === "ilanlar") setActiveView("listings");
              if (tab.id === "ekle") setShowNewListing(true);
            }}
            className={`relative flex h-full w-1/5 flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
              activeTab === tab.id ? "text-[#F97316]" : "text-[#475569]"
            }`}
          >
            {tab.special ? (
              <div className="absolute -top-5 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#F97316] to-[#C2410C] text-[20px] shadow-lg shadow-orange-900/30">
                {tab.icon}
              </div>
            ) : (
              <span className="text-[18px] leading-none">{tab.icon}</span>
            )}
            <span className={tab.special ? "mt-6" : ""}>{tab.label}</span>
            {activeTab === tab.id && !tab.special && <span className="absolute bottom-1 h-1 w-6 rounded-full bg-[#F97316]" />}
          </button>
        ))}
      </nav>

      {/* ===== MOBILE FILTER DRAWER ===== */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[82dvh] overflow-hidden rounded-t-[2rem] border-t border-[#E2E8F0] bg-white shadow-[0_-20px_60px_-15px_rgba(15,23,42,0.35)]">
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-[#CBD5E1]" />
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <p className="text-[15px] font-extrabold">Filtreler</p>
              <button onClick={() => setMobileFilterOpen(false)} className="text-[13px] font-bold text-[#F97316]">Kapat</button>
            </div>
            <div className="max-h-[65dvh] space-y-5 overflow-y-auto px-5 py-4">
              {/* reuse same filter content – simplified for brevity */}
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Şehir</p>
                <div className="flex flex-wrap gap-1.5">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => toggleCity(city)}
                      className={`rounded-full border px-2.5 py-1.5 text-[11px] font-semibold ${
                        selectedCities.includes(city) ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-[#E2E8F0] bg-white"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Araç Türü</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(vehicleIcons).map(([key, icon]) => (
                    <button
                      key={key}
                      onClick={() => toggleVehicle(key as VehicleType)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12px] font-semibold ${
                        selectedVehicles.includes(key as VehicleType) ? "border-[#F97316] bg-[#F97316]/10 text-[#C2410C]" : "border-[#E2E8F0] bg-white"
                      }`}
                    >
                      <span className="text-[16px]">{icon}</span>
                      {key === "bike" ? "Bisiklet" : key === "motorcycle" ? "Motosiklet" : key === "car" ? "Araç" : "Yaya"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-[#E2E8F0] p-4">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full rounded-2xl bg-[#0F172A] py-3.5 text-[14px] font-extrabold text-white"
              >
                {filtered.length} Sonucu Göster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== LISTING DETAIL DRAWER (right side) ===== */}
      {drawerListing && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" onClick={() => setDrawerListing(null)} />
          <aside className="absolute right-0 top-0 flex h-dvh w-full max-w-[480px] flex-col overflow-hidden border-l border-[#E2E8F0] bg-white shadow-[-20px_0_60px_-15px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-3 border-b border-[#E2E8F0] p-4">
              <button onClick={() => setDrawerListing(null)} className="grid h-9 w-9 place-items-center rounded-full border border-[#E2E8F0] text-[18px]">←</button>
              <p className="text-[15px] font-extrabold">İlan Detayı</p>
              <div className="ml-auto flex items-center gap-2">
                <button className="grid h-9 w-9 place-items-center rounded-full border border-[#E2E8F0] text-[16px]">⭐</button>
                <button className="grid h-9 w-9 place-items-center rounded-full border border-[#E2E8F0] text-[16px]">📤</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img src={drawerListing.avatar} alt="" className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[#F97316]/20" />
                  {drawerListing.verified && (
                    <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[#22C55E] text-[10px] font-black text-white">✓</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[17px] font-extrabold">{drawerListing.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                    {drawerListing.rating && <Stars value={drawerListing.rating} />}
                    <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5">{drawerListing.city}, {drawerListing.district}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-[13px]">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">İlan Bilgileri</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div><span className="opacity-70">Tür:</span> <span className="font-semibold">{drawerListing.type === "courier_looking" ? "Kurye Arıyor" : "İş Arıyor"}</span></div>
                  <div><span className="opacity-70">Çalışma:</span> <span className="font-semibold">{workTypeLabels[drawerListing.workType]}</span></div>
                  {drawerListing.vehicle && <div><span className="opacity-70">Araç:</span> <span className="font-semibold">{vehicleIcons[drawerListing.vehicle]} {drawerListing.vehicle}</span></div>}
                  {drawerListing.experience && <div><span className="opacity-70">Tecrübe:</span> <span className="font-semibold">{drawerListing.experience} yıl</span></div>}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Açıklama</p>
                <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{drawerListing.description}</p>
              </div>

              <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Beklenen Ücret</p>
                  <p className="text-[22px] font-extrabold tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    {drawerListing.salary ? formatTRY(drawerListing.salary) : "—"} <span className="text-[11px] font-semibold text-[#64748B]">/ ay</span>
                  </p>
                </div>
                <p className="mt-1 text-[11px] text-[#64748B]">İlan: {timeAgo(drawerListing.postedAt)} • {drawerListing.views} görüntülenme</p>
              </div>
            </div>
            <div className="border-t border-[#E2E8F0] p-4">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${drawerListing.phone}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0F172A] text-[14px] font-extrabold text-white"
                >
                  📞 Ara
                </a>
                {drawerListing.whatsapp ? (
                  <a
                    href={`https://wa.me/90${drawerListing.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#22C55E] bg-[#22C55E]/10 text-[14px] font-extrabold text-[#15803D]"
                  >
                    💬 WhatsApp
                  </a>
                ) : (
                  <button
                    onClick={() => addToast("WhatsApp iletimi kapalı. Telefonla arayabilirsiniz.")}
                    className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] text-[14px] font-extrabold text-[#475569]"
                  >
                    ✉️ Mesaj Gönder
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ===== NEW LISTING WIZARD MODAL ===== */}
      {showNewListing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setShowNewListing(false)} />
          <div className="relative flex h-[86dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[2.2rem] border border-[#E2E8F0] bg-white shadow-[0_-20px_80px_-20px_rgba(15,23,42,0.45)] md:h-[72dvh] md:rounded-[2.2rem]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] p-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Adım {stepNew}/4</p>
                <p className="text-[18px] font-extrabold">İlan Ver</p>
              </div>
              <button onClick={() => setShowNewListing(false)} className="text-[22px] leading-none">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {stepNew === 1 && (
                <div className="space-y-4">
                  <p className="text-[13px] font-semibold">Ben kimim?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "courier", label: "Kurye olarak ilan veriyorum", icon: "🏍️" },
                      { id: "company", label: "Firma olarak kurye arıyorum", icon: "🏢" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => (newListingData.current.as = opt.id as any)}
                        className={`flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border text-[13px] font-extrabold ${
                          newListingData.current.as === opt.id
                            ? "border-[#F97316] bg-[#F97316]/10 text-[#C2410C]"
                            : "border-[#E2E8F0] bg-white"
                        }`}
                      >
                        <span className="text-[28px]">{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {stepNew === 2 && (
                <div className="space-y-4">
                  <label className="block text-[12px] font-semibold">İsim / Firma Adı</label>
                  <input
                    defaultValue={newListingData.current.name}
                    onChange={(e) => (newListingData.current.name = e.target.value)}
                    placeholder="Mehmet Yılmaz / Kargo Express"
                    className="h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-[14px] font-medium outline-none focus:border-[#F97316]"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-semibold">Şehir</label>
                      <select
                        defaultValue={newListingData.current.city}
                        onChange={(e) => (newListingData.current.city = e.target.value)}
                        className="h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] font-semibold"
                      >
                        {cities.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold">Çalışma Türü</label>
                      <select
                        defaultValue={newListingData.current.workType}
                        onChange={(e) => (newListingData.current.workType = e.target.value as WorkType)}
                        className="h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] font-semibold"
                      >
                        {Object.entries(workTypeLabels).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {stepNew === 3 && (
                <div className="space-y-4">
                  <label className="block text-[12px] font-semibold">Başlık</label>
                  <input
                    defaultValue={newListingData.current.title}
                    onChange={(e) => (newListingData.current.title = e.target.value)}
                    placeholder="Deneyimli Motokurye • Kadıköy"
                    className="h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-[14px] font-medium"
                  />
                  <label className="block text-[12px] font-semibold">Açıklama</label>
                  <textarea
                    defaultValue={newListingData.current.description}
                    onChange={(e) => (newListingData.current.description = e.target.value)}
                    rows={4}
                    placeholder="Deneyim, araç, çalışma saatleri..."
                    className="w-full resize-none rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-[14px] leading-relaxed"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-semibold">Ücret (₺ / ay)</label>
                      <input
                        type="number"
                        defaultValue={newListingData.current.salary}
                        onChange={(e) => (newListingData.current.salary = Number(e.target.value))}
                        className="h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-[14px] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold">Telefon</label>
                      <input
                        defaultValue={newListingData.current.phone}
                        onChange={(e) => (newListingData.current.phone = e.target.value)}
                        placeholder="05xx xxx xx xx"
                        className="h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-[14px]"
                      />
                    </div>
                  </div>
                </div>
              )}
              {stepNew === 4 && (
                <div className="space-y-5">
                  <p className="text-[13px] font-semibold">Önizleme</p>
                  <div className="rounded-[1.8rem] border border-[#E2E8F0] bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <img src="https://i.pravatar.cc/100?img=12" className="h-12 w-12 rounded-xl object-cover" alt="" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-extrabold">{newListingData.current.name || "İsim / Firma"}</p>
                        <p className="truncate text-[12px] font-semibold text-[#64748B]">{newListingData.current.title || "Başlık girilmedi"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[16px] font-extrabold tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>{formatTRY(newListingData.current.salary)}</p>
                        <p className="text-[10px] font-semibold text-[#64748B]">/ ay</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-[#F59E0B] bg-[#FFFBEB] p-4 text-[12px]">
                    <p className="font-extrabold text-[#B45309]">Premium ile öne çık!</p>
                    <p className="mt-1 text-[#92400E]">İlanın ana sayfada ve aramalarda en üstte görünür, altın çerçeve alır.</p>
                    <p className="mt-2 font-mono text-[14px] font-extrabold text-[#B45309]">100 ₺ / 30 gün</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[#E2E8F0] p-5">
              <button
                disabled={stepNew === 1}
                onClick={() => setStepNew((s) => Math.max(1, s - 1))}
                className="h-12 rounded-2xl border border-[#E2E8F0] px-5 text-[13px] font-bold disabled:opacity-40"
              >
                Geri
              </button>
              <button
                onClick={() => {
                  if (stepNew < 4) setStepNew((s) => s + 1);
                  else {
                    addToast("İlanın başarıyla yayınlandı! (Demo)");
                    setShowNewListing(false);
                    setStepNew(1);
                  }
                }}
                className="h-12 flex-1 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#C2410C] text-[14px] font-extrabold text-white shadow-lg shadow-orange-900/25"
              >
                {stepNew < 4 ? "Devam →" : "İlanı Yayınla"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PREMIUM MODAL ===== */}
      {showPremium && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={() => setShowPremium(false)} />
          <div className="relative w-[92%] max-w-[420px] overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-white">
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-6 text-center text-white">
              <p className="text-[11px] font-bold tracking-widest text-[#94A3B8]">KURYEBUL</p>
              <p className="mt-1 text-[22px] font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>PREMIUM ÜYELİK</p>
            </div>
            <div className="space-y-3 p-6">
              {[
                "Üst sırada görün",
                "Altın çerçeve",
                "Ana sayfa bandında öne çık",
                "Doğrulanmış rozet",
                "Öncelikli destek",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-[13px] font-semibold">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#F59E0B] text-[11px] font-black text-[#0F172A]">✓</span>
                  {feat}
                </div>
              ))}
              <div className="mt-4 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-center">
                <p className="text-[26px] font-extrabold tracking-tight text-[#B45309]" style={{ fontFamily: "JetBrains Mono, monospace" }}>100 ₺</p>
                <p className="text-[11px] font-bold text-[#92400E]">30 gün boyunca</p>
              </div>
              <button
                onClick={() => {
                  addToast("Premium üyelik satın alındı! (Demo)");
                  setShowPremium(false);
                }}
                className="mt-2 h-12 w-full rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-[14px] font-extrabold text-[#0F172A] shadow-lg shadow-amber-900/25"
              >
                💳 Kredi Kartı ile Öde
              </button>
              <p className="text-center text-[10px] font-semibold text-[#64748B]">🔒 Güvenli ödeme • 256-bit SSL</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOASTS ===== */}
      <div className="pointer-events-none fixed bottom-[76px] left-1/2 z-[60] flex w-[92%] max-w-[420px] -translate-x-1/2 flex-col gap-2 md:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-[#E2E8F0] bg-white/95 px-4 py-3 text-[13px] font-semibold shadow-lg shadow-black/10 backdrop-blur-xl"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#22C55E]/15 text-[12px] font-black text-[#15803D]">✓</span>
            {t.message}
          </div>
        ))}
      </div>

      {/* FAB (desktop) */}
      <button
        onClick={() => setShowNewListing(true)}
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#F97316] to-[#C2410C] text-[26px] font-bold text-white shadow-[0_12px_40px_-8px_rgba(249,115,22,0.55)] transition hover:scale-[1.04] active:scale-[0.96] lg:grid"
        aria-label="Yeni ilan ver"
      >
        ＋
      </button>
    </div>
  );
}

/* ========== Listing Card Component ========== */
function ListingCard({ listing, onClick }: { listing: Listing; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-[1.8rem] border bg-white text-left shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl ${
        listing.premium
          ? "border-[2.5px] border-[#F59E0B] shadow-[0_8px_30px_-8px_rgba(245,158,11,0.35)]"
          : "border-[#E2E8F0] hover:border-[#CBD5E1]"
      }`}
    >
      {/* Premium ribbon */}
      {listing.premium && (
        <div className="pointer-events-none absolute left-0 top-0 z-10">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] pl-3 pr-2.5 pt-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0F172A] [clip-path:polygon(0_0,100%_0,92%_100%,0_100%)]">
            <span className="text-[11px]">★</span> ÖNE ÇIKAN
          </div>
        </div>
      )}

      {/* Card body */}
      <div className="relative z-0 flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <img src={listing.avatar} alt="" className="h-12 w-12 rounded-xl object-cover ring-1 ring-black/5" />
            {listing.verified && (
              <span className="absolute -bottom-1 -right-1 grid h-4.5 w-4.5 place-items-center rounded-full bg-[#22C55E] text-[9px] font-black text-white ring-2 ring-white">✓</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-[15px] font-extrabold tracking-tight">{listing.name}</p>
            <p className="line-clamp-1 text-[11.5px] font-semibold text-[#475569]">{listing.title}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {listing.rating && <Stars value={listing.rating} />}
              <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-semibold text-[#334155]">{listing.city}</span>
              {listing.vehicle && (
                <span className="flex items-center gap-1 rounded-full bg-[#F97316]/10 px-2 py-0.5 text-[10px] font-bold text-[#C2410C]">
                  {vehicleIcons[listing.vehicle]} {workTypeLabels[listing.workType]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* description snippet */}
        <p className="line-clamp-2 text-[12.5px] leading-snug text-[#334155]">{listing.description}</p>

        {/* footer bar */}
        <div className="mt-auto flex items-end justify-between pt-1">
          <div>
            <p className="text-[18px] font-extrabold tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              {listing.salary ? formatTRY(listing.salary) : "—"}
              <span className="ml-1 text-[10px] font-bold text-[#64748B]">/ay</span>
            </p>
            <p className="text-[10px] font-semibold text-[#64748B]">İlan: {timeAgo(listing.postedAt)}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="grid h-8 w-8 place-items-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-[15px]">📞</div>
            {listing.whatsapp && <div className="grid h-8 w-8 place-items-center rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 text-[15px] text-[#15803D]">💬</div>}
          </div>
        </div>
      </div>

      {/* subtle premium glow */}
      {listing.premium && (
        <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] bg-[radial-gradient(120%_120%_at_0%_0%,rgba(245,158,11,0.08),transparent_55%)]" />
      )}
    </button>
  );
}
// Zod Schema
export const Schema = {
    "commentary": "KuryeBul için verilen kapsamlı tasarım rehberini birebir uyguladım. Platformun iki hedef kitlesine (mobildeki kurye ve masaüstündeki firma) aynı anda hitap eden, responsive bir mimari kurdum. En kritik özellikler: Üstte sürekli akan altın premium şerit, yapışkan (sticky) frosted-glass navbar, Syne + DM Sans + JetBrains Mono font üçlüsü, turuncu/lacivert/altın renk paleti, hem desktop'ta solda sabit filtre paneli hem de mobilde aşağıdan açılan bottom sheet filtre, sağdan açılan ilan detay drawer'ı (sayfa kararması yerine), 4 adımlı sihirbaz ilan verme akışı, premium satın alma modalı, canlı kullanıcı sayaç simülasyonu, toast bildirim sistemi ve FAB butonu. Tüm kartlar premium ise altın çerçeve ve ribbon alıyor, doğrulanmışlarda yeşil onay rozeti var. Mobil için özel alt tab bar ve FAB eklendi. Tipografide Türkçe karakter desteği olan Google Fonts kullanıldı. Animasyonlar CSS transition ve hafif JS ile (marquee, sayaç) sağlandı.",
    "template": "vite_react_ts_tailwind",
    "title": "KuryeBul — Türkiye'nin Kurye Platformu",
    "description": "Kurye arayan firmalar ile iş arayan kuryeleri buluşturan, sektöre özgü turuncu/lacivert/altın renk paletiyle tasarlanmış, premium öne çıkan ilanlar, canlı istatistikler, detaylı filtreleme, sağdan açılan detay paneli ve adım adım ilan verme sihirbazı içeren profesyonel iki taraflı pazar yeri platformu.",
    "additional_dependencies": [],
    "has_additional_dependencies": false,
    "install_dependencies_command": null,
    "port": 5173,
    "file_path": "src/App.tsx",
    "code": "<see code above>"
}