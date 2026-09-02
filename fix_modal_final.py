import re

with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """              )}
            </div>
          </div>
        </div>
        )}"""

new_block = """              )}
            </div>
          </div>
        </div>
        </div>
        )}"""

if old_block in content:
    content = content.replace(old_block, new_block, 1) # Only replace first occurrence
    print("Replaced successfully!")
else:
    print("Block not found!")

with open('src/pages/AccountantPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
