import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { AnalyticsMetric } from "../types";

interface MetricsBadgeProps {
  metric: AnalyticsMetric;
  className?: string;
}

export const MetricsBadge: React.FC<MetricsBadgeProps> = ({ metric, className = "" }) => {
  return (
    <div
      className={`inline-flex items-center gap-3 px-3.5 py-2 rounded-lg bg-slate-900 text-slate-100 craft-border ${className}`}
    >
      <span className="text-xs font-medium text-slate-400">{metric.label}:</span>
      <span className="tabular-nums font-semibold text-sm tracking-tight text-teal-300">
        {metric.value}
      </span>
      {metric.change && (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
            metric.trend === "up"
              ? "bg-emerald-500/10 text-emerald-400"
              : metric.trend === "down"
              ? "bg-rose-500/10 text-rose-400"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {metric.trend === "up" && <TrendingUp className="w-3 h-3" />}
          {metric.trend === "down" && <TrendingDown className="w-3 h-3" />}
          {metric.trend === "neutral" && <Minus className="w-3 h-3" />}
          {metric.change}
        </span>
      )}
    </div>
  );
};
