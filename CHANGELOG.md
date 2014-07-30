### Version 0.1.6

- [8a1618397243ed315dd321f6d06300d976200a87](https://github.com/Dudemullet/tenna/commit/8a1618397243ed315dd321f6d06300d976200a87)Adds ability to delete videos within the UI.
- [154fa1a6772634d2d9db8917345cf785df39ff7b](https://github.com/Dudemullet/tenna/commit/154fa1a6772634d2d9db8917345cf785df39ff7b)Adds ability to delete via command line using the `tenna --clean` command

### Version 0.1.5

- [cd67e26](https://github.com/Dudemullet/tenna/commit/cd67e26bedfe43cf04e14b0b875605e96413ca14) Fixes 3 incorrect references to directories inside the build dir. they were being used without __dirname

### Version 0.1.4

- [70b4461](https://github.com/Dudemullet/tenna/commit/70b4461b3d2ad702ca516ec0e571c41546cf9485) Updated to clearly state this is a beta
- [ba850e5](https://github.com/Dudemullet/tenna/commit/ba850e55af1372dc3024db6650aed4e96ef251e0) Fix videos showing files that are not mp4

### Version 0.1.3

Published to npm! Also, renamed the project from playertwo to tenna. As in (an)tenna.

The preferred method of using tenna for now is

```
npm install -g tenna
tenna path/to/video(optional)
```

- [0c209aa](https://github.com/Dudemullet/tenna/commit/0c209aa8cefafcdbc8077017ea8baa26f0481655) removes references to name player two, add consistent nav bar, changes name from playertwo to tenna

### Version 0.1.2

Kinda major ui changes with this release. We have made it so that theres is (apparently) a single video element in the page. Clicking on the 'play' icon for a video tile will actually toggle visibility between the different video elements and start playing on the clicked videos element.

#### Why not a single `<video>` element ?
  This did not work in some devices, specifically the PS Vita.

- [9554576](https://github.com/Dudemullet/playertwo/commit/9554576b0ae39342b93e932ae9e32a48205dcf0c) Added *optimize for web* flag to handbrake encoding
- [225d439](https://github.com/Dudemullet/playertwo/commit/225d439f8c179c29e8ede5d66437adb346549a90) Modified UI so there is a single place where videos get played. Faking a single video element
- [958bac7](https://github.com/Dudemullet/playertwo/commit/958bac715dc53c4709957932c10ab19b3775a706) Re arranged dependencies, modev dev only to devDependencies. Removes unnecesary files and console.logs

### Version 0.1.1

- [919dc52](https://github.com/Dudemullet/playertwo/commit/919dc5208f25e861d9294bd1e39095d3717d3e15) Remove bower
- [9cb8eab](https://github.com/Dudemullet/playertwo/commit/9cb8eabb2cbc02a9cba5f1a15004cd2ef9af0080) Add browserify as dev-deps, Include vue in browserify bundle

### Version 1.0

- Major refactor to keep everything modularized
- Update to handbrake-js 1.1 [link](https://github.com/Dudemullet/playertwo/commit/3284049e55f12d06cdd012db1301f83ac2c64e76)
