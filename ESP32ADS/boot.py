
# Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
# MIT License - See LICENSE file in the root directory
# Andres Gamboa, Alex Villazon

import gc
from machine import SoftI2C, Pin, Timer
import machine
import network
import json
import ads1x15
from array import array
import esp
from umqttsimple import MQTTClient
import ubinascii
import time
esp.osdebug(None)
gc.collect()

# Gain
# 0 : 6.144V # 2/3x
# 1 : 4.096V # 1x
# 2 : 2.048V # 2x
# 3 : 1.024V # 4x
# 4 : 0.512V # 8x
# 5 : 0.256V # 16x

relayDischarge = machine.Pin(5, machine.Pin.OUT)
relayPanelPositive = machine.Pin(2, machine.Pin.OUT)
relayCharge = machine.Pin(18, machine.Pin.OUT)
relayGND = machine.Pin(15, machine.Pin.OUT)

# Initialize Pins
relayDischarge.value(0)
relayPanelPositive.value(0)
relayCharge.value(0)
relayGND.value(0)

addr = 72
gain = 2

# MQTT
# mqtt_server = "eubbc-digital.upb.edu"
mqtt_server = 'eubbc-digital.upb.edu'
port = 1884
username = "upb"
mqtt_password = "QgsASHU([u<8TF_k2]>`6q"

client_id = ubinascii.hexlify(machine.unique_id())
client = MQTTClient(client_id, mqtt_server, port,
                    user=username, password=mqtt_password)

# Topics
topic_sub = b'solarlab/esp32/scz'
topic_pub = b'solarlab/server'
# City
city = "Santa Cruz"

# ssid = 'UPB'
# password = ''

ssid = 'LabSolar'
password = 'lab20231'


station = network.WLAN(network.STA_IF)
station.active(True)
station.connect(ssid, password)
wlan_mac = station.config('mac')
print(ubinascii.hexlify(wlan_mac).decode().upper())

notConnectedCounter = 0
while station.isconnected() == False:
    notConnectedCounter = notConnectedCounter + 1
    time.sleep(0.1)
    if (notConnectedCounter > 150):
        machine.reset()
    pass

print(station.ifconfig()[0])
