const fs = require('fs');

let content = fs.readFileSync('src/pages/ExecutivePortal.jsx', 'utf8');

// 1. We need to extract the Summary Minimalist 3D Cards block.
// It starts with `{/* Summary Minimalist 3D Cards */}` and ends before `{/* Dynamic Tab Switching Content */}`
const startMarker = `{/* Summary Minimalist 3D Cards */}`;
const endMarker = `{/* Dynamic Tab Switching Content */}`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const cardsBlock = content.substring(startIndex, endIndex);
    
    // Remove the cards block from its original position
    let newContent = content.substring(0, startIndex) + content.substring(endIndex);
    
    // Now insert the cards block INSIDE the strategic tab
    const strategicMarker = `{activeTab === 'strategic' && hasPerm('showMainDashboard') ? (
          <div className="space-y-6">`;
    
    const replacement = strategicMarker + '\\n' + cardsBlock;
    newContent = newContent.replace(strategicMarker, replacement);
    
    fs.writeFileSync('src/pages/ExecutivePortal.jsx', newContent);
    console.log('Moved cards into strategic tab');
} else {
    console.log('Could not find markers');
}
