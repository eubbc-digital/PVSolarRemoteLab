/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import * as mqtt from 'mqtt';

const globalForMqtt = global;

import socket from './socket';

const connectMqtt = () => {
	const client = mqtt.connect(process.env.MQTT_BROKER_HOST, {
		clientId: 'SolarLab',
		username: process.env.MQTT_USER,
		password: process.env.MQTT_PASSWORD,
	});
	client.on('connect', function () {
		mqttClient.subscribe('solarlab/server');
	});
	client.on('message', function (topic, message) {
		socket.emit('esp32', message.toString());
	});
	return client;
};

export const mqttClient = globalForMqtt.mqtt || connectMqtt();

if (process.env.NODE_ENV !== 'production') globalForMqtt.mqtt = mqttClient;

export default mqttClient;
