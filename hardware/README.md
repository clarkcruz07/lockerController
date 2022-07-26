# Hardware Service API
* VER 1.3.0

## Endpoint
`http://localhost:9090`

## Get locker config
`GET` api/lockercontroller
#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| -  | -  |

#### response parameters
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

#### example response
```
{
    status: "success",
    status_msg: "Successful get locker configuration",
    data: {
        "lockerID": STRING_OCKER_ID,
        "controllerModel": STRING_CONTROLLER_MODEL_NAME,
        "lang": STRING_SUPPORTED_LANGUAGE,
        "BoardAmount": INT_INSTALLED_CONTROLBOARD_AMOUNT,
        "sectionLayout": {
            SECTION_OR_COLUMN_NUMBER: INT_COLUMN_DOOR_AMOUNT,
            ...
        },
        "doorMapping": {
            "DOOR_NUMBER": {
                "board": STRING_CONTROLBOARD_ID,
                "channel": INT_CONTROLBOARD_DOORD_CHANNEL,
                "doorSize": INT_DOOR_SIZE
            },
            ...
        },
        "doorGroup": {
            SECTION_OR_COLUMN_NUMBER: [
                STRING_DOOR_ID,
                ...
            ],
            ...
        }
    }
}

```

## Get all doors status
`GET` api/lockercontroller/doors

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| -  | -  |

#### response parameters
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

#### example response
```
{
    status: "success",
    status_msg: "Successful get all doors status",
    data: {
        doors: {
            STRING_DOOR_ID: STRING_DOOR_STATUS,
            ...
        }
    }
}

```

## Get filtered doors status by status name (opened, closed)
`GET` api/lockercontroller/doors/:status

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| -  | -  |

#### response parameters
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

#### example response
```
{
    status: "success",
    status_msg: "Successful get :status doors status",
    data: [
        {
            doorId: STRING_DOOR_ID,
            doorStatus: STRING_DOOR_STATUS
        },
        ...
    ]
}

```


## Open specific door
`GET` api/lockercontrollerlocker/door/:id/open

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| id  | door indentify number that begin from 1 |

#### response parameters
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

#### example response
```
{
    status: "success",
    status_msg: "Successful open door no. :id",
    data: {
        doorId: STRING_DOOR_ID,
        doorStatus: STRING_DOOR_STATUS
    }
}

```
** Remark: now doorStatus may be not send with package if board not response data after open, but status still can get from get status API **


## Open All doors (Unavailable now)
`GET` api/lockercontroller/doors/open

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| -  | -  |

#### response parameters
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

#### example response
```
{
    status: "success",
    status_msg: "Successful open all doors",
    data: {
        doors: {
            STRING_DOOR_ID: STRING_DOOR_STATUS,
            ...
        }
    }
}

```

## Get specific door status
`GET` api/lockercontroller/door/:id/status

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| id  | door indentify number that begin from 1 |

#### response parameters
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

#### example response
```
{
    status: "success",
    status_msg: "Successful get door no. :id status",
    data: {
        doorId: STRING_DOOR_ID,
        doorStatus: STRING_DOOR_STATUS
    }
}

```

## Open turn specific door led on
`GET` api/lockercontrollerlocker/led/:id/on

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| id  | door indentify number that begin from 1 |

#### response parameters
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

#### example response
```
{
    status: "success",
    status_msg: "Successful turned door no. :id led on",
    data: {
        doorId: STRING_DOOR_ID,
        doorStatus: STRING_DOOR_STATUS
    }
}
```

## Get all door item detection status
`GET` api/lockercontroller/itemdetects

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| -  | -  |

#### response parameters
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

#### example response
```
{
    status: "success",
    status_msg: "Successful get all doors item detection",
    data: {
        doors: {
            STRING_DOOR_ID: STRING_DOOR_STATUS,
            ...
        }
    }
}

```

## Get specific door item detection status
`GET` api/lockercontrollerlocker/itemdetect/:id/status

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| id  | door indentify number that begin from 1 |

#### response parameters
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

#### example response
```
{
    status: "success",
    status_msg: "Successful get door no. :id item detection",
    data: {
        doorId: STRING_DOOR_ID,
        doorStatus: STRING_DOOR_STATUS
    }
}
```