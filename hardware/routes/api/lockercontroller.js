// routes/api/locker.js

const express = require('express');
const router = express.Router();

// Load Board Controller Command
const LockerCommand = require('../../src/lockercommand.js');

let lockerCtl = new LockerCommand();

// @route GET api/lockercontroller
// @description Get locker configuration
// @access Public
router.get('/', (req, res) => {
  // Set default response
  let responseErrorCode = 400;
  let response = {
    status: "fail",
    status_msg: ""
  };
  let locker = lockerCtl.lockerInfo();
  if(locker != {}) {
    response.status = "success";
    response['data'] = locker;
    return res.json(response);
  }
  else {
    response.status_msg = 'No Locker config found';
  }
  return res.status(responseErrorCode).json(response);
});

// @route GET api/lockercontroller/doors
// @description Get doors status list
// @access Public
router.get('/doors', async (req, res) => {
  // Set default response
  let responseErrorCode = 400;
  let response = {
    status: "fail",
    status_msg: ""
  };
  let doors = await lockerCtl.getDoorsStatus();
  if((doors === {}) || (doors === undefined)) {
    response.status_msg = 'No Doors found';
  }
  else {
    response.status = "success";
    response['data'] = doors;
    return res.json(response);
  }
  return res.status(responseErrorCode).json(response);
});

// @route GET api/lockercontroller/doors/:status
// @description Get door that have a speficfic status list (opened, closed)
// @access Public
router.get('/doors/:status', async (req, res) => {
  // Set default response
  let responseErrorCode = 400;
  let response = {
    status: "fail",
    status_msg: ""
  };

  // Check requested status to filter
  const rqDoorStatus = req.params.status;
  console.log('rqDoorStatus', rqDoorStatus, rqDoorStatus in ['opened', 'closed']);
  if(rqDoorStatus in ['opened', 'closed']) {
    let doorStatusRepresent = 0;
    if(rqDoorStatus === 'opened') {
        doorStatusRepresent = 1;
    }
    
    // Get filtered status
    let doors = await lockerCtl.getDoorsStatus();
    console.log(doors);
    if((doors === {}) || (doors === undefined)) {
      response.status_msg = 'Cannot get door status';
    }
    else {
      const filteredDoors = Object.keys(doors)
            .filter(doorId => parseInt(doors[doorId].doorStatus, 10) === doorStatusRepresent)
            .reduce((obj, doorId) => {
                obj[doorId] = doors[doorId];
                return obj;
          }, {});
          console.log('filteredDoors', filteredDoors);
          if(filteredDoors !== undefined) {
            response.status = "success";
            response['data'] = filteredDoors;
            return res.json(response);
          }
          else {
            response.status_msg = 'No Door status found';
          }
    }
  }
  else {
    response.status_msg = 'Wrong status name, required "opened" or "closed"';
  }
  return res.status(responseErrorCode).json(response);
});

// @route GET api/lockercontroller/door/:id/open
// @description Get single locker by id
// @access Public
router.get('/door/:id/open', async (req, res) => {
  // Set default response
  let responseErrorCode = 400;
  let response = {
    status: "fail",
    status_msg: ""
  };

  const reqDoorId = req.params.id;
  let door = await lockerCtl.doorOpen(reqDoorId);
  if(lockerCtl.doorLEDControl) {
    let doorLED = await lockerCtl.doorLEDControl(reqDoorId, true);
    door["led"] = doorLED.doorStatus;
  }
  
  if(door != {}) {
    console.log('door', door);
    let doorObj = {
      doorId: reqDoorId,
      doorStatus: door.doorStatus
    }
    response.status = "success";
    response['data'] = doorObj;
    return res.json(response);
  }
  else {
    response.status_msg = 'Cannot open door';
  }
  return res.status(responseErrorCode).json(response);
});

// @route GET api/lockercontroller/door/:id/status
// @description Get single locker by id
// @access Public
router.get('/door/:id/status', async (req, res) => {
  // Set default response
  let responseErrorCode = 400;
  let response = {
    status: "fail",
    status_msg: ""
  };
  
  const reqDoorId = req.params.id;
  let doors = await lockerCtl.getDoorsStatus();
  if((doors === {}) || (doors === undefined)) {
    response.status_msg = 'Cannot get door status';
  }
  else {
    if(doors.doors[reqDoorId] !== undefined) {
      let doorObj = {
        doorId: reqDoorId,
        doorStatus: doors.doors[reqDoorId]
      }
      response.status = "success";
      response['data'] = doorObj;
      return res.json(response);
    }
    else {
      response.status_msg = 'No Door status found';
    }
  }
  return res.status(responseErrorCode).json(response);
});

module.exports = router;