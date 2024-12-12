
# Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
# MIT License - See LICENSE file in the root directory
# Andres Gamboa, Alex Villazon

try:
    i2c = SoftI2C(scl=Pin(22), sda=Pin(21), freq=800000)
    adc = ads1x15.ADS1115(i2c, addr, gain)
except Exception as e:
    print(e)
    restart_and_reconnect()


def sub_cb(topic, msg):
    global reading
    try:
        received_msg = json.loads(msg)
    except Exception:
        pass
    else:
        try:
            action = received_msg['action']
            print(action)
            if topic == topic_sub and action == 'START':
                time.sleep(0.3)
                relayDischarge.value(1)
                time.sleep(1)
                relayDischarge.value(0)
                time.sleep(0.3)
                relayPanelPositive.value(1)
                relayGND.value(1)
                time.sleep(0.3)
                relayCharge.value(1)
                getExperimentData()
                print("Sent")
                relayCharge.value(0)
                relayPanelPositive.value(0)
                relayGND.value(0)
                relayDischarge.value(1)
                time.sleep(2)
                relayDischarge.value(0)
                print("Test Finished")
        except Exception as e:
            print(e)
            restart_and_reconnect()


def sendData(efficiencyTest):
    global topic_pub, client
    msg = {
        "departmentName": city,
        "voltage": 0,
        "current": 0,
        "power": 0,
        "uvaRadiation": 0,
        "radiation": 0,
        "panelangle": 0,
        "efficiencyTest": efficiencyTest,
        "isTesting": True
    }
    message = json.dumps(msg)
    client.publish(topic_pub, str(message))


def readChannel(channel):
    value = adc.read(7, channel)
    voltage = adc.raw_to_v(value)
    return voltage


def buildMessage(rawCurrentValues, rawVoltageValues):
    efficiencyTest = []
    gc.collect()
    for c, v in zip(rawCurrentValues, rawVoltageValues):
        voltage = ((v * 21.6)/1.95)
        current = (c * 66.6667)
        if (current > 0.1):
            efficiencyTest.append({"voltage": voltage, "current": current, "power": voltage*current,
                                   "city": city, "timestamp": int(time.time() * 100000)})
    return efficiencyTest


def getExperimentData():
    try:
        gc.collect()
        rawVoltageValues = []
        rawCurrentValues = []
        for x in range(190):
            rawVoltageValues.append(readChannel(0))
            rawCurrentValues.append(readChannel(1))
        message = buildMessage(rawCurrentValues, rawVoltageValues)
        rawVoltageValues = []
        rawCurrentValues = []
        gc.collect()
        print(len(message))
        if len(message) > 1:
            message.pop(0)
            message.pop(0)
        sendData(message)
        message = []
        gc.collect()
    except Exception as e:
        print(e)
        restart_and_reconnect()


def connect_and_subscribe():
    global client_id, mqtt_server, topic_sub
    try:
        client.set_callback(sub_cb)
        client.connect()
        client.subscribe(topic_sub)
        print('Connected to %s MQTT broker, subscribed to %s topic' %
              (mqtt_server, topic_sub))
    except IndexError as e:
        print(e)
        restart_and_reconnect()

    return client


def restart_and_reconnect():
    print('Error Ocurred. Restarting...')
    time.sleep(2)
    machine.reset()


# MQTT Connection
try:
    client = connect_and_subscribe()
except Exception as e:
    print(e)
    restart_and_reconnect()

while True:
    try:
        client.check_msg()
        time.sleep(0.8)

    except Exception as e:
        print(e)
        restart_and_reconnect()
