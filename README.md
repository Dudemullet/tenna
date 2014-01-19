# Player two
Vita sream is a node js application that lets you easily access files and video from any computer in the same network. This application is accessed via the browser so it may run well on any toaster with a browser.

## Videos
the only encoding supported on the vita is h.264. Luckily this is the most supported codec by browsers. videos will be hosted from:

`<projectdir>/build/videos`

## Files
Files will be hosted from
`<projectdir>/build/files`

## Setup
clone this repository to your computer. In that directory.

```
npm install
```

Videos will be hosted from the `<projectdir>/build/videos` directory

### Vita
To access the app on the vita open your browser and type your computers hostname in the address bar
`
http://<myComputerName>:8080
`