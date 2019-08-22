var SerialPort = require('serialport');
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

// This function broadcasts messages to all webSocket clients
function broadcast(data) {
    for (myConnection in connections) {   // iterate over the array of connections
     connections[myConnection].send(data); // send the data to each connection
    }
   }

var portName = "/dev/cu.usbmodemHIDNB1";

var myPort = new SerialPort(portName, 9600);

var Readline = SerialPort.parsers.Readline; // make instance of Readline parser
var parser = new Readline(); // make a new parser to read ASCII lines
myPort.pipe(parser); // pipe the serial stream to the parser

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
  
 function showPortClose() {
    console.log('port closed.');
 }
  
 function showError(error) {
    console.log('Serial port error: ' + error);
 }
