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
            response['doorStatus'] = "No door no." + doorNo.toString();
        }
        else {
            let response = await this.controlboardCommu.portWrite(functions.getCommandUnlock(door.board, door.channel));
            console.log('[INFO] command unlock door no.', doorNo, response);
            if(response) {
                let channelStatus = functions.getStatusFromQuery(response, doorNo);
                response['doorStatus'] = channelStatus;
            }
            else {
                response['doorStatus'] = "Serial communication error";
            }
        }
        return response;
    }

    async getDoorsStatus() {
        let response = {
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
                
                response['doorStatus'] = Object.keys(this.lockerDoorList).map((doorId) => {
                    if(parseInt(this.lockerDoorList[doorId].board, 10) === parseInt(boardId, 10)) {
                        return channelStatus[parseInt(this.lockerDoorList[doorId].channel, 10)-1]
                    }
                });
            }
            else {
                response['doorStatus'] = "Serial communication error on board id. " + boardId.toString();
            }
        }
        
        return response;
    }

    async doorLEDControl(doorNo, controlStatus){
        // Set default response
        let response = {
            "doorID": doorNo,
            "ledStatus": "Error"
        };

        let door = lockerconfig.doorMapping[doorNo];
        if(door !== undefined) {
            let serial_response = await this.controlboardCommu.portWrite(functions.getCommandLEDcontrol(door.board, door.channel));
            console.log('[INFO] command led control querystate door no.', doorNo, controlStatus? "ON": "OFF", response);
            if(serial_response) {
                return {
                    "doorID": doorNo,
                    "ledStatus": controlStatus? "ON": "OFF"
                }
            }
        }
        return response;
    }
}

module.exports = LockerCommand
