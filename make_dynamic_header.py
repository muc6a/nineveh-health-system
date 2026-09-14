import re

path = "src/components/GlobalHeader.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the component definition to include user and dynamic logic
new_comp = """export const GlobalHeader = ({ title: overrideTitle, subtitle: overrideSubtitle, icon, showPrintButton = false, children }) => {
  const { hasPerm, user } = useContext(AppContext);

  const getDynamicGreeting = () => {
    if (!user) return { title: overrideTitle, subtitle: overrideSubtitle };

    const hour = new Date().getHours();
    let timeGreeting = 'أهلاً بك';
    let timeEmoji = '👋';

    if (hour >= 5 && hour < 12) {
      timeGreeting = 'صباح الخير';
      timeEmoji = '🌅';
    } else if (hour >= 12 && hour < 18) {
      timeGreeting = 'مساء الخير';
      timeEmoji = '🌇';
    } else {
      timeGreeting = 'مساء الخير';
      timeEmoji = '🌙';
    }

    let roleTitle = 'زميلنا العزيز';
    let dashboardName = 'لوحة التحكم الرئيسية لـ ';
    const sector = user.sector || 'عموم محافظة نينوى';

    switch (user.role) {
      case 'accountant':
        roleTitle = 'سيدي المحاسب';
        dashboardName = 'الإدارة المالية لـ ' + sector;
        break;
      case 'lab':
        roleTitle = 'دكتور المختبر';
        dashboardName = 'لوحة المختبر المركزي - ' + sector;
        break;
      case 'team_leader':
        roleTitle = 'قائد الفريق الميداني';
        dashboardName = 'اللوحة الميدانية لـ ' + sector;
        break;
      case 'director':
        roleTitle = 'السيد المدير العام';
        dashboardName = 'غرفة العمليات المركزية لـ ' + sector;
        break;
      case 'executive':
      case 'central_director':
        roleTitle = 'مدير الرقابة المركزية';
        dashboardName = 'غرفة العمليات المركزية لـ ' + sector;
        break;
      case 'admin':
        roleTitle = 'مدير النظام';
        dashboardName = 'لوحة تحكم النظام الشاملة';
        break;
      default:
        dashboardName += sector;
    }

    return {
      title: `${timeGreeting} ${roleTitle} ${timeEmoji}`,
      subtitle: `طاب يومك، تتصفح الآن ${dashboardName}`
    };
  };

  const dynamicInfo = getDynamicGreeting();
  const displayTitle = dynamicInfo.title || overrideTitle;
  const displaySubtitle = dynamicInfo.subtitle || overrideSubtitle;

  return ("""

content = re.sub(r"export const GlobalHeader = \(\{.*?\}\) => \{\n  const \{ hasPerm \} = useContext\(AppContext\);\n\n  return \(", new_comp, content, flags=re.DOTALL)

# Replace title and subtitle rendering
content = content.replace("{title}", "{displayTitle}")
content = content.replace("{subtitle}", "{displaySubtitle}")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("GlobalHeader is now dynamic!")
