import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "start";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-right"
      )}
    >
      {eyebrow && <Badge>{eyebrow}</Badge>}
      <h2 className="max-w-2xl text-3xl font-extrabold text-ink-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className={cn("max-w-xl text-base leading-8 text-ink-500")}>
          {description}
        </p>
      )}
    </div>
  );
}
