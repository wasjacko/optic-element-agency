const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('./components');
let changed = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Alternative: match className and replace px-6 with px-8 md:px-6 IF not already md:px-
    const classRegex = /className="([^"]+)"/g;
    content = content.replace(classRegex, (match, classes) => {
        if (classes.includes('mx-auto') && (classes.includes('px-4') || classes.includes('px-6'))) {
            // Replace px-4 or px-6 with px-10 md:px-6
            let newClasses = classes;
            // Only replace if they aren't already followed by md:px-... Wait, if the string has px-4, replace it cleanly:
            newClasses = newClasses.replace(/\bpx-4\b(?! md:px-)/g, 'px-8 md:px-4');
            newClasses = newClasses.replace(/\bpx-6\b(?! md:px-)/g, 'px-10 md:px-6');
            return `className="${newClasses}"`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changed++;
        console.log('Fixed:', file);
    }
});
console.log('Total fixed:', changed);
