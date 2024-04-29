
# Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
# MIT License - See LICENSE file in the root directory
# Andres Gamboa, Alex Villazon

import gc
import machine
import network
from umqttsimple import MQTTClient
import ubinascii
import esp
import json
from time import sleep
import time
import random
import struct
from umodbus.tcp import TCP as ModbusTCPMaster
esp.osdebug(None)
gc.collect()

# MQTT
# mqtt_server = '192.168.46.161'
mqtt_server = 'research.upb.edu'
# mqtt_server = '192.168.100.7'
client_id = ubinascii.hexlify(machine.unique_id())
port = 61883
client = MQTTClient(client_id, mqtt_server, port)

relayPositiveA = machine.Pin(5, machine.Pin.OUT)
relayNegativeB = machine.Pin(4, machine.Pin.OUT)
relayNegativeA = machine.Pin(2, machine.Pin.OUT)
relayPositiveB = machine.Pin(15, machine.Pin.OUT)
# relayPositiveA = machine.Pin(21, machine.Pin.OUT)
# relayNegativeB = machine.Pin(22, machine.Pin.OUT)
# relayNegativeA = machine.Pin(19, machine.Pin.OUT)
# relayPositiveB = machine.Pin(23, machine.Pin.OUT)

relayPositiveA.value(0)
relayNegativeB.value(0)
relayNegativeA.value(0)
relayPositiveB.value(0)

# Topics
topic_sub = b'solarlab/esp32/scz'
topic_pub = b'solarlab/server'
# City
city = "Santa Cruz"
dataloggerIP = '10.1.3.29'

ssid = 'UPB'
password = ''

station = network.WLAN(network.STA_IF)
station.active(True)
station.connect(ssid, password)
wlan_mac = station.config('mac')
print(ubinascii.hexlify(wlan_mac).decode().upper())

notConnectedCounter = 0
while station.isconnected() == False:
    notConnectedCounter = notConnectedCounter + 1
    sleep(0.1)
    if (notConnectedCounter > 150):
        machine.reset()
    pass

print(station.ifconfig()[0])
