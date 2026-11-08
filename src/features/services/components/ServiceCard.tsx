import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import type { ServiceItem } from '../types';

interface ServiceCardProps {
  service: ServiceItem;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, className = '' }) => {
  return (
    <div
      className={`card craft-border flex flex-col justify-between p-8 bg-white rounded-2xl transition-all duration-[var(--duration-sheet,500ms)] ease-[var(--ease-sheet)] hover:-translate-y-1 hover:shadow-md ${className}`}
    >
      <div>
        {service.badge && (
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2A7B7E]/10 text-[#2A7B7E] mb-3">
            {service.badge}
          </span>
        )}

        {service.icon && (
          <div className="w-12 h-12 rounded-xl bg-[#2A7B7E]/10 text-[#2A7B7E] flex items-center justify-center mb-4 craft-border">
            {service.icon}
          </div>
        )}

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {service.title}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {service.description}
        </p>

        {service.highlights && service.highlights.length > 0 && (
          <div className="border-t border-slate-100 pt-4 mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Included Operations
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {service.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#2A7B7E]/10 text-[#2A7B7E] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Link
        to={`/contact?service=${encodeURIComponent(service.serviceParam)}`}
        className="btn btn-outline w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all duration-[var(--duration-sheet,500ms)] ease-[var(--ease-sheet)]"
      >
        <span>Request {service.title}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
