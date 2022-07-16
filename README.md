# Locker control API #

This is api to access locker controller RS485 interface via REST API. NodeJS based development.

### Release ###

* 18/06/2022 - Version 1.0
* 22/06/2022 - Version 1.1
* 24/06/2022 - Version 1.2
* 16/07/2022 - Version 1.3

### Updates ###

* 12/06/2022 - Demonstrate state
* 22/06/2022 - Add demo page and flow
* 24/06/2022 - Fix fronend folder bug and clean code
* 16/07/2022 - Update API documents and fix api response bug

### Firmware Description ###
Firmware contains 2 micro services
* '001-hardware' as Hardware Interfaceing service using port 9090
* '002-frontend' as Frontend provider service using port 80 (3000 on development)

### Installation ###
* clone git
* install nodejs `sudo apt install nodejs`
* run command to install nodejs packages
```
cd hardware/
npm install
cd ../frontend/
npm install
cd ..
```
* register hardware interfaceing service via pm2 `cd ../hardware/` then `pm2 start --name 001-hardware npm -- start`
* register frontend provider service via pm2 `cd ../frontend/` then `pm2 serve -s build 80 --spa -n 002-frontend`
