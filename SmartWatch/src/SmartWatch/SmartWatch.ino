
#include <Arduino.h>
#include <CurieBLE.h>
#include <LiquidCrystal.h>
#include <regex>
#include "ArduinoJson/ArduinoJson.h";
#include "parser.h"



BLEPeripheral blePeripheral;  // BLE Peripheral Device (the board you're programming)
BLEService comService("e582195d-50e4-4fc0-8dca-a8b10704694d"); // Communication Service
BLECharacteristic message("e582195d-50e4-4fc0-8dca-a8b10704694d", BLERead | BLEWrite,16);
LiquidCrystal lcd(10, 11, 12, 13, 14, 15, 16);


char* typedMessage;
const char nullchar[32] = {};
byte buttonPin = 8;

void smartAfficher(String msg, int size){

 
  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print(msg);
      Serial.println("first line");

  if(size > 15){
    Serial.println("more than one line");
    Serial.println("must print");
    lcd.setCursor(0,1);
    lcd.print(&msg[15]);
  }


  
  
}

void backToMenu(){
  noInterrupts();
  lcd.clear();
  smartAfficher((char *)"My FoxTrotters  watch",21);
  interrupts();
}



void setup()
{

  Serial.begin(9600);
  while (!Serial);
  Serial.println("Beginning");
  blePeripheral.setLocalName("FoxTrotters_SmartWatch");
  blePeripheral.setAdvertisedServiceUuid(comService.uuid());

  //add service and charac
  blePeripheral.addAttribute(comService);
  blePeripheral.addAttribute(message);
  blePeripheral.setAppearance(true);

  message.setValue((unsigned char *)nullchar,32); //set to default value


  // initialize LED digital pin as an output.
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(buttonPin,INPUT);

  //Set button interruption
  attachInterrupt(digitalPinToInterrupt(buttonPin), backToMenu, RISING);

  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
 
  

  typedMessage = "";
  message.setValue((unsigned char *)nullchar,32); //set to default value


  blePeripheral.begin();

    // Print a message to the LCD.
  backToMenu();
}

void loop()
{

  BLECentral central = blePeripheral.central();

  if(central){
    Serial.println("Connected to central");

    while (central.connected()) {
   
      if(message.written()){
        Serial.println("Received");
        Serial.println((char*)message.value());
       
       
        if(bufferize((char*)message.value())){
          lcd.clear();
          smartAfficher(buf,buf.length());
          buf = "";
          /*Serial.println((char*)message.value());
          Serial.println(digitalRead(buttonPin));
          Serial.println("Done");*/
        }
        memset((unsigned char *)nullchar, 0, 32);
        message.setValue((unsigned char *)nullchar,32); //set to default value
      }
    }
  }

  delay(1000);
}


