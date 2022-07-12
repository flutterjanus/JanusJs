import Janus, { PluginHandle, Controllers } from "../interfaces/janus";
import { JanusPlugin } from "../janus_plugin";
import { JanusSession } from "../janus_session";
export declare class JanusSipPlugin extends JanusPlugin {
    constructor(instance: Janus, session: JanusSession, handle: PluginHandle, controllers: Controllers);
    boomSip(): void;
}
//# sourceMappingURL=sip.d.ts.map