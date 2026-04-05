import React from 'react';
import { ShieldCheck, HeartPulse, AlertCircle, TrendingUp } from 'lucide-react';

const FinancialHealth = ({ totalIncome, totalExpenses }) => {
  const score = totalIncome > 0 ? Math.min(Math.ceil((1 - totalExpenses / totalIncome) * 100), 100) : 0;
  
  let label = 'Strong';
  let color = 'text-emerald-400';
  let bgColor = 'bg-emerald-500/10';
  let icon = <ShieldCheck className="w-6 h-6" />;
  
  if (score < 50) {
    label = 'Attention Needed';
    color = 'text-red-400';
    bgColor = 'bg-red-500/10';
    icon = <AlertCircle className="w-6 h-6" />;
  } else if (score < 80) {
    label = 'Healthy';
    color = 'text-blue-400';
    bgColor = 'bg-blue-500/10';
    icon = <HeartPulse className="w-6 h-6" />;
  }

  return (
    <div className="h-full flex flex-col p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Financial Health</h3>
        <div className={`p-2 rounded-lg ${bgColor} ${color}`}>
          {icon}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-zinc-800"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={364}
              strokeDashoffset={364 - (364 * Math.max(0, score)) / 100}
              className={`${color} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black text-white">{Math.max(0, score)}</span>
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">SCORE</span>
          </div>
        </div>
        
        <div className="text-center space-y-1">
          <p className={`font-bold text-lg ${color}`}>{label}</p>
          <p className="text-xs text-zinc-500 max-w-[200px]">Based on your income-to-expense ratio this period.</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-zinc-800/50 flex items-center gap-2 text-xs text-zinc-400">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <span>Your savings rate is {Math.max(0, score)}%</span>
      </div>
    </div>
  );
};

export default FinancialHealth;
