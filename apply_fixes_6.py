import re

def fix_accountant_panel_6():
    with open("src/pages/AccountantPanel.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Wrap "التقارير" (dashboard) with hasPerm("financialReports")
    dashboard_btn_regex = r"(<button\s*onClick=\{\(\) => \{\s*setActiveTab\(\"dashboard\"\);\s*setIsSidebarOpen\(false\);\s*\}\}\s*className=\{`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 \$\{\s*activeTab === \"dashboard\"[\s\S]*?<span>التقارير<\/span>\s*<\/button>)"
    dashboard_btn_replacement = r"""{hasPerm("financialReports") && (
              \1
            )}"""
    content = re.sub(dashboard_btn_regex, dashboard_btn_replacement, content)

    # 2. Wrap "التبليغات" (directives) with hasPerm("showDirectivesPage") || hasPerm("sendDirective") || hasPerm("replyDirective")
    directives_btn_regex = r"(<button\s*onClick=\{\(\) => \{\s*setActiveTab\(\"directives\"\);\s*setIsSidebarOpen\(false\);\s*\}\}\s*className=\{`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between \$\{\s*activeTab === \"directives\"[\s\S]*?<\/button>)"
    directives_btn_replacement = r"""{(hasPerm("showDirectivesPage") || hasPerm("sendDirective") || hasPerm("replyDirective")) && (
              \1
            )}"""
    content = re.sub(directives_btn_regex, directives_btn_replacement, content)

    # 3. Wrap "جرد اليومية والمطابقة" (reconciliation) with hasPerm("dailyInventory")
    # And add "الغرامات والإيرادات" (financials) right after it!
    reconciliation_btn_regex = r"(<button\s*onClick=\{\(\) => \{\s*setActiveTab\(\"reconciliation\"\);\s*setIsSidebarOpen\(false\);\s*\}\}\s*className=\{`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 \$\{\s*activeTab === \"reconciliation\"[\s\S]*?<span>جرد اليومية والمطابقة<\/span>\s*<\/button>)"
    reconciliation_btn_replacement = r"""{hasPerm("dailyInventory") && (
              \1
            )}

            {hasPerm("payFines") && (
              <button
                onClick={() => {
                  setActiveTab("ext_financials");
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === "ext_financials"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                }`}
              >
                <CreditCard className="w-4.5 h-4.5" />
                <span>الغرامات والإيرادات</span>
              </button>
            )}"""
    content = re.sub(reconciliation_btn_regex, reconciliation_btn_replacement, content)

    # 4. Add the body for ext_financials right after ext_reports (or somewhere in the list of embedded tabs)
    ext_reports_regex = r"(\{activeTab === \"ext_reports\" && \(\s*<div className=\"w-full h-full min-h-\[85vh\]\">\s*<TeamDashboard embeddedTab=\"geographic\" \/>\s*<\/div>\s*\)\})"
    ext_reports_replacement = r"""\1

        {activeTab === "ext_financials" && (
          <div className="w-full h-full min-h-[85vh]">
            <TeamDashboard embeddedTab="financials" />
          </div>
        )}"""
    content = re.sub(ext_reports_regex, ext_reports_replacement, content)

    with open("src/pages/AccountantPanel.jsx", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_accountant_panel_6()
    print("Done fixes 6")
