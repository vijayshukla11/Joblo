import React, { useState } from 'react';
import { 
  BarChart2, TrendingUp, Users, Search, Briefcase, 
  ArrowUpRight, ArrowDownRight, Globe, Share2, Award, Calendar
} from 'lucide-react';

interface MetricDetail {
  id: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  color: string;
  chartData: { label: string; val: number }[];
}

export default function AnalyticsAdmin() {
  const [selectedMetric, setSelectedMetric] = useState<string>('mau');
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; val: number; index: number } | null>(null);

  const metrics: Record<string, MetricDetail> = {
    mau: {
      id: 'mau',
      name: 'Monthly Active Candidates',
      value: '184,200',
      change: '+12.4%',
      isPositive: true,
      color: 'indigo',
      chartData: [
        { label: 'Jan', val: 120000 },
        { label: 'Feb', val: 135000 },
        { label: 'Mar', val: 150000 },
        { label: 'Apr', val: 145000 },
        { label: 'May', val: 165000 },
        { label: 'Jun', val: 184200 }
      ]
    },
    searches: {
      id: 'searches',
      name: 'Gazette Search Volume',
      value: '421,900',
      change: '+18.9%',
      isPositive: true,
      color: 'emerald',
      chartData: [
        { label: 'Jan', val: 290000 },
        { label: 'Feb', val: 310000 },
        { label: 'Mar', val: 350000 },
        { label: 'Apr', val: 390000 },
        { label: 'May', val: 410000 },
        { label: 'Jun', val: 421900 }
      ]
    },
    sourcing: {
      id: 'sourcing',
      name: 'Corporate Sourcing Volume',
      value: '84,500',
      change: '+22.1%',
      isPositive: true,
      color: 'cyan',
      chartData: [
        { label: 'Jan', val: 55000 },
        { label: 'Feb', val: 62000 },
        { label: 'Mar', val: 68000 },
        { label: 'Apr', val: 74000 },
        { label: 'May', val: 81000 },
        { label: 'Jun', val: 84500 }
      ]
    },
    retention: {
      id: 'retention',
      name: 'Application CTR',
      value: '4.82%',
      change: '-0.4%',
      isPositive: false,
      color: 'amber',
      chartData: [
        { label: 'Jan', val: 5.2 },
        { label: 'Feb', val: 5.0 },
        { label: 'Mar', val: 4.9 },
        { label: 'Apr', val: 4.8 },
        { label: 'May', val: 4.85 },
        { label: 'Jun', val: 4.82 }
      ]
    }
  };

  const channels = [
    { name: 'Organic Gazette Search', value: '45%', count: '82,890', color: 'bg-emerald-500' },
    { name: 'Corporate HR Direct', value: '30%', count: '55,260', color: 'bg-indigo-500' },
    { name: 'n8n Scraper Syndication', value: '15%', count: '27,630', color: 'bg-cyan-500' },
    { name: 'Social/Referral Networks', value: '10%', count: '18,420', color: 'bg-amber-500' }
  ];

  const keywords = [
    { query: 'ASO Ministry of External Affairs', volume: '14,250 queries', trend: 'Up 45%' },
    { query: 'NIC Software Architect Grade-A', volume: '11,900 queries', trend: 'Up 12%' },
    { query: 'Next.js 15 Senior Developer', volume: '8,420 queries', trend: 'Up 88%' },
    { query: 'Karnataka State Gazetted exam dates', volume: '7,150 queries', trend: 'Up 15%' }
  ];

  const activeMetric = metrics[selectedMetric];
  const chartPoints = activeMetric.chartData;

  // Render variables for dynamic responsive SVG Area chart
  const maxVal = Math.max(...chartPoints.map(p => p.val)) * 1.1;
  const minVal = Math.min(...chartPoints.map(p => p.val)) * 0.9;
  const range = maxVal - minVal;

  const width = 500;
  const height = 150;
  const paddingLeft = 40;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 20;

  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;

  const points = chartPoints.map((p, idx) => {
    const x = paddingLeft + (idx / (chartPoints.length - 1)) * graphWidth;
    const y = paddingTop + graphHeight - ((p.val - minVal) / range) * graphHeight;
    return { x, y, label: p.label, val: p.val };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') 
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            <span>Sourcing & Platform Conversion Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Analyze candidate search behavior, monitor corporate recruitment flow, and verify programmatic marketing indexes.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>REAL-TIME AUDIT INDEX: JUN 2026</span>
        </div>
      </div>

      {/* INTERACTIVE SELECTOR CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.values(metrics).map((metric) => {
          const isSelected = selectedMetric === metric.id;
          return (
            <button
              key={metric.id}
              onClick={() => {
                setSelectedMetric(metric.id);
                setHoveredPoint(null);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-800'
              }`}
            >
              <p className={`text-[9px] font-bold uppercase tracking-wider font-mono ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                {metric.name}
              </p>
              
              <div className="flex items-baseline justify-between mt-1.5 gap-2">
                <span className="text-sm sm:text-base font-extrabold font-heading tracking-tight">{metric.value}</span>
                <span className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded border flex items-center ${
                  metric.isPositive 
                    ? isSelected ? 'bg-emerald-950 border-emerald-900 text-emerald-300' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : isSelected ? 'bg-rose-950 border-rose-900 text-rose-300' : 'bg-rose-50 border-rose-100 text-rose-700'
                }`}>
                  {metric.isPositive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                  <span>{metric.change}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* CORE BENTO ROW: CHART & BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART PORT */}
        <div className="lg:col-span-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-800 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>{activeMetric.name} Trend Line</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
              Drag over points for coordinates
            </span>
          </div>

          {/* CUSTOM SVG CHART ENGINE */}
          <div className="relative">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = paddingTop + graphHeight * ratio;
                return (
                  <line 
                    key={idx} 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={width - paddingRight} 
                    y2={y} 
                    stroke="#f1f5f9" 
                    strokeWidth="1" 
                  />
                );
              })}

              {/* Area Under Curve */}
              <path 
                d={areaD} 
                fill={`url(#area-gradient-${activeMetric.color})`} 
                opacity="0.2"
              />

              {/* Main Line */}
              <path 
                d={pathD} 
                fill="none" 
                stroke={activeMetric.color === 'emerald' ? '#10b981' : activeMetric.color === 'cyan' ? '#06b6d4' : activeMetric.color === 'amber' ? '#f59e0b' : '#6366f1'} 
                strokeWidth="2" 
                strokeLinecap="round"
              />

              {/* Interaction Circles */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={hoveredPoint?.index === idx ? "5" : "3"} 
                    fill={activeMetric.color === 'emerald' ? '#10b981' : activeMetric.color === 'cyan' ? '#06b6d4' : activeMetric.color === 'amber' ? '#f59e0b' : '#6366f1'} 
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint({ label: p.label, val: p.val, index: idx })}
                  />
                </g>
              ))}

              {/* Bottom labels */}
              {points.map((p, idx) => (
                <text 
                  key={idx} 
                  x={p.x} 
                  y={height - 4} 
                  fontSize="8" 
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill="#94a3b8" 
                  textAnchor="middle"
                >
                  {p.label}
                </text>
              ))}

              {/* Side grid labels */}
              <text x="32" y={paddingTop + 4} fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#cbd5e1" textAnchor="end">
                {selectedMetric === 'retention' ? `${maxVal.toFixed(1)}%` : Math.round(maxVal).toLocaleString()}
              </text>
              <text x="32" y={paddingTop + graphHeight + 4} fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#cbd5e1" textAnchor="end">
                {selectedMetric === 'retention' ? `${minVal.toFixed(1)}%` : Math.round(minVal).toLocaleString()}
              </text>

              {/* Definitions */}
              <defs>
                <linearGradient id="area-gradient-indigo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="area-gradient-emerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="area-gradient-cyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="area-gradient-amber" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Tooltip coordinates */}
            {hoveredPoint && (
              <div className="absolute top-2 right-2 bg-slate-900 text-white rounded-lg p-2 text-[10px] font-mono font-bold flex flex-col shadow-md animate-fadeIn select-none border border-slate-800">
                <span>COORD: {hoveredPoint.label}</span>
                <span className="text-emerald-400">VALUE: {hoveredPoint.val.toLocaleString()}{selectedMetric === 'retention' ? '%' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* TRAFFIC SOURCE CHANNELS */}
        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
          <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Sourcing Channel Breakdowns</span>
          </p>

          <div className="space-y-3">
            {channels.map((channel) => (
              <div key={channel.name} className="space-y-1.5 text-[10px]">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-600">{channel.name}</span>
                  <span className="text-slate-800 font-mono">{channel.value} ({channel.count})</span>
                </div>
                
                <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${channel.color}`} 
                    style={{ width: channel.value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* POPULAR SEARCH QUERIES TABLE */}
      <div className="space-y-3">
        <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
          <Search className="w-4 h-4 text-emerald-600" />
          <span>Active Search Term Registrations</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {keywords.map((kw, index) => (
            <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between space-y-1.5">
              <span className="font-extrabold text-slate-900 truncate" title={kw.query}>{kw.query}</span>
              
              <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="text-slate-400">{kw.volume}</span>
                <span className="text-emerald-600 bg-emerald-50 px-1 rounded uppercase tracking-wider">{kw.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
