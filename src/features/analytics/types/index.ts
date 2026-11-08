export interface PageTrackPayload {
  path: string;
  timestamp?: number;
  referrer?: string;
}

export interface AnalyticsMetric {
  label: string;
  value: number | string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}
