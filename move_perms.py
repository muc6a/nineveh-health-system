import sys

def main():
    with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
        sap = f.read()

    # The block to extract starts exactly at `        const PERMISSIONS_TABS = [`
    # and ends after `viewComprehensiveFinancialReports: 'management'\n        };`
    start_str = "        const PERMISSIONS_TABS = ["
    end_str = "viewComprehensiveFinancialReports: 'management'\n        };"
    
    idx_start = sap.find(start_str)
    idx_end = sap.find(end_str)
    
    if idx_start != -1 and idx_end != -1:
        # include the end_str
        idx_end_full = idx_end + len(end_str)
        extracted_block = sap[idx_start:idx_end_full]
        
        # Remove it from the original place (inside IIFE)
        # But wait, it's used inside the IIFE too! If we move it outside, it's accessible everywhere!
        # Actually, let's just move it to just above `export const SuperAdminPanel = () => {`
        # Because we need it globally available.
        sap = sap[:idx_start] + sap[idx_end_full:]
        
        # Fix indentation
        lines = extracted_block.split('\n')
        fixed_lines = []
        for line in lines:
            if line.startswith('        '):
                fixed_lines.append(line[8:])
            elif line.startswith('          '):
                fixed_lines.append(line[8:])
            else:
                fixed_lines.append(line)
                
        fixed_block = '\n'.join(fixed_lines)
        
        # Insert before export const SuperAdminPanel
        comp_start = "export const SuperAdminPanel = () => {"
        comp_idx = sap.find(comp_start)
        if comp_idx != -1:
            sap = sap[:comp_idx] + fixed_block + "\n\n" + sap[comp_idx:]
            
        with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
            f.write(sap)
        print("Successfully moved permissions constants.")
    else:
        print("Could not find the block to extract.")

if __name__ == "__main__":
    main()
