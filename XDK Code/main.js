"use strict" ;

//house keeping:
var APP_NAME = "ASK Demo" ;
var cfg = require("./utl/cfg-app-platform.js")() ;      // init and config I/O resources

console.log("\n\n\n\n\n\n") ;                           // poor man's clear console
console.log("Initializing " + APP_NAME) ;



cfg.identify() ;              

if( !cfg.test() ) {
process.exit(1) ;
}

if( !cfg.init() ) {
process.exit(2) ;
}


//start of code:


const deviceModule = require('aws-iot-device-sdk').device;




function connectAWS() {

   const device = deviceModule({
      keyPath: "/root/Gateway-ASK.private.key", //Make sure these paths match your certifacte locations 
      certPath: "/root/Gateway-ASK.cert.pem",
      caPath: "/root/root-CA.crt",
      host: "END_POINT.amazonaws.com", //Replace with your endpoint from AWS IoT Device Dashboard
   });


      device.subscribe('$aws/things/Gateway-ASK/shadow/update/accepted');
      device.publish('topic_1', 'hello')

device
      .on('connect', function() {
         console.log('connect');
      });
   device
      .on('close', function() {
         console.log('close');
      });
   device
      .on('reconnect', function() {
         console.log('reconnect');
      });
   device
      .on('offline', function() {
         console.log('offline');
      });
   device
      .on('error', function(error) {
         console.log('error', error);
      });
   device
      .on('message', function(topic, payload) {
         console.log('message', topic, payload.toString());
         updateState(payload)
      });

}


//enable leds:
var green_led = new cfg.mraa.Gpio(3+512, cfg.ioOwner, cfg.ioRaw) ;
var red_led = new cfg.mraa.Gpio(4+512, cfg.ioOwner, cfg.ioRaw) ;

green_led.dir(cfg.mraa.DIR_OUT) ;        
red_led.dir(cfg.mraa.DIR_OUT) ;    

//globals:
var green_led_state = 0;
var red_led_state = 0;
var shadow = null;


function updateState(payload){
//var payload=JSON.parse(shadow.payload)
var pay_json=JSON.parse(payload.toString())
green_led_state = pay_json.state.desired.blue_led
red_led_state = pay_json.state.desired.red_led


console.log(green_led_state)
green_led.write(green_led_state)
red_led.write(red_led_state)


};


connectAWS();





