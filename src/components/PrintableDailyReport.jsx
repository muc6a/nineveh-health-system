import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

export const PrintableDailyReport = () => {
  const { establishments, teams } = useContext(AppContext);

  // Statistics
  const total = establishments.length;
  const compliantCount = establishments.filter(e => e.score >= 90).length;
  const warningCount = establishments.filter(e => e.score >= 70 && e.score < 90).length;
  const criticalCount = establishments.filter(e => e.score < 70).length;

  const chartData = [
    { name: 'ملتزم (90-100)', value: compliantCount, color: '#10b981' }, // emerald
    { name: 'مراقب (70-89)', value: warningCount, color: '#f59e0b' },  // amber
    { name: 'مخالف (دون 70)', value: criticalCount, color: '#ef4444' } // red
  ];

  const currentDate = new Date().toLocaleDateString('ar-IQ', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const criticalEstablishments = establishments.filter(e => e.score < 70).slice(0, 10); // Top 10 critical

  return (
    <div className="hidden print:flex flex-col print-only-report bg-white text-black p-6 font-sans w-full min-h-screen relative" dir="rtl">
      
      {/* Official Header */}
      <div className="flex justify-between items-center border-b-[3px] border-slate-800 pb-3 mb-6">
        <div className="text-right leading-tight">
          <h1 className="text-lg font-black">جمهورية العراق</h1>
          <h2 className="text-base font-bold mt-0.5">وزارة الصحة</h2>
          <h3 className="text-sm font-bold mt-0.5">دائرة الصحة العامة</h3>
          <h4 className="text-xs font-semibold mt-0.5">الرقابة الصحية</h4>
        </div>
        <div className="flex flex-col items-center">
          <img src="/logo-ministry.png" alt="شعار وزارة الصحة" className="w-20 h-20 object-contain" />
        </div>
        <div className="text-left text-xs space-y-1">
          <p><strong>العدد:</strong> ر.ص / 1024</p>
          <p><strong>التاريخ:</strong> {currentDate}</p>
          <p><strong>الوقت:</strong> {new Date().toLocaleTimeString('ar-IQ')}</p>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-black underline underline-offset-8">الموقف الإحصائي اليومي للرقابة الصحية</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6 text-center">
        <div className="py-2.5 px-3 border border-slate-800 rounded-lg bg-slate-50/80 shadow-sm">
          <p className="text-xs font-bold mb-1 text-slate-600">إجمالي المنشآت</p>
          <p className="text-xl font-black text-slate-900">{total}</p>
        </div>
        <div className="py-2.5 px-3 border border-emerald-600 rounded-lg bg-emerald-50 text-emerald-900 shadow-sm">
          <p className="text-xs font-bold mb-1 text-emerald-700">الملتزمة بالشروط</p>
          <p className="text-xl font-black">{compliantCount}</p>
        </div>
        <div className="py-2.5 px-3 border border-amber-500 rounded-lg bg-amber-50 text-amber-900 shadow-sm">
          <p className="text-xs font-bold mb-1 text-amber-700">تحت المراقبة</p>
          <p className="text-xl font-black">{warningCount}</p>
        </div>
        <div className="py-2.5 px-3 border border-red-600 rounded-lg bg-red-50 text-red-900 shadow-sm">
          <p className="text-xs font-bold mb-1 text-red-700">مخالفة للضوابط</p>
          <p className="text-xl font-black">{criticalCount}</p>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="border border-slate-800 rounded-lg p-4 mb-6 break-inside-avoid flex flex-col items-center">
        <h3 className="text-sm font-black mb-2 text-center">التوزيع البياني لنسب الامتثال</h3>
        <div className="w-[450px] h-[200px]">
          <BarChart width={450} height={200} data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} axisLine={{ stroke: '#000' }} />
            <YAxis tick={{ fontSize: 10, fill: '#000' }} axisLine={{ stroke: '#000' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>

      {/* Critical Establishments Table */}
      {criticalCount > 0 && (
        <div className="mb-6 break-inside-avoid flex-1">
          <h3 className="text-xs font-black mb-2 border-r-4 border-red-600 pr-2">أبرز المنشآت المخالفة للضوابط (تتطلب تدخلاً عاجلاً)</h3>
          <table className="w-full border-collapse border border-slate-800 text-[11px] text-center">
            <thead>
              <tr className="bg-slate-200 border-b border-slate-800">
                <th className="p-1.5 border-l border-slate-800">ت</th>
                <th className="p-1.5 border-l border-slate-800">اسم المنشأة</th>
                <th className="p-1.5 border-l border-slate-800">القطاع</th>
                <th className="p-1.5 border-l border-slate-800">نسبة التقييم</th>
                <th className="p-1.5 border-l border-slate-800">تاريخ الزيارة</th>
              </tr>
            </thead>
            <tbody>
              {criticalEstablishments.map((est, idx) => (
                <tr key={est.id} className="border-b border-slate-800">
                  <td className="p-1 border-l border-slate-800 font-bold">{idx + 1}</td>
                  <td className="p-1 border-l border-slate-800">{est.name}</td>
                  <td className="p-1 border-l border-slate-800">{est.sector}</td>
                  <td className="p-1 border-l border-slate-800 text-red-700 font-black">{est.score}%</td>
                  <td className="p-1 border-l border-slate-800" dir="ltr">{est.lastInspection}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {criticalCount > 10 && (
            <p className="text-[10px] mt-1 text-slate-500 font-bold">* تم إدراج أول 10 منشآت فقط في هذا الملخص المطبوع.</p>
          )}
        </div>
      )}

      {/* Signatures */}
      <div className="mt-auto grid grid-cols-3 gap-4 text-center break-inside-avoid pt-6">
        <div>
          <p className="font-bold text-xs mb-8">مسؤول قاعدة البيانات</p>
          <p className="font-black text-xs">التوقيع:</p>
          <p className="text-[10px] mt-1">.........................</p>
        </div>
        <div>
          <p className="font-bold text-xs mb-8">مدير قسم الصحة العامة</p>
          <p className="font-black text-xs">التوقيع:</p>
          <p className="text-[10px] mt-1">.........................</p>
        </div>
        <div>
          <p className="font-bold text-xs mb-4">مدير الرقابة الصحية المركزية</p>
          <p className="font-black text-xs mb-1">التوقيع:</p>
          <div className="h-6 flex items-center justify-center">
            <span style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '18px', color: '#1e3a8a', transform: 'rotate(-5deg)' }}>
              Dr. Ibtihal Ghazi
            </span>
          </div>
          <p className="text-[8px] text-slate-500 mt-1">توقيع إلكتروني معتمد</p>
        </div>
      </div>
    </div>
  );
};
