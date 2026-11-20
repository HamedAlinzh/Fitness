import { Quote, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import { hashVariant } from "@/lib/placeholder-icon";

export type TestimonialData = {
  id: string;
  studentName: string;
  studentImage: string | null;
  content: string;
  rating: number;
};

export default function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
  return (
    <Card className="relative flex h-full flex-col gap-5 overflow-hidden text-start">
      <Quote aria-hidden className="absolute top-4 end-5 h-10 w-10 fill-red-500/15 text-transparent" />
      <div className="flex gap-0.5 text-red-400">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="relative flex-1 text-base leading-8 text-ink-700">«{testimonial.content}»</p>
      <div className="flex items-center gap-3 border-t border-white/[0.06] pt-4">
        <PlaceholderMedia
          icon={Star}
          variant={hashVariant(testimonial.id)}
          src={testimonial.studentImage}
          alt={testimonial.studentName}
          className="h-10 w-10 rounded-full"
        />
        <div>
          <div className="text-sm font-bold text-ink-900">{testimonial.studentName}</div>
        </div>
      </div>
    </Card>
  );
}
