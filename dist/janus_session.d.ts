import Janus from '../js/janus';
import { DestroyOptions, PluginOptions } from './interfaces/janus';
import { JanusPlugin } from './janus_plugin';
export declare class JanusSession {
    protected instance: Janus;
    constructor(instance: Janus);
    getServer(): string;
    isConnected(): boolean;
    getSessionId(): number;
    private getObservableControllers;
    cast<T>(t: T): T;
    attach<T extends JanusPlugin>(classToCreate: new (...args: any) => T, options: Pick<PluginOptions, 'opaqueId'>): Promise<T>;
    reconnect(): Promise<boolean>;
    getInfo(): Promise<any>;
    destroy(callbacks: Omit<DestroyOptions, 'success' | 'error'>): Promise<void>;
}
//# sourceMappingURL=janus_session.d.ts.map