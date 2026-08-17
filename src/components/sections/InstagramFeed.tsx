import { AtSign } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import FadeIn from "@/components/motion/FadeIn";

export default function InstagramFeed() {
  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="اینستاگرام"
          title="آخرین پست‌ها رو دنبال کن"
          description="پشت‌صحنه تمرین‌ها، نکات آموزشی و اتفاقات باشگاه رو توی اینستاگرام می‌بینی."
        />

        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <FadeIn key={index} delay={index * 0.05}>
              <a
                href="#"
                className="group block aspect-square overflow-hidden rounded-2xl"
              >
                <PlaceholderMedia
                  icon={AtSign}
                  variant={index}
                  className="h-full w-full transition-transform group-hover:scale-105"
                />
              </a>
            </FadeIn>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href="#" variant="secondary">
            <AtSign className="h-4 w-4" />
            دنبال کردن در اینستاگرام
          </Button>
        </div>
      </Container>
    </section>
  );
}
