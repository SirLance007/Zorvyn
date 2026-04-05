import React from 'react';
import { formatCurrency } from '../../utils/currency';

const TopCategories = ({ data, currency = 'USD' }) => {
  // Sort and filter for expenses, take top 5
  const topExpenses = data
    .filter(item => item.type === 'EXPENSE')
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const maxTotal = topExpenses.length > 0 ? topExpenses[0].total : 0;

  if (topExpenses.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500 italic">
        No expense data available
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <h3 className="text-lg font-semibold text-white mb-6">Spending Analysis</h3>
      <div className="space-y-6 flex-1">
        {topExpenses.map((category, index) => {
          const percentage = (category.total / maxTotal) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-white">{category.category}</span>
                <span className="text-zinc-400">{formatCurrency(category.total, currency)}</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCategories;
