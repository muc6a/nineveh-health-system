const lucide = require('lucide-react');
const icons = ['Plus', 'Trash2', 'Edit', 'X', 'Power', 'ShieldAlert', 'Check', 'Users', 'Settings', 'Database', 'Shield', 'Eye', 'EyeOff', 'Info', 'UserPlus', 'Compass', 'Building', 'Search'];
icons.forEach(icon => {
  if (lucide[icon] === undefined) {
    console.log("MISSING ICON:", icon);
  }
});
console.log("DONE");
