import Janus, { PluginHandle, Controllers } from "../interfaces/janus";
import { JanusPlugin } from "../janus_plugin";
import { JanusSession } from "../janus_session";
export declare class JanusAudioBridgePlugin extends JanusPlugin {
    static identifier: string;
    constructor(instance: Janus, session: JanusSession, handle: PluginHandle, controllers: Controllers);
    boomCall(): void;
}
//# sourceMappingURL=audio_bridge.d.ts.map