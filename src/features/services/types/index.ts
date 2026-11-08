import type { ReactNode } from 'react';

export interface ServiceItem {
  id: number | string;
  title: string;
  description: string;
  serviceParam: string;
  highlights: string[];
  icon?: ReactNode;
  iconName?: string;
  badge?: string;
  category?: 'reception' | 'intake' | 'review' | 'general';
}

export interface ServiceTier {
  id: string;
  name: string;
  tagline: string;
  idealFor: string;
  includedServices: string[];
  recommended?: boolean;
}
