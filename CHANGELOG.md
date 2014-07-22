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
