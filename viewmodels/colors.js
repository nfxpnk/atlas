'use strict';

const fs = require('fs');

module.exports = function(config) {
    // Trim string from left and right
    function trimLeftRight(string, left, right) {
        string = string.substring(left);
        string = string.substring(0, string.length - right);
        return string;
    }

    // Path to _colors.scss file with all scss variables
    const colorsFile = config.guideSrc + '00-configuration/_colors.scss';
    const scssData = fs.readFileSync(colorsFile, 'utf8');

    // Break down scss data into lines
    const lines = scssData.split('\n');

    // Array with all scss variables [$color-var => #value]
    let scssVariablesArray = [];

    // Array of color objects {name:'', value:''}
    let scssVariables = [];

    // Object with color pallete section {name: sectionName, variables: [array {scssVariables}]}
    let colorsCollection = {};

    // Final color palette array with objects {colorsCollection}
    let colorPalettes = [];

    for (let i = 0; i <= lines.length; ++i) {
        let line = lines[i];

        if (typeof line == 'undefined') {
            continue;
        }

        line = line.trim();
        if (line.match(/^\/\/ #/)) {
            if (scssVariables.length > 0) {
                colorsCollection.variables = scssVariables;
                colorPalettes.push(colorsCollection);
                scssVariables = [];
                colorsCollection = {};
            }

            colorsCollection.name = trimLeftRight(line, 4, 0);
        }

        if (line.match(/^\$color/)) {
            const data = line.split(':');
            let value = data[1].trim();
            value = trimLeftRight(value, 0, 1);
            scssVariablesArray[data[0]] = value;

            if (value.match(/^\$color/)) {
                value = scssVariablesArray[value];
            }
            scssVariables.push({ name: data[0], value: value });
        }
    }

    // Debug section
    // console.log(JSON.stringify(colorPalettes, null, 4));
    // console.log(scssVariablesArray);

    // Final themes array with objects {themeCollection}
    let themes = [];
    let currentSection;

    // Array of color objects {name:'', scssVariable: '', value:''}
    let cssVariables = [];

    // Object with color section {name: sectionName, properties: [array {cssVariables}]}
    colorsCollection = {};

    // Color sections array with objects {colorsCollection}
    let colorSections = [];

    // Themes sections
    let themesCollection = {};

    for (let i = 0; i <= lines.length; ++i) {
        let line = lines[i];
        if (typeof line == 'undefined') {
            continue;
        }

        line = line.trim();
        if (line.match(/^\/\/ #/)) {
            if (cssVariables.length > 0) {
                colorsCollection.properties = cssVariables;
                colorSections.push(colorsCollection);
                cssVariables = [];
                colorsCollection = {};
            }

            colorsCollection.name = trimLeftRight(line, 4, 0);
        }

        if (line.match(/^\$theme-/)) {
            if (colorSections.length > 0) {
                themesCollection.sections = colorSections;
                themes.push(themesCollection);
                colorSections = [];
                themesCollection = {};
            }
            themesCollection.name = trimLeftRight(line, 1, 3);
        }
        if (line.match(/^'/)) {
            const data = line.split(':');
            let value = data[1].trim();
            value = trimLeftRight(value, 0, 1);
            let variable;
            let color;
            let scssVariable = scssVariablesArray[value];
            if (typeof scssVariable == 'undefined') {
                variable = '';
                color = value;
            } else {
                variable = value;
                color = scssVariable;
            }
            let name = trimLeftRight(data[0], 1, 1);
            cssVariables.push({ name: name, scssVariable: variable, value: color });
        }
    }

    // Debug section
    //console.log(JSON.stringify(colorSections, null, 4));
    //console.log(JSON.stringify(themes, null, 4));

    // [
    //     {
    //         name: 'name',
    //         sections: {
    //             {
    //                 name: 'Buttons',
    //                 properties: {
    //                     name:,
    //                     variable:,
    //                     value:,
    //                 }
    //             }
    //         }
    //     }
    // ]

    return { colorPalettes: colorPalettes, themes: themes };
};
