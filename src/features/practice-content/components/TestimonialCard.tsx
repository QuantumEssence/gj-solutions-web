import React from "react";
import { motion } from "framer-motion";
import { Quote, Building2 } from "lucide-react";
import type { TestimonialItem } from "../types";

interface TestimonialCardProps {
  testimonial: TestimonialItem;
  index?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  index = 0,
}) => {
  const authorName = testimonial.name || testimonial.author || "Clinic Partner";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.32, 0.72, 0, 1],
      }}
      className="relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
    >
      <Quote className="w-8 h-8 text-teal-600/20 mb-4" />
      <p className="text-slate-700 text-sm md:text-base leading-relaxed italic mb-6">
        "{testimonial.quote}"
      </p>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-900 text-sm">
            {authorName}
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {testimonial.role}
          </p>
        </div>
        {testimonial.clinic && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
            <Building2 className="w-3 h-3 text-teal-600" />
            {testimonial.clinic}
          </span>
        )}
      </div>
    </motion.article>
  );
};
