import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/metadata";
import { getDict, getLocale } from "@/i18n/server";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Phone, MapPin, Send, type LucideIcon } from "lucide-react";
import PageHeader from "@/components/sections/PageHeader";
import Container from "@/components/ui/Container";
import ConsultationForm from "@/components/sections/ConsultationForm";
import FadeIn from "@/components/motion/FadeIn";
import {
  COACH_PHONE,
  COACH_PHONE_DISPLAY,
  COACH_PHONE_DISPLAY_INTL,
} from "@/lib/site-contact";
import { telUrl } from "@/lib/contact-links";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).contact;
  return pageMetadata(lang, "/contact", {
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

type ContactItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
};

export default async function ContactPage() {
  const { contact: t } = await getDict();
  const lang = await getLocale();
  const contactInfo: ContactItem[] = [
    {
      icon: Phone,
      label: t.phone,
      value: lang === "fa" ? COACH_PHONE_DISPLAY : COACH_PHONE_DISPLAY_INTL,
      href: telUrl(COACH_PHONE),
    },
    { icon: Send, label: t.directMessage, value: t.viaForm },
    { icon: MapPin, label: t.location, value: t.city },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <section className="py-16">
        <Container className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <FadeIn className="flex flex-col gap-4">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-3xl border border-red-100 bg-white p-5 text-start"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <div className="text-xs text-ink-500">{item.label}</div>
                  {item.href ? (
                    <a
                      href={item.href}
                      dir="ltr"
                      className="block text-base font-extrabold text-red-600 transition-colors hover:text-red-700"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div className="text-sm font-bold text-ink-900">
                      {item.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </FadeIn>

          {/*
            The form is the point of this page, so on phones it comes before the contact
            cards — otherwise it starts below the fold and looks like the page is just
            static info. On md+ the original two-column order is restored.
          */}
          <FadeIn delay={0.1} className="order-first md:order-none">
            <ConsultationForm lang={lang} />
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
