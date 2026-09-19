import re

path = "src/pages/AccountantPanel.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

imports_str = """
import SmartTasks from '../components/SmartTasks';
import OperationsRoom from '../components/OperationsRoom';
import { EstablishmentsManager } from '../components/EstablishmentsManager';
import { FinancialReports } from '../components/FinancialReports';
import { LabManager } from '../components/LabManager';
"""

if "import { LabManager }" not in content:
    content = content.replace("import { AnimatedLogo }", imports_str + "\nimport { AnimatedLogo }")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
