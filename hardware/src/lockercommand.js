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
        let result = {
            "doorID": doorNo,
            "doorStatus": "Error"
        };
        let door = lockerconfig.doorMapping[doorNo];
        if(door === undefined) {
            result['doorStatus'] = "No door no." + doorNo.toString();
        }
        else {
            let response = await this.controlboardCommu.portWrite(functions.getCommandUnlock(door.board, door.channel));
            console.log('[INFO] command unlock door no.', doorNo, response);
            if(response) {
                let channelStatus = functions.getStatusFromQuery(response);
                result['doorStatus'] = STATUS_DOOROPEN;
            }
            else {
                result['doorStatus'] = "Serial communication error";
            }
        }
        return result;
    }

    async getDoorsStatus() {
        let result = {
            'doorStatus': 'Error'
        };
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
            let response = await this.controlboardCommu.portWrite(functions.getCommandQueryState(boardId));
            console.log('[INFO] command querystate controlboard no.', boardId, response);
            if(response) {
                let channelStatus = functions.getStatusFromQuery(response);
                
                result['doorStatus'] = Object.keys(this.lockerDoorList).map((doorId) => {
                    if(parseInt(this.lockerDoorList[doorId].board, 10) === parseInt(boardId, 10)) {
                        return channelStatus[parseInt(this.lockerDoorList[doorId].channel, 10)-1]
                    }
                });
            }
            else {
                result['doorStatus'] = "Serial communication error on board id. " + boardId.toString();
            }
        }
        
        return result;
    }

    async doorLEDControl(doorNo, controlStatus){
        let door = lockerconfig.doorMapping[doorNo];
        if(door === undefined) {
            return {
                "doorID": doorNo,
                "doorLEDStatus": "Error"
            }
        }

        let response = undefined;
        if(functions.getCommandLEDcontrol) {
            response = await this.controlboardCommu.portWrite(functions.getCommandLEDcontrol(door.board, door.channel));
            console.log('[INFO] command led control querystate door no.', doorNo, controlStatus? "ON": "OFF", response);
        }
        if(response) {
            return {
                "doorID": doorNo,
                "doorLEDStatus": controlStatus? "ON": "OFF"
            }
        }
        else {
            return {
                "doorID": doorNo,
                "doorLEDStatus": "Error"
            }
        }
        
    }
}

module.exports = LockerCommand
