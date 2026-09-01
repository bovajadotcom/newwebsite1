--
-- PostgreSQL database dump
--

\restrict WE1eOlU42riAStq8setu2mlPz7uydSopsXA25VRc2PxNGHQSheuQrhgx06Oq3sV

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.articles (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text DEFAULT ''::text NOT NULL,
    content text DEFAULT ''::text NOT NULL,
    cover_image text DEFAULT ''::text NOT NULL,
    published_at timestamp with time zone,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    title_pl text DEFAULT ''::text NOT NULL,
    title_ru text DEFAULT ''::text NOT NULL,
    title_lt text DEFAULT ''::text NOT NULL,
    excerpt_pl text DEFAULT ''::text NOT NULL,
    excerpt_ru text DEFAULT ''::text NOT NULL,
    excerpt_lt text DEFAULT ''::text NOT NULL,
    content_pl text DEFAULT ''::text NOT NULL,
    content_ru text DEFAULT ''::text NOT NULL,
    content_lt text DEFAULT ''::text NOT NULL
);


--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- Name: career_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_applications (
    id integer NOT NULL,
    name text,
    phone text,
    email text,
    whatsapp text,
    telegram text,
    viber text,
    preferred_contact text,
    "position" text,
    employment_preference text,
    experience text,
    skills text,
    languages text,
    intro text,
    message text,
    cv_filename text,
    lang text DEFAULT 'en'::text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: career_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_applications_id_seq OWNED BY public.career_applications.id;


--
-- Name: faq_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faq_items (
    id integer NOT NULL,
    question_en text DEFAULT ''::text NOT NULL,
    question_pl text DEFAULT ''::text NOT NULL,
    question_ru text DEFAULT ''::text NOT NULL,
    question_lt text DEFAULT ''::text NOT NULL,
    answer_en text DEFAULT ''::text NOT NULL,
    answer_pl text DEFAULT ''::text NOT NULL,
    answer_ru text DEFAULT ''::text NOT NULL,
    answer_lt text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: faq_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faq_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faq_items_id_seq OWNED BY public.faq_items.id;


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads (
    id integer NOT NULL,
    contact text DEFAULT ''::text NOT NULL,
    channel text DEFAULT 'form'::text NOT NULL,
    source text DEFAULT 'home'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    form_name text,
    name text,
    phone text,
    email text,
    message text,
    preferred_contact text,
    vehicle_info json,
    page_url text,
    preferred_language text
);


--
-- Name: leads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leads_id_seq OWNED BY public.leads.id;


--
-- Name: page_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_content (
    id integer NOT NULL,
    page text NOT NULL,
    section_key text NOT NULL,
    value_en text DEFAULT ''::text NOT NULL,
    value_pl text DEFAULT ''::text NOT NULL,
    value_ru text DEFAULT ''::text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: page_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.page_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: page_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.page_content_id_seq OWNED BY public.page_content.id;


--
-- Name: popular_vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.popular_vehicles (
    id integer NOT NULL,
    make text NOT NULL,
    model text NOT NULL,
    image_url text DEFAULT ''::text NOT NULL,
    price_range text NOT NULL,
    estimated_delivery text NOT NULL,
    description text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    year integer,
    engine text,
    fuel text,
    transmission text,
    mileage integer,
    photos json DEFAULT '[]'::json NOT NULL,
    description_pl text,
    description_ru text,
    description_lt text
);


--
-- Name: popular_vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.popular_vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: popular_vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.popular_vehicles_id_seq OWNED BY public.popular_vehicles.id;


--
-- Name: pricing_packages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pricing_packages (
    id integer NOT NULL,
    name_en text NOT NULL,
    name_pl text DEFAULT ''::text NOT NULL,
    name_ru text DEFAULT ''::text NOT NULL,
    price integer NOT NULL,
    currency text DEFAULT 'EUR'::text NOT NULL,
    features jsonb DEFAULT '[]'::jsonb NOT NULL,
    is_popular boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: pricing_packages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pricing_packages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pricing_packages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pricing_packages_id_seq OWNED BY public.pricing_packages.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id integer NOT NULL,
    icon_name text DEFAULT 'Star'::text NOT NULL,
    title_en text NOT NULL,
    title_pl text DEFAULT ''::text NOT NULL,
    title_ru text DEFAULT ''::text NOT NULL,
    description_en text NOT NULL,
    description_pl text DEFAULT ''::text NOT NULL,
    description_ru text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    key text NOT NULL,
    value text DEFAULT ''::text NOT NULL,
    label text DEFAULT ''::text NOT NULL,
    "group" text DEFAULT 'general'::text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: sold_vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sold_vehicles (
    id integer NOT NULL,
    make text NOT NULL,
    model text NOT NULL,
    year integer NOT NULL,
    final_price integer,
    purchase_country text NOT NULL,
    delivery_status text DEFAULT 'Delivered'::text NOT NULL,
    delivery_date text,
    image_url text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    delivered_to text,
    mileage integer,
    engine text,
    fuel text,
    transmission text,
    description text,
    description_pl text,
    description_ru text,
    description_lt text,
    photos json DEFAULT '[]'::json NOT NULL
);


--
-- Name: sold_vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sold_vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sold_vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sold_vehicles_id_seq OWNED BY public.sold_vehicles.id;


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials (
    id integer NOT NULL,
    name text NOT NULL,
    country text NOT NULL,
    vehicle_name text NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    content text NOT NULL,
    avatar_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.testimonials_id_seq OWNED BY public.testimonials.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'admin'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    make text NOT NULL,
    model text NOT NULL,
    year integer NOT NULL,
    engine text NOT NULL,
    fuel text NOT NULL,
    transmission text NOT NULL,
    mileage integer NOT NULL,
    location text NOT NULL,
    price integer NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    status text DEFAULT 'available'::text NOT NULL,
    image_url text DEFAULT ''::text NOT NULL,
    badge text,
    is_popular boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    photos json DEFAULT '[]'::json NOT NULL,
    description_pl text,
    description_ru text,
    description_lt text,
    delivered_to text,
    auction_end_date text,
    auction_start_date text,
    estimated_winning_price integer,
    auction_platform text,
    auction_notes text
);


--
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- Name: career_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_applications ALTER COLUMN id SET DEFAULT nextval('public.career_applications_id_seq'::regclass);


--
-- Name: faq_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faq_items ALTER COLUMN id SET DEFAULT nextval('public.faq_items_id_seq'::regclass);


--
-- Name: leads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads ALTER COLUMN id SET DEFAULT nextval('public.leads_id_seq'::regclass);


--
-- Name: page_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_content ALTER COLUMN id SET DEFAULT nextval('public.page_content_id_seq'::regclass);


--
-- Name: popular_vehicles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.popular_vehicles ALTER COLUMN id SET DEFAULT nextval('public.popular_vehicles_id_seq'::regclass);


--
-- Name: pricing_packages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_packages ALTER COLUMN id SET DEFAULT nextval('public.pricing_packages_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: sold_vehicles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sold_vehicles ALTER COLUMN id SET DEFAULT nextval('public.sold_vehicles_id_seq'::regclass);


--
-- Name: testimonials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials ALTER COLUMN id SET DEFAULT nextval('public.testimonials_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.articles (id, title, slug, excerpt, content, cover_image, published_at, status, created_at, updated_at, title_pl, title_ru, title_lt, excerpt_pl, excerpt_ru, excerpt_lt, content_pl, content_ru, content_lt) FROM stdin;
1	Renault и Stellantis контролируют более половины автомобильного рынка Франции	renault-stellantis-kontroliruyut-bolee-poloviny-rynka-francii-v-2025		По итогам 2025 года группы **Renault и Stellantis** суммарно заняли более 52% французского рынка новых легковых автомобилей. По данным отраслевой ассоциации PFA, доля Renault составила 26,4%, тогда как Stellantis получила 25,8%.\n\nВсего за год во Франции было зарегистрировано 1 632 154 новых легковых автомобиля. Это на 5% меньше показателя 2024 года, что указывает на продолжающееся снижение активности на национальном авторынке.\n\n**Группа Renault**, в которую также входят бренды **Dacia и Alpine**, реализовала 430 217 автомобилей и опередила **Stellantis** с результатом 420 867 машин. На марки Peugeot, Citroën и DS внутри концерна **Stellantis** пришлось 350 857 проданных автомобилей. Непосредственно бренд **Renault** завершил год с показателем 285 531 машина.\n\nСамой популярной моделью во Франции стал **Renault Clio**. Второе место занял **Peugeot 208**, а третью строчку получил **Dacia Sandero**. Примечательно, что все девять первых позиций рейтинга продаж достались автомобилям французских марок.\n\n**Toyota Yaris и Yaris Cross** расположились на десятом и одиннадцатом местах соответственно. Обе модели выпускаются на французских предприятиях, при этом **Yaris Cross** сохраняет статус самого массово производимого автомобиля в стране.	https://nowoczesnaflota.pl/media/k2/items/cache/01db144526716df630e705de85c35be7_L.jpg	2026-01-20 00:00:00+00	published	2026-07-12 16:48:49.780382+00	2026-07-13 00:16:24.808+00									
2	Беларусь меняет правила ввоза автомобилей: что ждет рынок с августа 2025 года	-2025-		Правительство Беларуси утвердило изменения в правила ввоза автомобилей, которые затронут юридических лиц и автомобильных импортеров. Соответствующее постановление №372 вступает в силу через 30 дней после официального опубликования документа.\n\nГлавное нововведение заключается в ограничении количества автомобилей одного типа, которые можно будет ввозить без получения одобрения типа транспортного средства (ОТТС). Для таких поставок будет действовать лимит — не более 150 автомобилей одного типа в год.\n\nИзменения не распространяются на физических лиц, которые ввозят автомобили для личного пользования. Для них действующий порядок остается прежним.\n\nВласти объясняют новые требования необходимостью привести белорусский рынок в соответствие с техническими регламентами ЕАЭС и повысить уровень безопасности транспортных средств. По мнению Министерства промышленности, это также позволит создать более прозрачные условия для работы участников рынка.\n\nДля автомобилей с двигателями внутреннего сгорания новые правила начнут действовать с 9 августа 2025 года. Для электромобилей предусмотрен переходный период — требования по получению ОТТС для них вступят в силу только с 1 января 2026 года.\n\nПредставители автомобильного бизнеса по-разному оценивают последствия реформы. Крупные дилеры считают, что смогут адаптироваться к новым требованиям, поскольку уже имеют опыт работы с сертификацией и сервисной поддержкой автомобилей. В то же время небольшие импортеры опасаются роста расходов и сокращения возможностей для поставок отдельных моделей.\n\nЭксперты также обращают внимание на неопределенность механизма распределения квоты в 150 автомобилей одного типа между различными импортерами. Пока остается открытым вопрос, каким образом будет вестись учет таких поставок и как компании смогут отслеживать доступный объем ввоза.\n\nНа рынке не исключают, что новые правила приведут к сокращению числа участников в сегменте параллельного импорта, а также могут повлиять на ассортимент и стоимость некоторых автомобилей, прежде всего китайских моделей и электрокаров.\n\nФактически новое постановление означает постепенное возвращение к стандартной системе сертификации автомобилей, которая действовала до введения временных упрощенных процедур в 2022 году.	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQacpFtTpV6cfe0EmO3tjquCvkr_Mq9iBIOnfLVOOXfFd7uUoeQVAlBPzA&s=10	2025-08-01 00:00:00+00	published	2026-07-13 00:20:47.465977+00	2026-07-13 00:20:47.465977+00									
3	Mercedes-Benz Opens Summer Hub in Central Warsaw	mercedes-benz-opens-summer-hub-in-central-warsaw		Mercedes-Benz has launched its summer event space, Mercedes-Benz Studio, at Plac Defilad in central Warsaw. The venue will remain open until September 5 2026 and offer free concerts, workshops, Formula 1 screenings, test drives, and other activities.\n\nThe project is part of the brand’s international network of urban studios, already present in cities such as Tokyo, Seoul, Munich, and Copenhagen. For many locals, the new space revives the spirit of the popular “Stacja Mercedes” that once operated in Warsaw’s Powiśle district.\n\nVisitors can enjoy cultural and sports events, racing simulators, talks with designers and technology experts, as well as a food and café zone.\n\nThe opening coincides with the 140th anniversary of the invention of the automobile and forms part of Mercedes-Benz’s global “140 Years. 140 Places” celebration.	https://www.mercedes-benz.pl/content/dam/poland/passengercars/campaigns/mb-studio-warszawa/visuale/mb_studio_4x3_3.jpg/1783931870965.jpg?im=Crop,rect=(0,0,1200,900);Resize=(1440,1080)	2026-07-09 00:00:00+00	published	2026-07-14 08:21:29.537153+00	2026-07-14 08:21:29.537153+00	Mercedes-Benz otworzył letnią przestrzeń w centrum Warszawy	В центре Варшавы открылось летнее пространство Mercedes-Benz	Varšuvos centre atidaryta vasaros erdvė „Mercedes-Benz Studio“				Na placu Defilad przed Pałacem Kultury i Nauki rozpoczęła działalność letnia strefa Mercedes-Benz Studio. Do 5 września 2026 na odwiedzających czekają bezpłatne koncerty, warsztaty, transmisje Formuły 1, jazdy testowe oraz wiele innych atrakcji.\n\nProjekt jest częścią międzynarodowej sieci miejskich przestrzeni Mercedes-Benz, które działają już m.in. w Tokio, Seulu, Monachium i Kopenhadze. Dla wielu mieszkańców Warszawy będzie to nawiązanie do popularnej niegdyś „Stacji Mercedes” na Powiślu.\n\nGoście mogą korzystać z wydarzeń kulturalnych i sportowych, symulatorów wyścigowych, spotkań z przedstawicielami świata designu i technologii, a także strefy gastronomicznej.\n\nOtwarcie przestrzeni zorganizowano z okazji 140. rocznicy wynalezienia samochodu i jest częścią globalnego projektu Mercedes-Benz „140 Years. 140 Places”.	На площади Defilad перед Дворцом культуры и науки начало работу летнее пространство Mercedes-Benz Studio. До 5 сентября 2026 здесь будут проходить концерты, мастер-классы, показы Формулы-1, тест-драйвы автомобилей и другие мероприятия. Вход для посетителей бесплатный.\n\nПроект стал частью международной сети городских студий Mercedes-Benz, которые уже работают в Токио, Сеуле, Мюнхене и Копенгагене. Для многих жителей Варшавы новая площадка станет продолжением идеи популярной «Stacji Mercedes», которая раньше находилась на Повисле.\n\nГостей ждут спортивные и культурные события, гоночные симуляторы, встречи с представителями мира дизайна и технологий, а также зона с кафе и летней гастрономией.\n\nОткрытие приурочено к 140-летию изобретения автомобиля. Варшавская площадка станет одной из остановок международного проекта Mercedes-Benz «140 Years. 140 Places».	Varšuvos centre, Defiladų aikštėje prie Kultūros ir mokslo rūmų, pradėjo veikti vasaros erdvė „Mercedes-Benz Studio“. Iki rugsėjo 5 dienos 2026 čia vyks nemokami koncertai, kūrybinės dirbtuvės, „Formulės-1“ transliacijos, automobilių bandomieji važiavimai ir kiti renginiai.\n\nProjektas yra tarptautinio „Mercedes-Benz“ miesto studijų tinklo dalis. Tokios erdvės jau veikia Tokijuje, Seule, Miunchene ir Kopenhagoje. Daugeliui varšuviečių naujoji vieta primins anksčiau Populiarią „Stacja Mercedes“ erdvę Povyšlėje.\n\nLankytojai galės išbandyti lenktynių simuliatorius, dalyvauti kultūriniuose ir sporto renginiuose, susitikimuose su dizaino bei technologijų pasaulio atstovais ir apsilankyti maisto bei kavinių zonoje.\n\nErdvės atidarymas skirtas automobilio išradimo 140-mečiui ir yra pasaulinės „Mercedes-Benz“ iniciatyvos „140 Years. 140 Places“ dalis.
\.


--
-- Data for Name: career_applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_applications (id, name, phone, email, whatsapp, telegram, viber, preferred_contact, "position", employment_preference, experience, skills, languages, intro, message, cv_filename, lang, created_at) FROM stdin;
\.


--
-- Data for Name: faq_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.faq_items (id, question_en, question_pl, question_ru, question_lt, answer_en, answer_pl, answer_ru, answer_lt, sort_order, is_active, created_at, updated_at) FROM stdin;
2	Which auction platforms do you work with?	Z jakimi platformami aukcyjnymi współpracujecie?	С какими аукционными платформами вы работаете?	Su kokiomis aukcionų platformomis dirbate?	We have direct access to BCA, OPENLANE, Auto1, Alcopa, Alphabet, Arval, Autorola, mobile.de, and many exclusive European dealer networks, as well as Copart, IAAI, and Manheim for US-sourced vehicles.	Mamy bezpośredni dostęp do BCA, OPENLANE, Auto1, Alcopa, Alphabet, Arval, Autorola, mobile.de i wielu ekskluzywnych sieci dealerskich, a także Copart, IAAI i Manheim.	У нас есть прямой доступ к BCA, OPENLANE, Auto1, Alcopa, Alphabet, Arval, Autorola, mobile.de и многим эксклюзивным дилерским сетям, а также к Copart, IAAI и Manheim.	Turime tiesioginę prieigą prie BCA, OPENLANE, Auto1, Alcopa, Alphabet, Arval, Autorola, mobile.de ir daugelio išskirtinių Europos platintojų tinklų.	2	t	2026-07-14 08:09:03.697353+00	2026-07-14 08:09:03.697353+00
3	What documents do I need to import a car?	Jakie dokumenty są potrzebne do importu samochodu?	Какие документы нужны для импорта автомобиля?	Kokių dokumentų reikia automobilio importui?	Generally, a valid ID or passport and proof of address. We handle all export/import certificates, customs declarations, VAT documentation, homologation, and registration paperwork on your behalf.	Zazwyczaj wymagany jest ważny dowód tożsamości lub paszport i potwierdzenie adresu. Zajmujemy się całą dokumentacją celną, VAT, homologacją i rejestracją.	Как правило, действующий паспорт и подтверждение адреса. Мы берём на себя всю документацию по экспорту/импорту, таможню, НДС, гомологацию и регистрацию.	Paprastai reikalingas galiojantis asmens dokumentas ir gyvenamosios vietos patvirtinimas. Visus eksporto/importo sertifikatus, muitus, PVM ir registraciją tvarkome mes.	3	t	2026-07-14 08:09:03.697353+00	2026-07-14 08:09:03.697353+00
4	What is your service fee?	Jaka jest wasza opłata serwisowa?	Какова ваша сервисная плата?	Kokia jūsų paslaugos kaina?	Our service fee starts from €500 for standard sourcing. Use our online calculator to get a full cost breakdown including VAT, customs duties, and delivery for your specific destination.	Nasza opłata serwisowa zaczyna się od 500 EUR za standardowe wyszukiwanie. Skorzystaj z naszego kalkulatora online, aby uzyskać pełny podział kosztów.	Наша сервисная плата начинается от 500 EUR за стандартный поиск. Воспользуйтесь нашим онлайн-калькулятором для полного расчёта стоимости.	Mūsų paslaugos mokestis prasideda nuo 500 EUR už standartinę paiešką. Naudokite mūsų skaičiuoklę pilnai išlaidų specifikacijai gauti.	4	t	2026-07-14 08:09:03.697353+00	2026-07-14 08:09:03.697353+00
5	Can I inspect the vehicle before purchase?	Czy mogę obejrzeć pojazd przed zakupem?	Могу ли я осмотреть автомобиль перед покупкой?	Ar galiu apžiūrėti transporto priemonę prieš pirkimą?	Yes. We arrange a professional pre-purchase inspection by certified independent mechanics at the vehicle's location. A full inspection report is included with every order.	Tak. Organizujemy profesjonalną inspekcję przedsprzedażową przez certyfikowanych niezależnych mechaników w miejscu, gdzie znajduje się pojazd.	Да. Мы организуем профессиональную предпродажную инспекцию сертифицированными независимыми механиками по месту нахождения автомобиля.	Taip. Organizuojame profesionalią priešpirkinę patikrą sertifikuotų nepriklausomų mechanikų transporto priemonės vietoje.	5	t	2026-07-14 08:09:03.697353+00	2026-07-14 08:09:03.697353+00
6	How are customs and taxes handled?	Jak obsługiwane są cła i podatki?	Как обрабатываются таможня и налоги?	Kaip tvarkomi muitai ir mokesčiai?	We calculate all estimated duties and taxes upfront using our online calculator. Our team handles the full customs clearance process — you pay no hidden fees. All amounts are agreed before the order is placed.	Obliczamy wszystkie szacowane cła i podatki z góry za pomocą naszego kalkulatora online. Nasz zespół zajmuje się pełną odprawą celną — bez ukrytych opłat.	Мы рассчитываем все предполагаемые пошлины и налоги заранее через онлайн-калькулятор. Наша команда берёт на себя полное таможенное оформление — без скрытых платежей.	Visus numatomus muitus ir mokesčius apskaičiuojame iš anksto naudodami mūsų skaičiuoklę. Mūsų komanda atlieka visą muitinio įforminimo procesą — jokių paslėptų mokesčių.	6	t	2026-07-14 08:09:03.697353+00	2026-07-14 08:09:03.697353+00
7	Do you offer delivery to my city?	Czy oferujecie dostawę do mojego miasta?	Предлагаете ли вы доставку в мой город?	Ar siūlote pristatymą į mano miestą?	Yes, we offer door-to-door delivery across all of Europe, including Poland, Lithuania, Latvia, Estonia, Belarus, and beyond. Delivery costs depend on the destination and are shown in the calculator.	Tak, oferujemy dostawę od drzwi do drzwi w całej Europie, w tym do Polski, Litwy, Łotwy, Estonii, Białorusi i innych krajów.	Да, мы предлагаем доставку «от двери до двери» по всей Европе, включая Польшу, Литву, Латвию, Эстонию, Беларусь и другие страны.	Taip, siulome nuo duru iki duru pristatymą visoje Europoje, iskaitant Lenkija, Lietuva, Latvija, Estija, Baltarusija ir kitas salis.	7	t	2026-07-14 08:09:03.697353+00	2026-07-14 08:09:03.697353+00
1	How long does the import process take?	Jak długo trwa proces importu?	Сколько времени занимает процесс импорта?	Kiek laiko trunka importo procesas?	The typical import process takes 3–6 weeks.				1	t	2026-07-14 08:09:03.697353+00	2026-07-20 14:49:33.79+00
8	What happens after the car is delivered?	Co się dzieje po dostawie samochodu?	Что происходит после доставки автомобиля?	Kas nutinka po automobilio pristatymo?	After delivery, your dedicated manager remains available to help with any post-delivery questions. We also assist with local registration if needed.	Po dostawie Twój dedykowany opiekun pozostaje do dyspozycji w celu pomocy z wszelkimi pytaniami. Pomagamy również w lokalnej rejestracji, jeśli jest potrzebna.	После доставки ваш персональный менеджер остаётся на связи для ответа на любые вопросы. Мы также помогаем с местной регистрацией при необходимости.	Po pristatymo jūsų paskirtas vadybininkas lieka pasiekiamas bet kokiais klausimais. Taip pat padedame su vietiniu registravimu, jei reikia.	8	t	2026-07-14 08:09:03.697353+00	2026-07-14 08:09:03.697353+00
9	Test?				Test answer				9	t	2026-07-20 14:47:24.796475+00	2026-07-20 14:47:24.796475+00
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leads (id, contact, channel, source, created_at, form_name, name, phone, email, message, preferred_contact, vehicle_info, page_url, preferred_language) FROM stdin;
1	+4850247762	telegram	home	2026-07-12 00:01:11.692127+00	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	test@test.com	form	Test Form	2026-07-12 14:30:00.139549+00	Test Form	Test User	+1234567890	test@test.com	Test message	\N	\N	\N	\N
3	bovaja.poland@gmail.com	form	Main Contact Form	2026-07-12 14:30:59.598921+00	Main Contact Form	Ksenia Wasilewska		bovaja.poland@gmail.com		\N	\N	https://f6378a50-4a15-4edc-ae59-4e1fd078f3f6-00-9gvgsbidru6q.kirk.replit.dev/contact	\N
4	+1	form	Test	2026-07-12 14:32:09.973792+00	Test	Test	+1	\N	\N	\N	\N	\N	\N
5	test@example.com	form	Test Email	2026-07-12 14:35:27.727757+00	Test Email	Test User	+48123456789	test@example.com	Проверка отправки email после добавления секретов	\N	\N	\N	\N
6	test@example.com	form	Test Email	2026-07-12 14:44:39.899585+00	Test Email	Test User	+48123456789	test@example.com	Проверка отправки email	\N	\N	\N	\N
7	+48502427762	telegram	Request This Vehicle	2026-07-12 14:46:08.476348+00	Request This Vehicle	Ksenia	+48502427762	\N		Telegram	{"label":"2026 Test Test","id":7,"make":"Test","model":"Test","year":2026,"price":0,"status":"available"}	https://f6378a50-4a15-4edc-ae59-4e1fd078f3f6-00-9gvgsbidru6q.kirk.replit.dev/inventory	\N
8	kdkdk@gmail.com	form	Calculator Quote Request	2026-07-12 14:54:14.000638+00	Calculator Quote Request	ксения	375297930	kdkdk@gmail.com	Quote request: Poland, vehicle price €25000. Vehicle type: sourcing. Total: €32,050	\N	\N	https://f6378a50-4a15-4edc-ae59-4e1fd078f3f6-00-9gvgsbidru6q.kirk.replit.dev/calculator	\N
9	kdkdk@gmail.com	form	Calculator Quote Request	2026-07-12 14:54:15.203353+00	Calculator Quote Request	ксения	375297930	kdkdk@gmail.com	Quote request: Poland, vehicle price €25000. Vehicle type: sourcing. Total: €32,050	\N	\N	https://f6378a50-4a15-4edc-ae59-4e1fd078f3f6-00-9gvgsbidru6q.kirk.replit.dev/calculator	\N
10	test@test.com	form	Footer Contact Form	2026-07-14 08:09:09.763886+00	Footer Contact Form	Test User	+370600001	test@test.com	Test message	\N	\N	http://localhost/	Russian
11	bovaja.poland@gmail.com	form	Footer Contact Form	2026-07-14 08:10:19.276466+00	Footer Contact Form	ксения	+48	bovaja.poland@gmail.com	Привет	\N	\N	https://f6378a50-4a15-4edc-ae59-4e1fd078f3f6-00-9gvgsbidru6q.kirk.replit.dev/	Russian
12		form	Footer Contact Form	2026-07-14 08:11:10.909547+00	Footer Contact Form					\N	\N	https://f6378a50-4a15-4edc-ae59-4e1fd078f3f6-00-9gvgsbidru6q.kirk.replit.dev/	Russian
13	+48502427762	telegram	Get More Information	2026-07-16 12:00:45.003507+00	Get More Information	Ksenia	+48502427762	\N		Telegram	{"label":"2009 Citroen  Grand C4 Picasso","id":23,"make":"Citroen ","model":"Grand C4 Picasso","year":2009,"price":2100,"status":"available"}	https://f6378a50-4a15-4edc-ae59-4e1fd078f3f6-00-9gvgsbidru6q.kirk.replit.dev/inventory	Russian
\.


--
-- Data for Name: page_content; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.page_content (id, page, section_key, value_en, value_pl, value_ru, updated_at) FROM stdin;
\.


--
-- Data for Name: popular_vehicles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.popular_vehicles (id, make, model, image_url, price_range, estimated_delivery, description, sort_order, year, engine, fuel, transmission, mileage, photos, description_pl, description_ru, description_lt) FROM stdin;
4	Peugeot 	508	https://i.pinimg.com/736x/3a/1b/e5/3a1be5f277672aba7509f1b4eeed1afe.jpg	€8,000 – €10,000	4–6 weeks	Peugeot 	4	\N	1.5	Petrol	\N	50000	[]	\N	\N	\N
6	BMW  	X1	https://i.pinimg.com/736x/62/e5/bd/62e5bd60b04f8724fee445ffca41a93d.jpg	€8,000 – €10,000	4–6 weeks	Peugeot 	4	\N	1.5	Petrol	\N	50000	[]	\N	\N	\N
7	Volvo	XC40	https://i.pinimg.com/736x/58/f2/3a/58f23a2b2feb4ebb9a0d441ab421b112.jpg	€8,000 – €10,000	4–6 weeks	Peugeot 	4	\N	1.5	Petrol	\N	50000	[]	\N	\N	\N
8	Citroen 	C4	https://i.pinimg.com/736x/9b/77/9f/9b779fd921565c20f74066ba44a89fd3.jpg	€8,000 – €10,000	4–6 weeks	Peugeot 	4	\N	1.5	Petrol	\N	50000	[]	\N	\N	\N
9	Renault	Grand Scenic	https://i.pinimg.com/736x/4c/65/b1/4c65b10b85143f6c3615b5072e1aa29f.jpg	€8,000 – €10,000	4–6 weeks	Peugeot 	4	2022	1.5	Petrol	Manual	50000	[]	\N	\N	\N
5	Peugeot 	308	https://i.pinimg.com/736x/25/e2/c2/25e2c2f11e897eefef4c88faea5bb1ab.jpg	€8,000 – €10,000	4–6 weeks	ㅤ	4	\N	1.5	Petrol	\N	50000	[]	\N	\N	\N
10	Renault	Kadjar	https://i.pinimg.com/736x/ec/2d/ab/ec2dabda6b067528d49d52acf1594701.jpg	€8,000 – €10,000	4–6 weeks	Peugeot 	4	\N	1.5	Petrol	\N	50000	[]	\N	\N	\N
11	Renault	Clio	https://i.pinimg.com/736x/30/fb/cc/30fbcc65ff5ff239451ae3a450e48dcf.jpg	€8,000 – €10,000	4–6 weeks	ㅤ	4	\N	1.5	Petrol	\N	50000	[]	\N	\N	\N
12	Peugeot 	3008	https://i.pinimg.com/736x/25/43/32/254332ab81edc9c833fa2db2fa6349fa.jpg	€8,000 – €10,000	4–6 weeks	Peugeot 	4	\N	1.5	Petrol	\N	50000	[]	\N	\N	\N
13	Peugeot 	5008	https://i.pinimg.com/736x/38/a7/a9/38a7a99914d7fcc84542527ff617233d.jpg	€8,000 – €10,000	4–6 weeks	Peugeot 	4	\N	1.5	Petrol	\N	50000	[]	\N	\N	\N
\.


--
-- Data for Name: pricing_packages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pricing_packages (id, name_en, name_pl, name_ru, price, currency, features, is_popular, sort_order) FROM stdin;
1	Essential	Podstawowy	Базовый	500	EUR	["Vehicle sourcing", "Basic documentation", "Transport coordination", "1 revision"]	f	1
2	Professional	Profesjonalny	Профессиональный	900	EUR	["Everything in Essential", "Pre-purchase inspection", "Full documentation & customs", "Transport to your door", "3 revisions", "Dedicated manager"]	t	2
3	Premium	Premium	Премиум	1500	EUR	["Everything in Professional", "Priority sourcing", "6-month post-delivery support", "Unlimited revisions", "VIP concierge service"]	f	3
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, icon_name, title_en, title_pl, title_ru, description_en, description_pl, description_ru, sort_order, created_at) FROM stdin;
1	Search	Vehicle Sourcing	Wyszukiwanie pojazdów	Поиск автомобилей	We find your exact vehicle anywhere in Europe — any make, model, spec and color.	Wyszukujemy dokładnie ten pojazd, którego szukasz w całej Europie.	Найдём нужный автомобиль в любой точке Европы.	1	2026-07-14 08:09:03.581147+00
2	FileCheck	Documentation	Dokumentacja	Документация	Full legal compliance — customs clearance, VAT, homologation and registration support.	Pełna obsługa prawna — odprawa celna, VAT, homologacja i rejestracja.	Полное юридическое сопровождение — таможня, НДС, гомологация и регистрация.	2	2026-07-14 08:09:03.581147+00
3	Truck	Transport & Logistics	Transport i Logistyka	Транспорт и логистика	Door-to-door delivery with real-time tracking across all of Eastern and Western Europe.	Dostawa od drzwi do drzwi z śledzeniem w czasie rzeczywistym.	Доставка от двери до двери с отслеживанием в реальном времени.	3	2026-07-14 08:09:03.581147+00
4	Shield	Inspection & Warranty	Inspekcja i Gwarancja	Инспекция и гарантия	Independent pre-purchase inspection and vehicle history report included on every order.	Niezależna inspekcja przed zakupem i raport historii pojazdu w każdym zamówieniu.	Независимая предпродажная инспекция и отчёт об истории автомобиля.	4	2026-07-14 08:09:03.581147+00
5	Calculator	Cost Calculation	Kalkulacja kosztów	Расчёт стоимости	Transparent breakdown of all costs: vehicle price, VAT, customs, delivery and our service fee.	Przejrzysty podział kosztów: cena pojazdu, VAT, cło, dostawa i nasze wynagrodzenie.	Прозрачный расчёт всех затрат: цена авто, НДС, таможня, доставка и наш сбор.	5	2026-07-14 08:09:03.581147+00
6	Headphones	After-Sales Support	Wsparcie posprzedażowe	Послепродажная поддержка	Dedicated manager available 7 days a week throughout the entire purchase process.	Dedykowany opiekun dostępny 7 dni w tygodniu przez cały proces zakupu.	Персональный менеджер доступен 7 дней в неделю на протяжении всего процесса.	6	2026-07-14 08:09:03.581147+00
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session (sid, sess, expire) FROM stdin;
TYv7ncqfzFIqvP293gKLuVDIfiNkHAPk	{"cookie":{"originalMaxAge":604800000,"expires":"2026-07-27T14:47:24.677Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"username":"admin","role":"admin"}	2026-07-27 14:47:25
ouBmFw2G11p2TeqJH7n6_i8awAcAwHWX	{"cookie":{"originalMaxAge":604800000,"expires":"2026-07-27T13:43:09.068Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"username":"admin","role":"admin"}	2026-07-27 13:48:41
XaNcldyyF15VmbdaEcWHU2AwnzKB5iBR	{"cookie":{"originalMaxAge":604800000,"expires":"2026-07-22T21:58:55.049Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"username":"admin","role":"admin"}	2026-07-23 13:16:17
ZyUzQdhYMXU-o0YErA8ZUbxqyA0Fi-yr	{"cookie":{"originalMaxAge":604800000,"expires":"2026-07-23T13:15:52.897Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"username":"admin","role":"admin"}	2026-07-23 13:16:24
SoUoJsOq4um9vg5R6uoire_oIGdYnRDQ	{"cookie":{"originalMaxAge":604800000,"expires":"2026-07-27T14:49:33.575Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"username":"admin","role":"admin"}	2026-07-27 14:49:34
jcTE1TTkmjG0651hXmMy13Boqh6BZAdy	{"cookie":{"originalMaxAge":604800000,"expires":"2026-07-27T13:45:22.577Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"username":"admin","role":"admin"}	2026-07-27 13:45:25
-KAeQmyCu0Nk-AGkH5qA_8vfe8aOLsg6	{"cookie":{"originalMaxAge":604800000,"expires":"2026-07-25T13:40:09.380Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"username":"admin","role":"admin"}	2026-07-28 10:06:44
z0FRX9B8LfeRV7rFATuMLyU1S4C-A2lv	{"cookie":{"originalMaxAge":604800000,"expires":"2026-07-22T22:01:04.818Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"username":"admin","role":"admin"}	2026-07-23 13:01:18
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_settings (id, key, value, label, "group", updated_at) FROM stdin;
1	general.company_name	BOVAJA	Company Name	general	2026-07-14 08:09:03.620946+00
4	contact.address_line1	Gariūnai Car Market, Site 309A	Address Line 1	contact	2026-07-14 08:09:03.620946+00
5	contact.address_line2	Gariūnų g. 49, Vilnius 02300	Address Line 2	contact	2026-07-14 08:09:03.620946+00
6	contact.country	Lithuania	Country	contact	2026-07-14 08:09:03.620946+00
7	contact.maps_url	https://maps.google.com/?q=Gariu%CC%B3nu%CC%B3+g.+49,+Vilnius	Google Maps URL	contact	2026-07-14 08:09:03.620946+00
11	stats.vehicles_delivered	5000	Vehicles Delivered	stats	2026-07-14 08:09:03.620946+00
12	stats.satisfaction_rate	98	Client Satisfaction Rate (%)	stats	2026-07-14 08:09:03.620946+00
13	stats.years_experience	12	Years of Experience	stats	2026-07-14 08:09:03.620946+00
14	stats.countries_served	40	Countries Served	stats	2026-07-14 08:09:03.620946+00
15	stats.total_value_billion	2.4	Total Value Sourced (€ billion)	stats	2026-07-14 08:09:03.620946+00
16	calculator.service_fee	470	Service Fee (EUR)	calculator	2026-07-14 08:09:03.620946+00
17	calculator.delivery.western_europe	800	Delivery Price – Western Europe (EUR)	calculator	2026-07-14 08:09:03.620946+00
18	calculator.delivery.eastern_europe	600	Delivery Price – Eastern Europe (EUR)	calculator	2026-07-14 08:09:03.620946+00
19	calculator.vat.poland	23	VAT Rate – Poland (%)	calculator	2026-07-14 08:09:03.620946+00
20	calculator.vat.lithuania	21	VAT Rate – Lithuania (%)	calculator	2026-07-14 08:09:03.620946+00
21	calculator.vat.latvia	21	VAT Rate – Latvia (%)	calculator	2026-07-14 08:09:03.620946+00
22	calculator.vat.estonia	24	VAT Rate – Estonia (%)	calculator	2026-07-14 08:09:03.620946+00
23	calculator.vat.germany	19	VAT Rate – Germany (%)	calculator	2026-07-14 08:09:03.620946+00
24	calculator.vat.czech_republic	21	VAT Rate – Czech Republic (%)	calculator	2026-07-14 08:09:03.620946+00
25	calculator.belarus.customs_rate	15	Belarus Customs Rate (%)	calculator	2026-07-14 08:09:03.620946+00
26	calculator.belarus.excise_rate	5	Belarus Excise Rate (%)	calculator	2026-07-14 08:09:03.620946+00
27	calculator.belarus.registration_docs	150	Belarus Registration Docs Fee (EUR)	calculator	2026-07-14 08:09:03.620946+00
3	contact.email	info@bovaja.com	Email Address	contact	2026-07-18 13:42:07.664+00
9	social.telegram	bovajacars	Telegram Handle (without @)	social	2026-07-18 13:42:18.845+00
2	contact.phone	+48 512 698 857	Phone Number	contact	2026-07-18 13:42:20.149+00
8	social.whatsapp	48512698857	WhatsApp Number (digits only)	social	2026-07-18 13:42:21.489+00
10	social.viber	+48512698857	Viber Number (digits only)	social	2026-07-18 13:42:23.052+00
\.


--
-- Data for Name: sold_vehicles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sold_vehicles (id, make, model, year, final_price, purchase_country, delivery_status, delivery_date, image_url, created_at, delivered_to, mileage, engine, fuel, transmission, description, description_pl, description_ru, description_lt, photos) FROM stdin;
5	Peugeot	3008	2021	14970	Italy	Delivered	\N	https://images.openlane.eu/carimgs/4821473/general/b1cbf87e-5ebb-4cdf-935c-a3fdadcfeff0.jpg	2026-07-18 22:17:23.587982+00	Belarus	118204	1.5	Diesel	Automatic	\N	\N	\N	\N	[]
6	Volkswagen	Tiguan	2020	20799	Netherlands	Delivered	\N	https://images.openlane.eu/carimgs/4817784/general/0bb6b8e9-4e48-4b84-855e-abbcd5391473.jpg	2026-07-18 22:17:23.587982+00	Belarus	137050	1.5	Petrol	Automatic	\N	\N	\N	\N	[]
7	Mercedes-Benz	A 180	2018	20675	Belgium	Delivered	\N	https://images.openlane.eu/carimgs/4779035/general/b8ea3268-b32d-4145-8902-a2a55bff1ef0.jpg	2026-07-18 22:17:23.587982+00	Belarus	77720	1.3	Petrol	Automatic	\N	\N	\N	\N	[]
8	Volkswagen	Passat Variant	2021	15805	Netherlands	Delivered	\N	https://images.openlane.eu/carimgs/4767419/general/462cef03-04ab-4638-aed9-131f03834f1f.jpg	2026-07-18 22:17:23.587982+00	Belarus	174195	1.5	Petrol	Automatic	\N	\N	\N	\N	[]
9	Peugeot	2008	2021	8299	France	Delivered	\N	https://autoplius-img.dgn.lt/ann_3_398691546/peugeot-2008-1-2-l-visureigis-krosoveris-2021-benzinas-0.jpg	2026-07-18 22:17:23.587982+00	Kaunas, Lithuania	126000	1.5	Petrol	Automatic	\N	\N	\N	\N	[]
10	BMW	2 Series	2020	20699	Belgium	Delivered	\N	https://images.openlane.eu/carimgs/5212772/general/73b4ac29-0ea3-4e1d-aa46-35383238e14e.jpg	2026-07-18 22:17:23.587982+00	Belarus	100325	1.5	Diesel	Automatic	\N	\N	\N	\N	[]
11	Nissan	Leaf	2019	10999	Netherlands	Delivered	\N	https://images.openlane.eu/carimgs/5026029/general/bfc8dd00-ad9b-4600-8e01-97eb86880e60.jpg	2026-07-18 22:17:23.587982+00	Belarus	134011	62 kWh	Electric	Automatic	\N	\N	\N	\N	[]
12	DS7	Crossback	2017	17475	Belgium	Delivered	\N	https://images.openlane.eu/carimgs/4909071/general/a818dc51-9018-4e70-8ae6-a19242fda9fe.jpg	2026-07-18 22:17:23.587982+00	Belarus	160400	1.5	Diesel	Automatic	\N	\N	\N	\N	[]
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.testimonials (id, name, country, vehicle_name, rating, content, avatar_url, is_active, created_at) FROM stdin;
2	Andrei Petrov	Latvia	Mercedes GLE 350d	5	Fast, professional, and fully transparent about all costs. The cost calculator gave me an accurate estimate and the final price matched perfectly. Highly recommended!	\N	t	2026-07-14 08:09:03.602879+00
3	Tomáš Novák	Czech Republic	Porsche Cayenne GTS	5	I was sceptical about importing a Porsche, but the team made it completely stress-free. Every step was communicated clearly. My Cayenne arrived ahead of schedule.	\N	t	2026-07-14 08:09:03.602879+00
4	Elena Müller	Estonia	Audi Q7 55 TFSI	5	The whole process took just 3 weeks from order to delivery. The pre-purchase inspection gave me total peace of mind. Would absolutely use again for my next car.	\N	t	2026-07-14 08:09:03.602879+00
1	Yu	Poland	BMW X5 xDrive40i	5	Exceptional service from start to finish. The team found exactly the spec I wanted in Germany and handled all the paperwork flawlessly. My X5 arrived in perfect condition.	https://i.pravatar.cc/150	t	2026-07-14 08:09:03.602879+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password_hash, role, created_at) FROM stdin;
1	admin	$2b$10$xNsXxXD5iz/MEsnz4s1.UuZhZgnYWrHElFvVFkIYT8LH6.Eepki0W	admin	2026-07-11 18:21:30.170604+00
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vehicles (id, make, model, year, engine, fuel, transmission, mileage, location, price, description, status, image_url, badge, is_popular, sort_order, created_at, updated_at, photos, description_pl, description_ru, description_lt, delivered_to, auction_end_date, auction_start_date, estimated_winning_price, auction_platform, auction_notes) FROM stdin;
3	Ford	Kuga	2017	1.5	Diesel	Automatic	286576	Drizzona, Italy	8399		sold	https://images.openlane.eu/carimgs/4787760/general/0c9f19d9-714a-4047-9846-682cca8d7fe3.jpg		f	3	2026-07-14 08:09:03.543786+00	2026-07-16 09:55:28.124+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
24	Renault	Kadjar	2019	1.5	Diesel	Manual	146000	Vilnius, Lithuania	14036		available	https://autoplius-img.dgn.lt/ann_3_400775410/renault-kadjar-1-5-l-visureigis-krosoveris-2019-dyzelinas-0.jpg	\N	f	0	2026-07-16 11:56:10.604535+00	2026-07-16 11:56:10.604535+00	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	Mercedes-Benz	A 180 GTS	2018	1.3	Petrol	Automatic	77720	Bilzen, Belgium	20675		sold	https://images.openlane.eu/carimgs/4779035/general/b8ea3268-b32d-4145-8902-a2a55bff1ef0.jpg	\N	f	4	2026-07-14 08:09:03.543786+00	2026-07-15 22:09:13.297+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
8	Audi	A3 Sportback G-Tron 30	2021	1.5L	Petrol	Automatic	45000	Germany	18000	Test	available	https://images.openlane.eu/carimgs/4807210/general/40da2af8-18a5-46f4-a5b1-e7b9.jpg	\N	f	0	2026-07-15 22:23:11.659704+00	2026-07-20 13:45:24.008+00	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	Peugeot	5008	2016	1.5	Diesel	Automatic	165000	Vilnius, Lithuania	8470		available	https://autoplius-img.dgn.lt/ann_3_401436354/peugeot-5008-1-6-l-visureigis-krosoveris-2016-dyzelinas-0.jpg	\N	f	0	2026-07-16 11:57:26.420072+00	2026-07-16 11:57:26.420072+00	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	Nissan	Qashqai	2014	1.6	Diesel	Manual	225000	Vilnius, Lithuania	7018		available	https://autoplius-img.dgn.lt/ann_3_397025272/nissan-qashqai-1-6-l-visureigis-krosoveris-2014-dyzelinas-0.jpg	\N	f	0	2026-07-16 11:58:45.424136+00	2026-07-16 11:58:45.424136+00	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	Citroen	C4 Cactus	2019	1.2	Petrol	Automatic	155000	Vilnius, Lithuania	10043		available	https://autoplius-img.dgn.lt/ann_3_401841820/citroen-c4-cactus-1-2-l-visureigis-krosoveris-2019-benzinas-0.jpg	\N	f	0	2026-07-16 12:00:01.822669+00	2026-07-16 12:00:01.822669+00	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	Peugeot	5008	2019	1.2	Petrol	Manual	226000	Moenchengladbach, Germany	9299		sold	https://images.openlane.eu/carimgs/4868855/general/14f9a248-2602-48bc-bc59-9e58476ed52a.jpg	\N	f	0	2026-07-15 22:25:01.842121+00	2026-07-15 22:25:01.842121+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
10	DS7 	Crossback	2017	1.5	Diesel	Automatic	160400	Bilzen, Belgium	17479		sold	https://i.pinimg.com/736x/22/f7/c2/22f7c2ddaf11681ab9907ac32c9f9a45.jpg	\N	f	0	2026-07-15 22:26:51.208793+00	2026-07-19 00:01:48.359+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
11	Peugeot	508 SW GT	2019	1.2	Petrol	Automatic	134942	INGRANDES SUR VIENNE, France	12220		sold	https://images.openlane.eu/carimgs/4932010/general/96396e58-4ca8-484e-a0df-d427ed2cdc99.jpg	\N	f	0	2026-07-15 22:28:47.995949+00	2026-07-15 22:28:47.995949+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
12	Opel 	Grandland 	2019	1.2	Petrol	Automatic	163939	Hoogeveen, Netherlands	9750		sold	https://images.openlane.eu/carimgs/4992314/general/6118ca37-569d-47e2-bf9d-2c15d304ab64.jpg	\N	f	0	2026-07-15 22:32:10.180325+00	2026-07-15 22:32:10.180325+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
13	Nissan	Leaf	2019	62 kWh	Electric	Automatic	134011	Alblasserdam, Netherlands	10999		sold	https://images.openlane.eu/carimgs/5026029/general/bfc8dd00-ad9b-4600-8e01-97eb86880e60.jpg	\N	f	0	2026-07-15 22:35:16.359993+00	2026-07-15 22:35:16.359993+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
14	BMW	2	2020	1.5	Diesel	Automatic	100325	Bilzen, Belgium	20699		sold	https://images.openlane.eu/carimgs/5212772/general/73b4ac29-0ea3-4e1d-aa46-35383238e14e.jpg	\N	f	0	2026-07-15 22:37:07.327038+00	2026-07-15 22:37:07.327038+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
15	Opel 	Grandland 	2020	1.2	Petrol	Automatic	170259	Drizzona, Italy	7775		sold	https://images.openlane.eu/carimgs/5224197/general/fce27594-2225-470a-bfa9-910596727330.jpg	\N	f	0	2026-07-15 22:39:25.662115+00	2026-07-15 22:39:25.662115+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
16	Renault	Scenic	2016	1.7	Diesel	Automatic	176677	Bilzen, Belgium	11499		sold	https://images.openlane.eu/carimgs/5342134/general/109fe816-2258-4fba-9778-07c8c2aa288c.jpg	\N	f	0	2026-07-15 22:41:39.790208+00	2026-07-15 22:41:39.790208+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
17	Renault	Kadjar	2022	1.3	Petrol	Automatic	196943	France	9999		auction	https://i.pinimg.com/736x/56/26/87/562687b1fb28d3400c54a289c945245a.jpg	\N	f	0	2026-07-15 22:51:16.38112+00	2026-07-15 22:51:16.38112+00	[]	\N	\N	\N	\N	2026-07-20	2026-07-16	9999	BCA	\N
20	Renault	Megane	2020	1.5	Diesel	Automatic	163000	Vilnius, Lithuania	9438		available	https://autoplius-img.dgn.lt/ann_3_400172132/renault-megane-1-5-l-universalas-2020-dyzelinas-0.jpg	\N	f	0	2026-07-16 11:43:36.186454+00	2026-07-16 11:48:00.297+00	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	Peugeot 	3008	2020	1.5	Petrol	Automatic	184000	Vilnius, Lithuania	15125		available	https://i.pinimg.com/736x/61/ff/43/61ff43263d5ffb74b76ec7b86fd674b4.jpg	\N	f	0	2026-07-16 11:47:21.979233+00	2026-07-16 11:48:04.836+00	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	Renault	Kadjar	2020	1.5	Diesel	Automatic	187000	Vilnius, Lithuania	9100		available	https://i.pinimg.com/736x/b3/d4/0f/b3d40f9f162056ad17340faf3756e36b.jpg	\N	f	0	2026-07-15 23:02:30.839074+00	2026-07-16 11:48:19.325+00	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	Peugeot 	2008	2026	1.5	Petrol	Automatic	126000	Beauvais, France	8299		sold	https://autoplius-img.dgn.lt/ann_3_398691546/peugeot-2008-1-2-l-visureigis-krosoveris-2021-benzinas-0.jpg	\N	f	0	2026-07-16 11:51:14.358973+00	2026-07-16 11:52:15.938+00	[]	\N	\N	\N	Kaunas, Lithuania	\N	\N	\N	\N	\N
23	Citroen 	Grand C4 Picasso	2009	2	Petrol	Automatic	230000	Vilnius, Lithuania	2100		available	https://autoplius-img.dgn.lt/ann_3_396341456/citroen-grand-c4-picasso-2-0-l-vienaturis-2009-benzinas-0.jpg	\N	f	0	2026-07-16 11:54:18.49128+00	2026-07-16 11:54:18.49128+00	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
28	DS7 	d	2026	d	Petrol	Automatic	0	d	2		available	https://i.pinimg.com/736x/22/f7/c2/22f7c2ddaf11681ab9907ac32c9f9a45.jpg	\N	f	0	2026-07-19 00:00:26.851675+00	2026-07-19 00:02:28.912+00	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	Volkswagen 	Tiguan	2020	1.6	Petrol	Automatic	137050	Hoogeveen, Netherlands	20799		sold	https://i.pinimg.com/736x/22/f7/c2/22f7c2ddaf11681ab9907ac32c9f9a45.jpg	\N	f	0	2026-07-16 09:56:42.443899+00	2026-07-19 00:04:02.031+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
5	Volkswagen	Passat Variant	2021	1.5	Petrol	Automatic	174195	Barneveld, Netherlands	15805		sold	https://i.pinimg.com/736x/7c/01/5d/7c015d0e333865e76d76bd9cb636bd01.jpg	\N	f	5	2026-07-14 08:09:03.543786+00	2026-07-19 11:02:57.746+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
29	Volkswagen 	Passat Variant TSI R-line	2021	1.5	Petrol	Automatic	174195	Barneveld, Netherlands	15850		sold	https://i.pinimg.com/736x/7c/01/5d/7c015d0e333865e76d76bd9cb636bd01.jpg	\N	f	0	2026-07-19 11:04:46.719832+00	2026-07-19 11:04:46.719832+00	[]	\N	\N	\N	Belarus	\N	\N	\N	\N	\N
\.


--
-- Name: articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.articles_id_seq', 3, true);


--
-- Name: career_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_applications_id_seq', 1, false);


--
-- Name: faq_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.faq_items_id_seq', 9, true);


--
-- Name: leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.leads_id_seq', 13, true);


--
-- Name: page_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.page_content_id_seq', 1, false);


--
-- Name: popular_vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.popular_vehicles_id_seq', 13, true);


--
-- Name: pricing_packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pricing_packages_id_seq', 3, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 6, true);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 27, true);


--
-- Name: sold_vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sold_vehicles_id_seq', 12, true);


--
-- Name: testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.testimonials_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vehicles_id_seq', 29, true);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: articles articles_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_slug_unique UNIQUE (slug);


--
-- Name: career_applications career_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_applications
    ADD CONSTRAINT career_applications_pkey PRIMARY KEY (id);


--
-- Name: faq_items faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faq_items
    ADD CONSTRAINT faq_items_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: page_content page_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_content
    ADD CONSTRAINT page_content_pkey PRIMARY KEY (id);


--
-- Name: popular_vehicles popular_vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.popular_vehicles
    ADD CONSTRAINT popular_vehicles_pkey PRIMARY KEY (id);


--
-- Name: pricing_packages pricing_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_packages
    ADD CONSTRAINT pricing_packages_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: site_settings site_settings_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_key_unique UNIQUE (key);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: sold_vehicles sold_vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sold_vehicles
    ADD CONSTRAINT sold_vehicles_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- PostgreSQL database dump complete
--

\unrestrict WE1eOlU42riAStq8setu2mlPz7uydSopsXA25VRc2PxNGHQSheuQrhgx06Oq3sV

