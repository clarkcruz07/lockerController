const path = require('path');

const utils = require('../../../src/utils.js');

//const config_data = require('./' + path.parse(__filename).name + '.json');
const config_data = require('./boardconfig.json');
const ctlboardCommand = config_data.Communication.HEXPACK;

const STATUS_DOORCLOSE = '0';
const STATUS_DOOROPEN = '1';

const STATUS_DETECTED = '0';
const STATUS_NOITEM = '1';

const functions = {
    getChecksum: function(hexAry) {
      let cs = 0;
      for (let idx in hexAry) {
          if(idx > 1) {
              cs ^= hexAry[idx];
          }
      }
      return cs;
    },
    getStatusFromQuery: function(responseData, doorId) {
      let channelStatus = Object.assign({},
        utils.convertHextoBinStatus(responseData.slice(6, 7), 1),
        utils.convertHextoBinStatus(responseData.slice(7, 8), 9),
        utils.convertHextoBinStatus(responseData.slice(8, 9), 17));
        
      // Convert to readable data
      for (const key in channelStatus) {
        if (Object.hasOwnProperty.call(channelStatus, key)) {
          channelStatus[key] = channelStatus[key] === STATUS_DOORCLOSE? 'close' : channelStatus[key] === STATUS_DOOROPEN? 'open' : 'error';
        }
      }

      if(doorId) {
        return channelStatus[doorId];
      }
      return channelStatus;
    },
    getDetecionStatusFromQuery: function(responseData, doorId) {
      let channelStatus = Object.assign({},
        utils.convertHextoBinStatus(responseData.slice(6, 7), 1),
        utils.convertHextoBinStatus(responseData.slice(7, 8), 9),
        utils.convertHextoBinStatus(responseData.slice(8, 9), 17));
        
      // Convert to readable data
      for (const key in channelStatus) {
        if (Object.hasOwnProperty.call(channelStatus, key)) {
          channelStatus[key] = channelStatus[key] === STATUS_DETECTED? 'yes' : channelStatus[key] === STATUS_NOITEM? 'no' : 'error';
        }
      }

      if(doorId) {
        return channelStatus[doorId];
      }
      return channelStatus;
    },
    getCommandUnlock: function(boardId, doorNo) {
      if(boardId === undefined || doorNo === undefined) {
        return false;
      }
      const hexpack = [];
      
      // (2 bytes) Initial hex package
      hexpack.push(...ctlboardCommand.initial);
      
      // (1 byte) Push package lenght of command
      hexpack.push(ctlboardCommand.cmd_packages_length);
      
      // (1 byte)Push board ID
      hexpack.push(boardId);
      
      // (1 byte)Push Command code
      hexpack.push(ctlboardCommand.command.unlock);
      
      // (1 byte)Push Lock Number
      hexpack.push(doorNo);
      
      // (2 bytes)Push Data
      hexpack.push(...utils.IntTo16bitsHex(0x0000));
      
      // (1 byte)Push XOR checksum
      hexpack.push(functions.getChecksum(hexpack));
      
      
      const hexBuffer = new Buffer.from(hexpack);
      /*
      var outstr = '';
      for(var ch of hexBuffer) {
          outstr = outstr.concat(' ', ch.toString(16));
      }*/
      //console.log("HEX package:", outstr);
      
      return hexBuffer;
    },
    getCommandQueryState: function(boardId) {
      if(boardId === undefined) {
        return false;
      }
      const hexpack = [];
      
      // (2 bytes) Initial hex package
      hexpack.push(...ctlboardCommand.initial);
      
      // (1 byte) Push package lenght of command
      hexpack.push(ctlboardCommand.cmd_packages_length);
      
      // (1 byte)Push board ID
      hexpack.push(boardId);
      
      // (1 byte)Push Command code
      hexpack.push(ctlboardCommand.command.querystate);
      
      // (1 byte)Push Lock Number
      hexpack.push(0x00);
      
      // (2 bytes)Push Data
      hexpack.push(...utils.IntTo16bitsHex(0x0000));
      
      // (1 byte)Push XOR checksum
      hexpack.push(functions.getChecksum(hexpack));
      
      
      const hexBuffer = new Buffer.from(hexpack);
      /*
      var outstr = '';
      for(var ch of hexBuffer) {
          outstr = outstr.concat(' ', ch.toString(16));
      }*/
      //console.log("HEX package:", outstr);
      
      return hexBuffer;
    },
    getCommandDetectItem: function(boardId) {
      if(boardId === undefined) {
        return false;
      }
      const hexpack = [];
      
      // (2 bytes) Initial hex package
      hexpack.push(...ctlboardCommand.initial);
      
      // (1 byte) Push package lenght of command
      hexpack.push(ctlboardCommand.cmd_packages_length);
      
      // (1 byte)Push board ID
      hexpack.push(boardId);
      
      // (1 byte)Push Command code
      hexpack.push(ctlboardCommand.command.querystate);
      
      // (1 byte)Push Lock Number
      hexpack.push(0x00);
      
      // (2 bytes)Push Data
      hexpack.push(...utils.IntTo16bitsHex(0x0000));
      
      // (1 byte)Push XOR checksum
      hexpack.push(functions.getChecksum(hexpack));
      
      
      const hexBuffer = new Buffer.from(hexpack);
      
      return hexBuffer;
    },
}

module.exports = functions;