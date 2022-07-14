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
    getXORchecksum: function(hexAry) {
      let cs = 0;
      for (let idx in hexAry) {
          if(idx > 1) {
              cs ^= hexAry[idx];
          }
      }
      return cs;
    }
}

module.exports = utils;