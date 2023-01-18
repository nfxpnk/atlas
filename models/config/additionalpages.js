'use strict';

const path = require('path');

function getAdditionalPages(templates, dest, constants, indexSrc) {
    let additionalPages = [];

    additionalPages.push({
        id: 'icons',
        title: 'Icons',
        src: indexSrc,
        target: path.join(dest, '/icons.html'),
        template: 'icons',
        type: 'icons',
        isDeprecated: false,
        subPages: []
    });

    additionalPages.push({
        id: 'index',
        title: 'About',
        src: indexSrc,
        target: path.join(dest, '/index.html'),
        template: 'about',
        type: 'about',
        isDeprecated: false,
        subPages: []
    });

    if (constants.isDefined) {
        additionalPages.push({
            id: 'styleguide',
            title: 'Styleguide',
            src: '',
            target: path.join(dest, '/styleguide.html'),
            template: 'styleguide',
            type: 'styleguide',
            isDeprecated: false,
            subPages: []
        });
    }

    return additionalPages;
}

module.exports = getAdditionalPages;
