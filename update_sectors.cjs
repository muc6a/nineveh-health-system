const fs = require('fs');
const glob = require('glob');

const replaceInFile = (file) => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
        .replace(/الجانب الأيسر/g, 'مركز المحافظة - الجانب الأيسر')
        .replace(/الجانب الأيمن/g, 'مركز المحافظة - الجانب الأيمن')
        // Fix double prefixes if any existed
        .replace(/مركز المحافظة - مركز المحافظة -/g, 'مركز المحافظة -');
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
    }
}

glob.sync('src/**/*.jsx').forEach(replaceInFile);
glob.sync('src/**/*.js').forEach(replaceInFile);
