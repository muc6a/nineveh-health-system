import re

def update_order():
    path = "src/utils/constants.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # We need to move "strategic" to the top of PERMISSIONS_TABS
    # Let's find PERMISSIONS_TABS array
    match = re.search(r"export const PERMISSIONS_TABS = \[\s*(.*?)\s*\];", content, re.DOTALL)
    if match:
        tabs_str = match.group(1)
        # It's an array of objects
        # We can split it roughly by "  { id:"
        tabs = [t for t in tabs_str.split("  { id:") if t.strip()]
        
        strategic_idx = -1
        for i, tab in enumerate(tabs):
            if "'strategic'" in tab:
                strategic_idx = i
                break
                
        if strategic_idx != -1:
            strategic_tab = tabs.pop(strategic_idx)
            tabs.insert(0, strategic_tab)
            
            new_tabs_str = "  { id:".join([""] + tabs)
            # Remove leading empty from join
            if new_tabs_str.startswith("  { id:"):
                pass
            else:
                new_tabs_str = new_tabs_str[len("  { id:"):] # this is just string manipulation, it's safer to just replace
            
            # actually let's reconstruct it safer:
            new_tabs_str = "  { id:" + "  { id:".join(tabs)
            new_tabs_str = new_tabs_str.replace("  { id:  { id:", "  { id:")
            
            new_content = content[:match.start(1)] + "\n" + new_tabs_str + "\n" + content[match.end(1):]
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)

if __name__ == "__main__":
    update_order()
