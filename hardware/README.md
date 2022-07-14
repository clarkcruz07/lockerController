# Hardware Service API
* VER 0.1.0

## Get locker config
`GET` api/locker
response
'''
{
    status: "success",

}
'''

## Get all doors status
`GET` api/locker/doors

## Get all opened doors status
`GET` api/locker/doors/opened

## Get all closed doors status
`GET` api/locker/doors/closed


## Open specific door
`GET` api/locker/door/:id/open
parameters:
- `id` is door id that begin from 1


## Open All doors (Unavailable now)
`GET` api/locker/doors/open


## Get specific door status
`GET` api/locker/door/:id/status
parameters:
- `id` is door id that begin from 1
