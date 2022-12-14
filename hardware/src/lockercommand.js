// src/controlboard.js
const SerialCommunication = require('../src/serialcommunication.js');

const lockerconfig = require('../config/lockerconfig.json');
const {config, functions} = require('../config/controllermodels/controlboardconfig.js');

class LockerCommand {
    constructor () {
        this.controlboardCommu = new SerialCommunication(config.Communication);
        this.lockerDoorList = lockerconfig.doorMapping;
    }
    lockerInfo() {
        if(lockerconfig) {
            return (lockerconfig);
        }
        else {
            return ({});
        }
        
    }







    async doorOpen(doorNo){
        let response = {
            "doorId": doorNo,
            "doorStatus": "Error",
            "status": "fail",
            "error_msg": ""
        };
        let door = lockerconfig.doorMapping[doorNo];
        if(door === undefined) {
            response['error_msg'] = "No door no." + doorNo.toString();
        }
        else {
            if(functions.getCommandUnlock) {
                let serial_response = await this.controlboardCommu.portWrite(functions.getCommandUnlock(door.board, door.channel));
                console.log('[INFO] command unlock door no.', doorNo, serial_response);
                
                if(serial_response) {
                    /*** Just prevent someboard not response with door status */
                    const selectedDoor = this.lockerDoorList[doorNo];
                    const boardId = selectedDoor.board;
                    const channel = selectedDoor.channel;
                    let serial_get_status_response = await this.controlboardCommu.portWrite(functions.getCommandQueryState(boardId));
                    if(serial_get_status_response) {
                        let doorStatus = functions.getStatusFromQuery(serial_get_status_response, doorNo);
                        response['doorStatus'] = doorStatus;
                        response['status'] = 'success';
                    }
                }
                else {
                    response['error_msg'] = "Serial communication error on board id. " + door.board.toString() + ", door no. " + door.channel.toString();
                }
            }
            else {
                response['error_msg'] = "No door Unlock command support on this control board";
            }
        }
        return response;
    }

    async getDoorsStatus() {
        let response = {
            "status": "fail",
            "error_msg": ""
        };
        if(functions.getCommandQueryState) {
            let boardIds = [];
            for (const doorId in this.lockerDoorList) {
                if (Object.hasOwnProperty.call(this.lockerDoorList, doorId)) {
                    const element = this.lockerDoorList[doorId];
                    if(!boardIds.includes(element.board)) {
                        boardIds.push(element.board);
                        
                    }
                    
                }
            }
            let doorsStatus = {};
            for (const boardId of boardIds) {
                let serial_response = await this.controlboardCommu.portWrite(functions.getCommandQueryState(boardId));
                console.log('[INFO] command querystate controlboard no.', boardId, serial_response);
                if(serial_response) {
                    let channelStatus = functions.getStatusFromQuery(serial_response);
                    Object.keys(this.lockerDoorList).map((doorId) => {
                        if(parseInt(this.lockerDoorList[doorId].board, 10) === parseInt(boardId, 10)) {
                            doorsStatus[doorId] = channelStatus[this.lockerDoorList[doorId].channel];
                        }
                    });
                    response['status'] = 'success';
                }
                else {
                    response['error_msg'] = "Serial communication error on board id. " + boardId.toString();
                }
            }
            response['doors'] = doorsStatus;
        }
        else {
            response['error_msg'] = "No door query state command support on this control board";
        }
        
        return response;
    }


    async getAllDoor() {
        let response = {
            "status": "fail",
            "error_msg": ""
        };
        if(functions.getCommandQueryState) {
            let boardIds = [];
            for (const doorId in this.lockerDoorList) {
                if (Object.hasOwnProperty.call(this.lockerDoorList, doorId)) {
                    const element = this.lockerDoorList[doorId];
                    if(!boardIds.includes(element.board)) {
                        boardIds.push(element.board);
                        
                    }
                    
                }
            }
            let doorsStatus = {};
            for (const boardId of boardIds) {
                let serial_response = await this.controlboardCommu.portWrite(functions.getCommandQueryState(boardId));
                console.log('[INFO] command querystate controlboard no.', boardId, serial_response);
                if(serial_response) {
                    let channelStatus = functions.getStatusFromQuery(serial_response);
                    Object.keys(this.lockerDoorList).map((doorId) => {
                        if(parseInt(this.lockerDoorList[doorId].board, 10) === parseInt(boardId, 10)) {
                            doorsStatus[doorId] = channelStatus[this.lockerDoorList[doorId].channel];
                        }
                    });
                    response['status'] = 'success';
                }
                else {
                    response['error_msg'] = "Serial communication error on board id. " + boardId.toString();
                }
            }
            response['doors'] = doorsStatus;
        }
        else {
            response['error_msg'] = "No door query state command support on this control board";
        }
        
        return response;
    }




