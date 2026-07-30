const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// 1. Evaluations Tab
content = content.replace('📝 محرر بنود التقييم', '📝 تعديل استمارة التفتيش');

// 2. Appearance Tab (was "🎨 تخصيص مظهر النظام" or "⚙️ التهيئة العامة والتخزين")
content = content.replace('⚙️ التهيئة العامة والتخزين', '⚙️ إعدادات الواجهة والصور');

// 3. Public CMS
content = content.replace('🌐 واجهة المواطن (CMS)', '🌐 إدارة البوابات الخارجية');
content = content.replace('🌐 واجهة المواطن (CMS)', '🌐 إدارة البوابات الخارجية'); // replacing in heading too if it exists

// 4. Database (was "💾 النسخ الاحتياطي")
content = content.replace('💾 النسخ الاحتياطي', '💾 النسخ الاحتياطي للبيانات');

// 5. System Controls (was "🛡️ تحكم النظام ومعايير القياس")
content = content.replace('🛡️ تحكم النظام ومعايير القياس', '🛡️ الصيانة ودرجات التقييم');
content = content.replace('<ShieldAlert className="w-4 h-4" />\n                تحكم النظام ومعايير القياس', '<ShieldAlert className="w-4 h-4" />\n                الصيانة ودرجات التقييم');

// 6. Display Prefs (was "👁️ تخصيص العرض والخطوط" or similar with <Eye />)
content = content.replace('تخصيص العرض والخطوط', 'حجم الخطوط ونمط العرض');
content = content.replace('تخصيص العرض والخطوط', 'حجم الخطوط ونمط العرض'); // replace all occurrences

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('Renamed all tabs to simpler names.');
