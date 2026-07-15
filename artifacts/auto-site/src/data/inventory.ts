// ============================================================
// 🚗 ДАННЫЕ АВТОМОБИЛЕЙ — ВСЕ АВТО САЙТА
// ============================================================
// Три массива:
//   stockVehicles   — авто В НАЛИЧИИ (страница /inventory)
//   soldVehicles    — ПРОДАННЫЕ авто (вкладка "Recently Sold")
//   popularVehicles — САМЫЕ ПОПУЛЯРНЫЕ (страница /popular и раздел в /inventory)
//
// Как добавить новое авто в наличии:
//   1. Скопируйте один объект { id: "v1", ... }
//   2. Измените id на уникальный (v9, v10 и т.д.)
//   3. Заполните все поля
//   4. Для image: положите фото в папку artifacts/auto-site/public/
//      и укажите имя файла (например "my-car.png")
//
// Статусы (поле status):
//   "available" — в наличии (зелёный бейдж)
//   "reserved"  — забронирован (синий бейдж)
//   "sold"      — продан (серый бейдж)
//
// Типы топлива (поле fuel):
//   "Petrol" | "Diesel" | "Hybrid" | "Electric"
//
// Коробка передач (поле transmission):
//   "Automatic" | "Manual"
// ============================================================

export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";
export type Transmission = "Automatic" | "Manual";
export type VehicleStatus = "available" | "reserved" | "auction" | "sold";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  fuel: FuelType;
  transmission: Transmission;
  mileage: number; // km
  location: string;
  price: number; // USD
  description: string;
  status: VehicleStatus;
  image: string; // public asset path (use BASE_URL prefix in components)
  badge?: string;
}

export interface SoldVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  finalPrice?: number;
  purchaseCountry: string;
  deliveryStatus: string;
  deliveryDate?: string;
  image: string;
}

export interface PopularVehicle {
  id: string;
  make: string;
  model: string;
  image: string;
  priceRange: string;
  estimatedDelivery: string;
  description: string;
}

// ── АВТО В НАЛИЧИИ ──────────────────────────────────────
// Отображаются на странице /inventory во вкладке "In Stock"
// Добавляйте новые авто в этот список
export const stockVehicles: Vehicle[] = [
  {
    id: "v1",
    make: "Porsche",
    model: "Cayenne S",
    year: 2022,
    engine: "2.9L Twin-Turbo V6",
    fuel: "Petrol",
    transmission: "Automatic",
    mileage: 18500,
    location: "Tokyo, Japan",
    price: 89900,
    description: "One-owner, full dealer history, panoramic roof, adaptive air suspension. Imported directly from Japan.",
    status: "available",
    image: "vehicle-1.png",
    badge: "New Arrival",
  },
  {
    id: "v2",
    make: "BMW",
    model: "M5 Competition",
    year: 2021,
    engine: "4.4L Twin-Turbo V8",
    fuel: "Petrol",
    transmission: "Automatic",
    mileage: 24000,
    location: "Hamburg, Germany",
    price: 94500,
    description: "M xDrive, carbon ceramic brakes, Merino leather interior. Clean German title.",
    status: "available",
    image: "vehicle-2.png",
    badge: "Featured",
  },
  {
    id: "v3",
    make: "Mercedes-Benz",
    model: "GLE 450 4MATIC",
    year: 2023,
    engine: "3.0L Inline-6 Turbo",
    fuel: "Hybrid",
    transmission: "Automatic",
    mileage: 8200,
    location: "Stuttgart, Germany",
    price: 112000,
    description: "E-Active Body Control, MBUX widescreen, head-up display, Burmester surround sound.",
    status: "available",
    image: "vehicle-3.png",
  },
  {
    id: "v4",
    make: "Toyota",
    model: "Land Cruiser 300",
    year: 2022,
    engine: "3.5L Twin-Turbo V6",
    fuel: "Petrol",
    transmission: "Automatic",
    mileage: 32000,
    location: "Osaka, Japan",
    price: 78500,
    description: "7-seat configuration, E-KDSS suspension, multi-terrain monitor. Japan domestic market spec.",
    status: "available",
    image: "vehicle-4.png",
    badge: "High Demand",
  },
  {
    id: "v5",
    make: "Lexus",
    model: "LX 600 F Sport",
    year: 2023,
    engine: "3.5L Twin-Turbo V6",
    fuel: "Petrol",
    transmission: "Automatic",
    mileage: 5600,
    location: "Nagoya, Japan",
    price: 139000,
    description: "F Sport trim, Mark Levinson audio, 4-zone climate, massage seats. Near new condition.",
    status: "available",
    image: "vehicle-1.png",
  },
  {
    id: "v6",
    make: "Audi",
    model: "RS6 Avant",
    year: 2021,
    engine: "4.0L TFSI V8",
    fuel: "Hybrid",
    transmission: "Automatic",
    mileage: 41000,
    location: "Munich, Germany",
    price: 87000,
    description: "Carbon optics package, dynamic ride control, ceramic brakes. Full Audi service history.",
    status: "reserved",
    image: "vehicle-2.png",
    badge: "Reserved",
  },
  {
    id: "v7",
    make: "Range Rover",
    model: "Sport HSE Dynamic",
    year: 2022,
    engine: "3.0L Inline-6 Turbo",
    fuel: "Hybrid",
    transmission: "Automatic",
    mileage: 19800,
    location: "London, UK",
    price: 96500,
    description: "Head-up display, Meridian sound system, terrain response 2, panoramic sunroof.",
    status: "available",
    image: "vehicle-3.png",
  },
  {
    id: "v8",
    make: "Tesla",
    model: "Model S Plaid",
    year: 2022,
    engine: "Electric Tri-Motor",
    fuel: "Electric",
    transmission: "Automatic",
    mileage: 22000,
    location: "California, USA",
    price: 89000,
    description: "1020hp, 0-60mph in 1.99s, full self-driving capability, 21-inch Arachnid wheels.",
    status: "available",
    image: "vehicle-4.png",
    badge: "Electric",
  },
];

