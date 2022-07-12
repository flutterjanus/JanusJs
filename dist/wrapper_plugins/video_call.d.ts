import Janus, { PluginHandle, Controllers } from "../interfaces/janus";
import { JanusPlugin } from "../janus_plugin";
import { JanusSession } from "../janus_session";
export declare class JanusVideoCallPlugin extends JanusPlugin {
    constructor(instance: Janus, session: JanusSession, handle: PluginHandle, controllers: Controllers);
    boomCall(): void;
}
//# sourceMappingURL=video_call.d.ts.map