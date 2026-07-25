const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicQRScore.jsx', 'utf8');

// 1. Add isClosed variable
content = content.replace(
  "const isNonCompliant = score < (config.warningScore || 70);",
  "const isNonCompliant = score < (config.warningScore || 70);\n  const isClosed = establishment.status === 'closed';"
);

// 2. Change Score display
const oldScore = `              <span className={\`text-5xl font-black tracking-tight drop-shadow-[0_0_15px_rgba(13,148,136,0.3)] \${
                isCompliant ? 'text-emerald-500 dark:text-teal-400' :
                isMonitoring ? 'text-amber-500' : 'text-red-500'
              }\`}>
                {score}%
              </span>`;

const newScore = `              {isClosed ? (
                <span className="text-4xl md:text-5xl font-black text-rose-500 drop-shadow-[0_0_15px_rgba(225,29,72,0.5)] my-2">
                  مغلق 🚫
                </span>
              ) : (
                <span className={\`text-5xl font-black tracking-tight drop-shadow-[0_0_15px_rgba(13,148,136,0.3)] \${
                  isCompliant ? 'text-emerald-500 dark:text-teal-400' :
                  isMonitoring ? 'text-amber-500' : 'text-red-500'
                }\`}>
                  {score}%
                </span>
              )}`;

content = content.replace(oldScore, newScore);

// 3. Change Status Badges
const oldBadges = `            {/* Status badges */}
            <div className="space-y-3 mb-6">
              <div className="w-full">
                {isCompliant && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-teal-400 text-xs font-black flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <span>🟢 ملتزم بالاشتراطات الصحية والبيئية داخل الصالة</span>
                  </div>
                )}
                {isMonitoring && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-black flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 shrink-0" />
                    <span>🟡 تحت المتابعة والتحسين المستمر</span>
                  </div>
                )}
                {isNonCompliant && (
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black flex items-center justify-center gap-2">
                    <AlertOctagon className="w-5 h-5 shrink-0" />
                    <span>🔴 غير ملتزم - اتخاذ إجراءات وتنبيهات صحية</span>
                  </div>
                )}
              </div>`;

const newBadges = `            {/* Status badges */}
            <div className="space-y-3 mb-6">
              <div className="w-full">
                {isClosed ? (
                  <div className="p-4 rounded-2xl bg-rose-500 text-white text-sm font-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.3)] border border-rose-400 text-center leading-relaxed">
                    <AlertOctagon className="w-6 h-6 shrink-0" />
                    <span>تم إغلاق المنشأة {establishment.closureDuration ? \`لمدة (\${establishment.closureDuration})\` : 'مؤقتاً'} بسبب المخالفات الصحية</span>
                  </div>
                ) : isCompliant ? (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-teal-400 text-xs font-black flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <span>🟢 ملتزم بالاشتراطات الصحية والبيئية داخل الصالة</span>
                  </div>
                ) : isMonitoring ? (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-black flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 shrink-0" />
                    <span>🟡 تحت المتابعة والتحسين المستمر</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black flex items-center justify-center gap-2">
                    <AlertOctagon className="w-5 h-5 shrink-0" />
                    <span>🔴 غير ملتزم - اتخاذ إجراءات وتنبيهات صحية</span>
                  </div>
                )}
              </div>`;

content = content.replace(oldBadges, newBadges);

fs.writeFileSync('src/pages/PublicQRScore.jsx', content);
console.log('PublicQRScore fixed');
