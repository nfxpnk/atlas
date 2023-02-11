'use strict';

const path = require('path');

function getAdditionalPages(templates, dest, constants, indexSrc) {
    let additionalPages = [];

    const themes = [];
    for (const theme of [1,2,3,4,5]) {
        themes.push(
            {
                id: 'colors-theme-' + theme,
                title: 'Theme #' + theme,
                src: indexSrc,
                target: path.join(dest, '/colors-theme-' + theme + '.html'),
                type: 'colors',
                icon: 'about',
                isDeprecated: false,
                subPages: []
            }
        );
    }

    additionalPages.unshift({
        id: 'colors',
        title: 'Colors',
        src: indexSrc,
        target: path.join(dest, '/colors.html'),
        type: 'colors',
        icon: 'colors',
        isDeprecated: false,
        subPages: themes
    });

    additionalPages.unshift({
        id: 'icons',
        title: 'Icons',
        src: indexSrc,
        target: path.join(dest, '/icons.html'),
        type: 'icons',
        icon: 'icons',
        isDeprecated: false,
        subPages: []
    });

    additionalPages.push({
        id: 'index',
        title: 'About',
        src: indexSrc,
        target: path.join(dest, '/index.html'),
        type: 'about',
        icon: 'about',
        isDeprecated: false,
        subPages: []
    });

    // if (constants.isDefined) {
    //     additionalPages.unshift({
    //         id: 'styleguide',
    //         title: 'Styleguide',
    //         src: '',
    //         target: path.join(dest, '/styleguide.html'),
    //         template: 'styleguide',
    //         type: 'styleguide',
    //         icon: 'styleguide',
    //         isDeprecated: false,
    //         subPages: []
    //     });
    // }

    return additionalPages;
}

module.exports = getAdditionalPages;
