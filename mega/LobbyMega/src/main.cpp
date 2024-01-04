#include <Arduino.h>

// void setup() {
//   Serial.begin(9600);
  
//   // Set all pins from 22 to 69 as INPUT_PULLUP
//   for (int pin = 22; pin <= 69; pin++) {
//     pinMode(pin, INPUT_PULLUP);
//   }
// }

// void loop() {
//   // Check all pins from 22 to 69
//   for (int pin = 22; pin <= 69; pin++) {
//     if (digitalRead(pin) == LOW) {
//       // Check if it's an analog pin (A0-A15)
//       if (pin >= 54) {
//         Serial.print("Button pressed on analog pin: A");
//         Serial.println(pin - 54);
//       } else {
//         // It's a digital pin
//         Serial.print("Button pressed on digital pin: ");
//         Serial.println(pin);
//       }
//     }
//   }

//   delay(100); // Short delay to debounce buttons and reduce serial output rate
// }


const int firstPin = 2;
const int lastPin = 68;
const long debounceDelay = 20;    // the debounce time

int buttonState[67];              // current state of the button
int lastButtonState[67] = {LOW};  // previous state of the button
unsigned long lastDebounceTime[67] = {0};  // last time the output pin was toggled

int outputPins[] = {43, 57, 39, 41, 42, 26,59,60,19,58};
int inputPins[] = {0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 23, 25, 27, 29, 30, 31, 32, 33, 35, 37, 46, 48, 50, 52, 55, 62, 63, 64, 65, 67, 68, 69};
// int outputPins[] = {1, 2, 11, 13, 14, 16, 17, 18, 19, 20, 21, 22, 24, 26, 28, 31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 47, 49, 51, 53, 54, 55, 56, 57, 58, 59, 60, 61, 66, 69};
// int outputPins[] = {43, 57, 39, 41, 42}; // P1 lights
// int outputPins[] = {26,59,60,19,58}; // P2 lights

// int outputPins[] = {};
// int inputPins[] = {3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69};


void setup() {
  Serial.begin(9600);
  for (int i = 0; i < sizeof(inputPins)/sizeof(inputPins[0]); i++) {
      pinMode(inputPins[i], INPUT_PULLUP);
      buttonState[i] = digitalRead(inputPins[i]);
  }

  for (int i = 0; i < sizeof(outputPins)/sizeof(outputPins[0]); i++) {
    pinMode(outputPins[i], OUTPUT);
    digitalWrite(outputPins[i], LOW);
  }

  for (int i = 0; i < sizeof(outputPins)/sizeof(outputPins[0]); i++) {
    digitalWrite(outputPins[i], HIGH);  // Turn on the output pin
    // Serial.println(outputPins[i]);
    delay(100);                         // Keep it on for 500ms
    digitalWrite(outputPins[i], LOW);   // Turn off the output pin
  }

}

void handleSerialCommand(String command) {
  // L39 0
  // L43 1
  if (command.startsWith("L")) {


    int spaceIndex = command.indexOf(' ');
    int pin = command.substring(1, spaceIndex).toInt();
    String valueStr = command.substring(spaceIndex + 1);

    bool direction;
    if (valueStr == "HIGH") {
      direction = HIGH;
    } else if (valueStr == "LOW") {
      direction = LOW;
    } else {
      return; // Exit the function if the value is not valid
    }

    for (int i = 0; i < sizeof(outputPins)/sizeof(outputPins[0]); i++) {
      digitalWrite(outputPins[i], LOW);   // Turn off the output pin
    }

    // Iterating through the outputPins array to check if the pin is within the LED range
    for (int i = 0; i < sizeof(outputPins)/sizeof(outputPins[0]); i++) {
      if (outputPins[i] == pin) {
        digitalWrite(pin, direction);


        break; // Break out of the loop once the match is found
      }
    }
  }
}


void loop() {

  // Sequentially light up each output pin

  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    handleSerialCommand(command);
  }

  for (int i = 0; i < sizeof(inputPins)/sizeof(inputPins[0]); i++) {
    int reading = digitalRead(inputPins[i]);

    // Check if the button state has changed
    if (reading != lastButtonState[i]) {
      lastDebounceTime[i] = millis();
    }

    if ((millis() - lastDebounceTime[i]) > debounceDelay) {
      // If the button state has changed:
      if (reading != buttonState[i]) {
        buttonState[i] = reading;

        if (inputPins[i] != 57) {
 
          // Only send the button state when it's pressed
          if (buttonState[i] == LOW) {
            Serial.print("B");
            Serial.print(inputPins[i]);
            Serial.println(" 1");
          }

          if (buttonState[i] == HIGH) {
            Serial.print("B");
            Serial.print(inputPins[i]);
            Serial.println(" 0");
          }
        }
       
      }
    }
    lastButtonState[i] = reading;
  }
}

