import {
  db,
  usersTable,
  vehiclesTable,
  soldVehiclesTable,
  popularVehiclesTable,
  servicesTable,
  pricingPackagesTable,
  testimonialsTable,
  siteSettingsTable,
  faqItemsTable,
} from "@workspace/db";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Admin user
  const existing = await db.select().from(usersTable);
  if (existing.length === 0) {
    const hash = await bcrypt.hash("admin123", 10);
    await db.insert(usersTable).values({ username: "admin", passwordHash: hash, role: "admin" });
    console.log("Created admin user (password: admin123)");
  }

  // Vehicles
  await db.execute(sql`TRUNCATE vehicles RESTART IDENTITY CASCADE`);
  await db.insert(vehiclesTable).values([
    {
      make: "BMW", model: "X5 xDrive40i", year: 2023, engine: "3.0L I6", fuel: "Petrol", transmission: "Automatic",
      mileage: 12000, location: "Germany", price: 58900, description: "Pristine condition, full service history",
      status: "available", imageUrl: "/images/bmw-x5.jpg", badge: "Premium", isPopular: true, sortOrder: 1
    },
    {
      make: "Mercedes-Benz", model: "GLE 350d", year: 2022, engine: "3.0L V6", fuel: "Diesel", transmission: "Automatic",
      mileage: 28000, location: "Germany", price: 62500, description: "AMG Sport package, panoramic roof",
      status: "available", imageUrl: "/images/gle.jpg", badge: "Hot Deal", isPopular: true, sortOrder: 2
    },
    {
      make: "Audi", model: "Q7 55 TFSI", year: 2023, engine: "3.0L V6", fuel: "Petrol", transmission: "Automatic",
      mileage: 8500, location: "Germany", price: 71200, description: "S-Line package, 7-seater, virtual cockpit",
      status: "available", imageUrl: "/images/audi-q7.jpg", badge: "New Arrival", isPopular: false, sortOrder: 3
    },
    {
      make: "Porsche", model: "Cayenne GTS", year: 2022, engine: "4.0L V8", fuel: "Petrol", transmission: "Automatic",
      mileage: 19000, location: "Germany", price: 89500, description: "Sport Chrono package, air suspension",
      status: "available", imageUrl: "/images/cayenne.jpg", badge: null, isPopular: true, sortOrder: 4
    },
    {
      make: "Volkswagen", model: "Touareg 3.0 TDI", year: 2022, engine: "3.0L V6", fuel: "Diesel", transmission: "Automatic",
      mileage: 35000, location: "Czech Republic", price: 47800, description: "R-Line, Dynaudio sound system",
      status: "available", imageUrl: "/images/touareg.jpg", badge: null, isPopular: false, sortOrder: 5
    },
    {
      make: "Volvo", model: "XC90 Recharge", year: 2023, engine: "2.0L Plug-in Hybrid", fuel: "Hybrid", transmission: "Automatic",
      mileage: 6000, location: "Germany", price: 76000, description: "7-seater, air suspension, Bowers & Wilkins audio",
      status: "reserved", imageUrl: "/images/xc90.jpg", badge: "Reserved", isPopular: false, sortOrder: 6
    },
  ]);

  // Sold vehicles
  await db.execute(sql`TRUNCATE sold_vehicles RESTART IDENTITY CASCADE`);
  await db.insert(soldVehiclesTable).values([
    { make: "BMW", model: "5 Series 530i", year: 2021, finalPrice: 39900, purchaseCountry: "Germany", deliveryStatus: "Delivered", deliveryDate: "2024-11", imageUrl: "/images/bmw-5.jpg" },
    { make: "Mercedes-Benz", model: "C 300 AMG", year: 2022, finalPrice: 52000, purchaseCountry: "Germany", deliveryStatus: "Delivered", deliveryDate: "2024-10", imageUrl: "/images/c300.jpg" },
    { make: "Audi", model: "A6 3.0 TDI", year: 2020, finalPrice: 34500, purchaseCountry: "Germany", deliveryStatus: "Delivered", deliveryDate: "2024-09", imageUrl: "/images/audi-a6.jpg" },
    { make: "Porsche", model: "Macan S", year: 2021, finalPrice: 62000, purchaseCountry: "Germany", deliveryStatus: "Delivered", deliveryDate: "2024-08", imageUrl: "/images/macan.jpg" },
  ]);

  // Popular vehicles
  await db.execute(sql`TRUNCATE popular_vehicles RESTART IDENTITY CASCADE`);
  await db.insert(popularVehiclesTable).values([
    { make: "BMW", model: "X5", imageUrl: "/images/bmw-x5-pop.jpg", priceRange: "€45,000 – €75,000", estimatedDelivery: "3–4 weeks", description: "Most requested SUV — superb comfort and German precision.", sortOrder: 1 },
    { make: "Mercedes-Benz", model: "GLE", imageUrl: "/images/gle-pop.jpg", priceRange: "€52,000 – €85,000", estimatedDelivery: "3–5 weeks", description: "Flagship luxury SUV with class-leading interior quality.", sortOrder: 2 },
    { make: "Audi", model: "Q7", imageUrl: "/images/q7-pop.jpg", priceRange: "€48,000 – €80,000", estimatedDelivery: "2–4 weeks", description: "Seven-seat premium SUV with cutting-edge technology.", sortOrder: 3 },
    { make: "Porsche", model: "Cayenne", imageUrl: "/images/cayenne-pop.jpg", priceRange: "€70,000 – €120,000", estimatedDelivery: "4–6 weeks", description: "The benchmark for performance SUVs — unmatched driving dynamics.", sortOrder: 4 },
  ]);

  // Services
  await db.execute(sql`TRUNCATE services RESTART IDENTITY CASCADE`);
  await db.insert(servicesTable).values([
    { iconName: "Search", titleEn: "Vehicle Sourcing", titlePl: "Wyszukiwanie pojazdów", titleRu: "Поиск автомобилей", descriptionEn: "We find your exact vehicle anywhere in Europe — any make, model, spec and color.", descriptionPl: "Wyszukujemy dokładnie ten pojazd, którego szukasz w całej Europie.", descriptionRu: "Найдём нужный автомобиль в любой точке Европы.", sortOrder: 1 },
    { iconName: "FileCheck", titleEn: "Documentation", titlePl: "Dokumentacja", titleRu: "Документация", descriptionEn: "Full legal compliance — customs clearance, VAT, homologation and registration support.", descriptionPl: "Pełna obsługa prawna — odprawa celna, VAT, homologacja i rejestracja.", descriptionRu: "Полное юридическое сопровождение — таможня, НДС, гомологация и регистрация.", sortOrder: 2 },
    { iconName: "Truck", titleEn: "Transport & Logistics", titlePl: "Transport i Logistyka", titleRu: "Транспорт и логистика", descriptionEn: "Door-to-door delivery with real-time tracking across all of Eastern and Western Europe.", descriptionPl: "Dostawa od drzwi do drzwi z śledzeniem w czasie rzeczywistym.", descriptionRu: "Доставка от двери до двери с отслеживанием в реальном времени.", sortOrder: 3 },
    { iconName: "Shield", titleEn: "Inspection & Warranty", titlePl: "Inspekcja i Gwarancja", titleRu: "Инспекция и гарантия", descriptionEn: "Independent pre-purchase inspection and vehicle history report included on every order.", descriptionPl: "Niezależna inspekcja przed zakupem i raport historii pojazdu w każdym zamówieniu.", descriptionRu: "Независимая предпродажная инспекция и отчёт об истории автомобиля.", sortOrder: 4 },
    { iconName: "Calculator", titleEn: "Cost Calculation", titlePl: "Kalkulacja kosztów", titleRu: "Расчёт стоимости", descriptionEn: "Transparent breakdown of all costs: vehicle price, VAT, customs, delivery and our service fee.", descriptionPl: "Przejrzysty podział kosztów: cena pojazdu, VAT, cło, dostawa i nasze wynagrodzenie.", descriptionRu: "Прозрачный расчёт всех затрат: цена авто, НДС, таможня, доставка и наш сбор.", sortOrder: 5 },
    { iconName: "Headphones", titleEn: "After-Sales Support", titlePl: "Wsparcie posprzedażowe", titleRu: "Послепродажная поддержка", descriptionEn: "Dedicated manager available 7 days a week throughout the entire purchase process.", descriptionPl: "Dedykowany opiekun dostępny 7 dni w tygodniu przez cały proces zakupu.", descriptionRu: "Персональный менеджер доступен 7 дней в неделю на протяжении всего процесса.", sortOrder: 6 },
  ]);

  // Pricing packages
  await db.execute(sql`TRUNCATE pricing_packages RESTART IDENTITY CASCADE`);
  await db.insert(pricingPackagesTable).values([
    { nameEn: "Essential", namePl: "Podstawowy", nameRu: "Базовый", price: 500, currency: "EUR", features: ["Vehicle sourcing", "Basic documentation", "Transport coordination", "1 revision"], isPopular: false, sortOrder: 1 },
    { nameEn: "Professional", namePl: "Profesjonalny", nameRu: "Профессиональный", price: 900, currency: "EUR", features: ["Everything in Essential", "Pre-purchase inspection", "Full documentation & customs", "Transport to your door", "3 revisions", "Dedicated manager"], isPopular: true, sortOrder: 2 },
    { nameEn: "Premium", namePl: "Premium", nameRu: "Премиум", price: 1500, currency: "EUR", features: ["Everything in Professional", "Priority sourcing", "6-month post-delivery support", "Unlimited revisions", "VIP concierge service"], isPopular: false, sortOrder: 3 },
  ]);

  // Testimonials
  await db.execute(sql`TRUNCATE testimonials RESTART IDENTITY CASCADE`);
  await db.insert(testimonialsTable).values([
    { name: "Marek Kowalski", country: "Poland", vehicleName: "BMW X5 xDrive40i", rating: 5, content: "Exceptional service from start to finish. The team found exactly the spec I wanted in Germany and handled all the paperwork flawlessly. My X5 arrived in perfect condition.", isActive: true },
    { name: "Andrei Petrov", country: "Latvia", vehicleName: "Mercedes GLE 350d", rating: 5, content: "Fast, professional, and fully transparent about all costs. The cost calculator gave me an accurate estimate and the final price matched perfectly. Highly recommended!", isActive: true },
    { name: "Tomáš Novák", country: "Czech Republic", vehicleName: "Porsche Cayenne GTS", rating: 5, content: "I was sceptical about importing a Porsche, but the team made it completely stress-free. Every step was communicated clearly. My Cayenne arrived ahead of schedule.", isActive: true },
    { name: "Elena Müller", country: "Estonia", vehicleName: "Audi Q7 55 TFSI", rating: 5, content: "The whole process took just 3 weeks from order to delivery. The pre-purchase inspection gave me total peace of mind. Would absolutely use again for my next car.", isActive: true },
  ]);

  // Site settings
  await db.execute(sql`TRUNCATE site_settings RESTART IDENTITY CASCADE`);
  await db.insert(siteSettingsTable).values([
    // General
    { key: "general.company_name", value: "BOVAJA", label: "Company Name", group: "general" },
    // Contact
    { key: "contact.phone", value: "+370 600 00000", label: "Phone Number", group: "contact" },
    { key: "contact.email", value: "bovaja.auctions@gmail.com", label: "Email Address", group: "contact" },
    { key: "contact.address_line1", value: "Gariūnai Car Market, Site 309A", label: "Address Line 1", group: "contact" },
    { key: "contact.address_line2", value: "Gariūnų g. 49, Vilnius 02300", label: "Address Line 2", group: "contact" },
    { key: "contact.country", value: "Lithuania", label: "Country", group: "contact" },
    { key: "contact.maps_url", value: "https://maps.google.com/?q=Gariu%CC%B3nu%CC%B3+g.+49,+Vilnius", label: "Google Maps URL", group: "contact" },
    // Social
    { key: "social.whatsapp", value: "37060000000", label: "WhatsApp Number (digits only)", group: "social" },
    { key: "social.telegram", value: "bovaja", label: "Telegram Handle (without @)", group: "social" },
    { key: "social.viber", value: "37060000000", label: "Viber Number (digits only)", group: "social" },
    // Stats (homepage counters)
    { key: "stats.vehicles_delivered", value: "5000", label: "Vehicles Delivered", group: "stats" },
    { key: "stats.satisfaction_rate", value: "98", label: "Client Satisfaction Rate (%)", group: "stats" },
    { key: "stats.years_experience", value: "12", label: "Years of Experience", group: "stats" },
    { key: "stats.countries_served", value: "40", label: "Countries Served", group: "stats" },
    { key: "stats.total_value_billion", value: "2.4", label: "Total Value Sourced (€ billion)", group: "stats" },
    // Calculator
    { key: "calculator.service_fee", value: "500", label: "Service Fee (EUR)", group: "calculator" },
    { key: "calculator.delivery.western_europe", value: "800", label: "Delivery Price – Western Europe (EUR)", group: "calculator" },
    { key: "calculator.delivery.eastern_europe", value: "600", label: "Delivery Price – Eastern Europe (EUR)", group: "calculator" },
    { key: "calculator.vat.poland", value: "23", label: "VAT Rate – Poland (%)", group: "calculator" },
    { key: "calculator.vat.lithuania", value: "21", label: "VAT Rate – Lithuania (%)", group: "calculator" },
    { key: "calculator.vat.latvia", value: "21", label: "VAT Rate – Latvia (%)", group: "calculator" },
    { key: "calculator.vat.estonia", value: "24", label: "VAT Rate – Estonia (%)", group: "calculator" },
    { key: "calculator.vat.germany", value: "19", label: "VAT Rate – Germany (%)", group: "calculator" },
    { key: "calculator.vat.czech_republic", value: "21", label: "VAT Rate – Czech Republic (%)", group: "calculator" },
    { key: "calculator.belarus.customs_rate", value: "15", label: "Belarus Customs Rate (%)", group: "calculator" },
    { key: "calculator.belarus.excise_rate", value: "5", label: "Belarus Excise Rate (%)", group: "calculator" },
    { key: "calculator.belarus.registration_docs", value: "150", label: "Belarus Registration Docs Fee (EUR)", group: "calculator" },
  ]);

  // FAQ items
  await db.execute(sql`TRUNCATE faq_items RESTART IDENTITY CASCADE`);
  await db.insert(faqItemsTable).values([
    {
      questionEn: "How long does the import process take?",
      questionPl: "Jak długo trwa proces importu?",
      questionRu: "Сколько времени занимает процесс импорта?",
      questionLt: "Kiek laiko trunka importo procesas?",
      answerEn: "The typical import process takes 3–6 weeks from order confirmation to delivery, depending on the source country and destination. Germany to Lithuania usually takes 3–4 weeks; Japan or the US can take 5–8 weeks.",
      answerPl: "Typowy proces importu trwa od 3 do 6 tygodni od potwierdzenia zamówienia do dostawy, w zależności od kraju pochodzenia i miejsca docelowego.",
      answerRu: "Типичный процесс импорта занимает от 3 до 6 недель с момента подтверждения заказа до доставки, в зависимости от страны происхождения и пункта назначения.",
      answerLt: "Tipinis importo procesas trunka 3–6 savaites nuo užsakymo patvirtinimo iki pristatymo, priklausomai nuo kilmės šalies ir paskirties vietos.",
      sortOrder: 1, isActive: true,
    },
    {
      questionEn: "Which auction platforms do you work with?",
      questionPl: "Z jakimi platformami aukcyjnymi współpracujecie?",
      questionRu: "С какими аукционными платформами вы работаете?",
      questionLt: "Su kokiomis aukcionų platformomis dirbate?",
      answerEn: "We have direct access to BCA, OPENLANE, Auto1, Alcopa, Alphabet, Arval, Autorola, mobile.de, and many exclusive European dealer networks, as well as Copart, IAAI, and Manheim for US-sourced vehicles.",
      answerPl: "Mamy bezpośredni dostęp do BCA, OPENLANE, Auto1, Alcopa, Alphabet, Arval, Autorola, mobile.de i wielu ekskluzywnych sieci dealerskich, a także Copart, IAAI i Manheim.",
      answerRu: "У нас есть прямой доступ к BCA, OPENLANE, Auto1, Alcopa, Alphabet, Arval, Autorola, mobile.de и многим эксклюзивным дилерским сетям, а также к Copart, IAAI и Manheim.",
      answerLt: "Turime tiesioginę prieigą prie BCA, OPENLANE, Auto1, Alcopa, Alphabet, Arval, Autorola, mobile.de ir daugelio išskirtinių Europos platintojų tinklų.",
      sortOrder: 2, isActive: true,
    },
    {
      questionEn: "What documents do I need to import a car?",
      questionPl: "Jakie dokumenty są potrzebne do importu samochodu?",
      questionRu: "Какие документы нужны для импорта автомобиля?",
      questionLt: "Kokių dokumentų reikia automobilio importui?",
      answerEn: "Generally, a valid ID or passport and proof of address. We handle all export/import certificates, customs declarations, VAT documentation, homologation, and registration paperwork on your behalf.",
      answerPl: "Zazwyczaj wymagany jest ważny dowód tożsamości lub paszport i potwierdzenie adresu. Zajmujemy się całą dokumentacją celną, VAT, homologacją i rejestracją.",
      answerRu: "Как правило, действующий паспорт и подтверждение адреса. Мы берём на себя всю документацию по экспорту/импорту, таможню, НДС, гомологацию и регистрацию.",
      answerLt: "Paprastai reikalingas galiojantis asmens dokumentas ir gyvenamosios vietos patvirtinimas. Visus eksporto/importo sertifikatus, muitus, PVM ir registraciją tvarkome mes.",
      sortOrder: 3, isActive: true,
    },
    {
      questionEn: "What is your service fee?",
      questionPl: "Jaka jest wasza opłata serwisowa?",
      questionRu: "Какова ваша сервисная плата?",
      questionLt: "Kokia jūsų paslaugos kaina?",
      answerEn: "Our service fee starts from €500 for standard sourcing. Use our online calculator to get a full cost breakdown including VAT, customs duties, and delivery for your specific destination.",
      answerPl: "Nasza opłata serwisowa zaczyna się od 500 EUR za standardowe wyszukiwanie. Skorzystaj z naszego kalkulatora online, aby uzyskać pełny podział kosztów.",
      answerRu: "Наша сервисная плата начинается от 500 EUR за стандартный поиск. Воспользуйтесь нашим онлайн-калькулятором для полного расчёта стоимости.",
      answerLt: "Mūsų paslaugos mokestis prasideda nuo 500 EUR už standartinę paiešką. Naudokite mūsų skaičiuoklę pilnai išlaidų specifikacijai gauti.",
      sortOrder: 4, isActive: true,
    },
    {
      questionEn: "Can I inspect the vehicle before purchase?",
      questionPl: "Czy mogę obejrzeć pojazd przed zakupem?",
      questionRu: "Могу ли я осмотреть автомобиль перед покупкой?",
      questionLt: "Ar galiu apžiūrėti transporto priemonę prieš pirkimą?",
      answerEn: "Yes. We arrange a professional pre-purchase inspection by certified independent mechanics at the vehicle's location. A full inspection report is included with every order.",
      answerPl: "Tak. Organizujemy profesjonalną inspekcję przedsprzedażową przez certyfikowanych niezależnych mechaników w miejscu, gdzie znajduje się pojazd.",
      answerRu: "Да. Мы организуем профессиональную предпродажную инспекцию сертифицированными независимыми механиками по месту нахождения автомобиля.",
      answerLt: "Taip. Organizuojame profesionalią priešpirkinę patikrą sertifikuotų nepriklausomų mechanikų transporto priemonės vietoje.",
      sortOrder: 5, isActive: true,
    },
    {
      questionEn: "How are customs and taxes handled?",
      questionPl: "Jak obsługiwane są cła i podatki?",
      questionRu: "Как обрабатываются таможня и налоги?",
      questionLt: "Kaip tvarkomi muitai ir mokesčiai?",
      answerEn: "We calculate all estimated duties and taxes upfront using our online calculator. Our team handles the full customs clearance process — you pay no hidden fees. All amounts are agreed before the order is placed.",
      answerPl: "Obliczamy wszystkie szacowane cła i podatki z góry za pomocą naszego kalkulatora online. Nasz zespół zajmuje się pełną odprawą celną — bez ukrytych opłat.",
      answerRu: "Мы рассчитываем все предполагаемые пошлины и налоги заранее через онлайн-калькулятор. Наша команда берёт на себя полное таможенное оформление — без скрытых платежей.",
      answerLt: "Visus numatomus muitus ir mokesčius apskaičiuojame iš anksto naudodami mūsų skaičiuoklę. Mūsų komanda atlieka visą muitinio įforminimo procesą — jokių paslėptų mokesčių.",
      sortOrder: 6, isActive: true,
    },
    {
      questionEn: "Do you offer delivery to my city?",
      questionPl: "Czy oferujecie dostawę do mojego miasta?",
      questionRu: "Предлагаете ли вы доставку в мой город?",
      questionLt: "Ar siūlote pristatymą į mano miestą?",
      answerEn: "Yes, we offer door-to-door delivery across all of Europe, including Poland, Lithuania, Latvia, Estonia, Belarus, and beyond. Delivery costs depend on the destination and are shown in the calculator.",
      answerPl: "Tak, oferujemy dostawę od drzwi do drzwi w całej Europie, w tym do Polski, Litwy, Łotwy, Estonii, Białorusi i innych krajów.",
      answerRu: "Да, мы предлагаем доставку «от двери до двери» по всей Европе, включая Польшу, Литву, Латвию, Эстонию, Беларусь и другие страны.",
      answerLt: "Taip, siulome nuo duru iki duru pristatymą visoje Europoje, iskaitant Lenkija, Lietuva, Latvija, Estija, Baltarusija ir kitas salis.",
      sortOrder: 7, isActive: true,
    },
    {
      questionEn: "What happens after the car is delivered?",
      questionPl: "Co się dzieje po dostawie samochodu?",
      questionRu: "Что происходит после доставки автомобиля?",
      questionLt: "Kas nutinka po automobilio pristatymo?",
      answerEn: "After delivery, your dedicated manager remains available to help with any post-delivery questions. We also assist with local registration if needed.",
      answerPl: "Po dostawie Twój dedykowany opiekun pozostaje do dyspozycji w celu pomocy z wszelkimi pytaniami. Pomagamy również w lokalnej rejestracji, jeśli jest potrzebna.",
      answerRu: "После доставки ваш персональный менеджер остаётся на связи для ответа на любые вопросы. Мы также помогаем с местной регистрацией при необходимости.",
      answerLt: "Po pristatymo jūsų paskirtas vadybininkas lieka pasiekiamas bet kokiais klausimais. Taip pat padedame su vietiniu registravimu, jei reikia.",
      sortOrder: 8, isActive: true,
    },
  ]);

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
