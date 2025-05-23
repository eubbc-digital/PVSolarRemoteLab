# PVSolarRemoteLab

The PV Solar Remote Lab makes available to study the altitute's impact of PV efficiency, with 3 equipment "kits" distributed in three different cities.

The PV Solar Remote Lab must be installed in a computer that has a public IP address and a DNS name, so that remote users can access the remote lab.

The PV Solar Remote Lab has already all the integration with Book4RLab. Only users who reserved a time slot in Book4RLab will be able to access the Remote Lab without providing any password.

## Getting Started

The installation of the PV Solar Remote Lab is simplified using Docker technology.

### Hardware Prerequisites

![](Assets/hardwarekit.png)

- You will need at least 1 entire Hardware Kit to run the laboratory.
  - A datalogger to retrieve the data of all the sensors
  - A PV Panel
  - A Camera to transmit live video of the equipment
  - A PCB with two ESP32, an I-V curve trazer and another to control the motor

If you only need to test the laboratory, you can avoid the hardware and use our MQTT broker (explained below).

### Software Prerequisites

![](Assets/architecture.jpeg)

- You will need to have Docker and Docker Compose installed on the host that will run the bridge server. We recommend to use Linux (e.g. Ubuntu).
  - Here is a tutorial to [install Docker in Ubuntu](https://docs.docker.com/engine/install/ubuntu)
  - Here is a tutorial to [install Docker Compose in Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)

### Configuration of the PV Solar Remote Lab

Here we have two options, if you are using Nginx you should edit the file `variables.env.sample`, if you are not using Nginx you need to edit the `variables-nonginx.env.sample`. In both cases, first you have to change the file name and delete the `.sample` of the end (The name should be `variables.env` or `variables-nonginx.env`).

Then, you should modify ONLY the following parameters:

- `NEXT_PUBLIC_SERVICES_HOST`: The IP address of the Host where your docker services is deployed.
- `MQTT_BROKER_HOST`: Enter the link to your MQTT broker. (To test the Lab with our ESP32s, you can use the Broker mqtt://research.upb.edu:61883).
- `NEXT_PUBLIC_HOST`: The public hostname where the laboratory will be deployed. (i.e example.com). If you don't use Nginx, it should contain the port 3001. (i.e example.com:3001)
- `MYSQL_ROOT_PASSWORD`: Enter your desired database user password.
- `MYSQL_DATABASE`: Enter what you want your database to be called.
- `DATABASE_USER`: Enter what you want your database user to be called.
- `NEXT_PUBLIC_WS_DATA_PATH`: If you don't use Nginx, leave this as empty (""). Otherwise, set the path linked to the port 4000 (by default `/solar-lab/data-stream`)
- `NEXTAUTH_SECRET`: You must generate a Secret and paste it here. You can do it here: https://generate-secret.vercel.app/32
- `HOST_BOOKING`: The Book4RLab URL for validation of sessions. By default it points to the centralized Booking System at https://eubbc-digital.upb.edu/booking/
- `GOOGLE_CLIENT_ID`: To use the Google Sign In / Sign Up, you must generate a Google client ID. You can find a tutorial to do it here: https://shorturl.at/kuKU3. If you don't need Google Sign In, this is not mandatory.
- `GOOGLE_CLIENT_SECRET`: At the same time of generating a Google Client ID, you will generate a Google Client Secret, you should paste it here. If you don't need Google Sign In, this is not mandatory.
- `HOST_CAMERACBBA`: Enter the hostname or IP address of the first camera, you should include the username and password. (i.e user:password@ipaddress)
- `HOST_CAMERALPZ`: Enter the hostname or IP address of the second camera. (If only one, you can use the same as above)
- `HOST_CAMERASCZ`: Enter the hostname or IP address of the second camera. (If only one, you can use the same as above)
- `NEXT_PUBLIC_WS_CAMERA_CBBA`: This is the complete link to the first camera websocket. If you don't use Nginx, you don't need to change it. If you use it, you should modify the default path `/solar-lab/camera-cbba` to your redirected path of the port 8888
- `NEXT_PUBLIC_WS_CAMERA_LPZ`: Same as above, but for the port 7777
- `NEXT_PUBLIC_WS_CAMERA_SCZ`: Same as above, but for the port 9999
- `USER_SMTP`: Enter the name with which you want your emails to arrive. (i.e solarlab@gmail.com)
- `PWD_SMTP`: Enter your desired SMTP user password.

### Routing Considerations

To ensure the proper comunication between all the components, you should consider the following aspects:

- Each ESP32 should communicate with its own Datalogger
- Configure the ESP32s to point to the same MQTT Broker as specified before
- Configure the datalogger(s) to point to the IP of the FTP server to send the historical data (if needed).

### Running the PV Solar Remote Lab

Clone the repository and enter the PVSolarRemoteLab directory.

`git clone https://github.com/eubbc-digital/PVSolarRemoteLab`

`cd PVSolarRemoteLab`

Next, if you need the FTP Server, enter to the FTP Directoty and build the separated docker compose.

`cd FTP`

`docker-compose up -d --build`

Then, If you are in Linux, add permissions to the FTP user to write in the directory

`sudo chmod 777 -R FTP/Data`

Next, run the rest of the services. Go back to the PVSolarRemoteLab directory and run the docker compose. This make take several minutes...

`cd ..`

If you use Nginx, you should use the command:

`docker compose --env-file variables.env  -f docker-compose.yml up --build`

If you don't use, Nginx you should use the command:

`docker compose --env-file variables-nonginx.env  -f docker-compose-nonginx.yml up --build`

Now, you have all the services of the PV Solar Remote Lab running.

The remote lab service works with a base-path (solar-lab), so you can enter to the Remote Lab with : `https://domain/solar-lab`

### Stopping the PV Solar Remote Lab Platform

If you use Nginx, you should use the command to stop the services:

`docker compose --env-file variables.env  -f docker-compose.yml down`

If you don't use, Nginx you should use the command to stop the services:

`docker compose --env-file variables-nonginx.env  -f docker-compose-nonginx.yml down`

## Authors

- Andres Gamboa (Universidad Privada Boliviana - UPB)
- Alex Villazon (Universidad Privada Boliviana - UPB)
- Alfredo Meneses (Universidad Privada Boliviana - UPB)
- Boris Pedraza (Universidad Privada Boliviana - UPB)

## Publications

- Andrés Gamboa, Alex Villazón, Alfredo Meneses, Omar Ormachea, and
  Renán Orellana. Altitude’s Impact on Photovoltaic Efficiency: An IoT-
  Enabled Geographically Distributed Remote Laboratory. In M. E. Auer,
  R. Langmann, D. May, and K. Roos, editors, Smart Technologies for a Sus-
  tainable Future, pages 133–144, Cham, 2024. Springer Nature Switzerland.
  doi: 10.1007/978-3-031-61905-2 14.

- Thomas Zimmer, Andres Gamboa, Fabrice Mauvy, Alex Villazón, and Omar
  Ormachea. Remote Photovoltaic Laboratories: Bridging Continents for
  Hands‐On Solar Module Characterization.

## Awards

- GOLC (Global Online Laboratory Consortium) Award 2024.

## Acknowledgments

This work was partially funded by the Erasmus+ Project “EUBBC-Digital” (No.
618925-EPP-1-2020-1-BR-EPPKA2-CBHE-JP)

![](Assets/erasmus.jpeg)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## More Information

For more information about the project, please visit our [website](https://eubbc-digital.upb.edu/).
