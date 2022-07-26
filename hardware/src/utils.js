const utils = {
    IntTo16bitsHex: function(inNumber) {
        let hex2bytesOut = Buffer.alloc(2);
        hex2bytesOut.writeUInt16BE(inNumber);
        hex2bytesOut.writeUInt16LE(inNumber);
        
        return hex2bytesOut;
    },
    sleep: async function(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    boardIdTo2ByteHex: function(boardId) {
      if(boardId === undefined) {
        return false;
      }
      const hexpack = [];
  
      let ID = boardId.toString()
      if (ID.length == 1) {
              ID = "0" + ID;
      }
  
      // (2 byte)Push board ID
      hexpack.push('0x3' + ID[0]);
      hexpack.push('0x3' + ID[1]);
      return hexpack;
    },
    convertHextoBinStatus(hexValue, startIdx) {
        var hexString = hexValue.toString("hex").toUpperCase();
        var binString = (parseInt(hexString, 16)).toString(2).padStart(8, '0');
        var binArray = binString.split('')
        let binaryStatus = {};
        binArray.slice().reverse().forEach(function(item, key) {
            let channel = (parseInt(key, 10) + startIdx).toString();
            binaryStatus[channel] = item;
        });
        return binaryStatus;
    }
}

module.exports = utils;