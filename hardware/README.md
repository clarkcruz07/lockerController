# Hardware Service API
* VER 1.3.0

## Endpoint
`http://localhost:9090`

## Get locker config
`GET` api/locker
#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| -  | -  |

#### response
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

```
{
    status: "success",
    status_msg: "successful get locker configuration",
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
`GET` api/locker/doors

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| -  | -  |

#### response
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

```
{
    status: "success",
    status_msg: "successful get locker configuration",
    data: {
        doors: {
            STRING_DOOR_ID: STRING_DOOR_STATUS,
            ...
        }
    }
}

```

## Get filtered doors status by status name (opened, closed)
`GET` api/locker/doors/:status

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| -  | -  |

#### response
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

```
{
    status: "success",
    status_msg: "successful get locker configuration",
    data: {
        doorID: STRING_DOOR_ID,
        doorStatus: STRING_DOOR_STATUS
    }
}

```


## Open specific door
`GET` api/locker/door/:id/open

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| id  | door indentify number that begin from 1 |

#### response
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

```
{
    status: "success",
    status_msg: "successful get locker configuration",
    data: {
        doorID: STRING_DOOR_ID,
        doorStatus: STRING_DOOR_STATUS
    }
}

```


## Open All doors (Unavailable now)
`GET` api/locker/doors/open

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| -  | -  |

#### response
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

```
{
    status: "success",
    status_msg: "successful get locker configuration",
    data: {
        doors: {
            STRING_DOOR_ID: STRING_DOOR_STATUS,
            ...
        }
    }
}

```

## Get specific door status
`GET` api/locker/door/:id/status

#### request parameters
| Parameter name | Description |
| ------------- | ------------- |
| id  | door indentify number that begin from 1 |

#### response
| Parameter name | Description |
| ------------- | ------------- |
| status  | response status (success, fail)  |
| status_msg  | response stus message |
| data  | repsponse data  |

```
{
    status: "success",
    status_msg: "successful get locker configuration",
    data: {
        doorID: STRING_DOOR_ID,
        doorStatus: STRING_DOOR_STATUS
    }
}

```