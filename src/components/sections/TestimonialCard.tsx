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
    <Card className="flex h-full flex-col gap-4 text-right">
      <Quote className="h-6 w-6 text-red-300" />
      <p className="flex-1 text-sm leading-7 text-ink-500">«{testimonial.content}»</p>
      <div className="flex items-center gap-3">
        <PlaceholderMedia
          icon={Star}
          variant={hashVariant(testimonial.id)}
          src={testimonial.studentImage}
          alt={testimonial.studentName}
          className="h-10 w-10 rounded-full"
        />
        <div>
          <div className="text-sm font-bold text-ink-900">{testimonial.studentName}</div>
          <div className="flex gap-0.5 text-red-400">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
