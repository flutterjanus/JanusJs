import { JanusJs, JanusVideoRoomPlugin } from "typed_janus_js";
import { config } from "./conf";
const janus = new JanusJs(config.meetecho);
await janus.init({ debug: false });
const session = await janus.createSession();
const publisher = await session.attach(JanusVideoRoomPlugin);
const subscriber = await session.attach(JanusVideoRoomPlugin);

const username = prompt("Enter your name: ");
await publisher.joinRoomAsPublisher(1234, { display: username });
await publisher.publishAsPublisher(
  await publisher.createOffer({ media: { audio: true, video: true } }),
  { bitrate: 2000000 }
);

publisher.onMessage.subscribe(async ({ jsep, message }) => {
  const result = message?.result;
  const event = result?.event;
  console.log(message, jsep);
  if (jsep) {
    publisher.handleRemoteJsep({ jsep });
  }
});
// console.log(await publisher.listParticipants(1234));
subscriber.onMessage.subscribe(async ({ jsep, message }) => {
  if (jsep) {
    publisher.handleRemoteJsep({ jsep });
  }
});

subscriber.onRemoteTrack.subscribe((track, on, mid) => {
  console.log({ track, on, mid });
});
