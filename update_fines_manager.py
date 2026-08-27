import sys
import re

with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    content = f.read()

# Add import
if 'import { FinesManager }' not in content:
    content = content.replace("import { EvaluationManager } from '../components/EvaluationManager';", "import { EvaluationManager } from '../components/EvaluationManager';\nimport { FinesManager } from '../components/FinesManager';")

# Add fines_booklet button
fines_button = """              <button
                onClick={() => setSubSettingsTab('fines_booklet')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subSettingsTab === 'fines_booklet'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                كراس الغرامات القانونية
              </button>"""

if 'setSubSettingsTab(\'fines_booklet\')' not in content:
    # There are two places with subSettingsTab, one for desktop one for mobile maybe? Or just one?
    # Let's check where `subSettingsTab === 'evaluations'` button is.
    eval_btn_index = content.find("setSubSettingsTab('evaluations')")
    if eval_btn_index != -1:
        # Find the closing button tag
        eval_btn_end = content.find("</button>", eval_btn_index) + 9
        content = content[:eval_btn_end] + "\n" + fines_button + content[eval_btn_end:]

# Add rendering of FinesManager
fines_render = """
              {subSettingsTab === 'fines_booklet' && (
                <FinesManager />
              )}
"""
if '<FinesManager />' not in content:
    eval_render_index = content.find("{subSettingsTab === \"evaluations\" && (")
    if eval_render_index == -1:
        eval_render_index = content.find("{subSettingsTab === 'evaluations' && (")
    
    if eval_render_index != -1:
        eval_render_end = content.find(")}", eval_render_index) + 2
        content = content[:eval_render_end] + "\n" + fines_render + content[eval_render_end:]

with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
    f.write(content)
print("Added FinesManager to SuperAdminPanel.jsx")
