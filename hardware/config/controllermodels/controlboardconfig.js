const Config = require('../config');
const controller_function = require('../controllermodels/' + Config.controllerModel + '/boardfunction.js');
const controller_config = require('../controllermodels/' + Config.controllerModel + '/boardconfig.json');

// Set serial port communication path
// Windows: COM6
// Lunux: /dev/ttyUSB0
controller_config.Communication['PATH'] = Config.controllerSerialPATH;

module.exports = {
    functions: controller_function,
    config: controller_config,
};
