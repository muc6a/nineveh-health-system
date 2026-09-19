import sys

def main():
    file_path = '/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/OwnerPortal.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove 'fines,' from destructuring
    content = content.replace('inspectionTemplates, fines, penaltyRequests ,', 'inspectionTemplates, penaltyRequests,')
    content = content.replace('inspectionTemplates, fines, penaltyRequests,', 'inspectionTemplates, penaltyRequests,')

    # 2. Fix the allMyFines filtering logic
    old_fines_logic = "const allMyFines = [...(fines || []), ...(penaltyRequests || [])]\n                    .filter(f => (f.type === 'fine' || f.type === 'closure' || !f.type) && (String(f.targetEstId) === String(ownerEst.id) || String(f.establishmentId) === String(ownerEst.id) || String(f.estId) === String(ownerEst.id)));"
    
    new_fines_logic = "const allMyFines = [...(penaltyRequests || [])]\n                    .filter(f => f && (f.type === 'fine' || f.type === 'closure' || !f.type) && (String(f.targetEstId) === String(ownerEst.id) || String(f.establishmentId) === String(ownerEst.id) || String(f.estId) === String(ownerEst.id)));"
    
    content = content.replace(old_fines_logic, new_fines_logic)

    # 3. Update generateTodos for actual notes
    old_todos = """    if (lastHistory?.ratings) {
      Object.entries(lastHistory.ratings).forEach(([id, val]) => {
        if (val < 5) {
          todos.push({
            id,
            text: `تصحيح الخلل في المعيار ${id}`,
            points: 5 - val,
            ...getTaskDetails(id)
          });
        }
      });
    }"""
    
    new_todos = """    if (lastHistory?.ratings) {
      Object.entries(lastHistory.ratings).forEach(([id, val]) => {
        if (val < 5) {
          const customNote = lastHistory.notes && lastHistory.notes[id] ? `ملاحظة المفتش: ${lastHistory.notes[id]}` : `تصحيح الخلل في المعيار ${id}`;
          todos.push({
            id,
            text: customNote,
            points: 5 - val,
            ...getTaskDetails(id)
          });
        }
      });
    }"""
    
    content = content.replace(old_todos, new_todos)

    # 4. Update Logout logic
    old_logout = "onClick={globalLogout}"
    new_logout = """onClick={() => {
               localStorage.removeItem('ownerAuthToken');
               setOwnerEst(null);
               setAccessCode('');
               setActiveTab('dashboard');
               navigate('/');
             }}"""
    
    content = content.replace(old_logout, new_logout)

    # 5. Fix HTML2Canvas export white screen
    old_export = """      setIsDownloading(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(ref.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });"""
    
    new_export = """      setIsDownloading(true);
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(ref.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff', scrollY: -window.scrollY });"""
    
    content = content.replace(old_export, new_export)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("OwnerPortal.jsx updated successfully!")

if __name__ == '__main__':
    main()
