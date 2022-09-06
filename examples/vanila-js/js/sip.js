import { JanusJs, JanusSipPlugin } from "typed_janus_js";
import { config } from "./conf";
async function test() {
  const a = new JanusJs({ server: "ws://192.168.10.138:8188" });
  a.onDestroyed = () => {
    console.log("destroyed");
  };
  a.onError = (err) => {
    console.warn(err);
  };
  await a.init({ debug: false });
  const session = await a.createSession();

  const plugin = await session.attach(JanusSipPlugin);
  plugin.recording = true;
  const remoteStream = new MediaStream();
  plugin.onRemoteTrack.subscribe((data) => {
    remoteStream.addTrack(data.track.clone());
    JanusJs.playMediaStream(remoteStream);
  });
  // plugin.onStatReports.subscribe((reports) => {
  //   console.log(reports);
  // });

  plugin.onMessage.subscribe(async (data) => {
    console.log(data.message.result);
    const result = data.message.result;
    if (result.event === "hangup") {
      // plugin.record("stop");
      plugin.detach();
    }
    if (result.event === "registered") {
      plugin.call("sip:45100135794425460@c2.pbx.commpeak.com");
    }
    if (result.event === "accepted") {
      // plugin.record("start");
      // plugin.muteAudio();
    }
    if (data.jsep) {
      plugin.handleRemoteJsep({ jsep: data.jsep });
    }
  });

  plugin.register("204", "c2.pbx.commpeak.com", {
    secret: "Ss1g8C1snGgCcMg5egkDOqmOTKxUaP",
    sips: false,
  });
}

test();
