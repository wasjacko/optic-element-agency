const fs = require('fs');

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

    // Replace px-6 or px-4 to px-8 md:px-6 if they are used as horizontal containers
    // We assume it's a structural container if it has "w-full", "max-w-", "container", "absolute", "fixed"
    // or if it's the main wrapper. We avoid buttons by ignoring strings that have "py-2", "py-3", "h-".
    const classRegex = /className="([^"]+)"/g;
    content = content.replace(classRegex, (match, classes) => {
        // If it looks like a button or input, skip
        if (classes.includes('py-2') || classes.includes('py-3') || classes.includes('py-4') || classes.includes('h-10')) {
            return match;
        }

        // If it has px-4 or px-6 and no md:px- override, upgrade it
        let newClasses = classes;
        if (classes.includes('px-4') || classes.includes('px-5') || classes.includes('px-6') || classes.includes('px-8')) {

            // Upgrade rule: we want mobile margins to be generous on the sides.
            // Actually the user wants MORE px, meaning px-8 or px-10.

            // To be safe, avoid replacing if there's already an md:px-
            if (!classes.includes('md:px-') && !classes.includes('lg:px-')) {
                newClasses = newClasses.replace(/\bpx-4\b/g, 'px-8 md:px-4');
                newClasses = newClasses.replace(/\bpx-5\b/g, 'px-8 md:px-5');
                newClasses = newClasses.replace(/\bpx-6\b/g, 'px-10 md:px-6');
                newClasses = newClasses.replace(/\bpx-8\b/g, 'px-12 md:px-8');
            } else {
                // If it already has md:px, we just boost the default (mobile) px
                // e.g. "px-6 md:px-16" -> "px-10 md:px-16"
                newClasses = newClasses.replace(/\bpx-4(?=.*?md:px-)/g, 'px-8');
                newClasses = newClasses.replace(/\bpx-5(?=.*?md:px-)/g, 'px-8');
                newClasses = newClasses.replace(/\bpx-6(?=.*?md:px-)/g, 'px-10');
            }
        }
        return `className="${newClasses}"`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changed++;
        console.log('Fixed:', file);
    }
});
console.log('Total fixed:', changed);
