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
        align === "center" ? "items-center text-center" : "items-start text-start"
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-3 text-sm font-bold text-red-400">
          <span aria-hidden className="h-px w-8 bg-red-500" />
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-ink-900 sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-base leading-8 text-ink-500">{description}</p>
      )}
    </div>
  );
}
