import re

def fix_smart_tasks():
    path = "src/components/SmartTasks.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    routing_hook = """
  // Smart Auto-Routing: Auto-select team based on establishment's sector
  React.useEffect(() => {
    if (selectedEstId && establishments && teams) {
      const est = establishments.find(e => e.id === selectedEstId);
      if (est && est.sector) {
        // Try to find a matching team by sector
        const matchedTeam = teams.find(t => 
           (t.name && t.name.includes(est.sector)) || 
           (t.sector && t.sector === est.sector) ||
           (t.sector && est.sector.includes(t.sector))
        );
        if (matchedTeam) {
          setSelectedTeamId(matchedTeam.id);
        }
      }
    }
  }, [selectedEstId, establishments, teams]);
"""
    if "Smart Auto-Routing" not in content:
        # insert after useState
        content = re.sub(r"(const \[selectedTeamId, setSelectedTeamId\] = useState\([^)]+\);\n)", r"\1" + routing_hook, content)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

def fix_ops_room():
    path = "src/components/OperationsRoom.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    routing_hook = """
  // Smart Auto-Routing: Auto-select team based on establishment's sector
  React.useEffect(() => {
    if (selectedEstId && establishments && teams) {
      const est = establishments.find(e => e.id === selectedEstId);
      if (est && est.sector) {
        const matchedTeam = teams.find(t => 
           (t.name && t.name.includes(est.sector)) || 
           (t.sector && t.sector === est.sector) ||
           (t.sector && est.sector.includes(t.sector))
        );
        if (matchedTeam) {
          setSelectedTeamId(matchedTeam.id);
        }
      }
    }
  }, [selectedEstId, establishments, teams]);
"""
    if "Smart Auto-Routing" not in content:
        content = re.sub(r"(const \[selectedTeamId, setSelectedTeamId\] = useState\([^)]+\);\n)", r"\1" + routing_hook, content)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    fix_smart_tasks()
    fix_ops_room()
