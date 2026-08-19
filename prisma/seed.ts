import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const galleryItems = [
  { caption: "تمرین پا", type: "IMAGE" },
  { caption: "کلاس HIIT", type: "VIDEO" },
  { caption: "روز مسابقه", type: "IMAGE" },
  { caption: "تمرین دایره‌ای", type: "VIDEO" },
  { caption: "تمرین بالاتنه", type: "IMAGE" },
  { caption: "کششی و ریکاوری", type: "IMAGE" },
  { caption: "تمرین قدرتی", type: "IMAGE" },
  { caption: "اصلاح تکنیک اسکات", type: "VIDEO" },
  { caption: "جشن رسیدن به هدف", type: "IMAGE" },
  { caption: "کلاس کاردیو", type: "VIDEO" },
  { caption: "تمرین قدرت انفجاری", type: "IMAGE" },
  { caption: "کلاس گروهی", type: "IMAGE" },
];

const blogPosts = [
  {
    slug: "5-common-strength-training-mistakes",
    title: "۵ اشتباه رایج در تمرینات قدرتی",
    excerpt: "قبل از شروع برنامه بدنسازی، این نکته‌ها رو حتماً بخون.",
    content:
      "خیلی از شاگردهای جدید با انگیزه‌ی زیاد تمرین رو شروع می‌کنن ولی چند اشتباه ساده باعث می‌شه نتیجه دیرتر بیاد یا حتی آسیب ببینن.\nاول از همه، نادیده گرفتن گرم کردن؛ همیشه قبل از وزنه زدن چند دقیقه بدنت رو آماده کن.\nدوم، انتخاب وزنه‌ی نامناسب؛ نه خیلی سبک که تمرین بی‌اثر بشه، نه خیلی سنگین که فرم حرکت به‌هم بریزه.\nدر نهایت، نداشتن برنامه‌ی منظم و پیگیری پیشرفت از مهم‌ترین دلایل توقف روند پیشرفته.",
  },
  {
    slug: "how-to-build-a-nutrition-plan",
    title: "چطور برنامه غذایی متناسب با هدفت بچینی؟",
    excerpt: "تفاوت رژیم چربی‌سوزی و عضله‌سازی رو ساده توضیح می‌دم.",
    content:
      "برنامه غذایی باید کاملاً متناسب با هدف، سطح فعالیت و شرایط بدنی خودت طراحی بشه؛ یک نسخه‌ی ثابت برای همه جواب نمی‌ده.\nبرای چربی‌سوزی، کسری کالری کنترل‌شده همراه با پروتئین کافی اهمیت زیادی داره.\nبرای عضله‌سازی، مازاد کالری هدفمند به همراه تمرین قدرتی منظم لازمه.",
  },
  {
    slug: "home-vs-gym-training",
    title: "تمرین در خانه یا باشگاه؟",
    excerpt: "مزایا و محدودیت‌های هر کدوم رو با هم مقایسه می‌کنیم.",
    content:
      "تمرین در خانه انعطاف زمانی بیشتری داره ولی معمولاً امکانات محدودتره.\nتمرین در باشگاه دسترسی به تجهیزات متنوع و نظارت مستقیم مربی رو فراهم می‌کنه.\nبهترین انتخاب به هدف، بودجه و سبک زندگی خودت بستگی داره؛ می‌تونیم با هم تصمیم بگیریم.",
  },
  {
    slug: "recovery-and-rest-days",
    title: "چرا روزهای استراحت به‌اندازه‌ی تمرین مهم‌ان؟",
    excerpt: "نقش ریکاوری در پیشرفت و جلوگیری از آسیب‌دیدگی.",
    content:
      "عضله‌ها در زمان استراحت رشد می‌کنن، نه فقط حین تمرین.\nکم‌خوابی و نبود روزهای استراحت کافی می‌تونه باعث افت عملکرد و افزایش ریسک آسیب بشه.\nبرنامه‌ی تمرینی خوب همیشه شامل روزهای ریکاوری برنامه‌ریزی‌شده‌ست.",
  },
  {
    slug: "mindset-and-motivation",
    title: "چطور انگیزه‌ت رو در طول مسیر حفظ کنی؟",
    excerpt: "چند تکنیک ساده برای موندن روی مسیر تمرین.",
    content:
      "هدف‌گذاری کوچیک و قابل‌اندازه‌گیری کمک می‌کنه پیشرفتت رو ببینی و انگیزه بگیری.\nثبت پیشرفت (عکس، اندازه، رکورد وزنه) خیلی مؤثرتر از فقط تکیه به حس شخصیه.\nداشتن مربی و همراه توی این مسیر، احتمال ادامه‌دادن رو به‌شدت بالا می‌بره.",
  },
  {
    slug: "warm-up-and-mobility",
    title: "اهمیت گرم کردن و تحرک‌پذیری قبل از تمرین",
    excerpt: "چند حرکت ساده که ریسک آسیب رو کم می‌کنه.",
    content:
      "گرم کردن مناسب جریان خون رو به عضلات افزایش می‌ده و بدن رو برای تمرین آماده می‌کنه.\nحرکات تحرک‌پذیری مفاصل قبل از وزنه زدن ریسک آسیب رو به‌طور محسوسی کم می‌کنه.\n۵ تا ۱۰ دقیقه گرم کردن هدفمند، جزء ثابت هر برنامه تمرینی خوبیه.",
  },
];

