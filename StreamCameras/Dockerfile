FROM node:18-alpine

WORKDIR /node

COPY app .

RUN apk add ffmpeg

RUN npm install
CMD ["node", "app.js"]