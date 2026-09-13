# RBAC Core Engine & Blank Screens Fix

يستهدف هذا التحديث إصلاح مشكلة عدم توافق الصلاحيات مع مكونات العرض (Blank/Black Screens) التي ظهرت بعد توحيد الشريط الجانبي (UnifiedSidebar) بين كافة اللوحات (فرق ميدانية، محاسبين، إدارة).

## المشكلة الجذرية (Root Cause)
عندما تم بناء `UnifiedSidebar.jsx` ليكون الشريط الجانبي الموحد، تم توحيد مُعرفات الأقسام (Tab IDs) مثل:
- `strategic` للإدارة المتقدمة
- `establishments` لإدارة المنشآت
- `financials` للمالية

لكن في المقابل، لوحات الفريق الميداني (`TeamDashboard.jsx`) والمحاسب (`AccountantPanel.jsx`) لا تزال تنتظر المُعرفات القديمة (مثل `summary`، `directory`، `ext_summary`، `dashboard`).
بسبب هذا الاختلاف المعماري، عندما يضغط المستخدم على "الإدارة المتقدمة"، يُرسل الشريط الجانبي أمر بفتح `strategic`، لكن واجهة الفريق الميداني لا تتعرف عليه (لأنها تبحث عن `summary`)، مما يؤدي إلى فشل في الـ Rendering وظهور **شاشة فارغة/سوداء**. بالإضافة إلى ذلك، بعض الأقسام الأساسية للفرق (مثل الخريطة الرقابية والمهام الذكية) غير موجودة في الشريط الموحد.

## Proposed Changes

### 1. `src/components/UnifiedSidebar.jsx`
سنقوم بتوسيع قاموس الأقسام (Tab Config) ليتعرف على كافة الأقسام الممكنة في النظام وربطها بالصلاحيات الصحيحة (RBAC)، ليتم عرضها فقط إذا كان الحساب يمتلك الصلاحية:
- **[MODIFY]** إضافة قسم `smart_tasks` (المهام الذكية) مع `showCondition: hasPerm('showSmartTasks')`
- **[MODIFY]** إضافة قسم `map` (الخريطة الرقابية) مع `showCondition: hasPerm('showSectorMap')`
- **[MODIFY]** إضافة قسم `team_reports` (إحصائيات الميدان) مع `showCondition: hasPerm('showFieldTeamsStats')`

### 2. `src/pages/TeamDashboard.jsx` (لوحة الفرق الميدانية)
سنقوم بتحديث معمارية استقبال الأقسام لتتطابق تماماً مع `UnifiedSidebar`:
- **[MODIFY]** استبدال `activeTab === 'summary'` بـ `activeTab === 'strategic'` لربط الإدارة المتقدمة.
- **[MODIFY]** استبدال `activeTab === 'directory'` بـ `activeTab === 'establishments'` لربط إدارة المنشآت.
- **[MODIFY]** التأكد من توافق أقسام (المهام الذكية) و(الخريطة).

### 3. `src/pages/AccountantPanel.jsx` (لوحة المحاسب)
سنقوم بضبط خريطة توجيه الصفحات الداخلية للمحاسب لتستجيب لأوامر الشريط الموحد:
- **[MODIFY]** ربط `activeTab === 'financials'` باللوحة المالية الرئيسية للمحاسب (بدلاً من `dashboard`).
- **[MODIFY]** استبدال المسميات الخارجية مثل `ext_summary` بـ `strategic` لتوحيد عرض الإدارة المتقدمة للمحاسبين.
- **[MODIFY]** استبدال `ext_directory` بـ `establishments`.

## User Review Required
> [!IMPORTANT]
> **التأثير المتوقع:**
> 1. اختفاء كافة الشاشات السوداء والفارغة فوراً.
> 2. استجابة لحظية لأي صلاحية تمنحها عبر مركز الصلاحيات، حيث ستظهر في الشريط الجانبي، وعند النقر عليها ستفتح الشاشة المطلوبة بشكل سليم 100%.

هل توافق على هذه التعديلات المعمارية للبدء بالتنفيذ الفوري؟
