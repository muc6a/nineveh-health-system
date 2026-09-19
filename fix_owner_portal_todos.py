import sys

def main():
    file_path = '/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/OwnerPortal.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    old_todos = """  const generateTodos = () => {
    let todos = [];
    if (lastHistory?.ratings) {
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
    
    new_todos = """  const generateTodos = () => {
    let todos = [];
    if (lastHistory?.ratings) {
      Object.entries(lastHistory.ratings).forEach(([id, val]) => {
        if (val < 5) {
          const customNote = lastHistory?.notes && lastHistory.notes[id] ? `ملاحظة المفتش: ${lastHistory.notes[id]}` : `تصحيح الخلل في المعيار ${id}`;
          todos.push({
            id,
            text: customNote,
            points: 5 - val,
            ...getTaskDetails(id)
          });
        }
      });
    }"""
    
    if old_todos in content:
        content = content.replace(old_todos, new_todos)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success!")
    else:
        print("Could not find old_todos string!")

if __name__ == '__main__':
    main()
