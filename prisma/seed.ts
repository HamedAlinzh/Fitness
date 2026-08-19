import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

// Mirrors src/lib/auth/password.ts. Duplicated rather than imported because the seed
// runs under tsx outside the Next.js build, where the "server-only" import would fail.
async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

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

// The last two are left unapproved so the admin panel's approval queue is not empty.
const testimonials = [
  { studentName: "شاگرد مربی", content: "با برنامه اختصاصی و پیگیری روزانه، توی سه ماه به هدفم رسیدم.", approved: true },
  { studentName: "شاگرد مربی", content: "مربیگری آنلاین خیلی منظم و دقیق بود، انگار حضوری تمرین می‌کردم.", approved: true },
  { studentName: "شاگرد مربی", content: "برنامه تغذیه و تمرین با هم خیلی نتیجه بهتری داد.", approved: true },
  { studentName: "شاگرد مربی", content: "همیشه سریع جواب می‌ده و برنامه رو با شرایط من تنظیم می‌کنه.", approved: true },
  { studentName: "شاگرد مربی", content: "حس می‌کنم واقعاً کنارمه، نه فقط یک برنامه‌ی خشک و ثابت.", approved: false },
  { studentName: "شاگرد مربی", content: "تمرین حضوری در باشگاه با اصلاح مستقیم حرکات خیلی کمکم کرد.", approved: false },
];

// Sample consultation requests so the panel has data to show; the real ones now come
// from the public multi-step form at /contact.
const leads = [
  { name: "بازدیدکننده نمونه", phone: "09120000001", preferredChannel: "whatsapp", goal: "FAT_LOSS", level: "BEGINNER", mode: "online", daysPerWeek: 3, hasInjury: false, status: "NEW", message: "سلام، برای برنامه آنلاین چربی‌سوزی می‌خواستم راهنمایی بگیرم." },
  { name: "بازدیدکننده نمونه", phone: "09120000002", preferredChannel: "telegram", telegramUsername: "sample_user", goal: "MUSCLE_GAIN", level: "INTERMEDIATE", mode: "in-person", daysPerWeek: 4, hasInjury: false, status: "NEW", message: "امکان تمرین حضوری در شیراز رو دارم، هزینه‌ها چطوره؟" },
  { name: "بازدیدکننده نمونه", phone: "09120000003", preferredChannel: "call", goal: "GENERAL_FITNESS", level: "BEGINNER", mode: "not-sure", daysPerWeek: 2, hasInjury: true, injuryNote: "دیسک کمر خفیف دارم.", status: "CONTACTED", message: "تازه می‌خوام شروع کنم و نمی‌دونم کدوم پلن مناسبمه." },
];

/**
 * Every plan is online: coaching is sold to students inside and outside Iran, and
 * in-person work in Shiraz is arranged by message rather than listed as a package (see
 * the note rendered under the plans on /pricing).
 *
 * `priceToman` is whole toman. These are starting values only — the coach edits prices
 * from /admin/packages, so re-running the seed will overwrite any edits made there.
 */
const packages = [
  {
    title: "نیمه‌خصوصی آنلاین — ۱۲ جلسه",
    description:
      "برنامه اختصاصی، فیلم حرکات و جلسات آنلاین در فضای تمرین خودت. مناسب شاگردان داخل و خارج از کشور.",
    priceToman: 3_200_000,
    periodLabel: "۱۲ جلسه",
    type: "ONLINE",
    features: JSON.stringify([
      "برنامه تمرینی کاملاً شخصی‌سازی‌شده",
      "فیلم آموزشی تک‌تک حرکات",
      "۲ تا ۳ جلسه آنلاین در فضای تمرین خودت",
      "ارسال ویدیو برای بررسی و اصلاح فرم حرکت",
    ]),
    highlighted: true,
  },
  {
    title: "نیمه‌خصوصی آنلاین — ۸ جلسه",
    description:
      "همان پلن نیمه‌خصوصی با تعداد جلسات کمتر، برای شروع کوتاه‌تر.",
    priceToman: 2_900_000,
    periodLabel: "۸ جلسه",
    type: "ONLINE",
    features: JSON.stringify([
      "برنامه تمرینی کاملاً شخصی‌سازی‌شده",
      "فیلم آموزشی تک‌تک حرکات",
      "۲ تا ۳ جلسه آنلاین در فضای تمرین خودت",
      "ارسال ویدیو برای بررسی و اصلاح فرم حرکت",
    ]),
    highlighted: false,
  },
  {
    title: "پلن VIP آنلاین",
    description:
      "بالاترین سطح همراهی: هر ۱۲ جلسه به‌صورت زنده و تصویری کنار تو تمرین می‌کنیم.",
    priceToman: 5_500_000,
    periodLabel: "۱۲ جلسه",
    type: "ONLINE",
    features: JSON.stringify([
      "هر ۱۲ جلسه به‌صورت زنده و تصویری",
      "برنامه تمرینی کاملاً شخصی‌سازی‌شده",
      "فیلم آموزشی تک‌تک حرکات",
      "ارسال ویدیو برای بررسی و اصلاح فرم حرکت",
    ]),
    highlighted: false,
  },
  {
    title: "کلاس گروهی آنلاین",
    description:
      "گروه‌های ۲ تا ۴ نفره؛ مناسب تمرین با دوست، خواهر و برادر یا هم‌خانه.",
    priceToman: 2_499_000,
    periodLabel: "۱۲ جلسه",
    type: "ONLINE",
    features: JSON.stringify([
      "گروه‌های کوچک ۲ تا ۴ نفره",
      "۱۲ جلسه آنلاین و زنده",
      "برنامه تمرینی متناسب با گروه",
      "ارسال ویدیو برای بررسی و اصلاح فرم حرکت",
    ]),
    highlighted: false,
  },
];

/**
 * Creates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD. If no password is given a
 * random one is generated and printed once — this avoids shipping a guessable default
 * password, which would be a real hole given the panel is reachable at /admin/login.
 * An existing admin's password is never overwritten by re-seeding.
 */
async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const phone = process.env.ADMIN_PHONE ?? "09000000000";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role !== "ADMIN") {
      await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
    }
    console.log(`Admin already exists: ${email} (password unchanged)`);
    return;
  }

  const generated = !process.env.ADMIN_PASSWORD;
  const password = process.env.ADMIN_PASSWORD ?? randomBytes(9).toString("base64url");

  await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME ?? "مدیر سایت",
      email,
      phone,
      role: "ADMIN",
      passwordHash: await hashPassword(password),
    },
  });

  console.log(`\nAdmin account created:\n  email:    ${email}`);
  console.log(
    generated
      ? `  password: ${password}   <-- generated, shown only once\n`
      : "  password: (from ADMIN_PASSWORD)\n"
  );
}

async function main() {
  await seedAdmin();

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

  await prisma.lead.deleteMany();
  for (const lead of leads) {
    await prisma.lead.create({ data: lead });
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
