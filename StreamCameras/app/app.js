/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

const Stream = require("node-rtsp-stream");

try {
  const streamCbba = new Stream({
    name: "SolarLabCameraCBBA",
    streamUrl: process.env.CAMERACBBA,
    wsPort: process.env.NEXT_PUBLIC_WSPORTCBBA,
    ffmpegOptions: {
      "-vcodec": "mpeg1video", // video code
      "-rtsp_transport": "tcp",
      "-f": "mpegts", // output file format.
      "-b:v": "1000k", // video bit rate
      "-r": 25, // frame rate
      "-s": "240x264", // video size
      "-bf": 0,
      "-filter:v": "fps=fps=15",
      "-loglevel": "panic",
    },
  });
  streamCbba.on("exitWithError", function () {
    streamCbba.mpeg1Muxer.stream.kill();
    streamCbba.stop();
  });
  streamCbba.wsServer.on("connection", function () {});
} catch (error) {}

try {
  const streamLpz = new Stream({
    name: "SolarLabCameraLPZ",
    streamUrl: process.env.CAMERALPZ,
    wsPort: process.env.NEXT_PUBLIC_WSPORTLPZ,
    ffmpegOptions: {
      "-f": "mpegts", // output file format.
      "-codec:v": "mpeg1video", // video codec
      "-b:v": "1000k", // video bit rate
      "-r": 25, // frame rate
      "-s": "240x264", // video size
      "-bf": 0,
      "-loglevel": "panic",
      "-filter:v": "fps=fps=15",
      //'-c': 'copy',
    },
  });
  streamLpz.on("exitWithError", function () {
    streamLpz.mpeg1Muxer.stream.kill();
    streamLpz.stop();
  });
  streamLpz.wsServer.on("connection", function () {});
} catch (error) {}

try {
  const streamScz = new Stream({
    name: "SolarLabCameraSCZ",
    streamUrl: process.env.CAMERASCZ,
    wsPort: process.env.NEXT_PUBLIC_WSPORTSCZ,
    ffmpegOptions: {
      "-f": "mpegts", // output file format.
      "-codec:v": "mpeg1video", // video codec
      "-b:v": "1000k", // video bit rate
      "-r": 25, // frame rate
      "-s": "240x264", // video size
      "-bf": 0,
      "-loglevel": "panic",
      "-filter:v": "fps=fps=15",
      //'-c': 'copy',
    },
  });
  streamScz.on("exitWithError", function () {
    streamScz.mpeg1Muxer.stream.kill();
    streamScz.stop();
  });
  streamScz.wsServer.on("connection", function () {});
} catch (error) {}
