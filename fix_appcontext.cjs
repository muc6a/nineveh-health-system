const fs = require('fs');
const content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');
const lines = content.split('\n');

// 1. Remove lines 692-706 (0-indexed 691-705)
let removedLines = lines.splice(691, 15);

// 2. Remove the duplicates
//   useEffect(() => {
//     syncToCloud('directives', directives);
//   }, [directives]);
//   useEffect(() => {
//     syncToCloud('directors', directors);
//   }, [directors]);
let newLines = [];
let i = 0;
while (i < lines.length) {
  if (lines[i].includes("syncToCloud('directives', directives);") && lines[i-1].includes("useEffect(() => {")) {
    i += 3; // skip the 3 lines of useEffect
    continue;
  }
  if (lines[i].includes("syncToCloud('directors', directors);") && lines[i-1].includes("useEffect(() => {")) {
    i += 3; // skip the 3 lines of useEffect
    continue;
  }
  newLines.push(lines[i]);
  i++;
}

// 3. Find the line with "return (" and insert the removed lines before it
const returnIndex = newLines.findIndex(l => l.trim() === 'return (');
if (returnIndex !== -1) {
  newLines.splice(returnIndex, 0, '', ...removedLines, '');
}

fs.writeFileSync('src/context/AppContext.jsx', newLines.join('\n'));
console.log('Fixed AppContext.jsx!');
