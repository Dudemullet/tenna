# Player two
A node js application that lets you easily access files and video from any computer in the same network. This application is accessed via the browser so it may run well on any toaster with a browser.

## Setup
clone this repository to your computer. In that directory type in the following commands:

```
npm install
bower install
grunt
node server
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

### Downloading Files
Files will be hosted from:

`localhost:8081/files`
