import Janus, { PluginHandle, Controllers } from "../interfaces/janus";
import { JanusPlugin } from "../janus_plugin";
import { JanusSession } from "../janus_session";
export declare class JanusStreamingPlugin extends JanusPlugin {
    constructor(instance: Janus, session: JanusSession, handle: PluginHandle, controllers: Controllers);
    streamingTest(): Promise<void>;
}
//# sourceMappingURL=streaming.d.ts.map