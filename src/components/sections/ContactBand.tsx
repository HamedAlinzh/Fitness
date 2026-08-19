import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import { COACH_PHONE, COACH_PHONE_DISPLAY } from "@/lib/site-contact";
import { telUrl, whatsappUrl } from "@/lib/contact-links";

/**
 * The phone number, written large and bold, as the primary way in. Choosing a plan does
 * not require the consultation form — that form is for people who want free advice, and
 * making a ready-to-buy visitor answer six questions first only loses them. The form is
 * still offered underneath, as the secondary option it should be.
 *
 * Plain anchors rather than the shared `Button`, so `tel:` opens the dialer instead of
 * being routed through `next/link`, and so the whole band works with no JS at all.
 */
export default function ContactBand({
  title = "برای شروع فقط کافیست تماس بگیری",
  description = "لازم نیست فرمی پر کنی. زنگ بزن یا پیام بده، پلن مناسبت را باهم انتخاب می‌کنیم و بعد لینک پرداخت برایت می‌فرستم.",
}: {
  title?: string;
  description?: string;
}) {
  const message = "سلام، درباره پلن‌های مربیگری می‌خواستم صحبت کنم.";

  return (
    <section className="py-12">
      <Container>
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-red-100 bg-white p-8 text-center sm:p-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-extrabold text-ink-900 sm:text-2xl">
              {title}
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-7 text-ink-500">
              {description}
            </p>
          </div>

          <a
            href={telUrl(COACH_PHONE)}
            dir="ltr"
            className="text-3xl font-extrabold tracking-wider text-red-600 transition-colors hover:text-red-700 sm:text-4xl"
          >
            {COACH_PHONE_DISPLAY}
          </a>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={telUrl(COACH_PHONE)}
              className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600"
            >
              <Phone className="h-4 w-4" />
              تماس مستقیم
            </a>
            <a
              href={whatsappUrl(COACH_PHONE, message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-red-200 px-6 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              <MessageCircle className="h-4 w-4" />
              پیام در واتساپ
            </a>
          </div>

          <p className="text-xs text-ink-500">
            ترجیح می‌دهی اول مشورت بگیری؟{" "}
            <Link
              href="/contact"
              className="font-semibold text-red-600 underline underline-offset-4 hover:text-red-700"
            >
              فرم مشاوره رایگان
            </Link>{" "}
            هم هست.
          </p>
        </div>
      </Container>
    </section>
  );
}
