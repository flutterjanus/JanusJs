import Janus, { AnswerParams, Controllers, DataParams, DetachOptions, JSEP, OfferParams, PluginHandle, PluginMessage, WebRTCInfo } from "./interfaces/janus";
import { JanusSession } from "./janus_session";
export declare class JanusPlugin implements PluginHandle {
    protected statsReportHookTimer: any;
    protected controllers: Controllers;
    protected instance: Janus;
    protected handle: PluginHandle;
    protected session: JanusSession;
    protected mediaRecorder: MediaRecorder;
    plugin: string;
    id: string;
    token?: string;
    detached: boolean;
    webrtcStuff: WebRTCInfo;
    recording: boolean;
    constructor(instance: Janus, session: JanusSession, handle: PluginHandle, controllers: Controllers);
    recordingTimeSlice?: number;
    protected handleRecordingSetup(controllers: Controllers): void;
    protected handleStatsHook(plugin: PluginHandle, controllers: Controllers, mediaStreamTrack?: MediaStreamTrack): number;
    get recorder(): MediaRecorder;
    get onRecordingData(): import("rxjs").Observable<{
        blob: Blob;
        chunkNumber: number;
    }>;
    get onStatReports(): import("rxjs").Observable<any[]>;
    get onMessage(): import("rxjs").Observable<{
        message: any;
        jsep: JSEP;
    }>;
    get onLocalTrack(): import("rxjs").Observable<{
        track: MediaStreamTrack;
        on: boolean;
    }>;
    get onData(): import("rxjs").Observable<any>;
    get onError(): import("rxjs").Observable<any>;
    get onRemoteTrack(): import("rxjs").Observable<{
        track: MediaStreamTrack;
        on: boolean;
        mid: string;
    }>;
    get onMediaState(): import("rxjs").Observable<{
        medium: "audio" | "video";
        recieving: boolean;
        mid: number;
    }>;
    get onSlowLink(): import("rxjs").Observable<{
        uplink: boolean;
        lost: number;
        mid: string;
    }>;
    get onWebRTCState(): import("rxjs").Observable<boolean>;
    get onIceState(): import("rxjs").Observable<"failed" | "closed" | "connected" | "disconnected">;
    get onDataOpen(): import("rxjs").Observable<void>;
    get onDetached(): import("rxjs").Observable<void>;
    get onCleanup(): import("rxjs").Observable<void>;
    getId(): string;
    getPlugin(): string;
    send(message: Omit<PluginMessage, "success" | "error">): Promise<any>;
    createOffer(params: Omit<OfferParams, "success" | "error">): Promise<RTCSessionDescription>;
    createAnswer(params: Omit<AnswerParams, "success" | "error">): Promise<RTCSessionDescription>;
    data(params: DataParams): Promise<void>;
    handleRemoteJsep(params: {
        jsep: JSEP;
    }): void;
    dtmf(params: any): void;
    setMaxBitrate(mid: string, bitrate: number): void;
    isAudioMuted(mid: string): boolean;
    muteAudio(mid: string): void;
    unmuteAudio(mid: string): void;
    isVideoMuted(mid: string): boolean;
    muteVideo(mid: string): void;
    unmuteVideo(mid: string): void;
    getBitrate(mid: string): string;
    getVolume(mid: string, result: any): void;
    getRemoteVolume(mid: string, result: any): void;
    getLocalVolume(mid: string, result: any): void;
    hangup(sendRequest?: boolean): void;
    detach(params?: DetachOptions): void;
    stopCollectingStats(): void;
}
export declare abstract class JanusPlugins {
    static VIDEO_ROOM: string;
    static VIDEO_CALL: string;
    static AUDIO_BRIDGE: string;
    static SIP: string;
    static STREAMING: string;
    static ECHO_TEST: string;
}
//# sourceMappingURL=janus_plugin.d.ts.map