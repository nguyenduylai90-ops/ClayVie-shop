'use client';

import { useState } from 'react';
import { TrendingUp, BarChart2, Calendar, DollarSign, ShoppingBag } from 'lucide-react';

interface Order {
  total_price: number;
  status: string;
  created_at: string;
}

export default function DashboardChart({ orders = [] }: { orders: Order[] }) {
  const [filter, setFilter] = useState<'7days' | '30days' | '12months'>('7days');
  const [metric, setMetric] = useState<'revenue' | 'count'>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 1. Aggregate for Last 7 Days
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
      const dateStr = d.toISOString().split('T')[0];

      const dayOrders = orders.filter(o => {
        const oDate = new Date(o.created_at).toISOString().split('T')[0];
        return oDate === dateStr;
      });

      const revenue = dayOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total_price, 0);

      const count = dayOrders.filter(o => o.status !== 'cancelled').length;

      data.push({ label, fullLabel: `Ngày ${label}`, revenue, count });
    }
    return data;
  };

  // 2. Aggregate for Last 30 Days
  const getLast30DaysData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const labelStr = d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
      // Only show text labels on every 5th item to keep it clean on mobile
      const label = i % 5 === 0 ? labelStr : '';
      const dateStr = d.toISOString().split('T')[0];

      const dayOrders = orders.filter(o => {
        const oDate = new Date(o.created_at).toISOString().split('T')[0];
        return oDate === dateStr;
      });

      const revenue = dayOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total_price, 0);

      const count = dayOrders.filter(o => o.status !== 'cancelled').length;

      data.push({ label, fullLabel: `Ngày ${labelStr}`, revenue, count });
    }
    return data;
  };

  // 3. Aggregate for Last 12 Months
  const getLast12MonthsData = () => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString('vi-VN', { month: 'numeric', year: '2-digit' });
      const fullLabel = d.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
      const month = d.getMonth();
      const year = d.getFullYear();

      const monthOrders = orders.filter(o => {
        const oDate = new Date(o.created_at);
        return oDate.getMonth() === month && oDate.getFullYear() === year;
      });

      const revenue = monthOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total_price, 0);

      const count = monthOrders.filter(o => o.status !== 'cancelled').length;

      data.push({ label: `T${label}`, fullLabel, revenue, count });
    }
    return data;
  };

  // Select active dataset
  const activeData = filter === '7days' 
    ? getLast7DaysData() 
    : filter === '30days' 
      ? getLast30DaysData() 
      : getLast12MonthsData();

  // Find max value for height ratio calculation
  const maxVal = Math.max(...activeData.map(d => metric === 'revenue' ? d.revenue : d.count), 1);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-sm space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-pink-600 animate-pulse" />
            Biểu Đồ Tình Hình Kinh Doanh
          </h2>
          <p className="text-xs text-gray-400 mt-1">Phân tích kết quả doanh thu & đơn hàng thời gian thực</p>
        </div>

        {/* Time filters */}
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 self-start sm:self-center">
          <button
            onClick={() => setFilter('7days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition duration-200 ${
              filter === '7days' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            7 ngày
          </button>
          <button
            onClick={() => setFilter('30days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition duration-200 ${
              filter === '30days' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            30 ngày
          </button>
          <button
            onClick={() => setFilter('12months')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition duration-200 ${
              filter === '12months' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            12 tháng
          </button>
        </div>
      </div>

      {/* Metric Selector Toggles (2 Charts in 1) */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setMetric('revenue')}
          className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 ${
            metric === 'revenue' 
              ? 'bg-pink-50/50 border-pink-200 shadow-sm text-pink-700' 
              : 'bg-white border-gray-100 hover:border-gray-200 text-gray-500'
          }`}
        >
          <div className={`p-2.5 rounded-xl ${metric === 'revenue' ? 'bg-pink-100' : 'bg-gray-50'}`}>
            <DollarSign size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Xem theo</div>
            <div className="text-sm font-black">Doanh thu thực tế</div>
          </div>
        </button>

        <button
          onClick={() => setMetric('count')}
          className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 ${
            metric === 'count' 
              ? 'bg-blue-50/50 border-blue-200 shadow-sm text-blue-700' 
              : 'bg-white border-gray-100 hover:border-gray-200 text-gray-500'
          }`}
        >
          <div className={`p-2.5 rounded-xl ${metric === 'count' ? 'bg-blue-100' : 'bg-gray-50'}`}>
            <ShoppingBag size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Xem theo</div>
            <div className="text-sm font-black">Số lượng đơn hàng</div>
          </div>
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="relative pt-8 pb-2">
        {/* Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-xl text-xs shadow-xl flex flex-col items-center gap-0.5 border border-slate-700/50 z-20 animate-fade-in"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {activeData[hoveredIndex].fullLabel}
            </span>
            <span className="font-black text-sm">
              {metric === 'revenue' 
                ? `${activeData[hoveredIndex].revenue.toLocaleString('vi-VN')} đ` 
                : `${activeData[hoveredIndex].count} đơn hàng`
              }
            </span>
          </div>
        )}

        {/* The Grid Graph */}
        <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 px-2 relative border-b border-gray-100">
          {/* Horizontal lines */}
          <div className="absolute inset-x-0 top-0 border-t border-gray-50/50 h-0 pointer-events-none" />
          <div className="absolute inset-x-0 top-1/3 border-t border-gray-50/50 h-0 pointer-events-none" />
          <div className="absolute inset-x-0 top-2/3 border-t border-gray-50/50 h-0 pointer-events-none" />

          {activeData.map((d, index) => {
            const val = metric === 'revenue' ? d.revenue : d.count;
            const percent = (val / maxVal) * 100;
            const heightStyle = { height: `${Math.max(percent, 4)}%` }; // Min height of 4% for design aesthetics

            return (
              <div 
                key={index} 
                className="flex-1 flex flex-col items-center group h-full justify-end cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Bar */}
                <div 
                  style={heightStyle}
                  className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 ease-out group-hover:scale-x-105 shadow-sm ${
                    metric === 'revenue'
                      ? hoveredIndex === index 
                        ? 'bg-gradient-to-t from-pink-600 to-rose-500 shadow-md shadow-pink-100' 
                        : 'bg-gradient-to-t from-pink-500/80 to-rose-400/80'
                      : hoveredIndex === index 
                        ? 'bg-gradient-to-t from-blue-600 to-indigo-500 shadow-md shadow-blue-100' 
                        : 'bg-gradient-to-t from-blue-500/80 to-indigo-400/80'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between px-2 pt-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">
          {activeData.map((d, index) => (
            <div 
              key={index} 
              className={`flex-1 text-center truncate ${
                hoveredIndex === index ? (metric === 'revenue' ? 'text-pink-600 font-black' : 'text-blue-600 font-black') : ''
              }`}
            >
              {d.label}
            </div>
          ))}
        </div>
      </div>
      
      {/* Short Summary Text */}
      <div className="flex items-center gap-2 text-xs text-gray-500 justify-center bg-gray-50/50 py-2.5 rounded-2xl border border-gray-50">
        <BarChart2 size={14} className="text-gray-400 animate-bounce" />
        <span>Rê chuột vào các cột để xem chi tiết từng mốc thời gian</span>
      </div>
    </div>
  );
}