// Ordered newest-first; `sortOrder` is assigned from the array index below.
// Instagram serves no public metadata to unauthenticated clients (every post URL hits a
// login wall), so cover images are saved by hand into public/instagram/<shortcode>.jpg.
const instagramPosts = [
  { shortcode: "DXtb2bZDdcO", type: "REEL", thumbnail: "/instagram/DXtb2bZDdcO.jpg" },
  { shortcode: "DS0aVP-DVWo", type: "REEL", thumbnail: "/instagram/DS0aVP-DVWo.jpg" },
  { shortcode: "DP68wlaDZEj", type: "POST", thumbnail: "/instagram/DP68wlaDZEj.jpg" },
  { shortcode: "DPcARlRiWkp", type: "REEL", thumbnail: "/instagram/DPcARlRiWkp.jpg" },
  { shortcode: "DPWynxdDVu9", type: "REEL", thumbnail: "/instagram/DPWynxdDVu9.jpg" },
  { shortcode: "DPPPS_mjT0l", type: "POST", thumbnail: "/instagram/DPPPS_mjT0l.jpg" },
];

const testimonials = [
  { studentName: "شاگرد مربی", content: "با برنامه اختصاصی و پیگیری روزانه، توی سه ماه به هدفم رسیدم." },
  { studentName: "شاگرد مربی", content: "مربیگری آنلاین خیلی منظم و دقیق بود، انگار حضوری تمرین می‌کردم." },
  { studentName: "شاگرد مربی", content: "برنامه تغذیه و تمرین با هم خیلی نتیجه بهتری داد." },
  { studentName: "شاگرد مربی", content: "همیشه سریع جواب می‌ده و برنامه رو با شرایط من تنظیم می‌کنه." },
  { studentName: "شاگرد مربی", content: "حس می‌کنم واقعاً کنارمه، نه فقط یک برنامه‌ی خشک و ثابت." },
  { studentName: "شاگرد مربی", content: "تمرین حضوری در باشگاه با اصلاح مستقیم حرکات خیلی کمکم کرد." },
];

const packages = [
  {
    title: "پلن پایه",
    description: "شروع مربیگری آنلاین با برنامه تمرینی اختصاصی",
    price: 990,
    periodLabel: "ماهانه",
    type: "ONLINE",
    features: JSON.stringify(["برنامه تمرینی اختصاصی", "یک بار اصلاح برنامه", "پشتیبانی پیامی"]),
    highlighted: false,
  },
  {
    title: "پلن حرفه‌ای",
    description: "برنامه کامل تمرین و تغذیه با پیگیری هفتگی",
    price: 1990,
    periodLabel: "ماهانه",
    type: "ONLINE",
    features: JSON.stringify([
      "برنامه تمرینی + تغذیه",
      "پیگیری هفتگی پیشرفت",
      "اصلاح نامحدود برنامه",
      "پشتیبانی مستقیم",
    ]),
    highlighted: true,
  },
  {
    title: "پلن VIP",
    description: "بالاترین سطح همراهی آنلاین",
    price: 3490,
    periodLabel: "ماهانه",
    type: "ONLINE",
    features: JSON.stringify([
      "همه امکانات پلن حرفه‌ای",
      "تماس تصویری هفتگی",
      "برنامه اختصاصی مسابقات",
    ]),
    highlighted: false,
  },
  {
    title: "۸ جلسه حضوری",
    description: "تمرین حضوری در باشگاه، شیراز",
    price: 2490,
    periodLabel: "ماهانه",
    type: "IN_PERSON",
    features: JSON.stringify(["۲ جلسه در هفته در باشگاه", "اصلاح مستقیم تکنیک", "برنامه تمرینی همراه"]),
    highlighted: false,
  },
  {
    title: "۱۲ جلسه حضوری",
    description: "تمرین حضوری در باشگاه، شیراز",
    price: 3490,
    periodLabel: "ماهانه",
    type: "IN_PERSON",
    features: JSON.stringify([
      "۳ جلسه در هفته در باشگاه",
      "برنامه تمرینی + تغذیه",
      "پیگیری مستمر پیشرفت",
    ]),
    highlighted: true,
  },
  {
    title: "خصوصی نامحدود",
    description: "تمرین حضوری در باشگاه، شیراز",
    price: 5990,
    periodLabel: "ماهانه",
    type: "IN_PERSON",
    features: JSON.stringify(["جلسات نامحدود در باشگاه", "برنامه کاملاً اختصاصی", "پشتیبانی همیشگی"]),
    highlighted: false,
  },
];

async function main() {
  await prisma.galleryItem.deleteMany();
  for (const item of galleryItems) {
    await prisma.galleryItem.create({ data: item });
  }

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: { ...post, publishedAt: new Date() },
    });
  }

  // Upsert rather than delete+recreate so re-seeding keeps existing row ids stable.
  for (const [index, post] of instagramPosts.entries()) {
    await prisma.instagramPost.upsert({
      where: { shortcode: post.shortcode },
      update: { ...post, sortOrder: index },
      create: { ...post, sortOrder: index },
    });
  }

  await prisma.testimonial.deleteMany();
  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }

  await prisma.package.deleteMany();
  for (const pkg of packages) {
    await prisma.package.create({ data: pkg });
  }

  console.log("Seed completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
