import Janus from "../janus-gateway/npm/janus";
import { ConstructorOptions, InitOptions } from "./interfaces/janus";
import { JanusSession } from "./janus_session";
import { Subject } from "rxjs";
export declare class JanusJs {
    protected instance: Janus;
    protected options: ConstructorOptions;
    static isWebrtcSupported(): boolean;
    static debug(...args: any[]): void;
    static log(...args: any[]): void;
    static warn(...args: any[]): void;
    static error(...args: any[]): void;
    static randomString(length: number): string;
    static attachMediaStream(element: HTMLMediaElement, stream: MediaStream): void;
    static reattachMediaStream(to: HTMLMediaElement, from: HTMLMediaElement): void;
    static stopAllTracks(stream: MediaStream): void;
    constructor(options: Omit<ConstructorOptions, "success" | "error" | "destroyed">);
    onDestroyed: () => void;
    init(params?: Omit<InitOptions, "callback">): Promise<void>;
    static mix(audioContext: AudioContext, streams: MediaStream[]): any;
    static playMediaStream(mediaStream: MediaStream): AudioContext;
    static createRecording(...mediaStreams: MediaStream[]): {
        mediaRecorder: MediaRecorder;
        recordingChunks: Subject<unknown>;
    };
    createSession(): Promise<JanusSession>;
}
//# sourceMappingURL=janus_js.d.ts.map