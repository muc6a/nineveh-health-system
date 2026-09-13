import re

def fix():
    path = "src/pages/LabDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the unclosed {hasPerm('receiveSamples') && (
    if "{hasPerm('receiveSamples') && (<button" in content:
        # The button ends with </button> followed by a newline, but missing )}
        # Let's replace the exact block that is missing )}
        
        # Look for the incomingReqs span end and the </button>
        target = """{incomingReqs.length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'incoming' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>{incomingReqs.length}</span>
              )}
            </button>"""
            
        replacement = target + ")}"
        content = content.replace(target, replacement)
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix()
