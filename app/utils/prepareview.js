'use strict';

const path = require('path');
const atlasConfig = require(path.join(__dirname, '../../models/atlasconfig.js'));
const projectInfo = atlasConfig.getProjectInfo();
const partials = atlasConfig.getPartials();

const inline = require('./templateHelpers/inline.js');
const pluralize = require('./templateHelpers/pluralize.js');

const View = function(config) {
    this.projectInfo = {
        'name': projectInfo.name,
        'version': projectInfo.version
    };
    this.pageTitle = config.title;
    this.content = config.content;
    this.type = config.type;
    this.subPages = config.subPages; // could be cached
};

View.prototype.inline = () => (text, render) => inline(text, render);
View.prototype.pluralize = () => (text, render) => pluralize(text, render);

function prepareView(config) {
    return new View({
        title: config.title,
        content: config.content,
        type: config.type,
        subPages: config.subPages
    });
}

module.exports = {
    partials: partials,
    prepareView: prepareView
};
