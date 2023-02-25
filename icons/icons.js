'use strict';

const fs = require('fs');

const icons = [
    'file-16',
    'file-code-16',
    'file-directory-fill-16',
    'link-external-16',
    'code-16',
    'screen-full-16',
    'screen-normal-16',
    'hash-16',
    'book-16',
    'paintbrush-16',
    'confluence'
];

const iconsFile = '../views/includes/partials/icons.mustache';

const header = '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\r\n';
const footer = '</svg>\r\n';

let html = header;
for (const icon of icons) {
    let iconFile = `./octicons/icons/${icon}.svg`;
    if (!fs.existsSync(iconFile)) {
        iconFile = `./custom/${icon}.svg`;
    }

    let code = fs.readFileSync(iconFile, 'utf8');
    code = code.replace('<svg xmlns="http://www.w3.org/2000/svg"', `\t<symbol id="${icon}"`);
    code = code.replace(/(width|height)="\d+" /gmi, '');
    code = code.replace('</svg>', '</symbol>');
    code += '\r\n';
    html += code;
}
html += footer;

fs.writeFileSync(iconsFile, html);
