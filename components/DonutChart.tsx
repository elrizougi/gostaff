'use client';
import React from 'react';

interface DonutChartProps {
  value: number;
  total: number;
  primaryColor?: string;
  bgColor?: string;
  size?: number;
  stroke?: number;
  title?: string;
  subtitle?: string;
}

export default function DonutChart({
  value,
  total,
  primaryColor = '#2563eb',
  bgColor = '#e5e7eb',
  size = 96,
  stroke = 10,
  title,
  subtitle,
}: DonutChartProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, total > 0 ? value / total : 0));
  const dash = progress * circumference;

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={primaryColor}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div>
        <div className="text-lg font-medium">{value}</div>
        <div className="text-xs text-gray-500">من {total}</div>
        {title ? <div className="text-sm font-medium mt-1">{title}</div> : null}
        {subtitle ? <div className="text-xs text-gray-500">{subtitle}</div> : null}
      </div>
    </div>
  );
}
