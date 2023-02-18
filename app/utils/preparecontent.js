'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function(atlasConfig, projectTree) {
    const projectConstants = require(path.resolve(__dirname, '../../models/projectconstants.js'))(
        atlasConfig.constants, atlasConfig.scssAdditionalImportsArray, atlasConfig.constants.constantsFile);
    const renderedPageContent = require(path.resolve(__dirname, '../../models/pagecontent.js'));

    // View models
    //const styleguide = require(path.resolve(__dirname, '../../viewmodels/styleguide.js'));
    const colors = require(path.resolve(__dirname, '../../viewmodels/colors.js'));
    //const themes = require(path.resolve(__dirname, '../../viewmodels/themes.js'));

    // Prepare guide page content model depending on component type
    function prepareContent(component) {
        let content;
        let tableOfContent;
        let stat;
        let page;

        if (component.src !== '') { // could be stat pages or custom defined file
            page = renderedPageContent(component.src, {'title': component.title});
            content = page.content;
            tableOfContent = page.toc;
        }

        switch (component.type) {
            // case 'styleguide':
            //     content = styleguide(projectConstants);
            //     break;
            case 'colors':
                content = colors(atlasConfig, component);
                break;
            case 'colors-1':
            case 'colors-2':
            case 'colors-3':
            case 'colors-4':
            case 'colors-5':
                //content = themes(atlasConfig, component);
                content = colors(atlasConfig, component);
                break;
            case 'icons':
                const iconsJson = path.join(atlasConfig.guideSrc, 'icons.json');
                let icons = {};
                if(fs.existsSync(iconsJson)) {
                    icons = require(iconsJson);
                }
                content = icons;
                break;
            case 'component':
            case 'container':
                break;
            case 'about':
                stat = {
                    'projectName': atlasConfig.projectInfo.name
                };
                break;
        }

        return {
            documentation: content,
            toc: tableOfContent
        };
    }

    return { prepareContent };
};