    async getItemDtectionStatus() {
        let response = {
            "status": "fail",
            "error_msg": ""
        };
        if(functions.getCommandDetectItem) {
            let boardIds = [];
            for (const doorId in this.lockerDoorList) {
                if (Object.hasOwnProperty.call(this.lockerDoorList, doorId)) {
                    const element = this.lockerDoorList[doorId];
                    if(!boardIds.includes(element.board)) {
                        boardIds.push(element.board);
                    }
                }
            }
            let doorsStatus = {};
            for (const boardId of boardIds) {
                let serial_response = await this.controlboardCommu.portWrite(functions.getCommandDetectItem(boardId));
                console.log('[INFO] command querystate of item detection on controlboard no.', boardId, serial_response);
                if(serial_response) {
                    let channelStatus = functions.getDetecionStatusFromQuery(serial_response);
                    Object.keys(this.lockerDoorList).map((doorId) => {
                        if(parseInt(this.lockerDoorList[doorId].board, 10) === parseInt(boardId, 10)) {
                            doorsStatus[doorId] = channelStatus[this.lockerDoorList[doorId].channel];
                        }
                    });
                    response['status'] = 'success';
                }
                else {
                    response['error_msg'] = "Serial communication error on board id. " + boardId.toString();
                }
            }
            response['doors'] = doorsStatus;
        }
        else {
            response['error_msg'] = "No item detection state command support on this control board";
        }
        
        return response;
    }

    async doorLEDControl(doorNo, controlStatus) {
        // Set default response
        let response = {
            "doorId": doorNo,
            "ledStatus": "Error",
            "status": "fail",
            "error_msg": ""
        };

        if(functions.getCommandLEDcontrol) {
            let door = lockerconfig.doorMapping[doorNo];
            if(door !== undefined) {
                if(functions.getCommandLEDcontrol) {
                    let serial_response = await this.controlboardCommu.portWrite(functions.getCommandLEDcontrol(door.board, door.channel));
                    console.log('[INFO] command led control querystate door no.', doorNo, controlStatus? "ON": "OFF", response);
                    if(serial_response) {
                        return {
                            "doorId": doorNo,
                            "ledStatus": controlStatus? "ON": "OFF",
                            "status": "success"
                        }
                    }
                }
            }
            else {
                response['error_msg'] = "Serial communication error";
            }
        }
        else {
            response['error_msg'] = "No control led command support on this control board";
        }

        return response;
    }


    async getAll() {

        let response = {

            "status": "fail",

            "error_msg": ""

        };

        if(functions.getCommandUnlock) {

            let boardIds = [];

            for (const doorId in this.lockerDoorList) {

                if (Object.hasOwnProperty.call(this.lockerDoorList, doorId)) {

                    const element = this.lockerDoorList[doorId];

                    console.log(element)

                   

                   

               let door = lockerconfig.doorMapping[doorId];

               let serial_response = await this.controlboardCommu.portWrite(functions.getCommandUnlock(door.board, door.channel));

               

               

                if(serial_response) {

                    /*** Just prevent someboard not response with door status */

                    const selectedDoor = this.lockerDoorList[doorId];

                    const boardId = selectedDoor.board;

                    const channel = selectedDoor.channel;

                    let serial_get_status_response = await this.controlboardCommu.portWrite(functions.getCommandQueryState(boardId));

                    if(serial_get_status_response) {

                        let doorStatus = functions.getStatusFromQuery(serial_get_status_response, doorId);

                        response['doorStatus'] = doorStatus;

                        response['status'] = 'success';

                    }

                }

                else {

                    response['error_msg'] = "Serial communication error on board id. " + door.board.toString() + ", door no. " + door.channel.toString();

                }

                   

                }

            }

        }

        else {

            response['error_msg'] = "No door query state command support on this control board";

        }

       

        return response;

    }



}

module.exports = LockerCommand
