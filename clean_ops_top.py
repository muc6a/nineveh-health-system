import re

def clean_top():
    path = "src/components/OperationsRoom.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the top tabs string
    target = """        {(user?.permissions?.showSectorMap || user?.role === 'admin' || user?.role === 'director') && (
          <button onClick={() => setActiveTab('map')} className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'map' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}>
            <Database className="w-4 h-4" />الخريطة الشاملة
          </button>
        )}
        {(user?.permissions?.manageSmartTasks || user?.permissions?.executeSmartTasks || user?.role === 'admin' || user?.role === 'director') && (
          <button onClick={() => setActiveTab('smart_tasks')} className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'smart_tasks' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}>
            <CheckCircle className="w-4 h-4" />إدارة المهام (Smart Tasks)
          </button>
        )}"""
        
    if target in content:
        content = content.replace(target, "")
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Cleaned top map and smart tasks")
    else:
        print("Could not find the top tabs")
        
if __name__ == "__main__":
    clean_top()
