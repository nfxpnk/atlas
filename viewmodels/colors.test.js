'use strict';

const colors = require('./colors.js');
const component = {};
component.cid = '00';

const config = {};
config.guideSrc = 'H:/projects/bluerabbit/code/cartridges/app_blue_rabbit/cartridge/client/default/scss/';


const data = colors(config, component);
console.log(JSON.stringify(data, null, 4));
