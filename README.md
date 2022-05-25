# JanusJs

Fully functional reactive and promisified wrapper around native janusjs

## Install

```sh
npm install typed_janus_js
```
## Build for distribution

```sh
./build_janus.sh
npm run build
```

## [Api and documentation](https://flutterjanus.github.io/JanusJs/)

## Usage

```javascript
import { JanusJs } from "typed_janus_js";
const client = new JanusJs({ server: "ws://127.0.0.1:8188" });

await client.init();

const session = await client.createSession();
const plugin = await session.attach({ plugin: "janus.plugin.videoroom" });
const myroom = 1234;

const register = {
  request: "join",
  room: myroom,
  ptype: "publisher",
  display: "shivansh",
};

console.log(await plugin.send({ message: register }));

plugin.onMessage.subscribe((data) => {
  console.log(data);
});

plugin.onLocalTrack.subscribe((data) => {
  console.log(data);
});

const useAudio = true;
const offer = await plugin.createOffer({
  media: {
    audioRecv: false,
    videoRecv: false,
    audioSend: useAudio,
    videoSend: true,
  } // Publishers are sendonly
});

const publish = { 
  request: "configure", 
  audio: useAudio, 
  video: true 
};

await plugin.send({ message: publish, jsep: offer });
```
