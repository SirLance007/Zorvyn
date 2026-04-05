import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#EC4899'];

const CategoryChart = ({ data }) => {
  // Filter for expenses only for the distribution chart
  const expenseData = data
    .filter(item => item.type === 'EXPENSE')
    .map(item => ({
      name: item.category,
      value: item.total
    }));

  if (expenseData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500 italic">
        No expense data to display
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Expense Distribution</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;
