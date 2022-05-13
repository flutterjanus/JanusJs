import Janus from "../janus-gateway/npm/janus";
import { DestroyOptions, PluginOptions } from "./interfaces/janus";
import { JanusPlugin } from "./janus_plugin";
export declare class JanusSession {
    protected instance: Janus;
    constructor(instance: Janus);
    getServer(): string;
    isConnected(): boolean;
    getSessionId(): number;
    private getObservableControllers;
    attach(options: Pick<PluginOptions, "plugin" | "opaqueId">): Promise<JanusPlugin>;
    reconnect(): Promise<boolean>;
    getInfo(): Promise<any>;
    destroy(callbacks: Omit<DestroyOptions, "success" | "error">): Promise<void>;
}
//# sourceMappingURL=janus_session.d.ts.map