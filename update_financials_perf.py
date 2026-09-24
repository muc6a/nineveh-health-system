import os

file_path = "src/components/FinancialReports.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Add visibleRows state
state_import = "const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');"
state_new = """const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [visibleRows, setVisibleRows] = useState(50);"""

content = content.replace(state_import, state_new)

# Modify the table mapping to slice fines
map_old = "{fines.length > 0 ? fines.map((fine, idx) => ("
map_new = "{fines.length > 0 ? fines.slice(0, visibleRows).map((fine, idx) => ("

content = content.replace(map_old, map_new)

# Add a Load More button at the end of the table
table_end = "          </tbody>\n        </table>"
load_more_btn = """          </tbody>
        </table>
        {fines.length > visibleRows && (
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => setVisibleRows(prev => prev + 50)}
              className="px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors"
            >
              عرض المزيد
            </button>
          </div>
        )}"""

content = content.replace(table_end, load_more_btn)

# Reset visibleRows when filter changes
# Actually, the selectedTeamFilter state already exists. We can just add a useEffect to reset.
reset_effect = """  const [visibleRows, setVisibleRows] = useState(50);
  
  React.useEffect(() => {
    setVisibleRows(50);
  }, [selectedTeamFilter, penaltyRequests]);"""

content = content.replace("  const [visibleRows, setVisibleRows] = useState(50);", reset_effect)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("FinancialReports updated.")
