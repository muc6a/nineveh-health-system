const fs = require('fs');
const content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf-8');
const babel = require('@babel/core');
try {
  babel.parse(content, {
    presets: ['@babel/preset-react'],
    filename: 'SuperAdminPanel.jsx'
  });
  console.log("Syntax is OK!");
} catch (e) {
  console.log("Syntax error at line", e.loc.line, "col", e.loc.column);
  const lines = content.split('\n');
  console.log(lines[e.loc.line - 2]);
  console.log(lines[e.loc.line - 1]);
  console.log(lines[e.loc.line]);
}
