const Config = require('../config');
const controller_function = require('../controllermodels/' + Config.controllerModel + '/boardfunction.js');
const controller_config = require('../controllermodels/' + Config.controllerModel + '/boardconfig.json');

module.exports = {
    functions: controller_function,
    config: controller_config,
};
