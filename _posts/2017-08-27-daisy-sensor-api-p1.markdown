---
title: "Daisy Sensor BLE API Part 1"
tags: ble bluetooth api daisy
excerpt: "An Overview of the Daisy Sensor Bluetooth Low Energy API and specification."
summary: "An Overview of the Daisy Sensor Bluetooth Low Energy API and specification."
header:
  image: /assets/images/blog/DaisySensorImage.jpg
  image_description: "A description of the image"
---

# Daisy Sensor overview
 
* The Daisy Sensor is hardware device designed to monitor green plant (Plantae) environmental conditions.
* The conditions monitored are: soil moisture percent, ambient light, ambient temperature.
* The Daisy Sensor communicates the sensor data via bluetooth low energy (BLE).

## Sensor Data::
 
### The Daisy Sensor hardware collects:
 
1. relative moisture in the surrounding area.
2. temperature of the device
3. Individual RGB light values
 
#### Moisture Percent:
 
* The moisture data is communicated as a 16bit unsigned integer count value which should have a range of 20,000 - 30,000 counts.
* The moisture data count is converted to a 'percent moisture' via 3 calibration values.
 
1. the moisture count when the device is in air - the calibration minimum count value representing 5% moisture.
2. the moisture count when the device is immersed in water - the calibration maximum count value representing 95% moisture.
3. the current calRef count - the current moisture count reference drift.
 
#### Temperature:
    
The uncalibrated ambient temperatue in Celsius.
     
#### Light:
 
Ambient R,G,B lumosity values in unknown units and uncalibrated.
 
### Sensor Communication::
 
#### The Daisy Sensor has 3 modes for transmitting plant data:
 
1. Current Data Characteristic - Make a measurement and respond with the new data. Used for calibration and real time viewing.
2. Indexed Data Characteristic - Make measurements every P period for 16 periods. 16 measurements are averaged then stored in a table indexed by time period since device startup. Data is transmitted after a Read request and the buffer index is decremented after each read during a connection session.
3. Indexed Data Characteristic with Notify enable - Same as above but the data is pushed by the sensor to the device using the BLE notification feature. This requires a connection be maintained.

## iOS device to sensor communication strategy::
 
Real time readings - In sensor detail mode, the app connects to the sensor, starts recording currentData readings and displaying the results in real-time.
A calibration is necessary to show a moisture percent. Intitially calibration values are pulled from the sensor using ReadCal. However these values
may have noise and drift so the moisture percent may not be very accurate. To get accurate percents, the user should re-calibrate the sensor.

Calibration mode - The Daisy Sensor requires moisture calibration to have useful readings. The iOS app uses the Sensor detail view page
to enter calibration mode. The user can then switch to "Calibration mode" which causes the app to record the max and min moisture counts for future & current use in
calculating the moisture percent. To perform the calibration, the user starts with a dry sensor in air for a minute or two, this is the MIN count. The user then
immerses the sensor in water for one to two minutes. This is the MAX count. The user then turns off calibration mode and they can play with the sensor and get 
accurate real-time moisture percent readings.

Plant paired feedback mode - Once a sensor is paired with a plant, the app needs to track the sensor readings, compare them to the desired plant ranges and inform 
the user of what actions they need to take. This requires the app to acquire data from the sensor periodically. Preferably at least twice a day
and much more frequently when the user is looking at the plant detail page. The app uses 3 strategies to insure data updates regardless of the app state.

1. *Plant chart expansion* - when the user clicks the button to expand the current plants data chart, a sensor connection and indexedRead is queued.
if the sensor is in range, once the sensor advertises, all the pending indexed data will be read, the chart updated, the connection persisted and notify turned on for future updates.

2. *App foreground/background* - if the app is in the foreground or background, then it is still capable of running code. A timer is set to go off periodically
and triggered connections and reads from any paired sensors which are not up to date. Whenever a connection is successfully made, all pending indexed data is 
read then the characteristic is switched to notify mode for future updates while connected.

3. *Idle mode* - If the app has been in the background and killed by the OS but not terminated by the user, it can be woken up by certain events registered with the OS.
The app persists connection requests for paired sensors and the Daisy service UUID. The app leaves connections in place and can be started and notified by the OS 
new notifications. The app registers for large locations changes. When there is a large location change, the OS will start the app and pass in the location. 
The location is compared to the sensor locations and if a sensor should be in range, a connection request is queued with the OS. Indexed and Notify reading modes
both update the sensor data log and are analyzed for plant status notification requirements. Is the current moisture below the min desired? Notify user of dry plant.
Has the moisture value increase by a significant amount lately? Notify the user of a plant watering event... Is the temperature range too low or high? Notify the 
user of a plant health issue.