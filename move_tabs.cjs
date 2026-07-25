const fs = require('fs');

let content = fs.readFileSync('src/pages/ExecutivePortal.jsx', 'utf8');

// The marker where tabs start
const tabsStartSearch = `{/* Executive Sub-tabs / Page Splitting */}`;
const tabsEndSearch = `</div>

        {activeTab === 'operations_room' && <OperationsRoom />}`;

const startIndex = content.indexOf(tabsStartSearch);
const endIndex = content.indexOf(`{activeTab === 'operations_room' && <OperationsRoom />}`);

if (startIndex !== -1 && endIndex !== -1) {
    const tabsBlock = content.substring(startIndex, endIndex);
    
    // Remove the tabs block from original location
    let newContent = content.substring(0, startIndex) + content.substring(endIndex);
    
    // Find where the tab content rendering starts
    const targetSearch = `{/* Tab Content Rendering */}
        {activeTab === 'establishments' ? (`;
        
    const targetIndex = newContent.indexOf(targetSearch);
    if (targetIndex !== -1) {
        // Insert tabs block BEFORE the target block
        newContent = newContent.substring(0, targetIndex) + tabsBlock + newContent.substring(targetIndex);
        
        fs.writeFileSync('src/pages/ExecutivePortal.jsx', newContent);
        console.log('Successfully moved tabs block above EstablishmentsManager');
    } else {
        console.log('Target block not found');
    }
} else {
    console.log('Tabs block not found');
}
