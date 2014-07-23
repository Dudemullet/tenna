# Tenna
A node js application that lets you easily stream most videos from any PC/laptop in your home network, to other devices in the network with a browser.

## supported devices

- xbox360
- iPhone/iPod Touch
- iPad
- Android devices
- PS Vita

Basically any device that supports the `<video>` element **MP4** encoded.

## Setup
clone this repository to your computer. In that directory type in the following commands:

```
git clone https://github.com/Dudemullet/tenna
npm install
grunt
node server
```

## CLI Interface
You can also encode a video on the fly

```
npm install -g tenna
tenna *path/to/video/*
```

or just start the server

```
tenna
```

## Endpoints

### Adding Videos/Files
Drag and drop videos or files at:

`localhost:8081/setup`

## Encode status
While files are being encoded, you can view their status at:

`localhost:8081/encode`

### Watching Videos
The only encoding supported on the vita is h.264. Luckily this is the most supported codec by browsers. Videos will be hosted from:

`localhost:8081/videos`
