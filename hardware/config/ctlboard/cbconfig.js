const Config = require('../config');
const controller_function = require('./' + Config.controllerModel + '.js');
const controller_config = require('./' + Config.controllerModel + '.json');

module.exports = {
    functions: controller_function,
    config: controller_config,
};
