# PVSolarRemoteLab

The PV Solar Remote Lab makes available to study the altitute's impact of PV efficiency, with 3 equipment "kits" distributed in three different cities.

The PV Solar Remote Lab must be installed in a computer that has a public IP address and a DNS name, so that remote users can access the remote lab.

The PV Solar Remote Lab has already all the integration with Book4RLab. Only users who reserved a time slot in Book4RLab will be able to access the Remote Lab without providing any password.

## Getting Started

The installation of the PV Solar Remote Lab is simplified using Docker technology.

### Hardware Prerequisites

![](assets/hardwarekit.png)

- You will need at least 1 entire Hardware Kit to run the laboratory.
  - A datalogger to retrieve the data of all the sensors
  - A PV Panel
  - A Camera to transmit live video of the equipment
  - A PCB with two ESP32, an I-V curve trazer and another to control the motor

### Software Prerequisites

![](assets/architecture.jpeg)

- You will need to have Docker and Docker Compose installed on the host that will run the bridge server. We recommend to use Linux (e.g. Ubuntu).
  - Here is a tutorial to [install Docker in Ubuntu](https://docs.docker.com/engine/install/ubuntu)
  - Here is a tutorial to [install Docker Compose in Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)

### Configuration of the PV Solar Remote Lab

You need to edit the `variables.env` file to set the following parameters:

- `NEXT_PUBLIC_SERVICES_HOST`: The IP address of the Host where your docker services is deployed.
- `MQTT_BROKER_HOST`: If you have a separated MQTT broker, you should enter the link here. (i.e mqtt://test.mosquitto.org.:1883)
- `NEXT_PUBLIC_HOST`: The public hostname where the laboratory will be deployed. (i.e example.com)
- `MYSQL_DATABASE`: Enter what you want your database to be called.
- `DATABASE_USER`: Enter what you want your database user to be called.
- `MYSQL_ROOT_PASSWORD`: Enter your desired database user password.
- `NEXTAUTH_SECRET`: You must generate a Secret and paste it here. You can do it here: https://generate-secret.vercel.app/32
- `HOST_BOOKING`: The Book4RLab URL for validation of sessions. By default it points to the centralized Booking System at https://eubbc-digital.upb.edu/booking/
- `GOOGLE_CLIENT_ID`: To use the Google Sign In / Sign Up, you must generate a Google client ID. You can find a tutorial to do it here: https://shorturl.at/kuKU3
- `GOOGLE_CLIENT_SECRET`: At the same time of generating a Google Client ID, you will generate a Google Client Secret, you should paste it here.
- `HOST_CAMERACBBA`: Enter the hostname or IP address of the first camera, you should include the username and password. (i.e user:password@ipaddress)
- `HOST_CAMERALPZ`: Enter the hostname or IP address of the second camera. (If only one, you can use the same as above)
- `HOST_CAMERASCZ`: Enter the hostname or IP address of the second camera. (If only one, you can use the same as above)
- `USER_SMTP`: Enter the name with which you want your emails to arrive. (i.e solarlab@gmail.com)
- `PWD_SMTP`: Enter your desired SMTP user password.

### Running the PV Solar Remote Lab

Clone the repository and enter the PVSolarRemoteLab directory.

`git clone https://github.com/eubbc-digital/PVSolarRemoteLab`

`cd PVSolarRemoteLab`

Next, if you need the FTP Server, enter to the FTP Directoty and build the separated docker compose.

`cd FTP`

`docker-compose up -d --build`

Next, run the rest of the services. Go bacj to the PVSolarRemoteLab directory and run the docker compose. This make take several minutes...

`cd ..`

`docker-compose up -d --build`

Now, you have all the services of the PV Solar Remote Lab running.

The remote lab service works with a base-path (solar-lab), so you can enter to the Remote Lab with : `https://domain/solar-lab`

### Stopping the PV Solar Remote Lab Platform

To stop the service, you can simply run the following command:

`docker-compose down`

## Authors

- Andres Gamboa (Universidad Privada Boliviana - UPB)
- Alex Villazon (Universidad Privada Boliviana - UPB)

## Acknowledgments

This work was partially funded by the Erasmus+ Project “EUBBC-Digital” (No.
618925-EPP-1-2020-1-BR-EPPKA2-CBHE-JP)

![](assets/erasmus.jpeg)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## More Information

For more information about the project, please visit our [website](https://eubbc-digital.upb.edu/).
