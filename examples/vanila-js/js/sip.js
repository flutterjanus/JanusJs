import { JanusJs } from "typed_janus_js";
const register = async (
  plugin,
  server = "c2.pbx.commpeak.com",
  username = "204",
  password = "Ss1g8C1snGgCcMg5egkDOqmOTKxUaP"
) => {
  const payload = {
    request: "register",
    force_udp: true,
    sips: true,
    rfc2543_cancel: true,
    username: `sip:${username}@${server}`,
    secret: password,
    proxy: `sip:${server}`,
  };
  await plugin.send({ message: payload });
};
const call = async (plugin, uri) => {
  console.log("calling..");
  const payload = {
    request: "call",
    uri: uri,
  };
  const offer = await plugin.createOffer({
    media: {
      audioRecv: true,
      audioSend: true,
      videoRecv: false,
      videoSend: false,
    },
  });
  await plugin.send({ message: payload, jsep: offer });
};
async function test() {
  const a = new JanusJs({ server: "ws://127.0.0.1:8188" });
  await a.init({ debug: false });
  const session = await a.createSession();
  const plugin = await session.attach({ plugin: "janus.plugin.sip" });
  plugin.onRemoteTrack.subscribe((data) => {
    const stream = new MediaStream();
    stream.addTrack(data.track.clone());
    JanusJs.playMediaStream(stream);
  });
  plugin.onStatReports.subscribe((reports) => {
    console.log(reports);
  });

  plugin.onMessage.subscribe(async (data) => {
    console.log(data.message.result);
    const result = data.message.result;
    console.log(result);
    if (result.event === "registered") {
      // console.log(result);
      // await call(plugin, "sip:00918744849050@sip.theansr.com");
      await call(plugin, "sip:451001918744849050@c2.pbx.commpeak.com");
    }
    if (data.jsep) {
      plugin.handleRemoteJsep({ jsep: data.jsep });
    }
  });

  // await register(
  //   plugin,
  //   "sip.theansr.com",
  //   "test_janus",
  //   "+iBBfWDygkaF8P21tXkV"
  // );
  await register(
    plugin,
    "c2.pbx.commpeak.com",
    "204",
    "Ss1g8C1snGgCcMg5egkDOqmOTKxUaP"
  );
}
test();
