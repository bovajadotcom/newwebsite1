import app from "./app";
import { logger } from "./lib/logger";
import { db, usersTable, vehiclesTable, popularVehiclesTable } from "@workspace/db";
import type { InsertVehicle, InsertPopularVehicle } from "@workspace/db";
import bcrypt from "bcryptjs";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function seedIfEmpty() {
  try {
    const users = await db.select().from(usersTable);
    if (users.length === 0) {
      const hash = await bcrypt.hash("admin123", 10);
      await db.insert(usersTable).values({ username: "admin", passwordHash: hash, role: "admin" });
      logger.info("Seeded admin user");
    }

    const vehicles = await db.select().from(vehiclesTable);
    if (vehicles.length === 0) {
      const rows: InsertVehicle[] = [
        { make: "Peugeot", model: "3008", year: 2021, engine: "1.5", fuel: "Diesel", transmission: "Automatic", mileage: 118204, location: "Drizzona, Italy", price: 14970, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/4821473/general/b1cbf87e-5ebb-4cdf-935c-a3fdadcfeff0.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "Volkswagen", model: "Tiguan", year: 2020, engine: "1.5", fuel: "Petrol", transmission: "Automatic", mileage: 137050, location: "Hoogeveen, Netherlands", price: 20799, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/4817784/general/0bb6b8e9-4e48-4b84-855e-abbcd5391473.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "Audi", model: "A3 Sportback G-Tron 30", year: 2020, engine: "1.5", fuel: "Petrol", transmission: "Automatic", mileage: 201699, location: "Drizzona, Italy", price: 10755, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/4807210/general/40da2af8-18a5-46f4-a5b1-e7b95147005e.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "Peugeot", model: "5008", year: 2019, engine: "1.2", fuel: "Petrol", transmission: "Manual", mileage: 226000, location: "Moenchengladbach, Germany", price: 9299, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/4868855/general/14f9a248-2602-48bc-bc59-9e58476ed52a.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "DS7", model: "Crossback", year: 2017, engine: "1.5", fuel: "Diesel", transmission: "Automatic", mileage: 160400, location: "Bilzen, Belgium", price: 17475, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/4909071/general/a818dc51-9018-4e70-8ae6-a19242fda9fe.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "Peugeot", model: "508 SW GT", year: 2019, engine: "1.2", fuel: "Petrol", transmission: "Automatic", mileage: 134942, location: "INGRANDES SUR VIENNE, France", price: 12220, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/4932010/general/96396e58-4ca8-484e-a0df-d427ed2cdc99.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "Opel", model: "Grandland", year: 2019, engine: "1.2", fuel: "Petrol", transmission: "Automatic", mileage: 163939, location: "Hoogeveen, Netherlands", price: 9750, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/4992314/general/6118ca37-569d-47e2-bf9d-2c15d304ab64.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "Nissan", model: "Leaf", year: 2019, engine: "62 kWh", fuel: "Electric", transmission: "Automatic", mileage: 134011, location: "Alblasserdam, Netherlands", price: 10999, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/5026029/general/bfc8dd00-ad9b-4600-8e01-97eb86880e60.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "BMW", model: "2", year: 2020, engine: "1.5", fuel: "Diesel", transmission: "Automatic", mileage: 100325, location: "Bilzen, Belgium", price: 20699, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/5212772/general/73b4ac29-0ea3-4e1d-aa46-35383238e14e.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "Opel", model: "Grandland", year: 2020, engine: "1.2", fuel: "Petrol", transmission: "Automatic", mileage: 170259, location: "Drizzona, Italy", price: 7775, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/5224197/general/fce27594-2225-470a-bfa9-910596727330.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "Renault", model: "Scenic", year: 2016, engine: "1.7", fuel: "Diesel", transmission: "Automatic", mileage: 176677, location: "Bilzen, Belgium", price: 11499, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/5342134/general/109fe816-2258-4fba-9778-07c8c2aa288c.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "Renault", model: "Kadjar", year: 2022, engine: "1.3", fuel: "Petrol", transmission: "Automatic", mileage: 196943, location: "France", price: 9999, status: "auction", imageUrl: "https://i.pinimg.com/736x/56/26/87/562687b1fb28d3400c54a289c945245a.jpg", sortOrder: 0, auctionEndDate: "2026-07-20", auctionStartDate: "2026-07-16", estimatedWinningPrice: 9999, auctionPlatform: "BCA", photos: [] },
        { make: "Renault", model: "Kadjar", year: 2020, engine: "1.5", fuel: "Diesel", transmission: "Automatic", mileage: 187000, location: "Vilnius, Lithuania", price: 9100, status: "available", imageUrl: "https://i.pinimg.com/736x/b3/d4/0f/b3d40f9f162056ad17340faf3756e36b.jpg", sortOrder: 0, photos: [] },
        { make: "Volkswagen", model: "Tiguan", year: 2020, engine: "1.5", fuel: "Petrol", transmission: "Automatic", mileage: 137050, location: "Hoogeveen, Netherlands", price: 20799, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/4817784/general/0bb6b8e9-4e48-4b84-855e-abbcd5391473.jpg", sortOrder: 0, deliveredTo: "Belarus", photos: [] },
        { make: "Renault", model: "Megane", year: 2020, engine: "1.5", fuel: "Diesel", transmission: "Automatic", mileage: 163000, location: "Vilnius, Lithuania", price: 9438, status: "available", imageUrl: "https://autoplius-img.dgn.lt/ann_3_400172132/renault-megane-1-5-l-universalas-2020-dyzelinas-0.jpg", sortOrder: 0, photos: [] },
        { make: "Peugeot", model: "3008", year: 2020, engine: "1.5", fuel: "Petrol", transmission: "Automatic", mileage: 184000, location: "Vilnius, Lithuania", price: 15125, status: "available", imageUrl: "https://i.pinimg.com/736x/61/ff/43/61ff43263d5ffb74b76ec7b86fd674b4.jpg", sortOrder: 0, photos: [] },
        { make: "Peugeot", model: "2008", year: 2021, engine: "1.5", fuel: "Petrol", transmission: "Automatic", mileage: 126000, location: "Beauvais, France", price: 8299, status: "sold", imageUrl: "https://autoplius-img.dgn.lt/ann_3_398691546/peugeot-2008-1-2-l-visureigis-krosoveris-2021-benzinas-0.jpg", sortOrder: 0, deliveredTo: "Kaunas, Lithuania", photos: [] },
        { make: "Citroen", model: "Grand C4 Picasso", year: 2009, engine: "2.0", fuel: "Petrol", transmission: "Automatic", mileage: 230000, location: "Vilnius, Lithuania", price: 2100, status: "available", imageUrl: "https://autoplius-img.dgn.lt/ann_3_396341456/citroen-grand-c4-picasso-2-0-l-vienaturis-2009-benzinas-0.jpg", sortOrder: 0, photos: [] },
        { make: "Renault", model: "Kadjar", year: 2019, engine: "1.5", fuel: "Diesel", transmission: "Manual", mileage: 146000, location: "Vilnius, Lithuania", price: 14036, status: "available", imageUrl: "https://autoplius-img.dgn.lt/ann_3_400775410/renault-kadjar-1-5-l-visureigis-krosoveris-2019-dyzelinas-0.jpg", sortOrder: 0, photos: [] },
        { make: "Peugeot", model: "5008", year: 2016, engine: "1.5", fuel: "Diesel", transmission: "Automatic", mileage: 165000, location: "Vilnius, Lithuania", price: 8470, status: "available", imageUrl: "https://autoplius-img.dgn.lt/ann_3_401436354/peugeot-5008-1-6-l-visureigis-krosoveris-2016-dyzelinas-0.jpg", sortOrder: 0, photos: [] },
        { make: "Nissan", model: "Qashqai", year: 2014, engine: "1.6", fuel: "Diesel", transmission: "Manual", mileage: 225000, location: "Vilnius, Lithuania", price: 7018, status: "available", imageUrl: "https://autoplius-img.dgn.lt/ann_3_397025272/nissan-qashqai-1-6-l-visureigis-krosoveris-2014-dyzelinas-0.jpg", sortOrder: 0, photos: [] },
        { make: "Citroen", model: "C4 Cactus", year: 2019, engine: "1.2", fuel: "Petrol", transmission: "Automatic", mileage: 155000, location: "Vilnius, Lithuania", price: 10043, status: "available", imageUrl: "https://autoplius-img.dgn.lt/ann_3_401841820/citroen-c4-cactus-1-2-l-visureigis-krosoveris-2019-benzinas-0.jpg", sortOrder: 0, photos: [] },
        { make: "Ford", model: "Kuga", year: 2017, engine: "1.5", fuel: "Diesel", transmission: "Automatic", mileage: 286576, location: "Drizzona, Italy", price: 8399, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/4787760/general/0c9f19d9-714a-4047-9846-682cca8d7fe3.jpg", sortOrder: 3, deliveredTo: "Belarus", photos: [] },
        { make: "Mercedes-Benz", model: "A 180 GTS", year: 2018, engine: "1.3", fuel: "Petrol", transmission: "Automatic", mileage: 77720, location: "Bilzen, Belgium", price: 20675, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/4779035/general/b8ea3268-b32d-4145-8902-a2a55bff1ef0.jpg", sortOrder: 4, deliveredTo: "Belarus", photos: [] },
        { make: "Volkswagen", model: "Passat Variant", year: 2021, engine: "1.5", fuel: "Petrol", transmission: "Automatic", mileage: 174195, location: "Barneveld, Netherlands", price: 15805, status: "sold", imageUrl: "https://images.openlane.eu/carimgs/4767419/general/462cef03-04ab-4638-aed9-131f03834f1f.jpg", sortOrder: 5, deliveredTo: "Belarus", photos: [] },
      ];
      await db.insert(vehiclesTable).values(rows);
      logger.info({ count: rows.length }, "Seeded vehicles");
    }

    const popular = await db.select().from(popularVehiclesTable);
    if (popular.length === 0) {
      const rows: InsertPopularVehicle[] = [
        { make: "Peugeot", model: "508", imageUrl: "https://i.pinimg.com/736x/3a/1b/e5/3a1be5f277672aba7509f1b4eeed1afe.jpg", priceRange: "€8,000 – €10,000", estimatedDelivery: "4–6 weeks", description: "Peugeot 508", sortOrder: 4, engine: "1.5", fuel: "Petrol", mileage: 50000, photos: [] },
        { make: "Peugeot", model: "308", imageUrl: "https://i.pinimg.com/736x/25/e2/c2/25e2c2f11e897eefef4c88faea5bb1ab.jpg", priceRange: "€8,000 – €10,000", estimatedDelivery: "4–6 weeks", description: "Peugeot 308", sortOrder: 4, engine: "1.5", fuel: "Petrol", mileage: 50000, photos: [] },
        { make: "BMW", model: "X1", imageUrl: "https://i.pinimg.com/736x/62/e5/bd/62e5bd60b04f8724fee445ffca41a93d.jpg", priceRange: "€8,000 – €10,000", estimatedDelivery: "4–6 weeks", description: "BMW X1", sortOrder: 4, engine: "1.5", fuel: "Petrol", mileage: 50000, photos: [] },
        { make: "Volvo", model: "XC40", imageUrl: "https://i.pinimg.com/736x/58/f2/3a/58f23a2b2feb4ebb9a0d441ab421b112.jpg", priceRange: "€8,000 – €10,000", estimatedDelivery: "4–6 weeks", description: "Volvo XC40", sortOrder: 4, engine: "1.5", fuel: "Petrol", mileage: 50000, photos: [] },
        { make: "Citroen", model: "C4", imageUrl: "https://i.pinimg.com/736x/9b/77/9f/9b779fd921565c20f74066ba44a89fd3.jpg", priceRange: "€8,000 – €10,000", estimatedDelivery: "4–6 weeks", description: "Citroen C4", sortOrder: 4, engine: "1.5", fuel: "Petrol", mileage: 50000, photos: [] },
        { make: "Renault", model: "Grand Scenic", imageUrl: "https://i.pinimg.com/736x/4c/65/b1/4c65b10b85143f6c3615b5072e1aa29f.jpg", priceRange: "€8,000 – €10,000", estimatedDelivery: "4–6 weeks", description: "Renault Grand Scenic", sortOrder: 4, year: 2022, engine: "1.5", fuel: "Petrol", transmission: "Manual", mileage: 50000, photos: [] },
        { make: "Renault", model: "Kadjar", imageUrl: "https://i.pinimg.com/736x/ec/2d/ab/ec2dabda6b067528d49d52acf1594701.jpg", priceRange: "€8,000 – €10,000", estimatedDelivery: "4–6 weeks", description: "Renault Kadjar", sortOrder: 4, engine: "1.5", fuel: "Petrol", mileage: 50000, photos: [] },
        { make: "Renault", model: "Clio", imageUrl: "https://i.pinimg.com/736x/30/fb/cc/30fbcc65ff5ff239451ae3a450e48dcf.jpg", priceRange: "€8,000 – €10,000", estimatedDelivery: "4–6 weeks", description: "Renault Clio", sortOrder: 4, engine: "1.5", fuel: "Petrol", mileage: 50000, photos: [] },
        { make: "Peugeot", model: "3008", imageUrl: "https://i.pinimg.com/736x/25/43/32/254332ab81edc9c833fa2db2fa6349fa.jpg", priceRange: "€8,000 – €10,000", estimatedDelivery: "4–6 weeks", description: "Peugeot 3008", sortOrder: 4, engine: "1.5", fuel: "Petrol", mileage: 50000, photos: [] },
        { make: "Peugeot", model: "5008", imageUrl: "https://i.pinimg.com/736x/38/a7/a9/38a7a99914d7fcc84542527ff617233d.jpg", priceRange: "€8,000 – €10,000", estimatedDelivery: "4–6 weeks", description: "Peugeot 5008", sortOrder: 4, engine: "1.5", fuel: "Petrol", mileage: 50000, photos: [] },
      ];
      await db.insert(popularVehiclesTable).values(rows);
      logger.info({ count: rows.length }, "Seeded popular vehicles");
    }
  } catch (err) {
    logger.error({ err }, "Startup seed failed");
  }
}

app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  await seedIfEmpty();
});
