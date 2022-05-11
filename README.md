# JanusJs

Fully functional reactive and promisified wrapper arround native janusjs

# Usage
```
import { JanusJs } from "janus-js";
const a = new JanusJs({ server: "ws://127.0.0.1:8188" });
await a.init();
const session = await a.createSession();
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
}, // Publishers are sendonly
});
var publish = { request: "configure", audio: useAudio, video: true };
await plugin.send({ message: publish, jsep: offer });
```