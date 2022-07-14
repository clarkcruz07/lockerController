const { SerialPort } = require('serialport')
const { ByteLengthParser } = require('@serialport/parser-byte-length')
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout')

class SerialCommunication {
    constructor (communicationConfig) {
        this.comport = new SerialPort({
          path: communicationConfig.PATH,
          baudRate: communicationConfig.BAUDRATE,
          lock: false,
          autoOpen: false
        })
  
      this.portOpen()
    }

    portOpen() {
        this.comport.open(async function (err) {
          if (err) {
            return console.log('[ERRO] cannot opening port: ', err.message);
          }
          else {
              console.log('[INFO] Serial Communication Port is', this.path, 'opened at baudrate', this.baudRate);
          } 
        })
        //this.handlerData();
    }

    async portWrite(portbuffer) {
        try {
            if(this.comport.isOpen) {
                return this.portWriteWithResponse(portbuffer);
            }
            else {
                this.portOpen();
                console.log('[ERRO] Reopen port try again', result);
            }
        }
        catch (error) {
            console.log('[ERRO] Catch error', error);
        }
    }
    
    async portWriteWithResponse(portbuffer) {
        try {
            var status = this.comport.write(portbuffer);
            console.log('[ERRO] Command', portbuffer, status);

            var port = this.comport;
            const prom = new Promise(function (resolve) {
                const parser = port.pipe(new InterByteTimeoutParser({ interval: 200 }))
                let parserMonitor = setTimeout(() => {
                    parser.end();
                }, 500);
                parser.on('data', function (data) {
                    clearTimeout(parserMonitor);
                    resolve(data);
                    this.end();
                }).on('end',function() {
                    resolve(null);
                });
            });
    
            var result = await prom.catch();
            if(result != null) {
                console.log('[INFO] Response', result);
                return result;
            }
            else {
                console.log('[ERRO] No serial data response');
                return false;
            }
        }
        catch (error) {
            console.log('[ERRO] Catch serial port communication error', error);
        }
    }

    portClose() {
        this.comport.close();
    }

    async handlerData() {
        // Read data that is available but keep the stream in "paused mode"
        //port.on('readable', function () {
        //    console.log('Readable:', port.read());
        //})
        // Switches the port into "flowing mode"
        this.comport.on('data', function (data) {
            console.log('Handle Read: ', data)
        });
    }

    handlerErrors () {
        this.comport.on('error', function (err) {
            console.log('Error: ', err.message)
        });
    }

    handlerPortOpen () {
        // The open event is always emitted
        this.comport.on('open', async function() {
            console.log('Open: ', this.path, "@", this.baudRate)
            // Locgic
        });
    }
}

module.exports = SerialCommunication
