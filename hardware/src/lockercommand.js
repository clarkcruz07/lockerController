// src/controlboard.js
const SerialCommunication = require('../src/serialcommunication.js');

const lockerconfig = require('../config/lockerconfig.json');
const {config, functions} = require('../config/ctlboard/cbconfig.js');

//const STATUS_DOORCLOSE = '0';
const STATUS_DOOROPEN = '1';

class LockerCommand {
    constructor () {
        this.controlboardCommu = new SerialCommunication(config.Communication);
        this.lockerDoorList = lockerconfig.doorMapping;
    }
    lockerInfo() {
        return (lockerconfig);
    }

    async doorOpen(doorNo){
        let door = lockerconfig.doorMapping[doorNo];
        if(door === undefined) {
            return {
                "doorID": doorNo,
                "doorStatus": "Error"
            }
        }
        let response = await this.controlboardCommu.portWrite(functions.getCommandUnlock(door.board, door.channel));
        console.log('[INFO] command unlock door no.', doorNo, response);
        if(response) {
            return {
                "doorID": doorNo,
                "doorStatus": STATUS_DOOROPEN
            }
        }
        else {
            return {
                "doorID": doorNo,
                "doorStatus": "Error"
            }
        }
    }

    async getDoorsStatus() {
        let boardIds = [];
        for (const doorId in this.lockerDoorList) {
            if (Object.hasOwnProperty.call(this.lockerDoorList, doorId)) {
                const element = this.lockerDoorList[doorId];
                if(!boardIds.includes(element.board)) {
                    boardIds.push(element.board);
                }
            }
        }
        for (const boardId of boardIds) {
            let response_raw = await this.controlboardCommu.portWrite(functions.getCommandQueryState(boardId));
            console.log('[INFO] command querystate controlboard no.', boardId, response_raw);
            if(response_raw) {
                let channelStatus = {};
                channelStatus = Object.assign({},
                    this.convertHextoBinStatus(response_raw.slice(6, 7), 1),
                    this.convertHextoBinStatus(response_raw.slice(7, 8), 9),
                    this.convertHextoBinStatus(response_raw.slice(8, 9), 17));
                
                    Object.keys(this.lockerDoorList).map((doorId, key) => {
                      let door = this.lockerDoorList[doorId];
                      if(parseInt(door.board, 10) === parseInt(boardId, 10)) {
                        door['doorStatus'] = channelStatus[door.channel]
                      }
                      return door
                    });
            }
            else {
                Object.keys(this.lockerDoorList).map((doorId, key) => {
                    let door = this.lockerDoorList[doorId];
                    if(parseInt(door.board, 10) === parseInt(boardId, 10)) {
                      door['doorStatus'] = "Error"
                    }
                    return door
                  });
            }
        }
        
        if(this.lockerDoorList) {
            return this.lockerDoorList
        }
        else {
            return {
                "doorsStatus": "Error"
            }
        }
    }

    async doorLEDControl(doorNo, controlStatus){
        let door = lockerconfig.doorMapping[doorNo];
        if(door === undefined) {
            return {
                "doorID": doorNo,
                "doorStatus": "Error"
            }
        }
        let response = await this.controlboardCommu.portWrite(functions.getCommandLEDcontrol(door.board, door.channel));
        console.log('[INFO] command led control querystate door no.', doorNo, controlStatus? "ON": "OFF", response);
        if(response) {
            return {
                "doorID": doorNo,
                "doorStatus": controlStatus? "ON": "OFF"
            }
        }
        else {
            return {
                "doorID": doorNo,
                "doorStatus": "Error"
            }
        }
        
    }
    
    convertHextoBinStatus(hexValue, startIdx) {
        var hexString = hexValue.toString("hex").toUpperCase();
        var binString = (parseInt(hexString, 16)).toString(2);
        var binArray = binString.split('')
        let binaryStatus = {};
        binArray.slice().reverse().forEach(function(item, key) {
            let channel = (parseInt(key, 10) + startIdx).toString();
            binaryStatus[channel] = item;
        });
        return binaryStatus;
    }
}

module.exports = LockerCommand
