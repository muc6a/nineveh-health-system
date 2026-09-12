import os
import re

def fix_english_constants():
    filepath = "src/utils/constants.jsx"
    if not os.path.exists(filepath): return
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # We need to add the missing english texts into PERMISSION_DETAILS
    missing_texts = """
  showOperationsRoom: { title: 'الوصول لغرفة العمليات', desc: 'يسمح للحساب بالوصول إلى لوحة غرفة العمليات المركزية.' },
  showReportsPage: { title: 'الخريطة الجغرافية', desc: 'يسمح برؤية الخارطة التفاعلية وتوزيع المنشآت على أحياء وأقضية المحافظة.' },
  showDirectivesPage: { title: 'رؤية التبليغات والتوجيهات', desc: 'يسمح للحساب بفتح صفحة "التوجيهات" لمشاهدة المراسلات الإدارية الواردة والصادرة.' },
  showPublicEvalsPage: { title: 'شكاوى المواطنين', desc: 'يسمح برؤية ومتابعة شكاوى المواطنين التي تصل عبر البوابة العامة.' },
  showDeliveryPage: { title: 'شكاوى خدمة التوصيل', desc: 'يسمح بمتابعة البلاغات الواردة بخصوص شركات التوصيل والدراجات النارية.' },
  showLabPage: { title: 'لوحة المختبر', desc: 'الوصول المباشر إلى واجهات المختبر المركزي.' },
"""
    # Wait, the ones like showReportsPage are ALREADY THERE!
    # Let's check which ones are actually missing.
    pass

if __name__ == "__main__":
    fix_english_constants()
