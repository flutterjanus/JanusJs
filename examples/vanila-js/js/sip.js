import { JanusJs, JanusSipPlugin } from "typed_janus_js";
import { config } from "./conf";
async function test() {
  const a = new JanusJs({ server: config.meetecho.server });
  await a.init({ debug: false });
  const session = await a.createSession();
  const plugin = await session.attach(JanusSipPlugin);
  plugin.onRemoteTrack.subscribe((data) => {
    const remoteStream = new MediaStream();
    remoteStream.addTrack(data.track.clone());
    JanusJs.playMediaStream(remoteStream);
  });
  plugin.onStatReports.subscribe((reports) => {
    // console.log(reports);
  });
  const audioChunks = [];
  plugin.onRecordingData.subscribe(({ blob, chunkNumber }) => {
    console.log(blob, chunkNumber);

    if (!blob) {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      audioChunks.push(blob);
    }
  });

  plugin.onMessage.subscribe(async (data) => {
    console.log(data.message.result);
    const result = data.message.result;
    if (result.event === "hangup") {
      plugin.detach();
    }
    if (result.event === "registered") {
      plugin.call("sip:00918744849050@sip.theansr.com");
      // await call(plugin, "encryptedUri-1-1-00");
    }
    if (result.event === "accepted") {
      // setTimeout(() => {
      //   plugin?.recorder?.stop();
      // }, 10000);
    }
    if (data.jsep) {
      plugin.handleRemoteJsep({ jsep: data.jsep });
    }
  });

  plugin.register("test_janus", "sip.theansr.com", {
    secret: "+iBBfWDygkaF8P21tXkV",
  });
}
test();
