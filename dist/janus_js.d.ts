import Janus from "../janus-gateway/npm/janus";
import { ConstructorOptions, InitOptions } from "./interfaces/janus";
import { JanusSession } from "./janus_session";
export declare class JanusJs {
    protected instance: Janus;
    protected options: ConstructorOptions;
    static helpers: typeof Janus;
    constructor(options: Omit<ConstructorOptions, "success" | "error" | "destroyed">);
    onDestroyed: () => void;
    init(params?: Omit<InitOptions, "callback">): Promise<void>;
    createSession(): Promise<JanusSession>;
}
//# sourceMappingURL=janus_js.d.ts.map