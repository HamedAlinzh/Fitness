import type { Metadata } from "next";
import { Sparkles, GraduationCap, Users2, MapPinned, MessageSquareHeart } from "lucide-react";
import PageHeader from "@/components/sections/PageHeader";
import Container from "@/components/ui/Container";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import FadeIn from "@/components/motion/FadeIn";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "درباره من | کوچ فیت",
  description: "آشنایی با مربی، مسیر مربیگری و نگاه من به تمرین و تناسب اندام.",
};

const reasons = [
  {
    icon: GraduationCap,
    title: "دانش تمرینی و تغذیه‌ای",
    description: "دوره‌های تخصصی تمرین قدرتی و تغذیه ورزشی رو گذروندم و همیشه به‌روز می‌مونم.",
  },
  {
    icon: Users2,
    title: "برنامه کاملاً شخصی‌سازی‌شده",
    description: "برای هر شاگرد بر اساس هدف، سطح و شرایط زندگیش برنامه می‌نویسم، نه یک نسخه‌ی ثابت.",
  },
  {
    icon: MapPinned,
    title: "حضوری در شیراز، آنلاین همه‌جا",
    description: "چه بخوای حضوری تمرین کنی چه از هر شهری آنلاین همراهت باشم، امکانش هست.",
  },
  {
    icon: MessageSquareHeart,
    title: "پیگیری مداوم",
    description: "کنارت می‌مونم، برنامه رو با پیشرفتت تنظیم می‌کنم و همیشه در دسترسم.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="درباره من"
        title="مربی‌ای که کنارت می‌مونه، نه فقط یک برنامه می‌ده"
      />

      <section className="py-16">
        <Container className="grid items-center gap-10 md:grid-cols-2">
          <FadeIn>
            <PlaceholderMedia
              icon={Sparkles}
              variant={1}
              className="aspect-[4/5] w-full rounded-[2.5rem]"
            />
          </FadeIn>

          <FadeIn delay={0.15} className="flex flex-col gap-4 text-right">
            <p className="leading-8 text-ink-500">
              چند سالیه که در باشگاه‌های شیراز مربیگری می‌کنم و کنار شاگردهام هستم تا به
              هدفشون برسن؛ چه چربی‌سوزی، چه عضله‌سازی، چه فقط یک سبک زندگی سالم‌تر.
            </p>
            <p className="leading-8 text-ink-500">
              باور دارم بهترین برنامه، برنامه‌ایه که با زندگی واقعی هرکس هماهنگ باشه؛ برای
              همین قبل از نوشتن هر برنامه، اول واقعاً گوش می‌دم به هدف، محدودیت‌ها و شرایط
              شاگردم.
            </p>
            <p className="leading-8 text-ink-500">
              برای شاگردهای شیرازی حضوری تمرین می‌دم و برای بقیه‌ی ایران، مربیگری آنلاین با
              پیگیری روزانه و ارتباط مستقیم رو ارائه می‌دم.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-red-50/60 py-20">
        <Container className="flex flex-col gap-12">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">
              چرا با من تمرین کنی؟
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {reasons.map((reason, index) => (
              <FadeIn key={reason.title} delay={index * 0.1}>
                <div className="flex items-start gap-4 rounded-3xl border border-red-100 bg-white p-6 text-right">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <reason.icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="font-bold text-ink-900">{reason.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-ink-500">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
