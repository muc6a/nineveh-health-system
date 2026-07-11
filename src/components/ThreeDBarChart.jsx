import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const ThreeDBarChart = ({ title, data }) => {
  return (
    <div className="flex flex-col justify-between h-full w-full">
      <h3 className="text-right text-xs font-black text-slate-800 dark:text-slate-200 mb-4">
        {title}
      </h3>

      <div className="w-full h-48" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(13, 148, 136, 0.1)" />
            <XAxis 
              dataKey="label" 
              tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }}
              tickFormatter={(value) => value.split(' ')[0]} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(13, 148, 136, 0.05)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', textAlign: 'right' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              labelStyle={{ display: 'none' }}
              formatter={(value, name, props) => [ `${value} منشأة`, props.payload.label ]}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={30}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThreeDBarChart;
