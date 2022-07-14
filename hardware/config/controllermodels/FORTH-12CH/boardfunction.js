const path = require('path');

const utils = require('../../../src/utils.js');

//const config_data = require('./' + path.parse(__filename).name + '.json');
const config_data = require('./boardconfig.json');
const ctlboardCommand = config_data.Communication.HEXPACK;

const functions = {
  getChecksum: function(hexAry) {
    let dataBuf = new Buffer.from(hexAry, 'hex').slice(1)
    let cs = 0
    for (let i = 0; i < dataBuf.length; i++) {
      cs = cs + dataBuf[i]
    }
    cs = cs % 256
    cs = cs.toString(16)
    if (cs.length == 1) {
      cs = '0' + cs;
    }
    return "0x" + cs.toString(16);
  },
  generateHexGroup: function(doorNo) {
    if(doorNo === undefined) {
      return [];
    }
    const hexpack = [];
    for (let index = 1; index <= config_data.channel; index++) {
      if(doorNo === 0) {
        hexpack.push(ctlboardCommand.doorStatus.close);
      }
      else {
        if(index !== (doorNo)) {
          hexpack.push(ctlboardCommand.doorStatus.close);
        }
        else {
          hexpack.push(ctlboardCommand.doorStatus.open);
        }
      }
    }
    return hexpack;
  },
  getStatusFromQuery: function(responseData) {
    const stateArray = responseData.toString('hex').match(/.{1,2}/g).slice(4, 16);

    let channelStatus = [];
    stateArray.forEach( (element, key) => {
      channelStatus.push(element === '43'? 'close' : element === '50'? 'open' : '');
    });

    return channelStatus;
  },
  getCommandUnlock: function(boardId, doorNo) {
    if(boardId === undefined || doorNo === undefined) {
      return false;
    }
    const hexpack = [];
    
    // (1 byte) Initial hex package
    hexpack.push(ctlboardCommand.initial);
    
    // (1 byte) Push Command code
    hexpack.push(ctlboardCommand.command.unlock);
    
    // (2 bytes) Push board ID
    hexpack.push(...utils.boardIdTo2ByteHex(boardId));
    
    // (1 byte) Push Lock Number
    hexpack.push(...functions.generateHexGroup(doorNo));
    
    // (1 byte) Push checksum
    hexpack.push(functions.getChecksum(hexpack));

    // (1 byte) Push end command
    hexpack.push(ctlboardCommand.end);
    
    const hexBuffer = new Buffer.from(hexpack);
    
    return hexBuffer;
    },
    getCommandQueryState: function(boardId) {
      if(boardId === undefined) {
        return false;
      }
      const hexpack = [];
    
      // (1 byte) Initial hex package
      hexpack.push(ctlboardCommand.initial);
      
      // (1 byte) Push Command code
      hexpack.push(ctlboardCommand.command.querystate);
    
      // (2 bytes) Push board ID
      hexpack.push(...utils.boardIdTo2ByteHex(boardId));
      
      // (1 byte) Push Lock Number
      hexpack.push(...functions.generateHexGroup(0));
      
      // (1 byte) Push checksum
      hexpack.push(functions.getChecksum(hexpack));

      // (1 byte) Push end command
      hexpack.push(ctlboardCommand.end);
      
      const hexBuffer = new Buffer.from(hexpack);

      return hexBuffer;
    }
}

module.exports = functions;