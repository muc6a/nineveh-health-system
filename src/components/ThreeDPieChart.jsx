import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';

export const ThreeDPieChart = ({ title, data, onRedClick }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      <h3 className="w-full text-right text-xs font-black text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1.5 justify-between">
        <span>{title}</span>
        <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 cursor-pointer hover:scale-110 transition-transform" />
      </h3>
      
      <div className="w-full h-48" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              onClick={(e) => {
                if (e && e.key === 'red' && onRedClick) onRedClick();
              }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  style={{ cursor: entry.key === 'red' && onRedClick ? 'pointer' : 'default', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' }}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', textAlign: 'right' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        {data.map((item, idx) => (
          <button
            key={idx}
            onClick={() => item.key === 'red' && onRedClick ? onRedClick() : null}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-300 text-right ${
              item.key === 'red' && onRedClick ? 'hover:bg-red-500/10 cursor-pointer active:scale-95' : 'cursor-default'
            }`}
          >
            <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-none mb-1">{item.label}</span>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-none">{item.value} {item.unit || 'منشأة'}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThreeDPieChart;
