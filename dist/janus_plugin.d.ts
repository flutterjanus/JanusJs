import Janus, { AnswerParams, Controllers, DetachOptions, JSEP, OfferParams, PluginHandle, PluginMessage, WebRTCInfo } from "./interfaces/janus";
export declare class JanusPlugin implements PluginHandle {
    constructor(instance: Janus, controllers: Controllers);
    protected controllers: Controllers;
    protected instance: Janus;
    protected handle: PluginHandle;
    plugin: string;
    id: string;
    token?: string;
    detached: boolean;
    webrtcStuff: WebRTCInfo;
    get onMessage(): import("rxjs").Observable<{
        message: import("./interfaces/janus").Message;
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
    setNativeHandle(nativePluginHandle: PluginHandle): void;
    getId(): string;
    getPlugin(): string;
    send(message: Omit<PluginMessage, "success" | "error">): Promise<any>;
    createOffer(params: Omit<OfferParams, "success" | "error">): Promise<RTCSessionDescription>;
    createAnswer(params: Omit<AnswerParams, "success" | "error">): Promise<RTCSessionDescription>;
    handleRemoteJsep(params: {
        jsep: JSEP;
    }): void;
    dtmf(params: any): void;
    data(params: any): void;
    isAudioMuted(): boolean;
    muteAudio(): void;
    unmuteAudio(): void;
    isVideoMuted(): boolean;
    muteVideo(): void;
    unmuteVideo(): void;
    getBitrate(): string;
    hangup(sendRequest?: boolean): void;
    detach(params?: DetachOptions): void;
}
//# sourceMappingURL=janus_plugin.d.ts.map