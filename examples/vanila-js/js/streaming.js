import { JanusJs, JanusStreamingPlugin, JanusVideoCallPlugin } from "typed_janus_js";
import { config } from "./conf";

const janus = new JanusJs(config.meetecho);
await janus.init({ debug: false });
const session = await janus.createSession();
const publisher = await session.attach(JanusStreamingPlugin);
publisher.streamingTest();
