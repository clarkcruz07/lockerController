const { SerialPort } = require('serialport')

const port = new SerialPort({
  path: 'COM6',
  baudRate: 57600,
  lock: false,
  autoOpen: false
})

//const arr = [0x5C, 0xC5, 0x05, 0x01, 0xD1, 0x01, 0x00, 0x00];
const HEXPACK_initial = [0x5C, 0xC5];
const HEXPACK_cmd_packages_length = [0x05];
const HEXPACK_command_unlock = [0xD1];
const HEXPACK_command_querystate = [0xD2];
const HEXPACK_command_lampctl = [0xD3];

const TEST_CONTROL = 1;
const TEST_QUERY = 0;

port.open(async function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
  else {
	  console.log('Port', port.path, ' opened at', port.baudRate);
  }

  // Because there's no callback to write, write errors will be emitted on the port:
  if(TEST_CONTROL) {
	var idCnt = 1
	for(var lockNum = 1; lockNum <= 3; lockNum++) {
		port.write(getCommandUnlock(idCnt, lockNum));
		console.log('Open board', idCnt, 'locker number', lockNum);
		await sleep(500);
	}
  }
  if(TEST_QUERY) {
	let query_boardID = 1;
	port.write(commandQueryState(query_boardID), function (err, result) {
            if (err) {
                console.log('Error while sending message : ' + err);
            }
            if (result) {
                console.log('Response received after sending message : ' + result);
            }    
        });
	console.log('Query board', query_boardID);
  }  
})

// The open event is always emitted
port.on('open', async function() {
	// open logic
  	//await sleep(3000); 	
	//port.close();
})

// Read data that is available but keep the stream in "paused mode"
port.on('readable', function () {
	console.log('Readable:', port.read());
})


// Switches the port into "flowing mode"
port.on('data', function (data) {
	console.log('Data:', data)
})

port.on('error', function (err) {
	console.log('Error: ', err.message)
})

function getXORchecksum(hexAry) {
	let cs = 0;
	for (let idx in hexAry) {
		if(idx > 1) {
			cs ^= hexAry[idx];
		}
	}
	return cs;
}

function getCommandUnlock(boardId, doorNo) {
	const hexpack = [];
	
	// (2 bytes) Initial hex package
	hexpack.push(...HEXPACK_initial);
	
	// (1 byte) Push package lenght of command
	hexpack.push(...HEXPACK_cmd_packages_length);
	
	// (1 byte)Push board ID
	hexpack.push(boardId);
	
	// (1 byte)Push Command code
	hexpack.push(...HEXPACK_command_unlock);
	
	// (1 byte)Push Lock Number
	hexpack.push(doorNo);
	
	// (2 bytes)Push Data
	hexpack.push(...IntTo16bitsHex(0x0000));
	
	// (1 byte)Push XOR checksum
	hexpack.push(getXORchecksum(hexpack));
	
	
	const hexBuffer = new Buffer.from(hexpack);
	
	var outstr = '';
	for(var ch of hexBuffer) {
		outstr = outstr.concat(' ', ch.toString(16));
	}
	console.log("HEX package:", outstr);
	
	return hexBuffer;
}

function commandQueryState(boardId) {
	const hexpack = [];
	
	// (2 bytes) Initial hex package
	hexpack.push(...HEXPACK_initial);
	
	// (1 byte) Push package lenght of command
	hexpack.push(...HEXPACK_cmd_packages_length);
	
	// (1 byte)Push board ID
	hexpack.push(boardId);
	
	// (1 byte)Push Command code
	hexpack.push(...HEXPACK_command_querystate);
	
	// (1 byte)Push Lock Number
	hexpack.push(0x00);
	
	// (2 bytes)Push Data
	hexpack.push(...IntTo16bitsHex(0x0000));
	
	// (1 byte)Push XOR checksum
	hexpack.push(getXORchecksum(hexpack));
	
	
	const hexBuffer = new Buffer.from(hexpack);
	
	var outstr = '';
	for(var ch of hexBuffer) {
		outstr = outstr.concat(' ', ch.toString(16));
	}
	console.log("HEX package:", outstr);
	
	return hexBuffer;
}

function IntTo16bitsHex(inNumber) {
	let hex2bytesOut = Buffer.alloc(2);
	hex2bytesOut.writeUInt16BE(inNumber);
	hex2bytesOut.writeUInt16LE(inNumber);
	
	return hex2bytesOut;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}