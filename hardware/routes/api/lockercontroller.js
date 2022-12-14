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

    response.status_msg = 'Successful get locker configuration';

    return res.json(response);

  }

  else {

    response.status_msg = 'No Locker config found';

  }

  return res.status(responseErrorCode).json(response);

});



//*////////////////////////////////////////// Door control

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

  if(doors.status === 'success') {

    response.status = "success";

    response['data'] = doors;

    response.status_msg = 'Successful get all doors status';
    
    return res.json(response);

  }

  else {

    response.status_msg = 'No Doors found: ' + doors.error_msg;

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

  const doorPossibleStatus = ['opened', 'closed'];

  const rqDoorStatus = req.params.status;

  if(doorPossibleStatus.includes(rqDoorStatus)) {

    let doorStatusRepresent = 0;

    if(rqDoorStatus === 'opened') {

        doorStatusRepresent = 1;

    }

   

    // Get filtered status

    let doorStatusResponse = await lockerCtl.getDoorsStatus();

    if(doorStatusResponse.status === 'success') {

      const filteredDoors = [];

      for (const key in doorStatusResponse.doors) {

        if (Object.hasOwnProperty.call(doorStatusResponse.doors, key)) {

          const doorStatus = doorStatusResponse.doors[key];

          let reqDoorStatus = rqDoorStatus === 'opened'? 'open' : rqDoorStatus === 'closed'? 'close': '';

          if(doorStatus === reqDoorStatus) {

            filteredDoors.push({

              doorId: key,

              doorStatus: doorStatus

            });

          }

         

        }

      }

      if(filteredDoors !== undefined) {

        response.status = "success";

        response['data'] = filteredDoors;

        response.status_msg = 'Successful get ' + req.params.status + ' door status';

        return res.json(response);

      }

      else {

        response.status_msg = 'No Door status found';

      }

    }

    else {

      response.status_msg = 'Cannot get door status: ' + doorStatusResponse.error_msg;

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

 

  if(door.status === 'success') {

    let doorObj = {

      doorId: reqDoorId,

      doorStatus: door.doorStatus

    }

    response.status = "success";

    response['data'] = doorObj;

    response.status_msg = 'Successful open door no.' + req.params.id;

    return res.json(response);

  }

  else {

    response.status_msg = 'Cannot open door: ' + door.error_msg;

  }

  return res.status(responseErrorCode).json(response);

});


router.get('/getAll', (req, res) => {

  // Set default response

  let responseErrorCode = 400;

  let response = {

    status: "fail",

    status_msg: ""

  };

  let locker = lockerCtl.getAll();

  if(locker != {}) {

    response.status = "success";

    response['data'] = locker;

    response.status_msg = 'Successful get locker configuration';

    return res.json(response);

  }

  else {

    response.status_msg = 'No Locker config found';

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

  if(doors.status === 'success') {

    if(doors.doors[reqDoorId] !== undefined) {

      let doorObj = {

        doorId: reqDoorId,

        doorStatus: doors.doors[reqDoorId]

      }

      response.status = "success";

      response['data'] = doorObj;

      response.status_msg = 'Successful get door no.' + req.params.id + ' status';

      return res.json(response);

    }

    else {

      response.status_msg = 'No Door no.' + reqDoorId + ' status found';

    }

  }

  else {

    response.status_msg = 'Cannot get door status: ' + doors.error_msg;

  }

  return res.status(responseErrorCode).json(response);

});



// @route GET api/lockercontroller/led/:id/on

// @description Turn single locker led by id on

// @access Public

router.get('/led/:id/on', async (req, res) => {

  // Set default response

  let responseErrorCode = 400;

  let response = {

    status: "fail",

    status_msg: ""

  };



  const reqDoorId = req.params.id;

  let doorLED;

  if(lockerCtl.doorLEDControl) {

    doorLED = await lockerCtl.doorLEDControl(reqDoorId, true);

  }

 

  if(doorLED.status === 'success') {

    let doorObj = {

      doorId: reqDoorId,

      doorStatus: doorLED.doorStatus

    }

    response.status = "success";

    response['data'] = doorObj;

    response.status_msg = 'Successful turned door no.' + req.params.id + ' led on';

    return res.json(response);

  }

  else {

    response.status_msg = 'Cannot turn led ON: ' + doorLED.error_msg;

  }

  return res.status(responseErrorCode).json(response);

});




//*////////////////////////////////////////// Item Detection

// @route GET api/lockercontroller/itemdetects

// @description Get item detection of all door status list

// @access Public

router.get('/itemdetects', async (req, res) => {

  // Set default response

  let responseErrorCode = 400;

  let response = {

    status: "fail",

    status_msg: ""

  };

  let doors = await lockerCtl.getItemDtectionStatus();

  if(doors.status === 'success') {

    response.status = "success";

    response['data'] = doors;

    response.status_msg = 'Successful get all doors item detection';

    return res.json(response);

  }

  else {

    response.status_msg = 'No Doors found: ' + doors.error_msg;

  }

  return res.status(responseErrorCode).json(response);

});



// @route GET api/lockercontroller/itemdetect/:id/status

// @description Get item detection of single door by id

// @access Public

router.get('/itemdetect/:id/status', async (req, res) => {

  // Set default response

  let responseErrorCode = 400;

  let response = {

    status: "fail",

    status_msg: ""

  };

 

  const reqDoorId = req.params.id;

  let doors = await lockerCtl.getItemDtectionStatus();

  if(doors.status === 'success') {

    if(doors.doors[reqDoorId] !== undefined) {

      let doorObj = {

        doorId: reqDoorId,

        doorStatus: doors.doors[reqDoorId]

      }

      response.status = "success";

      response['data'] = doorObj;

      response.status_msg = 'Successful get door no.' + req.params.id + ' item detection';

      return res.json(response);

    }

    else {

      response.status_msg = 'No Door no.' + reqDoorId + ' status found';

    }

  }

  else {

    response.status_msg = 'Cannot get door item detection status: ' + doors.error_msg;

  }

  return res.status(responseErrorCode).json(response);

});

module.exports = router;