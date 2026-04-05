import React from 'react';
import { formatCurrency } from '../../utils/currency';

const StatCard = ({ title, value, icon, trend, trendUp, colorClass, isLoading, currency = 'USD' }) => {
  return (
    <div className="relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl shadow-xl overflow-hidden group">
      {/* Decorative background glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${colorClass}`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
          {isLoading ? (
            <div className="h-9 w-32 bg-zinc-800 animate-pulse rounded-lg mt-1" />
          ) : (
            <h3 className="text-2xl font-bold text-white">{formatCurrency(value, currency)}</h3>
          )}
        </div>
        <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50 text-white relative z-10">
          {icon}
        </div>
      </div>
      
      <div className="flex items-center text-sm relative z-10">
        {isLoading ? (
          <div className="h-4 w-24 bg-zinc-800 animate-pulse rounded" />
        ) : (
          <>
            <span className={`flex items-center font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {trendUp ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span className="text-zinc-500 ml-2">vs last month</span>
          </>
        )}
      </div>
    </div>
  );
};

export default StatCard;
