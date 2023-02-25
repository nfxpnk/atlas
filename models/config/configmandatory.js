'use strict';

const fs = require('fs');
const path = require('path');
const log = require('fancy-log');
const c = require('ansi-colors');
const projectRoot = process.cwd();

const absPath = relPath => path.join(projectRoot, relPath, '/');
const isPathReachable = (destination, name) => {
    if (!destination) {
        log(c.red('Error: ') + '"' + name + '" not defined. This field is mandatory');
        return false;
    } else if (!fs.existsSync(absPath(destination))) {
        log(c.red('Error: ') + '"' + name + '" (' + destination + ') in config unavailable or unreadable. ' +
            'Please check this path in config');
        return false;
    } else {
        return true;
    }
};

function getMandatoryBaseConfig(config) {
    if (!isPathReachable(config.guideSrc, 'guideSrc') ||
        !isPathReachable(config.cssSrc, 'cssSrc')) {
        return { isCorrupted: true }; // return with corrupted config if we don't have critical info
    }

    let atlasConfig = {};

    // Process mandatory configs
    atlasConfig.guideSrc = absPath(config.guideSrc);
    if (fs.existsSync(config.guideSrc)) {
        atlasConfig.guideSrc = config.guideSrc;
    }

    atlasConfig.cssSrc = absPath(config.cssSrc);

    // Check and create destination directory if needed
    const createDestination = config.createDestFolder || false;
    if (!config.guideDest) {
        log(c.red('Error: ') + '"guideDest" not defined. This field is mandatory');
        return { isCorrupted: true };
    }
    if (!fs.existsSync(absPath(config.guideDest))) {
        if (createDestination) {
            fs.mkdirSync(path.join(projectRoot, config.guideDest));
            log(c.yellow('Warning: ') + '"guideDest": ' + config.guideDest + ' directory created');
        } else {
            log(c.red('Error: ') + '"guideDest" (' + config.guideDest + ') in config unavailable or unreadable. ' +
                'Please check this path in config');
            return { isCorrupted: true };
        }
    }
    atlasConfig.guideDest = absPath(config.guideDest);

    console.log(atlasConfig, config);

    return atlasConfig;
}

module.exports = getMandatoryBaseConfig;