// ── ПРОДАННЫЕ АВТО ──────────────────────────────────────
// Отображаются на странице /inventory во вкладке "Recently Sold"
// Добавляйте сюда авто после продажи (или удаляйте старые записи)
export const soldVehicles: SoldVehicle[] = [
  { id: "s2", make: "BMW", model: "M3 Competition", year: 2022, finalPrice: 82000, purchaseCountry: "Germany", deliveryStatus: "Delivered", deliveryDate: "Feb 2024", image: "vehicle-2.png" },
  { id: "s3", make: "Mercedes-Benz", model: "G63 AMG", year: 2020, purchaseCountry: "UAE", deliveryStatus: "Delivered", deliveryDate: "Jan 2024", image: "vehicle-3.png" },
  { id: "s4", make: "Lexus", model: "GX 460", year: 2021, finalPrice: 58000, purchaseCountry: "Japan", deliveryStatus: "Delivered", deliveryDate: "Dec 2023", image: "vehicle-4.png" },
  { id: "s5", make: "Audi", model: "Q8 S-Line", year: 2022, finalPrice: 76000, purchaseCountry: "Germany", deliveryStatus: "Delivered", deliveryDate: "Nov 2023", image: "vehicle-1.png" },
  { id: "s6", make: "Toyota", model: "Alphard Executive", year: 2022, purchaseCountry: "Japan", deliveryStatus: "Delivered", deliveryDate: "Oct 2023", image: "vehicle-2.png" },
];

// ── САМЫЕ ПОПУЛЯРНЫЕ АВТО ───────────────────────────────
// Отображаются на странице /popular и в разделе "Most Popular" на /inventory
// Здесь нет цены в USD — только диапазон и описание
export const popularVehicles: PopularVehicle[] = [
  { id: "p1", make: "Toyota", model: "Land Cruiser 300", image: "vehicle-4.png", priceRange: "€75,000 – €95,000", estimatedDelivery: "6–9 weeks", description: "The most in-demand import from Japan. Exceptional reliability, off-road capability, and resale value." },
  { id: "p2", make: "Porsche", model: "Cayenne / Cayenne S", image: "vehicle-1.png", priceRange: "€80,000 – €140,000", estimatedDelivery: "4–7 weeks", description: "Premium German SUV with outstanding performance and prestige. Popular from both Germany and Japan." },
  { id: "p3", make: "BMW", model: "M5 / M3 Competition", image: "vehicle-2.png", priceRange: "€75,000 – €110,000", estimatedDelivery: "4–6 weeks", description: "The benchmark sports sedan. German market vehicles offer the widest spec availability." },
  { id: "p4", make: "Mercedes-Benz", model: "G63 AMG / GLE", image: "vehicle-3.png", priceRange: "€90,000 – €220,000", estimatedDelivery: "5–8 weeks", description: "Iconic SUV lineup. G-Class commands a premium worldwide; GLE remains the #1 choice for families." },
  { id: "p5", make: "Lexus", model: "LX 600 / GX 460", image: "vehicle-1.png", priceRange: "€55,000 – €145,000", estimatedDelivery: "6–10 weeks", description: "Toyota reliability in a premium package. Japan-spec LX600 is exceptionally difficult to source elsewhere." },
  { id: "p6", make: "Tesla", model: "Model S / Model X", image: "vehicle-4.png", priceRange: "€70,000 – €110,000", estimatedDelivery: "3–5 weeks", description: "The premier EV import. US-spec Teslas offer the most complete feature set and best pricing." },
];