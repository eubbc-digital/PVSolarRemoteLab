
# States
OFF = 0
UP = 1
DOWN = 2
state = OFF
msg = ""
data = []


def moveUp():
    relayPositiveB.value(0)
    relayNegativeB.value(0)
    time.sleep(0.5)
    relayPositiveA.value(1)
    relayNegativeA.value(1)


def moveDown():
    relayPositiveA.value(0)
    relayNegativeA.value(0)
    time.sleep(0.5)
    relayPositiveB.value(1)
    relayNegativeB.value(1)


def turnOff():
    relayPositiveA.value(0)
    relayNegativeB.value(0)
    relayNegativeA.value(0)
    relayPositiveB.value(0)
    time.sleep(0.5)


# Initialize Pins
turnOff()


def get_datalogger_data():
    gc.collect()
    # TCP Slave setup
    slave_tcp_port = 502           # port to listen to
    slave_id = 1                # bus address of client
    slave_ip = dataloggerIP
    try:
        host = ModbusTCPMaster(
            slave_ip=slave_ip,
            slave_port=slave_tcp_port,
            timeout=2)
        hreg_address = 0
        register_qty = 18
        register_values = host.read_holding_registers(
            slave_addr=slave_id,
            starting_addr=hreg_address,
            register_qty=register_qty,
            signed=True)

        converted_data = []

        # Convert each cell to an unsigned 16-bit integer
        unsigned_data = [(cell & 0xFFFF) for cell in register_values]

        for i in range(0, len(unsigned_data), 2):
            # Combine the two cells into a single 32-bit integer
            combined_data = (unsigned_data[i+1] << 16) | unsigned_data[i]
            # Convert the integer to a 32-bit float (little-endian byte order)
            float_data = struct.unpack(
                '<f', struct.pack('<i', combined_data))[0]
            converted_data.append(float_data)
        return converted_data
    except Exception as e:
        print(e)
        return []


def sendData(dataToSend, efficiencyTest):
    if len(efficiencyTest) > 0:
        isTesting = True
    else:
        isTesting = False
    global topic_pub, client
    msg = {
        "departmentName": city,
        "voltage": round(dataToSend[7], 2),
        "temperature": round(dataToSend[8], 2),
        "power": round(dataToSend[7]*dataToSend[8], 2),
        "uvaRadiation": round(dataToSend[6], 2),
        "radiation": round(dataToSend[3], 2),
        "panelangle": int(dataToSend[2]),
        "efficiencyTest": efficiencyTest,
        "isTesting": isTesting
    }
    message = json.dumps(msg)
    client.publish(topic_pub, str(message))


def waitData():
    gotData = False
    counter = 0
    while not gotData:
        data = get_datalogger_data()
        if len(data) > 0:
            gotData = True
        else:
            counter = counter + 1
            sleep(0.1)
            if (counter > 500):
                restart_and_reconnect()
    return data


def sub_cb(topic, msg):
    if msg == b"RESET":
        restart_and_reconnect()
    try:
        received_msg = json.loads(msg)
    except Exception:
        pass
    else:
        try:
            action = received_msg['action']
            print(action)

            if topic == topic_sub and action == "ANGLE":
                newAngle = received_msg['angle']
                currentAngle = waitData()[2]
                print("New Requested Angle: ", newAngle)
                print('Current Panel Angle: {}'.format(currentAngle))
                movingUp = False
                movingDown = False
                notMovingCount = 0
                while abs(int(newAngle) - currentAngle) >= 0.6:
                    previousAngle = currentAngle
                    if int(newAngle) > currentAngle:
                        movingDown = False
                        if (not movingUp):
                            moveUp()
                            movingUp = True
                    else:
                        movingUp = False
                        if (not movingDown):
                            moveDown()
                            movingDown = True
                    sleep(0.1)
                    dataloggerData = waitData()
                    currentAngle = dataloggerData[2]
                    sendData(dataloggerData, [])
                    print("Current: ", str(currentAngle))
                    print("Previous", str(previousAngle))
                    if (abs(currentAngle - previousAngle) < 0.3):
                        notMovingCount += 1
                        if (notMovingCount > 60):
                            print("Error Moving Panel")
                            break
                    else:
                        notMovingCount = 0
                        if abs(int(newAngle) - currentAngle) <= 0.6:
                            print("END", str(currentAngle))
                            turnOff()
                            sleep(3)
                            currentAngle = waitData()[2]
                turnOff()
                print("Moved To: ", str(currentAngle))
        except Exception:
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
        restart_and_reconnect()

    return client


def restart_and_reconnect():
    print('Failed to connect to MQTT broker. Restarting...')
    sleep(0.5)
    machine.reset()


# MQTT Connection
try:
    client = connect_and_subscribe()
except OSError as e:
    restart_and_reconnect()

while True:
    try:
        client.check_msg()
        sendData(waitData(), [])
        sleep(1)

    except OSError as e:
        print(e)
        restart_and_reconnect()
