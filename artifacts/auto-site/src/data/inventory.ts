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
// Все автомобили управляются через CMS — этот массив намеренно пуст.
// Данные всегда загружаются с /api/vehicles.
export const stockVehicles: Vehicle[] = [];

// ── ПРОДАННЫЕ АВТО ──────────────────────────────────────
// Отображаются на странице /inventory во вкладке "Recently Sold"
// Добавляйте сюда авто после продажи (или удаляйте старые записи)
export const soldVehicles: SoldVehicle[] = [];

// ── САМЫЕ ПОПУЛЯРНЫЕ АВТО ───────────────────────────────
// Все популярные модели управляются через CMS — этот массив намеренно пуст.
// Данные всегда загружаются с /api/popular-vehicles.
export const popularVehicles: PopularVehicle[] = [];