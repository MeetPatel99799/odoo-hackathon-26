import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonthlyRevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-panel border border-border rounded-xl shadow-lg p-6 w-full h-80 flex flex-col justify-center items-center text-gray-500">
        No revenue data available
      </div>
    );
  }

  return (
    <div className="bg-panel border border-border rounded-xl shadow-lg p-6 w-full h-80 flex flex-col">
      <h3 className="text-lg font-bold text-text mb-4 tracking-tight">Monthly Revenue</h3>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
              axisLine={{ stroke: '#374151' }} 
              tickLine={false} 
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `${value >= 1000 ? (value/1000) + 'k' : value}`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }}
              itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
              formatter={(value) => [`$${value}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
