import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/InspectionForm.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# The modal string starts with {/* Smart Trigger Closure Modal */} and ends before export default
match = re.search(r'(\s*{/\* Smart Trigger Closure Modal \*/}.*?)(export default InspectionForm;)', content, re.DOTALL)
if match:
    modal_code = match.group(1)
    
    # Remove the floating modal from the bottom
    content = content.replace(modal_code, "")
    
    # Insert it before the last </div>
    target = """    </div>
  );
};"""
    
    replacement = modal_code + """    </div>
  );
};"""

    content = content.replace(target, replacement)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed InspectionForm.jsx structure")
else:
    print("Could not find the modal code")
