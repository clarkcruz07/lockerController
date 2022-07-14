const dotenv = require('dotenv');
const config_data = require('./lockerconfig.json');

// Config environment
dotenv.config();
let configObj = config_data;

module.exports = configObj;