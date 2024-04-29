/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

const fs = require("fs");

var mysql = require("mysql2");

var connection = mysql.createConnection({
  host: process.env.NEXT_PUBLIC_SERVICES_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PWD,
  database: "solar_lab_db",
  flags: ["+LOCAL_FILES"],
});
const queryCbba =
  `LOAD DATA LOCAL INFILE ? INTO TABLE Datalogger ` +
  `FIELDS TERMINATED BY ? ` +
  `ENCLOSED BY ? ` +
  `LINES TERMINATED BY ? ` +
  `IGNORE ? ROWS ` +
  `(@datetime,record,solarRadiationCMP,solarRadiationCMPAvg, uvaRadiationLP, uvaRadiationLPAvg, batteryVoltage, voltage, current, solarRadiationCS320, uvaRadiationSU202, uvaRadiationSU202Avg) ` +
  `SET datetime = STR_TO_DATE(@datetime,'%Y-%m-%d %H:%i:%s')`;

const queryScz =
  `LOAD DATA LOCAL INFILE ? INTO TABLE DataloggerSCZ ` +
  `FIELDS TERMINATED BY ? ` +
  `ENCLOSED BY ? ` +
  `LINES TERMINATED BY ? ` +
  `IGNORE ? ROWS ` +
  `(@datetime,record,solarRadiationCS320,solarRadiationCS320Avg, uvaRadiationSU202, uvaRadiationSU202Avg, voltage, current, angle, batteryVoltage, tempDL) ` +
  `SET datetime = STR_TO_DATE(@datetime,'%Y-%m-%d %H:%i:%s')`;

const queryLpz =
  `LOAD DATA LOCAL INFILE ? INTO TABLE DataloggerLPZ ` +
  `FIELDS TERMINATED BY ? ` +
  `ENCLOSED BY ? ` +
  `LINES TERMINATED BY ? ` +
  `IGNORE ? ROWS ` +
  `(@datetime,record,solarRadiationCS320,solarRadiationCS320Avg, uvaRadiationSU202, uvaRadiationSU202Avg, voltage, current, angle, batteryVoltage, tempDL) ` +
  `SET datetime = STR_TO_DATE(@datetime,'%Y-%m-%d %H:%i:%s')`;

const pathCbba = "./Data/Datalogger_Min5.dat";
const pathLpz = "./Data/DataloggerLPZ_Min5.dat";
const pathScz = "./Data/DataloggerSCZ_Min5.dat";

const previousFilePath = "./Data/Radiacion_Min5.dat";

connection.connect(function (err) {
  if (err) throw err;
});

try {
  fs.watchFile(
    pathCbba,
    {
      // Passing the options parameter
      bigint: false,
      persistent: true,
      interval: 1000,
    },
    (curr, prev) => {
      connection.query(
        "SELECT COUNT(*) FROM Datalogger",
        function (err, result, fields) {
          if (err) throw err;
          if (result[0]["COUNT(*)"] <= 0) {
            connection.query(
              {
                sql: queryCbba,
                values: [pathCbba, ",", '"', "\n", 4],
                infileStreamFactory: () => fs.createReadStream(pathCbba),
              },
              (err, _ok) => {
                if (err) {
                  console.log(err);
                  throw err;
                }
                ok = _ok;
              }
            );
          } else {
            var ignoredRows = 4 + result[0]["COUNT(*)"];
            connection.query(
              {
                sql: queryCbba,
                values: [pathCbba, ",", '"', "\n", ignoredRows],
                infileStreamFactory: () => fs.createReadStream(pathCbba),
              },
              (err, _ok) => {
                if (err) {
                  console.log(err);
                  throw err;
                }
                ok = _ok;
              }
            );
          }
        }
      );
    }
  );
} catch (error) {
  console.log(error);
}
try {
  fs.watchFile(
    pathLpz,
    {
      // Passing the options parameter
      bigint: false,
      persistent: true,
      interval: 1000,
    },
    (curr, prev) => {
      connection.query(
        "SELECT COUNT(*) FROM DataloggerLPZ",
        function (err, result, fields) {
          if (err) throw err;
          if (result[0]["COUNT(*)"] == 0) {
            connection.query(
              {
                sql: queryLpz,
                values: [pathLpz, ",", '"', "\n", 4],
                infileStreamFactory: () => fs.createReadStream(pathLpz),
              },
              (err, _ok) => {
                if (err) {
                  console.log(err);
                  throw err;
                }
                ok = _ok;
              }
            );
          } else {
            var ignoredRows = 4 + result[0]["COUNT(*)"];
            connection.query(
              {
                sql: queryLpz,
                values: [pathLpz, ",", '"', "\n", ignoredRows],
                infileStreamFactory: () => fs.createReadStream(pathLpz),
              },
              (err, _ok) => {
                if (err) {
                  console.log(err);
                  throw err;
                }
                ok = _ok;
              }
            );
          }
        }
      );
    }
  );
} catch (error) {
  console.log(error);
}

try {
  fs.watchFile(
    pathScz,
    {
      // Passing the options parameter
      bigint: false,
      persistent: true,
      interval: 1000,
    },
    (curr, prev) => {
      connection.query(
        "SELECT COUNT(*) FROM DataloggerSCZ",
        function (err, result, fields) {
          if (err) throw err;
          if (result[0]["COUNT(*)"] == 0) {
            connection.query(
              {
                sql: queryScz,
                values: [pathScz, ",", '"', "\n", 4],
                infileStreamFactory: () => fs.createReadStream(pathScz),
              },
              (err, _ok) => {
                if (err) {
                  console.log(err);
                  throw err;
                }
                ok = _ok;
              }
            );
          } else {
            var ignoredRows = 4 + result[0]["COUNT(*)"];
            connection.query(
              {
                sql: queryScz,
                values: [pathScz, ",", '"', "\n", ignoredRows],
                infileStreamFactory: () => fs.createReadStream(pathScz),
              },
              (err, _ok) => {
                if (err) {
                  console.log(err);
                  throw err;
                }
                ok = _ok;
              }
            );
          }
        }
      );
    }
  );
} catch (error) {
  console.log(error);
}
