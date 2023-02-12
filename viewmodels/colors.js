'use strict';

const fs = require('fs');

module.exports = function(config, component) {
    function hexToRgb(hex) {
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);

        return r + ',' + g + ',' + b;
    }

    const id = component.cid;

    // Path to _colors.scss file with all scss variables
    const colorsFile = config.guideSrc + '00-configuration/_colors.scss';

    const scssData = fs.readFileSync(colorsFile, 'utf8');

    // Break down scss data into lines and skip empty lines
    const lines = scssData.split('\n').filter(line => line.trim() !== '');

    // Array with all scss variables [$color-var => #value]
    let scssVariablesArray = [];

    // Array of color objects {name:'', value:''}
    let scssVariables = [];

    // Current processed varibale
    let currentVariable = null;

    // Arrays of object with main groups Primary and Secondary
    let themeColorGroups = [];

    // Object with group data
    let themeColorGroup = {variables: []};

    for (let i = 0; i <= lines.length; ++i) {
        let line = lines[i];
        if (typeof line == 'undefined') {
            continue;
        }
        line = line.trim();

        if (line.startsWith('// #' + id)) {
            if(currentVariable) {
                themeColorGroups.push(themeColorGroup);
                themeColorGroup = {variables: []};
            }
            const data = line.split(':');
            themeColorGroup.originalComment = data[0];
            const name = data[0].slice(9);
            const dataName = name.split(' - ');
            themeColorGroup.name = dataName[1];
            themeColorGroup.group = dataName[0];
        }

        const idRegex = '-' + id;
        const themeRegex = new RegExp('^(\\$color-(primary|secondary))' + idRegex);
        const match = line.match(themeRegex);
        if (match) {
            currentVariable = match[1];
            themeColorGroup.originalVariable = match[0];
            themeColorGroup.variable = currentVariable;
        }

        if (currentVariable && line.match(/^\d/)) {
            let [key, hex] = line.split(':').map(part => part.trim());
            let variableName = currentVariable + '-' + key;

            if(hex.endsWith(',')) {
                hex = hex.slice(0, -1);
            }

            scssVariablesArray[variableName] = hex;
            themeColorGroup.variables.push({name: variableName, key: key, hex: hex});
        }

        if(line.startsWith('// #end ' + id)) {
            themeColorGroups.push(themeColorGroup);
            break;
        }
    }


    // Debug section
    //console.log(JSON.stringify(themeColorGroups, null, 5));

    // Object with color section {name: sectionName, properties: [array {cssVariables}]}
    let colorsCollection = {};
    colorsCollection = {values: []};

    // Color sections array with objects {colorsCollection}
    let colorSections = [];

    let sharedColors = null;
    for (let i = 0; i <= lines.length; ++i) {
        let line = lines[i];
        if (typeof line == 'undefined') {
            continue;
        }

        if (line.startsWith('// Shared colors')) {
            sharedColors = true;
        }

        if(sharedColors === null) {
            continue;
        }

        if (line.startsWith('// eob Shared colors')) {
            colorSections.push(colorsCollection);
            break;
        }

        line = line.trim();

        if (line.startsWith('// #')) {
            if (colorsCollection.values.length > 0) {
                colorSections.push(colorsCollection);
                colorsCollection = {values: []};
            }

            colorsCollection.name = line.slice(4);
        }

        if (line.startsWith('$color-')) {
            let [name, hex] = line.split(':').map(part => part.trim());

            if(hex.endsWith(';')) {
                hex = hex.slice(0, -1);
            }

            if(hex.startsWith('rgb')) {
                let scssVar1 = hex.match(/(\$color(.+?)),/);
                let scssVar = scssVariablesArray[scssVar1[1]];
                hex = hex.replace(scssVar1[0], hexToRgb(scssVar)+',');
            }

            scssVariablesArray[name] = hex;
            colorsCollection.values.push({name: name, hex: hex});
        }
    }

    // Debug section
    // console.log(JSON.stringify(colorSections, null, 4));
    // console.log(scssVariablesArray);

    let cssSection = {values:[]};

    // Array of color objects {name:'', scssVariable: '', value:''}
    let cssVariables = [];

    let cssColors = null;

    // CSS Properties
    for (let i = 0; i <= lines.length; ++i) {
        let line = lines[i];
        if (typeof line == 'undefined') {
            continue;
        }

        if (line.startsWith('// CSS properties')) {
            cssColors = true;
        }

        if(cssColors === null) {
            continue;
        }

        if (line.startsWith('// eob CSS properties')) {
            cssVariables.push(cssSection);
            break;
        }

        line = line.trim();

        if (line.startsWith('// #')) {
            if (cssSection.values.length > 0) {
                cssVariables.push(cssSection);
                cssSection = {values: []};
            }

            cssSection.name = line.slice(4);
        }

        if (line.startsWith('\'')) {
            let [name, value] = line.split(':').map(part => part.trim());
            if(value.endsWith(',')) {
                value = value.slice(0, -1);
            }
            let variable = '';
            let color = null;
            let scssVariable = scssVariablesArray[value];
            if (typeof scssVariable === 'undefined') {
                color = value;
            } else {
                variable = value;
                color = scssVariable;
            }

            if(color.startsWith('hextorgb')) {
                let scssVar1 = color.match(/\((.+?)\)/);
                let scssVar = scssVariablesArray[scssVar1[1]];
                color = 'rgb(' +hexToRgb(scssVar) + ')';
            }

            cssSection.values.push({ name: name.slice(1, -1), scssVariable: variable, value: color });
        }
    }

    // Debug section
    //console.log(cssSection);
    //console.log(JSON.stringify(cssVariables,null,4));

    return { component: component, themeColorGroups: themeColorGroups, colorSections: colorSections, cssVariables: cssVariables };
};
