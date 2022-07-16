// src/controlboard.js
const SerialCommunication = require('../src/serialcommunication.js');

const lockerconfig = require('../config/lockerconfig.json');
const {config, functions} = require('../config/controllermodels/controlboardconfig.js');

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
        let response = {
            "doorID": doorNo,
            "doorStatus": "Error"
        };
        let door = lockerconfig.doorMapping[doorNo];
        if(door === undefined) {
            response['error_msg'] = "No door no." + doorNo.toString();
        }
        else {
            let serial_response = await this.controlboardCommu.portWrite(functions.getCommandUnlock(door.board, door.channel));
            console.log('[INFO] command unlock door no.', doorNo, serial_response);
            if(serial_response) {
                let channelStatus = functions.getStatusFromQuery(serial_response, doorNo);
                response['doorStatus'] = channelStatus;
            }
            else {
                response['error_msg'] = "Serial communication error";
            }
        }
        return response;
    }

    async getDoorsStatus() {
        let response = [];
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
            let serial_response = await this.controlboardCommu.portWrite(functions.getCommandQueryState(boardId));
            console.log('[INFO] command querystate controlboard no.', boardId, serial_response);
            if(serial_response) {
                let channelStatus = functions.getStatusFromQuery(serial_response);
                
                let doorsStatus = {};
                
                Object.keys(this.lockerDoorList).map((doorId) => {
                    if(parseInt(this.lockerDoorList[doorId].board, 10) === parseInt(boardId, 10)) {
                        doorsStatus[doorId] = channelStatus[parseInt(this.lockerDoorList[doorId].channel, 10)-1];
                    }
                });
                response['doors'] = doorsStatus;
            }
            else {
                response['error_msg'] = "Serial communication error on board id. " + boardId.toString();
            }
        }
        
        return response;
    }

    async doorLEDControl(doorNo, controlStatus) {
        // Set default response
        let response = {
            "doorID": doorNo,
            "ledStatus": "Error"
        };

        let door = lockerconfig.doorMapping[doorNo];
        if(door !== undefined) {
            if(functions.getCommandLEDcontrol) {
                let serial_response = await this.controlboardCommu.portWrite(functions.getCommandLEDcontrol(door.board, door.channel));
                console.log('[INFO] command led control querystate door no.', doorNo, controlStatus? "ON": "OFF", response);
                if(serial_response) {
                    return {
                        "doorID": doorNo,
                        "ledStatus": controlStatus? "ON": "OFF"
                    }
                }
            }
        }
        else {
            response['error_msg'] = "Serial communication error on board id. " + boardId.toString();
        }

        return response;
    }
}

module.exports = LockerCommand
