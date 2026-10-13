import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import {
  COACH_PHONE,
  COACH_PHONE_DISPLAY,
  COACH_PHONE_DISPLAY_INTL,
} from "@/lib/site-contact";
import { telUrl, whatsappUrl } from "@/lib/contact-links";
import { getDict, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";

/**
 * The phone number, written large and bold, as the primary way in. Choosing a plan does
 * not require the consultation form — that form is for people who want free advice, and
 * making a ready-to-buy visitor answer six questions first only loses them. The form is
 * still offered underneath, as the secondary option it should be.
 *
 * Plain anchors rather than the shared `Button`, so `tel:` opens the dialer instead of
 * being routed through `next/link`, and so the whole band works with no JS at all.
 */
export default async function ContactBand() {
  const lang = await getLocale();
  const { band } = (await getDict()).pricing;

  return (
    <section className="py-12">
      <Container>
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-red-100 bg-white p-8 text-center sm:p-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-extrabold text-ink-900 sm:text-2xl">
              {band.title}
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-7 text-ink-500">
              {band.description}
            </p>
          </div>

          <a
            href={telUrl(COACH_PHONE)}
            dir="ltr"
            className="text-3xl font-extrabold tracking-wider text-red-600 transition-colors hover:text-red-700 sm:text-4xl"
          >
            {lang === "fa" ? COACH_PHONE_DISPLAY : COACH_PHONE_DISPLAY_INTL}
          </a>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={telUrl(COACH_PHONE)}
              className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600"
            >
              <Phone className="h-4 w-4" />
              {band.directCall}
            </a>
            <a
              href={whatsappUrl(COACH_PHONE, band.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-red-200 px-6 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              <MessageCircle className="h-4 w-4" />
              {band.whatsapp}
            </a>
          </div>

          <p className="text-xs text-ink-500">
            {band.formPrompt}{" "}
            <Link
              href={localePath(lang, "/contact")}
              className="font-semibold text-red-600 underline underline-offset-4 hover:text-red-700"
            >
              {band.formLink}
            </Link>{" "}
            {band.formSuffix}
          </p>
        </div>
      </Container>
    </section>
  );
}
