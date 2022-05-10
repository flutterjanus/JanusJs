import Janus, { AnswerParams, DetachOptions, JSEP, Message, OfferParams, PluginHandle, PluginMessage, WebRTCInfo } from "./interfaces/janus";
export declare class JanusPlugin implements PluginHandle {
    constructor(instance: Janus);
    protected instance: Janus;
    protected handle: PluginHandle;
    plugin: string;
    id: string;
    token?: string;
    detached: boolean;
    webrtcStuff: WebRTCInfo;
    consentDialog?: (on: boolean) => void;
    webrtcState?: (isConnected: boolean) => void;
    iceState?: (state: "connected" | "failed" | "disconnected" | "closed") => void;
    mediaState?: (medium: "audio" | "video", receiving: boolean, mid?: number) => void;
    onerror: (error: string) => void;
    ondataopen: () => void;
    slowLink?: (uplink: boolean, lost: number, mid: string) => void;
    onmessage?: (message: Message, jsep?: JSEP) => void;
    onlocaltrack?: (track: MediaStreamTrack, on: boolean) => void;
    onremotetrack?: (track: MediaStreamTrack, mid: string, on: boolean) => void;
    ondata?: (data: any) => void;
    oncleanup: () => void;
    ondetached: () => void;
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