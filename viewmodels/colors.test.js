'use strict';

const colors = require('./colors.js');
const id = '00';

const config = {};
config.guideSrc = 'H:/projects/bluerabbit/code/cartridges/app_blue_rabbit/cartridge/client/default/scss/';


const data = colors(config, id);
console.log(JSON.stringify(data,null,4));
