// routes/api/locker.js

const express = require('express');
const router = express.Router();

// Load Board Controller Command
const LockerCommand = require('../../src/lockercommand.js');

let lockerCtl = new LockerCommand();

// @route GET api/lockercontroller/locker
// @description Get locker configuration
// @access Public
router.get('/', (req, res) => {
  // Set default response
  let responseErrorCode = 400;
  let response = {
    status: "fail",
    status_msg: "",
    data: {}
  };
  let locker = lockerCtl.lockerInfo();
  if(locker != {}) {
    response.status = "success";
    response.data = locker;
    return res.json(response);
  }
  else {
    response.status_msg = 'No Locker config found';
  }
  return res.status(responseErrorCode).json(response);
});

// @route GET api/lockercontroller/locker/doors
// @description Get doors status list
// @access Public
router.get('/doors', async (req, res) => {
  // Set default response
  let responseErrorCode = 400;
  let response = {
    status: "fail",
    status_msg: "",
    data: {}
  };
  let doors = await lockerCtl.getDoorsStatus();
  if((doors === {}) || (doors === undefined)) {
    response.status_msg = 'No Doors found';
  }
  else {
    response.status = "success";
    response.data = doors;
    return res.json(response);
  }
  return res.status(responseErrorCode).json(response);
});

// @route GET api/lockercontroller/locker/doors/:status
// @description Get door that have a speficfic status list (opened, closed)
// @access Public
router.get('/doors/:status', async (req, res) => {
  // Set default response
  let responseErrorCode = 400;
  let response = {
    status: "fail",
    status_msg: "",
    data: {}
  };

  // Check requested status to filter
  const doorReqStatus = req.params.id;
  if(doorReqStatus in ['opened', 'closed']) {
    let doorStatusRepresent = 0;
    if(doorReqStatus === 'opened') {
        doorStatusRepresent = 1;
    }
    
    // Get filtered status
    let doors = await lockerCtl.getDoorsStatus();
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
          if(filteredDoors !== undefined) {
            response.status = "success";
            response.data = filteredDoors;
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

// @route GET api/lockercontroller/locker/door/:id/open
// @description Get single locker by id
// @access Public
router.get('/door/:id/open', async (req, res) => {
  // Set default response
  let responseErrorCode = 400;
  let response = {
    status: "fail",
    status_msg: "",
    data: {}
  };
  let door = await lockerCtl.doorOpen(req.params.id);
  if(lockerCtl.doorLEDControl) {
    let doorLED = await lockerCtl.doorLEDControl(req.params.id, true);
    door["led"] = doorLED.doorStatus;
  }
  
  if(door != {}) {
    response.status = "success";
    response.data = door;
    return res.json(response);
  }
  else {
    response.status_msg = 'Cannot open door';
  }
  return res.status(responseErrorCode).json(response);
});

// @route GET api/lockercontroller/locker/door/:id/status
// @description Get single locker by id
// @access Public
router.get('/door/:id/status', async (req, res) => {
  // Set default response
  let responseErrorCode = 400;
  let response = {
    status: "fail",
    status_msg: "",
    data: {}
  };
  
  const reqDoorId = req.params.id;
  let doors = await lockerCtl.getDoorsStatus();
  if((doors === {}) || (doors === undefined)) {
    response.status_msg = 'Cannot get door status';
  }
  else {/*
    console.log(doors);
    console.log(doors.doors[reqDoorId]);
    const filteredDoors = Object.keys(doors)
          .filter(doorId => doorId === reqDoorId)
          .reduce((obj, doorId) => {
            console.log(obj[doorId], doors[doorId])
            obj[doorId] = doors[doorId];
            return obj;
        }, {});
        console.log(filteredDoors);*/
    if(doors.doors[reqDoorId] !== undefined) {
      let doorObj = {
        doorId: reqDoorId,
        doorStatus: doors.doors[reqDoorId]
      }
      response.status = "success";
      response.data = doorObj;
      return res.json(response);
    }
    else {
      response.status_msg = 'No Door status found';
    }
  }
  return res.status(responseErrorCode).json(response);
});

module.exports = router;