// routes/api/locker.js

const express = require('express');
const router = express.Router();

// Load Board Controller Command
const LockerCommand = require('../../src/lockercommand.js');

let lockerCtl = new LockerCommand();

// @route GET api/locker
// @description Get locker infomations
// @access Public
router.get('/', (req, res) => {
  let response = {
    status: "fail",
    status_msg: "",
    data: {}
  };
  let locker = lockerCtl.lockerInfo();
  if(locker != {}) {
    response.status = "success";
    response.data = locker;
    return res.json(response)
  }
  else {
    response.status_msg = 'No Locker data found';
    return res.status(404).json(response)
  }
});

// @route GET api/locker/doors
// @description Get door list
// @access Public
router.get('/doors', async (req, res) => {
  let response = {
    status: "fail",
    status_msg: "",
    data: {}
  };
  let doors = await lockerCtl.getDoorsStatus();
  if(doors != {}) {
    response.status = "success";
    response.data = doors === undefined? {}: doors;
    return res.json(response)
  }
  else {
    response.status_msg = 'No Doors found';
    return res.status(404).json(response)
  }
});

// @route GET api/locker/doors/closed
// @description Get closed door list
// @access Public
router.get('/doors/closed', async (req, res) => {
  let response = {
    status: "fail",
    status_msg: "",
    data: {}
  };
  let doors = await lockerCtl.getDoorsStatus();
  if(doors != {}) {
    const filteredDoors = Object.keys(doors)
          .filter(doorId => parseInt(doors[doorId].doorStatus, 10) === 0)
          .reduce((obj, doorId) => {
              obj[doorId] = doors[doorId];
              return obj;
        }, {});
    response.status = "success";
    response.data = filteredDoors === undefined? {}: filteredDoors;
    return res.json(response)
  }
  else {
    response.status_msg = 'No Doors found';
    return res.status(404).json(response)
  }
});

// @route GET api/locker/doors/opened
// @description Get opened door list
// @access Public
router.get('/doors/opened', async (req, res) => {
  let response = {
    status: "fail",
    status_msg: "",
    data: {}
  };
  let doors = await lockerCtl.getDoorsStatus();
  if(doors != {}) {
    const filteredDoors = Object.keys(doors)
          .filter(doorId => parseInt(doors[doorId].doorStatus, 10) === 1)
          .reduce((obj, doorId) => {
              obj[doorId] = doors[doorId];
              return obj;
        }, {});
    response.status = "success";
    response.data = filteredDoors === undefined? {}: filteredDoors;
    return res.json(response)
  }
  else {
    response.status_msg = 'No Doors found';
    return res.status(404).json(response)
  }
});

// @route GET api/locker/door/:id
// @description Get single locker by id
// @access Public
router.get('/door/:id/open', async (req, res) => {
  let response = {
    status: "fail",
    status_msg: "",
    data: {}
  };
  let door = await lockerCtl.doorOpen(req.params.id);
  let doorLED = await lockerCtl.doorLEDControl(req.params.id, true);
  door["led"] = doorLED.doorStatus;
  
  if(door != {}) {
    return res.json(door)
  }
  else {
    response.status_msg = 'Cannot open door';
    return res.status(404).json(response)
  }
});

// @route GET api/locker/door/:id
// @description Get single locker by id
// @access Public
router.get('/door/:id/status', async (req, res) => {
  const reqDoorId = req.params.id;
  let response = {
    status: "fail",
    status_msg: "",
    data: {}
  };
  let doors = await lockerCtl.getDoorsStatus();
  if(doors != {}) {
    const filteredDoors = Object.keys(doors)
          .filter(doorId => doorId === reqDoorId)
          .reduce((obj, doorId) => {
              obj[doorId] = doors[doorId];
              return obj;
        }, {});
    response.status = "success";
    response.data = filteredDoors === undefined? {}: filteredDoors;
    return res.json(response)
  }
  else {
    response.status_msg = 'Cannot get door status';
    return res.status(404).json(response)
  }
});

module.exports = router;