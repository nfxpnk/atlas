'use strict';

const path = require('path');

module.exports = function(atlasConfig, projectTree, projectImportsGraph, projectImports) {
    const projectConstants = require(path.resolve(__dirname, '../../models/projectconstants.js'))(
        atlasConfig.constants, atlasConfig.scssAdditionalImportsArray, atlasConfig.constants.constantsFile);
    const componentImports = src => projectImports.getFileImports(src, projectImportsGraph);
    const renderedPageContent = require(path.resolve(__dirname, '../../models/pagecontent.js'));

    // View models
    const styleguide = require(path.resolve(__dirname, '../../viewmodels/styleguide.js'));

    // Prepare guide page content model depending on component type
    function prepareContent(component) {
        let content;
        let tableOfContent;
        let stat;
        let page;
        let isNeedStat;

        if (component.src !== '') { // could be stat pages or custom defined file
            page = renderedPageContent(component.src, {'title': component.title});
            content = page.content;
            tableOfContent = page.toc;
            isNeedStat = page.isNeedStat;
        }
        switch (component.type) {
            case 'styleguide':
                content = styleguide(projectConstants);
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
