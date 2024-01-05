const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

var WebSocketServer = require('ws').Server;

var SERVER_PORT = 3002;               // port number for the webSocket server
var wss = new WebSocketServer({port: SERVER_PORT}); // the webSocket server
var connections = new Array;          // list of connections to the server

wss.on('connection', handleConnection);
 
function handleConnection(client) {
 console.log("New Connection"); // you have a new client
 connections.push(client); // add this client to the connections array
 
 client.on('message', sendToSerial); // when a client sends a message,
 
 client.on('close', function() { // when a client closes its connection
 console.log("connection closed"); // print it out
 var position = connections.indexOf(client); // get the client's position in the array
 connections.splice(position, 1); // and delete it from the array
 });
}

function sendToSerial(data) {
    console.log("sending to serial: " + data);
    myPort.write(data);
}

function broadcast(data) {
   for (myConnection in connections) {   // iterate over the array of connections
      connections[myConnection].send(data); // send the data to each connection
   }
}

// const portName = "/dev/ttyACM0";

const portName = "/dev/tty.usbmodem114401";
// const portName = "/dev/tty.usbmodem1101";
const myPort = new SerialPort({ path: portName, baudRate: 9600 });

const parser = new ReadlineParser({ delimiter: '\n' });
myPort.pipe(parser);

myPort.on('open', showPortOpen);
parser.on('data', readSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
    console.log('port open. Data rate: ' + myPort.baudRate);

 }
  
 function readSerialData(data) {
    console.log(data);
   if (connections.length > 0) {
    broadcast(data);
  }
 }

 function sendToSerial(data) {
   const message = data.toString();

   console.log(message)

   // Check if the data is for an LED command
   if (message.startsWith("L")) {
       // Parse the command
       const parts = message.split(' '); // ["L12", "1"]
       const ledPin = parts[0].substring(1); // "12"
       const ledState = parts[1] === "1" ? "HIGH" : "LOW"; // "HIGH" or "LOW"

       // Construct the command string for Arduino
       const command = `L${ledPin} ${ledState}\n`;

       myPort.write(command);
   }
}
  
 function showPortClose() {
    console.log('port closed.');
 }
  
 function showError(error) {
    console.log('Serial port error: ' + error);
 }
