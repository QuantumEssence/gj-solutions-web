import React from 'react';
import type { ServiceItem } from '../types';
import { ServiceCard } from './ServiceCard';

interface ServicesGridProps {
  services: ServiceItem[];
  className?: string;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ services, className = '' }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};
